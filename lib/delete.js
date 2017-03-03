'use strict';

var run7z = require('../util/run7z');
var quote = require('../util/quote');

/**
 * Delete content to an archive.
 * @promise Delete
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, files, options) {
  return run7z(['d', quote(archive), quote(files)], options);
};
