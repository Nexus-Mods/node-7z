var cli = require('7z-bin');
var parser = require('./outputParse');
var run = require('./run');

module.exports = function(args, options, outputMarker, progress) {
  options = Object.assign({ 'bb3': true }, options);

  if (typeof(outputMarker) === 'function') {
    return run(cli, args, options, outputMarker);
  } else if ((outputMarker !== undefined) && (progress !== undefined)) {
    return run(cli, args, options, parser(progress, outputMarker));
  } else {
    return run(cli, args, options);
  }
}
