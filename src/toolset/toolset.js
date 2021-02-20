;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.toolset = globals.toolset || {};
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		/**
		 * @private
		 */
		const DEFAULT_COLORS_PRESET = [
			'#e21400', '#91580f', '#f8a700', '#f78b00',
			'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
			'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		];
//----------------------------------------------------------------------------------------------
		const invLog2 = 1/Math.log(2);
//----------------------------------------------------------------------------------------------
		const defaultProtocolsExcept = [ '127.0.0.1', '0.0.0.0', 'localhost', '::1' ];
//----------------------------------------------------------------------------------------------
		//var supportsSlider = supportsInputOfType('range');
		//var supportsColorpicker = supportsInputOfType('color');
		var supportsInputOfType = function(type) {
			return function() {
				var el = document.createElement('input');
				try {
					el.type = type;
				}
				catch(err) { }
				return el.type === type;
			};
		};
//----------------------------------------------------------------------------------------------
		var supportsNativeJSON = function() {
			return typeof JSON !== "undefined" && Object.prototype.toString.call(JSON) === "[object JSON]";
		};
//----------------------------------------------------------------------------------------------
		  if (support.arrayBuffer) {
			var viewClasses = [
			  '[object Int8Array]',
			  '[object Uint8Array]',
			  '[object Uint8ClampedArray]',
			  '[object Int16Array]',
			  '[object Uint16Array]',
			  '[object Int32Array]',
			  '[object Uint32Array]',
			  '[object Float32Array]',
			  '[object Float64Array]'
			]

			var isDataView = function(obj) {
			  return obj && DataView.prototype.isPrototypeOf(obj)
			}

			var isArrayBufferView = ArrayBuffer.isView || function(obj) {
			  return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
			}
		};
//----------------------------------------------------------------------------------------------
		var detectAutoComplete = (function() {

		  function detectAutoComplete() {
				getElements();
				setTimer();
		  }

		  function getElements() {
				this.selects = document.getElementsByTagName('select');
				this.formElements = [];
				for(var i=0; i < this.selects.length; i++) {
					this.formElements.push({element: this.selects.item(i), value: this.selects.item(i).value});
				}
		  }

		  function setTimer() {
				window.setInterval(function() {
					checkElements();
				},1000);
		  }

		  function checkElements() {
				for(el in this.formElements) {
					if(this.formElements[el].element.value != this.formElements[el].value) {
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent('change', true, true);
						this.formElements[el].element.dispatchEvent(evt);
						getElements();
					}
				}
			}
			return detectAutoComplete;
		})();
//----------------------------------------------------------------------------------------------
		const changeParamValue = function(param, value) {
			if (location.href.indexOf("&" + param) == -1) {
				window.location = location.href + "&" + param + "=" + value;
			} else {
				var regex = new RegExp("(&" + param + "=)[^\&]+"); //(&page=)[^\&]+/
				window.location = location.href.replace(regex, '$1' + value);
			}
		};
//----------------------------------------------------------------------------------------------
	  // Calculate an in-between color. Returns a "rgba()" string.
	  // Credit: Edwin Martin <edwin@bitstorm.org>
	  //         http://www.bitstorm.org/jquery/color-animation/jquery.animate-colors.js
	  const calculateColor = function(begin, end, pos) {
			var color = 'rgba('
					+ parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ','
					+ parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ','
					+ parseInt((begin[2] + pos * (end[2] - begin[2])), 10);
			color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
			color += ')';
			return color;
	  };
//----------------------------------------------------------------------------------------------
		const addParamToUrl = function(url, param) {
			return url + (/\?/.test(url) ? '&' : '?') + param;
		};
//----------------------------------------------------------------------------------------------
		//var testDebounce = debounce(() => console.log(new Date().toString()), 1000);
		const debounce = function(func, ms) {
			let timerId;
			return () => {
				if (timerId) {
					clearTimeout(timerId);
					timerId = setTimeout(func, ms);
				} else {
					timerId = setTimeout(func, ms);
				}
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Normalize a port into a number, string, or false.
		 */
		const normalizePort = function(val) {
			let port = parseInt(val, 10);
			if (isNaN(port)) {
				return val;
			}
			if (port >= 0) {
				return port;
			}
			return false;
		};
//----------------------------------------------------------------------------------------------
		const normalizeName = function(name) {
			if (!isString(name)) {
				name = String(name)
			}
			if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
				throw new TypeError('Invalid character in header field name')
			}
			return name.toLowerCase()
		};
//----------------------------------------------------------------------------------------------
		const normalizeValue = function(value) {
			if (!isString(value)) {
				value = String(value);
			}
			return value;
		};
//----------------------------------------------------------------------------------------------
		// Build a destructive iterator for the value list
		const iteratorFor = function(items) {
			const iterator = {
				next: function() {
					var value = items.shift();
					return { value: value, done: (value === undefined) };
				}
			};

			if (support.iterable) {
				iterator[Symbol.iterator] = () => {
					return iterator;
				}
			}
			return iterator
		};
//----------------------------------------------------------------------------------------------
		const pad = function(str, length) {
			while (str.length < length) {
				str = '0' + str;
			}
			return str;
		};
//----------------------------------------------------------------------------------------------
		const getRandomInt = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};
//----------------------------------------------------------------------------------------------
		const getRandomColor = function() {
			return (
				pad(getRandomInt(0, 255).toString(16), 2) +
				pad(getRandomInt(0, 255).toString(16), 2) +
				pad(getRandomInt(0, 255).toString(16), 2)
			);
		};
//----------------------------------------------------------------------------------------------
		const getRegex = function(arr) {
			return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
		};
//----------------------------------------------------------------------------------------------
		//let message = tag`${count} items cost $${count * price}.toFixed(2).`;
		const tag = function(literals, ...substitutions) {
			let result = "";
			for(let i=0;i<substitutions.length;i++) {
				result += literals[i];
				result += substitutions[i];	
			}
			result += literals[literals.lenght - 1];
			return result;
		};
//----------------------------------------------------------------------------------------------
		//let message = tagRaw`Multiline\nstring`;
		const tagRaw = function(literals, ...substitutions) {
			let result = "";
			for(let i=0;i<substitutions.length;i++) {
				result += literals.raw[i];
				result += substitutions[i];	
			}
			result += literals[literals.lenght - 1];
			return result;
		};
//----------------------------------------------------------------------------------------------
		const parseStyleString = function(style, oStyle) {
			var attr, value;
			style.replace(/;\s*$/, '').split(';').forEach(function (chunk) {
				var pair = chunk.split(':');
				attr = pair[0].trim().toLowerCase();
				value =  pair[1].trim();
				oStyle[attr] = value;
			});
		};
//----------------------------------------------------------------------------------------------
		const parseStyleObject = function(style, oStyle) {
			var attr, value;
			for (var prop in style) {
				if (typeof style[prop] === 'undefined') {
					continue;
				}
				attr = prop.toLowerCase();
				value = style[prop];
				oStyle[attr] = value;
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Calculate the sin of an angle, avoiding returning floats for known results
		 * @static
		 * @param {Number} angle the angle in radians or in degree
		 * @return {Number}
		 */
		const sin = function(angle) {
			if (angle === 0) { return 0; }
			var angleSlice = angle / PiBy2, sign = 1;
			if (angle < 0) {
				// sin(-a) = -sin(a)
				sign = -1;
			}
			switch (angleSlice) {
				case 1: return sign;
				case 2: return 0;
				case 3: return -sign;
			}
			return Math.sin(angle);
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Calculate the cos of an angle, avoiding returning floats for known results
		 * @param {Number} angle the angle in radians or in degree
		 * @return {Number}
		 */
		const cos = function(angle) {
			if (angle === 0) { return 1; }
			if (angle < 0) {
				// cos(a) = cos(-a)
				angle = -angle;
			}
			var angleSlice = angle / PiBy2;
			switch (angleSlice) {
				case 1: case 3: return 0;
				case 2: return -1;
			}
			return Math.cos(angle);
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Rotates `vector` with `radians`
		 * @param {Object} vector The vector to rotate (x and y)
		 * @param {Number} radians The radians of the angle for the rotation
		 * @return {Object} The new rotated point
		 */
	   const rotateVector = function(vector, radians) {
		  var sin = globals.toolset.sin(radians),
			  cos = globals.toolset.cos(radians),
			  rx = vector.x * cos - vector.y * sin,
			  ry = vector.x * sin + vector.y * cos;
			  return {
				  x: rx,
				  y: ry
			  };
		};
//----------------------------------------------------------------------------------------------
		const isValid = function(num, lowval, hival) {
			if(!globals.toolset.isNumber(num) || !globals.toolset.isNumber(lowval) || !globals.toolset.isNumber(hival)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of arguments: number < ' + num + ' >, lower border < ' + lowval + ' >, upper border < ' + hival + ' >');//new TypeError('');
			}
			if(lowval > hival) {
				throw globals.exception.argumentException('ArgumentError', 'incorrect arguments: lower border < ' + lowval + ' >, upper border < ' + hival + ' >');//new TypeError('');
			}
			if ((num < hival) && (num > lowval)) {
				return true;
			}
			return false;
		};
//----------------------------------------------------------------------------------------------
		/*var clicky = {
			wasClicked: function() {},
			addListeners: function() {
				var self = this;
				$('.clicky').click(globals.toolset.proxy(this.wasClicked, this)); //this.click.bind(this);
			}
		};*/
		const proxy = function(func, thisObject) {
			if(!globals.toolset.isFunction(func)) {
				throw globals.exception.typeException('TypeError', 'incorrect type value: function < ' + func + ' >');//new TypeError('');
			}
			return (function() {
				return func.apply(thisObject, arguments);
			});
		};
//----------------------------------------------------------------------------------------------
		const makeArray = function(arrayLike) {
			return Array.prototype.slice.call(arrayLike);
			//Array.from(arrayLike);
		};
//----------------------------------------------------------------------------------------------
		//run(function*() {console.log(1); yield; console.log(2); yield; console.log(3);};
		//run(function*() {let value = yield 1; console.log(value); value = yield value + 3; console.log(value);};
		//let fs = require("fs");
		//function readFile(name) {
		//	return function(callback) {
		//		fs.readFile(name, callback);
		//	}
		//};
		//run(function*() { let contents = yield readFile("config.json"); });
		const run = function(tasks) {
			let task = tasks();
			let result = task.next();
			
			function step() {
				if(!result.done) {
					if(isFunction(result.value)) {
						result.value(function(err, data) {
							if(err) {
								result = task.throw(err);
								return;
							}
							result = task.next(data);
							step();
						});
					} else {
						result = task.next(result.value);
						step();
					}
				}
			};
			step();
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns next power of two
		 */
		const nextPow2 = function(x) {
			return Math.pow(2, Math.ceil(Math.log(x)* invLog2));
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	changes type of protocol of the current url
		 */
		const redirect = function(protocol = 'https', except = defaultProtocolsExcept) {
			const proto = protocol + ':';
			if(document.location.protocol !== proto && except.indexOf(document.location.hostname) < 0) {
				document.location.protocol = proto;
			}
		};
//----------------------------------------------------------------------------------------------
		const isArrayIndex = function(key) {
			var numericKey = toUint32(key);
			return (String(numericKey) == key && numericKey < (Math.pow(2, 32) - 1));
		};
//----------------------------------------------------------------------------------------------
		const sum = function(...values) {
			return values.reduce((previous, current) => previous + current, 0);
		};
//----------------------------------------------------------------------------------------------
		const isIterable = function(value) {
			return (value !== null && typeof value[Symbol.iterator] === "function");
		};
//----------------------------------------------------------------------------------------------
		//[2, 5, 9].forEach(logArrayElements);
		const logArrayElements = function(element, index, array) {
			console.log("array[" + index + "] = " + element);
		};
//----------------------------------------------------------------------------------------------
		const eliminateDuplicates = function(items) {
			return [...new Set(items)];
		};
//----------------------------------------------------------------------------------------------
		//console.log(areTheNumbersAlmostEqual(0.1 + 0.2, 0.3));
		const areEqualNumbers = function(num1, num2) {
			return Math.abs(num1 - num2) < Number.EPSILON;
		};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.toolset.helpers = globals.toolset.helpers || {};
//----------------------------------------------------------------------------------------------
			(function() {
//----------------------------------------------------------------------------------------------
				const toUint32 = function(value) {
					return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
				};
//----------------------------------------------------------------------------------------------
				const toFixed = function(number, fractionDigits) {
					return parseFloat(Number(number).toFixed(fractionDigits));
				};
//----------------------------------------------------------------------------------------------
				const isNumber = function isNumber(value) {
					return (value !== null && (typeof value === 'number' || Object.toType(value) === 'number') && isFinite(value));
				};
//----------------------------------------------------------------------------------------------
				//var isInteger = function(x) { return (x ^ 0) === x; };
				//var isInteger = function(x) { return Math.round(x) === x; };
				//var isInteger = function(x) { return (typeof x === 'number') && (x % 1 === 0); };
				const isIntNumber = function(value) {
					return (globals.toolset.isNumber(value) && ((value % 1) === 0) && Number.isSafeInteger(value)); //Math.round(x) === x;
					//return (/^-?\d+$/.test(str));
				};
//----------------------------------------------------------------------------------------------
				const isFloat = function(value) {
					return (Number.isFinite(value) && !Number.isSafeInteger(value));
				};
//----------------------------------------------------------------------------------------------
				// positive only, integer or decimal point
				const isPositiveDecimal = function(value) {
					return ((globals.toolset.isNumber(value) && ((!/\D/.test(value)) || (/^\d+\.\d+$/.test(value)))); //Math.round(x) === x;
				};
//----------------------------------------------------------------------------------------------
				//[a-z],[A-Z],[0-9] only
				const isAlphaNumeric = function(value) {
					return ((globals.toolset.isNumber(value) || globals.toolset.isString(value)) && (!/^\s*$/.test(value) && !/\W/.test(value)));
				};
//----------------------------------------------------------------------------------------------
				const isRealNumber = function(value) {
					return (globals.toolset.isNumber(value) && ((value % 1) !== 0)); //Math.round(x) === x;
				};
//----------------------------------------------------------------------------------------------
				const isString = function(value) {
					return (value !== null && (typeof value === 'string' || Object.toType(value) === 'string'));
				};
//----------------------------------------------------------------------------------------------
				//return myArray.constructor.toString().indexOf("Array") > -1;
				const isArray = function(value) {
					return (value !== null && Object.prototype.toString.apply(value) === '[object Array]');
				};
//----------------------------------------------------------------------------------------------
				const isJSON = function(value) {
					return (value !== null && Object.prototype.toString.apply(value) === '[object JSON]');
				};
//----------------------------------------------------------------------------------------------
				const isObject = function(value) {
					return (value !== null && Object.prototype.toString.apply(value) === '[object Object]');
				};
//----------------------------------------------------------------------------------------------
				/**
				 * returns true if value is date, false - otherwise
				 */
				const isDate = function(value) {
					return (value !== null && Object.prototype.toString.apply(value) === '[object Date]') && isFinite(value);
				};
//----------------------------------------------------------------------------------------------
				const isFunction = function(value) {
					return (value !== null && typeof value === 'function' && value.constructor && value.cal && value.apply);
				};
//----------------------------------------------------------------------------------------------
				const isBoolean = function(value) {
					return (value !== null && (typeof value === 'boolean' || Object.toType(value) === 'boolean'));
				};
//----------------------------------------------------------------------------------------------
				const isNull = function(value) {
					return (value == null);
				};
//----------------------------------------------------------------------------------------------
				const isDomElement = function(value) {
					return (value !== null && value.nodeName && value === document.documentElement && (value instanceof Element || value instanceof Node));
				};
//----------------------------------------------------------------------------------------------
				/**
				 * returns true if value is null or undefined, false - otherwise
				 */
				const isNullOrUndefined = function(value) {
					return (value === null || typeof value === 'undefined');
				};
//----------------------------------------------------------------------------------------------
				const isRegExp = function(value) {
					return (value !== null && Object.toType(value) === 'regexp');
				};	
//----------------------------------------------------------------------------------------------
				globals.toolset.helpers.toUint32 = toUint32;
				globals.toolset.helpers.toFixed = toFixed;
				globals.toolset.helpers.isIntNumber = isIntNumber;
				globals.toolset.helpers.isFloat = isFloat;
				globals.toolset.helpers.isPositiveDecimal = isPositiveDecimal;
				globals.toolset.helpers.isAlphaNumeric = isAlphaNumeric;
				globals.toolset.helpers.isRealNumber = isRealNumber;
				globals.toolset.helpers.isString = isString;
				globals.toolset.helpers.isArray = isArray;
				globals.toolset.helpers.isJSON = isJSON;
				globals.toolset.helpers.isObject = isObject;
				globals.toolset.helpers.isDate = isDate;
				globals.toolset.helpers.isFunction = isFunction;
				globals.toolset.helpers.isBoolean = isBoolean;
				globals.toolset.helpers.isNull = isNull;
				globals.toolset.helpers.isDomElement = isDomElement;
				globals.toolset.helpers.isNullOrUndefined = isNullOrUndefined;
				globals.toolset.helpers.isRegExp = isRegExp;
//----------------------------------------------------------------------------------------------
			}());
		}());
		//var hasRegExpY = hasRegExp("y");
		//var hasRegExpU = hasRegExp("u");
		const hasRegExp = function(value) {
			try {
				var pattern = new RegExp(".", value);
				return true;
			} catch(ex) {
				return false;
			}
		};
//----------------------------------------------------------------------------------------------
		//var res = globals.toolset.printInCol(6, 2);
		const printInCol = function(rows, columns, sep) {
			if(!globals.toolset.isNumber(rows) || !globals.toolset.isNumber(columns)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: number of rows < ' + rows + ' >, number of columns < ' + columns + ' >'
																				};
			}
			sep = (sep == null) ? ' ' : (globals.toolset.isString(sep)) ? sep : null;
			if(sep == null) throw {name: 'ValueError', message: 'incorrect separator value: < ' + sep + ' >'};
			for(var i=1; i<=rows; i++) {
				for(var j=1; j<=columns; j++) {
					document.write((columns *  (i - 1) + j) + sep);
				}
				document.writeln('<br>');
			}
		};
//----------------------------------------------------------------------------------------------
		//var res = globals.toolset.printInRow(6, 4, 'asdf');
		const printInRow = function(rows, columns, sep) {
			if(!globals.toolset.isNumber(rows) || !globals.toolset.isNumber(columns)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: number of rows < ' + rows + ' >, number of columns < ' + columns + ' >'
																				};
			}
			sep = (sep == null) ? ' ' : (globals.toolset.isString(sep)) ? sep : null;
			if(sep == null) throw {name: 'ValueError', message: 'incorrect separator value: < ' + sep + ' >'};
			for(var i=1; i<=rows; i++) {
				for(var j=1; j<=columns; j++) {
					document.write((rows * (j - 1) + i) + sep);
				}
				document.writeln('<br>');
			}
		};
//----------------------------------------------------------------------------------------------
		//var myArray = globals.toolset.vector(10, 0);
		const vector = function(dimension, initial) {
			if(!globals.toolset.isIntNumber(dimension) || dimension < 0) { throw {
																			name: 'ValueError',
																			message: 'incorrect input values: array dimension < ' + dimension + ' >'
																		};
			}
			var arr = [];
			for(var i=0; i<dimension; i++) {
				arr[i] = initial;
			}
			return arr;
		};
//----------------------------------------------------------------------------------------------
		//var myMatrix = globals.toolset.matrix(4, 4, 0);
		const matrix = function(rows, columns, initial) {
			if(!globals.toolset.isIntNumber(rows) || !globals.toolset.isIntNumber(columns) || rows < 0 || columns < 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: number of rows < ' + rows + ' >, number of columns < ' + columns + ' >'
																														};
			}
			var arr, matrix = [];
			for(var i=0; i<rows; i++) {
				arr = [];
				for(var j=0; j<columns; j++) {
					arr[j] = initial;
				}
				matrix[i] = arr;
			}
			return matrix;
		};
//----------------------------------------------------------------------------------------------
		const rangeVector = function (min, max, delta) {
			var res = globals.toolset.vector();
			//
			min = (globals.toolset.isNumber(min)) ? min : null;
			if(min == null) throw {name: 'ValueError', mesage: 'incorrect {min} value: < ' + min + ' >'};
			//
			max = (globals.toolset.isNumber(max)) ? max : null;
			if(max == null) throw {name: 'ValueError', mesage: 'incorrect {max} value: < ' + max + ' >'};
			//
			if(min > max) { throw {
								name: 'ValueError',
								message: 'incorrect range size: min < ' + min + ' >, max < ' + max + ' >'
							};
			}
			//
			delta = (delta == null) ? 1 : (globals.toolset.isNumber(delta) && delta > 0) ? delta : null;
			if(delta == null) throw {name: 'ValueError', mesage: 'incorrect {delta} value: < ' + delta + ' >'};
			
			for (var i=min; i<=max; i+=delta) {
				res.push(i);
			};
			return res;
		};
//----------------------------------------------------------------------------------------------
		//var seqer = globals.toolset.serialMaker();
		//var unique = seqer.gensym();
		//document.writeln(unique);
		const serialMaker = function(prefix, seq) {
			prefix = (prefix == null) ? '' : (globals.toolset.isString(prefix)) ? prefix : null;
			if(prefix == null) throw {name: 'ValueError', mesage: 'incorrect prefix value: < ' + prefix + ' >'};
			//
			seq = (seq == null) ? 0 : (globals.toolset.isNumber(seq)) ? seq : null;
			if(seq == null) throw {name: 'ValueError', mesage: 'incorrect sequence value: < ' + seq + ' >'};
			//
			return {
				gensym: function() {
					return (prefix + (seq++));
				}
			};
		};
//----------------------------------------------------------------------------------------------
		//document.writeln(globals.toolset.parseNum('55.6'));
		const parseNum = function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input string: < ' + str + ' >'
											};
			}
			var regExp = /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i;
			return regExp.exec(str);
		};
