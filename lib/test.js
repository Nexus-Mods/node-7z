'use strict';

var pwHandle = require('../util/passwordHandler');
var run7z = require('../util/run7z');
var path  = require('path');

/**
 * Test integrity of archive.
 * @promise Test
 * @param {string} archive Path to the archive.
 * @param {Object} options An object of acceptable options to 7za bin.
 * @param {Function} progress Tested files and directories.
 * @param {Function} passwordCB Password callback
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, options, progress, passwordCB) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }
  return run7z(['t', path.normalize(archive)], options, 'T ', pwHandle(passwordCB, progress));
};
