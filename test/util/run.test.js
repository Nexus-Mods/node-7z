/*global describe, it */
'use strict';
var expect = require('chai').expect;
var run    = require('../../util/run');
var sep    = require('path').sep;
var cli    = require('7z-bin');

describe('Utility: `run`', function () {

  it('should return an error with invalid command type', function (done) {
    run(0).catch(function (err) {
      expect(err.message).to.contain('Command must be a string');
      done();
    });
  });

  it('should return an error on when 7z gets one', function (done) {
    run(cli, ['???']).catch(function (err) {
      expect(err.message).to.contain('Unsupported command');
      done();
    });
  });

  it('should return an stdout on progress', function (done) {
    run(cli, [], { h: true }, function (data) {
      expect(data).to.be.a('string');
    })
    .then(function () {
      done();
    });
  });

  it('should correctly parse complex commands', function (done) {
    run(cli, ['a', '.tmp/test/archive.7z', '*.exe', '*.dll'], {
      m0: '=BCJ',
      m1: '=LZMA:d=21'
    })
    .then(function (res) {
      expect(res).to.contain('a');
      expect(res).to.contain('.tmp/test/archive.7z');
      expect(res).to.contain('*.exe');
      expect(res).to.contain('*.dll');
      expect(res).to.contain('-m0=BCJ');
      expect(res).to.contain('-m1=LZMA:d=21');
      expect(res).to.contain('-ssc');
      expect(res).to.contain('-y');
      done();
    });
  });

  it('should correctly parse complex commands with spaces', function (done) {
    run(cli, ['a', '.tmp/Folder A/Folder B/archive.7z', '*.exe', '*.dll'], {
      m0: '=BCJ',
      m1: '=LZMA:d=21',
      p : 'My mhjls/\\c $^é5°',
    })
    .then(function (res) {
      expect(res).to.contain('a');
      /*jshint maxlen:false*/
      expect(res).to.contain('.tmp/Folder A/Folder B/archive.7z');
      expect(res).to.contain('*.exe');
      expect(res).to.contain('*.dll');
      expect(res).to.contain('-m0=BCJ');
      expect(res).to.contain('-m1=LZMA:d=21');
      expect(res).to.contain('-p"My mhjls/\\c $^é5°"');
      expect(res).to.contain('-ssc');
      expect(res).to.contain('-y');
      done();
    });
  });

  it('should handle error when the command could not be found', function (done) {
    run('7zxxx', ['a', '.tmp/test/archive.7z', '*.exe', '*.dll']).catch(function (err) {
      expect(err.message).to.contain('ENOENT');
      done();
    });
  });

});
