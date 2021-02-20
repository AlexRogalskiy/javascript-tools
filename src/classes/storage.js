var globals = (function() {
	return this;
}());
globals = globals || {};

(function (globals) {
	'use strict';
	
	globals.collections = globals.collections || {};
	
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Graph.
	*
	* @example
	* var myQueue = new globals.collections.graph.LGraph([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		
		globals.utils.cache = globals.utils.cache || {};
		
		const BACON_NUMBER = -1;
		
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
		
		var isStorage = function(x) {
			return (x instanceof globals.utils.cache.Storage);
		};
		
		var block = (function() {
			
			globals.utils.cache.block = globals.collections.graph.block || {};

			(function() {
				
				const DEFAULT_SIZE = 0;
				
				var _data = null;
				var _size = null;
				
				var that = {};
				that.elementAt = function(index) {
					return _data[index];
				};
				that.setElementAt = function(index, value) {
					_data[index] = Object.clone(value);
				};
				//that.getData = function() {
				//	return _data;
				//};
				that.size = function() {
					return _size;
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.utils.cache.block.MemoryBlock)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					return compare(_size, node.size());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.utils.cache.block.MemoryBlock)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					return ((_size == node.size() || (_size != null && _size.equals(node.size()))));
							//(_data == node.getData() || (_data != null && _data.equals(node.getData()))));
				};
				that.hashCode = function() {
					var hashValue = 11;
					var sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					sfVal = (_size == null) ? 0 : _size.hashCode();
					hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					console.log("block (data: {" + _data.toString() + "}, size: {" + _size + "})");
				};
				
				function MemoryBlock(data, size) {
					_data = Object.clone(data);
					_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
					if(_size == null) throw {name: 'ValueError', mesage: 'incorrect size value: not positive integer number < ' + _size + ' >'};
				};
				MemoryBlock.prototype = that;
				
				globals.utils.cache.block.MemoryBlock = MemoryBlock;
				
			}());
		}());
			
		var storage = (function() {
			
			var _queue = null;
			
			var that = {};
			that.getBlock = function(size) {
				
			}:
			that.putBlock = function(block) {
				if(block == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input parameter: block < ' + block + ' >'
					};
				}
				if(!(block instanceof globals.utils.cache.block.MemoryBlock)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: block < ' + block + ' >'
					};
				}
			};
			
			
			that.clone = function() {
				return new globals.collections.graph.Graph(_queue.entries(), compare);
			};
			that.isEmpty = function() {
				return _queue.isEmpty();
			};
			that.size = function() {
				return _queue.size();
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.add(nodes[i]);//data.push(element);
					}
				}
			};
			
			function Storage() {
				_queue = new globals.collections.list.LinkedList();
				//_src = globals.toolset.vector();
				
				initialize(nodes);
			};
			Storage.prototype = that;
			
			globals.utils.cache.Storage = Storage;
			
		}());
	}());

}(globals));