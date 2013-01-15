(function () {

   var FileSystem = require('fs'),
       Path = require('path'),
       Util = require('./util'),
       Commands = require('commands');

   /**
    *
    * @param {String} configurationFile The file path of the configuration options
    * @constructor
    */
   function ConfigurationFactory(configurationFile) {
      try {
         this._useConfigurationFile(configurationFile || 'robust.json');
      }
      catch (e) {
         if(configurationFile) {
            Util.die("Unable to load configuration file at " + configurationFile);
         }
      }

      this._options = Util.merge(Commands.all(), this._options);
      this._options.defaults = this._options.defaults || {};
      this._options.envs = this._options.envs || [];

      this._script = this._toAbsolutePath(this._options.script || 'server.js');
      if(!FileSystem.existsSync(this._script)) {
         Util.die("Executable path not found at " + this._script + " set with property \"script\" in configuration options");
      }
   }

   /**
    * Minimum number of processes that will be requested on start-up, this value can be set by specifying processes as
    * an option either in the command line or configuration file
    * @type {number}
    */
   ConfigurationFactory.MINIMUM_PROCESSES = 2;

   /**
    * @type {Object} Configuration options set on the factory
    */
   ConfigurationFactory.prototype._options = null;
   
   /**
    * @type {String} The script that will be executed in each fork of the server
    */
   ConfigurationFactory.prototype._script = null;

   /**
    *
    * @param {String} configFilePath
    * @throws Error when file doesn't exist
    */
   ConfigurationFactory.prototype._useConfigurationFile = function(configFilePath) {
      var configurationFile = this._toAbsolutePath(configFilePath);
      if(!FileSystem.existsSync(configurationFile)) {
         throw new Error("File Not Found: " + configurationFile);
      }
      this._options = require(configurationFile);
   };

   /**
    * Gets the absolute path to the supplied path where the path supplied is either an absolute path already, or
    * relative to the current working directory.
    *
    * @param {String} path
    * @return {String}
    */
   ConfigurationFactory.prototype._toAbsolutePath = function(path) {
      var cwd = process.cwd();
      return Path.join(cwd, Path.relative(cwd, path));
   };

   /**
    * Gets the named configuration option
    *
    * @param {String} optionName
    * @return {*|undefined}
    */
   ConfigurationFactory.prototype.getOption = function(optionName) {
      return this._options[optionName];
   };

   /**
    * Gets the environment settings for the specified child process index
    *
    * @param {Number} processIndex
    * @return {Object}
    */
   ConfigurationFactory.prototype.getConfiguration = function(processIndex) {
      return Util.merge(
                  this._options.envs[processIndex] || {},
                  this._options.defaults);
   };

   /**
    * Gets the arguments to send to each forked process
    * @return {Object[]}
    */
   ConfigurationFactory.prototype.getForkArguments = function() {
      return this._options.args || process.argv.slice(2);
   };

   /**
    * Gets the string path to the script that should be run with node in the forked processes
    * @return {String}
    */
   ConfigurationFactory.prototype.getForkScript = function() {
      return this._script;
   };

   /**
    * Gets the number of forked processes that should be used
    * @return {Number}
    */
   ConfigurationFactory.prototype.getProcessCount = function() {
      return Math.max(2, this._options.processes || require('os').cpus().length);
   };

   module.exports = ConfigurationFactory

}());
