'use strict';
var spawn = require('child_process').spawn
  , sprom = require('sprom')

module.exports =
function spawnWriteStream(bin, args, opts) {
  if (!Array.isArray(args)) {
    opts = args
    args = []
  }

  var name = bin
  if (Array.isArray(bin)) {
    name = bin.join(' ')
    args = bin.concat(args)
    bin = args.shift()
  }

  var myOpts = opts
      ? Object.create(opts)
      : {}
  myOpts.stdio = ['pipe', process.stdout, 'pipe']

  var child = spawn(bin, args, opts)
    , errored = false
    , stream = child.stdin

  child.on('error', error)
  function error(err) {
    if (errored) return
    errored = true
    stream.emit('error', err)
  }

  var stderr = sprom(child.stderr)
  child.on('exit', function(code, signal) {
    if (errored) return
    if (code === 0 && !signal) return
    stderr.then(function(stderr) {
      var err = signal
        ? new Error('`' + name + '` killed by signal `' + signal + '`')
        : new Error('`' + name + '` exited with ' + code)

      err.name = 'ExitError'
      err.message += ': ' + stderr
      err.code = code
      err.signal = signal
      err.stderr = stderr

      error(err)
    })
  })

  return stream
}
