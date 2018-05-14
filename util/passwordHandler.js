module.exports = function (passwordCB, relay) {
  return function(output, percentage, stdin, cancel) {
    var idx = output.findIndex(function (value) {
      return value.startsWith('Enter password'); });

    if (idx !== -1) {
      if (passwordCB) {
        output.splice(idx, 1);
        if (relay) {
          relay(output, percentage, stdin, cancel);
        }
        passwordCB()
        .then(function (password) {
          stdin.write(password + '\n');
        })
        .catch(function (err) {
          cancel();
        });
      } else {
        throw new Error('Password protected');
      }
    } else {
      if (relay) {
        relay(output, percentage, stdin, cancel);
      }
    }
  } 
}