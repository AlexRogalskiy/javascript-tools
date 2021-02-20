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
  const isSet2 = value => value instanceof globals.collections.set.Set2;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} nodes Input array of items.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, dep_ending on the arguments.
   * @return {Object} Set.
   *
   * @example
   * var mySet = new globals.collections.set.Set2([1, 4, 5, 5, 6, 7]);
   */
  (function () {
    globals.collections.set = globals.collections.set || {};
    //----------------------------------------------------------------------------------------------
    /*var node = (function() {
			globals.collections.list.node = globals.collections.list.node || {};
//----------------------------------------------------------------------------------------------	
			(function() {
				var _data = null;
				var _next = null;
				
				var that = {};
				that.getData = function() {
					return _data;
				};
				that.setData = function(data) {
					_data = Object.clone(data);
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
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					if(!(node instanceof globals.collections.list.node.BinSetNode)) {
						throw {
							name: 'TypeError',
							message: 'incorrect input parameter: node  < ' + node + ' >'
						};
					}
					return compare(_data, node.getData());
					//return (_data < node.getData() ? -1 : (_data === node.getData() ? 0 : 1));
				};
				that.equals = function(node) {
					if(node == this) return true;
					if(!(node instanceof globals.collections.list.node.BinSetNode)) return false;
					//if((node == null) || (node.getClass() != this.getClass())) return false;
					return (_data === node.getData());// && _next === node.getNext());
					//return (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
					//		(_next == node.getNext() || (_next != null && _next.equals(node.getNext())));
				};
				that.hashCode = function() {
					var sfVal;
					var hashValue = 11;
					sfVal = (_data == null) ? 0 : _data.hashCode();
					hashValue = 31 * hashValue + sfVal;
					//sfVal = (_next == null) ? 0 : _next.hashCode();
					//hashValue = 31 * hashValue + sfVal;
					return hashValue;
				};
				that.toString = function() {
					console.log("(_data: {" + _data.toString() + "}, next: {" + _next + "})");
				};
				
				function BinSetNode(data, next) {
					_data = Object.clone(data);
					_next = next;
				};
				BinSetNode.prototype = that;
				
				globals.collections.list.node.BinSetNode = BinSetNode;
			}());
		}());*/

    (function () {
      var _start = null;
      var _end = null;
      var _count = null;

      var that = {};
      that.add = function (data) {
        var rinsert_ = function (p, t) {
          if (p == null) return null;
          var order = compare(p.getData(), t);
          if (order < 0) {
            var m = rinsert_(p.getNext(), t);
            if (m == null) {
              p.setNext(new globals.collections.list.node.ListNode(t, m));
              _end = p.getNext();
            } else {
              p.setNext(m);
            }
          } else if (order > 0) {
            p = new globals.collections.list.node.ListNode(t, p);
            //_end = p.getNext();
            _count++;
          }
          return p;
        };
        _start = rinsert_(_start, data);
        return this;
      };
      that.report = function () {
        var result = globals.toolset.vector();
        for (var p = _start; p != _end; p = p.getNext()) {
          result.push(p.getData());
        }
        return result;
      };
      that.equals = function (set) {
        if (set == this) return true;
        if (!isSet(set)) return false;

        //if((node == null) || (node.getClass() != this.getClass())) return false;
        //return (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
        //		(_next == node.getNext() || (_next != null && _next.equals(node.getNext())));

        if (this.size() !== set.size()) return false;
        for (var p = _start; p != _end; p = p.getNext()) {
          if (!set.has(p.getData())) return false;
        }
        return true;
      };
      that.contains = function (set) {
        if (!isSet(set)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input set: not {Set} instance < ' + set + ' >',
          };
        }
        if (this.size() < set.size()) return false;
        var elem = set.report();
        for (var i = 0; i < elem.length; i++) {
          if (!this.has(elem[i])) return false;
        }
        return true;
      };
      that.union = function (set) {
        if (!isSet(set)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input set: not {Set} instance < ' + set + ' >',
          };
        }
        var elem = set.report();
        for (var i = 0; i < elem.length; i++) {
          if (!this.has(elem[i])) this.add(elem[i]);
        }
        return this;
      };
      that.intersect = function (set) {
        if (!isSet(set)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input set: not {Set} instance < ' + set + ' >',
          };
        }
        for (var p = _start; p != _end; p = p.getNext()) {
          if (!set.has(p.getData())) this.remove(p.getData());
        }
        return this;
      };
      that.diff = function (set) {
        if (!isSet(set)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input set: not {Set} instance < ' + set + ' >',
          };
        }
        var elem = set.report();
        for (var i = 0; i < elem.length; i++) {
          if (this.has(elem[i])) this.remove(elem[i]);
        }
        return this;
      };
      that.clone = function () {
        return new globals.collections.set.Set2(this.report(), compare);
      };
      that.has = function (data) {
        var current = _start;
        while (current != _end) {
          if (compare(data, current.getData()) == 0) {
            return true;
          }
          current = current.getNext();
        }
        return false;
      };
      that.first = function () {
        if (this.isEmpty()) return null;
        return _start != null ? _start.getData() : null;
      };
      that.last = function () {
        if (this.isEmpty()) return null;
        return _end != null ? _end.getData() : null;
      };
      that.remove = function (data) {
        var current = _start;
        var previous = _start;
        while (current != _end) {
          if (compare(data, current.getData()) == 0) {
            if (current === _start) {
              _start = current.getNext();
              delete current;
              return true;
            }
            previous.setNext(current.getNext());
            delete current;
            return true;
          }
          previous = current;
          current = current.getNext();
        }
        return false;
      };
      that.removeAll = function () {
        if (_start === null) return false;
        var current = _start,
          temp;
        while (current != _end) {
          temp = current;
          current = current.getNext();
          delete temp;
        }
        _start = _end = null;
        _count = 0;
        return this;
      };
      that.each = function (func) {
        if (!globals.toolset.isFunction(func)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: function < ' + func + ' >',
          };
        }
        var current = _start;
        while (current != _end) {
          func(current);
          current = current.getNext();
        }
        return this;
      };
      that.isEmpty = function () {
        return _start === null;
      };
      that.size = function () {
        return _count;
      };

      var initialize = function (nodes) {
        if (!globals.toolset.isNull(nodes)) {
          if (!globals.toolset.isArray(nodes)) {
            throw {
              name: 'ValueError',
              message: 'incorrect initialization value: array of elem < ' + nodes + ' >',
            };
          }
          for (var i = 0; i < nodes.length; i++) {
            that.add(nodes[i]); //data.push(element);
          }
        }
      };

      function Set2(nodes, cmp) {
        _start = _end = new globals.collections.list.node.ListNode(Number.MAX_VALUE, null);
        _count = 0;

        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      Set2.prototype = that;

      globals.collections.set.Set2 = Set2;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
