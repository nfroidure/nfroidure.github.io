'use strict';

var Stream = require('stream');
var path = require('path');
var gutil = require('gulp-util');

// Utils
function noop(nop) { return nop; }

// Plugin function
function gulpPages(options) {
  var stream = new Stream.PassThrough({ objectMode: true });

  options = options || {};
  options.cwd = options.cwd || process.cwd();
  options.prop = options.prop || 'metadata';
  options.childsProp = options.childsProp || 'childs';
  options.limit = options.limit || 50;
  options.metadataCloner = options.metadataCloner || noop;

  stream._transform = function gulpPagesTransform(file, unused, cb) {
    var curFile = file;
    var previousFile;
    var childs;
    var page = 1;

    if(
      (!file[options.prop].paginate) ||
      (!file[options.prop]) ||
      (!file[options.prop][options.childsProp]) ||
      (!file[options.prop][options.childsProp].length) ||
      file[options.prop][options.childsProp].length <= options.limit
    ) {
      return cb(null, file);
    }
    childs = file[options.prop][options.childsProp].slice(0);
    do {
      if(!curFile) {
        curFile = new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: file.path.substr(0, file.path.length - path.extname(file.path).length) +
            (1 !== page ? '-' + page : '') + path.extname(file.path),
          contents: file.contents,
        });
        curFile[options.prop] = (options.metadataCloner)(file[options.prop], page, file);
      }
      curFile[options.prop][options.parentProp] = file[options.prop];
      curFile[options.prop][options.childsProp] = childs.slice(0, options.limit);
      curFile[options.prop].page = page;
      childs = childs.slice(options.limit);
      if(previousFile) { // Warning! Doesn't work for the last file!
        previousFile[options.prop].nextFile = curFile;
        curFile[options.prop].previousFile = previousFile;
      }
      stream.push(curFile);
      previousFile = curFile;
      curFile = null;
      page++;
    } while(childs.length > options.limit);
    return cb();
  };

  return stream;

}

// Export the plugin main function
module.exports = gulpPages;
