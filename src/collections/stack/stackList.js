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
	const isStackList = (value) => (value instanceof globals.collections.stack.StackList);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Stack.
	*
	* @example
	* var myStack = new globals.collections.stack.StackList([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.stack = globals.collections.stack || {};
//----------------------------------------------------------------------------------------------		
		(function() {
			var _list = null;
			//var _count = null;
			
			var that = {};
			that.push = function(value) {
				_list.insertAsFirst(value);
				
				//var node = new globals.collections.list.node.ListNode(value);
				//node.setNext(_list);
				//_list = node;
				//_count++;
			};
			that.pop = function() {
				if(this.isEmpty()) return null;
				var elem = _list.removeAsFirst();
				if(elem != null) return elem.getData();
				return null;
				
				//var current = _list;
				//var item = _list.getData();
				//_list = _list.getNext();
				//delete current;
				//_count--;
				//return item;
			};
			that.peek = function() {
				if(this.isEmpty()) return null;
				var elem = _list.head();
				if(elem != null) return elem.getData();
				return null;
			};
			that.entries = function() {
				if(this.isEmpty()) return null;
				return _list.entries();
			};
			that.removeAll = function() {
				return _list.removeAll();
			};
			that.clone = function() {
				return new globals.collections.stack.StackList(this.entries(), compare);
			};
			that.isEmpty = function() {
				return _list.isEmpty();
			};
			that.size = function() {
				return _list.size();
			};
			that.has = function(value) {
				return _list.has(value);
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				_list.each(func);
			};
			
			
			
			
			that.remove = function(value) {
				if(!this.has(value)) {
					return null;
				}
				data.splice(data.lastIndexOf(value), 1);
			};
			that.removeAt = function(index) {
				if(!globals.toolset.isIntNumber(index) || index < 0) { throw {
																		name: 'ValueError',
																		message: 'incorrect input value: index < ' + index + ' >'
																};
				}
				if(index > data.length) {
					return null;
				}
				data.splice(-index, 1);
			};
			that.values = function() {
				var res = [];//data.slice(0);
				data.forEach(function(item, i) {
					(globals.toolset.isArray(item)) ? res.push(item.slice(0)) : res.push(item);
				});
				return res;
			};
			that.sort = function(stack) {
				if(!(stack instanceof globals.collections.stack.Stack)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: stack < ' + stack + ' >'
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
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeError',
															message: 'incorrect initialization value: not array < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.push(Object.clone(nodes[i])); //data.push(nodes[i]);
					}
				}
			};
			
			function StackList(nodes, cmp) {
				_list = new globals.collections.list.List();
				//_count = 0;
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			StackList.prototype = that;
			
			globals.collections.stack.StackList = StackList;
		}());
//----------------------------------------------------------------------------------------------	
	}());
}(typeof exports !== 'undefined' ? exports : this));