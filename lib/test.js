'use strict';

var run7z = require('../util/run7z');
var quote = require('../util/quote');

/**
 * Test integrity of archive.
 * @promise Test
 * @param archive {string} Path to the archive.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  return run7z(['t', quote(archive)], options, 'T ', progress);
};
