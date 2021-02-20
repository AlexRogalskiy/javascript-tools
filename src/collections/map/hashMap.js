(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //----------------------------------------------------------------------------------------------
  var compare = function (a, b) {
    var hasProperty = function (obj, prop) {
      var proto = obj.__proto__ || obj.constructor.prototype;
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
  const isHashMap = value => value instanceof globals.collections.map.HashMap;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} nodes Input array of items.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, depending on the arguments.
   * @return {Object} HashMap.
   *
   * @example
   * var myMap = new globals.collections.map.HashMap({'herb': 'H', 'road': 'R'});
   */
  (function () {
    globals.collections.map = globals.collections.map || {};
    //----------------------------------------------------------------------------------------------
    const MAX_SIZE = 10;
    //----------------------------------------------------------------------------------------------
    (function (globals) {
      globals.collections.map.node = globals.collections.map.node || {};
      //----------------------------------------------------------------------------------------------
      (function () {
        var _query = null;
        var _results = null;
        var _previous = null;
        var _next = null;

        var that = {};
        that.getQuery = function () {
          return _query;
        };
        that.setQuery = function (query) {
          _query = query;
        };
        that.getResults = function () {
          return _results;
        };
        that.setResults = function (results) {
          _results = results;
        };
        that.getPrevious = function () {
          return _previous;
        };
        that.setPrevious = function (previous) {
          _previous = previous;
        };
        that.getNext = function () {
          return _next;
        };
        that.setNext = function (next) {
          _next = next;
        };
        that.compareTo = function (node) {
          if (node == null) {
            throw {
              name: 'NullPointerError',
              message: 'incorrect input parameter: {node} is null  < ' + node + ' >',
            };
          }
          if (!(node instanceof globals.collections.map.node.MapListNode)) {
            throw {
              name: 'TypeError',
              message: 'incorrect input parameter: not MapListNode instance  < ' + node + ' >',
            };
          }
          return compare(_results, node.getResults());
          //return (_data < node.getData() ? -1 : (_data == node.getData() ? 0 : 1));
        };
        that.equals = function (node) {
          if (node == this) return true;
          if (!(node instanceof globals.collections.map.node.MapListNode)) return false;
          //if((node == null) || (node.getClass() != this.getClass())) return false;
          //return (_data === node.getData());// && _next === node.getNext());
          return (
            (_query == node.getQuery() || (_query != null && _query.equals(node.getQuery()))) &&
            (_results == node.getResults() || (_results != null && _results.equals(node.getResults()))) &&
            (_previous == node.getPrevious() ||
              (_previous != null && _previous.equals(node.getPrevious()))) &&
            (_next == node.getNext() || (_next != null && _next.equals(node.getNext())))
          );
        };
        that.hashCode = function () {
          var sfVal;
          var hashValue = 11;

          sfVal = _query == null ? 0 : _query.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _results == null ? 0 : _results.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _previous == null ? 0 : _previous.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _next == null ? 0 : _next.hashCode();
          hashValue = 31 * hashValue + sfVal;
          return hashValue;
        };
        that.toString = function () {
          return '[query: {' + _query.toString() + '}, results: {' + _results.toString() + '}]';
        };

        function MapListNode(query, results, previous, next) {
          _query = Object.clone(query);
          _results = Object.clone(results);
          _previous = previous;
          _next = next;
        }
        MapListNode.prototype = that;

        globals.collections.map.node.MapListNode = MapListNode;
      })();
    })();
    //----------------------------------------------------------------------------------------------
    (function () {
      var map = null;
      var head = null;
      var tail = null;
      var size = null;

      var that = {};
      that.moveToFront = function (node) {
        if (node != null && !(node instanceof globals.collections.map.node.MapListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: not MapListNode instance < ' + node + ' >',
          };
        }
        if (node == head) return false;
        this.removeFromList(node);
        node.setNext(head);
        if (head != null) {
          head.setPrevious(node);
        }
        head = node;
        size++;
        if (tail == null) {
          tail = node;
        }
      };
      that.movetoFront_ = function (query) {
        var node = _map.get(query);
        this.moveToFront(node);
      };
      that.removeFromList = function (node) {
        if (node != null && !(node instanceof globals.collections.map.node.MapListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: not MapListNode instance < ' + node + ' >',
          };
        }
        if (node == null) return false;
        if (this.isEmpty()) return false;
        if (node.getNext() != null || node.getPrevious() != null) {
          size--;
        }

        var prev = node.getPrevious();
        var next = node.getNext();

        if (prev != null) {
          prev.setNext(next);
        }
        if (next != null) {
          next.setPrevious(prev);
        }

        if (node == head) head = next;
        if (node == tail) tail = prev;

        node.setNext(null);
        node.setPrevious(null);
        delete node;
      };
      that.getResults = function (query) {
        var node = null;
        if (map.containsKey(query)) {
          node = map.get(query);
          this.moveToFront(node);
          return node.getResults();
        }
        return null;
      };
      that.insertResults = function (query, results) {
        var node = null;
        if (map.containsKey(query)) {
          node = map.get(query);
          node.setResults(results);
          moveToFront(node);
          return;
        }
        node = new globals.collections.map.node.MapListNode(query, results, null, null);
        moveToFront(node);
        map.put(query, node);
        if (_size > MAX_SIZE) {
          map.remove(_tail.getQuery());
          removeFromList(_tail);
        }
      };
      that.entries = function () {
        if (this.isEmpty()) return null;
        var entries = {},
          current = _head;
        do {
          entries[current.getQuery()] = current.getResults();
          //result.push({'query': current.query, 'results': current.results});
          current = current.getNext();
        } while (current != _tail);
        return entries;
      };
      that.each = function (func) {
        if (!globals.toolset.isFunction(func)) {
          throw {
            name: 'TypeError',
            message: 'incorrect function argument: not a function < ' + func + ' >',
          };
        }
        if (this.isEmpty()) return;
        var current = _head;
        do {
          func(current.getResults());
          current = current.getNext();
        } while (current != _tail);
      };
      that.isEmpty = function () {
        return _head === null || this.size() == 0;
      };
      that.size = function () {
        return _size;
      };
      that.clone = function () {
        return new globals.collections.map.HashMap(this.entries(), compare);
      };
      that.keys = function () {
        return _map.keys();
      };
      that.values = function () {
        return _map.values();
      };

      function HashMap(nodes, cmp) {
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
        map = globals.collections.map.Map(nodes, compare);
        head = null;
        tail = null;
        size = 0;
      }
      HashMap.prototype = that;

      globals.collections.map.HashMap = HashMap;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
