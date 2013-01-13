
var ChildProcess = require('child_process'),
    Commands = require('commands'),

    Pool = require('./pool'),
    Runnable = require('./runnable');

var bin = Commands.get('bin', 'node'),
    args = Commands.get('args', []),
    script = Commands.get('script');

if(args && !Array.isArray(args)) {
   args = [args];
}

if(!script && !args.length) {
   die("Must supply either an arguments list or a script source or both, but not neither!");
}

var pool = new Pool(2);

pool.on('available', function(slotsAvailable) {
   // must create slotsAvailable new process
   var runnable = new Runnable(ChildProcess.spawn());
});

pool.on('error', function() {
   // do some reporting
});

function die(str) {
   console.error(str);
   process.exit();
}