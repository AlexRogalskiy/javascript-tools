// UK Postcode validation - John Gardner - http://www.braemoor.co.uk/software/postcodes.shtml
function checkPostCode(toCheck) {
  var alpha1 = "[abcdefghijklmnoprstuwyz]",
    alpha2 = "[abcdefghklmnopqrstuvwxy]",
    alpha3 = "[abcdefghjkpmnrstuvwxy]",
    alpha4 = "[abehmnprvwxy]",
    alpha5 = "[abdefghjlnpqrstuwxyz]",
    pcexp = [],
    postCode = toCheck,
    valid = false,
    i;
  pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(/^(GIR)(\s*)(0AA)$/i);
  pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);
  pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
  pcexp.push(/^([A-Z]{4})(\s*)(1ZZ)$/i);
  pcexp.push(/^(ai-2640)$/i);
  for (i = 0; i < pcexp.length; i++) {
    if (pcexp[i].test(postCode)) {
      pcexp[i].exec(postCode);
      postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
      postCode = postCode.replace(/C\/O\s*/, "c/o ");
      if (toCheck.toUpperCase() === 'AI-2640') {
        postCode = 'AI-2640';
      }
      valid = true;
      break;
    }
  }
  return valid ? postCode : null;
};
/---------------------------------------------------------------------------------------------------------------------
function hasClass(obj, c) {
  return new RegExp('(\\s|^)' + class + '(\\s|$)').test(obj.className);
}

function addClass(obj, class) {
  if (!hasClass(obj, class)) {
    obj.className += ' ' + class;
  }
}

function removeClass(obj, class) {
  if (hasClass(obj, class)) {
    obj.className = obj.className.replace(new RegExp('(\\s|^)' + class + '(\\s|$)'), ' ').replace(/\s+/g, ' ').replace(/^\s|\s$/, '');
  }
}//---------------------------------------------------------------------------------------------------------------------
function $id(id) {
  if ($id.cache[id] === undefined) {
    $id.cache[id] = document.getElementById(id) || false;
  }
  return $id.cache[id];
}
$id.cache = {};
//---------------------------------------------------------------------------------------------------------------------
function $els(id, el) {
  var a = id + el, obj;
  if ($els.cache[a] === undefined) {
    obj = document.getElementById(id);
    if (obj) {
      $els.cache[a] = obj.getElementsByTagName(el || "*") || false;
    } else {
      $els.cache[a] = false;
    }
  }
  return $els.cache[a];
}
$els.cache = {};
//---------------------------------------------------------------------------------------------------------------------
var isIE = /*@cc_on!@*/false;
//---------------------------------------------------------------------------------------------------------------------
function getAnchorFromURI(uri) {
  return uri.slice(uri.lastIndexOf('#') + 1);
}
//---------------------------------------------------------------------------------------------------------------------
function isLessThanIE(version) {
  if (navigator.appName === 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent,
      re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) !== null) {
      if (parseFloat(RegExp.$1) < version) {
        return true;
      }
    }
  }
  return false;
};
//---------------------------------------------------------------------------------------------------------------------
var closureSpace=function(){

  function init() {
    ...
  }

  return{ // list externally available functions here
    init:init
  };

}();
closureSpace.init(); // call externally available function like this
//---------------------------------------------------------------------------------------------------------------------
function $idExists(id) {
  return (document.getElementById(id) !== null);
};
function replaceContent(id, content) {
  if (idExists(id)) {
    document.getElementById(id).innerHTML = content;
  }
};
//---------------------------------------------------------------------------------------------------------------------
function range(start, end, step) {
  if (step == null) step = 1;
  var array = [];

  if (step > 0) {
    for (var i = start; i <= end; i += step)
      array.push(i);
  } else {
    for (var i = start; i >= end; i += step)
      array.push(i);
  }
  return array;
};

function sum(array) {
  var total = 0;
  for (var i = 0; i < array.length; i++)
    total += array[i];
  return total;
};
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------