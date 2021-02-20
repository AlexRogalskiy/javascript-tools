;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	const sum = arr => arr.reduce((x, y) => x + y);
//----------------------------------------------------------------------------------------------
	const sort = (...values) => values.sort();
//----------------------------------------------------------------------------------------------
	if(!Number.prototype[Symbol.iterator]) {
		Object.defineProperty(Number.prototype, Symbol.iterator, {
			writable: true,
			configurable: true,
			enumerable: false,
			value: function iterator() => {
				var i, inc, done = false, top = +this;
				inc = 1 * (top < 0 ? -1 : 1);
				return {
					[Symbol.iterator]() {
						return this;
					},
					next() {
						if(!done) {
							if(i == null) {
								i = 0;
							} else if(top >= 0) {
								i = Math.min(top, i + inc);
							} else {
								i = Math.max(top, i + inc);
							}
							if(i == top) {
								done = true;
							}
							return { value: i, done: false };
						} else {
							return { done: true };
						}
					}
				};
			}
		});
	}
//----------------------------------------------------------------------------------------------
	if(!Number.isNaN) {
		Number.isNaN = function(value) {
			return (value !== value);
		};
	}
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE_UNITS = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
//----------------------------------------------------------------------------------------------
		// var x = 0 | Math.random() * 10; // ~~ = Math.floor
		// i=-~i; // increment
		/*
		*
		*/
		Number.method('toRadians', function() {
			return (this * Math.PI / 180).toFixed(3);
		});
//----------------------------------------------------------------------------------------------
		Number.method('toDegress', function() {
			return (this * 180 / Math.PI).toFixed(3);
		});
//----------------------------------------------------------------------------------------------
		/*
		* @example
		* (-10/3).integer()
		*/
		Number.method('round', function() {
			return Math[this < 0 ? 'ceil' : 'floor'].apply(Math, this);
			//return ((this) >> 0);
			//return (this | 0);
		});
//----------------------------------------------------------------------------------------------
		Number.method('integer', function() {
			return ((this) >> 0);
			//return (this | 0);
		});
//----------------------------------------------------------------------------------------------
		Number.method('hashCode', function() {
			return ((this) >> 0);
			//return (this ^ (this >>> 32));
			//return (this | 0);
		});
//----------------------------------------------------------------------------------------------
		Number.method('equals', function(integer) {
			if(integer == this) return true;
			if(!(globals.toolset.isNumber(integer) || globals.toolset.isObject(integer))) return false;
			return (this.toString() === integer.toString());
		});
//----------------------------------------------------------------------------------------------
		/*
		* @example
		* var quantity=1056;
		* var costPer=3.9;
		* var totalCost=quantity * costPer;
		* quantity.toInteger()
		* costPer.toCurrency()
		* totalCost.toCurrency()
		*/
		Number.method('toCurrency', function(noFractions, currencySymbol, decimalSeparator, thousandsSeparator) {
			var startAt;

			currencySymbol = globals.toolset.isString(currencySymbol) ? currencySymbol: '$';
			decimalSeparator = globals.toolset.isString(decimalSeparator) ? decimalSeparator: '.';
			thousandsSeparator = globals.toolset.isString(thousandsSeparator) ? thousandsSeparator: ',';

			var num = this.round(noFractions ? 0 : 2, true, decimalSeparator);
			var intLen= num.length - (noFractions ? 0 : 3);
			if ((startAt = intLen%3) == 0) startAt = 3;
			for (var i=0,len=Math.ceil(intLen/3)-1; i<len; i++) {
				num = num.insertAt(i * 4 + startAt, thousandsSeparator);
			}
			return currencySymbol + num;
		});
//----------------------------------------------------------------------------------------------
		Number.method('toInteger', function(thousandsSeparator) {
			var startAt, intLen;

			thousandsSeparator = globals.toolset.isString(thousandsSeparator) ? thousandsSeparator: ',';

			var num = this.round(0, true);
			var intLen = num.length;
			if ((startAt = intLen%3) == 0) startAt = 3;
			for (var i=0,len=Math.ceil(intLen/3)-1; i<len ;i++) {
				num = num.insertAt(i * 4 + startAt, thousandsSeparator);
			}
			return num;
		});
