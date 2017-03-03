var expect = require('chai').expect;
var quote  = require('../../util/quote');
var sep    = require('path').sep;

describe('Utility: `quote`', function () {

  it('correctly quotes a single string', function (done) {
    expect(quote('test')).to.equal('"test"');
    expect(quote('test with spaces')).to.equal('"test with spaces"');
    done();
  });

  it('quotes items in an array and returns as a string', function (done) {
    expect(quote(['one', 'two', 'three'])).to.equal('"one" "two" "three"');
    done();
  });

});
