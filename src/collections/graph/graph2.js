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
	const isGraph2 = (value) => (value instanceof globals.collections.graph.Graph2);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Graph.
	*
	* @example
	* var myQueue = globals.collections.graph([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.graph = globals.collections.graph || {};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				const STATE = { 'unvisited': 1, 'visited': 2, 'visiting': 3 };
				
				Object.freeze(STATE);
				Object.preventExtensions(STATE);
				
				globals.collections.graph.node.STATE = STATE;
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				var _adjacent = null;
				var _adjacentCount = null;
				var _state = null;
				var _data = null;
				
				var that = {};
				that.addAdjacent = function(node) {
					_adjacent.push(Object.clone(node));
					_adjacentCount++;
				};
				that.removeAdjacent = function(node) {
					//var index = _adjacent.indexOf(node);
					var index = _adjacent.forEach(function(value, i) {
						if(value.compareTo(node) === 0) {
							return i;
						}
					});
					if(index == null) return false;
					//_adjacent[index] = null;
					_adjacent.removeAt(index);
					_adjacentCount--;
					return true;
				};
				that.getAdjacent = function() {
					return _adjacent;
				};
				that.getAdjacentCount = function() {
					return _adjacentCount;
				};
				that.getState = function() {
					return _state;
				};
				that.setState = function(state) {
					if(!globals.toolset.isIntNumber(state)) { throw {
																name: 'TypeError',
																message: 'incorrect input argument: {state} is not integer number < ' + state + ' >'
															};
					}
					if(-1 == Object.values(globals.collections.graph.node.STATE).indexOf(state)) {
						throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: state < ' + state + ' > is invalid');
					}
					_state = state;
				};
				that.getData = function() {
					return _data;
				};
				that.setData = function(data) {
					_data = Object.clone(data);
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input argument: {node} is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.graph.node.GraphNode2)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not GraphNode2 instance  < ' + node + ' >'
						};
					}
					return compare(_data, node.getData());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.GraphNode2)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					return ((_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
							(_state == node.getState() || (_state != null && _state.equals(node.getState()))) && 
							(_adjacentCount == node.getAdjacentCount() || (_adjacentCount != null && _adjacentCount.equals(node.getAdjacentCount()))) && 
							(_adjacent == node.getAdjacent() || (_adjacent != null && _adjacent.equals(node.getAdjacent()))));
				};
				that.hashCode = function() {
					var hashValue = 11;
					var sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_state == null) ? 0 : _state.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_adjacentCount == null) ? 0 : _adjacentCount.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_adjacent == null) ? 0 : _adjacent.hashCode();
					hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					return '(data: {' + _data.toString() + '}, adjacent: {' + _adjacent.join(' ') + ', state: {' + _state + '})';
				};
				
				function GraphNode2(data) {
					_adjacent = globals.toolset.vector();
					_adjacentCount = 0;
					_state = globals.collections.graph.node.STATE.unvisited;
					_data = Object.clone(data);
				};
				GraphNode2.prototype = that;
				
				globals.collections.graph.node.GraphNode2 = GraphNode2;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _vectices = null;
			var _count = null;
			
			var that = {};
			that.search = function(start, end)) {
				if(!(start instanceof globals.collections.graph.node.GraphNode2) || !(end instanceof globals.collections.graph.node.GraphNode2)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameters: start < ' + start + ' >, end < ' + end + ' >'
					};
				}
				var q = globals.collections.queue.queue();
				var nodes = that.getNodes();
				for(var i=0; i<nodes.length; i++) {
					nodes[i].setState(globals.collections.graph.node.STATE.unvisited);
				}
				start.state = globals.collections.graph.node.STATE.visiting;
				q.enqueue(start);
				var u = null;
				while(!q.isEmpty()) {
					u = q.dequeue();
					if(u != null) {
						var list = u.getAdjacent();
						for(var i=0; i<list.length; i++) {
							if(list[i].getState() === globals.collections.graph.node.STATE.unvisited) {
								if(list[i] == end) {
									return true;
								} else {
									list[i].setState(globals.collections.graph.node.STATE.visiting);
									q.enqueue(list[i]);
								}
							}
						}
						u.setState(globals.collections.graph.node.STATE.visited);
					}
				}
				return false;
			};
			that.searchBFS = function(node) {
				if(!(node instanceof globals.collections.graph.node.GraphNode2)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameters: start < ' + node + ' >'
					};
				}
				if(node == null) return null;
				var q = globals.collections.queue.queue();
				node.setState(globals.collections.graph.node.STATE.visited);
				visit(node);
				q.enqueue(node);
				
				while(!q.isEmpty()) {
					var r = queue.dequeue();
					var nodes = r.getAdjacent();
					nodes.forEach(function(value) {
						if(value.getState() == globals.collections.graph.node.STATE.unvisited) {
							visit(value);
							value.setState(globals.collections.graph.node.STATE.visited);
							queue.enqueue(value);
						}
					});
				}
			};
			that.searchDFS = function(node) {
				if(!(node instanceof globals.collections.graph.node.GraphNode2)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameters: start < ' + node + ' >'
					};
				}
				if(node == null) return null;
				visit(node);
				node.setState(globals.collections.graph.node.STATE.visited);
				var nodes = node.getAdjacent();
				nodes.forEach(function(value) {
					if(value.getState() == globals.collections.graph.node.STATE.unvisited) {
						searchDFS(value);
					}
				});
			};
			that.addNode = function(node) {
				if(!(node instanceof globals.collections.graph.node.GraphNode2)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: node < ' + node + ' >'
					};
				}
				_vertices[_count++] = node;
			};
			that.getNodes = function() {
				return _vertices;
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.has = function(node) {
				if(!(node instanceof globals.collections.graph.node.GraphNode2)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: not GraphNode instance < ' + node + ' >'
					};
				}
				if(this.isEmpty()) return null;
				for(var i=0; i<_vertices.length; i++) {
					if(_vertices[i].equals(node)) {
						return true;
					}
				}
				return false;
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				if(this.isEmpty()) return null;
				for(var i=0; i<_vertices.length; i++) {
					//_vertices[i] = func(_vertices[i], i);
					func(_vertices[i], i);
				}
			};
			that.removeAll = function() {
				_vertices.splice(0, _vertices.length);
				_count = 0;
			};
			that.entries = function() {
				var res = globals.toolset.vector();
				_vertices.forEach(function(item, i) {
					res.push(Object.clone(item));
				});
				return res;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.entries().join(', ');
				return res + ']';
			};
			that.clone = function() {
				return new globals.collections.graph.Graph2(this.entries(), compare);
			};
			that.size = function() {
				return _count;
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						if(!(nodes[i] instanceof globals.collections.graph.node.GraphNode2)) {
							throw {
								name: 'TypeError',
								message: 'incorrect input parameter: node[' + i + '] = < ' + nodes[i] + ' >'
							};
						}
						_vertices[_count++] = Object.clone(nodes[i]);
						//that.add(nodes[i]);
					}
				}
			};
			
			function Graph2(nodes, cmp) {
				_vertices = [];//globals.toolset.vector();
				_count = 0;
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Graph2.prototype = that;
			
			globals.collections.graph.Graph2 = Graph2;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));