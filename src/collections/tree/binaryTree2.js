(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //----------------------------------------------------------------------------------------------
  var compare = function (a, b) {
    var hasProperty = function (obj, prop) {
      var proto = obj.__proto__ || obj.constructor.prototype;
      return prop in obj || prop in proto || proto[prop] === obj[prop];
      //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
    };
    if (a === b) {
      return 0;
    }
    if (typeof a === typeof b) {
      if (hasProperty(a, 'compareTo')) {
        return a.compareTo(b);
      } else {
        return a < b ? -1 : 1; //a.localCompare(b)
      }
    }
    return typeof a < typeof b ? -1 : 1;
  };
  //----------------------------------------------------------------------------------------------
  const isBinaryTree2 = value => value instanceof globals.collections.tree.BinaryTree2;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} spec Input array of items.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, depending on the arguments.
   * @return {Object} Binary tree.
   *
   * @example
   * var myBinaryTree = globals.collections.binaryTree2([1, 4, 5, 5, 6, 7]);
   */
  (function () {
    globals.collections.tree = globals.collections.tree || {};
    //----------------------------------------------------------------------------------------------
    var btSMF = function (level, node) {
      if (
        !globals.toolset.isIntNumber(level) ||
        !globals.toolset.isIntNumber(node) ||
        level < 0 ||
        node < 0
      ) {
        throw {
          name: 'ValueError',
          message: 'incorrect input values: level < ' + level + ' >, node < ' + node + ' >',
        };
      }
      return node + (1 << _evel) - 1;
    };
    //----------------------------------------------------------------------------------------------
    (function () {
      var _nodes = null;
      var _level = null;
      var _node = null;

      var that = {};
      that.addNode = function (value, func) {
        if (value === null) return false;
        if (this.isEmpty) {
          this.root(value);
          return true;
        }
        this.root();
        var current = this.getNode();
        while (current !== null) {
          if (cmp(current, value) > 0) {
            current = this.leftChild();
          } else {
            current = this.rightChild();
          }
        }
        this.setNode(value);
        return true;
      };
      that.removeNode = function (value, level, node) {
        var temp;
        if (this.isEmpty || !this.has(value)) return false;
        if (level === null) {
          temp = _nodes.splice(btSMF(level, node), 1);
        } else {
          temp = _nodes.splice(btSMF(level, node), 1);
        }
        delete temp;
      };
      that.setNode = function (value, level, node) {
        if (level === null) {
          _nodes[btSMF(level, node)] = value;
        } else {
          _nodes[btSMF(level, node)] = value;
        }
      };
      that.getNode = function (level, node) {
        if (level === null) {
          return _nodes[btSMF(level, node)];
        } else {
          return _nodes[btSMF(level, node)];
        }
      };
      that.root = function (value) {
        _level = 0;
        _node = 0;
        if (value !== null) {
          _nodes[btSMF(_level, _node)] = value;
        }
        return _nodes[btSMF(_level, _node)];
      };
      that.leftChild = function (value) {
        _level++;
        _node = _node * 2;
        if (value !== null) {
          _nodes[btSMF(_level, _node)] = value;
        }
        return _nodes[btSMF(_level, _node)];
      };
      that.rightChild = function (value) {
        _level++;
        _node = _node * 2 + 1;
        if (value !== null) {
          _nodes[btSMF(_level, _node)] = value;
        }
        return _nodes[btSMF(_level, _node)];
      };
      that.parent = function (value) {
        _level--;
        _node = Math.floor(_node >> 1);
        if (value !== null) {
          _nodes[btSMF(_level, _node)] = value;
        }
        return _nodes[btSMF(_level, _node)];
      };
      that.traverseAsc = function () {
        var thatt = this,
          result = [];
        var traverseTree = function traverseTree() {
          result.push(thatt.getNode());
          if (thatt.leftChild() !== null) traverseTree();
          thatt.parent();
          if (thatt.rightChild() !== null) traverseTree();
          thatt.parent();
        };
        thatt.root();
        traverseTree();
        return result;
      };
      that.traverseDesc = function () {
        var thatt = this,
          result = [];
        var traverseTree = function traverseTree() {
          result.push(thatt.getNode());
          if (thatt.rightChild() !== null) traverseTree();
          thatt.parent();
          if (thatt.leftChild() !== null) traverseTree();
          thatt.parent();
        };
        thatt.root();
        traverseTree();
        return result;
      };
      that.norm = function () {
        var thatt = this,
          k,
          result = [],
          seg = 0;
        var normi = function normi(len) {
          k = Math.floor(len / 2) + (len % 2) - 1;
          result.push(_nodes[k + seg]);
          if (len > 1) {
            if (k) {
              normi(k);
            }
            if (len - k - 1) {
              seg += k + 1;
              norm(len - k - 1);
            }
          }
        };
        thatt.root();
        normi(_nodes.length);
        return result;
      };
      that.each = function (func) {
        if (!globals.toolset.isFunction(func)) {
          throw {
            name: 'ValueError',
            message: 'incorrect function value: < ' + func + ' >',
          };
        }
        var thatt = this;
        var eachNode = function eachNode() {
          func(thatt.getNode(), thatt, this);
          if (thatt.rightChild() !== null) eachNode();
          thatt.parent();
          if (thatt.leftChild() !== null) eachNode();
          thatt.parent();
        };
        thatt.root();
        eachNode();
      };
      that.rotateRight = function () {
        this.root();
        var newRoot = this.leftChild();
        var rightChild = this.rightChild();
        that.parent();
        this.rightChild(this.root());
        this.root();
        this.leftChild(rightChild);
        this.root(newRoot);
      };
      that.rotateLeft = function () {
        this.root();
        var newRoot = this.rightChild();
        var leftChild = this.leftChild();
        that.parent();
        this.leftChild(this.root());
        this.root();
        this.rightChild(leftChild);
        this.root(newRoot);
      };
      that.isEmpty = function () {
        return this.size() === 0;
      };
      that.has = function (value) {
        if (value === null || this.isEmpty) return false;
        this.root();
        var current = this.getNode(),
          order;
        while (current !== null) {
          order = cmp(current, value);
          if (order == 0) return true;
          if (order > 0) {
            current = this.leftChild();
          } else {
            current = this.rightChild();
          }
        }
        return false;
        /*		var thatt = this;//, levelBack = _level, nodeBack = _node;
				var hasNode = function hasNode(nodeValue) {
					if(nodeValue === null) return false;
					if(nodeValue === data) return true;
					if(nodeValue > data) {
						return hasNode(thatt.leftChild());
					} else {
						return hasNode(thatt.rightChild());
					}
				};
				thatt.root();
				//var temp = hasNode(thatt.getNode());
				//_level = levelBack;
				//_node = nodeBack;
				return hasNode(thatt.getNode());//temp;*/
      };
      that.size = function () {
        return _nodes.length;
      };
      that.getLevel = function () {
        this.root();
        traverseTree();
        return _level;
      };
      that.toString = function () {
        var res = '[ ';
        return res + ']';
      };
      that.clone = function () {
        return globals.collections.tree.BinaryTree2(_nodes, compare);
      };

      var initialize = function (nodes) {
        if (!globals.toolset.isNull(nodes)) {
          if (!globals.toolset.isArray(nodes)) {
            throw {
              name: 'TypeError',
              message: 'incorrect initialization argument: not array < ' + nodes + ' >',
            };
          }
          for (var i = 0; i < nodes.length; i++) {
            that.addNode(nodes[i]);
          }
        }
      };

      function BinaryTree2(nodes, cmp) {
        _nodes = globals.toolset.vector();
        _level = 0;
        _node = 0;
        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      BinaryTree2.prototype = that;

      globals.collections.tree.BinaryTree2 = BinaryTree2;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
