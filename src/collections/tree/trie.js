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
	const isTrie = (value) => (value instanceof globals.collections.tree.Trie);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of nodes.
	* @param {Function} compare Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Trie.
	*
	* @example
	* var myBinaryTree = new globals.collections.tree.Trie([1, 4, 5, 5, 6, 7]);
	*/
	(function() {
		globals.collections.tree = globals.collections.tree || {};
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.tree.node = globals.collections.tree.node || {};
//----------------------------------------------------------------------------------------------
			(function() {	
				var _data = null;
				var _son = null;
				var _brother = null;
				var _terminal = null;
				
				var that = {};	
				that.getData = function() {
					return _data;
				};
				that.setData = function(data) {
					_data = data;
				};
				that.getSon = function() {
					return _son;
				};
				that.setSon = function(son) {
					_son = son;
				};
				that.getBrother = function() {
					return _brother;
				};
				that.setBrother = function(brother) {
					_brother = brother;
				};
				that.isTerminal = function() {
					return _terminal;
				};
				that.setTerminal = function(terminal) {
					_terminal = terminal;
				};
				that.compareTo = function(node) {
					if(node == null) {
						throw {
							name: 'NullPointerError',
							message: 'incorrect input parameter: {node} is null  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.tree.node.TrieNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: not TrieNode instance  < ' + node + ' >'
						};
					}
					return compare(_data, node.getData());
					//return (_data < node.getData() ? -1 : (_data == node.getData() ? 0 : 1));
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.tree.node.TrieNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					//return (_data === node.getData());// && _next === node.getNext());
					return ((_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
							(_terminal == node.isTerminal() || (_terminal != null && _terminal.equals(node.isTerminal()))) &&
							(_son == node.getSon() || (_son != null && _son.equals(node.getSon()))) &&
							(_brother == node.getBrother() || (_brother != null && _brother.equals(node.getBrother()))));
				};
				that.hashCode = function() {
					var sfVal;
					var hashValue = 11;
					
					sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_terminal == null) ? 0 : _terminal.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_son == null) ? 0 : _son.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					sfVal = (_brother == null) ? 0 : _brother.hashCode();
					hashValue = 31 * hashValue + sfVal;
					
					return hashValue;
				};
				that.clone = function() {
					return new globals.collections.tree.node.TrieNode(_data, _son, _brother, _terminal);
				};
				that.toString = function() {
					return "[data: {" + _data.toString() + "}, terminal: {" + _terminal.toString() + "}]";
				};
				
				function TrieNode(data, son, brother, terminal) {
					_data = Object.clone(data);
					_son = son;
					_brother = brother;
					_terminal = terminal;
				};
				TrieNode.prototype = that;
				
				globals.collections.tree.node.TrieNode = TrieNode;
			}());
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			globals.collections.tree.iterator = globals.collections.tree.iterator || {};
//----------------------------------------------------------------------------------------------
			(function() {
				var _current = null;
				var _index = null;
				
				var that = {};
				that.hasNext = function() {
					return (current != null);
				};
				that.next = function() {
					if(!this.hasNext()) return null;
					var result = current.getData();
					
					if(current.getSon() != null) current = current.getSon();
					while(current != null && current.isYoungest()) {
						current = current.getBrother();
					}
					if(current != null) current = current.getBrother();
					_index++;
					return result;
				};
				that.nextIndex = function() {
					if(!this.hasNext()) return _index;
					return (_index + 1);
				};
				
				function UpDownTreeIterator(root) {
					_current = root;
					_index = -1;
				};
				UpDownTreeIterator.prototype = that;
				
				globals.collections.tree.iterator.UpDownTreeIterator = UpDownTreeIterator;
			}());
		}());
