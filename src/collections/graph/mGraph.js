;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	const isMGraph = (value) => (value instanceof globals.collections.graph.MGraph);
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
	* var myQueue = new globals.collections.graph.MGraph([1, 4, 5, 5, 6, 7]);
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
				var _size = null;
				var _path = null;
				var _dir = null;
				
				var that = {};
				that.getPath = function(a, b) {
					return _path[a][b];
				};
				that.setPath = function(a, b, value) {
					_path[a][b] = value;
				};
				that.getDirection = function(a, b) {
					return _dir[a][b];
				};
				that.setDirection = function(a, b, value) {
					_dir[a][b] = value;
				};
				that.size = function() {
					return _size;
				};
				that.reportPath = function() {
					for(var i=0; i<_size; i++) {
						var res = '';
						for(var j=0; j<_size; j++) {
							res += _path[i][j] + ' '
						}
						console.log(res);
					}
				}
				that.reportDirection = function() {
					for(var i=0; i<_size; i++) {
						var res = '';
						for(var j=0; j<_size; j++) {
							res += _dir[i][j] + ' '
						}
						console.log(res);
					}
				}
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.Path)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return ((_size == node.size() || (_size != null && _size.equals(node.size()))) &&
							(_path == node.getPathMatrix() || (_path != null && _path.equals(node.getPathMatrix()))) &&
							(_dir == node.getDirectionMatrix() || (_dir != null && _dir.equals(node.getDirectionMatrix()))));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_size == null) ? 0 : _size.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_path == null) ? 0 : _path.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_dir == null) ? 0 : _dir.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(path: {' + _path.join(', ').toString() + '}, direction: {' + _dir.join(', ').toString() + '})';
				};
				
				function Paths(size) {
					_size = size;
					_path = globals.toolset.matrix(size, size, 0);
					_dir = globals.toolset.matrix(size, size, 0);
				};
				Paths.prototype = that;
				
				globals.collections.graph.node.Paths = Paths;
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
				
				//weight = (weight == null) ? DEFAULT_WEIGHT : (globals.toolset.isNumber(weight) ? weight : null);
				//if(weight == null) throw {name: 'ValueError', mesage: 'incorrect {weight} argument: not number < ' + weight + ' >'};
				
				//_weights[a][b] = weight;
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
				if(value == null) throw {name: 'ValueError', mesage: 'incorrect {edge} argument: not number < ' + value + ' >'};
				
				_graph[a][b] = value;
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
				//_weights[a][b] = EMPTY_WEIGHT;
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
				return new globals.collections.graph.MGraph(this.entries(), this.size());
			};
			that.size = function() {
				return _size;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report().join(', ');
				return res + ']';
			};
			that.multiply = function(graph) {
				if(graph == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: {graph} is < ' + graph + ' >'
					};
				}
				if(!(graph instanceof globals.collections.graph.MGraph)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not {MGraph} instance < ' + graph + ' >'
					};
				}
				
				if(this.size() != graph.size()) {
					throw {
						name: 'ValueError',
						message: 'incorrect input argument: incompatible graph size < ' + graph.size() + ' >'
					};
				}
				
				var n = this.size();
				var res = new globals.collections.graph.MGraph(null, n);
				for(var i=0; i<n; i++) {
					for(var j=0; j<n; j++) {
						for(var k=0; k<n; k++) {
							if(_graph[i][k] && graph.get(k, j)) {
								res.add(i, j);
								break;
							}
						}
					}
				}
				return res;
			};
			that.add = function(graph) {
				if(graph == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: {graph} is < ' + graph + ' >'
					};
				}
				if(!(graph instanceof globals.collections.graph.MGraph)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not {MGraph} instance < ' + graph + ' >'
					};
				}
				
				if(this.size() != graph.size()) {
					throw {
						name: 'ValueError',
						message: 'incorrect input argument: incompatible graph size < ' + graph.size() + ' >'
					};
				}
				
				var n = this.size();
				var res = new globals.collections.graph.MGraph(null, n);
				for(var i=0; i<n; i++) {
					for(var j=0; j<n; j++) {
						res.set(i, j, (_graph[i][j] || graph.get(i, j)));
					}
				}
				return res;
			};
			that.closure = function() {
				var res = this.clone();
				for(var i=0; i<this.size(); i++) {
					res = res.multiply(this).add(this);
				}
				return res;
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
			/*that.getMinPaths = function(paths, dirs) {
				if(!globals.toolset.isArray(paths)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: {paths} is not array < ' + paths + ' >'
													};
				}
				if(!globals.toolset.isArray(dirs)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: {dirs} is not array < ' + dirs + ' >'
													};
				}
				var n = this.size();
				var n1 = paths.length, n2 = dirs.length;
				var nn1 = (globals.toolset.isArray(paths[0]) ? paths[0].length : 0), nn2 = (globals.toolset.isArray(dirs[0]) ? dirs[0].length : 0);
				if(n1 !== n2 || nn1 !== nn2 || n1 !== nn1 || n1 != n) { throw {
																			name: 'ValueError',
																			message: 'incorrect matrix size {' + this.size() + '}: paths {rows < ' + n1 + ' >, columns < ' + nn1 + ' >}, dirs {rows < ' + n2 + ' >, columns < ' + nn2 + ' >}'
																		};
				}
				
				for(var i=0; i<n; i++) {
					for(var j=0; j<n; j++) {
						paths[i][j] = (_graph[i][j] ? _graph[i][j] : Number.MAX_VALUE);
						dirs[i][j] = (_graph[i][j] ? j : -1);
					}
				}
				
				for(var k=1; k<n; k++) {
					for(var i=0; i<n; i++) {
						for(var j=0; j<n; j++) {
							if((i != k-1) && paths[i][k-1] < Number.MAX_VALUE && paths[k-1][j] < Number.MAX_VALUE && paths[i][j] > paths[i][k-1] + paths[k-1][j]) {
								paths[i][j] = paths[i][k-1] + paths[k-1][j];
								dirs[i][j] = dirs[i][k-1];
							}
						}
					}
				}
			};*/
			that.getMinPaths = function(path) {
				if(path == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: {path} is null  < ' + path + ' >'
					};
				}
				if(!(path instanceof globals.collections.graph.node.Paths)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not {Paths} instance  < ' + path + ' >'
					};
				}
				
				if(this.size() != path.size()) {
					throw {
						name: 'ValueError',
						message: 'incorrect input argument: incompatible {path} size < ' + path.size() + ' >'
					};
				}
				
				for(var i=0; i<n; i++) {
					for(var j=0; j<n; j++) {
						path.setPath(i, j, (_graph[i][j] ? _graph[i][j] : Number.MAX_VALUE));
						path.setDirection(i, j, (_graph[i][j] ? j : -1));
					}
				}
				
				for(var k=1; k<n; k++) {
					for(var i=0; i<n; i++) {
						for(var j=0; j<n; j++) {
							if((i != k-1) && path.getPath(i, k-1) < Number.MAX_VALUE && path.getPath(k-1, j) < Number.MAX_VALUE && path.getPath(i, j) > path.getPath(i, k-1) + path.getPath(k-1, j)) {
								path.setPath(i, j, path.getPath(i, k-1) + path.getPath(k-1, j));
								path.setDirection(i, j, path.getDirection(i, k-1));
							}
						}
					}
				}
			};
			that.toLGraph = function() {
				return (new globals.collections.graph.LGraph(this.entries(), this.size()));
				//return lGraph;
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
			
			function MGraph(nodes, size) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', mesage: 'incorrect {number of rows} argument: not positive integer number < ' + _size + ' >'};
				
				_graph = globals.toolset.matrix(_size, _size, EMPTY_EDGE);
				//_weights = globals.toolset.matrix(_size, _size, EMPTY_WEIGHT);
				
				initialize(nodes);
			};
			MGraph.prototype = that;
			
			globals.collections.graph.MGraph = MGraph;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));