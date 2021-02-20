;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	/**
	* @private
	*/
	var defaultSortComparer = function(a, b) {
		
		var hasProperty = function(obj, prop) {
			var proto = obj.__proto__ || obj.constructor.prototype;
			return (prop in obj) || ((prop in proto) || proto[prop] === obj[prop]);
			//return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
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
	/*var defaultSortComparer = function(a, b) {
		if (a === b) return 0;
		if (a == null) return -1;
		if (b == null) return 1;
		if (typeof a == "string") return a.toString().localeCompare(b.toString());
		return a.valueOf() - b.valueOf();
	};*/
//----------------------------------------------------------------------------------------------
	const defaultEqualityComparer = (a, b) => a === b || a.valueOf() === b.valueOf();
//----------------------------------------------------------------------------------------------
	const defaultPredicate = () => true;
//----------------------------------------------------------------------------------------------
	const defaultSelector = (selector) => selector;
//----------------------------------------------------------------------------------------------
	const compact_ = arr => arr.filter(el => el);
//----------------------------------------------------------------------------------------------
	const unique_ = arr => [...new Set(arr)];
//----------------------------------------------------------------------------------------------
	const union_ = (...arr) => unique([].concat(...arr));
//----------------------------------------------------------------------------------------------
	const first_ = arr => arr[0];
//----------------------------------------------------------------------------------------------
	const last_ = arr => first(arr.slice(-1));
//----------------------------------------------------------------------------------------------
	/**
	* @private
	* @module sorting
	* @param {Array} data Input array.
	* @param {Integer} index1 index.
	* @param {Integer} index2 index to swap_ with.
	*/
	const swapArray_ = (arr, index1, index2) => swap_(arr[index1], arr[index2]);
	const swap_ = (a, b) => [a, b] = [b, a];
	/*var swap_ = function(data, index1, index2) {
		if(index1 != index2) {
			var temp = data[index2];
			data[index2] = data[index2];
			data[index2] = temp;
		}
	};*/
//----------------------------------------------------------------------------------------------
	const slice_ = (...values) => values;
	/*var slice_ = function() {
		var len = arguments.length, arr = globals.toolset.vector(len);
		for(var i=0; i<len; i++) {
			arr[i] = arguments[i];
		}
		return arr;
	};*/
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		Array.staticMethod('zip', function(left, right, predicate) {
			if(!globals.toolset.isArray(left)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {left} not array < ' + left + ' >');
			}
			
			if(!globals.toolset.isArray(right)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {right} not array < ' + right + ' >');
			}
			
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} not a function < ' + predicate + ' >');
			}
			
			var results = [], min = Math.min(left.length, right.length);
			for(var counter = 0; counter < min; counter++) {
				results.push(combinerFunction(left[counter], right[counter]));
			}
			return results;
		});
