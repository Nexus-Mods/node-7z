'use strict';

var run7z = require('../util/run7z');
var quote = require('../util/quote');

/**
 * Add content to an archive.
 * @promise Add
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, files, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  return run7z(['a', quote(archive), quote(files)], options, '+ ', progress);
};
