;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	const toArray = (() =>
		Array.from ? Array.from : obj => [].slice.call(obj)
	)();
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		Object.method('superior', function(name) {
			var that = this, method = that[name];
			return function() {
				return method.apply(that, arguments);
			};
		});
//----------------------------------------------------------------------------------------------
		Object.method('hashCode', function() {
			var serialize = function(object) {
				var serializedCode = '';
				var type = typeof object;
				if(type === 'object') {
					for (var elem in object) {
						serializedCode += '[' + type + ':' + elem + serialize(object[elem]) + ']';
					}
				} else if(type === 'function') {
					serializedCode += '[' + type + ':' + object.toString() + ']';
				} else {
					serializedCode += '[' + type + ':' + object+ ']';
				}
				return serializedCode.replace(/\s/g, '');
			};
			return globals.toolset.md5(serialize(this));
		});
//----------------------------------------------------------------------------------------------
		Object.method('equals', function(object2) {
			if(this == object2) return true;
			
			for (propName in this) {
				if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
					return false;
				} else if(typeof this[propName] != typeof object2[propName]) {
					return false;
				}
			}
			for(propName in object2) {
				if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
					return false;
				} else if(typeof this[propName] != typeof object2[propName]) {
					return false;
				}
				if(!this.hasOwnProperty(propName)) {
					continue;
				}
				if (this[propName] instanceof Array && object2[propName] instanceof Array) {
				   if (!this[propName].equals(object2[propName]))
								return false;
				} else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
				   if (!this[propName].equals(object2[propName]))
								return false;
				} else if(this[propName] != object2[propName]) {
				   return false;
				}
			}
			return true;
		});
//----------------------------------------------------------------------------------------------
		Object.method('define', function(key, descriptor) {
				if(globals.toolset.isObject(descriptor)) {
					Object.defineProperty(this, key, descriptor);
				} else {
					Object.defineProperties(this, key);
				}
				return this;
			},
			enumerable: false
		);
//----------------------------------------------------------------------------------------------
		Object.method('extendNotEnum', function(key, descriptor) {
			if( property ) {
					this.define( key, {
						value: property,
						enumerable: false,
						configurable: true
					});
				} else {
					Object.keys(key).forEach(prop => this.extendNotEnum( prop, key[ prop ] ));
					/*for( var prop in key ) if( key.hasOwnProperty( prop ) ){
						this.extendNotEnum( prop, key[ prop ] );
					}*/
				}
			},
			enumerable: false
		);
