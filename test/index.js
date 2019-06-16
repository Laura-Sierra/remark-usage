'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var remark = require('remark')
var hidden = require('is-hidden')
var negate = require('negate')
var usage = require('..')

var read = fs.readFileSync
var exists = fs.existsSync

test('usage()', function(t) {
  t.equal(typeof usage, 'function', 'should be a function')

  t.doesNotThrow(function() {
    usage.call(remark)
  }, 'should not throw if not passed options')

  t.end()
})

var root = path.join(__dirname, 'fixtures')
var fixtures = fs.readdirSync(root).filter(negate(hidden))

test('Fixtures', function(t) {
  fixtures.forEach(function(fixture) {
    var filepath = root + '/' + fixture
    var config = filepath + '/config.json'
    var output = filepath + '/output.md'
    var input
    var result
    var fail

    config = exists(config) ? require(config) : {}
    output = exists(output) ? read(output, 'utf-8') : ''

    input = read(filepath + '/readme.md', 'utf-8')

    config.cwd = filepath

    fail = fixture.indexOf('fail-') === 0 ? fixture.slice(5) : ''

    try {
      result = remark()
        .use(usage, config)
        .processSync(input)
        .toString()

      t.equal(result, output, 'should work on `' + fixture + '`')
    } catch (error) {
      if (!fail) {
        throw error
      }

      fail = new RegExp(fail.replace(/-/, ' '), 'i')

      t.equal(fail.test(error), true, 'should fail on `' + fixture + '`')
    }
  })

  t.end()
})
