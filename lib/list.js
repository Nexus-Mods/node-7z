'use strict';
var path = require('path');
var when = require('when');
var u    = {
  run     : require('../util/run'),
  switches: require('../util/switches')
};

function parseLine(line) {
  var arr = line.split('=');
  if (arr.length !== 2) {
    return undefined;
  }
  return { key: arr[0].trim(), value: arr[1].trim() };
}

function emit(progressFunc, entry) {
  if (entry.name === undefined) {
    // ignore invalid entry, maybe we should report an error?
    return;
  }
  // we could send multiple entries per call, but what would be the point?
  progressFunc([entry]);
}

/**
 * List contents of archive.
 * @promise List
 * @param archive {string} Path to the archive.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @progress {array} Listed files and directories.
 * @resolve {Object} Tech spec about the archive.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, options) {
  return when.promise(function (resolve, reject, progress) {

    var spec  = {};

    // Create a string that can be parsed by `run`.
    var command = '7z l "' + archive + '" ';

    var parseState = 0;

    var currentEntry = {};

    var buffer = ""; //Store imcomplete line of a progress data.

    // Start the command
    u.run(command, Object.assign({}, options, { slt: true }))

    // When a stdout is emitted, parse each line and search for a pattern. When
    // the pattern is found, extract the file (or directory) name from it and
    // pass it to an array. Finally returns this array.
    .progress(function (data) {
      var entries = [];

      // the data may be split in the middle of a line so we only use the data
      // up to the last line break and store the rest to prepend in the next cycle
      var usableSize = data.lastIndexOf('\n');
      var usableData = buffer + data.substr(0, usableSize);
      buffer = data.substr(usableSize + 1);

      usableData.split('\r\n').forEach(function (line) {
        if (parseState === 0) {
          // parse state 0 is the output header, we ignore all of it
          if (line === '--') {
            parseState = 1;
          }
        } else if (parseState === 1) {
          // parse state 1 is the info about the archive itself
          if (line.startsWith('----')) {
            parseState = 2;
            return
          }
          var field = parseLine(line);
          if (field === undefined) {
            // ignore failure to parse, maybe look a bit closer and report an error?
            return;
          }
          var specKey = {
            Path: 'path',
            Type: 'type',
            Method: 'method',
            'Physical Size': 'physicalSize',
            'Headers Size': 'headersSize',
          }[field.key];

          if (specKey !== undefined) {
            spec[specKey] = field.value;
          }
        } else {
          // parse state 2 is file entries
          if (line === '') {
            emit(progress, currentEntry);
            currentEntry = {};
          } else {
            var field = parseLine(line);
            if (field === undefined) {
              return;
            }
            switch (field.key) {
              case 'Modified': currentEntry.date = new Date(field.value); break;
              case 'Path': currentEntry.name = field.value.replace(path.sep, '/'); break;
              case 'Size': currentEntry.size = parseInt(field.value, 10); break;
              case 'Attributes': currentEntry.attr = field.value; break;
              default: /* nop */ break;
            }
          }
        }
      });
    })

    // When all is done resolve the Promise.
    .then(function () {
      emit(progress, currentEntry);
      return resolve(spec);
    })

    // Catch the error and pass it to the reject function of the Promise.
    .catch(function (err) {
      return reject(err);
    });

  });
};
