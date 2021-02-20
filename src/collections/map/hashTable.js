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
				return a.localCompare(b);
			}
		}
		return typeof a < typeof b ? -1 : 1;
	};
//----------------------------------------------------------------------------------------------
	const isHashTable = (value) => (value instanceof globals.collections.map.HashTable);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Integer} size Collection _size.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Hash Table.
	*
	* @example
	* var myHashTable = new globals.collections.map.HashTable({}, {}, {}, {}, {}, {});
	*/
	(function() {
		globals.collections.map = globals.collections.map || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
		const RATIO = 37;
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.map.node = globals.collections.map.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _name = null;
				var _telephone = null;
				var _address = null;
				var _next = null;
				
				var that = {};
				that.getName = function() {
					return _name;
				};
				that.setName = function(name) {
					_name = name;
				};
				that.getTelephone = function() {
					return _telephone;
				};
				that.setTelephone = function(telephone) {
					_telephone = telephone;
				};
				that.getAddress = function() {
					return _address;
				};
				that.setAddress = function(address) {
					_address = address;
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
							message: 'incorrect input parameter: node is null < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.user.node.UserNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: not UserNode instance  < ' + node + ' >'
						};
					}
					return compare(_name, node.getName());
					//return (_data < node.getData() ? -1 : (_data === node.getData() ? 0 : 1));
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.user.node.UserNode))) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_data === node.getData());// && _next === node.getNext());
					return ((_name == node.getName() || (_name != null && _name.equals(node.getName()))) &&
							(_telephone == node.getTelephone() || (_telephone != null && _telephone.equals(node.getTelephone()))) &&
							(_name == node.getName() || (_name != null && _name.equals(node.getName()))) &&
							(_address == node.getAddress() || (_address != null && _address.equals(node.getAddress()))) &&
							(_next == node.getNext() || (_next != null && _next.equals(node.getNext()))));
				};
				that.hashCode = function() {
					var sfVal;
					var hashValue = 11;
					
					sfVal = (_name == null) ? 0 : _name.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_telephone == null) ? 0 : _telephone.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_address == null) ? 0 : _address.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_next == null) ? 0 : _next.hashCode();
					hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					return "[name: {" + _name.toString() + "}, telephone: {" + _telephone.toString() + ", address: {" + _telephone.toString() + "}]";
				};
				
				function UserNode(name, telephone, address, next) {
					_name = name;
					_telephone = telephone;
					_address = address;
					_next = next;
				};
				UserNode.prototype = that;
				
				globals.collections.map.node.UserNode = UserNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _dict = null;
			var _count = null;
			
			var hashCode = function(value) {
				var val = 0;
				for(var i=0; i<value.length; i++) {
					val = value[i].charCodeAt(i) + val * RATIO;
				}
				return val % _size;
			};
				
			var that = {};
			that.find = function(name) {
				if(this.isEmpty()) return null;
				for(var pm = _dict[hashCode(name)]; pm != null; pm = pm.getNext()) {
					if(compare(pm.getName(), name) === 0) {
						return pm;
					}
				}
				return null;
			};
			that.entries = function() {
				var result = globals.toolset.vector();
				for(var i=0; i<this._size(); i++) {
					for(var pm = _dict[i]; pm != null; pm = pm.getNext()) {
						//temp = {'name': pm.fio, 'telephone': pm.tel, 'address': pm.addr};
						result.push(Object.clone(pm));
					}
				}
				return result;
			};
			that.add = function(node) {
				if(node != null && !(node instanceof globals.collections.user.node.UserNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not UserNode instance < ' + node + ' >'
					};
				}
				var val = hashCode(node.getName());
				//if((item = this.find(name)) == null) {
					node.setNext(_dict[val]);
					_dict[val] = Object.clone(node);
				//} else {
				//	node.setNext(_dict[val]);
				//	_dict[val] = Object.clone(node);
				//}
				_count++;
			};
			that.remove = function(name) {
				var val = hashCode(name), item, temp;
				if((item = this.find(name)) == null) {
					return false;
				}
				//if(compare(item, _dict[val]) == 0) {
				//	_dict[val] = null;
				//} else {
					for(temp = _dict[val]; compare(temp, item) != 0; temp = temp.getNext());
					temp.setNext(item.getNext());
				//}
				delete item;
				_count--;
			};
			that.removeAll = function() {
				var item;
				for(var i=0; i<this._size(); i++) {
					if(_dict[i] !== null) {
						temp = _dict[i];
						do {
							item = temp;
							temp = temp.getNext();
							delete item;
						} while(temp != null);
						_dict[i] = null;
					}
				}
				_count = 0;
			};
			that.has = function(name) {
				if(this.isEmpty()) return false;
				return this.find(name) != null;
			};
			that.size = function() {
				return _size;
			};
			that.isEmpty = function() {
				return (this.getCount() === 0);
			};
			that.getCount = function() {
				return _count;
			};
			that.clone = function() {
				return new globals.collections.map.HashTable(this.entries(), this.size(), compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.add(nodes[i]);
					}
				}
			};
			
			function HashTable(nodes, _size, cmp) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size > 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', message: 'incorrect {size} value: < ' + _size + ' >'};
				
				_dict = globals.toolset.vector(_size, null);
				_count = 0;
				
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			HashTable.prototype = that;
			
			globals.collections.map.HashTable = HashTable;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));