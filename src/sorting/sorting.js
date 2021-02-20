;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.sorting = globals.sorting || {};
//----------------------------------------------------------------------------------------------
	/**
	* @private
	* @module sorting
	* @param {Array} data Input array.
	* @param {Integer} index1 index.
	* @param {Integer} index2 index to swap_ with.
	*/
	var swap_ = function(data, index1, index2) {
		if(index1 != index2) {
			var temp = data[index2];
			data[index2] = data[index2];
			data[index2] = temp;
		}
	};
//----------------------------------------------------------------------------------------------
	(function() {
		globals.sorting.comparator = globals.sorting.comparator || {};
//----------------------------------------------------------------------------------------------
		(function() {
			/**
			* @private
			* @module sorting
			* @param {String} a Input value.
			* @param {String} b Input value to compare with.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByDefault_ = function(a, b) {

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
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmp_ = function(a, b) {
				return (a === null) - (b === null) || +(a>b) || -(a<b);
			};
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByLocale_ = function(a, b) {
				a = (a === null) ? '' : '' + a;
				b = (b === null) ? '' : '' + b;
				return a.localeCompare(b);
			};
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByLocaleIgnoreCase_ = function(a, b) {
				a = (a === null) ? '' : '' + a;
				b = (b === null) ? '' : '' + b;
				return a.toLowerCase().localeCompare(b.toLowerCase());
			};
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByLength_ = function(a, b) {
				a = (a === null) ? '' : '' + a;
				b = (b === null) ? '' : '' + b;
				return (a.length < b.length) ? -1 : (a.length > b.length) ? 1 : 0;
			};
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @param {String} locale Language locale.
			* @param {Object} options Optional. Additional properties of comparison.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*
			* @example
			* options = { sensitivity: 'base' }
			* locale = 'sv'
			*/
			var cmpByLocaleLang_ = (function() {
				var options_ = { sensitivity: 'base' };
				var locale_ = 'i';

				return function(a, b, locale, options) {
					a = (a === null) ? '' : '' + a;
					b = (b === null) ? '' : '' + b;
					locale = (globals.toolset.isString(locale)) ? locale : locale_;
					options = (globals.toolset.isObject(options)) ? options : options_;

					var localeCompareSupportsCollator = function() {
						try {
							return (new Intl.Collator(locale, options).compare(a, b));
						} catch (e) {
							console.log('ERROR: localeCompareSupportsCollator < ' + e​.name + ' >');
						}
						return false;
					};

					var localeCompareSupportsLocales = function() {
						try {
							return (new Intl.Collator(locale, options).compare(a, b));
						} catch (e) {
							console.log('ERROR: localeCompareSupportsLocales < ' + e​.name + ' >');
						}
						return false;
					};

					var result = localeCompareSupportsCollator();
					if(result === false) {
						result = localeCompareSupportsLocales();
						if(result === false) {
							result = localeCmp_(a, b);
						}
					}
					return result;
				};
			}());
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @param {String} value Property name.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByProperty_ = function(a, b, value) {
				return +(a[value] > b[value]) || +(a[value] === b[value]) - 1;
			};
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @param {String} value Property name.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*/
			var cmpByNormalize_ = (function() {
				const list = [ "NFC", "NFD", "NFKC", "NFKD" ];
				return function(a, b, value) {
					if(a === null || b === null) {
						return (a === null) - (b === null);
					}
					value = list.indexOf(value) > -1 ? value : list[0];
					let first = a.normalize(value),
						second = b.normalize(value);
					return +(a>b) || -(a<b) || 1;
				};
			}());
//----------------------------------------------------------------------------------------------
			/**
			* @private
			* @module sorting
			* @param {String} a Input string.
			* @param {String} b Input string to compare with.
			* @param {String} value Property name.
			* @return {Integer} -1 - lower, 0 - equals, 1 - greater
			*
			* @example
			* s.sort(cmpBy_('last', cmpBy_('first')));
			*/
			var cmpBy_ = function(name, cmp) {
				return function(o, p) {
					var a, b;
					if(globals.toolset.isObject(o) && globals.toolset.isObject(p)) {
						a = o[name];
						b = p[name];

						cmp = globals.toolset.isFunction(cmp) ? cmp ? null;
						if(cmp) {
							return cmp(o, p);
						}
						if(typeof a === typeof b) {
							if(globals.toolset.isObject(a) || globals.toolset.isArray(a)) {
								return a.equals(b);
							}
							return cmpByLocaleLang_(a, b);
						}
						return typeof a < typeof b ? -1 : 1;
						/*if(a === b) {
							return (globals.toolset.isFunction(cmp) ? cmp(o, p) : 0);
						}
						if(typeof a === typeof b) {
							return a < b ? -1 : 1;
						}
						return typeof a < typeof b ? -1 : 1;*/
					} else {
						throw {
							name: 'Error',
							message: 'Expected an object when sorting by < ' + name + ' >'
						};
					}
				};
			};
//----------------------------------------------------------------------------------------------
			//Export comparators
			globals.sorting.comparator.cmpByDefault = cmpByDefault_;
			globals.sorting.comparator.cmp = cmp_;
			globals.sorting.comparator.cmpByLocale = cmpByLocale_;
			globals.sorting.comparator.cmpByLocalei = cmpByLocalei_;
			globals.sorting.comparator.cmpByLength = cmpByLength_;
			globals.sorting.comparator.cmpByLocaleLang = cmpByLocaleLang_;
			globals.sorting.comparator.cmpByProperty = cmpByProperty_;
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted Array
		*
		* best time: O(n)
		* average time: O(n * n)
		* worst time: O(n * n)
		* memory: in-place
		* stable: true
		*/
		var bubbleSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var n = array.length, swapped;
			do {
				swapped = false;
				for(var i=1; i<n, i++) {
					if(cmp(array[i-1], array[i]) > 0) {
						swap_(array, i-1, i);
						swapped = true;
					}
				}
			} while(swapped != false);
			return res;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		*/
		var bucketSort = function (array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: not array < ' + array + ' >'
												};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			if(array.length < 2) {
				return;
			}

			var minVal = maxVal = array[0];
			for(var i=1; i<array.length; i++) {
				if(cmp(array[i], maxVal) > 0) {
					maxVal = array[i];
				}
				if(cmp(array[i], minVal) < 0) {
					minVal = array[i];
				}
			}

			// Создание временного массива "карманов" в количестве,
            // достаточном для хранения всех возможных элементов,
            // чьи значения лежат в диапазоне между minValue и maxValue.
            // Т.е. для каждого элемента массива выделяется "карман" List<int>.
            // При заполнении данных "карманов" элементы исходного не отсортированного массива
            // будут размещаться в порядке возрастания собственных значений "слева направо".
			var bucket = globals.toolset.matrix(maxVal - minVal + 1, 0, null);
			for(var i=0; i<array.length; i++) {
				// Занесение значений в пакеты
				bucket[array[i]-minVal].push(array[i]);
			}

			// Восстановление элементов в исходный массив
            // из карманов в порядке возрастания значений
			var pos = 0;
			for(var i=0; i<bucket.length; i++) {
				if(bucket[i].length > 0) {
					for(var j=0; j<bucket[i].length; j++) {
						array[pos++] = bucket[i][j];
					}
				}
			}

			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* @example
		* var sort = require('path-to-algorithms/src/sorting/shellsort').shellSort;
		* console.log(sort([2, 5, 1, 0, 4])); // [ 0, 1, 2, 4, 5 ]
		*
		*/
		var shellSort = (function() {
			var steps = [701, 301, 132, 57, 23, 10, 4, 1];

			return function (array, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + array + ' >'
													};
				}
				cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;
				var gap, current;
				for (var k = 0; k < steps.length; k += 1) {
					step = steps[k];
					for (var i = gap; i < array.length; i += gap) {
					  current = array[i];
					  for (var j = i; j >= gap && cmp(array[j - gap], current) > 0; j -= gap) {
						array[j] = array[j - gap];
					  }
					  array[j] = current;
					}
				}
				return array;
			};
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Integer} step Sorting step.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* @example
		* var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
		* var initArraySorted = shellSort(initArray, initArray.length);
		* document.writeln("shellSort: " + initArraySorted);
		*
		*/
		var shellSort2 = function(array, step, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			step = (globals.toolset.isIntNumber(step) && step > 0) ? step : array.length;
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var isSorted;
			for(var gap=Math.floor(step/2); gap>0; gap=Math.floor(gap/2)) {
				do {
					isSorted = 0;
					for(var i=0, j=gap; j<step; i++, j++) {
						if(cmp(array[i], array[j]) > 0) {
							swap_(array, i, j);
							isSorted = 1;
						}
					}
				} while(isSorted);
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* @example
		* var res = globals.algorithms.shellsort([3, 4, 4, 5, 6, 6]);
		* document.writeln('shellsort: ' + res);
		*
		*/
		var shellsort3 = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var temp, gap = 1, n = array.length;
			do {
				gap = 3 * gap + 1;
			} while(gap <= n);
			for(gap/=3; gap>0; gap /=3) {
				for(var i=gap; i<n; i++) {
					temp = array[i];
					for(var j=i-gap; j>=0 && cmp(array[j], temp) > 0; j-=gap) {
						array[j+gap] = array[j];
					}
					array[j+gap] = temp;
				}
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Integer} left Left border.
		* @param {Integer} right Right border.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* @example
		* var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
		* var initArraySorted = globals.algorithms.hooraSort(initArray, 0, 10);
		* document.writeln("hooraSort: " + initArraySorted);
		*
		*/
		var hooraSort = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var hoora = function(l, r) {
				if(l >= r) return;
				swap_(array, l, Math.floor((l + r) / 2));
				var las = l;
				for(var i=l+1; i<=r; i++) {
					if(cmp_(array[i], array[j]) > 0) {
						swap_(array, ++las, i);
					}
				}
				swap_(array, l, las);
				arguments.callee(l, las-1);
				arguments.callee(las+1, r);
			};

			return function(array, left, right, cmp) {

				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameters: array < ' + array + ' >'
												};
				}
				left = (globals.toolset.isIntNumber(left) && left > 0) ? left : 0;
				right = (globals.toolset.isIntNumber(right) && right > 0) ? right : array.length;
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;

				hoora(left, right);
				return array;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* @example
		* var res = globals.algorithms.insertionSort([3, 4, 4, 5, 6, 6]);
		* document.writeln('insertsort: ' + res);
		*
		* best time: O(n)
		* average time: O(n*n)
		* worst time: O(n*n)
		* memory: local
		* stable: true
		*
		*/
		var insertionSort2 = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
			}

			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var temp;
			for(var i=1; i<array.length; i++) {
				temp = array[i];
				for(var j=i-1; j>=0 && cmp(array[j], temp) > 0; j--) {
					array[j+1] = array[j];
				}
				array[j+1] = temp;
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*
		* best time: O(n)
		* average time: O(n*n)
		* worst time: O(n*n)
		* memory: in-place
		* stable: false
		*/
		var selectionSort = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var findMinimumIndex = function(data, start) {
					var minPos = start;
					for(var i=start+1; i<data.length; i++) {
						if(cmp_(data[i], data[minPos]) < 0) {
							minPos = i;
						}
					}
				return minPos;
			};

			var selectionSortRecursive = function(data, start) {
				swap_(data, start, findMinimumIndex(data, start));
				selectionSortRecursive(data, start + 1);
			};

			return function(array, start, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + array + ' >'
													};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;
				start = globals.toolset.isIntNumber(start) && (start >= 0 && start < array.length-1) ? start : null;
				if(start == null) return;
				selectionSortRecursive(array, start);
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array.
		*
		* best time: O(nlog(n))
		* average time: O(nlog(n))
		* worst time: O(nlog(n))
		* memory: O(n)
		* stable: false
		*/
		var mergeSort = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var MIN_LENGTH = 10;

			var merge = function(dest, left, right) {
				var dind = lind = rind = 0, order;
				while(lind < left.length && rind < right.length) {
					order = cmp_(left[lind], right[rind]);
					if(order <= 0) {
						dest[dind++] = left[lind++];
					} else {
						dest[dind++] = right[rind++];
					}
				}
				while(lind < left.length) dest[dind++] = left[lind++];
				while(rind < right.length) dest[dind++] = right[rind++];
				return dest;
			};

			var mergeSortSimple = function(data) {
				if(data.length < 2) {
					return data;
				}
				if(data.length < MIN_LENGTH) {
					insertionsort(data);
					return data;
				}
				var mid = Math.floor(data.length / 2);
				var left = data.slice(0, mid)
				var right = data.slice(mid, data.length);
				mergeSortSimple(left);
				mergeSortSimple(right);
				return merge(data, left, right);
			};

			return function(array, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;
				return mergeSortSimple(array);
			}
		}());
//----------------------------------------------------------------------------------------------
		var mergeSort2 = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var merge = function(data, low, middle, high) {
				var helper = globals.toolset.vector(data.length);
				for(var i=low; i<=high; i++) {
					helper[i] = data[i];
				}
				var helperLeft = low;
				var helperRight = middle + 1;
				var current = low;

				while(helperLeft <= middle && helperRight <= high) {
					if(helper[helperLeft] <= helper[helperRight]) {
						data[current] = helper[helperLeft];
						helperLeft++;
					} else {
						data[current] = helper[helperRight];
						helperRight++;
					}
					current++;
				}
				var remaining = middle - helperLeft;
				for(var i=0; i<=remaining; i++) {
					data[current + i] = helper[helperLeft + i];
				}
			};

			var mergeSort_ = function(data, low, high) {
				if(low < high) {
					var middle = Math.floor((low + high) / 2);
					mergeSort_(data, low, middle);
					mergeSort_(data, middle + 1, high);
					merge(data, low, middle, high);
				}
			};

			return function(array, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;
				return mergeSort(array, 0, array.length);
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*
		* best time: O(nlog(n))
		* average time: O(nlog(n))
		* worst time: O(n * n)
		* memory: in-place
		* stable: false
		*/
		var quicksortOptimized = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var quicksort = function(data, left, right) {
				var pivotValue = data[Math.floor((left + right) / 2)];
				var i = left, j = right;
				while(i <= j) {
					while(cmp_(data[i], pivotValue) < 0) i++;
					while(cmp_(data[j], pivotValue) > 0) j--;
					if(i <= j) {
						swap_(array, i, j);
						i++;
						j--;
					}
				}
				if(left < j) {
					quicksort(data, left, j);
				}
				if(i < right) {
					quicksort(data, i, right);
				}
			};

			return function(array, cmp) {
				if(!jsar.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input array: < ' + array + ' >'
												};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;
				quicksort(array, 0, array.length - 1);
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array
		*
		* @example
		* var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
		* var initArraySorted = globals.algorithms.quickSort(initArray);
		* document.writeln("quickSort: " + initArraySorted);
		*
		* best time: O(nlog(n))
		* average time: O(nlog(n))
		* worst time: O(n * n)
		* memory: in-place
		* stable: false
		*/
		var quickSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input array: < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var sp = 1, stackl = [], stackr = [], left, right, i, j, temp;
			stackl[1] = 1;
			stackr[1] = array.length - 1;
			while(sp > 0) {
				left = stackl[sp];
				right = stackr[sp];
				sp--;
				while(cmp(left, right) < 0) {
					i = left;
					j = right;
					middle = array[Math.floor((left + right) / 2)];
					while(i < j) {
						while(cmp(array[i], middle) < 0) i++;
						while(cmp(array[j], middle) > 0) j--;
						if(i <= j) {
							swap_(array, i, j);
							i++;
							j--;
						}
					}
					if(i < right) {
						sp++;
						stackl[sp] = i;
						stackr[sp] = right;
					}
					right = j;
				}
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Integer} min start index.
		* @param {Integer} max end index.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted array
		*
		* @example
		* var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
		* document.writeln('heapSort: ' + res);
		*/
		var heapsort = function(array, min, max, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}

			min = ((globals.toolset.isIntNumber(min) && min > 0 && min < array.length) ? min : 0;
			max = (globals.toolset.isIntNumber(max) && max > 0 && max < array.length) ? max : array.length-1;
			if(min > max) return;//throw {name: 'ValueError', message: 'incorrect min or max value: min < ' + min + ' >, max < ' + max + ' >'};

			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var heap = globals.collections.maxHeap(array.slice(min, max+1), cmp), result = [];
			while(!heap.isEmpty()) {
				result.push(heap.poll());
			}
			return result;
			//return heap.postorderTraversal();
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array
		*
		* @example
		* var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
		* document.writeln('heapSort: ' + res);
		*/
		var heapsort2 = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var adjust = function(m, n) {
					var j = m, k = 2 * m;
					while(k <= n) {
						if(k < n && cmp_(array[k-1], array[k]) < 0) ++k;
						if(cmp_(array[j-1], array[k-1]) < 0) swap_(j-1, k-1);
						j = k;
						k *= 2;
					}
			};
			return function(array, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;

				var n = array.length;
				for(var j=Math.floor(n/2); j>0; j--) {
					adjust(j, n);
				}
				for(var j=n-1; j>0; j--) {
					swap_(array, 0, j);
					adjust(1, j);
				}
				return array;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array
		*
		* @example
		* var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
		* document.writeln('heapSort: ' + res);
		*/
		var heapsort3 = (function() {
			var cmp_ = globals.sorting.comparator.cmpByDefault;

			var siftup = function(pos, n) {
				var temp, order;
				while((temp = 2 * pos + 1) < n) {
					order = cmp_(array[2 * pos + 2], array[temp]);
					if(2 * pos + 2 < n && order >= 0) {
						temp = 2 * pos + 2;
					}
					if(cmp_(array[pos], array[temp]) < 0) {
						swap_(pos, temp);
						pos = temp;
					} else {
						break;
					}
				}
				//for(var p, i=pos; i>=1 && array[p=Math.floor(i/2)] < array[i]; i=p) {
				//	swap_(p, i);
				//}
			};
			var siftdown = function(value) {
				for(var c, order, i=value; (c = 2 * i) <= array.length; i=c) {
					if((c + 1) <= array.length && cmp_(array[c+1], array[c]) > 0) {
						c++;
					}
					order = cmp_(array[i], array[c]);
					if(order >= 0) return;
					swap_(c, i);
				}
			};

			return function(array, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;

				var n = array.length;
				for(var i=n-1; i>=0; i--) {
					siftup(i, n);
				}
				for(var i=n-1; i>0;) {
					swap_(array, 0, i);
					siftup(0, i--);
				}
				//for(var i=array.length-1; i>=1; i--) {
				//	swap_(array, 0, i);
				//	siftdown(i-1);
				//}
				return array;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Current sorted array
		*/
		var pqsort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var pq = globals.collections.priqueue(array, cmp);
			//for(var i=0; i<array.length; i++) {
			//	pq.insert(array[i]);
			//}
			for(var i=0; i<array.length; i++) {
				array[i] = pq.extractmin();
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*/
		var insertionSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var temp;
			for(var i=1; i<array.length; i++) {
				temp = array[i];
				for(var j=i; j>0 && cmp(array[j-1], temp) > 0; j--) {
					array[j] = array[j-1];
				}
				array[j] = temp;
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Integer} min start index.
		* @param {Integer} max end index.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*/
		var sort = function(array, min, max, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			min = (globals.toolset.isIntNumber(min) && min > 0) ? min : 0;
			max = (globals.toolset.isIntNumber(max) && max > 0) ? max : array.length-1;
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			if(min > max) return;//throw {name: 'ValueError', message: 'incorrect min or max value: min < ' + min + ' >, max < ' + max + ' >'};l..return;
			for(var i=min; i<max; i++) {
				for(var j=i; j>0 && cmp(array[j-1], array[j]) > 0; j--) {
					swap_(array, j-1, j);
				}
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*/
		var gnomeSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var n = array.length; i = 1; j = 2;
			while(i < n) {
				if(cmp(array[i-1], array[i]) < 0) {
					i = j;
					j++;
				} else {
					swap_(array, i-1, i);
					if(--i == 0) {
						i = j;
						j++;
					}
				}
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		*/
		var cocktailSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var j = array.length-1; i = 0; flag = true, t;
			while(i < j && flag) {
				flag = false;
				for(var k=i; k<j; k++) {
					if(cmp(array[k], array[k+1]) > 0) {
						swap_(array, k, k+1);
						flag = true;
					}
				}
				j--;
				if(flag) {
					flag = false;
					for(var k=j; k>i; k--) {
						if(cmp(array[k], array[k-1]) < 0) {
							swap_(array, k , k-1);
							flag = true;
						}
					}
				}
				i++;
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted Array
		*/
		var simpleCountSort = function(array, cmp) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

			var n = array.length;
			var count = globals.toolset.vector(n, 0), res = globals.toolset.vector(n, 0);
			for(var i=0; i<n-1; i++) {
				for(var j=i+1; j<n; j++) {
					if(cmp(array[i], array[j]) < 0) {
						count[j]++;
					} else {
						count[i]++;
					}
				}
			}
			for(var i=0; i<n; i++) {
				res[count[i]] = array[i];
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module sorting
		* @param {Array} array Input array.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted Array
		*/
		var combSort = (function() {

			var getGap = function(gap) {
				gap = Math.floor(gap/1.3);
				if(gap == 9 || gap == 10) gap = 11;
				if(gap < 1) return 1;
				return gap;
			};

			return function(array, cmp) {

				if(!globals.toolset.isArray(array)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: not array < ' + array + ' >'
												};
				}
				cmp = globals.toolset.isFunction(cmp) ? cmp : globals.sorting.comparator.cmpByDefault;

				var n = array.length; gap = n, flag;
				do {
					flag = false;
					gap = getGap(gap);
					for(var i=0; i<n-gap; i++) {
						if(cmp(array[i], array[i+gap]) > 0) {
							flag = true;
							swap_(array, i+gap, i);
						}
					}
				} while(gap > 1 || flag);
			};
		}());
//----------------------------------------------------------------------------------------------
	/*
	function NaturalSort(string_array)  // string_array - это массив со строками (!), не числами.
	{
		var splitters = string_array.map(makeSplitter),
			sorted = splitters.sort(compareSplitters);
		return sorted.map(function(splitter){ return splitter.item });
		function makeSplitter(item){ return new Splitter(item) }
		function Splitter(item)
		{ var index = 0, from = 0, parts = [], completed = false;
		  this.item = item;  var key = item; this.key = key;
		  this.count = function(){ return parts.length; };
		  this.part = function(i){ while (parts.length <= i && !completed) next();
								   return i < parts.length ? parts[ i ] : null;
								 };
		  function next()
		   { if (index < key.length)
			 { while (++index)
				{ var currentIsDigit = isDigit(key.charAt(index - 1)),
					  nextChar = key.charAt(index),
					  currentIsLast = index === key.length,
					  isBorder = currentIsLast || xor(currentIsDigit, isDigit(nextChar));
					  if (isBorder)
					   { var partStr = key.slice(from, index);
						 parts.push(new Part(partStr, currentIsDigit));
						 from = index;
						 break;
					   }
				}
			 }
			 else completed = true;
		   }
		 function Part(text, isNumber)
		  { this.isNumber = isNumber; this.value = isNumber ? Number(text) : text; }
		}
		function compareSplitters(sp1, sp2)
		{ var i = 0;
		  do { var first = sp1.part(i), second = sp2.part(i);
			   if (null !== first && null !== second)
				{ if (xor(first.isNumber, second.isNumber))
				   { return first.isNumber ? -1 : 1; }
				  else { var comp = compare(first.value, second.value);
						 if (comp != 0) return comp;
					   }
				} else return compare(sp1.count(), sp2.count());
			 } while(++i);
		  function compare(a, b){ return a < b ? -1 : a > b ? 1 : 0; }
		}
	   function xor(a, b){ return a ? !b : b; }
	   function isDigit(chr)
	   { var code = charCode(chr);
		 return code >= charCode("0") && code <= charCode("9");
		 function charCode(c){ return c.charCodeAt(0); }
	   }
	}
	*/
//----------------------------------------------------------------------------------------------
		// Exports
		globals.sorting.bubbleSort = bubbleSort;
		globals.sorting.bucketSort = bucketSort;
		globals.sorting.shellsort = shellsort;
		globals.sorting.hooraSort = hooraSort;
		globals.sorting.selectionSort = selectionSort;
		globals.sorting.mergeSort = mergeSort;
		globals.sorting.quicksortOptimized = quicksortOptimized;
		globals.sorting.quickSort = quickSort;
		globals.sorting.heapsort = heapsort;
		globals.sorting.pqsort = pqsort;
		globals.sorting.insertionSort = insertionSort;
		globals.sorting.sort = sort;
		globals.sorting.gnomeSort = gnomeSort;
		globals.sorting.cocktailSort = cocktailSort;
		globals.sorting.simpleCountSort = simpleCountSort;
		globals.sorting.combSort = combSort;
	}());
//----------------------------------------------------------------------------------------------
}(typeof exports !== 'undefined' ? exports : this));
