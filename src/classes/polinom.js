jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.polinom = function (spec) {
  var polinom1 = [];
  //var that = {};
  var that = Object.create(jsar.utils.polinom.prototype);
  //that.prototype = jsar.utils.polinom;
  //
  var init = function () {
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
        Object.prototype.hasOwnProperty.call(spec, 'polinom') /*spec.hasOwnProperty('polinom')*/ &&
        jsar.toolset.isArray(spec.polinom)
      ) {
        polinom1 = spec.polinom.slice(0);
      } else if (
        Object.prototype.hasOwnProperty.call(spec, 'degree') /*spec.hasOwnProperty('degree')*/ &&
        jsar.toolset.isIntNumber(spec.degree) &&
        spec.degree > 0
      ) {
        polinom1 = jsar.toolset.vector(spec.degree + 1, 0);
      } else {
        throw jsar.exception.argumentException({
          name: 'ArgumentException',
          message:
            "incorrect initialization value: {'polinom': [array of coefficients]} or {'degree': [integer number] > 0}",
        });
        //throw {
        //	name: 'ValueError',
        //	message: 'incorrect initialization value: {\'polinom\': [array of coefficients]} or {\'degree\': [integer number] > 0}'
        //};
      }
    }
  };
  var isPolinom = function (x) {
    return x instanceof jsar.utils.polinom;
  };
  that.polinomMult = function (polinom2) {
    if (!isPolinom(polinom2)) {
      throw {
        name: 'ValueError',
        message: 'not polinom instance: < ' + y + ' >',
      };
    }
    var tempPolinom2 = polinom2.clone();
    var n = polinom1.length > tempPolinom2.length ? polinom1.length : tempPolinom2.length,
      tmp = jsar.toolset.vector(2 * n, 0);
    for (var i = 0; i < n - tempPolinom2.length; i++) {
      tempPolinom2.addCoeff(0);
    }
    for (var i = 0; i < n - polinom1.length; i++) {
      polinom1.unshift(0);
    }
    for (var i = 0; i <= n; i++) {
      for (var j = 0; j <= i; j++) {
        tmp[i] = tmp[i] + polinom1[j] * tempPolinom2.getCoeffAt(i - j);
      }
    }
    for (var i = n + 1; i <= 2 * n; i++) {
      for (var j = i - n; j <= n; j++) {
        tmp[i] = tmp[i] + polinom1[j] * tempPolinom2.getCoeffAt(i - j);
      }
    }
    return jsar.utils.polinom(('polinom': tmp));
  };
  that.getValue = function (x) {
    if (!Math.toolset.isNumber(x)) {
      throw {
        name: 'ValueError',
        message: 'incorrect input value: < ' + x + ' >',
      };
    }
    var s = 0;
    for (var i = 0; i < polinom1.length; i++) {
      s += polinom1[i] * Math.pow(x, polinom1.length - 1 - i);
    }
    return s;
    //var s = polinom1[0];
    //for(var i=1; i<polinom1.length; i++) {
    //	s = x * s + polinom1[i];
    //}
  };
  that.getDeriv = function () {
    var coeff = jsar.toolset.vector(polinom1.length, 0);
    for (var i = 0; i < polinom1.length; i++) {
      coeff.push(polinom1[i] * (polinom1.length - 1 - i));
    }
    return coeff;
  };
  that.getValues = function (low, high, step) {
    if (
      !jsar.toolset.isNumber(low) ||
      !jsar.toolset.isNumber(high) ||
      !jsar.toolset.isIntNumber(step) ||
      low >= high ||
      step <= 0
    ) {
      throw {
        name: 'ValueError',
        message:
          'incorrect input value: lower point < ' +
          low +
          '>, upper point < ' +
          high +
          '>, step < ' +
          step +
          ' >',
      };
    }
    var h = (high - low) / (step - 1);
    var arrayX = jsar.toolset.vector(step, 0),
      arrayY = jsar.toolset.vector(step, 0);
    for (var i = 0; i < step; i++) {
      arrayX.push(low + i * h);
      arrayY.push(this.getValue(low + i * h));
    }
    return { x: arrayX, y: arrayY };
  };
  that.sum = function (polinom2) {
    if (!isPolinom(polinom2)) {
      throw {
        name: 'ValueError',
        message: 'not polinom instance: < ' + y + ' >',
      };
    }
    var tempPolinom2 = polinom2.clone();
    var n = polinom1.length > tempPolinom2.length ? polinom1.length : tempPolinom2.length;
    for (var i = 0; i < n - tempPolinom2.length; i++) {
      tempPolinom2.addCoeff(0);
    }
    for (var i = 0; i < n - polinom1.length; i++) {
      polinom1.unshift(0);
    }
    for (var i = 0; i < n; i++) {
      polinom1[i] += tempPolinom2.getCoeffAt(i);
    }
    return this;
  };
  that.diff = function (polinom2) {
    if (!isPolinom(polinom2)) {
      throw {
        name: 'ValueError',
        message: 'not polinom instance: < ' + y + ' >',
      };
    }
    var tempPolinom2 = polinom2.clone();
    var n = polinom1.length > tempPolinom2.length ? polinom1.length : tempPolinom2.length;
    for (var i = 0; i < n - tempPolinom2.length; i++) {
      tempPolinom2.addCoeff(0);
    }
    for (var i = 0; i < n - polinom1.length; i++) {
      polinom1.unshift(0);
    }
    for (var i = 0; i < n; i++) {
      polinom1[i] -= tempPolinom2.getCoeffAt(i);
    }
    return this;
  };
  that.mult = function (value) {
    if (!jsar.toolset.isNumber(value)) {
      throw {
        name: 'ValueError',
        message: 'incorrect input value: multiplicator < ' + value + ' >',
      };
    }
    for (var i = 0; i < polinom1.length; i++) {
      polinom1[i] *= value;
    }
    return this;
  };
  that.div = function (value) {
    if (!jsar.toolset.isNumber(value) || value === 0) {
      throw {
        name: 'ValueError',
        message: 'incorrect input value: divider < ' + value + ' >',
      };
    }
    for (var i = 0; i < polinom1.length; i++) {
      polinom1[i] /= value;
    }
    return this;
  };
  that.getLength = function () {
    return polinom1.length;
  };
  that.addCoeff = function (value) {
    if (!jsar.toolset.isNumber(value)) {
      throw {
        name: 'ValueError',
        message: 'incorrect input value: coeff < ' + value + ' >',
      };
    }
    polinom1.unshift(value);
    return this;
  };
  that.clone = function () {
    return jsar.utils.polinom({ polinom: polinom1 });
  };
  that.nativeCopy = function () {
    var res = []; //polinom1.slice(0);
    polinom1.forEach(function (item, i) {
      res.push(item);
    });
    return res;
  };
  that.getCoeffAt = function (i) {
    if (!jsar.toolset.isIntNumber(i) || i < 0 || i > polinom1.length - 1) {
      throw {
        name: 'ValueError',
        message: 'incorrect index value: < ' + i + ' >',
      };
    }
    return polinom1[i];
  };
  that.equals = function (polinom2) {
    if (!isPolinom(polinom2)) {
      throw {
        name: 'ValueError',
        message: 'not polinom instance: < ' + y + ' >',
      };
    }
    var tempPolinom1 = this.clone(),
      tempPolinom2 = polinom2.clone();
    var n = tempPolinom1.length > tempPolinom2.getLength() ? polinom1.length : tempPolinom2.getLength();
    for (var i = 0; i < n - tempPolinom2.getLength(); i++) {
      tempPolinom2.addCoeff(0);
    }
    for (var i = 0; i < n - tempPolinom1.length; i++) {
      tempPolinom1.addCoeff(0);
    }
    for (var i = 0; i < n; i++) {
      if (tempPolinom1.getCoeffAt(i) !== tempPolinom2.getCoeffAt(i)) return false;
    }
    return true;
  };
  that.toString = function () {
    return polinom1.join(' ');
  };
  init();
  return that;
};
