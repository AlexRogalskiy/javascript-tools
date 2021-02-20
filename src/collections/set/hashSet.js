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
  const isHashSet = value => value instanceof globals.collections.set.HashSet;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} nodes Input array of items.
   * @param {Integer} size Collection _size.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, depending on the arguments.
   * @return {Object} Hast Set.
   *
   * @example
   * var myHashSet = new globals.collections.set.HashSet({}, {}, {}, {}, {}, {});
   */
  (function () {
    globals.collections.set = globals.collections.set || {};
    //----------------------------------------------------------------------------------------------
    const DEFAULT_SIZE = 100;
    const RATIO = 37; //31
    //----------------------------------------------------------------------------------------------
    (function () {
      var _size = null;
      var _dict = null;
      var _count = null;

      var hashCode = function (value) {
        var val = 0;
        for (i = 0; i < value.length; i++) {
          val = value[i].charCodeAt(i) + val * RATIO;
        }
        return val % _size;
      };

      var that = {};
      that.find = function (key) {
        return _dict[hashCode(key)];
      };
      that.entries = function () {
        var res = globals.toolset.vector(); //data.slice(0);
        _dict.forEach(function (item, i) {
          if (item !== null) {
            //temp = {'name': pm.fio, 'telephone': pm.tel, 'address': pm.addr};
            res.push(Object.clone(item));
          }
        });
        return res;
      };
      that.add = function (key, value) {
        var val = hashCode(key);
        if (this.find(key) == null) {
          _count++;
        }
        _dict[val] = Object.clone(value);
        return item;
      };
      that.remove = function (key) {
        if (this.isEmpty()) return false;
        var val = hashCode(key),
          item;
        if ((item = this.find(key)) == null) {
          return false;
        }
        _dict[val] = null;
        delete item;
        _count--;
        return true;
      };
      that.removeAll = function () {
        var item;
        for (var i = 0; i < _dict.length; i++) {
          if (_dict[i] !== null) {
            delete _dict[i];
            _dict[i] = null;
          }
        }
        _count = 0;
      };
      that.size = function () {
        return _size;
      };
      that.isEmpty = function () {
        return this.getCount() === 0;
      };
      that.getCount = function () {
        return _count;
      };
      that.clone = function () {
        return new globals.collections.set.HashSet(this.entries(), this.size(), compare);
      };

      var initialize = function (nodes) {
        if (!globals.toolset.isNull(nodes)) {
          if (!globals.toolset.isArray(nodes)) {
            throw {
              name: 'ValueError',
              message: 'incorrect initialization value: array of elements < ' + nodes + ' >',
            };
          }
          for (var i = 0; i < nodes.length; i++) {
            that.add(nodes[i]);
          }
        }
      };

      function HashSet(nodes, size, cmp) {
        _size = size == null ? DEFAULT_SIZE : globals.toolset.isIntNumber(size) && size > 0 ? size : null;
        if (_size == null) throw { name: 'ValueError', message: 'incorrect {size} value: < ' + _size + ' >' };

        _dict = globals.toolset.vector(_size, null);
        _count = 0;

        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      HashSet.prototype = that;

      globals.collections.set.HashSet = HashSet;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
