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
	const isLGraph2 = (value) => (value instanceof globals.collections.graph.LGraph2);
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
	* var myQueue = new globals.collections.graph.LGraph2([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.graph = globals.collections.graph || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.iterator = globals.collections.graph.iterator || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _graph = null;
				var _arcs = null;
				var _setNotPassed = null;
				var _current = null;
				var _components = null;
				
				var that = {};
				that.hasNext = function() {
					return (_setNotPassed.getCount() > 0);
				};
				that.next = function() {
					if(!this.hasNext()) return null;
					if(_current == -1) {
						_current = _setNotPassed.first();
					}
					var result = _current;
					_setNotPassed.remove(_current);
					var nextArc = _graph[_current];
					while(true) {
						if(nextArc == null) {
							if(arcs.isEmpty()) {
								_current = -1;
								components++;
								return result;
							} else {
								nextArc = arcs.pop();
							}
						}
						var vertex = nextArc.getEnd();
						if(_setNotPassed.has(vertex)) {
							arcs.push(nextArc);
							_current = vertex;
							return result;
						} else {
							nextArc = nextArc.getNext();
						}
					}
				};
				that.getCompPassed = function() {
					return components;
				};
				that.nextIndex = function() {
					/*if(!this.hasNext()) return _index;
					return (_index + 1);*/
				};
				that.remove = function() {
					/*if(_previous == null) return false;
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
					return true;*/
				};
				that.add = function(node) {
					/*if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: node  < ' + node + ' >'
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
					_index++;*/
				};
				
				function GraphDepthIterator(graph) {
					_graph = graph;
					_arcs = new globals.collections.stack.Stack();
					_setNotPassed = (new globals.collections.set.BitSet(null, 0, _graph.size() - 1)).inverse();
					_current = -1;
					_components = 0;
				};
				GraphDepthIterator.prototype = that;
				
				globals.collections.graph.iterator.GraphDepthIterator = GraphDepthIterator;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {	
			globals.collections.graph.iterator = globals.collections.graph.iterator || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _graph = null;
				var _qNext = null;
				var _setNotPassed = null;
				
				var that = {};
				that.hasNext = function() {
					return !(_qNext.isEmpty() && (_setNotPassed.getCount() == 0));
				};
				that.next = function() {
					if(!this.hasNext()) return null;
					if(_qNext.isEmpty()) {
						var selected = _setNotPassed.first();
						_qNext.enqueue(selected);
						_setNotPassed.remove(selected);
					}
					var vertex = _qNext.dequeue();
					for(var arc=_graph[vertex]; arc!=null; arc=arc.getNext()) {
						if(_setNotPassed.has(arc.getEnd())) {
							_setNotPassed.remove(arc.getEnd());
							_qNext.enqueue(arc.getEnd());
						}
					}
					return vertex;
				};
				that.nextIndex = function() {
					/*if(!this.hasNext()) return _index;
					return (_index + 1);*/
				};
				that.remove = function() {
					return null;
				};
				that.add = function(node) {
					return null;
				};
				
				function GraphBreadthIterator(graph) {
					_graph = graph;
					_qNext = new globals.collections.queue.Queue();
					_setNotPassed = (new globals.collections.set.BitSet(null, 0, _graph.size() - 1)).inverse();
				};
				GraphBreadthIterator.prototype = that;
				
				globals.collections.graph.iterator.GraphBreadthIterator = GraphBreadthIterator;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {	
				var _path = null;
				
				var that = {};
				that.getPath = function() {
					return _path;
				};
				that.insertAsFirst = function(vertex) {
					_path.unshift(vertex);
				};
				that.insertAsLast = function(vertex) {
					_path.push(vertex);
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input argument: node is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.graph.node.Path)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not {Path} instance < ' + node + ' >'
						};
					}
					return compare(_path, node.getPath());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.Path)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return (_path == node.getPath() || (_path != null && _path.equals(node.getPath())));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_path == null) ? 0 : _path.hashCode();
					hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					return '(path: {' + _path.join(', ').toString() + '})';
				};
				
				function Path() {
					_path = globals.toolset.vector();
				};
				Path.prototype = that;
				
				globals.collections.graph.node.Path = Path;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {	
				var _end = null;
				var _next = null;
				
				var that = {};//Object.create(null);
				that.getEnd = function() {
					return _end;
				};
				that.setEnd = function(end) {
					_end = Object.clone(end);
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
							message: 'incorrect input argument: node is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.graph.node.ArcNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not ArcNode instance < ' + node + ' >'
						};
					}
					return compare(_end, node.getEnd());
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.ArcNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return (_end == node.getEnd() || (_end != null && _end.equals(node.getEnd())) &&
							(_next == node.getNext() || (_next != null && _next.equals(node.getNext()))));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_end == null) ? 0 : _end.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_next == null) ? 0 : _next.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(end vertice: {' + _end.toString() + '})';
				};
				
				function ArcNode(end, next) {
					_end = Object.clone(end);
					_next = next;
				};
				ArcNode.prototype = that;
				
				globals.collections.graph.node.ArcNode = ArcNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _begin = null;
				var that = Object.create(globals.collections.graph.node.ArcNode.prototype);
				that.getBegin = function() {
					return _begin;
				};
				that.setBegin = function(begin) {
					_begin = begin;
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.ExtendedArcNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return ((_begin == node.getBegin() || (_begin != null && _begin.equals(node.getBegin()))) &&
							globals.collections.graph.node.ArcNode.prototype.equals.apply(this, node));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_begin == null) ? 0 : _begin.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = globals.collections.graph.node.ArcNode.prototype.hashCode.apply(this);
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(begin vertice: {' + _begin.toString() + '}, end vertice: {' + globals.collections.graph.node.ArcNode.prototype.getEnd.apply(this).toString() + '})';
				};
				
				function ExtendedArcNode(begin, arc) {
					if(arc == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input argument: {arc} is < ' + arc + ' >'
						};
					}
					if(!(arc instanceof globals.collections.graph.node.ArcNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not {ArcNode} instance  < ' + arc + ' >'
						};
					}
					globals.collections.graph.node.ArcNode.call(this, arc.getEnd(), arg.getNext());
					_begin = begin;
				};
				ExtendedArcNode.prototype = that;
				ExtendedArcNode.prototype.constructor = ExtendedArcNode;
				
				globals.collections.graph.node.ExtendedArcNode = ExtendedArcNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.node = globals.collections.graph.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _len = null;
				var that = Object.create(globals.collections.graph.node.ArcNode.prototype);
				that.getLength = function() {
					return _len;
				};
				that.setLength = function(len) {
					_len = len;
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.graph.node.ExtendedArcNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_end === node.getEnd());
					return ((_len == node.getLength() || (_len != null && _len.equals(node.getLength()))) &&
							globals.collections.graph.node.ArcNode.prototype.equals.apply(this, node));
				};
				that.hashCode = function() {
					var hashValue = 11;
					
					var sfVal = (_len == null) ? 0 : _len.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = globals.collections.graph.node.ArcNode.prototype.hashCode.apply(this);
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(begin vertice: {' + _begin.toString() + '}, end vertice: {' + globals.collections.graph.node.ArcNode.prototype.getEnd.apply(this).toString() + '})';
				};
				
				function ExtendedArcNode2(end, arc, len) {
					globals.collections.graph.node.ArcNode.call(this, end, arc);
					_len = len;
				};
				ExtendedArcNode2.prototype = that;
				ExtendedArcNode2.prototype.constructor = ExtendedArcNode2;
				
				globals.collections.graph.node.ExtendedArcNode2 = ExtendedArcNode2;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.visitor = globals.collections.graph.visitor || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var that = {};
				that.vertexIn = function(vertex) {
					return null;
				};
				that.vertexOut = function(vertex) {
					return null;
				};
				that.arcForward = function(begin, end, newVertex) {
					return null;
				};
				that.arcBackward = function(begin, end) {
					return null;
				};
				that.newSelection = function(vertex) {
					return null;
				};
			
				function IGraphDepthVisitor() {
				};
				IGraphDepthVisitor.prototype = that;
				
				globals.collections.graph.visitor.IGraphDepthVisitor = IGraphDepthVisitor;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.visitor = globals.collections.graph.visitor || {};

			(function() {
				var that = {};
				that.vertexIn = function(vertex) {
					return null;
				};
				that.arcForward = function(begin, end, newVertex) {
					return null;
				};
				that.newSelection = function(vertex) {
					return null;
				};
				function IGraphBreadthVisitor() {
				};
				IGraphBreadthVisitor.prototype = that;
				
				globals.collections.graph.visitor.IGraphBreadthVisitor = IGraphBreadthVisitor;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.visitor = globals.collections.graph.visitor || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _componentNo = null;
				
				var that = Object.create(globals.collections.graph.visitor.IGraphDepthVisitor.prototype);
				that.vertexIn = function(vertex) {
					console.log("vertexIn: " + vertex);
				};
				that.vertexOut = function(vertex) {
					console.log("vertexOut: " + vertex);
				};
				that.arcForward = function(begin, end, newVertex) {
					console.log("arcForward: begin = " + vertex + "; end = " + end + "; new = " + newVertex);
				};
				that.arcBackward = function(begin, end) {
					console.log("arcBackward: begin = " + vertex + "; end = " + end);
				};
				that.newSelection = function(vertex) {
					console.log("newSelection: #{" + (++_componentNo) + "} " + vertex);
				};
			
				function GraphDepthVisitor() {
					globals.collections.graph.visitor.IGraphDepthVisitor.call(this);
					_componentNo = 0;
				};
				GraphDepthVisitor.prototype = that;
				GraphDepthVisitor.prototype.constructor = GraphDepthVisitor;
				
				globals.collections.graph.visitor.GraphDepthVisitor = GraphDepthVisitor;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.visitor = globals.collections.graph.visitor || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _graph = null;
				var _vertices = null;
				
				var that = Object.create(globals.collections.graph.visitor.IGraphDepthVisitor.prototype);
				
				that.vertexOut = function(vertex) {
					_graph.setMark(vertex, --_vertices);
				};
				that.getGraph = function() {
					return _graph;
				};
			
				function GraphTopologicalSortVisitor(graph) {
					globals.collections.graph.visitor.IGraphDepthVisitor.call(this);
					if(graph == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input argument: {graph} is < ' + graph + ' >'
						};
					}
					if(!isGraph(graph)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input argument: not {LGraph2} instance  < ' + graph + ' >'
						};
					}
					_graph = graph;
					_vertices = graph.size();
				};
				GraphTopologicalSortVisitor.prototype = that;
				GraphTopologicalSortVisitor.prototype.constructor = GraphTopologicalSortVisitor;
				
				globals.collections.graph.visitor.GraphTopologicalSortVisitor = GraphTopologicalSortVisitor;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.graph.visitor = globals.collections.graph.visitor || {};
