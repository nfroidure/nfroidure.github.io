'use strict';

var Fs = require('fs');
var Path = require('path');

var Nunjucks = require('nunjucks');
var Moment = require('moment');

var express = require('express');
var rimraf = require('rimraf');
var args = require('yargs').argv;
var internalIp = require('internal-ip');

var buildBranch = require('buildbranch');
var favicons = require('favicons');

var VarStream = require('varstream');

var Stream = require('stream');
var CombineStream = require('combine-stream');
var Duplexer = require('plexer');
var filter = require('streamfilter');

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var gulpPages = require('./gulp/gulp-pages');

var rem2px = require('rework-rem2px');
var queryless = require('css-queryless');

var browserify = require('browserify');

// Loading global options (files paths)
var conf = VarStream.parse(Fs.readFileSync(__dirname + '/config.dat'));

// Reading args options
var prod = !!args.prod;
var lr = (!args.nolr) && !prod;
var watch = (!args.nowatch) && !prod;
var buffer = !args.stream;
var browser = (!args.nobro) && !prod;
var httpServer = (!args.nosrv) && !prod;
var port = 33222;

if(!prod) {
  // Finding the server IP
  conf.ip = internalIp();
  conf.baseURL = 'http://' + conf.ip + ':' + port;
}
// Configure nunjuncks
Nunjucks.configure(conf.src.templates, {
  watch: watch,
  autoescape: true,
}).addFilter('date', function(date, lang) {
  return Moment(date).locale(lang).format('LLLL');
});

// Fonts
gulp.task('build_fonts', function() {
  return gulp.src(conf.src.icons + '/**/*.svg', { buffer: buffer })
    .pipe(g.iconfont({
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      fontName: 'iconsfont',
      appendUnicode: true,
      fontHeight: 90,
      normalize: true,
      hint: !!g.util.env.hint,
    }))
    .pipe(gulp.dest(conf.build.fonts));
});

// Images
gulp.task('build_images', function() {

  var stream = new CombineStream([
    gulp.src(conf.src.images + '/**/*.svg', { buffer: buffer })
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/**/*.svg')))
      .pipe(g.cond(prod, g.svgmin)),
    gulp.src(conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}', { buffer: buffer })
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}'))),
    gulp.src(conf.src.images + '/favicon.svg', { buffer: buffer })
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/favicon.svg')))
      // https://groups.google.com/forum/#!topic/nodejs/SxNKLclbM5k
      .pipe(g.spawn({
        cmd: '/bin/sh',
        args: [
          '-c',
          'cat |  convert -background none -resize 32x32 svg:/dev/stdin png:/dev/stdout | cat',
        ],
        filename: function() {
          return 'favicon.png';
        },
    })),
  ])
    .pipe(g.cond(prod, g.streamify.bind(null, g.imagemin)))
    .pipe(g.cond(lr, g.livereload))
    .pipe(gulp.dest(conf.build.images));

  if(prod) {
    return stream;
  }
});

// CSS
gulp.task('build_styles', function() {
  return gulp.src(conf.src.less + '/main.less', { buffer: buffer })
    .pipe(g.streamify((g.less)))
    .pipe(g.streamify((g.autoprefixer)))
    .pipe(g.cond(prod, g.minifyCss))
    .pipe(g.cond(lr, g.livereload))
    .pipe(gulp.dest(conf.build.css));
});

// JavaScript
gulp.task('build_scripts', function(cb) {
  browserify(conf.src.scripts + '/index.js')
    .once('end', cb);
});

