'use strict';

const Stream = require('stream');
const gutil = require('gulp-util');
const path = require('path');
const htmlToText = require('html-to-text');

const asttpl = require('asttpl');
const template = `
const lunr = require('lunr');
const documents = {
  𐅙repeat𐅙documents𐅞𐅅𐅙id: JSON.parse(𐅙literal𐅙contents)
};
const index = lunr(function() {
  this.field('title', {boost: 10});
  this.field('description', {boost: 5});
  this.field('shortTitle', {boost: 7});
  this.field('shortDesc');
  this.field('body');
  this.ref('id');

  Object.keys(documents).forEach((id) => {
    const document = documents[id];
    this.add({
      id: id,
      path: document.path,
      title: document.title,
      description: document.description,
      shortTitle: document.shortTitle,
      shortDesc: document.shortDesc,
      contents: document.contents,
    });
  });
});

module.exports = { search: index.search.bind(index), documents };
`;

function gulpSearchIndex(options) {
  const stream = new Stream.Duplex({ objectMode: true });
  const documents = [];
  let file = null;

  options = options || {};
  options.cwd = options.cwd || process.cwd();
  options.prop = options.prop || 'metadata';
  options.childsProp = options.childsProp || 'childs';
  options.base = options.base || '';
  options.folder = options.folder || '';
  options.name = options.name || 'search.index.js';

  stream._write = function gulpPagesWrite(file, unused, cb) {
    documents.push({
      id: 'doc' + documents.length,
      contents: JSON.stringify({
        path: path.relative(options.cwd, file.path),
        title: file.metadata.title,
        description: file.metadata.description,
        shortTitle: file.metadata.shortTitle,
        shortDesc: file.metadata.shortDesc,
        contents: htmlToText.fromString(file.contents.toString('utf-8')),
      }),
    });
    cb();
  };

  stream._read = function gulpRenderRead() {
    if (file) {
      stream.push(file);
      stream.push(null);
      file = null;
    }
  };

  stream.on('finish', function gulpRenderFinish() {
    file = new gutil.File({
      cwd: options.cwd,
      base: options.base,
      path: path.join(options.base, options.folder, options.name),
      contents: new Buffer(asttpl({}, template, [{ documents }])),
    });
    documents.length = 0;
    stream._read();
  });

  return stream;
}

module.exports = gulpSearchIndex;
