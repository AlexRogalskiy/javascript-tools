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
	const isBinaryTree = (value) => (value instanceof globals.collections.tree.BinaryTree);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of nodes.
	* @param {Function} compare Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Binary tree.
	*
	* @example
	* var myBinaryTree = new globals.collections.tree.BinaryTree([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.tree = globals.collections.tree || {};
//----------------------------------------------------------------------------------------------	
		var createMinimalBST = function(array, min, max) {
			var createMinimalBST_ = function(array, start, end) {
				if(end < start) {
					return null;
				}
				var mid = Math.floor((start + end) / 2);
				var node = new globals.collections.tree.node.BinaryTreeNode(array[mid], null, null);
				node.left = createMinimalBST_(array, start, mid - 1);
				node.right = createMinimalBST_(array, mid + 1, end);
				return node;
			};
			
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect initialization value: array of elemens < ' + array + ' >'
												};
			}
			min = (min == null) ? 0 : (globals.toolset.isIntNumber(min) && min >= 0) ? min : null;
			if(min == null) throw {name: 'ValueError', mesage: 'incorrect lower border value: < ' + min + ' >'};
			
			max = (max == null) ? array.length - 1 : (globals.toolset.isIntNumber(max) && max >= 0) ? max : null;
			if(max == null) throw {name: 'ValueError', mesage: 'incorrect uppder border value: < ' + max + ' >'};
			
			if(max < min || max >= array.length) return null;
		
			return createMinimalBST_(array, min, max);
		};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.tree.node = globals.collections.tree.node || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _data = null;
				var _left = null;
				var _right = null;
				
				var that = {};	
				that.getData = function() {
					return _data;
				};
				that.setData = function(data) {
					_data = data;
				};
				that.getLeft = function() {
					return _left;
				};
				that.setLeft = function(left) {
					_left = left;
				};
				that.getRight = function() {
					return _right;
				};
				that.setRight = function(right) {
					_right = right;
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input parameter: {node} is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.tree.node.BinaryBinaryTreeNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: not BinaryTreeNode instance  < ' + node + ' >'
						};
					}
					return compare(_data, node.getData());
					//return (_data < node.getData() ? -1 : (_data == node.getData() ? 0 : 1));
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.tree.node.BinaryBinaryTreeNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_data === node.getData());// && _next === node.getNext());
					return ((_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
							(_left == node.getLeft() || (_left != null && _left.equals(node.getLeft()))) &&
							(_right == node.getRight() || (_right != null && _right.equals(node.getRight()))));
				};
				that.hashCode = function() {
					var hashValue = 11;
					var sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_left == null) ? 0 : _left.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_right == null) ? 0 : _right.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.toString = function() {
					return '(data: {' + _data.toString() + '})';
				};
				
				function BinaryBinaryTreeNode(data, left, right) {
					_data = Object.clone(data);
					_left = left;
					_right = right;
				};
				BinaryBinaryTreeNode.prototype = that;
				
				globals.collections.tree.node.BinaryBinaryTreeNode = BinaryTreeNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.tree.iterator = globals.collections.tree.iterator || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _queue = null;
				var _current = null;
				var _index = null;
				
				var that = {};
				that.hasNext = function() {
					return (!_queue.isEmpty());
				};
				that.next = function() {
					if(!this.hasNext()) return null;
					_current = _queue.dequeue();
					if(_current.getLeft() != null) {
						_queue.enqueue(_current.getLeft());
					}
					if(_current.getRight != null) {
						_queue.enqueue(_current.getRight());
					}
					_index++;
					return _current;
				};
				that.nextIndex = function() {
					if(!this.hasNext()) return _index;
					return (_index + 1);
				};
				that.remove = function() {
					/*if(_current == null) return false;
					
					var current = _root, previous, a, b;
					while(current && compare(current, _current) != 0) {
						previous = current;
						if(compare(current, _current) > 0) {
							current = current.getLeft();
						} else {
							current = current.getRight();
						}
					}
					if(current === null) return false;
					a = current.getRight();
					b = current.getLeft();
					delete current;
					previous.setLeft(a);
					current = a;
					while(current !== null) {
						current = current.getLeft();
					}
					current = b;
					_index--;
					return true;*/
				};
				that.add = function(node) {
					/*if(node != null && !(node instanceof globals.collections.list.node.ListNode)) {
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
					_index++;*/
				};
				
				function BreadthFirstIterator(head) {
					_queue = new globals.collections.queue.Queue();
					_queue.enqueue(head);
					_current = null;
					_index = -1;
				};
				BreadthFirstIterator.prototype = that;
				
				globals.collections.tree.iterator.BreadthFirstIterator = BreadthFirstIterator;
			}());
		}());
