'use strict';
var os    = require('os');
var spawn = require('cross-spawn');
var path  = require('path');
var Promise = require('bluebird');
var utilSwitches = require('./switches');

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
    var reg = new RegExp('Error:' + os.EOL + '?(.*)', 'g');
    var res = {
      cmd: cmd,
      args: args,
      options: { stdio: 'pipe' } };
    var run = spawn(res.cmd, res.args, res.options);
    run.stdout.on('data', function (data) {
      var res = reg.exec(data.toString());
      if (res) {
        err = new Error(res[1]);
      }
      if (progress !== undefined) {
        progress(data.toString());
      }
    });
    run.stderr.on('data', function (data) {
      //throw errors
      err = data.toString();
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
