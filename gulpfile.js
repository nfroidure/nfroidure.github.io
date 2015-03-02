var Fs = require('fs');
var Path = require('path');

var Nunjucks = require('nunjucks');
var express = require('express');
var rimraf = require('rimraf');
var args = require('yargs').argv;

var buildBranch = require('buildbranch');
var favicons = require('favicons');

var VarStream = require('varstream');

var Stream = require('stream');
var StreamQueue = require('streamqueue');
var Duplexer = require('plexer');
var filter = require('streamfilter');

var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var rem2px = require('rework-rem2px');
var queryless = require('css-queryless');

// Helper to wait for n gulp pipelines
function waitEnd(total, cb, n) {
  n = n || 0;
  return function end(debug) {
    debug && console.log(debug);
    ++n==total && cb();
  };
}

// Loading global options (files paths)
var conf = VarStream.parse(Fs.readFileSync(__dirname + '/config.dat'));

// Reading args options
var prod = !!args.prod;
var lr = (!args.nolr) && !prod;
var watch = (!args.nowatch) && !prod;
var buffer = !args.stream;
var browser = (!args.nobro) && !prod;
var httpServer = (!args.nosrv) && !prod;

if(!prod) {
  // Finding the server IP
  conf.ip = '127.0.0.1';

  if(g.util.env.net) {
    var ints = require('os').getNetworkInterfaces();

    Object.keys(ints).some(function(int) {
      if(ints[int].some(function(net) {
        if((!net.internal) && 'IPv4' == net.family) {
          conf.ip = net.address;
          return true;
        }
      })) {
        return true;
      }
    });
  }
  conf.baseURL = 'http://'+conf.ip+':8080';
}


// Fonts
gulp.task('build_fonts', function(cb) {
  gulp.src(conf.src.icons + '/**/*.svg', {buffer: buffer})
    .pipe(g.iconfont({
      'fontName': 'iconsfont',
      'appendCodepoints': true,
      'fontHeight': 90,
      'normalize': true,
      'hint': !!g.util.env.hint
    }))
    .pipe(gulp.dest(conf.build.fonts))
    .once('end', cb);
});

// Images
gulp.task('build_images', function(cb) {
  var end = waitEnd(2, cb);
  gulp.src(conf.src.images + '/**/*.svg', {buffer: buffer})
    .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/**/*.svg')))
    .pipe(g.cond(prod, g.svgmin, function() {
      end();
      return g.livereload();
    }))
    .pipe(gulp.dest(conf.build.images))
    .once('end', end);

  new StreamQueue({objectMode: true},
    gulp.src(conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}', {buffer: buffer})
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}'))),
    gulp.src(conf.src.images + '/favicon.svg', {buffer: buffer})
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/favicon.svg')))
      // https://groups.google.com/forum/#!topic/nodejs/SxNKLclbM5k
      .pipe(g.spawn({
        cmd: '/bin/sh',
        args: [
          '-c',
          'cat |  convert -background none -resize 32x32 svg:/dev/stdin png:/dev/stdout | cat'
        ],
        filename: function(base, ext) {
          return 'favicon.png';
        }
    }))
  )
    .pipe(g.cond(prod, g.streamify.bind(null, g.imagemin)))
    .pipe(g.cond(lr, function() {
      end();
      return g.livereload();
    }))
    .pipe(gulp.dest(conf.build.images))
    .once('end', end);
});

// CSS
gulp.task('build_styles', function(cb) {

  gulp.src(conf.src.less + '/main.less', {buffer: buffer})
    .pipe(g.streamify((g.less())))
    .pipe(g.streamify((g.autoprefixer())))
    .pipe(g.cond(prod, g.minifyCss, g.livereload))
    .pipe(gulp.dest(conf.build.css))
    .once('end', cb);
});

// JavaScript
gulp.task('build_scripts', function(cb) {

  browserify(conf.src.scripts + '/index.js')
    .once('end', cb);
});

