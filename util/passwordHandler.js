module.exports = function (passwordCB, relay) {
  return function(output, stdin) {
    var idx = output.findIndex(function (value) {
      return value.startsWith('Enter password'); });

    if (idx !== -1) {
      if (passwordCB) {
        output.splice(idx, 1);
        relay(output, stdin);
        stdin.write(passwordCB() + '\n');
      } else {
        throw new Error('Password protected');
      }
    } else {
      relay(output, stdin);
    }
  } 
}