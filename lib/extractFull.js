'use strict';

var run7z = require('../util/run7z');
var pwHandle = require('../util/passwordHandler');
var path  = require('path');

/**
 * Extract an archive with full paths.
 * @promise ExtractFull
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param {Object} options An object of acceptable options to 7z bin.
 * @param {Function} progress Extracted files and directories.
 * @param {Function} passwordCB Password callback
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, dest, options, progress, passwordCB) {
  if (typeof(options) === 'function') {
    passwordCB = progress;
    progress = options;
    options = {};
  }
  return run7z(['x', path.normalize(archive), '-o' + path.normalize(dest)],
               options, '- ', pwHandle(passwordCB, progress));
};