//----------------------------------------------------------------------------------------------
		const getElementsByClass = function(searchClass, node, tag) {
			var classElements = [];
			//
			node = (node == null) ? document : (globals.toolset.isDomElement(node)) ? node : null;
			if(node == null) throw {name: 'ValueError', message: 'incorrect node value: < ' + node + ' >'};
			//
			tag = (tag == null) ? '*' : (globals.toolset.isString(tag)) ? tag : null;
			if(tag == null) throw {name: 'ValueError', message: 'incorrect tag value: < ' + tag + ' >'};
			//
			var els = node.getElementsByTagName(tag);
			var regexp = '(^|\\s)' + searchClass + '(\\s|$)';
			var pattern = new RegExp(regexp);
			for(var i=0; i<els.length; i++) {
				if(pattern.test(els[i].className)) {
					classElements.push(els[i]);
				}
			}
			return classElements;
		};
//----------------------------------------------------------------------------------------------
		const getElementsByTagNames = function(list, obj) {
			if(!globals.toolset.isString(list)) { throw {
												name: 'ValueError',
												message: 'incorrect input string: < ' + list + ' >'
											};
			}
			//
			obj = (obj == null) ? document : (globals.toolset.isDomElement(obj)) ? obj : null;
			if(obj == null) throw {name: 'ValueError', message: 'incorrect node value: < ' + obj + ' >'};
			//
			var tagNames = list.split(',');
			var resultArray = [];
			for (var i=0; i<tagNames.length; i++) {
				var tags = obj.getElementsByTagName(tagNames[i]);
				for (var j=0; j<tags.length; j++) {
					resultArray.push(tags[j]);
				}
			}
			var testNode = resultArray[0];
			if (!testNode) return [];
			if (testNode.sourceIndex) {
				resultArray.sort(function (a,b) {
						return (a.sourceIndex - b.sourceIndex);
				});
			} else if (testNode.compareDocumentPosition) {
				resultArray.sort(function (a,b) {
						return (3 - (a.compareDocumentPosition(b) & 6));
				});
			}
			return resultArray;
		};
