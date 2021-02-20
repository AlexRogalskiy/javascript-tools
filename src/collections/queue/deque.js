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
	const isDeque = (value) => (value instanceof globals.collections.queue.Deque);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Double-ended queue
	*
	* @example
	* var myDeque = new globals.collections.queue.Deque([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.queue = globals.collections.queue || {};
//----------------------------------------------------------------------------------------------
		(function() {
			var data = null;
			
			var isInRange = function(num) {
				return (num < data.length && num >= 0);
			};
			
			var that = {};
			that.pushback = function(value) {
				data.push(value);
			};
			that.popback = function() {
				if(this.isEmpty()) {
					return null;
				}
				return data.pop();
			};
			that.pushFront = function(value) {
				data.unshift(value);
			};
			that.popFront = function() {
				if(this.isEmpty()) {
					return null;
				}
				return data.shift();
			};
			that.head = function() {
				if(this.isEmpty()) return null;
				return _data[0];
			};
			that.tail = function() {
				if(this.isEmpty()) return null;
				return _data[this.size()-1];
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				for(var i=0; i<this.size(); i++) {
					_data[i] = func(_data[i], i);
					//func(data[i], i);
				}
			};
			//that.remove = function(value) {
			//	if(!this.has(value)) {
			//		return null;
			//	}
			//	data.splice(data.indexOf(value), 1);
			//};
			that.removeAll = function() {
				data.splice(0, this.size());
			};
			that.entries = function() {
				var res = globals.toolset.vector();//_data.slice(0);
				_data.forEach(function(item, i) {
					res.push(Object.clone(item));
				});
				return res;
			};
			that.entriesReverse = function() {
				return this.entries().reverse();
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.has = function(value) {
				return (data.indexOf(value) !== -1);
			};
			that.size = function() {
				return data.length;
			};
			that.clone = function() {
				return new globals.collections.queue.Deque(this.entries(), compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeError',
															message: 'incorrect initialization argument: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.pushback(nodes[i]); //_data.push(nodes[i]);
					}
				}
			};
			
			function Deque(nodes, cmp) {
				_data = globals.toolset.vector();
				
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Deque.prototype = that;
			
			globals.collections.queue.Deque = Deque;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));