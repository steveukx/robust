(function () {

   var FileSystem = require('fs');

   /**
    *
    * @constructor
    */
   function RunConfiguration (binary, args) {
      this.binary = binary;
      this.args = args;

      this.cwd = process.cwd();
      this.env = {};
   }

   RunConfiguration.prototype.workingDirectory = function(cwd) {
      this.cwd = cwd;
      return this;
   };


   /**
    * Set the logging options of the run configuration
    * @param {Stream|String} io
    * @param {Stream|String} err
    * @return {RunConfiguration}
    */
   RunConfiguration.prototype.withLogging = function(io, err) {
      this.outLog = io;
      this.errLog = err;

      return this;
   };

   /**
    * Can be called either with a single named property and its value or with a map of properties as the first argument,
    * returns the RunConfiguration for convenient chaining.
    *
    * @param {String|Object} name
    * @param {Object} value
    * @return {RunConfiguration}
    */
   RunConfiguration.prototype.withEnvironment = function(name, value) {
      if(typeof name == 'object' && !!name) {
         for(var property in name) {
            if(name.hasOwnProperty(property)) {
               this.env[property] = name[property];
            }
         }
      }
      else {
         this.env[name] = value;
      }

      return this;
   };

   /**
    * @type {Stream|String} The stream that should receive messages from the stdout of the child, or the file to log to
    */
   RunConfiguration.prototype.outLog = null;

   /**
    * @type {Stream|String} The stream that should receive messages from the stderr of the child, or the file to log to
    */
   RunConfiguration.prototype.errLog = null;

   /**
    * Gets a writable stream for the destination that the process should push its data to
    * @param {Number} logType
    */
   RunConfiguration.prototype._getStream = function(logType) {
      var handle = [this.outLog, this.errLog][logType];
      if(handle && typeof handle == 'string') {
         handle = FileSystem.openSync(handle, 'a');
      }
      return handle;
   };

   /**
    * Gets an array of stream descriptors that should be used when creating a child process with this configuration
    */
   RunConfiguration.prototype.getStreams = function() {
      var ignore = this.env && this.env.NODE_ENV != 'production' ? 'pipe' : 'ignore';

      return [
         ignore,
         this._getStream(RunConfiguration.OUT) || ignore,
         this._getStream(RunConfiguration.ERR) || ignore
      ];
   };

   RunConfiguration.OUT = 0;

   RunConfiguration.ERR = 1;

   module.exports = RunConfiguration;

}());
