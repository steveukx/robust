(function () {

   module.exports = {

      /**
       * Creates a new object that merges the properties of any number of objects supplied as arguments to this method,
       * priority is given to left-most arguments and no property will be overwritten once set.
       *
       * @return {Object}
       */
      merge: function() {
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
      },

      /**
       * Prints the supplied string to the console and terminates the process
       * @param {String} str
       */
      die: function(str) {
         console.error(str);
         process.exit();
      }
   };

}());
