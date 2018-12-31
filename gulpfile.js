'use strict';

var fs = require('fs');
var path = require('path');
var babel = require('@babel/core');

var Nunjucks = require('nunjucks');
var moment = require('moment');

var express = require('express');
var rimraf = require('rimraf');
var args = require('yargs').argv;
var internalIp = require('internal-ip').v4.sync;

var buildBranch = require('buildbranch');

var Transform = require('stream').Transform;
var VarStream = require('varstream');

var CombineStream = require('combine-stream');
var filter = require('streamfilter');

var gulp = require('gulp');
var gutil = require('gulp-util');
var g = require('gulp-load-plugins')();
var gulpPages = require('./gulp/gulp-pages');
var gulpRender = require('./gulp/gulp-render');
var gulpSearchIndex = require('./gulp/gulp-searchIndex');

var browserify = require('browserify');

// Loading global options (files paths)
var conf = VarStream.parse(fs.readFileSync(path.join(__dirname, 'config.dat')));

// Reading args options
var prod = !!args.prod;
var lr = !args.nolr && !prod;
var watch = !args.nowatch && !prod;
var buffer = !args.stream;
var browser = !args.nobro && !prod;
var httpServer = !args.nosrv && !prod;
var port = 33222;
let searchIndexStream = null;

if (!prod) {
  // Finding the server IP
  conf.ip = internalIp();
  conf.baseURL = 'http://' + conf.ip + ':' + port;
}
// Configure nunjuncks
Nunjucks.configure(conf.src.templates, {
  watch: watch,
  autoescape: true,
}).addFilter('date', function(date, lang) {
  return moment(date)
    .locale(lang)
    .format('LLLL');
});

// Fonts
gulp.task('build_fonts', () =>
  gulp
    .src(conf.src.icons + '/**/*.svg', { buffer: buffer })
    .pipe(
      g.iconfont({
        formats: ['ttf', 'eot', 'woff', 'woff2'],
        fontName: 'iconsfont',
        appendUnicode: true,
        fontHeight: 90,
        normalize: true,
        hint: !!g.util.env.hint,
      })
    )
    .pipe(gulp.dest(conf.build.fonts))
);

// Images
gulp.task('build_images', () => {
  var stream = new CombineStream([
    gulp
      .src(conf.src.images + '/**/*.svg', { buffer: buffer })
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/**/*.svg')))
      .pipe(g.cond(prod, g.svgmin)),
    gulp
      .src(conf.src.illustrations + '/**/*.svg', { buffer: buffer })
      .pipe(
        g.cond(watch, g.watch.bind(g, conf.src.illustrations + '/**/*.svg'))
      )
      .pipe(g.cond(prod, g.svgmin)),
    gulp
      .src(conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}', {
        buffer: buffer,
      })
      .pipe(
        g.cond(
          watch,
          g.watch.bind(g, conf.src.illustrations + '/**/*.{png,jpg,jpeg,gif}')
        )
      ),
    gulp
      .src(conf.src.images + '/favicon.svg', { buffer: buffer })
      .pipe(g.cond(watch, g.watch.bind(g, conf.src.images + '/favicon.svg')))
      // https://groups.google.com/forum/#!topic/nodejs/SxNKLclbM5k
      .pipe(
        g.spawn({
          cmd: '/bin/sh',
          args: [
            '-c',
            'cat |  convert -background none -resize 32x32 svg:/dev/stdin png:/dev/stdout | cat',
          ],
          filename: () => 'favicon.png',
        })
      ),
  ])
    .pipe(g.cond(prod, g.streamify.bind(null, g.imagemin)))
    .pipe(g.cond(lr, g.livereload))
    .pipe(gulp.dest(conf.build.images));

  if (prod) {
    return stream;
  }
  return null;
});

// CSS
gulp.task('build_styles', () =>
  gulp
    .src(conf.src.less + '/main.less', { buffer: buffer })
    .pipe(g.streamify(g.less))
    .pipe(g.streamify(g.autoprefixer))
    .pipe(g.cond(prod, g.minifyCss))
    .pipe(g.cond(lr, g.livereload))
    .pipe(gulp.dest(conf.build.css))
);

// JavaScript
gulp.task('build_js', ['build_html'], cb => {
  new CombineStream([searchIndexStream, gulp.src(conf.src.js + '/*.js')])
    .pipe(
      new Transform({
        objectMode: true,
        transform: (file, unused, cb) => {
          file.contents = new Buffer(
            babel.transform(file.contents, {
              filename: file.path,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: '> 0.25%, not dead',
                  },
                ],
              ],
            }).code
          );
          cb(null, file);
        },
      })
    )
    .pipe(gulp.dest(conf.build.js))
    .on('finish', () => {
      var dest = gulp.dest(conf.build.js).on('finish', cb);
      dest.write(
        new gutil.File({
          path: 'bundle.js',
          contents: browserify(conf.build.js + '/index.js', {
            debug: true,
            standalone: 'searchIndex',
          }).bundle(),
        })
      );
      dest.end();
    });
});

