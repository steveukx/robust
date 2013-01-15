
var ChildProcess = require('child_process'),
    Commands = require('commands'),
    FileSystem = require('fs'),
    Path = require('path'),

    Pool = require('./pool'),
    Runnable = require('./runnable'),
    RunConfiguration = require('./runconfiguration');

function die(str) {
   console.error(str);
   process.exit();
}

function merge() {
   var result = {};
   for(var i = 0, l = arguments.length; i < l; i++) {
      var source = arguments[i];
      for(var property in source) {
         if(!result.hasOwnProperty(property)) {
            result[property] = source[property];
         }
      }
   }
   return result;
}

var pool = new Pool();

// ability to configure with JSON script
var config = Path.join(process.cwd(), Commands.get('config', 'robust.json'));

if(!FileSystem.existsSync(config)) {
   die("Named configuration script could not be found at " + config);
}

config = require(config);
var defaults = config.defaults || {};
var processes = config.processes || new Array(config.poolSize);

if(!processes.length) {
   die("No process definitions found, must either explicitly create a processes array or set the poolSize property if all processes can use default properties");
}

processes.forEach(function(config) {
   config = merge(config, defaults);
   pool.push(new Runnable(new RunConfiguration(config.bin, config.args)
                           .workingDirectory(Path.join(process.cwd(), config.cwd))
                           .withLogging(config.out, config.err)
                           .withEnvironment(merge(config.env || {}, defaults.env || {}, process.env))));
});

// do some reporting
pool.on('child.exception', function(runnable, err) {
   die("Child exited\n\n" + require('util').inspect(runnable));
});


pool.start();

