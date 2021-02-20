process.stdin.resume();
process.stdin.setEncoding('ascii');

let input = '';
var __input_stdin_array = '';

process.stdin.on('data', function (chunk) {
  input += chunk;
});
process.stdin.on('end', function () {
    __input_stdin_array = input.split('\n');
	let num = parseInt(__input_stdin_array[0].trim(), 10);
    
    let sum = 0;
    for (let i=1; i<=num; i++) {
        sum += parseInt(__input_stdin_array[i].trim(), 10);
    }
    
  globals.logger.toggleStdOut();
  console.log(sum);
});

/**
 * @public
 * @module globals
 * @desc Get current global context via singleton pattern
 *
 */
var globals = (function () {
  return this;
})();

(function (globals) {
  'use strict';
	
	/**
	* @private
	* @module logger
	* @desc Intercept current standard output stream
	*
	*/
	(function(gl) {
		let util = require('util');
		
		/**
		* @private
		* @module logger
		* @param {Function} callback Callback function.
		* @return {Function} Function to toggle current standard output stream.
		*
		*/
		let interceptorStdOutput = function(callback) {
			let old_write = process.stdout.write;

      process.stdout.write = (function(write) {
				return function(string, encoding, fd) {
					write.apply(process.stdout, arguments);
					callback(string, encoding, fd);
				}
			})(process.stdout.write);

      return function() {
				process.stdout.write = old_write;
			};
		};
		
		/**
		* @public
		* @module StdOutputInterceptor
		* @return {null}
		* @desc Change current standard output stream.
		*
		*/
		let toggleStdOut = interceptorStdOutput(function(string, encoding, fd) {
			util.debug(`stdout: ${  util.inspect(string)}`);
		});
		
        //Set up global aliases
		gl.toggleStdOut = toggleStdOut;
		
	}(globals.logger = globals.logger || {}));

  /**
	* @private
	* @module validator
	* @desc Helper methods to process / validate raw input data
	*
	*/
    (function(gt) {
        
		/**
		* @private
		* @module validator
		* @param {Number} value Input value.
		* @return {Boolean} true - if value is number, false - otherwise.
		*
		*/
        let isNumber = function(value) {
           return (value !== null && (typeof value === 'number' || Object.toType(value) === 'number') && isFinite(value));
      );
    };
    /**
		* @private
		* @module validator
		* @param {Number} value Input value.
		* @return {Boolean} true - if value is integer number, false - otherwise.
		*
		*/
        let isIntNumber = function(value) {
      return isNumber(value) && value % 1 === 0 && Number.isSafeInteger(value); //Math.round(x) === x;
      //return (/^-?\d+$/.test(str));
    };
    /**
     * @private
     * @module validator
     * @param {Number} value Input value.
     * @param {Number} min Input low bound value.
     * @param {Number} max Input max bound value.
     * @return {Boolean} true - if min >= value <= max, false - otherwise.
     *
     */
    var isInBoundsRange = function (value, min, max) {
      return (value <= max && value >= min);
        };
       // var consoleWrite = function() {
		//	var args = Array.prototype.slice.call(arguments);
		//	process.stdout.write(args);
       // };
        
        //Set up global aliases
		gt.isNumber = isNumber;
		gt.isIntNumber = isIntNumber;
		gt.isInBoundsRange = isInBoundsRange;
	//	gt.consoleWrite = consoleWrite;
		
    }(globals.validator = globals.validator || {}));
    
})((globals = globals || {}));
