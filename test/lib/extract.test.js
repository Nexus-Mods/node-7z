/*global describe, it */
'use strict';
var expect  = require('chai').expect;
var fs      = require('fs-extra');
var extract = require('../../lib/extract');

describe('Method: `Zip.extract`', function () {

  it('should return an error on 7z error', function (done) {
    extract('test/nothere.7z', '.tmp/test')
    .catch(function (err) {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });

  it('should return an error on output duplicate', function (done) {
    extract('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' })
    .catch(function (err) {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });

  it('should return entries on progress', function (done) {
    var allEntries = [];
    extract('test/zip.7z', '.tmp/test', function (entries) {
      allEntries = [].concat(allEntries, entries);
    })
    .then(function() {
      expect(allEntries.length).to.be.at.least(1);
      done();
    });
  });

  it('should extract on the right path', function (done) {
    extract('test/zip.7z', '.tmp/test')
    .then(function () {
      expect(fs.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file1.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
      done();
    });
  });

});
