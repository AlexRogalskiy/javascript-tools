const singleton = (function () {
  let privateVariable = 10;

  function privateFunction() {
    return false;
  }

  const obj = new Object();

  obj.publicProperty = true;
  obj.pulblicMethod = function () {
    privateVariable++;
    return privateFunction();
  };

  return obj;
})();
