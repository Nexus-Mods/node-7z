'use strict';
var os    = require('os');
var cp  = require('child_process');
var path  = require('path');
var Promise = require('bluebird');
var utilSwitches = require('./switches');

var errRE = new RegExp('Error:' + os.EOL + '?(.*)', 'g');

function feedStdout(progress, output) {
  var res = errRE.exec(output);
  if (res) {
    throw new Error(res[1]);
  }
  if (progress !== undefined) {
    progress(output);
  }
}

function feedStderr(output) {
  if (output) {
    throw new Error(output);
  }
}

/**
 * @promise Run
 * @param {string} cmd The command to run.
 * @param {Array} args The parameters to pass.
 * @param {Array} switches Options for 7-Zip as an array.
 * @progress {string} stdout message.
 * @reject {Error} The error issued by 7-Zip.
 * @reject {number} Exit code issued by 7-Zip.
 */
module.exports = function (cmd, args, switches, progress) {
  return new Promise(function (resolve, reject) {
    // Add switches to the `args` array.
    args = args.concat(utilSwitches(switches));

    // When an stdout is emitted, parse it. If an error is detected in the body
    // of the stdout create an new error with the 7-Zip error message as the
    // error's message. Otherwise progress with stdout message.
    var err;
    var run = cp.execFile(cmd, args, function (error, stdout, stderr) {
      if (error) {
        reject(error);
      }
      try {
        feedStdout(progress, stdout);
        feedStderr(stderr);
      } catch (err) {
        reject(err);
      }
    });
    run.on('error', function (err) {
      reject(err)
    });
    run.on('close', function (code) {
      if (code === 0) {
        return resolve(args);
      }
      if (err !== undefined) {
        return reject(new Error(err));
      }
      return reject(new Error('Errorcode ' + code));
    });

  });
};
