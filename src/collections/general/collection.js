(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //----------------------------------------------------------------------------------------------
  const compare = function (a, b) {
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
  //----------------------------------------------------------------------------------------------
  const isCollection = value => value instanceof globals.collections.common.collection;
  //----------------------------------------------------------------------------------------------
  (function () {
    globals.collections.common = globals.collections.common || {};
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module collections
     * @param {Array} spec Input array of items.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Object} Abstract collection.
     *
     * @example
     * var myCollection = globals.collections.common.collection([1, 4, 5, 5, 6, 7]);
     */
    const collection = (function () {
      return function (spec, cmp) {
        let data = {},
          count = 0;
        //var that = {};
        const that = Object.create(globals.collections.common.collection);
        that.prototype = globals.collections.common.collection;
        //
        const init = function () {
          if (!globals.toolset.isNull(spec)) {
            if (!globals.toolset.isArray(spec)) {
              throw {
                name: 'ValueError',
                message: 'incorrect initialization value: array of elements [any type]',
              };
            }
            spec.forEach(function (value, index) {
              if (globals.toolset.isObject(value)) {
                for (const key in value) {
                  if (
                    !globals.toolset.isFunction(value[key]) &&
                    Object.prototype.hasOwnProperty.call(value, key)
                  ) {
                    that.add(key, value[key]);
                  }
                }
              } else {
                that.add(index, value);
              }
            });
          }
          cmp = globals.toolset.isFunction(cmp) ? cmp : compare;
        };

        that.add = function (key, value) {
          if (this.has(key)) {
            return null;
          }
          data[key] = Object.clone(value);
          return ++count;
        };
        that.remove = function (key) {
          if (!this.has(key)) {
            return null;
          }
          delete data[key];
          return --count;
        };
        that.removeAll = function () {
          for (const key in data) {
            if (this.has(key)) {
              delete data[key];
            }
          }
          count = 0;
          return count;
        };
        that.item = function (key) {
          if (!this.has(key)) {
            return null;
          }
          return data[key];
        };
        that.replace = function (key, value) {
          if (!this.has(key)) {
            return null;
          }
          data[key] = Object.clone(value);
          return count; //temp
        };
        that.each = function (func) {
          if (!globals.toolset.isFunction(func)) {
            throw {
              name: 'ValueError',
              message: `incorrect function value: < ${func} >`,
            };
          }
          for (const key in data) {
            if (this.has(key)) {
              func(data[key], key, this); //block.call(object,item);
            }
          }
        };
        that.values = function () {
          const result = [];
          for (const key in data) {
            if (this.has(key)) {
              result.push(data[key]);
            }
          }
          return result;
        };
        that.keys = function () {
          const result = [];
          for (const key in data) {
            if (this.has(key)) {
              result.push(key);
            }
          }
          return result;
        };
        that.entries = function () {
          const entries = [];
          for (const key in data) {
            if (this.has(key)) {
              entries[i] = {
                key,
                value: data[key],
              };
            }
          }
          return entries;
        };
        that.isEmpty = function () {
          return this.size() === 0;
        };
        that.has = function (key) {
          return Object.prototype.hasOwnProperty.call(data, key) && !globals.toolset.isNull(data[key]);
        };
        that.size = function () {
          return count;
        };
        that.clone = function () {
          return globals.collections.common.collection(this.entries(), cmp);
        };
        init();
        return that;
      };
    })();
    //----------------------------------------------------------------------------------------------
    //Exports block
    globals.collections.common.collection = collection;
    //----------------------------------------------------------------------------------------------
  })();
})(typeof globals !== 'undefined' ? globals : this);
