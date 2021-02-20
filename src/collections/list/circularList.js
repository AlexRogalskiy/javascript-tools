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
	const isCirularList = (value) => (value instanceof globals.collections.list.CircularList);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, dep_ending on the arguments.
	* @return {Object} Cirular List.
	*
	* @example
	* var myList = globals.collections.list.CircularList([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.list = globals.collections.list || {};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.list.iterator = globals.collections.list.iterator || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _head = null;
				var _current = null;
				var _previous = null;
				var _last = null;
				var _index = null;
				
				var that = {};
				that.hasNext = function() {
					return (_current != null);// && _current.getNext() != null);
				};
				that.next = function() {
					if(!this.hasNext()) return (_previous = null);
					_index++;
					_last = _previous;
					_previous = _current;
					_current = _current.getNext();
					return _previous;
				};
				that.nextIndex = function() {
					if(!this.hasNext()) return _index;
					return (_index + 1);
				};
				that.remove = function() {
					if(_previous == null) return false;
					if(_previous === _head) {
						_head = null;
						delete _previous;
						//_previous = null;
						return true;
					}
					_last.setNext(_current);
					delete _previous;
					//_previous = null;
					_index--;
					return true;
				};
				that.add = function(node) {
					if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					if(node == null) return false;
					if(_head === null) {
						_head = _current = node;
					} else {
						node.setNext(_previous);
						if(_last != null) _last.setNext(node);
						_last = node;
					}
					_index++;
				};
				
				function ListIterator(head) {
					_head = head;
					_current = head;
					_previous = null;
					_last = null;
					_index = -1;
				};
				ListIterator.prototype = that;
				
				globals.collections.list.iterator.ListIterator = ListIterator;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
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
					if(!(node instanceof globals.collections.list.node.ListNode)) {
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
					if(!(node instanceof globals.collections.list.node.ListNode)) return false;
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
					console.log("(data: {" + _data.toString() + "}, next: {" + _next + "})");
				};
				
				function ListNode(data, next) {
					_data = Object.clone(data);
					_next = next;
				};
				ListNode.prototype = that;
				
				globals.collections.list.node.ListNode = ListNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _last = null;
			var _count = null;
			
			var isInRange = function(num) {
				return (num < _count && num >= 0);
			};
			
			var that = {};
			that.insertHead = function(item) {
				if(_last == null) {
					_last = new globals.collections.list.node.ListNode(item, null);
					_last.setNext(_last);
				} else {
					_last.setNext(new globals.collections.list.node.ListNode(data, _last.getNext()));
				}
				_count++;
			};
			that.insertTail = function(item) {
				this.insertHead(item);
				_last = _last.getNext();
				_count++;
			};
			that.removeHead = function() {
				if(this.isEmpty()) return null;
				var removed = _last.getNext().getData();
				if(_last.getNext() == _last) {
					_last = null;
				} else {
					_last.setNext(_last.getNext().getNext());
				}
				_count--;
				return removed;
			};
			that.head = function() {
				if(this.isEmpty()) return null;
				return _last.getNext().getData();
			};
			that.tail = function() {
				if(this.isEmpty()) return null;
				return _last.getData();
			};
			that.isEmpty = function() {
				return (_last == null || this.size() == 0);
			};
			that.size = function() {
				return (_count);
			};
			that.clone = function() {
				return new globals.collections.list.CircularList(this.entries(), compare);
			};
			that.add = function(data) {
				if(_start === null) {
					_start = new globals.collections.list.node.ListNode(data, null);
					_end = _start;
				} else {
					var node = new globals.collections.list.node.ListNode(data, null);
					_end.setNext(node);
					_end = _end.getNext();
				}
				//_count++;
			};
			that.addSort = function(data) {
				if(_start === null) {
					_start = new globals.collections.list.node.ListNode(data, null);
					_end = _start;
				} else {
					var current = _start, previous = null;
					while(current !== null && compare(current.getData(), data) < 0) {
						previous = current;
						current = current.getNext();
					}
					var newNode = new globals.collections.list.node.ListNode(data, current);
					if(current == null) {
						_end = newNode;
					}
					if(previous == null) {
						_start = newNode;
					} else {
						previous.setNext(newNode);
					}
				}
				//_count++;
			};
			that.addNode = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				if(node == null) return false;
				if(_start === null) {
					_start = node;
					_end = _start;
				} else {
					_end.setNext(node);
					_end = _end.getNext();
				}
				//_count++;
				return true;
			};
			that.addAll = function(list) {
				if(list != null && !isList(list)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: list  < ' + list + ' >'
					};
				}
				if(list == null) return false;
				var iterator = list.iterator();
				while(iterator.hasNext()) {
					this.addNode(iterator.next());
					//_count++;
				}
				return true;
			};
			that.removeNode = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				if(node == null) return false;
				if(this.isEmpty()) return null;
				
				var current = _start;
				var previous = _start;
				while(current !== null) {
					if(current == node) {
						if(current === _start) {
							_start = current.getNext();
							//_count--;
							delete current;
							return true;
						}
						if(current === _end) {
							_end = previous;
						}
						previous.setNext(current.getNext());
						//_count--;
						delete current;
						return true;
					}
					previous = current;
					current = current.getNext();
				}
				return false;
			};
			that.remove = function(data) {
				var current = _start, previous = null, removed = null;
				var found = false;
				while(current !== null) {
					if(compare(data, current.getData()) == 0) {
						removed = current;
						found = true;
						if(previous != null) {
							previous.setNext(current.getNext());
						} else {
							_start = current.getNext();
						}
					} else {
						previous = current;
					}
					current = current.getNext();
					if(removed != null) {
						//_count--;
						delete removed;
						removed = null;
					}
				}
				_end = previous;
				return found;
			};
			that.removeAt = function(i) {
				if(!globals.toolset.isIntNumber(i)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not positive integer number < ' + i + ' >'
														};
				}
				if(!isInRange(i)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + i + ' > is out of range {0,' + this.size() + '}');
				}
				var current = _start;
				var previous = _start;
				var removed = null;
				while(current !== null) {
					if(i-- === 0) {
						if(current === _start) {
							_start = current.getNext();
							//_count--;
							removed = current.getData();
							delete current;
							return removed;
						}
						if(current === _end) {
							_end = previous;
						}
						previous.setNext(current.getNext());
						//_count--;
						removed = current.getData();
						delete current;
						return removed;
					}
					previous = current;
					current = current.getNext();
				}
				return removed;
			};
			that.addAt = function(data, i) {
				if(!globals.toolset.isIntNumber(i) || i < 0) { throw {
																name: 'ValueError',
																message: 'incorrect index value: < ' + i + ' >'
															};
				}
				var current = _start;
				var previous = _start;
				while(current !== null) {
					if(i-- === 0) {
						if(current === _start) {
							current = new globals.collections.list.node.ListNode(data, null);
							current.setNext(_start);
							_start = current;
							//_count--;
							return true;
						}
						if(current === _end) {
							current = new globals.collections.list.node.ListNode(data, null);
							current.setNext(_end);
							previous.setNext(current);
							//_count--;
							return true;
						}
						var node = new globals.collections.list.node.ListNode(data, null);
						node.setNext(current);
						previous.setNext(node);
						//_count--;
						return true;
					}
					previous = current;
					current = current.getNext();
				}
				return false;
			};
			that.removeAll = function() {
				if(_start == null) return false;
				var current = _start, temp;
				while(current !== null) {
					temp = current;
					current = current.getNext();
					//_count--;
					delete temp;
				};
				/*do {
					temp = current;
					current = current.getNext();
					//_count--;
					delete temp;
				} while(current != _end);*/
				_start = _end = null;
				return true;
			};
			that.toString = function() {
				return this.entries.join(' ');
			};
			that.hasDuplicates = function() {
				var previous = _start, current;
				while(previous !== null) {
					current = previous.getNext();
					while(current !== null) {
						if(compare(current, previous) == 0) {
							return true;
						}
						current = current.getNext();
					}
					previous = previous.getNext();
				}
				return false;
			};
			that.reverse = function() {
				var here = _start, previous = null, next;
				for(; here !== null; next = here.getNext(), here.setNext(previous), previous = here, here = next);
				return previous;
			};
			that.insertAsFirst = function(data) {
				var node = new globals.collections.list.node.ListNode(data, _start);
				if(this.isEmpty()) {
					_start = _end = node;
				} else {
					_start = node;
				}
				//_count++;
			};
			that.insertAsLast = function(data) {
				var node = new globals.collections.list.node.ListNode(data, null);
				if(this.isEmpty()) {
					_start = _end = node;
				} else {
					_end.setNext(node);
					_end = node;
				}
				//_count++; -> getCount();
			};
			that.removeAsFirst = function() {
				if(this.isEmpty()) return null;
				var removed = _start;
				if(_start === _end) { 
					_start = _end = null;
				} else {
					_start = _start.getNext();
				}
				var data = removed.getData();
				//_count--;
				delete removed;
				return data;
			};
			that.removeAsLast = function() {
				if(this.isEmpty()) return null;
				var removed = _end;
				if(_start === _end) {
					_start = _end = null;
				} else {
					var current = _start, previous;
					while(current !== _end) {
						previous = current;
						current = current.getNext();
					}
					_end = previous;
				}
				var data = removed.getData();
				//_count--;
				delete removed;
				return data;
			};
			that.findMToLastElement = function(m) {
				if(!globals.toolset.isIntNumber(m)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: < ' + m + ' >'
													};
				}
				if(this.isEmpty()) return null;
				if(m <= 0) return null;
				
				var current = _start;
				for(var i=0; i<m-1; i++) {
					if(current.getNext()) {
						current = current.getNext();
					} else {
						return null;
					}
				}
				
				if(current == null) return null;
				
				var previous = _start;
				while(current.getNext()) {
					current = current.getNext();
					previous = previous.getNext();
				}
				return previous;
			};
			that.removeDuplicates = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				if(this.isEmpty()) return null;
				var current = node || _start;

				while(current != null) {
					var runner = current;
					while(runner.getNext()) {
						if(compare(runner.getNext(), current) == 0) {
							var temp = runner.getNext();
							runner.setNext(runner.getNext().getNext());
							//_count--;
							delete temp;
						} else {
							runner = runner.getNext();
						}
					}
					current = current.getNext();
				}
			};
			/*that.removeDuplicates = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				if(this.isEmpty()) return null;
				var current = node || _start;

				var table = new globals.collections.map.Map();//HashTable
				var previous = null;
				while(current != null) {
					if(table.containsKey(current.getData())) {
						var temp = current;
						previous.setNext(current.getNext());
					} else {
						table.put(current.getData(), true);
						previous = current;
					}
					current = current.getNext();
					//_count--;
					delete temp;
				}
			};*/
			that.insertAfter = function(node, data) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				//var current = _start;
				//while(current !== null) {
					//if(compare(current, node) == 0) { //current === node
						//var temp = new globals.collections.list.node.ListNode(data, current.getNext());
						var temp = new globals.collections.list.node.ListNode(data, node.getNext());
						if(node === _end) {
							_end = temp;
						}
						node.setNext(temp);
						//_count++;
						return true;
					//}
					//current = current.getNext();
				//}
			};
			that.sort = function() {
				var current = _start, temp;
				while(current !== null) {
					currentNext = current.getNext();
					while(currentNext !== null) {
						if(compare(current, currentNext) < 0) {
							temp = current.getData();
							current.setData(currentNext.getData());
							currentNext.setData(temp);
						}
						currentNext = currentNext.getNext();
					}
					current = current.getNext();
				}
			};
			that.head = function() {
				return this.item(0);
			};
			that.tail = function() {
				return this.item(this.size());
			};
			that.item = function(i) {
				if(!globals.toolset.isIntNumber(i) || i < 0) { throw {
																name: 'ValueError',
																message: 'incorrect index: < ' + i + ' >'
															};
				}
				var current = _start;
				while(current !== null) {
					if(i-- === 0) {
						return current;
					}
					current = current.getNext();
				}
				return null;
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'TypeError',
														message: 'incorrect function value: not a function < ' + func + ' >'
													};
				}
				if(this.isEmpty()) return null;
				var current = _start;
				while(current !== null) {
					func(current);
					//current = func(current);
					current = current.getNext();
				}
				/*do {
					current = func(current);
					current = current.getNext();
				} while(current != _end);*/
			};
			that.findBeginning = function() {
				var slow = _start;//node || _start
				var fast = _start;//node || _start
				
				while(fast != null && fast.getNext() != null) {
					slow = slow.getNext();
					fast = fast.getNext().getNext();
					if(slow == fast) {
						break;
					}
				}
				
				if(fast == null || fast.getNext() == null) {
					return null;
				}
				
				slow = _start;//node || _start
				while(slow != fast) {
					slow = slow.getNext();
					fast = fast.getNext();
				}
				return fast;
			};
			that.entries = function() {
				if(this.isEmpty()) return null;
				var result = [], current = _start;
				do {
					result.push(current.getData());
					current = current.getNext();
				} while(current != _end);
				return result;
			};
			that.isEmpty = function() {
				return (_start === null);
			};
			that.has = function(data) {
				var current = _start;
				while(current !== null) {
					if(compare(data, current.getData()) == 0) {
						return true;
					}
					current = current.getNext();
				}
				return false;
			};
			that.size = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				var current = node || _start;
				var index = 0;
				while(current !== null) {
					index++;
					current = current.getNext();
				}
				return index;
			};
			that.isLoop = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				if(this.isEmpty()) return false;
				node = node || _start;
				var slow = node, fast = node.getNext();
				while(true) {
					if(!fast || !fast.getNext()) {
						return false;
					} else if(fast == slow || fast.getNext() == slow) {
						return true;
					} else {
						slow = slow.getNext();
						fast = fast.getNext().getNext();
					}			
				}
			};
			that.isRadar = function(node) {
				
				var result = function(node, result) {
					return {'node': node, 'result': result};
				};
				
				var isRadar_ = function(head, len) {
					if(head == null || len == 0) {
						return result(null, true);
					} else if(len == 1) {
						return result(head.getNext(), true);
					} else if(len == 2) {
						return result(head.getNext().getNext(), compare(head, head.getNext()) == 0);
					}
					var res = isRadar_(head.getNext(), len - 2);
					if(!res.result || res.node == null) {
						return res;
					} else {
						res.result = (compare(head, res.node) == 0);
						res.node = res.node.getNext();
						return res;
					}
				};
				
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				
				var current = node || _start;
				var p = isRadar_(current, this.size(current));
				return p.result;
			};
			that.partition = function(node, data) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				
				var before_start = null;
				var after_start = null;
				
				var current = node || _start;
				while(current != null) {
					var next = current.getNext();
					if(compare(current.getData(), data) < 0) {
						current.setNext(before_start);
						before_start = current;
					} else {
						current.setNext(after_start);
						after_start = current;
					}
					current = next;
				}
				
				if(before_start == null) {
					return after_start;
				}
				
				var head = before_start;
				while(before_start.getNext() != null) {
					before_start = before_start.getNext();
				}
				before_start.setNext(after_start);
				return head;
			};
			that.iterator = function(node) {
				if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node  < ' + node + ' >'
					};
				}
				var current = node || _start;
				return new globals.collections.list.iterator.ListIterator(current);
			};
			that.equalLists = function(list) {
				if(list != null && !(list instanceof globals.collections.list.CircularList)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: list  < ' + list + ' >'
					};
				}
				if(list == null) return false;
				var equal = true;
				var it1 = this.iterator();
				var it2 = list.iterator();
				for(; equal && it1.hasNext() && it2.hasNext();) {
					equal = (it1.next().equals(it2.next()));
				}
				return (equal && !it1.hasNext() && !it2.hasNext());
			};
			that.distinct = function() {
				//if(this.isEmpty()) return false;
				for(var it=this.iterator(); it.hasNext();) {
					var item = it.next();
					var count = 0;
					for(var jt=this.iterator(); jt.hasNext();) {
						if(jt.next().equals(item)) {
							count++;
						}
						if(count > 1) return false;
					}
				}
				return true;
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.insertHead(nodes[i]);
					}
				}
			};
			
			function CircularList(nodes, cmp) {
				_last = null;
				_count = 0;
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			CircularList.prototype = that;
			
			globals.collections.list.CircularList = CircularList;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));