//----------------------------------------------------------------------------------------------
		const escapee = (function() {
			// Инициализируем таблицу перевода
			var initTransitionTable = function() {
				var trans = [];
				for (var i = 0x410; i <= 0x44F; i++) {
					trans[i] = i - 0x350; // А-Яа-я	
				}
				trans[0x401] = 0xA8;    // Ё
				trans[0x451] = 0xB8;    // ё
				return trans;
			};
			
			return function(str) {
				if(!globals.toolset.isString(str)) { throw {
													name: 'ValueError',
													message: 'incorrect input string: < ' + str + ' >'
												};
				}
				var ret = [], transTable = initTransitionTable();
				// Составляем массив кодов символов, попутно переводим кириллицу
				for (var i = 0; i < str.length; i++) {
					var n = str.charCodeAt(i);
					if (typeof transTable[n] !== 'undefined') {
						n = transTable[n];
					}
					if (n <= 0xFF) ret.push(n);
				}
				return window.escape(String.fromCharCode.apply(null, ret));
			}
		}());
//----------------------------------------------------------------------------------------------
		//КОИ-8
		//document.writeln(globals.toolset.koi2unicode('b'));
		var koi2unicode = function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input string: < ' + str + ' >'
											};
			}
			var charmap = unescape(
			  "%u2500%u2502%u250C%u2510%u2514%u2518%u251C%u2524%u252C%u2534%u253C%u2580%u2584%u2588%u258C%u2590"+
			  "%u2591%u2592%u2593%u2320%u25A0%u2219%u221A%u2248%u2264%u2265%u00A0%u2321%u00B0%u00B2%u00B7%u00F7"+
			  "%u2550%u2551%u2552%u0451%u2553%u2554%u2555%u2556%u2557%u2558%u2559%u255A%u255B%u255C%u255D%u255E"+
			  "%u255F%u2560%u2561%u0401%u2562%u2563%u2564%u2565%u2566%u2567%u2568%u2569%u256A%u256B%u256C%u00A9"+
			  "%u044E%u0430%u0431%u0446%u0434%u0435%u0444%u0433%u0445%u0438%u0439%u043A%u043B%u043C%u043D%u043E"+
			  "%u043F%u044F%u0440%u0441%u0442%u0443%u0436%u0432%u044C%u044B%u0437%u0448%u044D%u0449%u0447%u044A"+
			  "%u042E%u0410%u0411%u0426%u0414%u0415%u0424%u0413%u0425%u0418%u0419%u041A%u041B%u041C%u041D%u041E"+
			  "%u041F%u042F%u0420%u0421%u0422%u0423%u0416%u0412%u042C%u042B%u0417%u0428%u042D%u0429%u0427%u042A")
		   var code2char = function(code) {
				if(code >= 0x80 && code <= 0xFF) return charmap.charAt(code - 0x80);
				return String.fromCharCode(code);
			}
			var res = '';
			for(var i = 0; i < str.length; i++) res += code2char(str.charCodeAt(i));
			return res;
		};
