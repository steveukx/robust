
var ChildProcess = require('child_process');

/**
 *
 * @param {RunConfiguration} runConfiguration
 * @constructor
 */
function Runnable(runConfiguration) {
   this._runConfiguration = runConfiguration;
}
Runnable.prototype = Object.create(require('subscribable').prototype);

/**
 * @type {ChildProcess} The process currently being controlled by this runnable
 */
Runnable.prototype._child = null;

/**
 *
 * @param {Number} code
 * @param {String} signal
 */
Runnable.prototype._onRunnableExit = function(code, signal) {
   delete this._child;
   this.fire('exit', this, code === 0, code, signal);
};

/**
 * Starts up this process
 */
Runnable.prototype.start = function() {
//   this._child = ChildProcess.spawn(
//       this._runConfiguration.binary,
//       this._runConfiguration.args, {
//          stdio: this._runConfiguration.getStreams(),
//          env: this._runConfiguration.env,
//          cwd: this._runConfiguration.cwd
//       }
//   );

   this._child = ChildProcess.spawn(
       'node',
       ['examples/server-pool/server.js'], {
          stdio: 'inherit'
          ,
          env: this._runConfiguration.env
//          ,
//          cwd: this._runConfiguration.cwd
       }
   );

   this._child.on('exit', this._onRunnableExit.bind(this));
};

/**
 * Attempts to kill the child process wrapped in this runnable
 */
Runnable.prototype.stop = function() {
   if(this._child) {
      this._child.kill();
      delete this._child;
   }
};


module.exports = Runnable;