// HTML
gulp.task('build_html', function(cb) {
  var tree = {};
  var markedFiles = [];
  var dest = gulp.dest(conf.build.root);
  var mdFilter;
  var draftFilter;
  var ghostFilter;
  var redirects;
  var redirectsFilter;
  var contentStream;

  // Setting copyright end
  conf.build.created = (new Date()).toISOString();
  conf.copyright.end = (new Date()).getFullYear();

  if(lr) {
    dest.pipe(g.livereload());
  }

  mdFilter = filter(function(file, enc, cb2) {
    cb2(file.path.indexOf('.md') === file.path.length - 4);
  }, { objectMode: true, restore: true, passtrough: true });

  draftFilter = filter(function(file, enc, cb2) {
    cb2(file.metadata.draft);
  }, { objectMode: true, restore: false, passtrough: true });

  ghostFilter = filter(function(file, enc, cb2) {
    cb2(file.metadata.ghost);
  }, { objectMode: true, restore: true, passtrough: true });

  redirects = g.clone.sink();
  redirectsFilter = filter(function(file, enc, cb2) {
    // filter blog posts only and before 2015 and add their old name
    // to make dumb redirects.
    if(
      prod && file.metadata.disqus && file.metadata.published &&
      (new Date(file.metadata.published)).getTime() < (new Date('2015-01-01')).getTime()
    ) {
      file.path = file.base + ('fr' === file.metadata.lang ? 'articles' : 'blog') +
        '-' + file.metadata.name + '.html';
      return cb2(false);
    }
    cb2(true);
  }, { objectMode: true });

  contentStream = gulp.src(
    conf.src.content + '/**/*.{html,md}',
    { buffer: buffer || true } // Streams not supported yet
  )
    .pipe(g.mdvars({
      prop: 'metadata',
    }))
    .pipe(draftFilter)
    .pipe(ghostFilter)
    .pipe(g.vartree({
      root: tree,
      index: 'index',
      prop: 'metadata',
      parentProp: 'parent',
      childsProp: 'childs',
      sortProp: 'published',
      sortDesc: true,
    }))
    .pipe(gulpPages({
      limit: 10,
      prop: 'metadata',
      parentProp: 'parent',
      metadataCloner: function(metadata, page) {
        return {
          title: metadata.title + (1 < page ? ' - ' + page : ''),
          description: metadata.description,
          shortTitle: metadata.shortTitle,
          shortDesc: metadata.shortDesc,
          keywords: metadata.keywords,
          template: metadata.template,
          lang: metadata.lang,
          location: metadata.location,
          types: metadata.types,
          empty: metadata.empty,
          published: metadata.published,
          published_on: metadata.published_on,
          name: metadata.name + (1 !== page ? '-' + page : ''),
          path: metadata.path,
          ext: metadata.ext,
          href: metadata.href,
          nextTitle: metadata.nextTitle,
          nextDesc: metadata.nextDesc,
          previousTitle: metadata.previousTitle,
          previousDesc: metadata.previousDesc,
        };
      },
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
      smartypants: true,
    }))
    .pipe(g.rename({ extname: '.html' }))
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
        (file.metadata.types || ['html']).forEach(function(type, i) {
          var curFile = file;
          var nunjucksOptions;

          if(0 < i) {
            curFile = file.clone();
          }
          if('html' !== type) {
            curFile.path = curFile.path.substr(0, curFile.path.length - 4) + type;
          }
          nunjucksOptions = {
            env: conf.build.root,
            prod: prod,
            tree: tree,
            conf: conf,
            type: type,
            root: rootItems[curFile.metadata.lang],
            metadata: curFile.metadata,
            content: curFile.contents.toString('utf-8'),
          };
          // Render the template
          curFile.contents = new Buffer(Nunjucks.render(
            type + '/' + (nunjucksOptions.metadata.template || 'page') + '.tpl',
            nunjucksOptions
          ));
          // Save it.
          dest.write(curFile);
          // Still hacky stuffs for old endpoints
          if('html' !== type) {
            curFile = curFile.clone();
            curFile.path = curFile.base + ('fr' === curFile.metadata.lang ? 'articles' : 'blog') +
              '.' + type;
            // Save it.
            dest.write(curFile);
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
gulp.task('clean', function() {
  rimraf.sync(conf.build.root);
});

// The build task
gulp.task('build', [
  'clean', 'build_fonts', 'build_images', 'build_styles', 'build_html',
], function(cb) {

  // Robots.txt
  Fs.writeFileSync(conf.build.root + '/robots.txt', 'User-agent: *\r\nAllow: /\r\n');

  // Files watch
  if(watch) {

    gulp.watch([
      conf.src.js + '/frontend/**/*.js',
      conf.src.js + '/frontend.js',
    ], ['build_js']);

    gulp.watch([conf.src.less + '/**/*.less'], ['build_styles']);

    gulp.watch([
      conf.src.content + '/**/*',
      conf.src.templates + '/**/*.tpl',
    ], ['build_html']);

    gulp.watch([conf.src.icons + '/**/*.svg'], ['build_fonts']);

  }

  // Livereload
  if(lr) {
    console.log('Starting livereload.');
    g.livereload.listen({
      basePath: conf.build.root,
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
    domain: conf.domain,
  }, function(err) {
    if(err) {
      throw err;
    }
    cb();
  });

});

// Publish
gulp.task('publish', ['ghpages']);

// Dev env
gulp.task('server', function(cb) {
  var app;

  // Starting the dev static server
  if(httpServer) {
    app = express();

    app.use(express.query())
      .use(express.static(Path.resolve(__dirname, conf.build.root)))
      .listen(port, function() {
        g.util.log('Dev server listening on %d', port);
        cb();
      });
  }
});

// The default task
gulp.task('default', ['server', 'build'].slice(prod ? 1 : 0));
