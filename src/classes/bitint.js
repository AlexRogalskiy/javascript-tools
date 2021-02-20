jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.bitInt = function (spec) {
  let bitset = [];
  //var that = {};
  const that = Object.create(jsar.utils.bitInt.prototype);
  //that.prototype = jsar.utils.bitInt;
  //
  const init = function () {
    if (!jsar.toolset.isNull(spec)) {
      if (!jsar.toolset.isObject(spec)) {
        throw jsar.exception.typeException({
          name: 'TypeException',
          message: 'incorrect initialization value: [object]',
        });
        //throw {
        //								name: 'ValueError',
        //								message: 'incorrect initialization value: [object]'
        //							};
      }
      if (
        Object.prototype.hasOwnProperty.call(spec, 'bitset') /*spec.hasOwnProperty('bitset')*/ &&
        jsar.toolset.isArray(spec.bitset)
      ) {
        bitset = spec.bitset.slice(0);
      } else if (
        Object.prototype.hasOwnProperty.call(spec, 'length') /*spec.hasOwnProperty('length')*/ &&
        jsar.toolset.isIntNumber(spec.length) &&
        spec.length > 0
      ) {
        for (let i = 0; i < spec.length; i++) {
          bitset[i] = 0;
        }
      } else if (
        Object.prototype.hasOwnProperty.call(spec, 'number') /*spec.hasOwnProperty('number')*/ &&
        jsar.toolset.isIntNumber(spec.number) &&
        spec.number >= 0
      ) {
        let n = 0;
        while (spec.number) {
          bitset[n++] = spec.number & 0x1;
          spec.number >>= 1;
        }
      } else {
        throw jsar.exception.argumentException({
          name: 'ArgumentException',
          message:
            "incorrect initialization value: {'bitset': [array of {0, 1}]} or {'number': [integer number] >= 0} or {'length': [integer number] > 0}",
        });
        //throw {
        //	name: 'ValueError',
        //	message: 'incorrect initialization value: {\'bitset\': [array of {0, 1}]} or {\'number\': [integer number] >= 0} or {\'length\': [integer number] > 0}'
        //};
      }
    }
  };
  const fullAdder = function (carry) {
    return function (b1, b2) {
      const sum = b1 ^ b2 ^ carry;
      carry = (b1 && b2) || (b1 && carry) || (b2 && carry);
      return sum;
    };
  };
  const fullSubstractor = function (borrow) {
    return function (b1, b2) {
      let diff;
      if (borrow) {
        diff = !(b1 ^ b2);
        borrow = !b1 || (b1 && b2);
      } else {
        diff = b1 ^ b2;
        borrow = !b1 && b2;
      }
      return diff;
    };
  };
  const isBitInt = function (x) {
    return x instanceof jsar.utils.bitInt;
  };
  that.bitsetLtEq = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = len - 1; i >= 0; i--) {
      if (bitset[i] && !y.getValueAt(i)) return false;
      if (!bitset[i] && y.getValueAt(i)) return true;
    }
    return true;
  };
  that.bitsetLt = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = len - 1; i >= 0; i--) {
      if (bitset[i] && !y.getValueAt(i)) return false;
      if (!bitset[i] && y.getValueAt(i)) return true;
    }
    return false;
  };
  that.bitsetGtEq = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = len - 1; i >= 0; i--) {
      if (bitset[i] && !y.getValueAt(i)) return true;
      if (!bitset[i] && y.getValueAt(i)) return false;
    }
    return true;
  };
  that.bitsetGt = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = len - 1; i >= 0; i--) {
      if (bitset[i] && !y.getValueAt(i)) return true;
      if (!bitset[i] && y.getValueAt(i)) return false;
    }
    return false;
  };
  that.bitsetAdd = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    const _fullAdder = fullAdder(false);
    for (let i = 0; i < len; i++) {
      bitset[i] = _fullAdder(bitset[i], y.getValueAt(i));
    }
    return this;
  };
  that.bitsetSubstract = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    let borrow = false;
    for (let i = 0; i < len; i++) {
      if (borrow) {
        if (bitset[i]) {
          bitset[i] = y.getValueAt(i);
          borrow = y.getValueAt(i);
        } else {
          bitset[i] = !y.getValueAt(i);
          borrow = true;
        }
      } else {
        if (bitset[i]) {
          bitset[i] = !y.getValueAt(i);
          borrow = false;
        } else {
          bitset[i] = y.getValueAt(i);
          borrow = y.getValueAt(i);
        }
      }
    }
    return this;
  };
  that.bitsetMultiply = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    const temp = jsar.utils.bitInt(this.getLength());
    const tempX = this.clone(),
      tempY = y.clone();
    if (this.count() < y.count()) {
      for (var i = 0; i < len; i++) {
        if (bitset[i]) temp.bitsetAdd(y.clone().shiftLeft(i));
        //if(bitset[i]) temp.bitsetAdd(y << i);
      }
    } else {
      for (var i = 0; i < len; i++) {
        if (y.getValueAt(i)) temp.bitsetAdd(this.clone().shiftLeft(i));
        //if(y.getValueAt(i)) temp.bitsetAdd(bitset << i);
      }
    }
    return temp;
  };
  that.bitsetDivide = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    if (!y.isChecked()) {
      throw { name: 'DivisionByZero', message: 'division by zero undefined' };
    }
    if (!this.isChecked()) {
      return;
    }
    let q = jsar.utils.bitInt(this.getLength()),
      r = jsar.utils.bitInt(this.getLength());
    if (this.isEquals(y)) {
      q[0] = 1;
      return { quotient: q, residue: r };
    }
    r = jsar.utils.bitInt({ bitset });
    if (this.bitsetLt(y)) {
      return;
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    let sig1 = 0;
    for (var i = len; i >= 0; i--) {
      sig1 = i;
      if (bitset[i]) break;
    }
    let sig2 = 0;
    for (var i = len; i >= 0; i--) {
      sig2 = i;
      if (y.getValueAt(i)) break;
    }
    let n = sig1 - sig2;
    const tempY = y.clone();
    tempY.shiftLeft(n);
    //y <<= n;
    n += 1;
    while (n--) {
      if (tempY.bitsetLtEq(r)) {
        q[n] = 1;
        r.bitsetSubstract(tempY);
      }
      tempY.shiftRight(1);
      //y >>= 1;
    }
    return { quotient: q, residue: r };
  };
  that.shiftLeft = function (n) {
    if (!jsar.toolset.isIntNumber(i) || i < 0 || i > bitset.length - 1) {
      throw {
        name: 'ValueError',
        message: `incorrect shift value: < ${n} >`,
      };
    }
    for (var i = 0; i < n; i++) {
      bitset.shift();
      bitset.push(0);
    }
    return this;
  };
  that.shiftRight = function (n) {
    if (!jsar.toolset.isIntNumber(i) || i < 0 || i > bitset.length - 1) {
      throw {
        name: 'ValueError',
        message: `incorrect shift value: < ${n} >`,
      };
    }
    for (var i = 0; i < n; i++) {
      bitset.pop();
      bitset.unshift(0);
    }
    return this;
  };
  that.and = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = 0; i < len; i++) {
      bitset[i] = bitset[i] === 1 && y.getValueAt(i) === 1 ? 1 : 0;
    }
    return this;
  };
  that.or = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = 0; i < len; i++) {
      bitset[i] = bitset[i] === 0 && y.getValueAt(i) === 0 ? 0 : 1;
    }
    return this;
  };
  that.xor = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = 0; i < len; i++) {
      bitset[i] = bitset[i] === y.getValueAt(i) ? 0 : 1;
    }
    return this;
  };
  that.invert = function () {
    bitset = bitset.map(function (item) {
      return item === 1 ? 0 : 1;
    });
    return this;
  };
  that.clone = function () {
    return jsar.utils.bitInt({ bitset });
  };
  that.nativeCopy = function () {
    const res = []; //bitset.slice(0);
    bitset.forEach(function (item, i) {
      res.push(item);
    });
    return res;
  };
  that.getValueAt = function (i) {
    if (!jsar.toolset.isIntNumber(i) || i < 0 || i > bitset.length - 1) {
      throw {
        name: 'ValueError',
        message: `incorrect index value: < ${i} >`,
      };
    }
    return bitset[i];
  };
  that.getValue = function () {
    return parseInt(this.toString(), 2);
  };
  that.toString = function () {
    return bitset.reverse().join('');
  };
  that.reset = function () {
    bitset.forEach(function (item, i) {
      if (item === 1) bitset[i] = 0;
    });
  };
  that.count = function () {
    let n = 0;
    //for(var i=0; i<bitset.length; i++) {
    //	if(bitset[i] === 1) n++;
    //}
    bitset.forEach(function (item, i) {
      if (item === 1) n++;
    });
    return n;
  };
  that.isChecked = function () {
    return bitset.indexOf('1') !== -1;
  };
  that.getLength = function () {
    return bitset.length;
  };
  that.isEquals = function (y) {
    if (!isBitInt(y)) {
      throw {
        name: 'ValueError',
        message: `not bitInt instance: < ${y} >`,
      };
    }
    const len = this.getLength() < y.getLength() ? this.getLength() : y.getLength();
    for (let i = 0; i < len; i++) {
      if (bitset[i] !== y.getValueAt(i)) return false;
    }
    return true;
  };
  init();
  return that;
};
