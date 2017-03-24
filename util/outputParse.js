module.exports = function(relay, searchText) {
  if (searchText.indexOf('Unsupported Method') !== -1) {
    throw new Error('Unsupported Method');
  }

  var filt = function(line) {
    return line.substr(0, searchText.length) === searchText;
  };
  var transform = function(line) {
    return line.substr(searchText.length);
  };

  return function(input) {
    var filteredOutput = input.split('\r\n').filter(filt).map(transform);
    if (filteredOutput.length > 0) {
      relay(filteredOutput);
    }
    return;
  }
}