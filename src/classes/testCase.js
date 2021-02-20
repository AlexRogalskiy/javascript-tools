//------------------------------------------------------------------------------------------------
process.stdin.resume();
process.stdin.setEncoding('ascii');

var __input_stdin = "";
var __input_stdin_array = "";
var __input_currentline = 0;

process.stdin.on('data', function(data) {
	__input_stdin += data;
});
//------------------------------------------------------------------------------------------------
/**
* @public
* @module globals
* @desc Get current global context via singleton pattern
*
*/
var globals = (function() {
	return this;
}());

(function (globals) {
	'use strict';
	
	/**
	* @private
	* @module logger
	* @desc Intercept current standard output stream
	*
	*/
	(function(gl) {
		var util = require('util');
		
		/**
		* @private
		* @module logger
		* @param {Function} callback Callback function.
		* @return {Function} Function to toggle current standard output stream.
		*
		*/
		var interceptorStdOutput = function(callback) {
			var old_write = process.stdout.write;

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
		var toggleStdOut = interceptorStdOutput(function(string, encoding, fd) {
			util.debug('stdout: ' + util.inspect(string));
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
        var isNumber = function(value) {
           return (value !== null && (typeof value === 'number' || Object.toType(value) === 'number') && isFinite(value));
        };
		/**
		* @private
		* @module validator
		* @param {Number} value Input value.
		* @return {Boolean} true - if value is integer number, false - otherwise.
		*
		*/
        var isIntNumber = function(value) {
            return (isNumber(value) && ((value % 1) === 0) && Number.isSafeInteger(value)); //Math.round(x) === x;
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
        var isInBoundsRange = function(value, min, max) {
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
    
}(globals = globals || {}));

/**
* @public
* @module window
* @param {Number} n Input value of staircase levels.
* @return {null}
* @desc Print to standard output an ASCII-art staircase
*
*/
function StairCase(n) {
    const min = 1;
    const max = 100;
    if(!globals.validator.isIntNumber(n)) { throw {
									        name: 'ValueError',
									        message: 'incorrect input argument: {n} is not integer number < ' + n + ' >'
	                                    };
	}
    if(!globals.validator.isInBoundsRange(n, min, max)) {
        throw {
				name: 'OutOfBoundsError',
				message: 'incorrect input argument: number of levels < ' + n + ' > is out of range {' + min + ',' + max + '}'
	    };
    }
    var myString = '';
    for (var i = 0; i < n; i++) {
       for(var spaces = i; spaces < n - 1; spaces++) {
           myString += ' ';
       }
       for(var stairs = 0; stairs < i + 1; stairs++) {
          myString += '#';
       }
       myString += '\n';
    }
    //globals.validator.consoleWrite(myString);
    globals.logger.toggleStdOut();
    console.log(myString);
};
//------------------------------------------------------------------------------------------------
process.stdin.on('end', function() {
	__input_stdin_array = __input_stdin.split("\n");
	var _n = parseInt(__input_stdin_array[__input_currentline].trim(), 10);
	__input_currentline += 1;
	
	StairCase(_n);
});
//------------------------------------------------------------------------------------------------