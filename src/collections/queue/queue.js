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
  const isQueue = value => value instanceof globals.collections.queue.Queue;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} nodes Input array of items.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, depending on the arguments.
   * @return {Object} Queue.
   *
   * @example
   * var myQueue = new globals.collections.queue.Queue([1, 4, 5, 5, 6, 7]);
   */
  (function () {
    globals.collections.queue = globals.collections.queue || {};
    //----------------------------------------------------------------------------------------------
    (function () {
      let _data = null;

      const isInRange = function (num) {
        return num < _data.length && num >= 0;
      };

      const that = {};
      that.enqueue = function (value) {
        _data.push(value);
      };
      that.dequeue = function () {
        if (this.isEmpty()) return null;
        return _data.shift();
      };
      that.head = function () {
        if (this.isEmpty()) return null;
        return _data[0];
        //return _data.first();
      };
      that.tail = function () {
        if (this.isEmpty()) return null;
        return _data[this.size() - 1];
        //return _data.last();
      };
      that.each = function (func) {
        if (!globals.toolset.isFunction(func)) {
          throw {
            name: 'TypeError',
            message: `incorrect input value: not a function < ${func} >`,
          };
        }
        for (let i = 0; i < this.size(); i++) {
          _data[i] = func(_data[i], i);
          //func(_data[i], i);
        }
      };
      that.remove = function (value) {
        if (!this.has(value)) return null;
        return _data.splice(_data.indexOf(value), 1);
      };
      that.removeAt = function (index) {
        if (!globals.toolset.isIntNumber(index)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: not positive integer number < ${index} >`,
          };
        }
        if (!isInRange(index)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            `incorrect input argument: index < ${index} > is out of range {0,${this.size()}}`
          );
        }
        return _data.splice(index, 1);
      };
      that.removeAll = function () {
        return _data.splice(0, this.size());
      };
      that.updateAt = function (index, value) {
        if (!globals.toolset.isIntNumber(index)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: not positive integer number < ${index} >`,
          };
        }
        if (!isInRange(index)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            `incorrect input argument: index < ${index} > is out of range {0,${this.size()}}`
          );
        }
        _data[index] = value;
      };
      that.entries = function () {
        const res = globals.toolset.vector(); //_data.slice(0);
        _data.forEach(function (item, i) {
          res.push(Object.clone(item));
        });
        return res;
      };
      that.isEmpty = function () {
        return this.size() === 0;
      };
      that.has = function (value) {
        return _data.indexOf(value) !== -1;
      };
      that.size = function () {
        return _data.length;
      };
      that.clone = function () {
        return new globals.collections.queue.Queue(this.entries(), compare);
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
            that.enqueue(nodes[i]); //_data.push(nodes[i]);
          }
        }
      };

      function Queue(nodes, cmp) {
        _data = globals.toolset.vector();

        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      Queue.prototype = that;

      globals.collections.queue.Queue = Queue;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
