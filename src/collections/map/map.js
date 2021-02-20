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
	const isMap = (value) => (value instanceof globals.collections.map.Map);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Map.
	*
	* @example
	* var myMap = new globals.collections.map.Map({'herb': 'H', 'road': 'R'});
	*/
	(function() {
		globals.collections.map = globals.collections.map || {};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.map.node = globals.collections.map.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _key = null;
				var _value = null;
				
				var that = {};
				that.equals = function(node) {
					return this.equivalent(node.getKey());
				};
				that.equivalent = function(key) {
					return (_key.equals(key));
				};
				that.getKey = function() {
					return _key;
				};
				that.getValue = function() {
					return _value;
				};
				that.setValue = function(value) {
					_value = Object.clone(value);
				};
				that.toString = function() {
					return "[key: {" + _key.toString() + "}, value: {" + _value.toString() + "}]";
				};
				
				function MapNode(key, value) {
					_key = Object.clone(key);
					_value = Object.clone(value);
				};
				MapNode.prototype = that;
				
				globals.collections.map.node.MapNode = MapNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _keys = null;
			var _data = null;
			
			var hashCodeOfKey = function(key) {
				/*if(isArray(key)) {
					key = JSON.stringify(key, function(key, value) {
												if (typeof value === 'string') {
													return value.toString().toLowerCase();
												}
												}
				}*/
				return JSON.stringify(key);
			};
			
			var getNodeForKey = function(key) {
				var key = hashCodeOfKey(key);
				if(_data[key] != null) {
					var start = _data[key].head();
					while(start != null) {
						if(start.get_data().equivalent(key)) {
							return start;
						}
						start = start.getNext();
					}
					//var collided = _data[key].entries();
					//collided.forEach(function(value) {
					//	if(value.equivalent(key)) {
					//		_data[key].remove(value);
					//		break;
					//	}
					//});
				}
				return null;
			};
			
			var that = {};
			that.put = function(key, value) {
				var node = getNodeForKey(key);
				if(node != null) {
					var current = node.get_data().getValue();
					node.get_data().setValue(value);
					//node.set_data(node.get_data().setValue(value));
					return current;
				}
				node = new globals.collections.map.node.MapNode(key, value);
				var index = hashCodeOfKey(key);
				if(_data[index] == null) {
					_keys.push(index);
					_data[index] = new globals.collections.list.LinkedList(null, compare);
				}
				_data[index].add(node);
				//_data[key] = Object.clone(value);
			};
			that.get = function(key) {
				var node = getNodeForKey(key);
				return ((node == null) ? null : node.get_data().getValue());
				//return _data[key];
			};
			that.remove = function(key) {
				var node = getNodeForKey(key);
				if(node != null) {
					var current = node.get_data().getValue();
					_data[key].removeNode(node);
					_keys.remove(key);
					if(_data[key].isEmpty()) {
						_data[key] = null;
					}
					return current;
				}
				return null;
				//key = hashCodeOfKey(key);
				//_keys.remove(key);
				//_data[key] = null;
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				var len = _keys.length;
				for(var i=0; i<len; i++) {
					var k = _keys[i];
					func(k, _data[k], i);
				}
			};
			that.entries = function() {
				//var len = _keys.length;
				//var entries = [];
				var entries = _keys.map(function(e, i) {
					if(_data[e] != null) {
						var start = _data[e].head();
						var res = globals.toolset.vector();
						while(start != null) {
							res.push({'index': i, 'key': start.getData().getKey(), 'value': start.getData().getValue()});
							start = start.getNext();
						}
						return res;
					}
				});
				//for (var i = 0; i < len; i++) {
				//	entries[i] = {
				//		key : _keys[i],
				//		value : _data[i]
				//	};
				//}
				return entries;
			};
			that.sortBy_keys = function() {
				_keys.sort(compare);
				/*var result = {};
				var entries = this.entries();
				entries.sort(function(a, b) {
					//return a[key].localeCompare(b[key]);
					return +(a.key > b.key) || +(a.key === b.key) - 1;
				});
				entries.foreach(function(e, i) {
					result[e.key] = e.value;
				});
				_data = result;*/
			};
			that.sortByValues = function() {
				var result = {};
				var entries = this.entries();
				entries.sort(compare);
				entries.foreach(function(e, i) {
					result[e.key] = e.value;
				});
				_data = result;
			};
			that.keys = function() {
				var original_keys = [];
				_keys.forEach(function(value) {
					if(_data[value] != null) {
						var start = _data[value].head();
						while(start != null) {
							original_keys.push(start.getData().getKey());
							start = start.getNext;
						}
					}
				});
				return original_keys;
				/*var original_keys = [];
				_keys.forEach(function(value) {
					original_keys.push(JSON.parse(value));
				});
				return original_keys;*/
			};
			that.values = function() {
				var values = [];
				_keys.forEach(function(value) {
					if(_data[value] != null) {
						var start = _data[value].head();
						while(start != null) {
							values.push(start.getData().getValue());
							start = start.getNext();
						}
					}
				});
				return values;
			};
			that.isEmpty = function() {
				return (_keys.length === 0);
			};
			that.containsKey = function(key) {
				key = hashCodeOfKey(key);
				return (_keys.indexOf(key) !== -1);
			};
			that.containsValue = function(value) {
				_keys.forEach(function(value) {
					if(_data[value] != null) {
						var start = _data[value].head();
						while(start != null) {
							if(start.getData().getValue().equals(value)) {
								return true;
							}
							start = start.getNext();
						}
					}
				});
				return false;
			};
			that.putAll = function(map) {
				if(map != null && !(map instanceof globals.collections.map.Map)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not Map instance < ' + map + ' >'
					};
				}
				if(map == null) return false;
				map.entries().forEach(function(item) {
					this.put(item.key, item.value);
				});
				return true;
			};
			that.clone = function() {
				var entries = {};
				_keys.forEach(function(value) {
					if(_data[value] != null) {
						var start = _data[value].head();
						while(start != null) {
							entries[start._data.getKey()] = start._data.getValue();
							start = start.next;
						}
					}
				});
				return new globals.collections.map.Map(entries, compare);
			};
			that.clear = function() {
				_keys = globals.toolset.vector();
				_data = {};
			};
			that.size = function() {
				return _keys.length;
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isObject(nodes)) { throw {
														name: 'ValueError',
														message: 'incorrect initialization value: object [any type]'
													};
					}
					for(var key in nodes) {
						if(!globals.toolset.isFunction(nodes[key]) && Object.prototype.hasOwnProperty.call(nodes, key)) {
							//_keys.push(key);
							//_data[key] = nodes[key];
							that.put(key, nodes[key]);
						}
					}
				}
			};
			
			function Map(nodes, cmp) {
				_keys = globals.toolset.vector();
				_data = {};
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Map.prototype = that;
			
			globals.collections.map.Map = Map;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));