//----------------------------------------------------------------------------------------------
		//Windows-1251
		//document.writeln(globals.toolset.win2unicode('b'));
		var win2unicode = function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input string: < ' + str + ' >'
											};
			}
			var charmap = unescape(
			  "%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+
			  "%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+
			  "%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+
			  "%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457");
			var code2char = function(code) {
				if(code >= 0xC0 && code <= 0xFF) return String.fromCharCode(code - 0xC0 + 0x0410);
				if(code >= 0x80 && code <= 0xBF) return charmap.charAt(code - 0x80);
				return String.fromCharCode(code);
			}
			var res = '';
			for(var i = 0; i < str.length; i++) res += code2char(str.charCodeAt(i));
			return res;
		};
//----------------------------------------------------------------------------------------------
		var guidGenerator = function() {
			const S4 = () => {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
		};
//----------------------------------------------------------------------------------------------
		var revisedRandId = function() {
			return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
		};
//----------------------------------------------------------------------------------------------
		var randomBinary = function() {
			return Math.round(Math.random());
		};
//----------------------------------------------------------------------------------------------
		var rand = function(l, u) {
			if(!globals.toolset.isNumber(l)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {lower border} is not number < ' + l + ' >'
												};
			}
			if(!globals.toolset.isNumber(u))) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {upper border} is not number < ' + u + ' >'
												};
			}
			if(l > u) l = [u, u = l][0];
			return (l + Math.random() * (u - l));
		};
//----------------------------------------------------------------------------------------------
		var randInt = function(l, u) {
			if(!globals.toolset.isIntNumber(l)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {lower border} is not integer number < ' + l + ' >'
												};
			}
			if(!globals.toolset.isIntNumber(u))) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {upper border} is not integer number < ' + u + ' >'
												};
			}
			if(l > u) l = [u, u = l][0];
			return Math.floor(l + Math.random() * (u - l));
		};
//----------------------------------------------------------------------------------------------
		var randUnevenInt = function(l, u) {
			if(!globals.toolset.isIntNumber(l)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {lower border} is not integer number < ' + l + ' >'
												};
			}
			if(!globals.toolset.isIntNumber(u))) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {upper border} is not integer number < ' + u + ' >'
												};
			}
			if(l > u) l = [u, u = l][0];
			return Math.round(l + Math.random() * (u - l));
		};
//----------------------------------------------------------------------------------------------
		//document.writeln(globals.toolset.randInt(0, 10));
		var randBigInt = function() {
			return ((Number.MAX_VALUE * Math.random()).integer());
		};
//----------------------------------------------------------------------------------------------
		//document.writeln(globals.toolset.randBigInt());
		var randWeightedArray = function(numbers) {
			if(!globals.toolset.isArray(numbers)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {numbers} is not array < ' + numbers + ' >'
												};
			}
			var total = 0, dist = globals.toolset.vector();
			numbers.forEach(function(item, index) {
				total += item;
				dist[index] = total;
			});
			var rand = globals.toolset.randInt(0, total);
			dist.forEach(function(item, index) {
				if(rand < item) return index;
			});
		};
//----------------------------------------------------------------------------------------------
		var randWeightedObject = function(numbers) {
			if(!globals.toolset.isObject(numbers)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {numbers} is not object < ' + numbers + ' >'
												};
			}
			var total = 0, dist = {};
			for(var index in numbers) { 
			   if (numbers.hasOwnProperty(index)) {
				   total += numbers[index];
				   dist[index] = total;
			   }
			}
			var rand = globals.toolset.randInt(0, total);
			for(var index in dist) { 
			   if (dist.hasOwnProperty(index)) {
				   if(rand < dist[index]) return index;
			   }
			}
		};
