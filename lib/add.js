'use strict';

var run7z = require('../util/run7z');
var path  = require('path');

/**
 * Add content to an archive.
 * @promise Add
 * @param {string} archive Path to the archive.
 * @param {string} files Files to add.
 * @param {Object} options An object of acceptable options to 7z bin.
 * @param {Function} progress added files and directories.
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, files, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  var filesNormalized = files.map(function(file) {
    return path.normalize(file);
  });
  return run7z(['a', path.normalize(archive)].concat(filesNormalized), options, '+ ', progress);
};
