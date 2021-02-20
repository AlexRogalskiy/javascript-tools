(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //----------------------------------------------------------------------------------------------
  let compare = function (a, b) {
    const hasProperty = function (obj, prop) {
      const proto = obj.__proto__ || obj.constructor.prototype;
      return prop in obj || prop in proto || proto[prop] === obj[prop];
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
  const isGraph = value => value instanceof globals.collections.graph.Graph;
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
   * var myQueue = new globals.collections.graph.LGraph([1, 4, 5, 5, 6, 7]);
   */
  (function () {
    globals.collections.graph = globals.collections.graph || {};
    //----------------------------------------------------------------------------------------------
    const BACON_NUMBER = -1;
    //----------------------------------------------------------------------------------------------
    (function () {
      globals.collections.graph.node = globals.collections.graph.node || {};
      //----------------------------------------------------------------------------------------------
      (function () {
        let _data = null;
        let _set = null;

        const that = {};
        that.getData = function () {
          return _data;
        };
        that.setData = function (data) {
          _data = Object.clone(data);
        };
        that.getSet = function () {
          return _set;
        };
        that.addLink = function (node) {
          if (node == null) {
            throw {
              name: 'NullPointerError',
              message: `incorrect input parameter: node  < ${node} >`,
            };
          }
          if (!(node instanceof globals.collections.graph.node.GraphNode)) {
            throw {
              name: 'TypeError',
              message: `incorrect input parameter: node  < ${node} >`,
            };
          }
          _set.add(node);
          //node.addLink(this);
          node.getSet().add(this);
        };
        that.compareTo = function (node) {
          if (node == null) {
            throw {
              name: 'NullPointerError',
              message: `incorrect input parameter: node  < ${node} >`,
            };
          }
          if (!(node instanceof globals.collections.graph.node.GraphNode)) {
            throw {
              name: 'TypeError',
              message: `incorrect input parameter: node  < ${node} >`,
            };
          }
          return compare(_data, node.getData());
        };
        that.equals = function (node) {
          if (node == this) return true;
          if (!(node instanceof globals.collections.graph.node.GraphNode)) return false;
          //if((node == null) || (node.getClass() != this.getClass())) return false;
          return (
            (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
            (_set == node.getSet() || (_set != null && _set.equals(node.getSet())))
          );
        };
        that.hashCode = function () {
          let hashValue = 11;
          let sfVal = _data == null ? 0 : _data.hashCode();
          hashValue = 31 * hashValue + sfVal;
          sfVal = _set == null ? 0 : _set.hashCode();
          hashValue = 31 * hashValue + sfVal;
          return hashValue;
        };
        that.toString = function () {
          console.log(`(data: {${_data.toString()}}, edge: {${_set.entries().join(' ')}})`);
        };

        function GraphNode(data) {
          _data = globals.toolset.isIntNumber(data) ? data : -1;
          _set = new globals.collections.set.HashSet();
        }
        GraphNode.prototype = that;

        globals.collections.graph.node.GraphNode = GraphNode;
      })();
    })();
    //----------------------------------------------------------------------------------------------
    (function () {
      let _queue = null;
      //var _src = null;

      const that = {};
      that.add = function (item) {
        const node = new globals.collections.graph.node.GraphNode(item.data);
        _queue.add(node);
        //_src[_src.length] = node;
      };
      that.setBaconNumbers = function () {
        const _queue_temp = new globals.collections.list.LinkedList();
        for (const current in _queue.entries()) {
          if (current != null) {
            for (const n in current.getSet().entries()) {
              if (-1 === n.getData()) {
                n.setData(current.getData() + 1);
                _queue_temp.add(n);
              }
            }
          }
        }
        _queue = _queue_temp;
      };
      that.clone = function () {
        return new globals.collections.graph.Graph(_queue.entries(), compare);
      };
      that.isEmpty = function () {
        return _queue.isEmpty();
      };
      that.size = function () {
        return _queue.size();
      };

      const initialize = function (nodes) {
        if (!globals.toolset.isNull(nodes)) {
          if (!globals.toolset.isArray(nodes)) {
            throw {
              name: 'ValueError',
              message: `incorrect initialization value: array of elements < ${nodes} >`,
            };
          }
          for (let i = 0; i < nodes.length; i++) {
            that.add(nodes[i]); //data.push(element);
          }
        }
      };

      function Graph(nodes, cmp) {
        if (typeof new.target !== 'undefined') {
          throw new Error('ERROR: can be called only with new');
        }

        _queue = new globals.collections.list.LinkedList();
        //_src = globals.toolset.vector();
        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      Graph.prototype = that;

      globals.collections.graph.Graph = Graph;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
