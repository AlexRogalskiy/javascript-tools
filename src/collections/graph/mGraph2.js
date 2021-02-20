;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	const isMGraph2 = (value) => (value instanceof globals.collections.graph.MGraph2);
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
	* var myQueue = new globals.collections.graph.MGraph2([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.graph = globals.collections.graph || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
		const EMPTY_EDGE = 0;
		//const EMPTY_WEIGHT = 0;
		const DEFAULT_EDGE = 1;
		//const DEFAULT_WEIGHT = 1;
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _begin = null;
				var _end = null;
				var _weight = null;

				var that = {};
				that.getBegin = function() {
					return _begin;
				};
				that.setbegin = function(begin) {
					_begin = begin;
				};
				that.getEnd = function() {
					return _end;
				};
				that.setEnd = function(end) {
					_end = end;
				};
				that.getWeight = function() {
					return _weight;
				};
				that.setWeight = function(weight) {
					_weight = weight;
				};
				that.size = function() {
					return _size;
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input argument: edge is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.graph.node.Edge)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not {Edge} instance < ' + node + ' >'
						};
					}
					return compare(_weight, node.getWeight());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.Edge)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return ((_begin == node.getBegin() || (_begin != null && _begin.equals(node.getBegin()))) &&
							(_end == node.getEnd() || (_end != null && _end.equals(node.getEnd()))) &&
							(_weight == node.getWeight() || (_weight != null && _weight.equals(node.getWeight()))));
				};
				that.hashCode = function() {
					var hashValue = 11;

					var sfVal = (_begin == null) ? 0 : _begin.hashCode();
					hashValue = 31 * hashValue + sfVal;

					sfVal = (_end == null) ? 0 : _end.hashCode();
					hashValue = 31 * hashValue + sfVal;

					sfVal = (_weight == null) ? 0 : _weight.hashCode();
					hashValue = 31 * hashValue + sfVal;

					return hashValue;
				};
				that.toString = function() {
					return '(begin: {' + _begin.toString() + '}, end: {' + _end.toString() + '}, weight: {' + _weight.toString() + '})';
				};

				function Edge(begin, end, weight) {
					_begin = begin;
					_end = end;
					_weight = weight;
				};
				Edge.prototype = that;

				globals.collections.graph.node.Edge = Edge;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _graph = null;
			//var _weights = null;

			var isInRange = function(num) {
				return (num < _size && num >= 0);
			};

			var that = {};
			that.has = function(a, b) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																							name: 'TypeError',
																							message: 'incorrect input arguments: not positive integer number - start vertice < ' + a + ' > or end vertice < ' + b + ' >'
																						};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				if(!isInRange(b)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + b + ' > is out of range {0,' + this.size() + '}');
				}
				return _graph[a][b] != EMPTY_EDGE;
			};
			that.get = function(a, b) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																							name: 'TypeError',
																							message: 'incorrect input arguments: not positive integer number - start vertice < ' + a + ' > or end vertice < ' + b + ' >'
																						};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				if(!isInRange(b)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + b + ' > is out of range {0,' + this.size() + '}');
				}
				return _graph[a][b];
			};
			that.add = function(a, b) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																							name: 'TypeError',
																							message: 'incorrect input arguments: not positive integer number - start vertice < ' + a + ' > or end vertice < ' + b + ' >'
																						};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				if(!isInRange(b)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + b + ' > is out of range {0,' + this.size() + '}');
				}
				_graph[a][b] = DEFAULT_EDGE;
				_graph[b][a] = DEFAULT_EDGE;

				//weight = (weight == null) ? DEFAULT_WEIGHT : (globals.toolset.isNumber(weight) ? weight : null);
				//if(weight == null) throw {name: 'ValueError', message: 'incorrect {weight} argument: not number < ' + weight + ' >'};

				//_weights[a][b] = weight;
				//_weights[b][a] = weight;
			};
			that.set = function(a, b, value) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																							name: 'TypeError',
																							message: 'incorrect input arguments: not positive integer number - start vertice < ' + a + ' > or end vertice < ' + b + ' >'
																						};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				if(!isInRange(b)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + b + ' > is out of range {0,' + this.size() + '}');
				}

				value = (value == null) ? DEFAULT_EDGE : (globals.toolset.isNumber(value) ? value : null);
				if(value == null) throw {name: 'ValueError', message: 'incorrect {edge} argument: not number < ' + value + ' >'};

				_graph[a][b] = value;
				_graph[b][a] = value;
			};
			that.remove = function(a, b) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																							name: 'TypeError',
																							message: 'incorrect input arguments: not positive integer number - start vertice < ' + a + ' > or end vertice < ' + b + ' >'
																						};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				if(!isInRange(b)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + b + ' > is out of range {0,' + this.size() + '}');
				}
				_graph[a][b] = EMPTY_EDGE;
				_graph[b][a] = EMPTY_EDGE;
				//_weights[a][b] = EMPTY_WEIGHT;
				//_weights[b][a] = EMPTY_WEIGHT;
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not a function < ' + func + ' >'
												};
				}
				if(this.isEmpty()) return null;
				for(var i=0; i<_size; i++) {
					for(var j=0; j<_size; j++) {
						_graph[i][j] = func(_graph[i][j], i, j);
						//func(_graph[i][j], i, j);
					}
				}
			};
			that.cardOut = function(a) {
				if(!globals.toolset.isIntNumber(a)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not positive integer number < ' + a + ' >'
													};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: start vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var s = 0;
				_graph[a].forEach(function(value) {
					if(value != EMPTY_EDGE) {
						s++;
					}
				});
				return s;
			};
			that.cardIn = function(a) {
				if(!globals.toolset.isIntNumber(a)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not positive integer number < ' + a + ' >'
													};
				}
				if(!isInRange(a)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertice < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				var s = 0;
				_graph.forEach(function(row, i) {
					row.forEach(function(column, j)) {
						if(a === j && column != EMPTY_EDGE) {
							s++;
						}
					}
				});
				return s;
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.removeAll = function() {
				_graph = globals.toolset.matrix(this.size(), this.size(), EMPTY_EDGE);
				//_weights = globals.toolset.matrix(this.size(), this.size(), EMPTY_WEIGHT);
			};
			that.report = function() {
				var res = globals.toolset.vector();
				_graph.forEach(function(row, i) {
					row.forEach(function(column, j)) {
						if(column != EMPTY_EDGE) {
							res.push({'vertice1': i, 'vertice2': j, 'load': column});//, 'weight': _weights[i][j]});
						}
					}
				});
				return res;
			};
			that.entries = function() {
				var res = globals.toolset.matrix(this.size(), this.size(), EMPTY_EDGE);
				_graph.forEach(function(row, i) {
					row.forEach(function(column, j)) {
						res[i][j] = column;//_weights[i][j];
					}
				});
				return res;
			};
			that.clone = function() {
				return (new globals.collections.graph.MGraph2(this.entries(), this.size()));
			};
			that.size = function() {
				return _size;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report().join(', ');
				return res + ']';
			};
			that.minSleleton = function(res) {

				var sameComponent = function(a, b, tree) {
					var root1 = a;
					while(tree[root1] != -1) {
						root1 = tree[root1];
					}
					var root2 = b;
					while(tree[root2] != -1) {
						root2 = tree[root2];
					}
					return (roo1 == root2);
				};

				if(!globals.toolset.isArray(res)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not array < ' + res + ' >'
													};
				}

				var edges = new globals.collections.set.TreeSet();
				var tree = globals.toolset.vector(this.size(), -1);
				var sumWeight = 0;

				for(var i=1; i<this.size(); i++) {
					for(var j=0; j<i; j++) {
						if(_graph[i][j]) {
							edges.add(new globals.collections.graph.node.Edge(i, j, _graph[i][j]));
						}
					}
				}

				while(!edges.isEmpty()) {
					var minEdge = edges.first();
					edges.remove(minEdge);
					if(!sameComponent(minEdge.getBegin(), minEdge.getEnd(), tree)) {
						var root = minEdge.getBegin();
						while(tree[root] != -1) {
							root = tree[root];
						}
						tree[root] = minEdge.getEnd();
						res.push({'begin': minEdge.getBegin(), 'end': minEdge.getEnd(), 'weight': minEdge.getWeight()});
						sumWeight += minEdge.getWeight();
					}
				}
				return sumWeight;
			};
			that.minSkeletonPrim = function(res) {
				if(!globals.toolset.isArray(res)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not array < ' + res + ' >'
													};
				}

				var setNotPassed = (new globals.collections.set.BitSet(null, 0, this.size() - 1)).inverse();
				var distances = globals.toolset.vector(this.size(), Number.MAX_VALUE);
				var ends = globals.toolset.vector(this.size(), -1);
				var sumWeight = 0;

				while(setNotPassed.getCount() != 0) {
					var minVertex = -1;
					var minDistance = Number.MAX_VALUE;

					for(var nextVertex=0; nextVertex<this.size(); nextVertex++) {
						if(setNotPassed.has(nextVertex) && distances[nextVertex] < minDistance) {
							minDistance = distances[nextVertex];
							minVertex = nextVertex;
						}
					}

					if(minVertex == -1) {
						minVertex = setNotPassed.first();
					} else {
						res.push({'begin': ends[minVertex], 'end': minVertex, 'distance': minDistance});
						sumWeight += minDistance;
					}

					setNotPassed.remove(minVertex);
					for(var u=0; u<this.sizes(); u++) {
						if(setNotPassed.has(u) && _graph[minVertex][u] && _graph[minVertex][u] < distances[u]) {
							distances[u] = _graph[minVertex][u];
							ends[u] = minVertex;
						}
					}
				}
				return sumWeight;
			};
			/*that.closure = function() {
				var res = this.clone();
				for(var k=1; k<this.size(); k++) {
					for(var i=0; i<this.size(); i++) {
						for(var j=0; j<this.size(); j++) {
							if((i != k-1) && !res.get(i, j)) {
								res.set(i, j, (res.get(i, k-1) && res.get(k-1, j)));
							}
						}
					}
				}
				return res;
			};*/
			that.toLGraph = function() {
				return (new globals.collections.graph.LGraph(this.entries(), this.size()));
				//var lGraph = new globals.collections.graph.LGraph(null, this.size());
				//for(var i=0; i<this.size();i++) {
				//	for(var j=0; j<this.size(); j++) {
				//		if(_graph[i][j] === 1) {
				//			lGraph.add(i, j);
				//		}
				//
				//	}
				//}
			};

			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeErropr',
															message: 'incorrect initialization argument: not array < ' + nodes + ' >'
														};
					}
					var n = nodes.length;
					var nn = (globals.toolset.isArray(nodes[0]) ? nodes[0].length : 0);
					if(n > _rows 0 || nn > _columns || n != nn) { throw {
																	name: 'ValueError',
																	message: 'incorrect matrix size: number of rows < ' + n + ' >, number of columns < ' + nn + ' >'
																};
					}
					for(var i=0; i<n; i++) {
						for(var j=0; j<nn; j++) {
							_graph[i][j] = nodes[i][j];
							//_weights[i][j] = nodes[i][j];
						}
					}
				}
			};

			function MGraph2(nodes, size) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', message: 'incorrect {number of rows} argument: not positive integer number < ' + _size + ' >'};

				_graph = globals.toolset.matrix(_size, _size, EMPTY_EDGE);
				//_weights = globals.toolset.matrix(_size, _size, EMPTY_WEIGHT);

				initialize(nodes);
			};
			MGraph2.prototype = that;

			globals.collections.graph.MGraph2 = MGraph2;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));
