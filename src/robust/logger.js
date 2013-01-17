/**
 * @exports Logger
 */
(function () {

   /**
    *
    * @name Logger
    * @constructor
    */
   function Logger(logLevel) {
      this._initialiseLogging(logLevel);
   }

   /**
    * Prints a debug level log to the console
    * @function
    * @name Logger#debug
    */
   Logger.prototype.debug =

   /**
    * Prints an info level log to the console
    * @function
    * @name Logger#info
    */
   Logger.prototype.info =

   /**
    * Prints a log to the console
    * @function
    * @name Logger#log
    */
   Logger.prototype.log =

   /**
    * Prints a warning to the console
    * @function
    * @name Logger#warn
    */
   Logger.prototype.warn =

   /**
    * Prints an error to the console
    * @function
    * @name Logger#error
    */
   Logger.prototype.error = function() {
   };


   /**
    * Sets up the logging for this logger
    * @param {Number|Boolean} level
    */
   Logger.prototype._initialiseLogging = function(level) {
      if(level === false) {
         return this._initialiseLogging(4);
      }
      else if(level === true) {
         return this._initialiseLogging(0);
      }

      for(var logLevel in Logger.LogLevels) {
         if(Logger.LogLevels >= level) {
            this[logLevel] = console[logLevel].bind(console);
         }
      }

      return this;
   };

   /**
    * Named logging levels
    * @type {{debug: number, info: number, log: number, warn: number, error: number}}
    */
   Logger.LogLevels = {
      debug: 0,
      info: 1,
      log: 1,
      warn: 2,
      error: 3
   };

   module.exports = Logger;

}());
