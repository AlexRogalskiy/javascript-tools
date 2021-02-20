'use strict';

(function (global) {
  if (!global.console) {
    global.console = {};
  }
  const con = global.console;
  let prop, method;
  const dummy = function () {};
  const properties = ['memory'];
  const methods = (
    'assert,clear,count,debug,dir,dirxml,error,exception,group,' +
    'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
    'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn'
  ).split(',');
  while ((prop = properties.pop())) if (!con[prop]) con[prop] = {};
  while ((method = methods.pop())) if (!con[method]) con[method] = dummy;
  // Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);
