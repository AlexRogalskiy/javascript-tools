;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	const isSGraph = (value) => (value instanceof globals.collections.graph.SGraph);
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
	* var myQueue = new globals.collections.graph.SGraph([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.graph = globals.collections.graph || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _graph = null;

			var isInRange = function(num) {
				return (num < _size && num >= 0);
			};

			var that = {};
			that.has = function(a, b) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				return _graph[a].has(b);
			};
			that.add = function(a, b) {
				if(!globals.toolset.isIntNumber(a)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + a + ' >'
														};
				}
				if(!isInRange(a) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + a + ' > is out of range {0,' + this.size() + '}');
				}
				_graph[a].disjunct(b);
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
				_graph[a].remove(b);
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
				return _graph[a].getCount();
			};
			that.cardIn = function(a) {
				var s = 0;
				for(var i=0; i<_size; i++) {
					if(_graph[i].has(a)) {
						s++;
					}
				}
				return s;
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.removeAll = function() {
				_graph = globals.toolset.vector(_size, null);
				for(var i=0; i<_size; i++) {
					_graph[i] = new globals.collections.set.BitSet(null, 0, _size-1);
				}
			};
			that.report = function() {
				var res = globals.toolset.vector(this.size(), null);//data.slice(0);//globals.toolset.vector();
				_graph.forEach(function(item, i) {
					res[i] = {'vertice': i, 'edge': item.entries()};
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
				return new globals.collections.graph.SGraph(this.entries(), _size);
			};
			that.size = function() {
				return _size;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report.join(', ');
				return res + ']';
			};
			that.toMGraph = function() {
				var mGraph = new globals.collections.graph.MGraph(this.entries(), this.size());
				return mGraph;
				//var mGraph = new globals.collections.graph.MGraph(null, this.size());
				//for(var i=0; i<this.size();i++) {
				//	for(var it=_graph[i].iterator(); it.hasNext();) {
				//		mGraph.add(i, it.next());
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

			function SGraph(nodes, size) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', message: 'incorrect {size} value: not positive integer number < ' + _size + ' >'};

				_graph = globals.toolset.vector(_size, null);
				for(var i=0; i<_size; i++) {
					_graph[i] = new globals.collections.set.BitSet(null, 0, _size-1);
				}
				initialize(nodes);
			};
			SGraph.prototype = that;

			globals.collections.graph.SGraph = SGraph;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));