//----------------------------------------------------------------------------------------------
		var randWeightedArrayGen = function(numbers) {
			
			var incrementTotal = function(numbers) {
				var total = 0;
				numbers.forEach(function(item, index){
					total += item;
					yield index => total;
				});
			}:
			
			if(!globals.toolset.isArray(numbers)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {numbers} is not array < ' + numbers + ' >'
												};
			}
			var total = 0;
			numbers.forEach(function(item, index) {
				total += item;
			});
			var rand = globals.toolset.randInt(0, total);
			incrementTotal(numbers).forEach(function(item, index) {
				if(rand < item) return index;
			});
		};
//----------------------------------------------------------------------------------------------
		var randWeightedObjGen = function(numbers) {
			
			var incrementTotal = function(numbers) {
				var total = 0;
				for(var index in numbers) { 
				   if (numbers.hasOwnProperty(index)) {
					   total += numbers[index];
					   yield index => total;
				   }
				}
			}:
			
			if(!globals.toolset.isObject(numbers)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: {numbers} is not object < ' + numbers + ' >'
												};
			}
			var total = 0;
			for(var index in numbers) { 
			   if (numbers.hasOwnProperty(index)) {
				   total += numbers[index];
			   }
			}
			var rand = globals.toolset.randInt(0, total);
			for(var index in incrementTotal(numbers)) { 
			   if (numbers.hasOwnProperty(index)) {
				   if(rand < numbers[index]) return index;
			   }
			}
		};
//----------------------------------------------------------------------------------------------
		var isset = function isset(varName) {
			return varName && (typeof varName !== 'undefined');
		};
//----------------------------------------------------------------------------------------------
		var guid = function() {
			return 'xxxxxxxx-xxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = ((c == 'x') ? r : (r & 0x3 | 0x8));
				return v.toString(16);
			}).toUpperCase();
		};
//----------------------------------------------------------------------------------------------
		var byId = function(node) {
			return (globals.toolset.isString(node)) ? document.getElementById(node) : (globals.toolset.isDomElement(node)) ? node : null;
		};
//----------------------------------------------------------------------------------------------
		var sign = function(x) {
			if(!globals.toolset.isNumber(x)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: < ' + x + ' >'
											};
			}
			return (x < 0) ? -1 : (x == 0) ? 0 : 1;
		};
//----------------------------------------------------------------------------------------------
		var sign2 = function(a) {
			return flip((a >> 31) & 0x1);
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns the color by username
		 */
		var getColorByUsername = function(username, colors) {
			colors = isArray(colors) ? colors : DEFAULT_COLORS_PRESET;
			var hash = 7;
			for (var i = 0; i < username.length; i++) {
				hash = username.charCodeAt(i) + (hash << 5) - hash;
			}
			var index = Math.abs(hash % colors.length);
			return colors[index];
		};
//----------------------------------------------------------------------------------------------
		var dump = function(obj) {
			var out = '';
			if(obj && typeof(obj) == 'object'){
				for (var i in obj) {
					out += i + ': ' + obj[i] + 'n';
				}
			} else {
				out = obj;
			}
			return out;
		};
//----------------------------------------------------------------------------------------------
		var md5 = function(str) {
		
			var md5_ = (function() {
				var l='length',
				h=[
					'0123456789abcdef',0x0F,0x80,0xFFFF,
					0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476
					],
				x=[
					[0,1,[7,12,17,22]],
					[1,5,[5, 9,14,20]],
					[5,3,[4,11,16,23]],
					[0,7,[6,10,15,21]]
				],
				A = function(x,y,z) {
					return(((x>>16)+(y>>16)+((z=(x&h[3])+(y&h[3]))>>16))<<16)|(z&h[3])
				},
				B = function(s) {
					var n=((s[l]+8)>>6)+1,b=new Array(1+n*16).join('0').split('');
					for(var i=0;i<s[l];i++) b[i>>2]|=s.charCodeAt(i)<<((i%4)*8);
					return(b[i>>2]|=h[2]<<((i%4)*8),b[n*16-2]=s[l]*8,b)
				},
				R = function(n,c){return(n<<c)|(n>>>(32-c))},
				C = function(q,a,b,x,s,t){return A(R(A(A(a,q),A(x,t)),s),b)},
				F = function(a,b,c,d,x,s,t){return C((b&c)|((~b)&d),a,b,x,s,t)},
				G = function(a,b,c,d,x,s,t){return C((b&d)|(c&(~d)),a,b,x,s,t)},
				H = function(a,b,c,d,x,s,t){return C(b^c^d,a,b,x,s,t)},
				I = function(a,b,c,d,x,s,t){return C(c^(b|(~d)),a,b,x,s,t)},
				_ = [F,G,H,I],
				S = (function(){
					with(Math) for(var i=0,a=[],x=pow(2,32);i<64;a[i]=floor(abs(sin(++i))*x));
					return a
				})(),
				X = function (n) {
					for(var j=0,s='';j<4;j++)
						s+=h[0].charAt((n>>(j*8+4))&h[1])+h[0].charAt((n>>(j*8))&h[1]);
					return s
				};
				return function(s) {
					var $=B(''+s),a=[0,1,2,3],b=[0,3,2,1],v=[h[4],h[5],h[6],h[7]];
					for(var i,j,k,N=0,J=0,o=[].concat(v);N<$[l];N+=16,o=[].concat(v),J=0) {
						for(i=0;i<4;i++)
							for(j=0;j<4;j++)
								for(k=0;k<4;k++,a.unshift(a.pop()))
									v[b[k]]=_[i](
										v[a[0]],
										v[a[1]],
										v[a[2]],
										v[a[3]],
										$[N+(((j*4+k)*x[i][1]+x[i][0])%16)],
										x[i][2][k],
										S[J++]
									);
						for(i=0;i<4;i++)
							v[i]=A(v[i],o[i]);
					}
					return X(v[0])+X(v[1])+X(v[2])+X(v[3]);
				};
			}());
			
			var init = function(str) {
				// Инициализируем таблицу перевода
				var trans = [];
				for (var i = 0x410; i <= 0x44F; i++)
				trans[i] = i - 0x350; // А-Яа-я
				trans[0x401] = 0xA8; // Ё
				trans[0x451] = 0xB8; // ё
				
				var ret = [];
				for (var i = 0; i < str.length; i++) {
					var n = str.charCodeAt(i);
					if(typeof trans[n] != 'undefined') n = trans[n];
					if(n <= 0xFF) ret.push(n);
				}
				return ret;
			};
			
			if(!globals.toolset.isString(str)) { throw {
													name: 'ValueError',
													message: 'incorrect input value: string < ' + str + ' >'
												};
			}
			var ret = init(str);
			return md5_(String.fromCharCode.apply(null, ret));
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns color representation in RGB format
		 */
		var colorize = function(color, params = {r: 0.299, g: 0.587, b: 0.114}) {
			color = (color.startsWith('#') ? color.substring(1) : color);
			let c = parseInt(color, 16);
			let r = (c & 0xFF0000) >> 16;
			let g = (c & 0x00FF00) >> 8;
			let b = (c & 0x0000FF);
			return (params.r * r + params.g * g + params.b * b);
		};	
//----------------------------------------------------------------------------------------------
		/**
		 * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
		 * @private
		 * @param {Number} r Red color value
		 * @param {Number} g Green color value
		 * @param {Number} b Blue color value
		 * @return {Array} Hsl color
		 */
		var rgbToHsl: function(r, g, b) {
		  r /= 255; g /= 255; b /= 255;

		  var h, s, l,
			  max = fabric.util.array.max([r, g, b]),
			  min = fabric.util.array.min([r, g, b]);

		  l = (max + min) / 2;

		  if (max === min) {
			h = s = 0; // achromatic
		  }
		  else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
			  case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			  case g:
				h = (b - r) / d + 2;
				break;
			  case b:
				h = (r - g) / d + 4;
				break;
			}
			h /= 6;
		  }

		  return [
			Math.round(h * 360),
			Math.round(s * 100),
			Math.round(l * 100)
		  ];
		};
