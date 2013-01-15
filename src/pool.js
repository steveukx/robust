
var Runnable = require('./runnable.js');

/**
 * The Pool is a container of Runnable instances, keeping them alive by restarting them whenever they die.
 *
 * @constructor
 * @name {Pool}
 */
var Pool = module.exports = function() {
   this._runnables = [];
};
Pool.prototype = Object.create(require('subscribable').prototype);

/**
 * Add a new runnable to the list.
 *
 * @param {Runnable} runnable
 * @return {Pool}
 */
Pool.prototype.push = function(runnable) {
   runnable.on('exit', this._onRunnableExit, this);

   this._runnables.push(runnable);
   return this;
};

/**
 * Start all runnable instances
 * @return {*}
 */
Pool.prototype.start = function() {
   for(var runnables = this._runnables, i = 0, l = runnables.length; i < l; i++) {
      runnables[i].start();
   }
   return this;
};

/**
 * Stop all runnable instances
 * @return {*}
 */
Pool.prototype.stop = function() {
   for(var runnables = this._runnables, i = 0, l = runnables.length; i < l; i++) {
      runnables[i].stop();
   }
   return this;
};

/**
 *
 * @param {Runnable} runnable
 * @param {Boolean} err
 */
Pool.prototype._onRunnableExit = function(runnable, err) {
   this.fire('child.exception', runnable, err);

//   runnable.start();
};
