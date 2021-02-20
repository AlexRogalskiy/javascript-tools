(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  (function () {
    //----------------------------------------------------------------------------------------------
    Boolean.method('xor', function (bool2) {
      const bool1 = this.valueOf();
      return (bool1 && !bool2) || (bool2 && !bool1);
      //return (bool1 == true && bool2 == false) || (bool2 == true && bool1 == false);
    });
    //----------------------------------------------------------------------------------------------
    Boolean.method('hashCode', function () {
      return this ? 0 : 1;
    });
    //----------------------------------------------------------------------------------------------
    Boolean.method('equals', function (bool) {
      if (bool == this) return true;
      if (!(globals.toolset.isBoolean(bool) || globals.toolset.isObject(bool))) return false;
      return this.toString() === bool.toString();
    });
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
