# spawn-write-stream

  spawn a subprocess for writing from.

## Installation

    npm i spawn-write-stream

## API
### spawnWriteStream(command)
### spawnWriteStream(command, opts)
### spawnWriteStream(command, args)
### spawnWriteStream(command, args, opts)

  Returns a writable stream.
  Uses `child_process.spawn` to spawn the process.
  If the process fails, an error is emitted on the stream.

  For clarity, command is allowed to be an array, for cases like `zfs send`, where `zfs` clearly isn't a very useful description of what command is being run.
  This only makes a difference for error reporting.

  The child process `exit` event is re-emitted on the stream, *after* any error events.

#### ExitError

  * name: `ExitError`
  * stderr: stderr output of the process (Buffer)

  then, depending on how it exited:

  * signal: signal that killed the process (string)
  * message: ``'`' + command + '` killed by signal `' + err.signal + '`'``

  *or*

  * code: exit code (integer)
  * message: ``'`' command + '` exited with ' + err.code``