//----------------------------------------------------------------------------------------------
		Number.method('round', function(decimals, returnAsString, decimalSeparator) {
			var frac;

			decimals = globals.toolset.isIntNumber(decimals) ? decimals : 0;

			var factor = Math.pow(10, decimals);
			var n = (this.valueOf() + '');
			if(!returnAsString) {
				return Math.round(n * factor) / factor;
			}

			decimalSeparator = globals.toolset.isString(decimalSeparator) ? decimalSeparator: '.';

			if (n == 0) return '0.' + ((factor + '').substr(1));
			var breakPoint =(n = Math.round(n * factor) + '').length - decimals;
			var whole = n.substr(0, breakPoint);
			if (decimals > 0) {
				frac = n.substr(breakPoint);
				if(frac.length < decimals) {
					frac = (Math.pow(10, decimals - frac.length) + '').substr(1) + frac;
				}
				return whole + decimalSeparator + frac;
			} else {
				return whole + ((Math.pow(10, -decimals) + '').substr(1));
			}
		});
//----------------------------------------------------------------------------------------------
		Number.staticMethod('toLexical', function(value) {
			if(!isInteger(value) || value < 0) return;
			var ord = Math.floor(Math.log(value) / Math.log(1024));
			ord = Math.min( Math.max(0, ord), DEFAULT_SIZE_UNITS.length - 1);
			var s = Math.round((value / Math.pow(1024, ord)) * 100) / 100;
			return s + ' ' + DEFAULT_SIZE_UNITS[ord];
		});
//----------------------------------------------------------------------------------------------
		Number.staticMethod('doubleEquals', function(left, right, precision) {
			if(!globals.toolset.isNumber(left) || !globals.toolset.isNumber(right)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: left < ' + left + ' >, right < ' + right + ' >'
																					};
			}
			precision = (precision == null) ? 0.0001 : (globals.toolset.isRealNumber(precision) && precision > 0 && precision < 1) ? precision : null;
			if(precision == null) throw {name: 'ValueError', message: 'incorrect precision value: < ' + precision + ' >'};
			return (Math.abs(left - right) < precision);
		});
//----------------------------------------------------------------------------------------------
		Number.staticMethod('doubleLess', function(left, right, precision, isEqual) {
			if(!globals.toolset.isNumber(left) || !globals.toolset.isNumber(right)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: left < ' + left + ' >, right < ' + right + ' >'
																					};
			}
			precision = (precision == null) ? 0.0001 : (globals.toolset.isRealNumber(precision) && precision > 0 && precision < 1) ? precision : null;
			if(precision == null) throw {name: 'ValueError', message: 'incorrect precision value: < ' + precision + ' >'};
			isEqual = (isEqual == null) ? false : (globals.toolset.isBoolean(isEqual)) ? isEqual : null;
			if(isEqual == null) throw {name: 'ValueError', message: 'incorrect isEqual value: < ' + isEqual + ' >'};
			if(Math.abs(left - right) < precision) return (isEqual);
			return (left < right);
		});
//----------------------------------------------------------------------------------------------
		Number.staticMethod('doubleGreater', function(left, right, precision, isEqual) {
			if(!globals.toolset.isNumber(left) || !globals.toolset.isNumber(right)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: left < ' + left + ' >, right < ' + right + ' >'
																					};
			}
			precision = (precision == null) ? 0.0001 : (globals.toolset.isRealNumber(precision) && precision > 0 && precision < 1) ? precision : null;
			if(precision == null) throw {name: 'ValueError', message: 'incorrect precision value: < ' + precision + ' >'};
			isEqual = (isEqual == null) ? false : (globals.toolset.isBoolean(isEqual)) ? isEqual : null;
			if(isEqual == null) throw {name: 'ValueError', message: 'incorrect isEqual value: < ' + isEqual + ' >'};
			if(Math.abs(left - right) < precision) return (isEqual);
			return (left > right);
		});
//----------------------------------------------------------------------------------------------
		Number.staticMethod('iterator', function(max) {
			if(!globals.toolset.isNumber(max)) { throw {
														name: 'ValueError',
														message: 'incorrect input values: left < ' + left + ' >, right < ' + right + ' >'
												};
			}
			var i, inc, done = false;
			inc = 1 * (max < 0 ? -1 : 1);
			return {
				[Symbol.iterator]() {
					return this;
				},
				next() {
					if(!done) {
						if(i == null) {
							i = 0;
						} else if(max >= 0) {
							i = Math.min(max, i + inc);
						} else {
							i = Math.max(max, i + inc);
						}
						if(i == max) {
							done = true;
						}
						return { value: i, done: false };
					} else {
						return { done: true };
					}
				}
			};
		});
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));
