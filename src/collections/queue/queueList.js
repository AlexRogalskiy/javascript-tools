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
	const isQueueList = (value) => (value instanceof globals.collections.queue.QueueList);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Queue.
	*
	* @example
	* var myQueue = new globals.collections.queue.QueueList([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.queue = globals.collections.queue || {};
//----------------------------------------------------------------------------------------------
		(function() {
			//var _first = null;
			//var _last = null;
			//var _count = null;
			var _list = null;
			
			var that = {};
			that.enqueue = function(value) {
			/*	if(_first == null) {
					_last = new globals.collections.list.node.ListNode(value);
					_first = _last;
				} else {
					var node = new globals.collections.list.node.ListNode(value);
					_last.setNext(node);
					_last = _last.getNext();
				}
				_count++;
				*/
				_list.insertAsLast(value);
			};
			that.dequeue = function() {
			/*	if(this.isEmpty()) return null;
				var current = _first;
				var item = _first.getData();
				_first = _first.getNext();
				delete current;
				_count--;
				return item;
				*/
				return _list.removeAsFirst(value);
			};
			that.first = function() {
				/*if(this.isEmpty()) return null;
				return _first;*/
				return _list.head();
			};
			that.last = function() {
				/*if(this.isEmpty()) return null;
				return _last;*/
				return _list.tail();
			};
			that.each = function(func) {
				_list.each(func);
			};
			that.remove = function(value) {
				return _list.remove(value);
			};
			that.removeAt = function(index) {
				return _list.removeAt(index);
			};
			that.removeAll = function() {
				return _list.removeAll();
			};
			that.updateAt = function(index, value) {
				var node = _list.item(index);
				if(node != null) {
					var updated = node.getData();
					node.setData(value);
					return updated;
				}
				return null;
			};
			that.peekAt = function(index) {
				var node = _list.item(index);
				if(node != null) {
					return node.getData();
				}
				return null;
			};
			that.entries = function() {
				return _list.entries();
			};
			that.isEmpty = function() {
				return _list.isEmpty();
			};
			that.has = function(value) {
				return _list.has(value);
			};
			that.size = function() {
				return _list.size();
			};
			that.clone = function() {
				return new globals.collections.queue.QueueList(this.entries(), compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.enqueue(nodes[i]); //data.push(nodes[i]);
					}
				}
			};
			
			function QueueList(nodes, cmp) {
				//_first = null;
				//_last = null;
				//_count = 0;
				
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
				_list = new globals.collections.list.List(nodes, compare);
				initialize(nodes);
			};
			QueueList.prototype = that;
			
			globals.collections.queue.QueueList = QueueList;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));