//----------------------------------------------------------------------------------------------
			(function() {
				//var _graph = null;
				//var _vertices = null;
				var _hasCycle = null;
				
				var that = Object.create(globals.collections.graph.visitor.graphTopologicalSortVisitor.prototype);
				
				//that.vertexOut = function(vertex) {
				//	_graph.setMark(vertex, --_vertices);
				//};
				that.arcForward = function(begin, end, newVertex) {
					if(!newVertex && !globals.collections.graph.visitor.GraphTopologicalSortVisitor.getGraph.apply(this).isMarked(end)) {
						_hasCycle = true;
					}
				};
				that.hasCycle = function() {
					return _hasCycle;
				};
			
				function GraphCycleVisitor(graph) {
					globals.collections.graph.visitor.graphTopologicalSortVisitor.call(this, graph);
					//_graph = graph;
					//_vertices = graph.size();
					_hasCycle = false;
				};
				GraphCycleVisitor.prototype = that;
				GraphCycleVisitor.prototype.constructor = GraphCycleVisitor;
				
				globals.collections.graph.visitor.GraphCycleVisitor = GraphCycleVisitor;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _graph = null;
			var _markedVerticesArray = null;
			var _count = null;
			
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
				if(!this.has(a, b)) {
					_graph[a] = new globals.collections.graph.node.ArcNode(b, _graph[a]);
					_count++;
				}
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
				if(this.isEmpty()) return false;
				var current = _graph[a], previous = null;
				if(current == null) return false;
				do {
					if(current.getEnd().equals(b)) {
						if(previous == null && current.getNext() == _graph[a]) {
							delete _graph[a];
							_count--;
							_graph[a] = null;
						} else {
							previous.setNext(current.getNext());
							_count--;
							delete current;
						}
						return true;
					} else {
						previous = current;
						current = current.getNext();
					}
				} while(current != _graph[a]);
				return false;
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
				if(this.isEmpty()) return false;
				var current = _graph[a];
				if(current == null) return false;
				do {
					if(current.getEnd().equals(b)) {
						return true;
					} else {
						current = current.getNext();
					}
				} while(current != _graph[a]);
				return false;
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
				if(this.isEmpty()) return -1;
				var current = _graph[a];
				if(current == null) return -1;
				var s = 0;
				do {
					s++;
					current = current.getNext();
				} while(current != _graph[a]);
				return s;
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
				var node = globals.collections.graph.node.ArcNode(a);
				//_graph.forEach(function(value, i) {
				//	if(this.has(value, a)) {
				//		s++;
				//	}
				//});
				_graph.forEach(function(value, i) {
					var current = value;
					do {
						if(current.getEnd().equals(a)) {
							s++;
						} else {
							current = current.getNext();
						}
					} while(current != value);
				};
				return s;
			};
			that.reportDepth = function() {
				var res = globals.toolset.vector(this.size(), null);
				var componentNo = -1;
				for(var it = this.depthIterator(); it.hasNext(); ) {
					var curComp = it.getCompPassed();
					if(curComp > componentNo) {
						componentNo = curComp;
					}
					res.push('component': componentNo, 'vertice': it.next());
				}
				return res;
			};
			that.traverseInDepth = function() {
				this.traverseDepth(new globals.collections.graph.visitor.GraphDepthVisitor());
			};
			that.traverseTopologicalSort = function() {
				this.traverseDepth(globals.collections.graph.visitor.GraphTopologicalSortVisitor(_graph));
				return _markedVerticesArray;
			};
			that.traverseCycle = function() {
				var visitor = globals.collections.graph.visitor.GraphCycleVisitor(_graph);
				this.traverseDepth(visitor);
				return visitor.hasCycle();
			};
			that.traverseDepth = function(visitor) {
				if(visitor == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: visitor is null  < ' + visitor + ' >'
					};
				}
				if(!(visitor instanceof globals.collections.graph.visitor.Visitor)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not Visitor instance  < ' + visitor + ' >'
					};
				}
				
				var setNotPassed = (new globals.collections.set.BitSet(0, this.size() - 1)).inverse();
				var arcs = new globals.collections.stack.Stack();
				var current = -1;
				var selected = -1;
				
				while(setNotPassed.getCount() != 0) {
					if(current == -1) {
						selected = current = setNotPassed.first();
						visitor.newSelection(selected);
					}
					visitor.vertexIn(current);
					setNotPassed.remove(current);
					var nextArc = (_graph[current] == null ? null : (new globals.collections.graph.node.ExtendedArcNode(current, _graph[current])));
					while(true) {
						if(nextArc == null) {
							if(arcs.isEmpty()) {
								current = -1;
								visitor.vertexOut(selected);
								break;
							} else {
								nextArc = arcs.pop();
								visitor.vertexOut(nextArc.getEnd());
								visitor.arcBackward(nextArc.getBegin(), nextArc.getEnd());
								nextArc = (nextArc.getNext() == null ? null : (new globals.collections.graph.node.ExtendedArcNode(nextArc.getBegin(), nextArc.getNext())));
							}
						} else {
							visitor.arcForward(nextArc.getBegin(), nextArc.getEnd(), setNotPassed.has(nextArc.getEnd()));
							if(setNotPassed.has(nextArc.getEnd())) {
								current = nextArc.getEnd();
								arcs.push(nextArc);
								break;
							} else {
								visitor.arcBackward(nextArc.getBegin(), nextArc.getEnd());
								nextArc = (nextArc.getNext() == null ? null : (new globals.collections.graph.node.ExtendedArcNode(nextArc.getBegin(), nextArc.getNext())));
							}
						}
					}
				}
			};
			that.traverseBreadth = function(visitor) {
				if(visitor == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: visitor is null  < ' + visitor + ' >'
					};
				}
				if(!(visitor instanceof globals.collections.graph.visitor.Visitor)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not Visitor instance  < ' + visitor + ' >'
					};
				}
				
				var qNext = new globals.collections.queue.Queue();
				var setNotPassed = (new globals.collections.set.BitSet(null, 0, this.size() - 1)).inverse();
				
				while(!(qNext.isEmpty() && (setNotPassed.getCount() == 0))) {
					if(qNext.isEmpty()) {
						var selected = setNotPassed.first();
						visitor.newSelection(selected);
						qNext.enqueue(selected);
						setNotPassed.remove(selected);
					}
					var vertex = qNext.dequeue();
					visitor.vertexIn(vertex);
					for(var arc=_graph[vertex]; arc!=null; arc=arc.getNext()) {
						var newVertex = setNotPassed.has(arc.getEnd());
						visitor.arcForward(vertex, arg.getEnd(), newVertex);
						if(newVertex) {
							setNotPassed.remove(arc.getEnd());
							qNext.enqueue(arc.getEnd());
						}
					}
				}
			};
			that.traverseDepthRec = function(visitor) {
				
				var traverseRec = function(vertex, visitor, setNotPassed) {
					visitor.vertexIn(vertex);
					setNotPassed.remove(vertex);
					for(var arc=_graph[vertex]; arc!=null; arc=arc.getNext()) {
						var newVertex = setNotPassed.has(arc.getEnd);
						visitor.arcForward(vertex, arc.getEnd(), newVertex);
						if(newVertex) {
							traverseRec(arc.getEnd(), visitor, setNotPassed);
						}
						visitor.arcBackward(vertex, arc.getEnd());
					}
					visitor.vertexOut(vertex);
				};
				
				if(visitor == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: visitor is null  < ' + visitor + ' >'
					};
				}
				if(!(visitor instanceof globals.collections.graph.visitor.Visitor)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not Visitor instance  < ' + visitor + ' >'
					};
				}
				var setNotPassed = (new globals.collections.set.BitSet(0, this.size() - 1)).inverse();
				while(setNotPassed.getCount() != 0) {
					var selected = setNotPassed.first();
					visitor.newSelection(selected);
					traverseRec(selected, visitor, setNotPassed);
				}
			};
			that.getShortestPath = function(begin, end) {
				if(!globals.toolset.isIntNumber(begin)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: {begin} is not integer number < ' + begin + ' >'
														};
				}
				if(!isInRange(begin) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: begin vertex < ' + begin + ' > is out of range {0,' + this.size() + '}');
				}
				if(!globals.toolset.isIntNumber(end)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: {end} is not integer number < ' + end + ' >'
														};
				}
				if(!isInRange(end) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertex < ' + end + ' > is out of range {0,' + this.size() + '}');
				}
				if(begin == end) return [begin];
				
				var selected = begin;
				var qNext = new globals.collections.queue.Queue();
				var setNotPassed = (new globals.collections.set.BitSet(null, 0, this.size() - 1)).inverse();
				var marks = globals.toolset.vector(this.size(), -1);
				
				setNotPassed.remove(selected);
				qNext.enqueue(selected);
				
				loop:
				while(!qNext.isEmpty()) {
					var vertex = qNext.dequeue();
					for(var arc=_graph[vertex]; arc!=null; arc=arc.getNext()) {
						var newVertex = setNotPassed.has(arc.getEnd());
						if(newVertex) {
							setNotPassed.remove(arc.getEnd());
							marks[arc.getEnd()] = vertex;
							if(arc.getEnd() == end) {
								break loop;
							}
							qNext.enqueue(arc.getEnd());
						}
					}
				}
				
				if(marks[end] == -1) {
					return null;
				} else {
					//var count = 1;
					//for(var i=end; marks[i]!=-1; i=marks[i]) {
					//	count++;
					//}
					var result = globals.toolset.vector();
					for(var i=end; marks[i]!=-1; i=marks[i]) {
						//result[--count] = i;
						result.unshift(i);
					}
					result.unshift(begin);
					//result[0] = begin;
					return result;
				}
			};
			that.getDijkstraPath = function(begin, end, path) {
				if(!globals.toolset.isIntNumber(begin)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: {begin} is not integer number < ' + begin + ' >'
														};
				}
				if(!isInRange(begin) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: begin vertex < ' + begin + ' > is out of range {0,' + this.size() + '}');
				}
				if(!globals.toolset.isIntNumber(end)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: {end} is not integer number < ' + end + ' >'
														};
				}
				if(!isInRange(end) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: end vertex < ' + end + ' > is out of range {0,' + this.size() + '}');
				}
				
				if(path == null) {
					throw {
						name: 'NullPointerError',
						message: 'incorrect input argument: {path} is null  < ' + path + ' >'
					};
				}
				if(!(path instanceof globals.collections.graph.node.Path)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not {Path} instance  < ' + path + ' >'
					};
				}
				
				if(begin == end) {
					path.insertAsLast(begin);
					return 0;
				}
				var selected = begin;
				var arrNext = globals.toolset.vector();
				var setNotPassed = (new globals.collections.set.BitSet(null, 0, this.size() - 1)).inverse();
				var marks = globals.toolset.vector(this.size(), -1);
				var len = globals.toolset.vector(this.size(), 0);
				
				setNotPassed.remove(selected);
				arrNext.push(selected);
				
				while(setNotPassed.getCount() > 0) {
					var minArc = new globals.collections.graph.node.ExtendedArcNode2(0, null, Number.MAX_VALUE);
					var minVertex = -1;
					for(var i=0; i<arrNext.length; i++) {
						var vertex = arrNext[i];
						for(var a=_graph[vertex]; a!=null; a=a.getNext()) {
							if(setNotPassed.has(a.getEnd()) && a.getLength() < minArc.getLength()) {
								minArc = a;
								minVertex = vertex;
							}
						}
					}
					
					if(minArc.getLength() == Number.MAX_VALUE) break;
					
					arrNext.push(minArc.getEnd());
					marks[minArc.getEnd()] = minVertex;
					len[minArc.getEnd()] = minArc.getLength();
					setNotPassed.remove(minArc.getEnd());
					
					if(minArc.getEnd() == end) break;
				}
				
				if(marks[end] == -1) {
					//path = [];
					return 0;
				} else {
					var wholeLength = 0;
					for(var i=end; marks[i]!=-1; i=marks[i]) {
						path.insertAsFirst(i);
						wholeLength += len[i];
					}
					path.insertAsFirst(begin);
					return wholeLength;
				}
			};
			that.report = function() {
				var res = [];//globals.toolset.vector(this.size(), null);//data.slice(0);//globals.toolset.vector();
				if(!this.edgeCount()) return null;
				_graph.forEach(function(item, i) {
					//res[i] = {'vertice': i, 'edge': item.entries().join(' ')};
					var current = item;//, temp = globals.toolset.vector();
					if(current != null) {
						do {
							//temp.push(current.getEnd());
							res.push('vertice': i, 'edge': current.getEnd());
							current = current.getNext();
						} while(current != item);
					} else {
						res.push{'vertice': i, 'edge': current};
					}
					//res.push{'vertice': i, 'edge': temp.join(', ')};
				});
				return res;
			};
			that.isEmpty = function() {
				return (this.size() === 0);
			};
			that.removeAll = function() {
				_graph = globals.toolset.vector(this.size(), null);
			};
			that.entries = function() {
				var res = globals.toolset.matrix(this.size(), this.size(), 0);
				if(!this.edgeCount()) return res;
				_graph.forEach(function(item, i) {
					var current = item;
					if(current != null) {
						do {
							res[i][current.getEnd()] = 1;
							current = current.getNext();
						} while(current != item);
					}
				});
				return res;
			};
			that.clone = function() {
				return new globals.collections.graph.LGraph2(this.entries(), this.size(), compare);
			};
			that.size = function() {
				return _size;
			};
			that.edgeCount = function() {
				return _count;
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report.join(', ');
				return res + ']';
			};
			that.depthIterator = function() {
				return new globals.collections.graph.iterator.graphDepthIterator(_graph);
			};
			that.breadthIterator = function() {
				return new globals.collections.graph.iterator.GraphBreadthIterator(_graph);
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
			that.setMark = function(vertex, number) {
				if(!globals.toolset.isIntNumber(vertex)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + vertex + ' >'
														};
				}
				if(!isInRange(vertex) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + vertex + ' > is out of range {0,' + this.size() + '}');
				}
				if(!globals.toolset.isNumber(number)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not number < ' + number + ' >'
														};
				}
				_markedVerticesArray[vertex] = number;
			};
			that.getMark = function(vertex) {
				if(!globals.toolset.isIntNumber(vertex)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + vertex + ' >'
														};
				}
				if(!isInRange(vertex) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + vertex + ' > is out of range {0,' + this.size() + '}');
				}
				return _markedVerticesArray[vertex];
			};
			that.isMarked = function(vertex) {
				if(!globals.toolset.isIntNumber(vertex)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + vertex + ' >'
														};
				}
				if(!isInRange(vertex) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: vertex < ' + vertex + ' > is out of range {0,' + this.size() + '}');
				}
				return (_markedVerticesArray[vertex] != -1);
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
			
			function LGraph2(nodes, size, cmp) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size >= 0) ? size : null);
				if(_size == null) throw {name: 'ValueError', mesage: 'incorrect size value: not positive integer number < ' + _size + ' >'};
				
				_graph = globals.toolset.vector(_size, null);
				_markedVerticesArray = globals.toolset.vector(_size, -1);//new globals.collections.set.BitSet(null, 0, _size - 1);
				_count = 0;

				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			LGraph2.prototype = that;
			
			globals.collections.graph.LGraph2 = LGraph2;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));