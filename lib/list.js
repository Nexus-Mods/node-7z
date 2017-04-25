'use strict';

var run7z = require('../util/run7z');
var path  = require('path');

function parseLine(line) {
  var arr = line.split('=');
  if (arr.length !== 2) {
    return undefined;
  }
  return { key: arr[0].trim(), value: arr[1].trim() };
}

var specMap = {
  Path: 'path',
  Type: 'type',
  Method: 'method',
  'Physical Size': 'physicalSize',
  'Headers Size': 'headersSize',
  'Encryption': 'encryption',
};

// parse state 0 is the output header, we ignore all of it
function parseState0(line) {
  return (line === '--') ? 1 : 0;
}

// parse state 1 is the info about the archive itself
function parseState1(spec, line) {
  if (line.startsWith('----')) {
    return 2;
  }
  var field = parseLine(line);
  if (field !== undefined) {
    var specKey = specMap[field.key];

    if (specKey !== undefined) {
      spec[specKey] = field.value;
    }
  }
  // ignores failure to parse, maybe look a bit closer and report an
  // error?
  return 1;
}

function insertField(entry, field) {
  switch (field.key) {
    case 'Modified':
      entry.date = new Date(field.value);
      break;
    case 'Size':
      entry.size = parseInt(field.value, 10);
      break;
    case 'Path':
      entry.name = field.value;
      break;
    case 'Attributes':
      entry.attr = field.value;
      break;
    default: /* nop */
      break;
  }
}

function parseState2(currentEntry, line) {
  // parse state 2 is file entries
  if (line === '') {
    return true;
  }

  var field = parseLine(line);
  if (field !== undefined) {
    insertField(currentEntry, field);
  }
  return false;
}

function createParser(emit) {
  var parseState = 0;
  var spec  = {};
  var currentEntry = {};
  var buffer = ''; // store incomplete line of progress data

  var res = function(data) {
    var entries = [];

    // the data may be split in the middle of a line so we only use the data
    // up to the last line break and store the rest to prepend in the next cycle
    var usableSize = data.lastIndexOf('\n');
    var usableData = buffer + data.substr(0, usableSize);
    buffer = data.substr(usableSize + 1);

    usableData.split('\r\n').forEach(function(line) {
      if (parseState === 0) {
        parseState = parseState0(line);
      } else if (parseState === 1) {
        parseState = parseState1(spec, line);
      } else {
        if (parseState2(currentEntry, line)) {
          emit(currentEntry);
          currentEntry = {};
        }
      }
    });
  }
  res.finalize = function() {
    emit(currentEntry);
    return spec;
  }
  return res;
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
module.exports = function (archive, options, progress) {
  if (typeof(options) === 'function') {
    progress = options;
    options = {};
  }

  var allOptions = Object.assign({ slt: true }, options);

  var emit = function(entry) {
    if (entry.name === undefined) {
      // ignore invalid entry, maybe we should report an error?
      return;
    }
    // we could send multiple entries per call, but what would be the point?
    if (progress !== undefined) {
      progress([entry]);
    }
  }

  var parser = createParser(emit);

  return run7z(['l', path.normalize(archive)], allOptions, parser)
  .then(function () {
    return parser.finalize();
  })
};
