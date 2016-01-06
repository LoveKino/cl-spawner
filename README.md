# cl-spawner

cl-spawner helps you with that:

- manage child processes
  
  you can know which processes you spawned, and you can kill them all at one time.

- promisified spawn.

## var spawn = function(cmd, params, cmdOpts, options) { ... }

eg:

```js

var Spawner = require('cl-spawner');

var spawner = Spawner();

// spawn child process

spawner.spawn('ls', ['../']);

```


### @param cmd, params and cmdOpts

just see node spawn api.

### @param options

`options = { stdout, stderr, proc }`

- stdout
  
You can set a function to stdout or null.

When stdout is function, it accepts stdout data from child process.

- stderr

You can set a function to stderr or null.

When stderr is function, it accepts stderr data from child process.

- proc

You can set a function to proc or null.

When proc is function, it accepts child process.

eg:

```js

var Spawner = require('cl-spawner');

var spawner = Spawner();

spawner.spawn('echo', ['hello'], {}, {
    stdout: function(data) {
        console.log('stdout:' + data);
    },
    stderr: function(data) {
        console.log('stderr:' + data);
    },
    proc: function(p) {
        console.log(p.pid);
    }
});

```


### @return

The return of spawn is a promise.

## getChilds

eg:

```js

var Spawner = require('cl-spawner');

var spawner = Spawner();

spawner.spawn('node'); // process 1, assume pid is 100

spawner.spawn('node'); // process 2, assume pid is 200

spawner.spawn('ls'); // process 3, assume pid is 300

console.log(spawner.getChilds()); // [100, 200]

```


## killAll

return a promise.

eg:

```js

var Spawner = require('cl-spawner');

var spawner = Spawner();

spawner.spawn('node'); // process 1, assume pid is 100

spawner.spawn('node'); // process 2, assume pid is 200

spawner.killAll().then(function(){
    console.log(spawner.getChilds()); // []
});

```
