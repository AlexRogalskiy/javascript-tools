;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	var compare = function(a, b) {
		var hasProperty = function(obj, prop) {
			var proto = obj.__proto__ || obj.constructor.prototype;
			return (prop in obj) || ((prop in proto) || proto[prop] === obj[prop]);
			//return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
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
	const isBinSet = (value) => (value instanceof globals.collections.set.BinSet);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Integer} maxVal Collection size.
	* @param {Integer} bins Number of chunks.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Binary Set.
	*
	* @example
	* var myBitSet = new globals.collections.set.BinSet({}, {}, {}, {}, {}, {});
	*/
	(function() {
		globals.collections.set = globals.collections.set || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
		const DEFAULT_BINS = 4;
//----------------------------------------------------------------------------------------------
		/*var node = (function() {
			globals.collections.list.node = globals.collections.list.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _data = null;
				var _next = null;
				
				var that = {};
				that.getData = function() {
					return _data;
				};
				that.setData = function(data) {
					_data = Object.clone(data);
				};
				that.getNext = function() {
					return _next;
				};
				that.setNext = function(next) {
					_next = next;
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.list.node.BinSetNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					return compare(_data, node.getData());
					//return (_data < node.getData() ? -1 : (_data === node.getData() ? 0 : 1));
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.list.node.BinSetNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					return (_data === node.getData());// && _next === node.getNext());
					//return (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
					//		(_next == node.getNext() || (_next != null && _next.equals(node.getNext())));
				};
				that.hashCode = function() {
					var sfVal;
					var hashValue = 11;
					sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					//sfVal = (_next == null) ? 0 : _next.hashCode();
					//hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					console.log("(_data: {" + _data.toString() + "}, next: {" + _next + "})");
				};
				
				function BinSetNode(data, next) {
					_data = Object.clone(data);
					_next = next;
				};
				BinSetNode.prototype = that;
				
				globals.collections.list.node.BinSetNode = BinSetNode;
			}());
		}());*/
//----------------------------------------------------------------------------------------------
		(function() {
			var _sentinel = null;
			var _maxSize = null;
			var _bins = null;
			var _data = null;
			var _count = 0;
			
			var that = {};
			that.insert = function(value) {
				var rinsert_ = function rinsert_(p, t) {
					var order = compare(p._data, t);
					if(order < 0) {
						p.next = rinsert(p.next, t);
					} else if(order > 0) {
						p = makeNode(t, p);
						_count++;
					}
					return p;
				};
				var i = Math.floor(value / (1 + _maxSize / _bins));
				_data[i] = rinsert_(_data[i], value);
			};
			that.report = function() {
				var result = [];
				for(var i=0; i<_bins; i++) {
					for(var node = _data[i]; compare(node._data, _sentinel._data) != 0; node = node.next) {
						result.push(node._data);
					}
				}
				return result;
			};
			that.has = function(value) {
				var i = Math.floor(value / (1 + _maxSize / _bins));
				var current = _data[i];
				while(compare(current._data, _sentinel._data) != 0) {
					if(compare(value, current._data) == 0) {
						return true;
					}
					current = current.next;
				}
				return false;
			};
			that.remove = function(value) {
				var i = Math.floor(value / (1 + _maxSize / _bins));
				var current = _data[i];
				var previous = _data[i];
				while(compare(current._data, _sentinel._data) != 0) {
					if(compare(value, current._data) == 0) {
						if(current == _data[i]) {
							_data[i] = current.next;
							delete current;
							return;
						}
						previous.next = current.next;
						delete current;
						return;
					}
					previous = current;
					current = current.next;
				}
				_count--;
			};
			that.removeAll = function() {
				if(this.isEmpty()) return;
				for(var i=0; i<_bins; i++) {
					var current = _data[i], temp;
					while(compare(current._data, end._data) != 0) {
						temp = current;
						current = current.next;
						delete temp;
					}
					_data[i] = current;
				}
				_count = 0;
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				if(this.isEmpty()) return;
				for(var i=0; i<_bins; i++) {
					var current = _data[i], temp;
					while(compare(current._data, end._data) != 0) {
						func(current);
						current = current.next;
					}
				}
			};
			that.size = function() {
				return _data.length;
			};
			that.isEmpty = function() {
				return (this.getCount() === 0);
			};
			that.getCount = function() {
				return _count;
			};
			that.clone = function() {
				return new globals.collections.set.BinSet(this.report(), _maxSize, _bins, compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.insert(nodes[i]);
					}
				} else {
					for(var i=0; i<_bins; i++) {
						_data[i] = _sentinel;
					}
				}
			};
			
			function BinSet(nodes, maxVal, _bins, cmp) {
				_sentinel = new globals.collections.list.node.ListNode(Number.MAX_VALUE, null);

				_maxSize = (maxVal == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(maxVal) && maxVal > 0) ? maxVal : null);
				if(_maxSize == null) throw {name: 'ValueError', mesage: 'incorrect max size value: < ' + _maxSize + ' >'};

				_bins = (bins == null) ? DEFAULT_BINS : ((globals.toolset.isIntNumber(bins) && bins > 0) ? bins : null);
				if(_bins == null) throw {name: 'ValueError', mesage: 'incorrect {number of _bins} value: < ' + _bins + ' >'};

				_data = globals.toolset.vector(_bins, 0);
				_count = 0;
				
				initialize(nodes);
			
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			BinSet.prototype = that;
			
			globals.collections.set.BinSet = BinSet;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));