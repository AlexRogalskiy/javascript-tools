(function (globals) {
  'use strict';
  //------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //------------------------------------------------------------------------------
  let compare = function (a, b) {
    const hasProperty = function (obj, prop) {
      const proto = obj.__proto__ || obj.constructor.prototype;
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
  //------------------------------------------------------------------------------
  const isTrieNode = function (x) {
    return x instanceof globals.collections.tree.node.TrieNode;
  };
  //------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} nodes Input array of nodes.
   * @param {Function} compare Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, depending on the arguments.
   * @return {Object} Point3d.
   *
   * @example
   * var point3d = new globals.collections.utils.Point3d(1, 1, 1);
   */
  (function () {
    globals.collections.tree = globals.collections.tree || {};
    //------------------------------------------------------------------------------
    (function () {
      globals.collections.tree.node = globals.collections.tree.node || {};
      //------------------------------------------------------------------------------
      (function () {
        let _data = null;
        let _son = null;
        let _brother = null;
        let _terminal = null;

        const that = {};
        that.getData = function () {
          return _data;
        };
        that.setData = function (data) {
          _data = data;
        };
        that.getSon = function () {
          return _son;
        };
        that.setSon = function (son) {
          _son = son;
        };
        that.getBrother = function () {
          return _brother;
        };
        that.setBrother = function (brother) {
          _brother = brother;
        };
        that.isTerminal = function () {
          return _terminal;
        };
        that.setTerminal = function (terminal) {
          _terminal = terminal;
        };
        that.compareTo = function (node) {
          if (node == null) {
            throw {
              name: 'NullPointerError',
              message: `incorrect input parameter: {node} is null  < ${node} >`,
            };
          }
          if (!(node instanceof globals.collections.tree.node.TrieNode)) {
            throw {
              name: 'TypeError',
              message: `incorrect input parameter: not TrieNode instance  < ${node} >`,
            };
          }
          return compare(_data, node.getData());
          //return (_data < node.getData() ? -1 : (_data == node.getData() ? 0 : 1));
        };
        that.equals = function (node) {
          if (node == this) return true;
          if (!(node instanceof globals.collections.tree.node.TrieNode)) return false;
          //if((node == null) || (node.getClass() != this.getClass())) return false;
          //return (_data === node.getData());// && _next === node.getNext());
          return (
            (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
            (_terminal == node.isTerminal() || (_terminal != null && _terminal.equals(node.isTerminal()))) &&
            (_son == node.getSon() || (_son != null && _son.equals(node.getSon()))) &&
            (_brother == node.getBrother() || (_brother != null && _brother.equals(node.getBrother())))
          );
        };
        that.hashCode = function () {
          let sfVal;
          let hashValue = 11;

          sfVal = _data == null ? 0 : _data.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _terminal == null ? 0 : _terminal.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _son == null ? 0 : _son.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _brother == null ? 0 : _brother.hashCode();
          hashValue = 31 * hashValue + sfVal;

          return hashValue;
        };
        that.clone = function () {
          return new globals.collections.tree.node.TrieNode(_data, _son, _brother, _terminal);
        };
        that.toString = function () {
          return `[data: {${_data.toString()}}, terminal: {${_terminal.toString()}}]`;
        };

        function TrieNode(data, son, brother, terminal, cmp) {
          _data = Object.clone(data);
          _son = son;
          _brother = brother;
          _terminal = terminal;
          compare = globals.toolset.isFunction(cmp) ? cmp : compare;
        }
        TrieNode.prototype = that;

        globals.collections.tree.node.TrieNode = TrieNode;
      })();
    })();
  })();
})(typeof exports !== 'undefined' ? exports : this);
