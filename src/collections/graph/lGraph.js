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
	const isLGraph = (value) => (value instanceof globals.collections.graph.LGraph);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} List Graph.
	*
	* @example
	* var myQueue = new globals.collections.graph.LGraph([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.graph = globals.collections.graph || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _vertice = null;
				
				var that = {};
				that.getVertice = function() {
					return _vertice;
				};
				that.setVertice = function(vertice) {
					_vertice = Object.clone(vertice);
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input parameter: arc node  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.graph.node.ArcNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: arc node  < ' + node + ' >'
						};
					}
					return compare(_vertice, node.getVertice());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.ArcNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_vertice === node.getVertice());
					return (_vertice == node.getVertice() || (_vertice != null && _vertice.equals(node.getVertice())));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_vertice == null) ? 0 : _vertice.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(end vertice: {' + _vertice.toString() + '})';
				};
				
				function ArcNode(vertice) {
					_vertice = Object.clone(vertice);
				};
				ArcNode.prototype = that;
				
				globals.collections.graph.node.ArcNode = ArcNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _graph = null;
			
			var isInRange = function(num) {
				return (num < _size && num >= 0);
			};
			
			var that = {};
			that.add = function(a, b) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var node = new globals.collections.graph.node.ArcNode(b);
				_graph[a].add(node);
				//_count++;
			};
			that.remove = function(a, b) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var node = new globals.collections.graph.node.ArcNode(b);
				_graph[a].remove(node);
				//if true _count--;
			};
			that.has = function(a, b) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var node = new globals.collections.graph.node.ArcNode(b);
				_graph[a].has(node);
			};
			that.cardOut = function(a) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				return _graph[a].size();
			};
			that.cardIn = function(a) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var s = 0;
				var node = new globals.collections.graph.node.ArcNode(a);
				_graph.forEach(function(value, i) {
					if(value.has(node)) {
						s++;
					}
				});
				return s;
			};
			that.dfs = function() {
				
				var _dfs = function _dfs(pos) {
					
					if(visited[pos]) return;
					
					visited[pos] = 1;
					res.push(pos);
					
					var iterator = _graph[pos].iterator(), temp;
					while(iterator.hasNext()) {
						temp = iterator.next().getVertice();
						if(!visited[temp]) {
							_dfs(temp);
						}
					}
				};
				
				/*if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}*/
				
				var visited = globals.toolset.vector(this.size(), 0);
				var res = globals.toolset.vector(this.size());
				
				for(var i=0; i<this.size(); i++) {
					_dfs(_graph[i]);
				}
				return res;
			};
			that.bfs = function() {
				
				var _bfs = function(pos) {
					
					if(visited[pos]) return;
					
					visited[pos] = 1;
					queue.push(pos);
					res.push(pos);
					
					while(queue.length > 0) {
						var next = queue.pop(), temp;
						var iterator = _graph[temp].iterator();
						while(iterator.hasNext()) {
							temp = iterator.next().getVertice();
							if(!visited[temp]) {
								queue.unshift(temp);
							}
							visited[temp] = 1;
							res.push(temp);
						}
					}
				};
				
				var visited = globals.toolset.vector(this.size(), 0);
				var queue = globals.toolset.vector();
				
				var res = globals.toolset.vector(this.size());
				
				for(var i=0; i<this.size(); i++) {
					_bfs(_graph[i]);
				}
				return res;
			};
			that.isEmpty = function() {
				return (this.size() === 0);
				//return _count;
			};
			that.removeAll = function() {
				_graph = globals.toolset.vector(this.size(), null);
				for(var i=0; i<this.size(); i++) {
					_graph[i] = new globals.collections.list.List(null, null);
				}
			};
			that.report = function() {
				var res = globals.toolset.vector(this.size(), null);//data.slice(0);//globals.toolset.vector();
				_graph.forEach(function(item, i) {
					res[i] = {'vertice': i, 'edge': item.entries().join(' ')};
				});
				return res;
			};
			that.entries = function() {
				var res = globals.toolset.matrix(this.size(), this.size(), 0);//data.slice(0);//globals.toolset.vector();
				_graph.forEach(function(item, i) {
					item.entries().forEach(function(value, j) {
						res[i][value] = 1;
					});
				});
				return res;
			};
			that.clone = function() {
				return new globals.collections.graph.LGraph(this.entries(), this.size(), compare);
			};
			that.size = function() {
				return _size;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report.join(', ');
				return res + ']';
			};
			that.toSGraph = function() {
				var sGraph = new globals.collections.graph.SGraph(this.entries(), this.size());
				return sGraph;
				//var sGraph = new globals.collections.graph.SGraph(null, this.size());
				//for(var i=0; i<this.size();i++) {
				//	for(var it=_graph[i].iterator(); it.hasNext();) {
				//		sGraph.add(i, it.next());
				//	}
				//}
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					var n = nodes.length;
					var nn = (globals.toolset.isArray(nodes[0]) ? nodes[0].length : 0);
					if(n > _size || nn > _size || n != nn) { throw {
																name: 'ValueError',
																message: 'incorrect matrix size: number of rows < ' + n + ' >, number of columns < ' + nn + ' >'
															};
					}
					for(var i=0; i<n; i++) {
						for(var j=0; j<nn; j++) {
							if(nodes[i][j] !== 0) {
								that.add(i, j);
							}
						}
					}
					//for(var i=0; i<nodes.length; i++) {
					//	nodes[i]['edge'].forEach(function(value) {
					//		that.add(nodes[i]['vertice'], value);
					//	});
					//}
				}
			};
			
			function LGraph(nodes, size, cmp) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', mesage: 'incorrect size value: not positive integer number < ' + _size + ' >'};
				
				_graph = globals.toolset.vector(_size, null);//{}
				for(var i=0; i<_size; i++) {
					_graph[i] = new globals.collections.list.List(nodes, null);
				}
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			LGraph.prototype = that;
			
			globals.collections.graph.LGraph = LGraph;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));