// HTML
gulp.task('build_html', () => {
  var tree = {};
  var mdFilter;
  var draftFilter;
  var ghostFilter;
  var redirects;
  var redirectsFilter;

  // Setting copyright end
  conf.build.created = new Date().toISOString();
  conf.copyright.end = new Date().getFullYear();

  mdFilter = filter(
    function(file, enc, cb2) {
      cb2(file.path.indexOf('.md') === file.path.length - 4);
    },
    { objectMode: true, restore: true, passthrough: true }
  );

  draftFilter = filter(
    function(file, enc, cb2) {
      cb2(file.metadata.draft);
    },
    { objectMode: true, restore: false, passthrough: true }
  );

  ghostFilter = filter(
    function(file, enc, cb2) {
      cb2(file.metadata.ghost);
    },
    { objectMode: true, restore: true, passthrough: true }
  );

  redirects = g.clone.sink();
  redirectsFilter = filter(
    function(file, enc, cb2) {
      // filter blog posts only and before 2015 and add their old name
      // to make dumb redirects.
      if (
        prod &&
        file.metadata.disqus &&
        file.metadata.published &&
        new Date(file.metadata.published).getTime() <
          new Date('2015-01-01').getTime()
      ) {
        file.path =
          file.base +
          ('fr' === file.metadata.lang ? 'articles' : 'blog') +
          '-' +
          file.metadata.name +
          '.html';
        return cb2(false);
      }
      cb2(true);
    },
    { objectMode: true }
  );
  let contentsStream = gulp
    .src(
      conf.src.content + '/**/*.{html,md}',
      { buffer: buffer || true } // Streams not supported yet
    )
    .pipe(
      g.mdvars({
        prop: 'metadata',
      })
    )
    .pipe(draftFilter)
    .pipe(ghostFilter)
    .pipe(
      g.vartree({
        root: tree,
        index: 'index',
        prop: 'metadata',
        parentProp: 'parent',
        childsProp: 'childs',
        sortProp: 'published',
        sortDesc: true,
      })
    )
    .pipe(
      gulpPages({
        limit: 20,
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
      })
    )
    .pipe(ghostFilter.restore)
    .pipe(mdFilter)
    .pipe(
      g.marked({
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: true,
      })
    )
    .pipe(g.rename({ extname: '.html' }))
    .pipe(mdFilter.restore)
    .pipe(redirects)
    .pipe(redirectsFilter)
    .pipe(redirects.tap())
    .pipe(
      gulpRender({
        tree: tree,
        env: conf.build.root,
        prod: prod,
        conf: conf,
      })
    );
  searchIndexStream = contentsStream.pipe(gulpSearchIndex({}));
  return contentsStream
    .pipe(gulp.dest(conf.build.root))
    .pipe(g.cond(lr, g.livereload));
});

// The clean task
gulp.task('clean', () => {
  rimraf.sync(conf.build.root);
});

// The build task
gulp.task(
  'build',
  ['clean', 'build_fonts', 'build_images', 'build_styles', 'build_js'],
  function(cb) {
    // Robots.txt
    fs.writeFileSync(
      conf.build.root + '/robots.txt',
      'User-agent: *\r\nAllow: /\r\n'
    );

    // Files watch
    if (watch) {
      gulp.watch([conf.src.less + '/**/*.less'], ['build_styles']);

      gulp.watch(
        [
          conf.src.content + '/**/*',
          conf.src.templates + '/**/*.tpl',
          conf.src.js + '/src/**/*.js',
          conf.src.js + '/src.js',
        ],
        ['build_js']
      );

      gulp.watch([conf.src.icons + '/**/*.svg'], ['build_fonts']);
    }

    // Livereload
    if (lr) {
      gutil.log('Starting livereload.');
      g.livereload.listen({
        basepath: conf.build.root,
      });
    }

    // Open the browser
    if (browser) {
      require('open')(conf.baseURL + '/index.html');
    }

    cb();
  }
);

// Publish task
gulp.task('ghpages', function(cb) {
  buildBranch(
    {
      ignore: ['.git', '.token', 'www', 'node_modules'],
      domain: conf.domain,
      noVerify: true,
    },
    function(err) {
      if (err) {
        throw err;
      }
      cb();
    }
  );
});

// Publish
gulp.task('publish', ['ghpages']);

// Dev env
gulp.task('server', function(cb) {
  var app;

  // Starting the dev static server
  if (httpServer) {
    app = express();

    app
      .use(express.query())
      .use(express.static(path.resolve(__dirname, conf.build.root)))
      .listen(port, () => {
        g.util.log('Dev server listening on %d', port);
        cb();
      });
  }
});

// The default task
gulp.task('default', ['server', 'build'].slice(prod ? 1 : 0));
