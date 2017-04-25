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

  return function(input, stdin) {
    var filteredOutput = input.split('\r\n').filter(filt).map(transform);
    if (filteredOutput.length > 0) {
      relay(filteredOutput, stdin);
    }
    return;
  }
}