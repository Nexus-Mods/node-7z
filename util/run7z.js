var cli = require('7z-bin');
var parser = require('./outputParse');
var run = require('./run');

module.exports = function(args, options, outputMarker, progress) {
  var command = cli + ' ' + args.join(' ');
  options = Object.assign({ 'bb3': true }, options);

  if (typeof(outputMarker) === 'function') {
    return run(command, options, outputMarker);
  } else if ((outputMarker !== undefined) && (progress !== undefined)) {
    return run(command, options, parser(progress, outputMarker));
  } else {
    return run(command, options);
  }
}
