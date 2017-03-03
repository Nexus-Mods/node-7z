function quote(input) {
  if (Array.isArray(input)) {
    return input.map(quote).join(' ');
  } else {
    return '"' + input + '"';
  }
}

module.exports = quote;