//----------------------------------------------------------------------------------------------
		Array.method('reverse', function() {
			var len = this.length, mid = Math.floor(len / 2);
			for(var i=0; i<mid; i++) {
				var temp = this[i];
				var y = len - i - 1;
				swapArray_(this, i, len - i - 1);
			}
			return this;
		};
//----------------------------------------------------------------------------------------------
	  	Array.method('wrapIndex', function(index) {
			if(!isIntNumber(index) || index < 0) return;
			return array[(this.length + Math.round(index)) % this.length];
		};
//----------------------------------------------------------------------------------------------
	  	Array.method('invoke', function(method) {
			var args = slice.call(arguments, 1), result = [];
			for (var i = 0, len = this.length; i < len; i++) {
				result[i] = args.length ? this[i][method].apply(this[i], args) : this[i][method].call(this[i]);
			}
			return result;
		};
//----------------------------------------------------------------------------------------------
		Array.method('max', function(byProperty) {
			return find(this, byProperty, function(value1, value2) {
				return (value1 >= value2);
			});
		};
//----------------------------------------------------------------------------------------------
		Array.method('min', function(byProperty) {
			return find(this, byProperty, function(value1, value2) {
				return (value1 < value2);
			});
		};
//----------------------------------------------------------------------------------------------
		Array.method('pushAll', function(items) {
			if(!Array.isArray(items)) {
				throw new TypeError(`ERROR: argument ${items} must be an array`);
			}
			return this.push(...items);
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns next element from array
		 */
		Array.method('step', function() {
			const next = Array.prototype.pop.call(array);
			Array.prototype.unshift.call(array, next);
			return next;
		};
//----------------------------------------------------------------------------------------------
		Array.method('fill', function(value) {
			 var k = this.length;
			 while (k--) {
				this[k] = value;
			 }
			 return this;
		};
//----------------------------------------------------------------------------------------------
		Array.method('find', function(byProperty, condition) {
			if (!this || this.length === 0) {
				return;
			}
			var i = this.length - 1, result = byProperty ? this[i][byProperty] : this[i];
			if (byProperty) {
				while (i--) {
					if (condition(this[i][byProperty], result)) {
						result = this[i][byProperty];
					}
				}
			} else {
				while (i--) {
					if (condition(this[i], result)) {
						result = this[i];
					}
				}
			}
			return result;
		};
//----------------------------------------------------------------------------------------------
		Array.method('clone', function() {
			return this.slice(0);
		};
//----------------------------------------------------------------------------------------------
		Array.method('max', function() {
			//return Math.max.apply(Math, this);
			return Math.max.apply(Math, this.filter(function(elem) {
				return (elem !== null);
			}));
		});
//----------------------------------------------------------------------------------------------
		Array.method('min', function() {
			//return Math.min.apply(Math, this);
			return Math.min.apply(Math, this.filter(function(elem) {
				return (elem !== null);
			}));
		});
//----------------------------------------------------------------------------------------------
		//var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
		//var min2 = arr2.min(function(t){ return t.Val });   // 1
		Array.method('min', function(selector) {
			selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
			if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');

			var len = this.length;
			var min = selector(this[0]);
			while (len-- > 0)
				if (selector(this[len]) < min) min = selector(this[len]);
			return min;
		});
//----------------------------------------------------------------------------------------------
		//var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
		//var max2 = arr2.max(function(t){ return t.Val });   // 2
		Array.method('max', function(selector) {
			
			selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
			if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');

			var len = this.length;
			var max = selector(this[0]);
			while (len-- > 0)
				if (selector(this[len]) > max) max = selector(this[len]);
			return max;
		});
//----------------------------------------------------------------------------------------------
		Array.method('where', function(predicate, context) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not a function < ' + predicate + ' >');
			}
			
			context = context || window;
			
			var arr = globals.toolset.vector();
			for (var i=0; i<this.length; i++) {
				if (predicate.call(context, this[i], i, this) === true) {
					arr.push(this[i]);
				}
			}
			return arr;
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var res1 = arr.any();  // true
		//var res2 = arr.any(function(t){ return t > 5 });  // false
		Array.method('any', function(predicate, context) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not a function < ' + predicate + ' >');
			}
			
			context = context || window;
			
			var f = this.some || function (p, c) {
				var len = this.length;
				if (!p) return len > 0;
				while (len-- > 0) {
					if (p.call(c, this[len], len, this) === true) {
						return true;
					}
				}
				return false;
			};
			return f.apply(this, [predicate, context]);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var res = arr.all(function(t){ return t < 6 });  // true
		Array.method('all', function(predicate, context) {
			predicate = (predicate == null) ? defaultPredicate : ((globals.toolset.isFunction(predicate)) ? predicate : null);
			if(predicate == null) throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not a function < ' + predicate + ' >');
			
			context = context || window;
			
			var f = this.every || function (p, c) {
				return (this.length == this.where(p, c).length);
			};
			return f.apply(this, [predicate, context]);
		});
//----------------------------------------------------------------------------------------------
		Array.method('hashCode', function() {
			var hash = 0;
			if (this.length === 0) return hash;
			for (var i = 0; i < this.length; i++) {
				hash = ((hash << 5) - hash) + (this[i] == null ? 0 : this[i].hashCode());
				hash &= hash; // Convert to 32bit integer
			}
			return hash;
		});
//----------------------------------------------------------------------------------------------
		Array.method('cycle', function(rotdist) {
			if(this.length === 0) return;
			
			rotdist = (rotdist == null) ? 1 : ((globals.toolset.isIntNumber(rotdist) && rotdist > 0) ? (rotdist % this.length) : null);
			if(rotdist == null) throw globals.exception.typeException('TypeError', 'incorrect input argument: {rotdist} is not a positive integer number < ' + rotdist + ' >');
			
			for(var i=0; i<rotdist; i++) {
				var temp = this[0];
				for(var j=1; j<this.length; j++) {
					this[j-1] = this[j];
				}
				this[this.length-1] = temp;
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
		Array.method('first', function() {
			return this[0];
		});
//----------------------------------------------------------------------------------------------
		Array.method('last', function() {
			return this[this.length-1];
		});
//----------------------------------------------------------------------------------------------
		Array.method('sum', function() {
			var total = 0;
			for (var i=0; i<this.length; i++) {
				//var value = parseInt(this[i]);
				if(!isNaN(value)) {
					total += value;
				}
			}
			return total;
		});
//----------------------------------------------------------------------------------------------
		//var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
		//var sum2 = arr2.sum(function(t){ return t.Val });   // 3
		Array.method('sum', function(selector) {
			
			selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
			if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');
			
			var len = this.length;
			var sum = 0;
			while (len-- > 0) sum += selector(this[len]);
			return sum;
		});
//----------------------------------------------------------------------------------------------
		//document.writeln("sumCycle: " + [1, 2, 3, 4, 5].sumCycle());
		Array.method('sumCycle', function() {
			var sum = 0;
			for(var i=0; i<=this.length; i+=2) {
				sum += this[i] - ((this[i+1] == null) ? 0 : this[i+1]);
			}
			return sum;
		});
//----------------------------------------------------------------------------------------------
		Array.method('compute', function(func, value) {
			if(!globals.toolset.isFunction(func)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {func} is not a function < ' + func + ' >');
			}
			var res = 0;
			for(var i=0; i<this.length; i++) {
				res += func(this[i], value);
				//value = func(this[i], value);
				//this[i] = func(this[i], value);
			}
			return res;
			//return this;
		});
//----------------------------------------------------------------------------------------------
		Array.method('process', function(func, value) {
			if(!globals.toolset.isFunction(func)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {func} is not a function < ' + func + ' >');
			}
			var res = [];
			for(var i=0; i<this.length; i++) {
				res[i] = func(this[i], value);
			}
			return res;
		});
//----------------------------------------------------------------------------------------------
		Array.method('removeFirst', function(item) {
			var index = this.indexOf(item);
			if(index > -1) {
				this.splice(index, 1);
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
		Array.method('removeAll', function(item) {
			for(var i=0; i<this.length; i++) {
				if(this[i] === item) {
					this.splice(i, 1);
				}
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
		Array.method('removeAll', function(predicate) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not a function < ' + predicate + ' >');
			}
			var item, i = 0;
			while(item = this.first(predicate)) {
				i++;
				this.remove(item);
			}
			return i;
		});
//----------------------------------------------------------------------------------------------
		Array.method('removeAt', function(index) {
			if(!globals.toolset.isIntNumber(index)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {index} is not integer number < ' + index + ' >');
			}
			if(index < 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: {index} < ' + index + ' > is lower {0}');
			}
			return this.slice(0, index).concat(this.slice(index+1));
		});
//----------------------------------------------------------------------------------------------
		Array.method('remove', function(startIndex, endIndex) {
			if(!globals.toolset.isIntNumber(startIndex)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {startIndex} is not integer number < ' + startIndex + ' >');
			}
			if(!globals.toolset.isIntNumber(endIndex)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {endIndex} is not integer number < ' + endIndex + ' >');
			}
			var rest = this.slice((endIndex || startIndex) + 1 || this.length);
			this.length = startIndex < 0 ? this.length + startIndex : startIndex;
			return this.push.apply(this, rest);
		});
//----------------------------------------------------------------------------------------------
		Array.method('concatAll', function() {
			var results = [];
			this.forEach(function(subArray) {
				subArray.forEach(function(item) {
					results.push.apply(results, item);
				});
			});
			return results;
		});
//----------------------------------------------------------------------------------------------
		Array.method('remove', function(start, end) {
			if(!globals.toolset.isIntNumber(start)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {start} is not integer number < ' + start + ' >');
			}
			if(!globals.toolset.isIntNumber(end)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {end} is not integer number < ' + end + ' >');
			}
			var rest = this.slice((end || start) + 1 || this.length);
			this.length = start < 0 ? this.length + start : start;
			return this.push.apply(this, rest);
		});
//----------------------------------------------------------------------------------------------
		Array.method('remove', function(value) {
			var idx = this.indexOf(value);
			if (idx !== -1) {
				array.splice(idx, 1);
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
		//var arr = [{Name:"A", Val:1}, {Name:"a", Val:2}, {Name:"B", Val:1}, {Name:"C", Val:2}];
		//var res1 = arr.orderBy(function(t){ return t.Name });
		//var res2 = arr.orderBy(function(t){ return t.Name }, function(a, b){
		//	if(a.toUpperCase() > b.toUpperCase()) return 1;
		//	if(a.toUpperCase() < b.toUpperCase()) return -1;
		//	return 0;
		//});
		
		//var arr = [{Name:"A", Val:1}, {Name:"a", Val:2}, {Name:"B", Val:1}, {Name:"C", Val:2}];
		//var res1 = arr.orderBy(function(t){ return t.Val })
		//		  .thenBy(function(t){ return t.Name });   
		//var res2 = arr.orderBy(function(t){ return t.Val })
		//		  .thenByDescending(function(t){ return t.Name });  
		//var res3 = arr.orderByDescending(function(t){ return t.Val })
		//		  .thenBy(function(t){ return t.Name }); 
		Array.method('orderBy', function(selector, comparer) {
			if(!globals.toolset.isFunction(selector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');
			}
			
			comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var arr = this.slice(0);
			var fn = function(a, b) {
				return comparer(selector(a), selector(b));
			};

			arr.thenBy = function(selector, comparer) {
				
				selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
				if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {selector} is not a function < ' + selector + ' >');
				
				comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
				if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
				return arr.orderBy(defaultSelector, function (a, b) {
					var res = fn(a, b);
					return (res === 0 ? comparer(selector(a), selector(b)) : res);
				});
			};

			arr.thenByDescending = function(selector, comparer) {
				
				selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
				if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {selector} is not a function < ' + selector + ' >');
				
				comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
				if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
				return arr.orderBy(defaultSelector, function (a, b) {
					var res = fn(a, b);
					return (res === 0 ? -comparer(selector(a), selector(b)) : res);
				});
			};
			return arr.sort(fn);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [{Name:"A", Val:1}, {Name:"a", Val:2}, {Name:"B", Val:1}, {Name:"C", Val:2}];
		//var res = arr.orderByDescending(function(t){ return t.Name });   
		Array.method('orderByDescending', function(selector, comparer) {
			if(!globals.toolset.isFunction(selector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');
			}
			
			comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			return this.orderBy(selector, function(a, b) { return -comparer(a, b) });
		});
//----------------------------------------------------------------------------------------------
		/*
		var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];

		var arr2 = [{Code:"A"}, {Code:"B"}, {Name:"C", Code:"C"}]; 

		var res1 = arr1.innerJoin(arr2,
			function (t) { return t.Name },                                      // arr1 selector
			function (u) { return u.Code },                                      // arr2 selector
			function (t, u) { return { Name: t.Name, Val: t.Val, Code: u.Code } });  // result selector

		// using custom comparer
		var res2 = arr1.innerJoin(arr2,
			function (t) { return t.Name },                                    // arr1 selector
			function (u) { return u.Code },                                    // arr2 selector
			function (t, u) { return { Name: t.Name, Val: t.Val, Code: u.Code } },  // result selector
			function (a, b) { return a.toUpperCase() == b.toUpperCase() });         // comparer     
		*/
		Array.method('innerJoin', function(arr, outer, inner, result, comparer) {
			if(!globals.toolset.isFunction(outer)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {outer} is not a function < ' + outer + ' >');
			}
			if(!globals.toolset.isFunction(inner)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {inner} is not a function < ' + inner + ' >');
			}
			if(!globals.toolset.isFunction(result)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {result} is not a function < ' + result + ' >');
			}
			
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var res = globals.toolset.vector();
			this.forEach(function(t) {
				arr.where(function(u) {
					return comparer(outer(t), inner(u));
				})
				.forEach(function(u) {
					res.push(result(t, u));
				});
			});
			return res;
		});
//----------------------------------------------------------------------------------------------
		/*
		var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
		var arr2 = [{Code:"A"}, {Code:"A"}, {Code:"B"}, {Code:"B"}, {Code:"C"}];  

		var res1 = arr1.groupJoin(arr2, 
			function(t){ return t.Name },                     // arr1 selector
			function(u){ return u.Code },                     // arr2 selector
			function(t, u){ return {Item:t, Group:u} }) ;         // result selector  
		  
		// using custom comparer  
		var res2 = arr1.groupJoin(arr2, 
			function(t){ return t.Name },                             // arr1 selector
			function(u){ return u.Code },                             // arr2 selector
			function(t, u){ return {Item:t, Group:u} },                 // result selector 
			function(a, b){ return a.toUpperCase() == b.toUpperCase() });     // comparer 
		*/
		Array.method('groupJoin', function(arr, outer, inner, result, comparer) {
			if(!globals.toolset.isFunction(outer)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {outer} is not a function < ' + outer + ' >');
			}
			if(!globals.toolset.isFunction(inner)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {inner} is not a function < ' + inner + ' >');
			}
			if(!globals.toolset.isFunction(result)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {result} is not a function < ' + result + ' >');
			}
			
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			return this.select(function(t) {
				var key = outer(t);
				return {
					outer: t,
					inner: arr.where(function(u) { return comparer(key, inner(u)); }),
					key: key
				};
			}).select(function(t) {
				t.inner.key = t.key;
				return result(t.outer, t.inner);
			});
		});
//----------------------------------------------------------------------------------------------
		/*
		var arr = [{Name:"A", Val:1}, {Name:"B", Val:1}, {Name:"C", Val:2}, {Name:"D", Val:2}]; 
		var res = arr.groupBy(function(t){ return t.Val }); 
		// [[{Name:"A", Val:1}, {Name:"B", Val:1}], [{Name:"C", Val:2}, {Name:"D", Val:2}]] 

		res.forEach(function(t){ 
			console.log("Key: " + t.key, "Length: " + t.length); 
		});   
		// Key: 1 Length: 2  
		// Key: 2 Length: 2 
		*/
		Array.method('groupBy', function(selector, comparer) {
			var grp = global.toolset.vector();
			
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			selector = (selector == null) ? defaultSelector : ((globals.toolset.isFunction(selector)) ? selector : null);
			if(selector == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {selector} is not a function < ' + selector + ' >');

			for (var i=0; i<this.length; i++) {
				var k = selector(this[i]);
				var g = grp.first(function(u) { return comparer(u.key, k); });

				if (!g) {
					g = [];
					g.key = k;
					grp.push(g);
				}

				g.push(this[i]);
			}
			return grp;
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5]; 
		//var dic = arr.toDictionary(function(t){ return "Num" + t }, function(u){ return u });   
		// dic = {Num5: 5, Num4: 4, Num3: 3, Num2: 2, Num1: 1} 
		Array.method('toDictionary', function(keySelector, valueSelector) {
			if(!globals.toolset.isFunction(keySelector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {keySelector} is not a function < ' + keySelector + ' >');
			}
			if(!globals.toolset.isFunction(valueSelector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {valueSelector} is not a function < ' + valueSelector + ' >');
			}
			
			var o = {};
			var len = this.length;
			while(len-- > 0) {
				var key = keySelector(this[len]);
				if(key == null || key == "") continue;
				o[key] = valueSelector(this[len]);
			}
			return o;
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var sum = arr.aggregate(function(a, b){ return a + b }, 0);  // 15
		Array.method('aggregate', function(func, seed) {
			if(!globals.toolset.isFunction(func)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {func} is not a function < ' + func + ' >');
			}

			var arr = this.slice(0);
			
			seed = (seed == null) ? arr.shift() : ((globals.toolset.isNumber(seed)) ? seed : null);
			if(seed == null) throw globals.exception.typeException('TypeError', 'incorrect {seed} value: {seed} is not a number < ' + seed + ' >');

			for (var i=0; i<this.length; i++) {
				seed = func(seed, arr[i], i, this);
			}
			return seed;
		});
//----------------------------------------------------------------------------------------------
		//var arr1 = [1, 2, 3, 4, 5]; 
		//var res1 = arr.contains(2);  // true 
		//var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:1}]; 
		//var res2 = arr2.contains({Name:"C", Val:1}, function(a, b){ return a.Val == b.Val }) ;  // true
		Array.method('contains', function(o, comparer) {
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var len = this.length;
			while (len-- > 0)
				if (comparer(this[len], o) === true) return true;
			return false;
		});
//----------------------------------------------------------------------------------------------
		Array.method('forEach', function(callback, context) {
			if(!globals.toolset.isFunction(callback)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {callback} is not a function < ' + callback + ' >');
			}
			
			context = context || window;
			
			var self = toObject(this), len = self.length >>> 0;
			for (var i=0; i<len; i++) {
				if(i in self) {
					callback.call(context, self[i], i, self);
				}
			}
			
			/*var self = toObject(this), thisp = arguments[1], i = -1, length = self.length >>> 0;
			while (++i < length) { // skip holes
				if (i in self) {
					callback.call(thisp, self[i], i, self);
				}
			}*/
		});
//----------------------------------------------------------------------------------------------
		Array.method('isArrayEqual', function() {
			for(var i=0; i<this.length - 1; i++) {
				if(this[i] !== this[i + 1]) {
					return false;
				}
			}
			return true;
		});
//----------------------------------------------------------------------------------------------
		Array.method('isArrayInequal', function() {
			for(var i=0; i<this.length; i++) {
				for(var j=i+1; j<this.length; j++){
					if(this[i] === this[j]) {
						return false;
					}
				}
			}
			return true;
		});
//----------------------------------------------------------------------------------------------
		Array.method('inArray', function(value) {
			if(this.indexOf(value) != -1) return true;
			return false;
			//for (var i=0; i < this.length; i++) {
			//	if (this[i] === value) {
			//		return true;
			//	}
			//}
			//return false;
		});
//----------------------------------------------------------------------------------------------
		Array.method('pluck', function(prop) {
			for (var i = 0, member, result = globals.toolset.vector(); member = this[i]; i++) {
				result.push(member[prop] || member);
			}
			return result;
		});
//----------------------------------------------------------------------------------------------
		Array.method('find', function(predicate, context) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not a function < ' + predicate + ' >');
			}
			
			context = context || window;
			
			var self = toObject(this), len = self.length >>> 0;
			for(var i=0; i<len; i++) {
				if (i in self) {
					if(predicate.call(context, self[i], i, self)) {
						return elem;
					}
				}
			}
			return null;
		});
//----------------------------------------------------------------------------------------------
		Array.method('findIndex', function(predicate, context) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} not a function < ' + predicate + ' >');
			}
			
			context = context || window;
			
			var self = toObject(this), len = self.length >>> 0;
			for(var i=0; i<len; i++) {
				if (i in self) {
					if(predicate.call(context, self[i], i, self)) {
						return i;
					}
				}
			}
			return -1;
		});
//----------------------------------------------------------------------------------------------
		//["a", "b", "c", "d"].insert(2, "V", ["W", "X", "Y"], "Z").join("-");
		// "a-b-V-W-X-Y-Z-c-d"
		Array.method('insert', function(index) {
			if(!globals.toolset.isIntNumber(index)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {index} is not integer number < ' + index + ' >');
			}
			if(index < 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: value < ' + index + ' > is lower {0}');
			}
			
			index = Math.min(index, this.length);
			arguments.length > 1
			&& this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
			&& this.insert.apply(this, arguments);
			return this;
		};
//----------------------------------------------------------------------------------------------
		Array.method('insert2', function(item, index) {
			if(!globals.toolset.isIntNumber(index)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: <index> not integer number < ' + index + ' >'
													};
			}
			this.splice(index, 0, item);
			return this;
		});
//----------------------------------------------------------------------------------------------
		//Fisher-Yates shuffle
		Array.method('randomize', function() {
			var len = this.length, j, temp;
			while (--len >= 1) {
				j = Math.floor(Math.random() * (len + 1));
				this[j] = [this[len], this[len] = this[j]][0];
			}
			return this;
		};
//----------------------------------------------------------------------------------------------
		Array.method('pickMRandomly', function(m) {
			if(!globals.toolset.isIntNumber(m)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {m} is not integer number < ' + m + ' >');
			}
			if(m <= 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: value < ' + m + ' > is lower or equal {0}');
			}
			
			var subset = globals.toolset.vector(m);
			var array = this.clone(), index, len = array.length;
			for(var j=0; j<m; j++) {
				index = globals.toolset.randomInt(j, len - 1);
				subset[j] = array[index];
				array[index] = array[j];
			}
			return subset;
		};
//----------------------------------------------------------------------------------------------
		Array.method('randomElement', function() {
			return this[Math.floor(Math.random() * this.length)];
		};
//----------------------------------------------------------------------------------------------
		Array.method('kthSmallest', function(rank) {
			if(!globals.toolset.isIntNumber(rank)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {rank} is not integer number < ' + rank + ' >');
			}
			if(rank <= 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: value < ' + rank + ' > is lower or equal {0}');
			}
			
			var mh = globals.collections.minHeap(this, this.length);
			for(var i=0; i<rank-1; i++) {
				mh.extractMin();
			}
			return mh.getMin();
		};
//----------------------------------------------------------------------------------------------
		Array.method('kthSmallest', function(rank) {
			if(!globals.toolset.isIntNumber(rank)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {rank} is not integer number < ' + rank + ' >');
			}
			if(rank <= 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: value < ' + rank + ' > is lower or equal {0}');
			}
			
			var arr = this.slice(0);
			globals.sorting.quickSort(arr);
			return arr[rank-1];
		});
//----------------------------------------------------------------------------------------------
		Array.method('kthLargest', function(rank) {
			if(!globals.toolset.isIntNumber(rank)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {rank} is not integer number < ' + rank + ' >');
			}
			if(rank <= 0) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: value < ' + rank + ' > is lower or equal {0}');
			}
			
			var mh = globals.collections.maxHeap(this, rank);
			for(var i=rank; i<this.length; i++) {
				if(this[i] < mh.getMax()) {
					mh.replaceMax(this[i]);
				}
			}
			return mh.getMax();
		});
//----------------------------------------------------------------------------------------------
		Array.method('diff', function(array) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			//if (array.length > this.length) {
			//	var t = array;
			//	array = this;
			//	this = t;
			//}
			return this.filter(function(e) {
				if (array.indexOf(e) === -1) return true;
			}).filter(function(e, i, c) {
				return c.indexOf(e) === i;
			});
		});
//----------------------------------------------------------------------------------------------
		Array.method('except', function(array, comparer) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var res = globals.toolset.vector();
			for (var i=0; i<this.length; i++) {
				var k = array.length;
				var t = false;
				while (k-- > 0) {
					if (comparer(this[i], arr[k]) === 0) {
						t = true;
						break;
					}
				}
				if (!t) res.push(this[i]);
			}
			return res;
		});
//----------------------------------------------------------------------------------------------
		Array.method('unique', function() {
			var seen = new Set();
			return this.filter(function(value) {
				return !seen.has(value) && seen.add(value);
			})
		});
//----------------------------------------------------------------------------------------------
		Array.method('unique', function() {
			var seen = {};
			var out = globals.toolset.vector();
			for(var i=0, j=0; i<this.length; i++) {
				var item = JSON.stringify(this[i]);
				if(seen[item] !== 1) {
					seen[item] = 1;
					out[j++] = this[i];
				}
			}
			return out;
		});
//----------------------------------------------------------------------------------------------
		Array.method('unique', function() {
			var seen = {};
			return a.filter(function(item) {
				var k = JSON.stringify(item);
				return seen.hasOwnProperty(k) ? false : (seen[k] = true);
			})
		});
//----------------------------------------------------------------------------------------------
		Array.method('countValues', function() {
			var seen = {};
			for(var i=0; i<this.length; i++) {
				var item = JSON.stringify(this[i]);
				if(seen[item] == null) {
					seen[item] = 1;
				} else {
					seen[item]++;
				}
			}
			return seen;
		});
//----------------------------------------------------------------------------------------------
		Array.method('intersect', function(array, comparer) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			
			comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var a1 = this.slice(0).sort(comparer), a2 = array.slice(0).sort(comparer);
			var i = j = 0, result = [];
			var n1 = this.length, n2 = array.length;
			while(i < n1 && j < n2) {
				if(this[i] > array[j]) {
					j++;
				} else if(array[j] > this[i]) {
					i++;
				} else {
					result.push(this[i]);
					i++;
					j++;
				}
			}
			return result;
		});
//----------------------------------------------------------------------------------------------
		Array.method('intersect', function(array) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			
			return this.filter(function(n) {
				return (array.indexOf(n) != -1);
			});
		});
//----------------------------------------------------------------------------------------------
		Array.method('intersect', function(array, comparer) {

			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			
			comparer = (comparer == null) ? defaultEqualityComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			return this.distinct(comparer).where(function(t) {
				return array.contains(t, comparer);
			});
		});
//----------------------------------------------------------------------------------------------
		//var arr1 = [1, 2, 2, 3, 3, 4, 5, 5];   
		//var res1 = arr.distinct();  // [1, 2, 3, 4, 5]
		//var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:1}];
		//var res2 = arr2.distinct(function(a, b){ return a.Val == b.Val });  // [{Name:"A", Val:1}] 
		Array.method('distinct', function(comparer) {
			comparer = (comparer == null) ? defaultSortComparer : ((globals.toolset.isFunction(comparer)) ? comparer : null);
			if(comparer == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {comparer} is not a function < ' + comparer + ' >');
			
			var arr = globals.toolset.vector();
			for (var i=0; i<this.length; i++) {
				if (!arr.contains(this[i], comparer))
					arr.push(this[i]);
			}
			return arr;
		});
//----------------------------------------------------------------------------------------------
		Array.method('union', function(array) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			
			return this.concat(array).filter(function (e, i, c) {
				return c.indexOf(e) === i;
			});
		});
//----------------------------------------------------------------------------------------------
		Array.method('union', function(array) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			return this.concat(array).distinct();
		});
//----------------------------------------------------------------------------------------------
		//var arr1 = [1, 2, 3, 4]; 
		//var arr2 = ["A", "B", "C", "D"];
		//var res = arr1.zip(arr2, function(a, b){ return {Num:a, Letter:b} });   
		//[{Num:1, Letter: "A"},{Num:2, Letter: "B"}, {Num:3, Letter: "C"}, {Num:4, Letter: "D"}] 
		Array.method('zip', function(array, selector) {
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			if(!globals.toolset.isFunction(selector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not array < ' + selector + ' >');
			}

			return this.take(Math.min(this.length, array.length)).select(function (t, i) {
				return selector(t, array[i]);
			});
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var t1 = arr.first(); // 1 
		//var t2 = arr.first(function(t){ return t > 2 });  // using comparer: 3 
		//var t3 = arr.first(function(t){ return t > 10 }, 10);  // using comparer and default value: 10 
		Array.method('first', function(predicate, def) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not array < ' + predicate + ' >');
			}
			
			var len = this.length;
			if(!predicate) {
				return (len ? this[0] : (def == null ? null : def));
			}
			for (var i=0; i<len; i++) {
				if (predicate(this[i], i, this)) {
					return this[i];
				}
			}
			return (def == null ? null : def);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var t1 = arr.last(); // 5 
		//var t2 = arr.last(function(t){ return t > 2 });  // using comparer: 5 
		//var t3 = arr.last(function(t){ return t > 10 }, 10);  // using comparer and default value: 10  
		Array.method('last', function(predicate, def) {
			if(!globals.toolset.isFunction(predicate)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {predicate} is not array < ' + predicate + ' >');
			}
			
			var len = this.length;
			if(!predicate) {
				return (len ? this[len-1] : (def == null ? null : def));
			}
			while (len-- > 0) {
				if (predicate(this[len], len, this)) {
					return this[len];
				}
			}
			return (def == null ? null : def);
		});
//----------------------------------------------------------------------------------------------
		Array.method('take', function(num) {
			if(!globals.toolset.isIntNumber(num)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {num} is not integer number < ' + num + ' >');
			}
			if(num <= 0 || num > this.length) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range (0,' + this.size() + ']');
			}
			
			return this.slice(0, num);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5, 6, 7, 8];
		//var res = arr.takeWhile(function(t){ return t % 4 != 0 });  // [1, 2, 3]
		Array.method('takeWhile', function(predicate) {
			predicate = (predicate == null) ? defaultPredicate : ((globals.toolset.isFunction(predicate)) ? predicate : null);
			if(predicate == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {predicate} is not a function < ' + predicate + ' >');
			
			var arr = globals.toolset.vector();
			for (var i=0; i<this.length && predicate(this[i], i) === true ; i++) {
				arr.push(this[i]);
			}
			return arr;
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5, 6, 7, 8];
		//var res = arr.skipWhile(function(t){ return t & 4 != 0 }) ;   // [ 4, 5, 6, 7, 8]
		Array.method('skipWhile', function(predicate) {
			predicate = (predicate == null) ? defaultPredicate : ((globals.toolset.isFunction(predicate)) ? predicate : null);
			if(predicate == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {predicate} is not a function < ' + predicate + ' >');
			
			var i = 0;
			for (i=0; i<this.length; i++) {
				if (predicate(this[i], i) === false) break;
			}
			return this.skip(i);
		});
//----------------------------------------------------------------------------------------------
		Array.method('skip', function(num) {
			if(!globals.toolset.isIntNumber(num)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {num} is not integer number < ' + num + ' >');
			}
			if(num < 0 || num >= this.length) {
				throw globals.exception.valueException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range [0,' + this.size() + '}');
			}
			
			return this.slice(num);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var doubled = arr.select(function(t){ return t * 2 });  // [2, 4, 6, 8, 10] 
		Array.method('select', function(selector, context) {
			if(!globals.toolset.isFunction(selector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');
			}
			
			context = context || window;
			
			var arr = globals.toolset.vector();
			for (var i=0; i<this.length; i++) {
				arr.push(selector.call(context, this[i], i, this));
			}
			return arr;
		});
//----------------------------------------------------------------------------------------------
		//ar arr = [{Name:"A", Values:[1, 2, 3, 4]}, {Name:"B", Values:[5, 6, 7, 8]}];  
		//var res1 = arr.selectMany(function(t){ return t.Values });  // using default result selector
		//var res2 = arr.selectMany(function(t){ return t.Values }, function(t, u){ return {Name:t.Name, Val:u}});  // using custom result selector 
		Array.method('selectMany', function(selector, resSelector) {
			if(!globals.toolset.isFunction(selector)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {selector} is not a function < ' + selector + ' >');
			}
			
			resSelector = (resSelector == null) ? function(i, res) { return res; } : ((globals.toolset.isFunction(resSelector)) ? resSelector : null);
			if(resSelector == null) throw globals.exception.typeException('TypeError', 'incorrect input value: {resSelector} is not a function < ' + resSelector + ' >');
			
			return this.aggregate(function (a, b, i) {
				return a.concat(selector(b, i).select(function(res) { return resSelector(b, res) }));
			}, []);
		});
//----------------------------------------------------------------------------------------------
		//var arr = [1, 2, 3, 4, 5];
		//var res = arr.where(function(t){ return t > 5 }).defaultIfEmpty(5);  // [5]
		Array.method('defaultIfEmpty', function(value) {
			return this.length == 0 ? [value == null ? null : value] : this;
		});
//----------------------------------------------------------------------------------------------
		Array.method('equals', function(array) {
			if(array == this) return true;
			
			if(!globals.toolset.isArray(array)) {
				throw globals.exception.typeException('TypeError', 'incorrect input argument: {array} is not array < ' + array + ' >');
			}
			if (this.length != array.length) {
				return false;
			}
			
			for (var i=0, l=this.length; i < l; i++) {
				if (this[i] instanceof Array && array[i] instanceof Array) {
					if (!this[i].equals(array[i]))
						return false;
				} else if (this[i] instanceof Object && array[i] instanceof Object) {
					if (!this[i].equals(array[i]))
						return false;
				} else if (this[i] != array[i]) {
					return false;   
				}           
			}
		}, {enumerable: false});
//----------------------------------------------------------------------------------------------
		Array.staticMethod('contains', (() =>
			Array.prototype.includes
				? (arr, value) => arr.includes(value)
				: (arr, value) => arr.some(el => el === value)
		)();
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));

//function elemIs(x) { return Object.is.bind(null, x) };
//document.writeln(['a', NaN, 'b'].findIndex(elemIs(NaN)));
//document.writeln(['a', NaN, 'b'].find(Object.is.bind(null, NaN)));
//document.writeln(['a', NaN, 'b'].findIndex(Object.is.curry(NaN)));