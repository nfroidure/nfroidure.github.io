'use strict';

var Stream = require('stream');
var Nunjucks = require('nunjucks');

// Utils
function noop(nop) { return nop; }

// Plugin function
function gulpRender(options) {
  var stream = new Stream.Duplex({ objectMode: true });
  var inputFilesBuffer = [];
  var outputFilesBuffer = [];
  var finished = false;

  options = options || {};
  options.cwd = options.cwd || process.cwd();
  options.prop = options.prop || 'metadata';
  options.childsProp = options.childsProp || 'childs';
  options.limit = options.limit || 50;
  options.metadataCloner = options.metadataCloner || noop;

  stream._write = function gulpPagesWrite(file, unused, cb) {
    inputFilesBuffer.push(file);
    cb();
  };


  stream._read = function gulpRenderRead() {
    var file;

    if(finished) {
      while(outputFilesBuffer.length) {
        file = outputFilesBuffer.shift();
        if(!stream.push(file)) {
          break;
        }
      }
      if(0 === outputFilesBuffer.length) {
        stream.push(null);
      }
    }
  };

  stream.on('end', function gulpRenderEnd() {
    console.log('RENDER END');
    outputFilesBuffer.length = 0;
  });

  stream.on('finish', function gulpRenderFinish() {
    var rootItems = {};

    console.log('RENDER FINISH');
    finished = true;

    // Registering languages sections
    options.tree.childs.forEach(function(item) {
      rootItems[item.lang] = item;
    });

    inputFilesBuffer.forEach(function(file) {
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
          env: options.env,
          prod: options.prod,
          tree: options.tree,
          conf: options.conf,
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
        outputFilesBuffer.push(curFile);
        // Still hacky stuffs for old endpoints
        if('html' !== type) {
          curFile = curFile.clone();
          curFile.path = curFile.base + ('fr' === curFile.metadata.lang ? 'articles' : 'blog') +
            '.' + type;
          // Save it.
          outputFilesBuffer.push(curFile);
        }
      });
    });
    stream._read();
  });

  return stream;

}

// Export the plugin main function
module.exports = gulpRender;
