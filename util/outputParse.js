module.exports = function(relay, searchText) {
  if (searchText.indexOf('Unsupported Method') !== -1) {
    throw new Error('Unsupported Method');
  }

  var filt = function(line) {
    return (line.substr(0, searchText.length) === searchText) ||
           line.startsWith('Enter password');
  };
  var transform = function(line) {
    if (line.startsWith('Enter password')) {
      return line;
    }
    return line.substr(searchText.length);
  };

  return function(input, percentage, stdin, cancel) {
    var lines = input.replace(/\r/g, '\n').split('\n');
    var filteredOutput = lines.filter(filt).map(transform);
    var progressLine = lines.find(l => /[ ]*[0-9]+%/.test(l));
    if (progressLine !== undefined) {
      percentage = parseInt(progressLine.replace(/[ ]*([0-9]+)%/, '$1'), 10);
    }
    if ((filteredOutput.length > 0) || (percentage !== undefined)) {
      relay(filteredOutput, percentage, stdin, cancel);
    }
    return;
  }
}