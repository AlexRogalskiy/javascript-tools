;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	var compare = function(a, b) {
		var hasProperty = function(obj, prop) {
			var proto = obj.__proto__ || obj.constructor.prototype;
			return (prop in obj) || ((prop in proto) || proto[prop] === obj[prop]);
		}
		
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			if(hasProperty(a, 'compareTo')) {
				return a.compareTo(b);
			} else {
				return a < b ? -1 : 1;//a.localCompare(b)
			}
		}
		return typeof a < typeof b ? -1 : 1;
	};
//----------------------------------------------------------------------------------------------
	const isPriqueue = (value) => (value instanceof globals.collections.queue.Priqueue);
//----------------------------------------------------------------------------------------------
	(function() {
		globals.collections.queue = globals.collections.queue || {};
//----------------------------------------------------------------------------------------------
		/* @public
		* @module collections
		* @param {Array} spec Input array of items.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Object} Priority queue.
		*
		* @example
		* var res = globals.collections.queue.Priqueue([3, 4, 5, 2, 1, 4]);
		*/
		var Priqueue = (function() {
//----------------------------------------------------------------------------------------------
			const swapArray_ = (arr, index1, index2) => swap_(arr[index1], arr[index2]);
			const swap_ = (a, b) => [a, b] = [b, a];
//----------------------------------------------------------------------------------------------
			return function(spec, cmp) {
				var count = 0;
				var data = globals.toolset.vector();
				//var that = {};
				var that = Object.create(globals.collections.queue.Priqueue);
				that.prototype = globals.collections.queue.Priqueue;

				var init = function() {
					if(!globals.toolset.isNull(spec)) {
						if(!globals.toolset.isArray(spec)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elemens [any type]'
														};
						}
						for(var i=0; i<spec.length; i++) {
							that.insert(spec[i]);
						}
					}
					cmp = globals.toolset.isFunction(cmp) ? cmp : compare;
				};
				
				that.insert = function(value) {
					data[++count] = value;
					//siftup
					for(var p, i=count; i>1 && data[p=Math.floor(i/2)] > data[i]; i=p) {
						swapArray_(data, p, i);
					}
				};
				that.extractmin = function() {
					var temp = data[1];
					data[1] = data[count--];
					//siftdown
					for(var c, i=1; (c = 2 * i) <= count; i=c) {
						if((c + 1) <= count && cmp(data[c+1], data[c]) < 0) {
							c++;
						}
						if(cmp(data[i], data[c]) <= 0) return;
						swapArray_(data, c, i);
					}
					return temp;
				};
				that.serialize = function() {
					return JSON.stringify({'data': data, 'count': count}, null, 2);
				};
				that.deserialize = function(str) {
					if(!globals.toolset.isString(str)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: string < ' + str + ' >'
													};
					}
					var jsonObject = null;
					try {
						jsonObject = JSON.parse(str);
					} catch(e) {
						console.error("Parsing error:", e);
					}
					if(jsonObject == null) return false;
					data = jsonObject.data;
					count = jsonObject.count;
					return true;
				}:
				that.size = function() {
					return data.length;
				};
				that.isEmpty = function() {
					return (this.getCount() === 0);
				};
				that.getCount = function() {
					return count;
				};
				that.clone = function() {
					return globals.collections.queue.Priqueue(data, cmp);
				};
				init();
				return that;		
		}());
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.collections.queue.Priqueue = Priqueue;
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));