//----------------------------------------------------------------------------------------------
		Object.staticMethod('create', function(obj) {
			if (arguments.length > 1) {
				throw globals.exception.argumentException('ArgumentError', 'Second argument not supported');//new TypeError('');
			}
			if (globals.toolset.isNull(obj)) {
				throw globals.exception.argumentException('ArgumentError', 'Cannot set a null [[Prototype]]');//new TypeError('');
			}
			if (!globals.toolset.isObject(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}
			function F() {};
			F.prototype = obj;
			return new F();
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('copy', function(obj) {
			var copy = Object.create(Object.getPrototypeOf(obj));
			var propNames = Object.getOwnPropertyNames(obj);
			propNames.forEach(function(name){
				var desc = Object.getOwnPropertyDescriptor(obj, name);
				Object.defineProperty(copy, name, desc);
			});
			return copy;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('clone', function(obj) {
			if (!globals.toolset.isObject(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}

			if (obj instanceof Date) {
				var copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}

			if (obj instanceof Array) {
				var copy = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					copy[i] =  arguments.callee.clone(obj[i]);
				}
				return copy;
			}
			
			if (obj instanceof Object) {
				var copy = {};
				Object.keys(obj).forEach(prop => copy[prop] = arguments.callee.clone(obj[prop]));
				/*for (var attr in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = arguments.callee.clone(obj[attr]);
				}*/
				return copy;
			}
			return null;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('toType', function(obj) {
			return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('keys', function(obj) {
			if (!globals.toolset.isObject(obj) || !globals.toolset.isFunction(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}
			//return Object.keys(obj);
			var keys = [];
			Object.keys(obj).forEach(prop => keys.push(prop));
			//for (var p in obj) Object.prototype.hasOwnProperty.call(obj, p) && keys.push(p);
			return keys;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('values', function(obj) {
			return Object.keys(obj).map(function(e) {
				return obj[e];
			});
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('sortByKeys', function(obj) {
			if (!globals.toolset.isObject(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}
			var ordered = {};
			Object.keys(obj).sort().forEach(function(key) {
				ordered[key] = obj[key];
			});
			return ordered;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('sortByValues', function(obj) {
			if (!globals.toolset.isObject(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}
			var ordered = {};
			var keysSorted = Object.keys(obj).sort(function(a, b) {
				return (obj[a] - obj[b]);
			}).forEach(function(key) {
				ordered[key] = obj[key];
			});
			return ordered;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('extendAsArray', function(obj) {
			if (obj.length === undefined || obj.__lookupGetter__('length')) {
				var index = 0;
				Object.keys(obj).forEach(prop => {
					if(!obj.__lookupGetter__(prop)) {
						(function(thisIndex, thisProp) {
							obj.__defineGetter__(thisIndex, function() {return obj[thisProp]});
						})(index, prop);
						index++;
					}
				});
				/*for (var prop in obj) {
					if(Object.prototype.hasOwnProperty.call(obj, prop) && !obj.__lookupGetter__(prop)) {
						(function(thisIndex, thisProp) {
							obj.__defineGetter__(thisIndex, function() {return obj[thisProp]});
						})(index, prop);
						index++;
					}
				}*/
				obj.__defineGetter__("length", function() {return index});
			}
			return obj;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('listAllProperties', function(obj) {
			var result = [];
			for(var objectToInspect = obj; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
				result.push(Object.getOwnPropertyNames(objectToInspect));
			}
			return result;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('hasNumbers', function(obj) {
			if (globals.toolset.isObject(obj) || globals.toolset.isFunction(obj)) {
				throw globals.exception.typeException('TypeError', 'incorrect type of argument: obj < ' + obj + ' >');//new TypeError('');
			}
			return "".search.call(obj, /[0-9]/) > -1;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('deepCopy', function(obj) {
			const gdcc = "__getDeepCircularCopy__";
			if (obj !== Object(obj)) {
				return obj;
			}
			var set = gdcc in obj, cache = obj[gdcc], result;
			if (set && typeof cache === "function") {
				return cache();
			}
			obj[gdcc] = function() { return result; };
			if (obj instanceof Array) {
				result = [];
				for (var i=0; i<obj.length; i++) {
					result[i] = arguments.callee(obj[i]);
				}
			} else {
				result = {};
				for (var prop in obj)
					if (prop != gdcc)
						result[prop] = arguments.callee(obj[prop]);
					else if (set)
						result[prop] = arguments.callee(cache);
			}
			if (set) {
				obj[gdcc] = cache;
			} else {
				delete obj[gdcc];
			}
			return result;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('deepExtend', function(destination, source) {
			if(!globals.toolset.isObject(source)) { throw {
														name: 'ValueError',
														message: 'incorrect source object: < ' + source + ' >'
													};
			}
			destination = globals.toolset.isObject(destination) ? destination : Object.create(source);
			for (var property in source) {
				/*if (source[property] && source[property].constructor && globals.toolset.isObject(source[property].constructor)) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}*/
				if (!destination[property]) {
					destination[property] = Object.clone(source[property]);
				}
			}
			return destination;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('hashCode', function(value) {
			if(globals.toolset.isNull(value)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: < ' + value + ' >'
											};
			}
			var hash = 5381;
			value = value.toString();
			for (var i = 0; i < value.length; i++) {
				//var hash = 65599;
				//hash = (hash << 6) + (hash << 16) - hash + value.charCodeAt(i);
				hash = ((hash << 5) + hash) + value.charCodeAt(i); /* hash * 33 + c */
				hash = hash & 0xFFFFFFFF;
			}
			return hash;
		});
		Object.staticMethod('hashCode2', function(value) {
			if(globals.toolset.isNull(value)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: < ' + value + ' >'
											};
			}
			var hash = 0;
			value = value.toString();
			if (value.length === 0) return hash;
			for (var i = 0; i < value.length; i++) {
				hash = ((hash << 5) - hash) + value.charCodeAt(i);
				hash &= hash; // Convert to 32bit integer
			}
			return hash;
		});
//----------------------------------------------------------------------------------------------
		Object.staticMethod('strictCompare', function(v1, v2) {
			if(v1 === 0 && v2 === 0) {
				return 1 / v1 === 1 / v2;
			}
			if(v1 !== v1) {
				return v2 !== v2;
			}
			return v1 === v2;
		});
//----------------------------------------------------------------------------------------------
	}());
}(typeof globals !== 'undefined' ? globals : this));

//document.writeln(Object.toType({a: 4})); //"object"
//document.writeln(Object.toType([1, 2, 3])); //"array"
//(function() {console.log(toType(arguments))})(); //arguments
//document.writeln(Object.toType(new ReferenceError)); //"error"
//document.writeln(Object.toType(new Date)); //"date"
//document.writeln(Object.toType(/a-z/)); //"regexp"
//document.writeln(Object.toType(Math)); //"math"
//document.writeln(Object.toType(JSON)); //"json"
//document.writeln(Object.toType(new Number(4))); //"number"
//document.writeln(Object.toType(new String("abc"))); //"string"
//document.writeln(Object.toType(new Boolean(true))); //"boolean"
//document.writeln(Object.toType('Number')); //"string"
//document.writeln(Object.keys({a:1, b:2, c:3})); //['a', 'b', 'c'])
//document.writeln(Object.values({a:1, b:2, c:3})); //[1, 2, 3])
/*var thing = {
    size: 14, 
    color: 'kind of off-white', 
    greet: function() {return "thronk"}
};
var thingFunctions = Object.keys(thing).filter(function(e) {
    return (typeof thing[e] == 'function');
});
document.writeln(thingFunctions); //["greet"]
*/
/*Object.getOwnPropertyNames(Math).forEach(function(e) {
    if((typeof Math[e] == 'function') && (Math[e].length == 1)) {
        console.log("Math." + e + "(10) -> " + Math[e](10));
	}
});*/
//document.writeln(Object.getOwnPropertyNames(String.prototype));
//Object.keys(new String("potato"))
//Object.getOwnPropertyNames(new String("potato"))

//var myObj = {
//    left:50,
//    top:20,
//    width:10,
//    height:10
//};
//Object.extendAsArray(myObj);
//var arr = [];
//document.writeln(arr.join.call(myObj, ', ')); //"50 ,20 ,10, 10" 
//document.writeln(arr.slice.call(myObj, 2)); //[10,10] arr.map.call(myObj,function(s){return s+' px'}).join(', '); 
//document.writeln(arr.map.call(myObj, function(s) {return s + ' px'}).join(', ')); //"50px ,20px ,10px, 10px"
//document.writeln(arr.every.call(myObj, function(s) {return !(s % 10)})); //true (all values divisible by 10)
//document.writeln(arr.forEach.call(myObj, function(s) { window.console && console.log(s)})); //(logs all values)
//var expenses = {
//    hotel: 147.16,
//    dinner: 43.00,
//    drinks: 15.20,
//    taxi: 13.00,
//    others: 12.15
//};
//Object.extendAsArray(expenses);
//var biggestExpense = Math.max.apply(null, [].slice.call(expenses)); //147.16
//var totalExpenses = [].reduce.call(expenses, function(t,s){return t+s}); //230.51

//document.writeln(Object.listAllProperties(Math));
//document.writeln(Object.hasNumbers({}));
//--------------------------------------------------------------
//var o1 = {a:1, b:2};
//var o2 = Object.copy(o1); // o2 looks like o1 now
//document.writeln('a: ' + o2.a + 'b: ' + o2.b);
/*function clone(obj) {
    if (!jsar.toolset.isObject(obj)) return obj;
    var copy = obj.constructor();
	Object.keys(obj).forEach(prop => copy[prop] = obj[prop]);
    return copy;
}*/