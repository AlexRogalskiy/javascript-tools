;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	var compare = function(a, b) {
		var hasProperty = function(obj, prop) {
			var proto = obj.__proto__ || obj.constructor.prototype;
			return (prop in obj) || ((prop in proto) || proto[prop] === obj[prop]);
		}
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			if(hasProperty(a, 'compareTo')) {
				return a.compareTo(b);
			} else {
				return a < b ? -1 : 1;//a.localCompare(b)
			}
		}
		return typeof a < typeof b ? -1 : 1;
	};
//----------------------------------------------------------------------------------------------
	const isStack = (value) => (value instanceof globals.collections.stack.Stack);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Stack.
	*
	* @example
	* var myStack = new globals.collections.stack.Stack([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.stack = globals.collections.stack || {};
//----------------------------------------------------------------------------------------------
		(function() {
			var _data = null;
			var _min = null;
			
			var isInRange = function(num) {
				return (num < _data.length && num >= 0);
			};
			
			var that = {};
			that.push = function(value) {
				if(compare(value, this.min()) <= 0) {
					_min.push(value);
				}
				_data.push(value);
			};
			that.pop = function() {
				if(this.isEmpty()) return null;
				var value = _data.pop();
				if(compare(value, this.min()) == 0) {
					_min.pop();
				}
				return value;
			};
			that.min = function() {
				if(_min.length == 0) {
					return Number.MAX_VALUE;
				} else {
					return _min[_min.length - 1];
				}
			};
			that.peek = function() {
				if(this.isEmpty()) return null;
				return _data[this.size() - 1];
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'TypeError',
														message: 'incorrect input value: not a function < ' + func + ' >'
												};
				}
				for(var i=0; i<this.size(); i++) {
					_data[i] = func(_data[i], i);
					//func(_data[i], i);
				}
			};
			that.remove = function(value) {
				if(!this.has(value)) {
					return null;
				}
				_min.splice(_min.lastIndexOf(value), 1);
				_data.splice(_data.lastIndexOf(value), 1);
			};
			that.removeAt = function(index) {
				if(this.isEmpty()) return null;
				if(!globals.toolset.isIntNumber(index)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not positive integer number < ' + index + ' >'
														};
				}
				if(!isInRange(index)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}');
				}
				_min.splice(_min.lastIndexOf(_data[index]), 1);
				_data.splice(index, 1);
			};
			that.removeAll = function() {
				_min.splice(0, _min.length);
				_data.splice(0, this.size());
			};
			that.values = function() {
				var res = globals.toolset.vector();//_data.slice(0);
				_data.forEach(function(item, i) {
					//(globals.toolset.isArray(item)) ? res.push(item.slice(0)) : res.push(item);
					res.push(Object.clone(item));
				});
				return res;
			};
			that.sort = function(stack) {
				if(!(stack instanceof globals.collections.stack.Stack)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: not a Stack < ' + stack + ' >'
					};
				}
				while(!stack.isEmpty()) {
					var tmp = stack.pop();
					while(!this.isEmpty() && this.peek() > tmp) {
						stack.push(this.pop());
					}
					this.push(tmp);
				}
				return this;
			};
			that.dup = function() {
				if(this.isEmpty()) return null;
				_data.push(this.peek());
			};
			that.swap = function() {
				if(this.isEmpty()) return null;
				var a = this.pop();
				var b = this.pop();
				this.push(a);
				this.push(b);
			};
			that.copy = function(index) {
				if(this.isEmpty()) return null;
				if(!globals.toolset.isIntNumber(index)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not positive integer number < ' + index + ' >'
														};
				}
				if(!isInRange(index)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}');
				}
				var elem = _data[this.size() - index];
				this.push(elem);
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.has = function(value) {
				return (_data.lastIndexOf(value) !== -1);
			};
			that.size = function() {
				return _data.length;
			};
			that.clone = function() {
				return new globals.collections.stack.Stack(_data, compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeError',
															message: 'incorrect initialization value: not array < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.push(Object.clone(nodes[i])); //_data.push(nodes[i]);
					}
				}
			};
			
			function Stack(nodes, cmp) {
				_data = globals.toolset.vector();
				_min = globals.toolset.vector();
				
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Stack.prototype = that;
			
			globals.collections.stack.Stack = Stack;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));