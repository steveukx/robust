(function () {

   var Cluster = require('cluster');

   /**
    *
    * @constructor
    * @param {ConfigurationFactory} configurationFactory
    */
   function RobustCluster(configurationFactory) {
      this._configurationFactory = configurationFactory;
      this._workers = {};

      this._configureCluster();
   }

   /**
    * @type {ConfigurationFactory} The ConfigurationFactory this RobustCluster should use
    */
   RobustCluster.prototype._configurationFactory = null;

   /**
    * Configures the main cluster with properties from the configuration factory
    */
   RobustCluster.prototype._configureCluster = function () {
      Cluster.on('exit', this._onWorkerExit.bind(this));
      Cluster.setupMaster({
         exec: this._configurationFactory.getForkScript(),
         args: this._configurationFactory.getForkArguments(),
         silent: false
      });
   };

   /**
    * Handles a worker being terminated, can be triggered by an exception in the worker or as a result of the cluster
    * explicitly killing the worker. When the worker was terminated as a result of an exception, a new fork will be
    * created to replace it.
    *
    * @param {Worker} worker
    * @param {Number} code
    * @param {String} signal
    */
   RobustCluster.prototype._onWorkerExit = function(worker, code, signal) {
      var processIndex = this._workers[worker.id];
      delete this._workers[worker.id];

      console.log('###############################');
      console.log('## PROCESS ' + processIndex + ' has terminated');
      console.log('###############################');

      if(!worker.suicide) {
         this._createProcess(processIndex);
      }
   };

   /**
    * Creates a new forked process and binds to the exit event for managing spawning replacement processes later
    * @param {Number} processIndex
    */
   RobustCluster.prototype._createProcess = function(processIndex) {
      var worker = Cluster.fork(this._configurationFactory.getConfiguration(processIndex));
      this._workers[worker.id] = processIndex;

      console.log('###############################');
      console.log('## PROCESS ' + processIndex + ' has been created as worker ' + worker.id);
      console.log('###############################');
   };

   /**
    * Start up the child processes with the default (or a specified) number of child forks. If there are any existing
    * child processes running, they will be terminated before the new ones are spawned.
    */
   RobustCluster.prototype.start = function(processCount) {
      this.stop();
      for(var i = 0, max = processCount || this._configurationFactory.getProcessCount(); i < max; i++) {
         this._createProcess(i);
      }
      return this;
   };

   /**
    * Kill off any child processes
    */
   RobustCluster.prototype.stop = function() {
      var workers = Cluster.workers;
      for(var workerId in workers) {
         workers[workerId].destroy();
      }

      return this;
   };
   
   module.exports = RobustCluster;

}());