// HTML
gulp.task('build_html', function(cb) {
  var nunjucks = Nunjucks;
  var tree = {};
  var markedFiles = [];
  var dest = gulp.dest(conf.build.root);

  // Setting copyright end
  conf.build.created = (new Date()).toISOString();
  conf.copyright.end = (new Date()).getFullYear();

  if(watch) {
    dest.pipe(g.livereload());
  }

  nunjucks.configure(conf.src.templates, {
    autoescape: true
  });

  var mdFilter = filter(function(file, enc, cb) {
    cb(file.path.indexOf('.md') === file.path.length - 4);
  }, {objectMode: true, restore: true, passtrough: true});

  var draftFilter = filter(function(file, enc, cb) {
    cb(file.metas.draft);
  }, {objectMode: true, restore: false, passtrough: true});

  var ghostFilter = filter(function(file, enc, cb) {
    cb(file.metas.ghost);
  }, {objectMode: true, restore: true, passtrough: true});

  var redirects = g.clone.sink();
  var redirectsFilter = filter(function(file, enc, cb) {
    // filter blog posts only and before 2015 and add their old name
    // to make dumb redirects.
    if(
      prod && file.metas.disqus && file.metas.published &&
      (new Date(file.metas.published)).getTime() < (new Date('2015-01-01')).getTime()
    ) {
      file.path = file.base + ('fr' === file.metas.lang ? 'articles' : 'blog') +
        '-' + file.metas.name + '.html';
      return cb(false);
    }
    cb(true);
  }, {objectMode: true});

  var contentStream = gulp.src(conf.src.content + '/**/*.{html,md}', {buffer: buffer || true}) // Streams not supported yet
    .pipe(g.mdvars())
    .pipe(draftFilter)
    .pipe(ghostFilter)
    .pipe(g.vartree({
      root: tree,
      index: 'index',
      parentProp: 'parent',
      childsProp: 'childs',
      sortProp: 'published',
      sortDesc: true
    }))
    .pipe(ghostFilter.restore)
    .pipe(mdFilter)
    .pipe(g.marked({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: true
    }))
    .pipe(g.rename({extname: '.html'}))
    .pipe(mdFilter.restore)
    .pipe(redirects)
    .pipe(redirectsFilter)
    .pipe(redirects.tap())
    .once('end', function() {
      var rootItems = {};
      // Registering languages sections
      tree.childs.forEach(function(item) {
        rootItems[item.lang] = item;
      });
      markedFiles.forEach(function(file) {
        (file.metas.types || ['html']).forEach(function(type, i, types) {
          if(i > 0) {
            file = file.clone();
          }
          if('html' !== type) {
            file.path = file.path.substr(0, file.path.length - 4) + type;
          }
          var nunjucksOptions = {
            env: conf.build.root,
            prod: prod,
            tree: tree,
            conf: conf,
            type: type,
            root: rootItems[file.metas.lang],
            metadata: file.metas,
            content: file.contents.toString('utf-8')
          };
          // Render the template
          file.contents = Buffer(nunjucks.render(
            type + '/' + (nunjucksOptions.metadata.template || 'page') + '.tpl',
            nunjucksOptions
          ));
          // Save it.
          dest.write(file);
          // Still hacky stuffs for old endpoints
          if('html' !== type) {
            file = file.clone();
            file.path = file.base + ('fr' === file.metas.lang ? 'articles' : 'blog') +
              '.' + type;
            // Save it.
            dest.write(file);
          }
        });
      });
      dest.end();
      cb();
    })
    .on('readable', function() {
      var file;
      while(file = contentStream.read()) {
        markedFiles.push(file);
      }
    });
});

// The clean task
gulp.task('clean', function(cb) {
  rimraf.sync(conf.build.root);
  cb();
});

// The build task
gulp.task('build', ['clean', 'build_fonts', 'build_images', 'build_styles',
  'build_html'], function(cb) {

  // Files watch
  if(watch) {

    gulp.watch([
      conf.src.js + '/frontend/**/*.js',
      conf.src.js + '/frontend.js'
    ], ['build_js']);

    gulp.watch([conf.src.less + '/**/*.less'], ['build_styles']);

    gulp.watch([
      conf.src.content + '/**/*',
      conf.src.templates + '/**/*.tpl'
    ], ['build_html']);

    gulp.watch([conf.src.icons + '/**/*.svg'], ['build_fonts']);

  }

  // Livereload
  if(lr) {
    console.log('Starting livereload.')
    g.livereload.listen({
      basePath: conf.build.root
    });
  }

  // Open the browser
  if(browser) {
    require('open')(conf.baseURL + '/index.html');
  }

  cb();
});

// Publish task
gulp.task('ghpages', function(cb) {

  buildBranch({
    ignore: ['.git', '.token', 'www', 'node_modules'],
    domain: conf.domain
  }, function(err) {
    if(err) {
      throw err;
    }
    cb();
  });

});

// Publish task : Cannot build before since gulp.dest doesn't ensure
// underlying resources are closed https://github.com/wearefractal/vinyl-fs/issues/7
gulp.task('ensureprod', function() {
  prod = true;
});
gulp.task('publish', ['ensureprod', 'ghpages']);

// Dev env
gulp.task('server', function(cb) {
  // Starting the dev static server
  if(httpServer) {
    var app = express();
    app.use(express.query())
      .use(express.static(Path.resolve(__dirname, conf.build.root)))
      .listen(8080, function() {
        g.util.log('Dev server listening on %d', 35729);
        cb();
      });
  }
});

// The default task
gulp.task('default', ['server', 'build'].slice(prod ? 1 : 0));