//----------------------------------------------------------------------------------------------
		  /**
		   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
		   * @static
		   * @memberOf fabric.Color
		   * @param {String} color ex: FF5555 or FF5544CC (RGBa)
		   * @return {Array} source
		   */
		var sourceFromHex = function(color) {
			if (color.match(Color.reHex)) {
			  var value = color.slice(color.indexOf('#') + 1),
				  isShortNotation = (value.length === 3 || value.length === 4),
				  isRGBa = (value.length === 8 || value.length === 4),
				  r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
				  g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
				  b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6),
				  a = isRGBa ? (isShortNotation ? (value.charAt(3) + value.charAt(3)) : value.substring(6, 8)) : 'FF';

			  return [
				parseInt(r, 16),
				parseInt(g, 16),
				parseInt(b, 16),
				parseFloat((parseInt(a, 16) / 255).toFixed(2))
			  ];
			}
		  };
//----------------------------------------------------------------------------------------------
		  /**
		   * @private
		   * @param {Number} p
		   * @param {Number} q
		   * @param {Number} t
		   * @return {Number}
		   */
		  function hue2rgb(p, q, t) {
			if (t < 0) {
			  t += 1;
			}
			if (t > 1) {
			  t -= 1;
			}
			if (t < 1 / 6) {
			  return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
			  return q;
			}
			if (t < 2 / 3) {
			  return p + (q - p) * (2 / 3 - t) * 6;
			}
			return p;
		  };
//----------------------------------------------------------------------------------------------
		var wordwrap = function(str, width, brk, cut) {
			brk = brk || 'n';
			width = width || 75;
			cut = cut || false;
		   
			if (!str) { return str; }
			var regex = '.{1,' + width + '}(\s|$)' + (cut ? '|.{' + width + '}|.+': '|\S+?(\s|$)');
		   
			return str.match(RegExp(regex, 'g')).join(brk);
		};
//----------------------------------------------------------------------------------------------
		//document.writeln('dec2bin: ' + globals.toolset.dec2bin(7, 4));
		var dec2bin = function(dec, length) {
			if(!globals.toolset.isIntNumber(dec) || !globals.toolset.isIntNumber(length)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: decimal < ' + dec + ' >, output length < ' + length + ' >'
																					};
			}
			var out = '';
			while(length--)
				out += (dec >> length) & 1;    
			return out;  
		};
//----------------------------------------------------------------------------------------------
		var copyOfArray = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: array < ' + array + ' >'
											};
			}
			var res = [];
			array.forEach(function(item, i) {
				(globals.toolset.isArray(item)) ? res.push(item.slice(0)) : res.push(item);
			});
			return res;//return array.slice(0);
		};
