var gulp = require('gulp')
  , VarStream = require('varstream')
  , Fs = require('fs')
  , Path = require('path')
  , Nunjucks = require('nunjucks')
  , express = require('express')
  , tinylr = require('tiny-lr')
  , rimraf = require('rimraf')
  , buildBranch = require('buildbranch')
  , Stream = require('stream')
  , StreamQueue = require('streamqueue')
  , Duplexer = require('plexer')
  , g = require('gulp-load-plugins')()
  , favicons = require('favicons')
  , rem2px = require('rework-rem2px')
  , queryless = require('css-queryless')
;

// Helper to wait for n gulp pipelines
function waitEnd(total, cb, n) {
  n = n || 0;
  return function end(debug) {
    debug && console.log(debug);
    ++n==total && cb();
  };
}

// Loading global options (files paths)
var conf = VarStream.parse(Fs.readFileSync(__dirname + '/config.dat'))
  , server
  , prod = !!g.util.env.prod
  , noreq = !!g.util.env.noreq
  , buffer = !g.util.env.stream
;

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
      'normalize': true
    }))
      .pipe(g.cond(g.util.env.hint,
        function() {
         var input = new Stream.PassThrough({objectMode: true});
          var ttfFilter = input.pipe(g.filter('*.ttf'));
          var output = ttfFilter.pipe(g.spawn({
            cmd: '/bin/sh',
            args: [
              '-c',
              'cat | ttfautohint /dev/stdin /dev/stdout | cat'
          ]})).pipe(ttfFilter.restore())
          // Seems that gulp-filter is not streams2 ready
          .pipe(new Stream.PassThrough({objectMode: true}));
          return new Duplexer({objectMode: true},
            input,
            output);
        }))
    .pipe(gulp.dest(conf.build.fonts))
    .once('end', cb);
});

// Images
gulp.task('build_images', function(cb) {
  var end = waitEnd(2, cb);
  gulp.src(conf.src.images + '/**/*.svg', {buffer: buffer})
    .pipe(g.cond(!prod, g.watch.bind(g, conf.src.images + '/**/*.svg')))
    .pipe(g.cond(prod, g.svgmin, function() {
      end();
      return g.livereload(server);
    }))
    .pipe(gulp.dest(conf.build.images))
    .once('end', end);

  new StreamQueue({objectMode: true},
    gulp.src(conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}', {buffer: buffer})
      .pipe(g.cond(!prod, g.watch.bind(g, conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}'))),
    gulp.src(conf.src.images + '/favicon.svg', {buffer: buffer})
      .pipe(g.cond(!prod, g.watch.bind(g, conf.src.images + '/favicon.svg')))
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
  ).pipe(g.cond(prod, function() {
      return g.streamify(g.imagemin());
    }, function() {
      end();
      return g.livereload(server);
    }))
    .pipe(gulp.dest(conf.build.images))
    .once('end', end);
});

// CSS
gulp.task('build_styles', function(cb) {

  gulp.src(conf.src.less + '/main.less', {buffer: buffer})
    .pipe(g.streamify((g.less())))
    .pipe(g.streamify((g.autoprefixer())))
    .pipe(g.cond(prod, g.minifyCss, g.livereload.bind(null, server)))
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
  var nunjucks = Nunjucks
    , tree = {}
    , markedFiles = []
    , dest = gulp.dest(conf.build.root)
  ;

  nunjucks.configure(conf.src.templates, {
    autoescape: true
  });

  var mdFilter = g.filter('**/*.md');

  var contentStream = gulp.src(conf.src.content + '/**/*.{html,md}', {buffer: buffer || true}) // Streams not supported yet
    .pipe(g.mdvars())
    .pipe(g.vartree({
      root: tree,
      index: 'index',
      parentProp: 'parent',
      childsProp: 'childs',
      sortProp: 'shortTitle',
      sortDesc: true
    }))
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
    .pipe(mdFilter.restore())
    .once('end', function() {
      var rootItems = {};
      // Registering languages sections
      tree.childs.forEach(function(item) {
        rootItems[item.lang] = item;
      });
      markedFiles.forEach(function(file) {
        var nunjucksOptions = {
          env: conf.build.root,
          prod: prod,
          tree: tree,
          conf: conf,
          root: rootItems[file.metas.lang],
          metadata: file.metas,
          content: file.contents.toString('utf-8')
        };
        // Render the template
        file.contents = Buffer(nunjucks.render(
          (nunjucksOptions.metadata.template || 'page') + '.tpl',
          nunjucksOptions
        ));
        // Save it.
        dest.write(file);
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
  if(!prod) {

    gulp.watch([
      conf.src.js + '/frontend/**/*.js',
      conf.src.js + '/frontend.js'
    ], ['build_js']);

    gulp.watch([conf.src.less + '/**/*.less'], ['build_styles']);

    gulp.watch([
      conf.src.content + '/**/*.md',
      conf.src.templates + '/**/*.tpl'
    ], ['build_html']);

    gulp.watch([conf.src.icons + '/**/*.svg'], ['build_fonts']);

    require('open')(conf.baseURL+'/index.html');

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
  var app = express();
  app.use(express.query())
    .use(express.static(Path.resolve(__dirname, conf.build.root)))
    .listen(8080, function() {
      g.util.log('Dev server listening on %d', 35729);
      cb();
    });
  server = tinylr();
  server.listen(35729);
});

// The default task
gulp.task('default', ['server', 'build'].slice(prod ? 1 : 0));

