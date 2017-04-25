module.exports = function (passwordCB, relay) {
  return function(output, stdin) {
    var idx = output.findIndex(function (value) {
      return value.startsWith('Enter password'); });

    if (idx !== -1) {
      if (passwordCB) {
        output.splice(idx, 1);
        if (relay) {
          relay(output, stdin);
        }
        passwordCB()
        .then(function (password) {
          stdin.write(password + '\n');
        });
      } else {
        throw new Error('Password protected');
      }
    } else {
      if (relay) {
        relay(output, stdin);
      }
    }
  } 
}