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
	const isMaxHeap = (value) => (value instanceof globals.collections.heap.maxHeap);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Maximum heap.
	*
	* Time: O(k + (n - k) * log k)
	*/
	(function() {
		globals.collections.heap = globals.collections.heap || {};
//----------------------------------------------------------------------------------------------
		var maxHeap = (function() {
			
			var makeNode = function(data) {
				return {"data": Object.clone(data)};
			};
//----------------------------------------------------------------------------------------------
			var parent = function(index) {
				return Math.floor((index) / 2);//-1
			};
//----------------------------------------------------------------------------------------------
			var leftChild = function(index) {
				return (2 * index + 1);
			};
//----------------------------------------------------------------------------------------------
			var rightChild = function(index) {
				return (2 * index + 2);
			};
//----------------------------------------------------------------------------------------------
			var swap = function(data, left, right) {
				data[right] = [data[left], data[left] = data[right]][0];
			};
//----------------------------------------------------------------------------------------------
			var maxHeapify = function(nodes, index) {
				var l = leftChild(index);
				var r = rightChild(index);
				var largest = index;
				if(l < size && nodes[l].data > nodes[index].data) {
					largest = l;
				}
				if(r < size && nodes[r].data > nodes[largest].data) {
					largest = r;
				}
				if(largest != index) {
					swap(nodes, index, largest);
					maxHeapify(nodes, largest);
				}
			};
//----------------------------------------------------------------------------------------------
			return function(spec, cmp) {
				var nodes, size;
				//var that = {};
				var that = Object.create(globals.collections.heap.maxHeap);
				that.prototype = globals.collections.heap.maxHeap;
				//
				var init = function() {
					if(!globals.toolset.isNull(spec)) {
						if(!globals.toolset.isObject(spec)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: [object]'
														};
						}
						if(Object.prototype.hasOwnProperty.call(spec, 'array')) {
							if(!globals.toolset.isArray(spec['array']) || spec['array'].length == 0) { throw {
																									name: 'ValueError',
																									message: 'incorrect initialization value: array of elemens <' + spec['array'] + '>'
																								};
							}
							
							size = (!Object.prototype.hasOwnProperty.call(spec, 'range')) ? spec['array'].length : ((globals.toolset.isIntNumber(spec['range']) && spec['range'] > 0) ? spec['range'] : null);
							if(size == null) throw {name: 'ValueError', mesage: 'incorrect size value: < ' + spec['range'] + ' >'};
							
							spec['array'].foreach(function(value, index) {
								that.insertNode(value);
							});
							//nodes = spec['array'].slice(0);
							//for(var i=Math.floor((size-1)/2); i>=0; i--) {
							//	maxHeapify(nodes, i);
							//}
						} else {
							var o = Object.create(Error.prototype, {name: 'ValueError', message: 'incorrect initialization values: {\'array\': [array of elements], \'range\': [number]}'});
							throw o;
							//throw {
							//	name: 'ValueError',
							//	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'
							//};
						}
					}
					cmp = globals.toolset.isFunction(cmp) ? cmp : compare;
				};
				that.insert = function(data) {
					nodes[size++] = makeNode(data);
					var current = size - 1;
					while(cmp(nodes[current].data, nodes[parent(current)].data) > 0) {
						swap(nodes, current, parent(current));
						current = parent(current);
					}
					//var newNode = makeNode(data);
					//var current = size++;
					//while(current && newNode.data > nodes[parent(current)].data) {
					//	nodes[current] = nodes[parent(current)];
					//	current = parent(current);
					//}
					//nodes[current] = newNode;
				};
				that.inorderTraversal = function(index) {
					var result = [];
					var inorderTraversal_ = function(index) {
						if(leftChild(index) < size) {
							inorderTraversal_(leftChild(index));
						}
						result.push(nodes[index].data);
						if(rightChild(index) < size) {
							inorderTraversal_(rightChild(index));
						}
					};
					return result;
				};
				that.preorderTraversal = function(index) {
					var result = [];
					var preorderTraversal_ = function(index) {
						if(leftChild(index) < size) {
							preorderTraversal_(leftChild(index));
						}
						if(rightChild(index) < size) {
							preorderTraversal_(rightChild(index));
						}
						result.push(nodes[index].data);
					}
					return result;
				};
				that.postorderTraversal = function(index) {
					var result = [];
					var postorderTraversal_ = function(index) {
						result.push(nodes[index].data);
						if(leftChild(index) < size) {
							postorderTraversal_(leftChild(index));
						}
						if(rightChild(index) < size) {
							postorderTraversal_(rightChild(index));
						}
					}
					return result;
				};
				that.levelOrderTravesal = function() {
					var result = [];
					nodes.foreach(function(value) {
						result.push(value['data']);
					});
					return result;
				};
				that.isLeaf = function(index) {
					if(index >= Math.floor(size / 2) && index <= size) {
						return true;
					}
					return false;
				};
				that.deleteNode = function(data) {
					var index = 0;
					for(var i=0; i<nodes.length; i++) {
						if(cmp(nodes[i].data, data) == 0) {
							index = i;
							break;
						}
					}
					nodes[index] = nodes[size-1];
					nodes[size-1] = null;
					size--;
					maxHeapify(nodes, index);
				};
				that.replaceMax(data) {
					if(this.isEmpty()) return null;
					nodes[0] = makeNode(data);
					maxHeapify(nodes, 0);
				};
				that.peek = function() {
					if(this.isEmpty()) return null;
					return nodes[0];
				};
				that.poll = function() {
					if(this.isEmpty()) return null;
					var root = nodes[0];
					if(size > 1) {
						nodes[0] = nodes[size-1];
						nodes[size-1] = null
						maxHeapify(nodes, 0);
					}
					size--;
					return root;
				};
				that.entries = function() {
					var res = nodes.map(function(value, index)) {
						return {index: index, value: value};
					}
					return res;
				};
				that.clone = function() {
					return globals.collections.heap.maxHeap({'array': nodes, 'range': size}, cmp);
				};
				that.isEmpty = function() {
					return (size === 0);
				};
				that.size = function() {
					return size;
				};
				init();
				return that;
			}
		}());
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.collections.heap.maxHeap = maxHeap;
//----------------------------------------------------------------------------------------------
	}());
}(typeof globals !== 'undefined' ? globals : this));