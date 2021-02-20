var globals = (function() {
	return this;
}());
globals = globals || {};

(function (globals) {
	'use strict';
	
	globals.statistics = globals.statistics || {};
	
	(function() {
		
		var average = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
											};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var s = 0, n = n2 - n1 + 1;
			for(var i=n1-1; i<n2; i++) {
				if(array[i] < 0) return null;
				s += array[i];
			}
			return s / n;
		};
		var averageHarm = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
												};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var s = 0, n = n2 - n1 + 1;
			for(var i=n1-1; i<n2; i++) {
				if(array[i] < 0) return null;
				s += 1 / array[i];
			}
			return n / s;
		};
		var averageGeom = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
												};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var s = 1, n = n2 - n1 + 1;
			for(var i=n1-1; i<n2; i++) {
				if(array[i] < 0) return null;
				s *= array[i];
			}
			return Math.pow(s, 1 / n);
		};
		//--------------------------------------------------------------
		var range = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
											};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var arr = globals.algorithms.shellsort(array);
			return (arr[n2 - 1] - arr[n1 - 1]);
		};
		//--------------------------------------------------------------
		var quantile = function(array, n1, n2, p) {
			if(!globals.toolset.isArray(array) || !globals.toolset.isRealNumber(p) || p < 0 || p > 1) { throw {
																									name: 'ValueError',
																									message: 'incorrect input values: array < ' + array + ' >, rate < ' + p + ' >'
																								};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var arr = globals.algorithms.shellsort(array);
			var n = n2 - n1 + 1, pn = p * n, res;
			if(pn === 0) return arr[n1 - 1];
			if((pn % 1) === 0) {
				res = arr[(n1 - 1) + pn - 1] + (1 - p) * (arr[(n1 - 1) + pn] - arr[(n1 - 1) + pn - 1]);
			} else {
				res = arr[(n1 - 1) + Math.floor(pn)];
			}
			return res;
		};
		//--------------------------------------------------------------
		var median = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
											};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var arr = globals.algorithms.shellsort(array);
			var n = n2 - n1 + 1;
			return (((n % 2) === 0) ? ((arr[(n1 - 1) + n / 2] * arr[(n1 - 1) + n / 2 - 1]) / 2) : (arr[(n1 - 1) + Math.floor(n / 2)]));
		};
		//--------------------------------------------------------------
		var smoothMovingAvg = (function() {
			
			var _movingAvg = function(array, n1, n2) {
				var res = globals.toolset.vector(n2 - n1 - 1);
				for(var i=n1; i<n2-1; i++) {
					res[i] = (array[i-1] + array[i] + array[i+1]) / 3;
				}
				return res;
			};
			
			return function(array, n1, n2, movingAvg) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect array value: < ' + array + ' >'
												};
				}
				n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
				if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
				
				n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
				if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
				
				movingAvg = (movingAvg == null) ? _movingAvg : (globals.toolset.isFunction(movingAvg)) ? movingAvg : null;
				if(movingAvg == null) throw {name: 'ValueError', mesage: 'incorrect \'moving average function\' value: < ' + movingAvg + ' >'};
				
				if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																								name: 'ValueError',
																								message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																							};
				}
				return movingAvg(array, n1, n2);
			};
		}());
		//--------------------------------------------------------------
		var percentRang = function(array, n1, n2, x) {
			if(!globals.toolset.isArray(array) || !globals.toolset.isNumber(x)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: array < ' + array + ' >, x < ' + x + ' >'
																		};
			}
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var arr = globals.algorithms.shellsort(array);
			var n = n2 - n1 + 1;
			if(arr[n1 - 1] > x || arr[n2 - 1] < x) return -1;
			var l = n1 - 2, p;
			while(n != 1) {
				n = Math.floor(n / 2);
				if(arr[l + n] < x) {
					l = l + n;
				}
			}
			p = l + 1;
			//if(p > n2) return res;
			var res = (arr[p] === x) ? ((p - (n1 - 1)) / (n - 1)) : (((l - (n1 - 1)) + (p - (n1 - 1))) / (n - 1)) / 2;
			return res;
		};
		//--------------------------------------------------------------
		var rang = function(array, n1, n2, x) {
			if(!globals.toolset.isArray(array) || !globals.toolset.isNumber(x)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: array < ' + array + ' >, x < ' + x + ' >'
																			};
			}
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var arr = globals.algorithms.shellsort(array);
			if(arr[n1 - 1] > x || arr[n2 - 1] < x) return -1;
			var res = arr.indexOf(x, n1 - 1);
			if(res > (n2 - 1) || res === -1) return -1;
			return (res + 1);
		};
		//--------------------------------------------------------------
		var skew = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
												};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var n = n2 - n1 + 1, s = 0;
			var beta = n / ((n - 1) * (n - 2)), avg = var average(array, n1, n2), disp = var dispersion(array, n1, n2);
			for(var i=n1-1; i<n2; i++) {
				s += (array[i] - avg) * (array[i] - avg) / disp;
			}
			return beta * s;
		};
		//--------------------------------------------------------------
		var kurtosis = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
												};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var n = n2 - n1 + 1, s = 0;
			var beta1 = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)), beta2 = 3 * (n - 1) * (n - 1) / ((n - 3) * (n - 3)), avg = var average(array, n1, n2), disp = var dispersion(array, n1, n2);
			for(var i=n1-1; i<n2; i++) {
				s += (array[i] - avg) * (array[i] - avg) * (array[i] - avg) * (array[i] - avg) / (disp * disp);
			}
			return beta1 * s - beta2;
		};
		//--------------------------------------------------------------
		var squareDev = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
												};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var s = 0;
			var avg = var average(array, n1, n2);
			for(var i=n1-1; i<n2; i++) {
				s += (array[i] - avg) * (array[i] - avg);
			}
			return s;
		};
		//--------------------------------------------------------------
		var avgDev = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
											};
			}
			
			n1 = (n1 == null) ? 1 : (globals.toolset.isIntNumber(n1)) ? n1 : null;
			if(n1 == null) throw {name: 'ValueError', mesage: 'incorrect \'start index\' value: < ' + n1 + ' >'};
			
			n2 = (n2 == null) ? array.length : (globals.toolset.isIntNumber(n2)) ? n2 : null;
			if(n2 == null) throw {name: 'ValueError', mesage: 'incorrect \'end index\' value: < ' + n2 + ' >'};
			
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var n = n2 - n1 + 1, s = 0;
			var avg = var average(array, n1, n2);
			for(var i=n1-1; i<n2; i++) {
				s += Math.abs(array[i] - avg);
			}
			return (s / n);
		};
		//--------------------------------------------------------------
		//несмещенная оценка выборочной дисперсии
		var dispersion = function(array, n1, n2) {
			var s = var squareDev(array, n1, n2), n = n2 - n1;
			return (s / n);
		};
		//асимптотически несмещенная оценка выборочной дисперсии
		var dispersionN = function(array, n1, n2) {
			var s = var squareDev(array, n1, n2), n = n2 - n1 + 1;
			return (s / n);
		};
		//--------------------------------------------------------------
		//несмещенная оценка выборочного стандартного отклонения
		var deviation = function(array, n1, n2) {
			return Math.sqrt(var dispersion(array, n1, n2));
		};
		//смещенная оценка выборочного стандартного отклонения
		var deviationN = function(array, n1, n2) {
			return Math.sqrt(var dispersionN(array, n1, n2));
		};
		//--------------------------------------------------------------
		//функция ошибок (интеграл вероятностей)
		var erf = function(low, high, e) {
			if(!globals.toolset.isNumber(high) || high < 0) { throw {
															name: 'ValueError',
															message: 'incorrect higher border value: < ' + high + ' >'
														};
			}
			low = (low == null) ? 0 : (globals.toolset.isNumber(low) && low >= 0) ? low : null;
			if(low == null) throw {name: 'ValueError', mesage: 'incorrect lower border value: < ' + low + ' >'};
			//
			e = (e == null) ? 0.005 : (globals.toolset.isRealNumber(e) && e > 0 && e < 1) ? e : null;
			if(e == null) throw {name: 'ValueError', mesage: 'incorrect precision value: < ' + e + ' >'};
			//
			return (2 / Math.sqrt(Math.PI)) * globals.calc.simpsonIntegral(function(x) {
				return Math.exp(-Math.pow(x, 2));
			}, low, high, e);
		};
		//--------------------------------------------------------------
		//дополнительная функция ошибок (интеграл вероятностей)
		var erfс = function(low, e) { //(typeof(data) !== 'undefined') && (data !== null)
			if(!globals.toolset.isNumber(low) || low < 0) { throw {
														name: 'ValueError',
														message: 'incorrect input value: < ' + low + ' >'
													};
			}
			e = (e == null) ? 0.005 : (globals.toolset.isRealNumber(e) && e > 0 && e < 1) ? e : null;
			if(e == null) throw {name: 'ValueError', mesage: 'incorrect precision value: < ' + e + ' >'};
			//
			return (2 / Math.sqrt(Math.PI)) * globals.calc.simpsonIntegral(function(x) {
				return Math.exp(-Math.pow(x, 2));
			}, low, Number.POSITIVE_INFINITY, e); //Infinity, Number.MAX_VALUE
		};
		//--------------------------------------------------------------
		var regression = function(arrayX, arrayY){
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			if(arrayX.length === 0 || arrayY.length === 0 || arrayX.length !== arrayY.length) return;
			var sx = sy = sxy = sxx = 0, len = arrayX.length;
			for(var i=0; i<arrayX.length; i++) {
				sx += arrayX[i];
				sy += arrayY[i];
				sxy += arrayX[i] * arrayY[i];
				sxx += arrayX[i] * arrayX[i];
			}
			sx /= arrayX.length;
			sy /= arrayX.length;
			sxy /= arrayX.length;
			sxx /= arrayX.length;
			a = (sx * sy - sxy) / (sx * sx - sxx);
			b = (sxy - a * sxx) / sx;
			return {'a': a, 'b': b};
		};
		//var res = var regression([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5], [-7, -5, -3, -1, 1, 3, 5, 7, 9, 11]);
		//document.writeln('regression: ' + res.a + ' ' + res.b);
		//--------------------------------------------------------------
		var frequencyChar = function(text) {
			if(!globals.toolset.isString(text)) { throw {
												name: 'ValueError',
												message: 'incorrect string value: < ' + text + ' >'
											};
			}
			if(text.length === 0) return;
			var chars = Array.vector(60, 0), ch, len = text.length;
			var cha = 'a'.charCodeAt(0), chz = 'z'.charCodeAt(0), chA = 'A'.charCodeAt(0), chZ = 'Z'.charCodeAt(0);
			for(var i=0; i<len; i++) {
				ch = text.charCodeAt(i);
				if((cha <= ch) && (ch <= chz)) {
					chars[ch-cha]++;
				} else if((chA <= ch) && (ch <= chZ)) {
					chars[ch-chA]++;
				}
			}
			for(var i=0; i<chars.length; i++) {
				chars[i] = (chars[i] * 100 / len).toFixed(3);
			}
			return chars;
		};
		//var res = var frequencyChar("asdfjlksafjlsajfkl;asjkf;jasjfdkas;lfd;lkxx");
		//for(i=0; i<res.length; i++) {
		//	document.writeln("------------------" + String.fromCharCode(i + 'A'.charCodeAt(0)) + "-----------------" + res[i]);
		//};
		//--------------------------------------------------------------
		var distribution = function(array, nInterval, width, higherRangeInclude) {
			if(!globals.toolset.isArray(array) || !globals.toolset.isIntNumber(nInterval) || !globals.toolset.isNumber(width) || nInterval <= 0 || width <= 0) { throw {
																																							name: 'ValueError',
																																							message: 'incorrect input values: array < ' + array + ' >, interval < ' + nInterval + ' >, width < ' + width + ' >, upper border include < ' + higherRangeInclude + ' >'
																																						};
			}
			higherRangeInclude = (higherRangeInclude == null) ? false : (globals.toolset.isBoolean(higherRangeInclude)) ? higherRangeInclude : null;
			if(higherRangeInclude == null) throw {name: 'ValueError', message: 'incorrect higher ranger value: < ' + higherRangeInclude + ' >'};
			//
			var dist = Array.vector(nInterval, 0);
			for(var i=0; i<array.length; i++) {
				dist[Math.floor(array[i] / width) - ((higherRangeInclude) ? ((array[i] % width) ? 0 : 1) : 0)]++;
			}
			return dist;
		};
		//var diss = var distribution([5, 10, 20, 29, 50, 2, 40, 49], 10, 10, true);
		//for(var i=0; i<diss.length; i++) {
		//	document.writeln(" in " + (i+1) + " -> " + diss[i]);
		//};
		//--------------------------------------------------------------
		var nmax = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: array < ' + array + ' >'
											};
			}
			if(array.length === 0) return 0;
			var m = array[0], k = 1;
			for(var i=1; i<array.length; i++) {
				if(array[i] > m) {
					m = array[i];
					k = 1;
				} else {
					if(array[i] === m) {
						k++;
					}
				}
			}
			return k;
		};
		//var data = [4, 8, 15, 15, 16, 23, 42, 42];
		//document.writeln(var nmax(data));
		//--------------------------------------------------------------
		var max = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: array < ' + array + ' >'
											};
			}
			if(array.length === 0) return;
			var m = array[0];
			for(var i=1; i<array.length; i++) {
				if(array[i] > m) {
					m = array[i];
				}
			}
			return m;
		};
		//var data = [4, 8, 15, 15, 16, 23, 42, 42, 92];
		//document.writeln(var max(data));
		//--------------------------------------------------------------
		var min = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: array < ' + array + ' >'
											};
			}
			if(array.length === 0) return;
			var m = array[0];
			for(var i=1; i<array.length; i++) {
				if(array[i] < m) {
					m = array[i];
				}
			}
			return m;
		};
		//var data = [-1, 'b', 0, 'a', 4, 8, 15, 15, 16, 23, 42, 42, 92];
		//document.writeln(var min(data));
		//--------------------------------------------------------------
		var expect = function(arrayP, arrayV) {
			if(!globals.toolset.isArray(arrayP) || !globals.toolset.isArray(arrayV) || arrayP.length !== arrayV.length) { throw {
																														name: 'ValueError',
																														message: 'incorrect input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																													};
			}
			var sum = 0, me = 0;
			for(var i=0; i<arrayP.length; i++) {
				sum += arrayP[i];
				me += (arrayP[i] * arrayV[i]);
				
			}
			if(sum !== 1) return;
			return me;
		};
		//--------------------------------------------------------------
		var getKnuth = function(m, n) {
			if(!globals.toolset.isNumber(m) || !globals.toolset.isNumber(n) || m > n) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: unique numbers < ' + m + ' >, upper border < ' + n + ' >'
																				};
			}
			var tmp = [];
			for(var i=0; i<n; i++) {
				if(((Math.random() * Number.MAX_INT) % (n - i)) < m) {
					tmp.push(i);
					m--;
				}
			}
			return tmp;
		};
		//document.writeln(var getKnuth(2, 5));
		//--------------------------------------------------------------
		var getGauss = function(x, m, sigma) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(sigma) || sigma <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, math expectation < ' + m + ' >, standard deviation < ' + sigma + ' >'
																														};
			}
			return (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-Math.pow(x-m, 2) / (2 * Math.pow(sigma, 2)));
		};
		//--------------------------------------------------------------
		var getRandom = function(l, u) {
			if(!globals.toolset.isNumber(l) || !globals.toolset.isNumber(u) || l > u) { throw {
																					name: 'ValueError',
																					message: 'incorrect border values: lower point < ' + l + ' >, higher point < ' + u + ' >'
																				};
			}
			return (l + Math.random() * (u - l));
		};
		//равномерное дискретное распределение
		//P(X = i) = 1 / n, [1, n];
		//MX = (n + 1) / 2, DX = (n + 1) * (2 * n + 1) / 6;
		//--------------------------------------------------------------
		var fDensity = function(x, m, n) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(n) || m < 1 || n < 1) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, degrees of freedom (1) < ' + m + ' >, degrees of freedom (2) < ' + n + ' >'
																														};
			}
			if(x >= 0) return var gammaDist((m + n) / 2) / (var gammaDist(m / 2) * var gammaDist(n / 2)) * Math.pow(m / n, m / 2) * Math.pow(x, m / 2 - 1) * Math.pow(1 + (m / n) * x, - (m + n) / 2);
			return 0;
		};
		//var fDensity(0.5, 2, 3);
		//mx = n / (n - 2), при n > 2; dx = 2 * n * n *(m + n - 2) / (m * (n - 2) * (n - 2) * (n - 4)), при n > 4;
		//если НСВ ym и yn - распределение хи-квадрат с m и n степенями свободы, то СВ x = (ym / m) / (yn / n) - F-распределение
		//F(u) = 1 - fDensity(u, m, n);
		var fDistribution = function(x, m, n) {
			//if(x == null || typeof x !== 'number' || m == null || typeof m !== 'number' || n == null || typeof n !== 'number' || m < 1 || n < 1) { throw {
			//																																		name: 'ValueError',
			//																																		message: 'incorrect value'
			//																																	};
			//}
			return (1 - var fDensity(x, m, n));
		};
		//--------------------------------------------------------------
		var betaDensity = function(x, a, b) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || a <= 0 || b <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, alpha < ' + a + ' >, beta < ' + b + ' >'
																														};
			}
			if(x <= 1 && x >= 0) return var gammaDist(a + b) / (var gammaDist(a) * var gammaDist(b)) * Math.pow(x, a - 1) * Math.pow(1 - x, b - 1);
			return 0;
		};
		//var betaDensity(1, 2, 5);
		//mx = a / (a + b); dx = ab / ((a + b) * (a + b) *(a + b + 1));
		//равномерное на интервале [0,1]
		//a = b = 2 - треугольное распределение
		//a = b = 1 / 2 - распределение арксинуса
		//b = a + 1 - обобщенное распределение арксинуса
		//--------------------------------------------------------------
		var binomDensity = function(p, n, k) {
			if(!globals.toolset.isRealNumber(p) || !globals.toolset.isNumber(n) || !globals.toolset.isNumber(k) || p <= 0 || p >= 1 || n < 1 || k < 0 || k > n) { throw {
																																							name: 'ValueError',
																																							message: 'incorrect input values: number of trials < ' + n + ' >, number of successes < ' + k + ' >, probability < ' + p + ' >'
																																						};
			}
			return globals.calc.binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
			//return Math.calc.binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
		};
		//var binomDensity(0.5, 20, 5);
		//mx = np; dx = np(1-p);
		//k <= x :SUM: P(X=k)
		//--------------------------------------------------------------
		var weibullDensity = function(x, a, l) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(a) || !globals.toolset.isNumber(l) || a <= 0 || l <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, alpha < ' + a + ' >, lambda < ' + l + ' >'
																														};
			}
			if(x > 0) return Math.abs(a) * l * Math.pow(x, a - 1) * Math.exp(-l * Math.pow(x, a));
			return 0;
		};
		//var weibullDensity(0, 1, 2);
		//var weibullDensity(x, a=1, l);//экспоненциальное распределение
		//-0; x :integral: f(u) du
		//--------------------------------------------------------------
		var gammaDensity = function(x, a, l) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(a) || !globals.toolset.isNumber(l) || a <= 0 || l <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, alpha < ' + a + ' >, lambda < ' + l + ' >'
																														};
			}
			if(x > 0) return Math.pow(l, a) / var gamma(a) * Math.pow(x, a - 1) * Math.exp(-l * x);
			return 0;
		};
		//var gammaDensity(1, 1.5, 1);
		// mx = a / l; dx = a / (l * l);
		//var gammaDensity(x, a=1, l); //показательное распределение
		//var gammaDensity(x, a=n/2, l=1/2); //распределение хи-квадрат с n степенями свободы
		//var gammaDensity(x, a=n(натуральное число), l=n*m); //распределение Эрланга с параметрами n и m
		//var gammaDensity(x, a(натуральное число), l=1); //показательно-степенное распределение
		//F(u) = 1 - gammaDensity(u, a, l);
		//-0; x :integral: f(u) du
		//--------------------------------------------------------------
		var hyperGeomDensity = function(p, n, k, N) {
			if(!globals.toolset.isRealNumber(p) || !globals.toolset.isIntNumber(n) || !globals.toolset.isIntNumber(k) || !globals.toolset.isIntNumber(N) || p <= 0 || p >= 1 || n < 0 || N < n || k < 0 || k > n) { throw {
																																																									name: 'ValueError',
																																																									message: 'incorrect input values: sample size < ' + n + ' >, number of successes in sample < ' + k + '>, population size < ' + N + '>, probability < ' + p + ' >'
																																																								};
			}
			return globals.calc.binom(Math.floor(N * p), k) * globals.calc.binom(Math.floor(N * (1 - p)), n - k) / globals.calc.binom(N, n);
			//return globals.calc.binom(Math.floor(N * p), k) * globals.calc.binom(Math.floor(N * (1 - p)), n - k) / globals.calc.binom(N, n);
		};
		//var hyperGeomDensity(0.4, 10, 10, 100);
		//--------------------------------------------------------------
		var logNormDensity = function(x, m, sigma) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(sigma) || sigma <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, math expectation < ' + m + ' >, standard deviation < ' + sigma + ' >'
																														};
			}
			if(x > 0) return (1 / (x * sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(Math.log(x) - m) * (Math.log(x) - m) / (2 * sigma * sigma));
			return 0;
		};
		//var logNormDensity(0, -1, 1.5);
		//Если СВ X - логнормальное распределение, то Y = ln X - нормальное распределение с m и sigma
		//-0; x :integral: f(u) du
		//--------------------------------------------------------------
		var normDensity = function(x, m, sigma) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(sigma) || sigma <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, math expectation < ' + m + ' >, standard deviation < ' + sigma + ' >'
																														};
			}
			return (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-(x - m) * (x - m) / (2 * sigma * sigma));
		};
		//var normDensity(-2, 2, 1);
		//mx = m; dx = sigma * sigma
		//var norm(x, 0, 1) - стандартное нормальное распределение, //-infinity; + x :integral: f(u) du
		//-infinity; + infinity :integral: f(u) du
		var normDistribution = function(x, m, sigma) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(sigma) || sigma <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, math expectation < ' + m + ' >, standard deviation < ' + sigma + ' >'
																														};
			}
			var func = function(m, sigma) {
				return function(x) {
					return (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-(x - m) * (x - m) / (2 * sigma * sigma));
				}
			};
			return globals.calc.simpsonIntegral(func(m, sigma), -1000000000, x, 0.001);
			//return globals.calc.simpsonIntegral(func(m, sigma), -Number.MAX_VALUE, x, 0.5);//-Number.MAX_VALUE//Number.NEGATIVE_INFINITY
		};
		//--------------------------------------------------------------
		var negBinomDensity = function(p, r, k) {
			if(!globals.toolset.isRealNumber(p) || !globals.toolset.isIntNumber(r) || !globals.toolset.isIntNumber(k) || p <= 0 || p >= 1 || k < 0 || r < 1) { throw {
																																						name: 'ValueError',
																																						mesage: 'incorrect input values: number of successes < ' + r + ' >, number of fails < ' + k + ' >, probability < ' + probability + ' >'
																																					};
			}
			return globals.calc.binom(k, r + k -1) * Math.pow(p, r) * Math.pow(1 - p, r);
		};
		//var negBinomDensity(0.75, 10, 0);
		//--------------------------------------------------------------
		var puassonDensity = function(x, l) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(l) || l <= 0 || x < 0) { throw {
																								name: 'ValueError',
																								mesage: 'incorrect input values: x < ' + x + ' >, lambda < ' + l + ' >'
																							};
			}
			if(l === 0) return 1;
			return (Math.exp(-l) * Math.pow(l, x) / globals.calc.factorial(x));
		};
		//var puassonDensity(3, 10);
		//mx = dx = l;
		//k <= x :SUM: P(X=k)
		//--------------------------------------------------------------
		var studDensity = function(x, n) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isIntNumber(n) || n < 1) { throw {
																						name: 'ValueError',
																						mesage: 'incorrect input values: x < ' + x + ' >, n (degrees of freedom) < ' + n + ' >'
																					};
			}
			return (var gammaDist((n + 1) / 2) * Math.pow(1 + (x * x / n), -(n + 1)/ 2) / (Math.sqrt(Math.PI * n) * var gammaDist(n / 2)));
		};
		//var studDensity(0.1, 2);
		//F(x) = 1 - var studDensity(x, n) для x >= 0;
		//F(x) = 1 - var studDensity(Math.abs(x), n, 1) для x <= 0;
		//Если Y - СВ со стандартным нормальным распределением, Z - СВ с хи-квадрат распределением с n степенями свободы, то X = Y * Math.sqrt(n / Z) - распределение Стьюдента с n степенями свободы
		var studDistribution = function(x, n) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isIntNumber(n) || n < 1) { throw {
																						name: 'ValueError',
																						mesage: 'incorrect input values: x < ' + x + ' >, n (degrees of freedom) < ' + n + ' >'
																					};
			}
			if(x >= 0) return (1 - var studDensity(x, n));
			return var studDensity(Nath.abs(x), n);
		};
		//--------------------------------------------------------------
		var сhiSquareDensity = function(x, n) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isIntNumber(n) || n < 1) { throw {
																						name: 'ValueError',
																						mesage: 'incorrect input values: x < ' + x + ' >, n (degrees of freedom) < ' + n + ' >'
																					};
			}
			if(x >= 0) return Math.pow(x, (n / 2) - 1) * Math.exp(-x / 2) / (Math.pow(2, n / 2) * var gammaDist(n / 2));
			return 0;
		};
		//var сhiSquareDensity(0.7, 3);
		//mx = n, dx = 2 * n;
		//F(x) = 1 - var сhiSquare(0.7, 3)
		//Если X1, X2, ..., Xn - НСВ со стандартным нормальным распределением, то СВ Y = i=1, n :SUM: Xi * Xi - распределение хи-квадрат с n степенями свободы
		//--------------------------------------------------------------
		var expDensity = function(x, l) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(l) || l <= 0) { throw {
																					name: 'ValueError',
																					mesage: 'incorrect input values: x < ' + x + ' >, lambda < ' + l + ' >'
																				};
			}
			if(x >= 0) return l * Math.exp(-l * x);
			return 0;
		};
		//var expDensity(0.6, 0.7);
		//mx = 1 / l; dx = 1 / (l * l);
		//F(u) = 1 - Math.exp(-l * u) (u >= 0);
		//--------------------------------------------------------------
		var zTest = function(array, x, sigma, n1, n2, levelSign, type) {
			if(!globals.toolset.isArray(array) || !globals.toolset.isNumber(x)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: array < ' + array + ' >, x < ' + x + ' >'
																			};
			}
			n1 = (globals.toolset.isIntNumber(n1) ? n1 : 1);
			n2 = (globals.toolset.isIntNumber(n2) ? n2 : array.length);
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect array border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			sigma = (sigma == null) ? var deviation(array, n1, n2) : (globals.toolset.isNumber(sigma) && sigma > 0) ? sigma : null;
			if(sigma == null) throw {name: 'ValueError', mesage: 'incorrect \'standard deviation\' value: < ' + sigma + ' >'};
			//
			levelSign = (levelSign == null) ? 0.05 : (globals.toolset.isRealNumber(levelSign) && levelSign > 0 && levelSign < 1) ? levelSign : null;
			if(levelSign == null) throw {name: 'ValueError', mesage: 'incorrect \'level of significance\' value: < ' + levelSign + ' >'};
			//
			var n = n2 - n1 + 1;
			var t = Math.sqrt(n) * (var average(array, n1, n2) - x) / sigma;
			var z = (1 - var normDistribution(t, 0, 1));
			//
			type = (type == null) ? 1 : (globals.toolset.isNumber(type) && type > 0 && type < 4) ? type : null;
			if(type == null) throw {name: 'ValueError', mesage: 'incorrect hypotese type {1 - <eq>, 2 - <le>, 3 - <ge>}'};
			//
			switch(type) {
				case 1:
					//variant a: H0: mu = m0, H1: mu <> m0
					if((levelSign / 2) <= (1 - z) && (1 - z) <= (1 - (levelSign / 2))) return true;
				break;
				case 2:
					//variant b: H0: mu <= m0, H1: mu > m0
					if(z >= (1 - levelSign)) return true;
				break;
				case 3:
					//variant c: H0: mu >= m0, H1: mu < m0
					if(levelSign >= z) return true;
				break;
				default:
				break;
			}
			return false;
		};
		//--------------------------------------------------------------
		var tTest = function(arrayX, arrayY, n1, n2, tails, type, levelSign) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect arrays input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			tails = (tails == null) ? 1 : (globals.toolset.isIntNumber(tails) && tails > 0 && tails < 3) ? tails : null;
			if(tails == null) throw {name: 'ValueError', mesage: 'incorrect tails value {1 - <eq>, 2 - <ne>}: < ' + tails + ' >'};
			//
			levelSign = (levelSign == null) ? 0.05 : (globals.toolset.isRealNumber(levelSign) && levelSign > 0 && levelSign < 1) ? levelSign : null;
			if(levelSign == null) throw {name: 'ValueError', mesage: 'incorrect \'level of significance\' value: < ' + levelSign + ' >'};
			//
			type = (type == null) ? 1 : (globals.toolset.isIntNumber(type) && type > 0 && type < 4) ? type : null;
			if(type == null) throw {name: 'ValueError', mesage: 'incorrect hypotese type value {1 - <eq>, 2 - <le>, 3 - <ge>}: < ' + type + ' >'};
			//
			switch(type) {
				case 1:
					var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
					n1 = (globals.toolset.isIntNumber(n1) ? n1 : 1);
					n2 = (globals.toolset.isIntNumber(n2) ? n2 : minLen);
					if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > minLen || n2 > minLen) { throw {
																						name: 'ValueError',
																						message: 'incorrect array border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																					};
					}
					var n = n2 - n1 + 1, diff = [];
					for(var i=n1-1; i<n2; i++) {
						diff.push(arrayX[i] - arrayY[i]);
					}
					var avg = var average(diff), dev = var deviationN(diff);
					var t = avg / (dev / globals.sqrt(n));
					var dof = n - 1;
					switch(tails) {
						case 1:
							//variant a: H0: m1 <= m2, H1: m1 > m2
							var z = 1 - var studDistribution(t, dof);
							if(z > levelSign) return true;
						break;
						case 2:
							//variant b: H0: m1 = m2, H1: m1 <> m2
							var z = 1 - var studDistribution(t, dof) + var studDistribution(-t, dof);
							if(z > levelSign) return true;
						break;
						default:
						break;
					}
					return false;
				break;
				case 2:
					var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
					var nF = (globals.toolset.isIntNumber(n1) ? n1 : 1);
					var nXL = (globals.toolset.isIntNumber(n2) ? n2 : arrayX.length);
					var nYL = (globals.toolset.isIntNumber(n2) ? n2 : arrayY.length);
					if(nF >= nXL || nF >= nYL || nF <= 0 || nXL <= 0 || nYL <=0 || nF > minLen || nXL > minLen || nYL > minLen) { throw {
																																	name: 'ValueError',
																																	message: 'incorrect array border values: low < ' + nF + ' >, high1 < ' + nXL + ' >, high2 < ' + nYL + ' >'
																																};
					}
					//
					var avgX = var average(arrayX, nF, nXL), avgY = var average(arrayY, nF, nYL);
					var dispX = var dispersion(arrayX, nF, nXL), dispY = var dispersion(arrayY, nF, nYL);
					//
					var nX = nXL - nF + 1, nY = nYL - nF + 1;
					var t = globals.sqrt(nX + nY - 2) * (avgX - avgY) / (globals.sqrt((nX + nY) / (nX * nY)) * globals.sqrt(((nX - 1) * dispX + (nY - 1) * dispY)));
					var dof = nX + nY - 2;
					switch(tails) {
						case 1:
							//variant a: H0: m1 <= m2, H1: m1 > m2
							var z = 1 - var studDistribution(t, dof);
							if(z > levelSign) return true;
						break;
						case 2:
							//variant b: H0: m1 = m2, H1: m1 <> m2
							var z = 1 - var studDistribution(t, dof) + var studDistribution(-t, dof);
							if(z > levelSign) return true;
						break;
						default:
						break;
					}
					return false;
				break;
				case 3:
					var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
					var nF = (globals.toolset.isIntNumber(n1) ? n1 : 1);
					var nXL = (globals.toolset.isIntNumber(n2) ? n2 : arrayX.length);
					var nYL = (globals.toolset.isIntNumber(n2) ? n2 : arrayY.length);
					if(nF >= nXL || nF >= nYL || nF <= 0 || nXL <= 0 || nYL <= 0 || nF > minLen || nXL > minLen || nYL > minLen) { throw {
																																	name: 'ValueError',
																																	message: 'incorrect array border values: low < ' + nF + ' >, high1 < ' + nXL + ' >, high2 < ' + nYL + ' >'
																																};
					}
					//
					var avgX = var average(arrayX, nF, nXL), avgY = var average(arrayY, nF, nYL);
					var dispX = var dispersion(arrayX, nF, nXL), dispY = var dispersion(arrayY, nF, nYL);
					//
					var nX = nXL - nF + 1, nY = nYL - nF + 1;
					var t = (avgX - avgY) / (globals.sqrt(dispX / nX + dispY / nY));
					var dof = (dispX / nX + dispY / nY) * (dispX / nX + dispY / nY) / (((dispX / nX) * (dispX / nX) / (nX - 1)) + ((dispY / nY) * (dispY / nY) / (nY - 1)));
					switch(tails) {
						case 1:
							//variant a: H0: m1 <= m2, H1: m1 > m2
							var z = 1 - var studDistribution(t, dof);
							if(z > levelSign) return true;
						break;
						case 2:
							//variant b: H0: m1 = m2, H1: m1 <> m2
							var z = 1 - var studDistribution(t, dof) + var studDistribution(-t, dof);
							if(z > levelSign) return true;
						break;
						default:
						break;
					}
					return false;
				break;
				default:
				break;
			}
		};
		//--------------------------------------------------------------
		var fTest = function(arrayX, arrayY, n1, n2, levelSign) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			levelSign = (levelSign == null) ? 0.05 : (globals.toolset.isRealNumber(levelSign) && levelSign > 0 && levelSign < 1) ? levelSign : null;
			if(levelSign == null) throw {name: 'ValueError', mesage: 'incorrect \'level of significance\' value: < ' + levelSign + ' >'};
			//
			var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
			var nF = (globals.toolset.isIntNumber(n1) ? n1 : 1);
			var nXL = (globals.toolset.isIntNumber(n2) ? n2 : arrayX.length);
			var nYL = (globals.toolset.isIntNumber(n2) ? n2 : arrayY.length);
			if(nF >= nXL || nF >= nYL || nF <= 0 || nXL <= 0 || nYL <=0 || nF > minLen || nXL > minLen || nYL > minLen) { throw {
																															name: 'ValueError',
																															message: 'incorrect array border values: low < ' + nF + ' >, high1 < ' + nXL + ' >, high2 < ' + nYL + ' >'
																														};
			}
			//
			var dispX = var dispersion(arrayX, nF, nXL), dispY = var dispersion(arrayY, nF, nYL);
			//
			var nX = nXL - nF + 1, nY = nYL - nF + 1;
			var t = dispX / dispY;
			var z = 1 - var fDistribution(t, nX - 1, nY - 1);
			//H0: dispX = dispY, H1: dispX <> dispY;
			if(z > levelSign) return true;
			return false;
		};
		//--------------------------------------------------------------
		var chiTest = function(arrayX, arrayY, n1, n2, levelSign) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			levelSign = (levelSign == null) ? 0.05 : (globals.toolset.isRealNumber(levelSign) && levelSign > 0 && levelSign < 1) ? levelSign : null;
			if(levelSign == null) throw {name: 'ValueError', mesage: 'incorrect \'level of significance\' value: < ' + levelSign + ' >'};
			//
			var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
			n1 = (globals.toolset.isIntNumber(n1) ? n1 : 1);
			n2 = (globals.toolset.isIntNumber(n2) ? n2 : minLen);
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > minLen || n2 > minLen) { throw {
																				name: 'ValueError',
																				message: 'incorrect array border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																			};
			}
			var n = n2 - n1 + 1, t = 0;
			for(var i=n1-1; i<n2; i++) {
				t += (arrayX[i] - arrayY[i]) * (arrayX[i] - arrayY[i]) / arrayY[i];
			}
			var z = var сhiSquareDensity(t, n - 1);
			if(z > levelSign) return true;
			return false;
		};
		//--------------------------------------------------------------
		//Выборочная ковариация
		var cov = function(arrayX, arrayY, n1, n2, isBiased) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			isBiased = (isBiased == null) ? true : (globals.toolset.isBoolean(isBiased)) ? isBiased : null;
			if(isBiased == null) throw {name: 'ValueError', message: 'incorrect biased value: < ' + isBiased + ' >'};
			//
			var minLen = (arrayX.length > arrayY.length) ? arrayY.length : arrayX.length;
			n1 = (globals.toolset.isIntNumber(n1) ? n1 : 1);
			n2 = (globals.toolset.isIntNumber(n2) ? n2 : minLen);
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > minLen || n2 > minLen) { throw {
																				name: 'ValueError',
																				message: 'incorrect array border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																			};
			}
			var n = (isBiased) ? (n2 - n1 + 1) : (n2 - n1), t = 0;
			var avgX = var average(arrayX, n1, n2), avgY = var average(arrayY, n1, n2);
			for(var i=n1-1; i<n2; i++) {
				t += (arrayX[i] - avgX) * (arrayX[i] - avgY);
			}
			return (t / n);
		};
		//--------------------------------------------------------------
		//Выборочный коэффициент корреляции
		var corr = function(arrayX, arrayY, n1, n2) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			var cov = var cov(arrayX, arrayY, n1, n2);
			var devX = var deviationN(arrayX, n1, n2), devY = var deviationN(arrayY, n1, n2);
			if(devX === 0 || devY === 0) return;
			return (cov / (devX * devY));
		};
		//--------------------------------------------------------------
		//Выборочный коэффициент корреляции Пирсона (несмещенная оценка)
		var pearson = function(arrayX, arrayY, n1, n2) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			var cov = var cov(arrayX, arrayY, n1, n2, false);
			var devX = var deviation(arrayX, n1, n2), devY = var deviation(arrayY, n1, n2);
			if(devX === 0 || devY === 0) return;
			return (cov / (devX * devY));
		};
		//--------------------------------------------------------------
		var rDetermination = function(arrayX, arrayY, n1, n2) {
			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																					name: 'ValueError',
																					message: 'incorrect array input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																				};
			}
			var pearson = var pearson(arrayX, arrayY, n1, n2);
			return ((pearson == null) ? 0 : (pearson * pearson));
		};
		//--------------------------------------------------------------
		var fisher = function(x) {
			if(!globals.toolset.isNumber(x) || x <= -1 || x >= 1) { throw {
																	name: 'ValueError',
																	mesage: 'incorrect input value: x < ' + x + ' >'
																};
			}
			return (1 / 2) * Math.log((1 + x) / (1 - x));
		};
		//document.writeln(var fisher(-0.99));
		//--------------------------------------------------------------
		var fisherReverse = function(x) {
			if(!globals.toolset.isNumber(x)) { throw {
												name: 'ValueError',
												mesage: 'incorrect input value: x < ' + x + ' >'
											};
			}
			return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
		};
		//document.writeln(var fisherReverse(7));
		//--------------------------------------------------------------
		var mode = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array input value: array < ' + array + ' >'
												};
			}
			var obj = {}, modeFreq = 0, modeElem, elem;
			for (var i=0; i<array.length; i++) {
				elem = array[i];
				Object.prototype.hasOwnProperty.call(obj, elem) ? ++obj[elem] : obj[elem] = 1;
				if (obj[elem] > modeFreq) {
					modeFreq = obj[elem];
					modeElem = elem;
				}
			}
			return modeElem;
		};
		//document.writeln(var mode([4, 4, 3, 5, 5, 3, 2, 1, 3]));
		//--------------------------------------------------------------
		var frequency = function(arrayValues, arrayIntervals) {
			if(!globals.toolset.isArray(arrayValues) || !globals.toolset.isArray(arrayIntervals)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input parameters: values < ' + arrayValues + ' >, intervals < ' + arrayIntervals + ' >'
																							};
			}
			arrayIntervals.sort();
			//var freqDist = Array.matrix(arrayIntervals.length + 1, 0, null), flag = false;
			var freqDist = Array.vector(arrayIntervals.length + 1, 0), flag = false;
			var i, j;
			for(i=0; i<arrayValues.length; i++) {
				for(j=0; j<arrayIntervals.length; j++) {
					if(globals.toolset.doubleLess(arrayValues[i], arrayIntervals[j], null, true)) {
					//if(arrayValues[i] <= arrayIntervals[j]) {
						//freqDist[j].push(arrayValues[i]);
						freqDist[j]++;
						flag = true;
						break;
					}
				}
				if(!flag) {
					//freqDist[j].push(arrayValues[i]);
					freqDist[j]++;
					flag = false;
				}
			}
			return freqDist;
		};
		//document.writeln(var frequency([1, 3, 4, 5, 6, 6, 7, 3, 2, 4, 6, 2, 5, 3, 6], [0, 2, 4, 8, 6]));
		//--------------------------------------------------------------
		var gamma = function(x) {
			if(!globals.toolset.isNumber(x) || x <= 0) { throw {
														name: 'ValueError',
														message: 'incorrect input value: x < ' + x + ' >'
													};
			}
			var func = function(arg) {
				return function(x) {
					return (Math.exp(-x) * Math.pow(x, arg - 1));
				}
			};
			return globals.calc.simpsonIntegral(func(x), 0, 1000000000, 0.001);
			//return globals.calc.simpsonIntegral(func(x), 0, Number.MAX_VALUE, 0.5);//Number.POSITIVE_INFINITY
		};
		//--------------------------------------------------------------
		var normalize = function(x, m, sigma) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(m) || !globals.toolset.isNumber(sigma) || sigma <= 0) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: x < ' + x + ' >, math expectation < ' + m + ' >, standard deviation < ' + sigma + ' >'
																														};
			}
			return (x - m) / sigma;
		};
		//--------------------------------------------------------------
		var binom = function(n, k) {
			if(!globals.toolset.isIntNumber(k) || !globals.toolset.isIntNumber(n) || n < 1 || k < 0 || k > n) { throw {
																														name: 'ValueError',
																														message: 'incorrect input values: n < ' + n + ' >, k < ' + k + ' >'
																													};
			}
			return (globals.calc.factorial(n) / (globals.calc.factorial(k) * globals.calc.factorial(n - k)));
		};
		var binom = function(n, k) {
			var coeff = 1;
			for (var i = n-k+1; i <= n; i++) coeff *= i;
			for (var i = 1; i <= k; i++) coeff /= i;
			return coeff;
		};
		//--------------------------------------------------------------
		var permutation = function(n, k) {
			if(!globals.toolset.isIntNumber(n) || !globals.toolset.isIntNumber(k) || n <=0 || k <= 0 || n < k) { throw {
																												name: 'ValueError',
																												message: 'incorrect input values: number of objects < ' + n + ' >, number of selected objects < ' + k + ' >'
																										};
			}
			return (globals.calc.factorial(n) / globals.calc.factorial(n - k));
		};
		//--------------------------------------------------------------
		var euclidianNorm = function(array, n1, n2) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect array value: < ' + array + ' >'
											};
			}
			n1 = (globals.toolset.isIntNumber(n1) ? n1 : 1);
			n2 = (globals.toolset.isIntNumber(n2) ? n2 : array.length);
			if(n1 >= n2 || n1 <= 0 || n2 <= 0 || n1 > array.length || n2 > array.length) { throw {
																							name: 'ValueError',
																							message: 'incorrect border values: low < ' + n1 + ' >, high < ' + n2 + ' >'
																						};
			}
			var sumSquares = 0;
			for(var i=n1-1; i<n2; i++) {
				sumSquares += array[i] * array[i];
			}
			return Math.sqrt(sumSquares);
		};
		//--------------------------------------------------------------










		//--------------------------------------------------------------
		var uniformDen = function(x, a, b) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || a >= b) { throw {
																													name: 'ValueError',
																													message: 'incorrect input values: x < ' + x + ' >, lower point < ' + a + ' >, higher point < ' + b + ' >'
																												};
			}
			if(x <= b && x >= a) return (1 / (b - a));
			return 0;
		};
		var uniformDist = function(x, a, b) {
			if(!globals.toolset.isNumber(x) || !globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || a >= b) { throw {
																													name: 'ValueError',
																													message: 'incorrect input values: x < ' + x + ' >, lower point < ' + a + ' >, higher point < ' + b + ' >'
																												};
			}
			if(x <= b && x >= a) return ((x - a) / (b - a));
			if(x > b) return 1;
			return 0;
		};
		//mx = (a + b) / 2; dx = (b - a) * (b - a) / 12; sigma = (b - a) / (2 * Math.sqrt(3)); me = (a + b) / 2; kurt = 9 / 5; ass = 0;
		//--------------------------------------------------------------
		//--------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		//Export functions
		globals.statistics.shellSort = shellSort;
		globals.statistics.insertionSort = insertionSort;
		globals.statistics.selectionSort = selectionSort;
		globals.statistics.mergeSort = mergeSort;
		globals.statistics.quicksortOptimized = quicksortOptimized;
		globals.statistics.quickSort = quickSort;
		globals.statistics.heapsort = heapsort;
		globals.statistics.sortInsertion = sortInsertion;
		globals.statistics.sort = sort;
	}
		
}(globals));