//----------------------------------------------------------------------------------------------		
		(function() {
			var _root = null;
			
			var that = {};
			that.add = function(data) {
				var node = new globals.collections.tree.node.Node(data, null, null);
				if(this.isEmpty()) {
					_root = node;
				} else {
					var current = _root, order;
					while(current !== null) {
						order = compare(current.getData(), data);
						if(order == 0) {
							return false;
						}
						if(order > 0) {
							current = current.getLeft();
						} else {
							current = current.getRight();
						}
					}
					current = node;
				}
			};
			that.insertRoot = function(item) {
				const LEFT = 1;
				const RIGHT = 2;
				
				var current = _root;
				var nodeLeft = new globals.collections.tree.node.BinaryTreeNode(item, null, null);
				
				var leftPos = LEFT;
				var nodeRight = nodeLeft;
				var rightPos = RIGHT;
				
				_root = nodeLeft;
				while(current != null) {
					if(compare(current.getData(), item) < 0) {
						if(leftPos == LEFT) {
							nodeLeft.setLeft(current);
						} else {
							nodeLeft.setRight(current);
						}
						nodeLeft = current;
						leftPos = RIGHT;
						current = current.getRight();
					} else {
						if(rightPos == LEFT) {
							nodeRight.setLeft(current);
						} else {
							nodeRight.setRight(current);
						}
						rightPos = LEFT;
						nodeRight = current;
						current = current.getLeft();
					}
				}
				if(leftPos == LEFT) {
					nodeLeft.setLeft(null);
				} else {
					nodeLeft.setRight(null);
				}
				if(rightPos == LEFT) {
					nodeRight.setLeft(null);
				} else {
					nodeRight.setRight(null);
				}
			};
			that.outputAsc = function() {
				var result = globals.toolset.vector(), current = _root, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						result.push(current.getData());
						current = current.getRight();
					} else {
						stack.push(current);
						current = current.getLeft();
					}
				}
				return result;
			};
			that.outputDesc = function() {
				var result = globals.toolset.vector(), current = _root, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						result.push(current.getData());
						current = current.getLeft();
					} else {
						stack.push(current);
						current = current.getRight();
					}
				}
				return result;
			};
			//time = O(n)
			that.preorderTraversal = function(node) {
				if(this.isEmpty()) return;
				node = node || _root;
				var current = null, n, result = globals.toolset.vector(), stack = new globals.collections.stack.Stack();
				stack.push(node);
				while(stack.size() > 0) {
					current = stack.pop();
					result.push(current.getData());
					n = current.getRight();
					if(null != n) stack.push(n);
					n = current.getLeft();
					if(null != n) stack.push(n);
				}
				return result;
			};
			that.preorderTraversal = function(node) {
				if(this.isEmpty()) return;
				node = node || _root;
				var result = globals.toolset.vector();
				var preorderTraversal_ = function(node) {
					if(node == null) return;
					result.push(node.getData());
					preorderTraversal_(node.getLeft());
					preorderTraversal_(node.getRight());
				};
				preorderTraversal_(node);
				return result;
			};
			that.inorderTraversal = function(node) {
				if(this.isEmpty()) return;
				node = node || _root;
				var result = globals.toolset.vector();
				var inorderTraversal_ = function(node) {
					if(node == null) return;
					inorderTraversal_(node.getLeft());
					result.push(node.getData());
					inorderTraversal_(node.getRight());
				};
				inorderTraversal_(node);
				return result;
			};
			that.postorderTraversal = function(node) {
				if(this.isEmpty()) return;
				node = node || _root;
				var result = globals.toolset.vector();
				var postorderTraversal_ = function(node) {
					if(node == null) return;
					postorderTraversal_(node.getLeft());
					postorderTraversal_(node.getRight());
					result.push(node.getData());
				};
				postorderTraversal_(node);
				return result;
			};
			that.remove = function(data, func) {
				var current = _root, previous;
				var temp, a, b;
				while(current && (temp = compare(current.getData(), data)) != 0) {
					previous = current;
					if(temp > 0) {
						current = current.getLeft();
					} else {
						current = current.getRight();
					}
				}
				if(current === null) return false;
				a = current.getRight;
				b = current.getLeft();
				delete current;
				previous.setLeft(a);
				current = a;
				while(current !== null) {
					current = current.getLeft();
				}
				current = b;
			};
			that.remove = function(data) {
				const LEFT = -1;
				const RIGHT = 1;
				const IDLE = 0;
				
				var parent = null;
				var current = _root;
				var comp = 0;
				var lastStep = IDLE;
				
				while(current != null && (comp = compare(current.getData(), data)) != 0) {
					parent = current;
					if(comp < 0) {
						lastStep = RIGHT;
						current = current.getRight();
					} else {
						lastStep = LEFT;
						current = current.getLeft();
					}
				}
				
				if(current == null) return false;
				if(current.getLeft() == null) {
					if(lastStep == RIGHT) {
						parent.setRight(current.getRight());
						delete current;
					} else if(lastStep == LEFT) {
						parent.setLeft(current.getRight());
						delete current;
					} else {
						_root = current.getRight();
						delete current;
					}
				} else if(current.getRight() == null) {
					if(lastStep == RIGHT) {
						parent.setRight(current.getLeft());
						delete current;
					} else if(lasetStep = LEFT) {
						parent.setLeft(current.getLeft());
						delete current;
					} else {
						_root = current.getLeft();
						delete current;
					}
				} else {
					var nodeToReplace = current.getRight();
					parent = current;
					while(nodeToReplace.getLeft() != null) {
						parent = nodeToReplace;
						nodeToReplace = nodeToReplace.getLeft();
					}
					current.setData(nodeToReplace.getData());
					if(parent == current) {
						parent.setRight(nodeToReplace.getRight());
					} else {
						parent.setLeft(nodeToReplace.getRight());
					}
				}
			};
			that.remove = function(data) {
				
				var removeMaxNode = function(node, maxNode) {
					if(node == null) return null;
					if(compare(node, maxNode) == 0) {
						return maxNode.getLeft();
					}
					node.setRight(removeMaxNode(node.getRight(), maxNode));
					return node;
				};
				
				/*var removeMaxNode = function(node) {
					if(current == null) return null;
					if(!current.getRight()) {
						return current.getLeft();
					}
					current.setRight(removeMaxNode(current.getRight()));
					return current;
				};*/
				
				var remove_ = function(current) {
					if(current == null) return null;
					if(compare(current.getData(), data) == 0) {
						if(current.getLeft() == null) {
							var right = current.getRight();
							delete current;
							return right;
						}
						if(current.getRight() == null) {
							var left = current.getLeft();
							delete current;
							return left;
						}
						//var removed = current;
						//current = this.max(removed.getLeft());
						//current.setLeft(removeMaxNode(removed.getLeft()));
						//current.setRight(removed.getRight());
						//delete removed;
						
						var maxNode = this.max(current.getLeft());
						maxNode.setLeft(removeMaxNode(current.getLeft(), maxNode));
						maxNode.setRight(current.getRight());
						delete current;
						return maxNode;
					} else if(compare(data, current.getData()) < 0) {
						current.setLeft(remove_(current.getLeft()));
					} else {
						current.setRight(remove_(current.getRight()));
					}
					return current;
				};
				_root = remove_(_root);
			}:
			that.remove = function(data) {
				
				var removeMinNode = function(current) {
					if(current == null) return null;
					if(!current.getLeft()) {
						return current.getRight();
					}
					current.setLeft(removeMinNode(current.getLeft()));
					return current;
				};
				
				var remove_ = function(current) {
					if(current == null) return null;
					var order = compare(data, current.getData());
					if(order < 0) {
						current.setLeft(remove_(current.getLeft()));
					} else if(order > 0) {
						current.setRight(remove_(current.getRight()));
					} else {
						if(!current.getRight()) {
							return current.getLeft();
						}
						var removed = current;
						current = this.min(removed.getRight());
						current.setRight(removeMinNode(removed.getRight()));
						current.setLeft(removed.getLeft());
					}
					return current;
				};
				_root = remove_(_root);
			}:
			that.removeAll = function() {
				var current = _root, temp, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						temp = stack.pop();
						current = temp.getRight();
						delete temp;
					} else {
						stack.push(current);
						current = current.getLeft();
					}
				}
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not a function < ' + func + ' >'
													};
				}
				var current = _root, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						func(current.getData(), current, this);
						current = current.getRight();
					} else {
						stack.push(current);
						current = current.getLeft();
					}
				}
			};
			that.isEmpty = function() {
				return (_root === null);
			};
			that.depth = function(data) {
				var current = _root;
				var height = 0, temp;
				while(current && (temp = compare(current.getData(), data)) != 0) {
					if(temp > 0) {
						current = current.getLeft();
					} else {
						current = current.getRight();
					}
					height++;
				}
				if(current !== null) return height;
				return -1;
			};
			that.depth = function(node) {
				
				var depth_ = function(node) {
					if(node == null) {
						return 0;
					} else {
						return 1 + Math.max(depth_(node.getLeft()), depth_(node.getRight()));
					}
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				return depth_(node);
			};
			that.commonAncestor = function(node, p, q) {
				
				var covers = function(_root, p) {
					if(_root == null) return false
					if(_root == p) return true;
					return (covers(_root.getLeft(), p) || covers(_root.getRight(), p));
				};
				
				var commonAncestor_ = function(node, p, q) {
					var isPOnLeft = covers(node.getLeft(), p);
					var isQOnLeft = covers(_root.getLeft(), q);
					
					if(isPOnLeft != isQOnLeft) return node;
					var childSide = isPOnLeft ? node.getLeft(): node.getRight();
					return commonAncestor_(childSide, p, q);
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				var current = node || _root;
				if(!covers(current, p) || !covers(current, q)) {
					return null;
				}
				return commonAncestor_(current, p, q);
			};
			/*that.commonAncestor = function(node, p, q) {
				
				var result = function(node, isAncestor) {
					return {'node': node, 'isAncestor': isAncestor};
				};
				
				var commonAncestor_ = function(node, p, q) {
					if(node == null) {
						return result(null, false);
					}
					if(node == p && node == q) {
						return result(node, true);
					}
					
					var rx = commonAncestor_(node.left, p, q);
					if(rx.isAncestor) {
						return rx;
					}
					
					var ry = commonAncestor_(node.right, p, q);
					if(ry.isAncestor) {
						return ry;
					}
					
					if(rx.node != null && ry.node != null) {
						return result(node, true);
					} else if(node == p || node == q) {
						var isAnc = ((rx.node != null || ry.node != null) ? true : false);
						return result(node, isAnc);
					} else {
						return result(((rx.node != null) ? rx.node : ry.node), false);
					}
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				var r = commonAncestor_(node, p, q);
				if(r.isAncestor) {
					return r.node;
				}
				return null;
			};*/
			/*that.inorderSucc = function(node) {
				
				var leftMostChild = function(node) {
					if(node == null) {
						return null;
					}
					while(node.left != null) {
						node = node.left;
					}
					return node;
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				if(node == null) return null;
				if(node.parent == null || node.right != null) {
					return leftMostChild(node.right);
				} else {
					var q = node;
					var x = q.parent;
					while(x != null && x.left != q) {
						q = x;
						x = x.parent;
					}
					return x;
				}
			};*/
			that.maxHeight = function() {
				var current = _root, h = 0, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						current = current.getRight();
					} else {
						stack.push(current);
						current = current.getLeft();
					}
					h = Math.max(h, that.depth(current));
				}
				return h;
			};
			//that.height = function(node) {
			//	if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
			//		throw {
			//			name: 'TypeError',
			//			message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
			//		};
			//	}
			//	if(this.isEmpty()) return 0;
			//	var current = node || _root;
			//	return 1 + Math.max(treeHeight(current.getLeft()), treeHeight(current.getRight()));
			//};
			that.has = function(data, func) {
				var current = _root;
				while(current && compare(current.getData(), data) != 0) {
					if(compare(current.getData(), data) > 0) {
						current = current.getLeft();
					} else {
						current = current.getRight();
					}
				}
				if(current !== null) return true;
				return false;
			};
			that.find = function(node, data, func) {
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				var current = node || _root;
				while(current && compare(current.getData(), data) != 0) {
					if(compare(current.getData(), data) > 0) {
						current = current.getLeft(); //return find(current.left, value)
					} else {
						current = current.getRight(); //return find(current.right, value)
					}
				}
				return current;
			};
			that.findSum = function(node, sum) {
				
				var getPath = function(path, start, end) {
					var res = [];
					for(var i=start; i<=end; i++) {
						res.push(path[i]);
					}
					return res;
				};
				
				var findSum_ = function(node, sum, path, level, res) {
					if(node == null) {
						return null;
					}
					path[level] = node.getData();
					var t = 0;
					for(var i=level; i>=0; i--) {
						t += path[i];
						if(t === sum) {
							res.push(getPath(path, i, level));
						}
					}
					
					findSum_(node.getLeft(), sum, path, level + 1, res);
					findSum_(node.getRight(), sum, path, level + 1, res);
					
					path[level] = Number.MIN_VALUE;
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				if(this.isEmpty()) return null;
				
				if(!globals.toolset.isNumber(sum)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: number < ' + sum + ' >'
													};
				}
				var depth = this.depth(node);
				var path = globals.toolset.vector(), res = globals.toolset.vector();
				return findSum_(node, sum, path, 0, res);
			};
			that.containsTree = function(node1, node2) {
				
				var matchTree = function(r1, r2) {
					if(r2 == null && r1 == null) {
						return true;
					}
					if(r1 == null || r2 == null) {
						return false;
					}
					if(compare(r1, r2) != 0) {
						return false;
					}
					return (matchTree(r1.getLeft(), r2.getLeft()) && matchTree(r1.getRight(), r2.getRight()));
				};
				
				var subTree = function(r1, r1) {
					if(r1 == null) {
						return false;
					}
					if(compare(r1, r2) == 0) {
						if(matchTree(r1, r2)) return true;
					}
					return (subTree(r1.getLeft(), r2) || subTree(r1.getRight(), r2));
				};
				
				if(node1 != null && !(node1 instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: {node1} is not BinaryTreeNode instance < ' + node1 + ' >'
					};
				}
				
				if(node2 != null && !(node2 instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: {node2} is not BinaryTreeNode instance < ' + node2 + ' >'
					};
				}
				
				if(node2 == null) return true;
				return subTree(node1, node2);
			};
			that.getRank = function(data) {
				var node = this.find(null, data);
				var result = null;
				if(node != null) {
					result = this.inorderTraversal(node);
					return result.indexOf(data);
				}
				return -1;
			};
			that.rank = function(data) {
				
				var rank_ = function(current) {
					if(current == null) return 0;
					var order = compare(data, current.getData());
					if(order < 0) {
						return rank_(current.getLeft());
					}
					if(order > 0) {
						return 1 + this.size(current.getLeft()) + rank_(current.getRight());
					}
					return this.size(current.getLeft());
				};

				return rank_(_root);
			};
			that.ceil = function(data) {
				
				var ceil_ = function(current) {
					if(current == null) return null;
					var order = compare(data, current.getData());
					if(order === 0) {
						return current;
					}
					if(order > 0) {
						return ceil_(current.getRight());
					}
					return (ceil_(current.getLeft()) || current);
				};

				return ceil_(_root);
			};
			that.floor = function(data) {
				
				var floor_ = function(current) {
					if(current == null) return null;
					var order = compare(data, current.getData());
					if(order === 0) {
						return current;
					}
					if(order < 0) {
						return floor_(current.getLeft());
					}
					return (floor_(current.getRight()) || current);
				};

				return floor_(_root);
			};
			that.isBalanced = function(node) {
				
				var checkHeight = function(node) {
					if(node == null) {
						return 0;
					}
					var leftHeight = checkHeight(node.getLeft());
					if(leftHeight == -1) {
						return -1;
					}
					var rightHeight = checkHeight(node.getRight());
					if(rightHeight == -1) {
						return -1;
					}
					var heightDiff = leftHeight - rightHeight;
					if(Math.abs(heightDiff) > 1) {
						return -1;
					} else {
						return Math.max(leftHeight, rightHeight) + 1;
					}
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				return (checkHeight(node) != -1);
			};
			that.rotateRight = function() {
				if(this.isEmpty()) return null;
				var new_root = _root.getLeft();
				_root.setLeft(new_root.getRight());
				new_root.setRight(_root);
				return new_root;
			};
			that.rotateLeft = function() {
				if(this.isEmpty()) return null;
				var new_root = _root.getRight();
				_root.setRight(new_root.getLeft());
				new_root.setLeft(_root);
				return new_root;
			};
			that.heapify = function(node) {
				
				var traverse = function(node, count, arr) {
					if(null == node) return count;
					if(null != arr) arr[count] = node;
					count++;
					count = traverse(node.getLeft(), count, arr);
					count = traverse(node.getRight(), count, arr);
					return count;
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
			
				if(this.isEmpty()) return null;			
				//подсчет узлов
				node = node || _root;
				var size = traverse(node, 0, null);
				var nodeArray = globals.toolset.vector(size);
				//загрузка узлов в массив
				traverse(node, 0, nodeArray);
				nodeArray.sort(compare(m, n));
				//Переназначение потомков для каждого узла
				for(var i=0; i<size; i++) {
					var left = 2 * i + 1;
					var right = left + 1;
					nodeArray[i].setLeft(((left >= size) ? null : nodeArray[left]));
					nodeArray[i].setRight(((right >= size) ? null : nodeArray[right]));
				}
				return nodeArray;
			};
			that.findLowestCommonAncestor = function(node, value1, value2) {
				
				if(node!= null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				if(this.isEmpty()) return null;
				
				var current = node || _root;
				while(current != null) {
					var value = current.getData();
					if(compare(value, value1) > 0 && compare(value, value2) > 0) {
						current = current.getLeft();
					} else if(compare(value, value1) < 0 && compare(value, value2) < 0) {
						current = current.getRight();
					} else {
						return current;
					}
				}
				return null;
			};
			that.findLowestCommonAncestor2 = function(node, child1, child2) {
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: {node} is not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				
				if(!(child1 instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: {child1} is not BinaryTreeNode instance < ' + child1 + ' >'
					};
				}
				
				if(!(child2 instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: {child2} is not BinaryTreeNode instance < ' + child2 + ' >'
					};
				}
				
				if(node == null || child1 == null || child2 == null) return null;
				return this.findLowestCommonAncestor(node, child1.getData(), child2.getData());
			};
			/*var findLowestCommonAncestor = function(node, value1, value2) {
				if(that.isEmpty()) return null;
				node = node || _root;
				while(node != null) {
					var value = node.data;
					if(compare(value, value1) > 0 && compare(value, value2) > 0) {
						node = node.left;
					} else if(compare(value, value1) < 0 && compare(value, value2) < 0) {
						node = node.right;
					} else {
						return node;
					}
				}
				return null;
			};
			that.lowestCommonAncestor = polymorph(
				{node: Object, value1: Number, value2: Number},
				function(node, value1, value2) {
					return findLowestCommonAncestor(node, value1, value2);
				},
				{node: Object, child1: Object, child2: Object},
				function(node, child1, child2) {
					if(node == null || child1 == null || child2 == null) return null;
					return findLowestCommonAncestor(node, child1.data, child2.data);
				}
			);*/
			that.isBST = function(node) {
				
				var isBST_ = function(node, min, max) {
					if(node == null) {
						return true;
					}
					if(node.getData() <= min || node.getData() > max) {
						return false;
					}
					if(!checkBST_(node.getLeft(), min, node.getData()) || !checkBST_(node.getRight(), node.getData(), max)) {
						return false;
					}
					return true;
				};
		
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				var current = node || _root;
				return isBST_(current, Number.MIN_VALUE, Number.MAX_VALUE);
			};
			that.createLevelLinkedList = function() {
				
				var createLevelLinkedList_ = function(node, lists, level) {
					if(node == null) return null;
					var list = null;
					if(lists.length === level) {
						list = new globals.collections.list.List();
						lists.add(list);
					} else {
						list = lists[level];
					}
					list.add(node);
					createLevelLinkedList_(node.getLeft(), lists, level + 1);
					createLevelLinkedList_(node.getRight(), lists, level + 1);
				};
				
				var lists = globals.toolset.vector();
				createLevelLinkedList(_root, lists, 0);
				return lists;
			};
			that.createLevelLinkedList = function() {
				var current = _root;
				var result = globals.toolset.vector();
				var current = new globals.collections.list.List();
				if(current != null) {
					current.add(current);
				}
				while(current.size() > 0) {
					result.push(current);
					var it = current.iterator();
					current = new globals.collections.list.List();
					while(it.hasNext()) {
						var current = it.next();
						if(current.getData().getLeft() != null) {
							current.add(current.getData().getLeft());
						}
						if(current.getData().getRight() != null) {
							current.add(current.getData().getRight());
						}
					}
				}
				return result;
			};
			that.nodesOnLevel = function(level) {
				
				var nodesOnLevel_ = function(node, level) {
					if(node == null) return 0;
					if(level == 1) return 1;
					return nodesOnLevel_(node.getLeft(), level - 1) + nodesOnLevel_(node.getRight(), level - 1);
				};
				
				if(!globals.toolset.isIntNumber(level)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not positive integer number < ' + level + ' >'
														};
				}
				if(level < 0) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: level < ' + level + ' > is negative');
				}
				return nodesOnLevel_(_root, level);
			};
			that.size = function(node) {
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				var current = node || _root, index = 0;
				var stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						current = current.getRight();
						index++;
					} else {
						stack.push(current);
						current = current.getLeft();
					}
				}
				return index;
			};
			that.breadthFirstIterator = function() {
				return new globals.collections.tree.iterator.BreadthFirstIterator(_root);
			};
			that.max = function(node) {
				
				var max_ = function(current) {
					if(current == null) return null;
					//if(current.getRight() == null) return current.getData();
					//return max_(current.getRight());
					while(current.getRight()) {
						current = current.getRight();
					}
					return current;
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				var current = node || _root;
				return max_(current);
			};
			that.min = function(node) {
				
				var min_ = function(current) {
					if(current == null) return null;
					//if(current.getRight() == null) return current.getData();
					//return min_(current.getRight());
					while(current.getLeft()) {
						current = current.getLeft();
					}
					return current;
				};
				
				if(node != null && !(node instanceof globals.collections.tree.node.BinaryTreeNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not BinaryTreeNode instance < ' + node + ' >'
					};
				}
				var current = node || _root;
				return min_(current);
			};
			that.toString = function() {
				var res = '[ ';
				for(var it = this.breadthFirstIterator(); it.hasNext(); ) {
					res += it.next().toString();
					if(it.hasNext()) res += ', ';
				}
				return res + ']';
			};
			that.clone = function() {
				return new globals.collections.tree.BinaryTree(this.outputAsc(), compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeError',
															message: 'incorrect initialization argument: not array < ' + nodes + ' >'
														};
					}
					_root = createMinimalBST(nodes);
					//for(var i=0; i<nodes.length; i++) {
					//	that.add(nodes[i]);//data.push(element);
					//}
				}
			};
			
			function BinaryTree(nodes, cmp) {
				_root = null;
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			BinaryTree.prototype = that;
			
			globals.collections.tree.BinaryTree = BinaryTree;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));