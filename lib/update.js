'use strict';

var run7z = require('../util/run7z');
var quote = require('../util/quote');

/**
 * Update content to an archive.
 * @promise Update
 * @param archive {string} Path to the archive.
 * @param files {string} Files to add.
 * @param options {Object} An object of acceptables options to 7z bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, files, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  return run7z(['u', quote(archive), quote(files)], options, '+ ', progress);
};
