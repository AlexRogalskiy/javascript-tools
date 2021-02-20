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
  const isPoint3d = value => value instanceof globals.collections.utils.Point3d;
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
    globals.collections.utils = globals.collections.utils || {};
    //------------------------------------------------------------------------------
    (function () {
      let _x = null;
      let _y = null;
      let _z = null;

      const that = {};

      that.getX = function () {
        return _x;
      };

      that.setX = function (x) {
        _x = x;
      };

      that.getY = function () {
        return _y;
      };

      that.setY = function (y) {
        _y = y;
      };

      that.getZ = function () {
        return _z;
      };

      that.setY = function (z) {
        _z = z;
      };

      that.equals = function (point) {
        if (point == this) return true;
        if (!(point instanceof globals.collections.utils.Point)) return false;
        //if((node == null) || (node.getClass() != this.getClass())) return false;
        //return (_end === node.getEnd());
        return (
          (_x === point.getX() || (_x != null && _x.equals(point.getX()))) &&
          (_y === point.getY() || (_y != null && _y.equals(point.getY()))) &&
          (_z === point.getZ() || (_z != null && _z.equals(point.getZ())))
        );
      };

      that.hashCode = function () {
        let hashValue = 11;

        let sfVal = _x == null ? 0 : _x.hashCode();
        hashValue = 31 * hashValue + sfVal;

        sfVal = _y == null ? 0 : _y.hashCode();
        hashValue = 31 * hashValue + sfVal;

        sfVal = _z == null ? 0 : _z.hashCode();
        hashValue = 31 * hashValue + sfVal;

        return hashValue;
      };

      that.clone = function () {
        return new globals.collections.utils.Point3d(_x, _y, _z, compare);
      };

      that.toString = function () {
        return `(x: {${_x.toString()}}, y: {${_y.toString()}}, z: {${_z.toString()}})`;
      };

      function Point3d(x, y, z, cmp) {
        if (!globals.toolset.isNumber(x)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: <x> coordinate is not number < ${x} >`,
          };
        }
        if (!globals.toolset.isNumber(y)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: <y> coordinate is not number < ${y} >`,
          };
        }
        if (!globals.toolset.isNumber(z)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: <z> coordinate is not number < ${z} >`,
          };
        }
        _x = x;
        _y = y;
        _z = z;
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      Point3d.prototype = that;

      globals.collections.utils.Point3d = Point3d;
    })();
  })();
})(typeof exports !== 'undefined' ? exports : this);