//----------------------------------------------------------------------------------------------		
		(function() {
			var _root = null;
			
			var that = {};
			that.find = function(key) {
				if(!globals.toolset.isString(key)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not a string < ' + key + ' >'
														};
				}
				var current = _root;
				for(var i=0; i<key.length; i++) {
					var nextChar = key.charAt(i);
					while(current != null && (current.isTerminal() || !nextChar.equals(current.getData()))) {
						current = current.getBrother();
					}
					if(current == null) return null;
					current = current.getSon();
				}
				
				while(current != null && !current.isTerminal()) {
					current = current.getBrother();
				}
				return (current == null ? null : current.getData());
			};
			that.add = function(data) {
				var node = new globals.collections.tree.node.Node(data, null, null);
				if(this.isEmpty()) {
					_root = node;
				} else {
					var current = _root, order;
					while(current !== null) {
						order = compare(current.data, data);
						if(order == 0) {
							return false;
						}
						if(order > 0) {
							current = current.left;
						} else {
							current = current.right;
						}
					}
					current = node;
				}
			};
			that.insertRoot = function(item) {
				const LEFT = 1;
				const RIGHT = 2;
				
				var current = _root;
				var nodeLeft = new globals.collections.tree.node.TrieNode(item, null, null);
				
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
						result.push(current.data);
						current = current.right;
					} else {
						stack.push(current);
						current = current.left;
					}
				}
				return result;
			};
			that.outputDesc = function() {
				var result = globals.toolset.vector(), current = _root, stack = new globals.collections.stack.Stack();
				while(current || !stack.isEmpty()) {
					if(current === null) {
						current = stack.pop();
						result.push(current.data);
						current = current.left;
					} else {
						stack.push(current);
						current = current.right;
					}
				}
				return result;
			};
			//time = O(n)
			that.preorderTraversal = function(node) {
				if(this.isEmpty()) return;
				node = node || _root;
				var curr, n, result = globals.toolset.vector(), stack = new globals.collections.stack.Stack();
				stack.push(node);
				while(stack.size() > 0) {
					curr = stack.pop();
					result.push(curr.data);
					n = curr.right;
					if(null != n) stack.push(n);
					n = curr.left;
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
					result.push(node.data);
					preorderTraversal_(node.left);
					preorderTraversal_(node.right);
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
					inorderTraversal_(node.left);
					result.push(node.data);
					inorderTraversal_(node.right);
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
			that.remove = function(item) {
				const LEFT = -1;
				const RIGHT = 1;
				const IDLE = 0;
				
				var parent = null;
				var current = _root;
				var comp = 0;
				var lastStep = IDLE;
				
				while(current != null && (comp = compare(current.getData(), item)) != 0) {
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
						func(current.getData());
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
				
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
					};
				}
				return depth_(node);
			};
			that.commonAncestor = function(node, p, q) {
				
				var covers = function(_root, p) {
					if(_root == null) return false
					if(_root == p) return true;
					return (covers(_root.left, p) || covers(_root.right, p));
				};
				
				var commonAncestor_ = function(node, p, q) {
					var isPOnLeft = covers(node.left, p);
					var isQOnLeft = covers(_root.left, q);
					
					if(isPOnLeft != isQOnLeft) return node;
					var childSide = isPOnLeft ? node.left: node.right;
					return commonAncestor_(childSide, p, q);
				};
				
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
						current = current.right;
					} else {
						stack.push(current);
						current = current.left;
					}
					h = Math.max(h, that.depth(current));
				}
				return h;
			};
			//that.height = function(node) {
			//	if(this.isEmpty()) return 0;
			//	node = node || _root;
			//	return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
			//};
			that.has = function(data, func) {
				var current = _root;
				while(current && compare(current.data, data) != 0) {
					if(compare(current.data, data) > 0) {
						current = current.left;
					} else {
						current = current.right;
					}
				}
				if(current !== null) return true;
				return false;
			};
			that.find = function(node, data, func) {
				var current = node || _root;
				while(current && compare(current.data, data) != 0) {
					if(compare(current.data, data) > 0) {
						current = current.left; //return find(current.left, value)
					} else {
						current = current.right; //return find(current.right, value)
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
					path[level] = node.data;
					var t = 0;
					for(var i=level; i>=0; i--) {
						t += path[i];
						if(t === sum) {
							res.push(getPath(path, i, level));
						}
					}
					
					findSum_(node.left, sum, path, level + 1, res);
					findSum_(node.right, sum, path, level + 1, res);
					
					path[level] = Number.MIN_VALUE;
				};
				
				if(this.isEmpty()) return null;
				if(!globals.toolset.isNumber(sum)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: number < ' + sum + ' >'
													};
				}
				var depth = this.depth(node);
				var path = [], res = [];
				return findSum_(node, sum, path, 0, res);
			};
			that.containsTree = function(node1, node2) {
				
				var match = function(r1, r2) {
					if(r2 == null && r1 == null) {
						return true;
					}
					if(r1 == null || r2 == null) {
						return false;
					}
					if(compare(r1, r2) != 0) {
						return false;
					}
					return (matchTree(r1.left, r2.left) && matchTree(r1.right, r2.right));
				};
				
				var subTree = function(r1, r1) {
					if(r1 == null) {
						return false;
					}
					if(compare(r1, r2) == 0) {
						if(matrchTree(r1, r2)) return true;
					}
					return (subTree(r1.left, r2) || subTree(r1.right, r2));
				};
				
				if(node2 == null) {
					return true;
				}
				return subTree(current, t2);
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
				
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
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
					count = traverse(node.left, count, arr);
					count = traverse(node.right, couint, arr);
					return count;
				};
				
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
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
					nodeArray[i].left = ((left >= size) ? null : nodeArray[left]);
					nodeArray[i].right = ((right >= size) ? null : nodeArray[right]);
				}
				return nodeArray;
			};
			that.findLowestCommonAncestor = function(node, value1, value2) {
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
					};
				}
				
				if(this.isEmpty()) return null;
				node = node || _root;
				while(node != null) {
					var value = node.getData();
					if(compare(value, value1) > 0 && compare(value, value2) > 0) {
						node = node.getLeft();
					} else if(compare(value, value1) < 0 && compare(value, value2) < 0) {
						node = node.getRight();
					} else {
						return node;
					}
				}
				return null;
			};
			that.findLowestCommonAncestor2 = function(node, child1, child2) {
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
					};
				}
				if(!(child1 instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance {child1} < ' + child1 + ' >'
					};
				}
				if(!(child2 instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance {child2} < ' + child2 + ' >'
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
		
				if(!(node instanceof globals.collections.tree.node.TrieNode)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input argument: not TrieNode instance < ' + node + ' >'
					};
				}
				var current = node || _root;
				return isBST_(current, Number.MIN_VALUE, Number.MAX_VALUE);
			};
			that.createLevelLinkedList = function() {
				
				var createLevelLinkedList_ = function(node, lists, level) {
					if(node == null) return;
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
				var node = _root;//node || _root;
				createLevelLinkedList(node, lists, 0);
				return lists;
			};
			that.createLevelLinkedList = function() {
				var node = _root;//node || _root;
				var result = globals.toolset.vector();
				var current = new globals.collections.list.List();
				if(node != null) {
					current.add(node);
				}
				while(current.size() > 0) {
					result.push(current);
					var it = current.iterator();
					current = new globals.collections.list.List();
					while(it.hasNext()) {
						var node = it.next();
						if(node.getData().getLeft() != null) {
							current.add(node.getData().getLeft());
						}
						if(node.getData().getRight() != null) {
							current.add(node.getData().getRight());
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
			that.size = function() {
				var current = _root, index = 0;
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
			that.upDownTreeIterator = function() {
				return new globals.collections.tree.iterator.UpDownTreeIterator(_root);
			};
			that.toString = function() {
				var res = '[ ';
				for(var it = this.upDownTreeIterator(); it.hasNext(); ) {
					res += it.next().toString() + " ";
				}
				return res + ']';
			};
			that.clone = function() {
				return new globals.collections.tree.Tree(this.outputAsc(), compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'TypeError',
															message: 'incorrect initialization argument: not array < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.add(nodes[i]);//data.push(element);
					}
				}
			};
			
			function Trie(nodes, cmp) {
				_root = null;
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Trie.prototype = that;
			
			globals.collections.tree.Trie = Trie;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));