//----------------------------------------------------------------------------------------------
		//document.writeln(globals.toolset.createAndFillArray(0, 10, function(x) {return x + 2}));
		var createAndFillArray = function(start, end, func) {
			if(globals.toolset.isNull(start) || globals.toolset.isNull(end) || !globals.toolset.isFunction(func)) { throw {
																												name: 'ValueError',
																												message: 'incorrect input values: start < ' + start + ' >, end < ' + end + ' >, function of elements < ' + func + ' >'
																											};
			}
			var res = [];
			for(var i=start; i<end; i = func(i)) {
				res.push(i);
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		//document.writeln(globals.toolset.randomString());
		var randomString = function(strLength) {
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			var randomStr = '';
			//
			strLength = (strLength == null) ? 8 : (globals.toolset.isIntNumber(strLength) && strLength > 0) ? strLength : null;
			if(strLength == null) throw {name: 'ValueError', mesage: 'incorrect string length: < ' + strLength + ' >'};
			//
			for(var i=0; i<strLength; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomStr += chars.substring(rnum, rnum + 1);
			}
			return randomStr;
		};
//----------------------------------------------------------------------------------------------
		var prefixAverages = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: not array < ' + array + ' >'
												};
			}
			var len = array.length - 1;
			var res = globals.toolset.vector(len, 0);
			for(var i=0, temp=0; i<len; i++) {
				temp += array[i];
				res[i] = Math.floor(temp / (i + 1));
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		var errorHandler = function(msg, url, line) {
			var txt = 'There was an error on this page.\n\n';
			txt += 'Error: ' + msg + '\n\n';
			txt += 'URL: ' + url + '\n\n';
			txt += 'Line: ' + line + '\n\n';
			txt += 'Click OK to continue.\n\n';
			console.log(txt);
			return true;
		};
//----------------------------------------------------------------------------------------------
		var getQueryString = function(param) {
			var reg = new RegExp("(^|&)" + param + "=([^&*])(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				return unescape(r[2]);
			}
			return null;
		};
//----------------------------------------------------------------------------------------------
		//var startPage = globals.toolset.getParameterByName('start_page');
		//if(isNaN(parseInt(statPage))) {
		//	startPage = 1;
		//};
		var getParameterByName = function(name) {
			if(!globals.toolset.isString(name)) { throw {
												name: 'ValueError',
												message: 'incorrect parameter value: < ' + name + ' >'
											};
			}
			var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
			return match && decodeURIComponent(match[1].replace(/\+/g), ' ');
		};
//----------------------------------------------------------------------------------------------
		var checkEmail = function(emailStr) {
			var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return (filter.test(emailStr) ? true : false);
		};
//----------------------------------------------------------------------------------------------
		var dump = function(obj, indent) {
			if(obj === "null") return "null";
			if(obj === "undefined") return "undefined";
			if(globals.toolset.isString(obj)) return '"' + obj + '"';
			if(globals.toolset.isObject(obj)) return String(obj);
			if(globals.toolset.isNumber(obj)) return String(obj);
			if(globals.toolset.isBoolean(obj)) return String(obj);
			
			indent = (indent == null) ? " " : (globals.toolset.isString(indent)) ? indent : null;
			if(indent == null) throw {name: 'ValueError', message: 'incorrect indent value: < ' + indent + ' >'};
			
			var str = "{\n";
			for(var key in obj) {
				str += indent + " " + key + " = ";
				str += globals.toolset.dump(obj[key], indent + " ");
			}
			return str + indent + "}"
		};
//----------------------------------------------------------------------------------------------
		var tabExpand = function(str) {
			
			var tabExpand_ = function(str, p1, p2, offset, s) {
				var tab = 8;
				return p1 + ' '.repeat(p2.length * tab - (p1.length % tab));
			};
			
			if(!globals.toolset.isString(str)) { throw {
												name: 'TypeError',
												message: 'incorrect parameter argument: not a string < ' + str + ' >'
											};
			}
			while(str.indexOf('\t') != -1) {
				str = str.replace('/^([^\t\n]*)(\t+)/m', tabExpand_);
			}
			return str;
		};
//----------------------------------------------------------------------------------------------
		var tabUnexpand = function(str) {
			
			var tabExpand_ = function(str, p1, p2, offset, s) {
				var tab = 8;
				return p1 + ' '.repeat(p2.length * tab - (p1.length % tab));
			};
			
			var chunkString = function(str, length) {
				return str.match(new RegExp('.{1,' + length + '}', 'g'));
				//str.match(/.{1,n}/g); 
				//str.match(/(.|[\r\n]){1,n}/g);
			};
			
			if(!globals.toolset.isString(str)) { throw {
												name: 'TypeError',
												message: 'incorrect parameter argument: not a string < ' + str + ' >'
											};
			}
			var tab = 8;
			var lines = str.split('\n');
			var line;
			for(var i=0; i<lines.length; i++) {
				line = tabExpand_(lines[i]);
				chunks = chunkString(line, tab);
				for(var j=0; j<chunks.length-1; j++) {
					chunks[j] = str.replace('/ {2,}$/', '\t');
				}
				if(chunks[chunks.length-1] == ' '.repeat(tab)) {
					chunks[chunks.length-1] = '\t';
				}
				lines[i] = chunks.join('');
			}
			return lines.join('\n');
		};
//----------------------------------------------------------------------------------------------
    /**
     * Returns string representation of function body
     * @param {Function} fn Function to get body of
     * @return {String} Function body
     */
    var getFunctionBody = function(fn) {
		return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
    };
//----------------------------------------------------------------------------------------------
    /**
     * Loads image element from given url and passes it to a callback
     * @param {String} url URL representing an image
     * @param {Function} callback Callback; invoked with loaded image
     * @param {*} [context] Context to invoke callback in
     * @param {Object} [crossOrigin] crossOrigin value to set image element to
     */
    var loadImage = function(url, callback, context, crossOrigin) {
		if (!url) {
			callback && callback.call(context, url);
			return;
		}

		var img = fabric.util.createImage();

		/** @ignore */
		var onLoadCallback = function () {
			callback && callback.call(context, img);
			img = img.onload = img.onerror = null;
		};

		img.onload = onLoadCallback;
		/** @ignore */
		img.onerror = function() {
			callback && callback.call(context, null, true);
			img = img.onload = img.onerror = null;
		};

		if (url.indexOf('data') !== 0 && crossOrigin) {
			img.crossOrigin = crossOrigin;
		}

		// IE10 / IE11-Fix: SVG contents from data: URI
		// will only be available if the IMG is present
		// in the DOM (and visible)
		if (url.substring(0,14) === 'data:image/svg') {
			img.onload = null;
			fabric.util.loadImageInDom(img, onLoadCallback);
		}
		img.src = url;
    };
//----------------------------------------------------------------------------------------------
		var pointerX = function(event) {
			return event.clientX;
			//return _getPointer(event, 'pageX', 'clientX');
		};
		var pointerY = function(event) {
			return event.clientY;
			//return _getPointer(event, 'pageY', 'clientY');
		};
	  /**
	   * Cross-browser wrapper for getting event's coordinates
	   * @param {Event} event Event object
	   */
	  var getPointer = function(event) {
			event || (event = window.event);
			var element = event.target || (typeof event.srcElement !== unknown ? event.srcElement : null),
				scroll = getScrollLeftTop(element);
			return {
				x: pointerX(event) + scroll.left,
				y: pointerY(event) + scroll.top
			};
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Cross-browser wrapper for setting element's style
	   * @param {HTMLElement} element
	   * @param {Object} styles
	   * @return {HTMLElement} Element that was passed as a first argument
	   */
	  var setStyle = function(element, styles) {
			var elementStyle = element.style;
			if (!elementStyle) {
				return element;
			}
			if (typeof styles === 'string') {
				element.style.cssText += ';' + styles;
				return styles.indexOf('opacity') > -1
						? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1])
						: element;
			}
			for (var property in styles) {
				if (property === 'opacity') {
					setOpacity(element, styles[property]);
				} else {
					var normalizedProperty = (property === 'float' || property === 'cssFloat')
						? (typeof elementStyle.styleFloat === 'undefined' ? 'cssFloat' : 'styleFloat')
						: property;
					elementStyle[normalizedProperty] = styles[property];
				}
			}
			return element;
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Takes id and returns an element with that id (if one exists in a document)
	   * @param {String|HTMLElement} id
	   * @return {HTMLElement|null}
	   */
	  var getId = function(id) {
		return (typeof id === 'string') ? document.getElementById(id) : id;
	  };
//----------------------------------------------------------------------------------------------
	var is32Bit(ch) {
		return ch.codePointAt(0) > 0xFFFF;
	};
//----------------------------------------------------------------------------------------------
	  var elementById = function(doc, id) {
			var el;
			doc.getElementById && (el = doc.getElementById(id));
			if (el) {
				return el;
			}
			var node, i, len, nodelist = doc.getElementsByTagName('*');
			for (i = 0, len = nodelist.length; i < len; i++) {
				node = nodelist[i];
				if (id === node.getAttribute('id')) {
					return node;
				}
			}
	  };
//----------------------------------------------------------------------------------------------
	  /**
       * Converts an array-like object (e.g. arguments or NodeList) to an array
       * @param {Object} arrayLike
       * @return {Array}
       */
      var toArray = function(arrayLike) {
			return _slice.call(arrayLike, 0);
      };
//----------------------------------------------------------------------------------------------
	  var _getPointer = function(event, pageProp, clientProp) {
			var touchProp = event.type === 'touchend' ? 'changedTouches' : 'touches';
			var pointer, eventTouchProp = event[touchProp];

			if (eventTouchProp && eventTouchProp[0]) {
				pointer = eventTouchProp[0][clientProp];
			}
			if (typeof pointer === 'undefined') {
				pointer = event[clientProp];
			}
			return pointer;
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Creates specified element with specified attributes
	   * @param {String} tagName Type of an element to create
	   * @param {Object} [attributes] Attributes to set on an element
	   * @return {HTMLElement} Newly created element
	   */
	  var makeElement = function(tagName, attributes) {
			var el = document.createElement(tagName);
			for (var prop in attributes) {
				if (prop === 'class') {
					el.className = attributes[prop];
				} else if (prop === 'for') {
					el.htmlFor = attributes[prop];
				} else {
					el.setAttribute(prop, attributes[prop]);
				}
			}
			return el;
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Adds class to an element
	   * @param {HTMLElement} element Element to add class to
	   * @param {String} className Class to add to an element
	   */
	  var addClass = function(element, className) {
			if (element && (' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
				element.className += (element.className ? ' ' : '') + className;
			}
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Wraps element with another element
	   * @param {HTMLElement} element Element to wrap
	   * @param {HTMLElement|String} wrapper Element to wrap with
	   * @param {Object} [attributes] Attributes to set on a wrapper
	   * @return {HTMLElement} wrapper
	   */
	  var wrapElement = function(element, wrapper, attributes) {
			if (typeof wrapper === 'string') {
				wrapper = makeElement(wrapper, attributes);
			}
			if (element.parentNode) {
				element.parentNode.replaceChild(wrapper, element);
			}
			wrapper.appendChild(element);
			return wrapper;
	  };
//----------------------------------------------------------------------------------------------
	 /**
	   * Returns element scroll offsets
	   * @param {HTMLElement} element Element to operate on
	   * @return {Object} Object with left/top values
	   */
	  var getScrollLeftTop = function(element) {
		var left = 0, top = 0,
			docElement = document.documentElement,
			body = document.body || { scrollLeft: 0, scrollTop: 0 };
			// While loop checks (and then sets element to) .parentNode OR .host
			//  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
			//  but the .parentNode of a root ShadowDOM node will always be null, instead
			//  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
			while (element && (element.parentNode || element.host)) {
				  // Set element to element parent, or 'host' in case of ShadowDOM
				  element = element.parentNode || element.host;

				  if (element === document) {
						left = body.scrollLeft || docElement.scrollLeft || 0;
						top = body.scrollTop ||  docElement.scrollTop || 0;
				  } else {
						left += element.scrollLeft || 0;
						top += element.scrollTop || 0;
				  }

				  if (element.nodeType === 1 && element.style.position === 'fixed') {
						break;
				  }
			}
			return { left: left, top: top };
	  };
//----------------------------------------------------------------------------------------------
	 /**
	   * Returns offset for a given element
	   * @param {HTMLElement} element Element to get offset for
	   * @return {Object} Object with "left" and "top" properties
	   */
	  var getElementOffset = function(element) {
			var docElem,
				doc = element && element.ownerDocument,
				box = { left: 0, top: 0 },
				offset = { left: 0, top: 0 },
				scrollLeftTop,
				offsetAttributes = {
					  borderLeftWidth: 'left',
					  borderTopWidth:  'top',
					  paddingLeft:     'left',
					  paddingTop:      'top'
				};
			if (!doc) {
				return offset;
			}
			for (var attr in offsetAttributes) {
			  offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
			}
			docElem = doc.documentElement;
			if ( typeof element.getBoundingClientRect !== 'undefined' ) {
				box = element.getBoundingClientRect();
			}
			scrollLeftTop = getScrollLeftTop(element);
			return {
				left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
				top: box.top + scrollLeftTop.top - (docElem.clientTop || 0)  + offset.top
			};
	  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Returns style attribute value of a given element
	   * @param {HTMLElement} element Element to get style attribute for
	   * @param {String} attr Style attribute to get for element
	   * @return {String} Style attribute value of the given element.
	   */
		var getElementStyle = function(element, attr) {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				var style = document.defaultView.getComputedStyle(element, null);
				return style ? style[attr] : undefined;
			} else {
				var value = element.style[attr];
				if (!value && element.currentStyle) {
					value = element.currentStyle[attr];
				}
				return value;
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Inserts a script element with a given url into a document; invokes callback, when that script is finished loading
		 * @param {String} url URL of a script to load
		 * @param {Function} callback Callback to execute when script is finished loading
		 */
		function getScript(url, callback) {
				var headEl = document.getElementsByTagName('head')[0],
					scriptEl = document.createElement('script'),
					loading = true;

			  scriptEl.onload = scriptEl.onreadystatechange = function(e) {
				if (loading) {
					if (typeof this.readyState === 'string' && this.readyState !== 'loaded' && this.readyState !== 'complete') {
						return;
					}
					loading = false;
					callback(e || window.event);
					scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
				}
			  };
			  scriptEl.src = url;
			  headEl.appendChild(scriptEl);
		};
//----------------------------------------------------------------------------------------------
	var calcVectorAngle = function(ux, uy, vx, vy) {
		var ta = Math.atan2(uy, ux),
			tb = Math.atan2(vy, vx);
		if (tb >= ta) {
		  return tb - ta;
		} else {
		  return 2 * Math.PI - (ta - tb);
		}
	};
//----------------------------------------------------------------------------------------------
		(function(globals) {
			globals.staticMethod('setAlias', function(shortName, longName) {
				if(!this[shortName]) {
					if(DEBUG_MODE) {
						console.log('alias < ' + shortName + ' > is added to < ' + longName + ' >');
					}
					var methods = longName.split('.');
					var result = this;
					for(var i=0; i<methods.length; i++) {
						result = result[methods[i]];
					};
					this[shortName] = result;//longName
				}
			});
			setAlias('toRadians', 'globals.toolset.convertToRadians');
			setAlias('toDegrees', 'globals.toolset.convertToDegrees');
			setAlias('isValid', 'globals.toolset.isValid');
			setAlias('parseNum', 'globals.toolset.parseNum');
			setAlias('byClass', 'globals.toolset.getElementsByClass');
			setAlias('byTag', 'globals.toolset.getElementsByTagNames');
			setAlias('byId', 'globals.toolset.byId');
			setAlias('isNumber', 'globals.toolset.isNumber');
			setAlias('isIntNumber', 'globals.toolset.isIntNumber');
			setAlias('isRealNumber', 'globals.toolset.isRealNumber');
			setAlias('isString', 'globals.toolset.isString');
			setAlias('isArray', 'globals.toolset.isArray');
			setAlias('isObject', 'globals.toolset.isObject');
			setAlias('isFunction', 'globals.toolset.isFunction');
			setAlias('isBoolean', 'globals.toolset.isBoolean');
			setAlias('isNull', 'globals.toolset.isNull');
			setAlias('isDomElement', 'globals.toolset.isDomElement');
			setAlias('log', 'globals.toolset.logArrayElements');
			setAlias('onproxy', 'globals.toolset.proxy');
			setAlias('onerror', 'globals.toolset.errorHandler');
		}(globals));
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.toolset.convertToRadians = convertToRadians;
		globals.toolset.convertToDegrees = convertToDegrees;
		globals.toolset.sin = sin;
		globals.toolset.cos = cos;
		globals.toolset.rotateVector = rotateVector;
		globals.toolset.isValid = isValid;
		globals.toolset.proxy = proxy;
		globals.toolset.logArrayElements = logArrayElements;
		globals.toolset.isNumber = isNumber;
		globals.toolset.isIntNumber = isIntNumber;
		globals.toolset.isPositiveDecimal = isPositiveDecimal;
		globals.toolset.isAlphaNumeric = isAlphaNumeric;
		globals.toolset.isRealNumber = isRealNumber;
		globals.toolset.isString = isString;
		globals.toolset.isArray = isArray;
		globals.toolset.isObject = isObject;
		globals.toolset.isFunction = isFunction;
		globals.toolset.isBoolean = isBoolean;
		globals.toolset.isNull = isNull;
		globals.toolset.isDomElement = isDomElement;
		globals.toolset.isRegExp = isRegExp;
		globals.toolset.printInCol = printInCol;
		globals.toolset.printInRow = printInRow;
		globals.toolset.vector = vector;
		globals.toolset.matrix = matrix;
		globals.toolset.rangeVector = rangeVector;
		globals.toolset.serialMaker = serialMaker;
		globals.toolset.parseNum = parseNum;
		globals.toolset.getElementsByClass = getElementsByClass;
		globals.toolset.getElementsByTagNames = getElementsByTagNames;
		globals.toolset.escape = escapee;
		globals.toolset.koi2unicode = koi2unicode;
		globals.toolset.win2unicode = win2unicode;
		globals.toolset.rand = rand;
		globals.toolset.randInt = randInt;
		globals.toolset.randUnevenInt = randUnevenInt;
		globals.toolset.randBigInt = randBigInt;
		globals.toolset.randWeightedArray = randWeightedArray;
		globals.toolset.randWeightedObject = randWeightedArray;
		globals.toolset.randWeightedArrayGen = randWeightedArrayGen;
		globals.toolset.randWeightedObjectGen = randWeightedObjectGen;
		globals.toolset.isset = isset;
		globals.toolset.guid = guid;
		globals.toolset.byId = byId;
		globals.toolset.sign = sign;
		globals.toolset.dump = dump;
		globals.toolset.md5 = md5;
		globals.toolset.wordwrap = wordwrap;
		globals.toolset.hashCode = hashCode;
		globals.toolset.doubleEquals = doubleEquals;
		globals.toolset.doubleLess = doubleEquals;
		globals.toolset.doubleGreater = doubleGreater;
		globals.toolset.dec2bin = dec2bin;
		globals.toolset.copyOfArray = copyOfArray;
		globals.toolset.createAndFillArray = createAndFillArray;
		globals.toolset.randomString = randomString;
		globals.toolset.prefixAverages = prefixAverages;
		globals.toolset.errorHandler = errorHandler;
		globals.toolset.getQueryString = getQueryString;
		globals.toolset.getParameterByName = getParameterByName;
		globals.toolset.checkEmail = checkEmail;
		globals.toolset.tabExpand = tabExpand;
		globals.toolset.tabUnexpand = tabUnexpand;
	}());
//----------------------------------------------------------------------------------------------
}(typeof exports !== 'undefined' ? exports : this));