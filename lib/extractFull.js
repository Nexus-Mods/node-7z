'use strict';

var run7z = require('../util/run7z');
var quote = require('../util/quote');
var path  = require('path');

/**
 * Extract an archive with full paths.
 * @promise ExtractFull
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, dest, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  return run7z(['x', path.normalize(archive), '-o' + path.normalize(dest)], options, '- ', progress);
};
