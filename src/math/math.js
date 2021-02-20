;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.math = globals.math || {};
//----------------------------------------------------------------------------------------------
	(function() {
			const sqrt = Math.sqrt,
				  atan2 = Math.atan2,
				  pow = Math.pow,
				  abs = Math.abs,
				  PiBy180 = Math.PI / 180,
				  PiBy180Inv = 180 / Math.PI,
				  PiBy2 = Math.PI / 2;
//----------------------------------------------------------------------------------------------
			const tabX = function(low, i, h) {
				return (low + i * h);
			};
			const tabUnevenX = function(low, high, i, n) {
				return (low + high + (high - low) * Math.cos((2 * i + 1) * Math.PI / (2 * n))) / 2;
			};
			const memoizer = function(memo, formula) {
				if(!globals.toolset.isArray(memo)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: initial array < ' + memo + ' >'
													};
				}
				if(!globals.toolset.isFunction(formula)) { throw {
															name: 'ValueError',
															message: 'incorrect formula function: function < ' + formula + ' >'
														};
				}
				var recur = function(n) {
					var result = memo[n];
					if(!globals.toolset.isNumber(result)) {
						result = formula(recur, n);
						memo[n] = result;
					}
					return result;
				};
				return recur;
			};
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.algebra = globals.math.algebra || {};
				(function() {
					//var res = sin(0, 100, 5, 1);
					//document.writeln("sinus: " + res);
					const sin = function(a, b, h, eps) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(h) || !globals.toolset.isNumber(eps)) { throw {
																																					name: 'ValueError',
																																					message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, step < ' + h + ' >, precision < ' + eps + ' >'
																																				};
						}
						//
						eps = (eps == null) ? 0.0001 : (globals.toolset.isNumber(eps) && eps > 0) ? eps : null;
						if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
						//
						var x, result = [];
						var sinx = function(x, eps) {
							var n=1, x2 = -x*x, snx = x, xn = x;
							while(Math.abs(xn) > eps) {
								n += 2.0;
								xn *= x2 / n / (n - 1);
								snx += xn;
							}
							return snx;
						};
						for(x=a; x<=b; x+=h) {
							result.push(sinx(x, eps));
						}
						return result;
					};
//----------------------------------------------------------------------------------------------
					//document.writeln('<br>');
					//document.writeln('Math.sin: ' + Math.sin(5));
					//document.writeln('<br>');
					//document.writeln('var sin: ' + var sin(5, 2));
					const sin2 = function(x, n) {
						if(!globals.toolset.isNumber(x)) { throw {
															name: 'ValueError',
															message: 'incorrect input values: x < ' + x + ' >'
														};
						}
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						var q = x;
						for(i=0; i<n; i++) {
							s += q;
							q *= (-1) * x * x / (2 * i) / (2 * i + 1);
						}
						return s;
					};
//----------------------------------------------------------------------------------------------
					const sin3 = function(x, e, n, eps) {
						if(!globals.toolset.isNumber(x) || !globals.toolset.isRealNumber(e) || e <= 0 || e >= 1) { throw {
																												name: 'ValueError',
																												message: 'incorrect input values: x < ' + x + ' >, precision < ' + e + ' >'
																											};
						}
						//
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						eps = (eps == null) ? 0.0001 : (globals.toolset.isNumber(eps) && eps > 0) ? eps : null;
						if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
						//
						var r = s = x; i = 1;
						while(Math.abs(r) > eps && i <= n) {
							r *= (-1) * x * x / (2 * i) / (2 * i + 1);
							s += r;
							i++;
						}
						if(i <= n) return s;
						return null;
					};
//----------------------------------------------------------------------------------------------
					const cos = function(x, e, n, eps) {
						if(!globals.toolset.isNumber(x) || !globals.toolset.isRealNumber(e) || e <= 0 || e >= 1) { throw {
																												name: 'ValueError',
																												message: 'incorrect input values: x < ' + x + ' >, precision < ' + e + ' >'
																											};
						}
						//
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						eps = (eps == null) ? 0.0001 : (globals.toolset.isNumber(eps) && eps > 0) ? eps : null;
						if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
						//
						var r = s = 1; i = 1;
						while(Math.abs(r) > eps && i <= n) {
							r *= (-1) * x * x / (2 * i * (2 * i - 1));
							s += r;
							i++;
						}
						if(i <= n) return s;
						return null;
					};
//----------------------------------------------------------------------------------------------
					//document.writeln(globals.toolset.quarterPI());
					const quarterPI = function(n) {
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						var sum = 0;
						for(var i=n; i>0; i--) {
							x = 1 / ( 2 * i - 1);
							if(i % 2 === 0) x = -x;
							sum += x;
						}
						return sum;
					};
//----------------------------------------------------------------------------------------------
					const fibonacci = memoizer([0, 1], function(recur, n) {
						return recur(n - 1 + recur(n - 2));
					});
//----------------------------------------------------------------------------------------------
					const fibonacci2 = (function() {
						var memo = [0, 1];
						var fib = function(n) {
							var result = memo[n];
							if(!globals.toolset.isNumber(result)) {
								result = fib(n - 1) + fib(n - 2);
								memo[n] = result;
							}
							return result;
						};
						return fib;
					}());
//----------------------------------------------------------------------------------------------
					const factorial = memoizer([1, 1], function(recur, n) {
						return n * recur(n - 1);
					});
//----------------------------------------------------------------------------------------------
					const factorial2 = function(n) {
						if(!globals.toolset.isIntNumber(n) || n < 0) { throw {
																		name: 'ValueError',
																		message: 'incorrect input parameter: factorial (n!) < ' + n + ' >'
																	};
						}
						var val = 1;
						for(var i=n; i>1; i--) {
							var *= i;
						}
						return val;
					};
//----------------------------------------------------------------------------------------------
					const factorial3 = function(n) {
						if(!globals.toolset.isIntNumber(n) || n < 0) { throw {
																		name: 'ValueError',
																		message: 'incorrect input parameters: start node < ' + start + ' >, end node < ' + end + ' >'
																};
						}
						var doAllFactorials = function(n, results, level) {
							if(n > 1) {
								results[level] = n * doAllFactorials(n - 1, results, level + 1);
								return results[level];
							} else {
								results[level] = 1;
								return 1;
							}
						};
						var results = globals.toolset.vector(n == 0 ? 1 : n);
						doAllFactorials(n, results, 0);
						return results;
					};
//----------------------------------------------------------------------------------------------
					const factorial4 = (function() {
						var _factorial = function _factorial(n, p = 1) {
							if(n <= 1) {
								return 1 * p;
							} else {
								let result = n * p;
								return _factorial(n - 1, result);
							}
						};
						return function(n) {
							return _factorial(n);
						};
					}());
//----------------------------------------------------------------------------------------------
					
//----------------------------------------------------------------------------------------------
					const geron = function(a, eps) {
						if(!globals.toolset.isNumber(a) || a < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: expression < ' + a + ' >'
																};
						}
						//
						eps = (eps == null) ? 0.0001 : (globals.toolset.isNumber(eps) && eps > 0) ? eps : null;
						if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
						//
						var rad = 1.0. z;
						do {
							z = rad;
							rad = (rad + a / rad) / 2; //rad = (rad + a / rad) >> 1;
						} while(Math.abs(z - rad) >= eps);
						return rad;
					};
//----------------------------------------------------------------------------------------------
					const sqrt32 = function(a) {
						if(!globals.toolset.isNumber(a) || a < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: expression < ' + a + ' >'
																};
						}
						var c = 0x8000, g = 0x8000;
						 for(;;) {  
							if(g*g > a)
								g ^= c;  
							c >>= 1;  
							if(c == 0)  
								return g;  
							g |= c;  
						}
					};
//----------------------------------------------------------------------------------------------
					//http://en.wikipedia.org/wiki/Hyperbolic_function
					const sinh = function(z, n) {
						if(!globals.toolset.isNumber(z)) { throw {
															name: 'ValueError',
															message: 'incorrect input value: z < ' + z + ' >'
														};
						}
						var s = q = z;
						//
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n >= 1) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						for(var i=1; i<=n; i++) {
							q *= z * z / (2 * i) / (2 * i + 1);
							s += q;
						}
						return s;
					};
//----------------------------------------------------------------------------------------------
					//http://en.wikipedia.org/wiki/Hyperbolic_function
					const cosh = function(z, n) {
						if(!globals.toolset.isNumber(z)) { throw {
															name: 'ValueError',
															message: 'incorrect input value: z < ' + z + ' >'
														};
						}
						var s = q = 1;
						//
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n >= 1) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						for(var i=1; i<=n; i++) {
							q *= z * z / (2 * i - 1) / (2 * i);
							s += q;
						}
						return s;
					};
//----------------------------------------------------------------------------------------------
					//var xx = getFuncMinimum(-0.3, 0.5, function(v) {
					//	return v * Math.pow(v - 1, 2) * Math.pow(v - 1, 3);
					///}, 1e-7);
					//document.writeln("var getFuncMinimum: " + xx.xmin + ' ' + xx.ymin);
					var getFuncMinimum = function(a, b, func, eps) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isFunction(func)) { throw {
																														name: 'ValueError',
																														message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, function < ' + func + ' >'
																													};
						}
						//
						eps = (eps == null) ? 0.0001 : (globals.toolset.isNumber(eps) && eps > 0) ? eps : null;
						if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
						//
						var x0 = a, h = (b - a) / 2, ymin, xmin, y, x;
						while(h >= eps) {
							ymin = Number.POSITIVE_INFINITY, x = x0;
							do {
								y = func(x);
								if(y < ymin) {
									ymin = y;
									xmin = x;
								}
								x += h;
							} while(y <= ymin || x <= b);
							x0 = xmin - h;
							h /= 2;
						}
						return {'xmin': xmin, 'ymin': ymin};
					};
//----------------------------------------------------------------------------------------------
					//var res = var permutation([1, 2, 3, 4]);
					//document.writeln("permutation: " + res);
					const permutation = function(str) {
						var permArr = [], usedChars = [];
						var permute = function permute(input) {
							var i, ch;
							for (i = 0; i < input.length; i++) {
								ch = input.splice(i, 1)[0];
								usedChars.push(ch);
								if (input.length == 0) {
									permArr.push(usedChars.slice());
								}
								permute(input);
								input.splice(i, 0, ch);
								usedChars.pop();
							}
						};
						if(!globals.toolset.isArray(str)) { throw {
															name: 'ValueError',
															message: 'incorrect input parameter: array < ' + str + ' >'
														};
						}
						permute(str);
						return permArr;
					};
//----------------------------------------------------------------------------------------------
					const exp = function(value, n) {
						if(!globals.toolset.isNumber(value)) { throw {
																name: 'ValueError',
																message: 'incorrect input values:  value< ' + value + ' >, number of iterations < ' + n + ' >'
														};
						}
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						var s = 1, q = value, i;
						for(i=1; i<=n; i++) {
							s += q;
							q = q * value / (i + 1);
						}
						return s;
					};
//----------------------------------------------------------------------------------------------
					//var res1 = var fourier(1, function(x) {return x*x});
					//var res2 = var fourier(2, function(x) {return x});
					//var res3 = var fourier(-3, function(x) {return x*x + x});
					//document.writeln("res1: " + res1 + " >> res2: " + res2 + ' >> res3: ' + res3);
					const fourier = function(x, func) {
						const N = 10000;
						const n = 100;
						var a = Array.vector(n, 0);
						var intCos = function(k, state) {
							var s = 0, h = (1 + state) * Math.PI / N, x = -Math.PI * state;
							for(var i=0; i<N; i++) {
								s += (func(x) * Math.cos(x * k) + func(x + h) * Math.cos((x + h) * k)) / 2;
								x += h;
							}
							s *= h * (2 - state);
							return s;
						};
						var makeCos = function(state) {
							state = state || false;
							for(var i=0; i<n; i++) {
								a[i] = intCos(i, state) / Math.PI;
							}
							a[0] /= 2;
						};
						var sumCos = function(x) {
							var s = 0;
							for(var i=0; i<n; i++) {
								s += a[i] * Math.cos(x * i);
							}
							return s;
						};
						var b = Array.vector(n, 0);
						var intSin = function(k, state) {
							var s = 0, h = (1 + state) * Math.PI / N, x = -Math.PI * state;
							for(var i=0; i<N; i++) {
								s += (func(x) * Math.sin(x * k) + func(x + h) * Math.sin((x + h) * k)) / 2;
								x += h;
							}
							s *= h * (2 - state);
							return s;
						};
						var makeSin = function(state) {
							state = state || false;
							for(var i=0; i<n; i++) {
								b[i] = intSin(i, state) / Math.PI;
							}
							b[0] = 0;
						};
						var sumSin = function(x) {
							var s = 0;
							for(var i=0; i<n; i++) {
								s += b[i] * Math.sin(x * i);
							}
							return s;
						};
						var makeCosSin = function(state) {
							state = state || false;
							makeCos(true);
							makeSin(true);
						};
						var sumCosSin = function(x) {
							return (sumCos(x) + sumSin(x));
						};
						if(!globals.toolset.isNumber(x) || !globals.toolset.isFunction(func)) { throw {
																							name: 'ValueError',
																							message: 'incorrect input values: x < ' + x + ' >, function < ' + func + ' >'
																						};
						}
						if(func(-1) === func(1)) {
							makeCos(x);
							return sumCos(x);
						} else {
							makeCosSin(x);
							return sumCosSin(x);
						}
					};
//----------------------------------------------------------------------------------------------
					//var arX = [], arY= [];
					//for(var i=0; i<9; i++) {
					//	arX.push(i);
					//	arY.push(i * (i - 9/3) * (i - 9 + 1) + 0.001 * (Math.random() % 100 - 50));
					//	document.writeln(' ' + arX[i] + ' > ' + arY[i]);
					///};
					//var res = var interpolation(9, 0.1, arX, arY);
					//document.writeln("interpolation: " + res);
					const interpolate = function(arrayX, arrayY, x, n) {
						if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY) || !globals.toolset.isNumber(x)) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >, x < ' + x + ' >'
																														};
						}
						var psi = function(i, z) {
							var tmp = 1;
							for(var j=0; j<i; j++) {
								tmp *= ((z - arrayX[j]) / (arrayX[i] - arrayX[j]));
							}
							for(var j=i+1; j<n; j++) {
								tmp *= ((z - arrayX[j]) / (arrayX[i] - arrayX[j]));
							}
							return tmp;
						};
						var lagr = function(z) {
							var s = 0;
							for(var i=0; i<n; i++) {
								s += arrayY[i] * psi(i, z);
							}
							return s;
						};
						//
						n = (n == null) ? 9 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						if(x < 0 || x > n) { throw {
												name: 'ValueError',
												message: 'incorrect input value: x < ' + x + ' > is out of range [0, ' + n + ']'
											};
						}
						return lagr(x);
					};
//----------------------------------------------------------------------------------------------
					//var res = globals.calcpolinom([1, -10, 27, -18], 0, 10);
					//document.writeln("<p>" + res + "</p>");
					// Метод Ньютона-Рафсона
					const polinom = function(array, init, n) {
						if(!globals.toolset.isArray(array) || !globals.toolset.isNumber(init)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values:  array < ' + array + ' >, initial value < ' + init + ' >'
																						};
						}
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						var b = [], f, df;
						for(var i=0; i<array.length; i++) {
							b.push((array.length - 1 - i) * array[i]);
						}
						for(var k=0; k<n; k++) {
							f = array[array.length - 1];
							df = 0;
							for(var i=1; i<array.length; i++) {
								f += array[array.length - 1 - i] * Math.pow(init, i);
								df += b[array.length - 1 - i] * Math.pow(init, i - 1);
							}
							init -= f / df;
						}
						return init;
					};
//----------------------------------------------------------------------------------------------
					//var res = var polinom2(f, 12, 20);
					//document.writeln("polinom2: " + res);
					//const f = function(x) {
					//	return x * x - 9 * x + 14;
					//};
					const polinom2 = function(func, init, n) {
						if(!globals.toolset.isNumber(init) || !globals.toolset.isFunction(func)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values:  initial value < ' + init + ' >, function < ' + func + ' >'
																							};
						}
						n = (n == null) ? 100 : (globals.toolset.isIntNumber(n) && n > 0) ? n : null;
						if(n == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + n + ' >'};
						//
						var x = init, df, h = 0.00001;
						df = (func(x + h) - func(x)) / h;
						for(var i=0; i<n; i++) {
							x = x - func(x) / df; //((func(x + h) - func(x)) / h)
						}
						return x;
					};
//----------------------------------------------------------------------------------------------
					//document.writeln("monteCarlo: " + var monteCarlo(2, 5));
					const monteCarlo = function(r, h, N) {
						if(!globals.toolset.isNumber(r) || !globals.toolset.isNumber(h)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values:  r < ' + r + ' >, h < ' + h + ' >'
																					};
						}
						N = (N == null) ? 150 : (globals.toolset.isIntNumber(N) && N > 0) ? N : null;
						if(N == null) throw {name: 'ValueError', mesage: 'incorrect \'number of iterations\' value: < ' + N + ' >'};
						//
						var n = 0;
						var v, v0 = 4 * r * r * (h + r);
						for(var i=0; i<=N; i++) {
							x = 2 * i * r / N - r;
							for(var j=0; j<=N; j++) {
								y = 2 * j * r / N - r;
								for(var k=0; k<=N; k++) {
									z = k * (h + r) / N;
									if(((Math.sqrt(x * x + y * y) / r <= z / h) && (z <= h)) || ((x * x + y * y + (z - h) * (z - h) <= r * r) && (z > h))) {
										n++;
									}
								}
							}
						}
						v = v0 * n / Math.pow(N+1, 3);
						return v;
					};
//----------------------------------------------------------------------------------------------
					const toRadians = function(x) {
						if(!globals.toolset.isNumber(x)) {
							throw globals.exception.typeException('TypeError', 'incorrect type of argument: degrees < ' + x + ' >');//new TypeError('');
						}
						return (x * PiBy180);
					};
//----------------------------------------------------------------------------------------------
					const toDegrees = function(x) {
						if(!globals.toolset.isNumber(x)) {
							throw globals.exception.typeException('TypeError', 'incorrect type of argument: radians < ' + x + ' >');//new TypeError('');
						}
						return (x * PiBy180Inv);
					};
//----------------------------------------------------------------------------------------------
					const isPrime = (function() {
						var _isPrime = function _isPrime(n) {
							if ((n & 1) == 0 || (n > 5 && n % 5 == 0)) return false;
							var max = Math.sqrt(n);
							if (max == Math.floor(max)) return false;

							var p = firstPrime, pn;
							while (p != null) {
								if ((pn = p.n) > max) return true;
								if (n % pn == 0) return false;
								p = p.p;
							}

							var divisor = lastPrime.n;
							while ((divisor += 2) <= max) {
								if (!_isPrime(divisor)) continue;
								lastPrime = lastPrime.setNext(divisor);
								if (divisor > max) return true;
								if (n % divisor == 0) return false;
							}
							return true;
						};
						
						return function(n) {
							return _isPrime(n);
						};
					}());
//----------------------------------------------------------------------------------------------
					globals.math.algebra.sin = sin;
					globals.math.algebra.cos = cos;
					globals.math.algebra.quarterPI = quarterPI;
					
					globals.math.algebra.fibonacci = fibonacci;
					globals.math.algebra.factorial = factorial;
					globals.math.algebra.geron = geron;
					globals.math.algebra.sqrt32 = sqrt32;
					
					globals.math.algebra.sinh = sinh;
					globals.math.algebra.cosh = cosh;
					globals.math.algebra.getFuncMinimum = getFuncMinimum;
					globals.math.algebra.permutation = permutation;
					globals.math.algebra.exp = exp;
					
					globals.math.algebra.fourier = fourier;
					globals.math.algebra.interpolate = interpolate;
					globals.math.algebra.polinom = polinom;
					globals.math.algebra.monteCarlo = monteCarlo;
					
					globals.math.algebra.toRadians = toRadians;
					globals.math.algebra.toDegrees = toDegrees;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.geometry = globals.math.geometry || {};
//----------------------------------------------------------------------------------------------
				const EARTH_RADIUS = 6371;
//----------------------------------------------------------------------------------------------
				  /**
				   * Intersection class
				   * @class fabric.Intersection
				   * @memberOf fabric
				   * @constructor
				   */
				  function Intersection(status) {
						this.status = status;
						this.points = [];
				  }
				  Intersection.prototype = {
						constructor: Intersection,
						/**
						 * Appends a point to intersection
						 * @param {fabric.Point} point
						 * @return {fabric.Intersection} thisArg
						 * @chainable
						 */
						appendPoint: function (point) {
							this.points.push(point);
							return this;
						},
						/**
						 * Appends points to intersection
						 * @param {Array} points
						 * @return {fabric.Intersection} thisArg
						 * @chainable
						 */
						appendPoints: function (points) {
							this.points = this.points.concat(points);
							return this;
						}
				  };
//----------------------------------------------------------------------------------------------
				(function() {
					//polygon = {arrayX: [-73,-33,7,-33], arrayY: [-85,-126,-85,-45]};
					//point = {x: -40, y: -60};
					const inPolygon = function(polygon, point) {
						if(!globals.toolset.isObject(polygon)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: <polygon> not an object < ' + polygon + ' >'
																};
						}
						if(!Object.prototype.hasOwnProperty.call(polygon, 'arrayX') || !Object.prototype.hasOwnProperty.call(polygon, 'arrayY') || !globals.toolset.isArray(polygon['arrayX']) || !globals.toolset.isArray(polygon['arrayY'])) {
																throw {
																	name: 'ValueError',
																	message: 'incorrect input value: <polygon> is invalid {\'arrayX\': array, \'arrayY\': array} < ' + polygon + ' >'
																};
						}
						if(polygon['arrayX'].length !== polygon['arrayY'].length) {
																throw {
																	name: 'ValueError',
																	message: 'incorrect input value: <polygon> length of <arrayX> is not equal to <arrayY> in < ' + polygon + ' >'
																};
						}
						if(!globals.toolset.isObject(point)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: <point> is not object < ' + point + ' >'
																};
						}
						if(!Object.prototype.hasOwnProperty.call(point, 'x') || !Object.prototype.hasOwnProperty.call(point, 'y') || !globals.toolset.isNumber(point['x']) || !globals.toolset.isNumber(point['arrayY'])) {
																throw {
																	name: 'ValueError',
																	message: 'incorrect input value: <point> is invalid {\'x\': number, \'y\': number} < ' + point + ' >'
																};
						}
						var c = false;
						for(var i=0, len=polygon['arrayX'].length, j=len-1; i<len; i++) {
							if ((((polygon['arrayY'][i] <= point['y']) && (point['y'] < polygon['arrayY'][j])) ||
								 ((polygon['arrayY'][j] <= point['y']) && (point['y'] < polygon['arrayY'][i]))) &&
								 (point['x'] > (polygon['arrayX'][j] - polygon['arrayX'][i]) * (point['y'] - polygon['arrayY'][i]) / (polygon['arrayY'][j] - polygon['arrayY'][i]) + polygon['arrayX'][i])) {
								c = !c;
							}
							j = i;
						}
						return c;
					};
//----------------------------------------------------------------------------------------------
					const getPlanetDistance = function(startCoords, destCoords) {
						var sphereDist = getSphericalDist(startCoords, destCoords);
						return (sphereDist * EARTH_RADIUS);
					};
//----------------------------------------------------------------------------------------------
					/* Сферический закон косинуса */
					const getSphericalDistance = function(startCoords, destCoords) {
						if(!globals.toolset.isObject(startCoords) || !globals.toolset.isObject(destCoords)) { throw {
																											name: 'ValueError',
																											message: 'incorrect initialization value: [not an object]'
																										};
						}
						if(!Object.prototype.hasOwnProperty.call(startCoords, 'latitude') || !Object.prototype.hasOwnProperty.call(startCoords, 'longitude') {
							throw {
									name: 'ValueError',
									message: 'incorrect initialization value \'start coordinates\': {\'latitude\': [number], \'longitude\': [number]}'
							};
						}
						if(!Object.prototype.hasOwnProperty.call(destCoords, 'latitude') || !Object.prototype.hasOwnProperty.call(destCoords, 'longitude') {
							throw {
									name: 'ValueError',
									message: 'incorrect initialization value \'destination coordinates\': {\'latitude\': [number], \'longitude\': [number]}'
							};
						}
						var startLatRads = globals.math.algebra.toRadians(startCoords.latitude), startLongRads = globals.math.algebra.toRadians(startCoords.longitude);
						var destLatRads = globals.math.algebra.toRadians(destCoords.latitude), destLongRads = globals.math.algebra.toRadians(destCoords.longitude);
						return Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads));
					};
//----------------------------------------------------------------------------------------------
					/* Найти ближайшую к заданной точке (широта, долгота) локацию */
					const findClosestLocation = function(coords, arrayOfCoords) {
						if(!globals.toolset.isArray(arrayOfCoords)) { throw {
																name: 'ValueError',
																message: 'incorrect array value: < ' + arrayOfCoords + ' >'
														};
						}
						var closestCoords;
						var minDist = Number.MAX_VALUE;
						for(var i=0; i<arrayOfCoords.length; i++) {
							var dist = var getSphericalDist(coords, arrayOfCoords[i]);
							if(dist < minDist) {
								closestCoords = arrayOfCoords[i];
								minDist = dist;
							}
						}
						return closestCoords;
					};
//----------------------------------------------------------------------------------------------
					const tabulate = function(low, high, num, func) {
						
						var point = function(x, y) {
							return { 'x': x, 'y': y };
						};
						
						if(!globals.toolset.isIntNumber(high) || num < 1) { throw {
																				name: 'TypeError',
																				message: 'incorrect input argument: {number of points} is not positive integer number < ' + num + ' >'
																		};
						}
						if(!globals.toolset.isFunction(func)) { throw {
																name: 'TypeError',
																message: 'incorrect input argument: not a function < ' + func + ' >'
															};
						}
						if(!globals.toolset.isNumber(low)) { throw {
																name: 'TypeError',
																message: 'incorrect input argument: {low} is not number < ' + low + ' >'
														};
						}
						if(!globals.toolset.isNumber(high)) { throw {
																name: 'TypeError',
																message: 'incorrect input argument: {high} is not number < ' + high + ' >'
														};
						}
						if(low > high) low = [high, high = low][0];
						var h = Math.floor((high - low) / (num - 1));
						var x = null, y = null, res = globals.toolser.vector();
						for(var i=1; i<=num; i++) {
							x = low + (i - 1) * h;
							y = func(x);
							res.push(point(x, y));
						}
						return res;
					};
//----------------------------------------------------------------------------------------------
					//Перевод географических координат (широты и долготы) точки в прямоугольные координаты
					//проекции Гаусса-Крюгера
					//Географические координаты точки (в градусах)
					/* point = {
					*			lon: 37.618, Долгота (положительная для восточного полушария)
					*			lat: 55.752  Широта (положительная для северного полушария)
					*		}
					*/
					const toCartesianCoords = (function() {
						//Параметры эллипсоида Красовского
						const a = 6378245.0;											# Большая (экваториальная) полуось
						const b = 6356863.019;											# Малая (полярная) полуось
						const e2 = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2);	# Эксцентриситет
						const n = (a - b) / (a + b);									# Приплюснутость
						
						return function(point) {
							if(!globals.toolset.isObject(point)) { throw {
																		name: 'ValueError',
																		message: 'incorrect input value: <point> not an object < ' + point + ' >'
																	};
							}
							if(!Object.prototype.hasOwnProperty.call(point, 'lon') || !Object.prototype.hasOwnProperty.call(point, 'lat')) {
																	throw {
																		name: 'ValueError',
																		message: 'incorrect input value: <point> is invalid {\'lon\': number, \'lat\': number} < ' + point + ' >'
																	};
							}
							if(!globals.toolset.isNumber(point['lon']) || !globals.toolset.isArray(point['lat']) {
								throw {
									name: 'ValueError',
									message: 'incorrect type value: not a number {\'lon\': ' + point['lon'] + ', \'lat\': ' + point['lat'] + '}'
								};
							}
							
							//Номер зоны Гаусса-Крюгера (если точка рассматривается в системе
							//координат соседней зоны, то номер зоны следует присвоить вручную)
							var zone = (point['lon']/6 + 1).integer();
							
							//Параметры зоны Гаусса-Крюгера
							var F = 1.0;                  				# Масштабный коэффициент
							var Lat0 = 0.0;                				# Начальная параллель (в радианах)
							var Lon0 = (zone * 6 - 3) * Math.PI / 180;  	# Центральный меридиан (в радианах)
							var N0 = 0.0;                  				# Условное северное смещение для начальной параллели
							var E0 = zone * 1e6 + 500000.0;    			# Условное восточное смещение для центрального меридиана
							
							//Перевод широты и долготы в радианы
							var Lat = globals.math.algebra.toRadians(point['lat']);
							var Lon = globals.math.algebra.toRadians(point['lon']);
							
							//Вычисление переменных для преобразования
							var v = a * F * Math.pow(1 - e2 * (Math.pow(Math.sin(Lat), 2)), -0.5);
							var p = a * F * (1 - e2) * Math.pow(1 - e2 * (Math.pow(Math.sin(Lat), 2)), -1.5);
							var n2 = v / p - 1;
							var M1 = (1 + n + 5/4 * Math.pow(n, 2) + 5/4 * Math.pow(n, 3)) * (Lat - Lat0);
							var M2 = (3 * n + 3 * Math.pow(n, 2) + 21/8 * Math.pow(n, 3)) * Math.sin(Lat - Lat0) * Math.cos(Lat + Lat0);
							var M3 = (15/8 * Math.pow(n, 2) + 15/8 * Math.pow(n, 3)) * Math.sin(2 * (Lat-Lat0)) * Math.cos(2 * (Lat + Lat0));
							var M4 = 35/24 * Math.pow(n, 3) * Math.sin(3 * (Lat-Lat0)) * Math.cos(3 * (Lat + Lat0));
							var M = b * F * (M1 - M2 + M3 - M4);
							var I = M + N0;
							var II = v / 2 * Math.sin(Lat) * Math.cos(Lat);
							var III = v / 24 * Math.sin(Lat) * Math.pow(Math.(cos(Lat)), 3) * (5 - (Math.pow(Math.tan(Lat), 2)) + 9 * n2);
							var IIIA = v / 720 * Math.sin(Lat) * (Math.pow(Math.cos(Lat), 5)) * (61 - 58 * (Math.pow(Math.tan(Lat), 2)) + (Math.pow(Math.tan(Lat), 4)));
							var IV = v * Math.cos(Lat);
							var V = v / 6 * (Math.pow(Math.cos(Lat), 3)) * (v / p - (Math.pow(Math.tan(Lat), 2)));
							var VI = v / 120 * (Math.pow(Math.cos(Lat), 5)) * (5 - 18 * (Math.pow(Math.tan(Lat), 2)) + (Math.pow(Math.tan(Lat), 4)) + 14 * n2 - 58 * (Math.pow(Math.tan(Lat), 2)) * n2);
							
							//Вычисление северного и восточного смещения (в метрах)
							var N = I + II * Math.pow((Lon - Lon0), 2) + III * Math.pow((Lon - Lon0), 4) + IIIA * Math.pow((Lon - Lon0), 6);
							var E = E0 + IV * (Lon - Lon0) + V * Math.pow((Lon-Lon0), 3) + VI * Math.pow((Lon - Lon0), 5);
							
							return {'north': N; 'east': E};
						};
					}());
//----------------------------------------------------------------------------------------------
				  /**
				   * Checks if one line intersects another
				   * TODO: rename in intersectSegmentSegment
				   * @static
				   * @param {fabric.Point} a1
				   * @param {fabric.Point} a2
				   * @param {fabric.Point} b1
				   * @param {fabric.Point} b2
				   * @return {fabric.Intersection}
				   */
				  const intersectLineLine = function (a1, a2, b1, b2) {
					var result,
						uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
						ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
						uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
					if (uB !== 0) {
					  var ua = uaT / uB,
						  ub = ubT / uB;
					  if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
						result = new Intersection('Intersection');
						result.appendPoint(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
					  }
					  else {
						result = new Intersection();
					  }
					}
					else {
					  if (uaT === 0 || ubT === 0) {
						result = new Intersection('Coincident');
					  }
					  else {
						result = new Intersection('Parallel');
					  }
					}
					return result;
				  };
//----------------------------------------------------------------------------------------------
				  /**
				   * Checks if line intersects polygon
				   * TODO: rename in intersectSegmentPolygon
				   * fix detection of coincident
				   * @static
				   * @param {fabric.Point} a1
				   * @param {fabric.Point} a2
				   * @param {Array} points
				   * @return {fabric.Intersection}
				   */
				  const intersectLinePolygon = function(a1, a2, points) {
					var result = new Intersection(),
						length = points.length,
						b1, b2, inter, i;

					for (i = 0; i < length; i++) {
					  b1 = points[i];
					  b2 = points[(i + 1) % length];
					  inter = Intersection.intersectLineLine(a1, a2, b1, b2);

					  result.appendPoints(inter.points);
					}
					if (result.points.length > 0) {
					  result.status = 'Intersection';
					}
					return result;
				  };
//----------------------------------------------------------------------------------------------
				  /**
				   * Checks if polygon intersects another polygon
				   * @static
				   * @param {Array} points1
				   * @param {Array} points2
				   * @return {fabric.Intersection}
				   */
				  const intersectPolygonPolygon = function (points1, points2) {
					var result = new Intersection(),
						length = points1.length, i;

					for (i = 0; i < length; i++) {
					  var a1 = points1[i],
						  a2 = points1[(i + 1) % length],
						  inter = Intersection.intersectLinePolygon(a1, a2, points2);

					  result.appendPoints(inter.points);
					}
					if (result.points.length > 0) {
					  result.status = 'Intersection';
					}
					return result;
				  };
//----------------------------------------------------------------------------------------------
				  /**
				   * Checks if polygon intersects rectangle
				   * @static
				   * @param {Array} points
				   * @param {fabric.Point} r1
				   * @param {fabric.Point} r2
				   * @return {fabric.Intersection}
				   */
				  const intersectPolygonRectangle = function (points, r1, r2) {
					var min = r1.min(r2),
						max = r1.max(r2),
						topRight = new fabric.Point(max.x, min.y),
						bottomLeft = new fabric.Point(min.x, max.y),
						inter1 = Intersection.intersectLinePolygon(min, topRight, points),
						inter2 = Intersection.intersectLinePolygon(topRight, max, points),
						inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points),
						inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points),
						result = new Intersection();

					result.appendPoints(inter1.points);
					result.appendPoints(inter2.points);
					result.appendPoints(inter3.points);
					result.appendPoints(inter4.points);

					if (result.points.length > 0) {
					  result.status = 'Intersection';
					}
					return result;
				  };
//----------------------------------------------------------------------------------------------
					globals.math.geometry.inPolygon = inPolygon;
					globals.math.geometry.getPlanetDistance = getPlanetDistance;
					globals.math.geometry.getSphericalDistance = getSphericalDistance;
					globals.math.geometry.findClosestLocation = findClosestLocation;
					globals.math.geometry.tabulate = tabulate;
					globals.math.geometry.toCartesianCoords = toCartesianCoords;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.distance = globals.math.distance || {};
				(function() {
					// Hamming distance
					var hammingDistance = function(a, b) {
						if(!globals.toolset.isString(a) || !globals.toolset.isString(b)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values: string1 < ' + a + ' >, string2 < ' + b + ' >'
																							};
						}
						if (!a.length) return b.length;
						if (!b.length) return a.length;

						return Math.min(arguments.callee(s.substr(1), t) + 1,
										arguments.callee(t.substr(1), s) + 1,
										arguments.callee(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)) + 1;
					};
					
					//var myLDistance = var levenshteinDistance("слон", "море");
					/*number of operations to get <b> from <a>*/
					const levenshteinDistance = function(a, b) {
						if(!globals.toolset.isString(a) || !globals.toolset.isString(b)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: string1 < ' + a + ' >, string2 < ' + b + ' >'
																					};
						}
						var d = Array.matrix(a.length + 1, b.length + 1, 0), cost;
						for(var i=0; i<=a.length; i++) {
							d[i][0] = i;
						}
						for(var j=0; j<=b.length; j++) {
							d[0][j] = j;
						}
						for(var i=1; i<=a.length; i++) {
							for(var j=1; j<=b.length; j++) {
								if(a.charAt(i-1) == b.charAt(j-1)) {
									cost = 0;
								} else {
									cost = 1;
								}
								d[i][j] = Math.min(d[i-1, j] + 1/*insert*/, d[i, j-1] + 1/*delete*/, d[i-1, j-1] + cost/*replace*/);
							}
						}
						return d;
					};
//----------------------------------------------------------------------------------------------
					const levenshteinDistance2 = function(a, b, ins, del, sub) {
						if(!globals.toolset.isString(a) || !globals.toolset.isString(b)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: string1 < ' + a + ' >, string2 < ' + b + ' >'
																					};
						}
						if(a.length === 0 || b.length === 0) return;
						ins = (ins == null) ? 2 : (globals.toolset.isNumber(ins) && ins >= 0) ? ins : null;
						if(ins == null) throw {name: 'ValueError', message: 'incorrect ins value: < ' + ins + ' >'};
						//
						del = (del == null) ? 2 : (globals.toolset.isNumber(del) && del >= 0) ? del : null;
						if(del == null) throw {name: 'ValueError', message: 'incorrect del value: < ' + del + ' >'};
						//
						sub = (sub == null) ? 1 : (globals.toolset.isNumber(sub) && sub >= 0) ? sub : null;
						if(sub == null) throw {name: 'ValueError', message: 'incorrect sub value: < ' + sub + ' >'};
						//
						var d = globals.toolset.matrix(b.length + 1, a.length + 1, 0);
						for(var i=0; i<=a.length; i++) {
							d[0][i] = i * ins;
						}
						for(var j=1; j<=b.length; j++) {
							d[j][0] = j * del;
						}
						for(var i=1; i<=b.length; i++) {
							for(var j=1; j<=a.length; j++) {
								d[i][j] = Math.min(d[i-1][j-1] + (a[j-1] === b[i-1] ? 0 : sub), d[i][j-1] + ins, d[i-1][j] * del);//Math.min(d[i-1, j] + 1/*insert*/, d[i, j-1] + 1/*delete*/, d[i-1, j-1] + cost/*replace*/);
							}
						}
						return d[b.length][a.length];
					};
//----------------------------------------------------------------------------------------------
					/**
					 * @param {string} s1 Исходная строка
					 * @param {string} s2 Сравниваемая строка
					 * @param {object} [costs] Веса операций { [replace], [replaceCase], [insert], [remove] }
					 * @return {number} Расстояние Левенштейна
					 */
					const levenshteinDistance3 = function(s1, s2, costs) {
						if(!globals.toolset.isString(s1) || !globals.toolset.isString(s2)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values: string1 < ' + s1 + ' >, string2 < ' + s2 + ' >'
																							};
						}
						var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
						l1 = s1.length;
						l2 = s2.length;

						costs = costs || {};
						var cr = costs.replace || 1;
						var cri = costs.replaceCase || costs.replace || 1;
						var ci = costs.insert || 1;
						var cd = costs.remove || 1;

						cutHalf = flip = Math.max(l1, l2);

						var minCost = Math.min(cd, ci, cr);
						var minD = Math.max(minCost, (l1 - l2) * cd);
						var minI = Math.max(minCost, (l2 - l1) * ci);
						var buf = new Array((cutHalf * 2) - 1);

						for (i = 0; i <= l2; ++i) {
							buf[i] = i * minD;
						}

						for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
							ch = s1[i];
							chl = ch.toLowerCase();

							buf[flip] = (i + 1) * minI;

							ii = flip;
							ii2 = cutHalf - flip;

							for (j = 0; j < l2; ++j, ++ii, ++ii2) {
								cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
								buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
							}
						}
						return buf[l2 + cutHalf - flip];
					};
//----------------------------------------------------------------------------------------------
					const levenshteinDistanceWeighted = function(seq1, seq2, weighter) {
						if(!globals.toolset.isString(seq1) || !globals.toolset.isString(seq2)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values: string1 < ' + seq1 + ' >, string2 < ' + seq2 + ' >'
																							};
						}
						var len1 = seq1.length, len2=seq2.length;
						var dist = 0;
						var column = globals.toolset.vector();

						weighter = weighter ||  {
													'insert': function(c) { return 1.0; },
													'delete': function(c) { return 0.5; },
													'replace': function(c, d) { return 0.3; }
												};

						/* don't swap the sequences, or this is gonna be painful */
						if (len1 == 0 || len2 == 0) {
							while (len1)
								dist += weighter['delete'](seq1[--len1]);
							while (len2)
								dist += weighter.['insert'](seq2[--len2]);
							return dist;
						}

						column[0] = 0;
						for (var j = 1; j <= len2; ++j)
							column[j] = column[j - 1] + weighter['insert'](seq2[j - 1]);

						var ic, dc, rc, last, old;
						for (var i = 1; i <= len1; ++i) {
							last = column[0]; /* m[i-1][0] */
							column[0] += weighter['delete'](seq1[i - 1]); /* m[i][0] */
							for (var j = 1; j <= len2; ++j) {
								old = column[j];
								if (seq1[i - 1] == seq2[j - 1]) {
									column[j] = last; /* m[i-1][j-1] */
								} else {
									ic = column[j - 1] + weighter['insert'](seq2[j - 1]);      /* m[i][j-1] */
									dc = column[j] + weighter['delete'](seq1[i - 1]);          /* m[i-1][j] */
									rc = last + weighter['replace'](seq1[i - 1], seq2[j - 1]); /* m[i-1][j-1] */
									column[j] = ic < dc ? ic : (dc < rc ? dc : rc);
								}
								last = old;
							}
						}

						dist = column[len2];
						return dist;
					};
//----------------------------------------------------------------------------------------------
					globals.math.distance.hammingDistance = hammingDistance;
					globals.math.distance.levenshteinDistance = levenshteinDistance;
					globals.math.distance.levenshteinDistance2 = levenshteinDistance2;
					globals.math.distance.levenshteinDistance3 = levenshteinDistance3;
					globals.math.distance.levenshteinDistanceWeighted = levenshteinDistanceWeighted;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.iteration = globals.math.iteration || {};
//----------------------------------------------------------------------------------------------
				(function() {
					//Метод касательных (метод Ньютона)
					const newton = function(x0, x, e, func1, func2) {
						if(!globals.toolset.isNumber(x0) || !globals.toolset.isNumber(x) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func1) || !globals.toolset.isFunction(func2)) { throw {
																																															name: 'ValueError',
																																															message: 'incorrect input values: x0 < ' + x0 + ' >, x < ' + x + ' >, x < ' + x + ' >, precision < ' + e + ' >, function1 < ' + func1 + ' >, function2 < ' + func2 + ' >'
																																														};
						}
						var y, n = 0;
						do {
							x0 = x;
							x = x0 - func1(x0) / func2(x0);
							n++;
						} while(Math.abs(x0 - x) > e);
						return n;
					};
//----------------------------------------------------------------------------------------------
					//метод хорд
					const xord = function(a, b, x, e, func) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(x) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																													name: 'ValueError',
																																													message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, x < ' + x + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																												};
						}
						var fa = func(a), fb = func(b), fx, x0 = x, n = 0;
						if(func(a) * func(b) > 0) return;
						x = a - fa * (b - a) / (fb - fa);
						do {
							n++;
							x0 = x;
							fx = func(x);
							if(fx * fb < 0) {
								a = x;
								fa = fx;
								x = a - fa * (b - a) / (fb - fa);
							}
							if(fx * fa < 0) {
								b = x;
								fb = fx;
								x = b - fb * (b - a) / (fb - fa);
							}
						} while(Math.abs(x0 - x) > e);
						return n;
					};
//----------------------------------------------------------------------------------------------
					//метод простой итерации
					const simple = function(x0, x, e, func) {
						if(!globals.toolset.isNumber(x0) || !globals.toolset.isNumber(x) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: x0 < ' + x0 + ' >, x < ' + x + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																					};
						}
						var n = 0, x;
						do {
							x = func(x0 = x);
							n++;
						} while(Math.abs(x0 - x) > e && n < 32000);
						return n;
					};
//----------------------------------------------------------------------------------------------
					//var xx = var hdiv(-17, 17, 1, function(v) {
					//	return v * v * v;
					//});
					//метод половинного деления
					const hdiv = function(a, b, e, func) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																					};
						}
						var n = 0, x, y;
						if(func(a) * func(b) > 0) return;
						while(Math.abs(a-b) / 2 > e) {
							x = (a + b) / 2;
							n++;
							y = func(x);
							if(y === 0) break;
							if(func(a) * y < 0) {
								b = x;
							} else {
								a = x;
							}
						}
						return x;
						//x = (a + b) / 2;
						//return n;
					};
//----------------------------------------------------------------------------------------------
					globals.math.iteration.newton = newton;
					globals.math.iteration.xord = xord;
					globals.math.iteration.simple = simple;
					globals.math.iteration.hdiv = hdiv;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.area = globals.math.area || {};
				(function() {
					const circleArea = function(radius) {
						if(!globals.toolset.isNumber(radius) || radius < 0) { throw {
																				name: 'ValueError',
																				message: 'incorrect radius value: radius < ' + radius + ' >'
																		};
						}
						return (Math.PI * radius * radius).toFixed(2);
					};
//----------------------------------------------------------------------------------------------
					const squareArea = function(a) {
						if(!globals.toolset.isNumber(a) || a < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect side value: side < ' + a + ' >'
																};
						}
						return (a * a).toFixed(2);
					};
//----------------------------------------------------------------------------------------------
					const rectangularArea = function(a, b) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || a < 0 || b < 0) { throw {
																											name: 'ValueError',
																											message: 'incorrect side values: a < ' + a + ' >, b < ' + b + ' >'
																									};
						}
						return (a * b).toFixed(2);
					};
//----------------------------------------------------------------------------------------------
					const triangleArea = function(a, b, c) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(c) || a < 0 || b < 0 || c < 0) { throw {
																																				name: 'ValueError',
																																				message: 'incorrect side values: a < ' + a + ' >, b < ' + b + ' >, c < ' + c + ' >'
																																			};
						}
						const s = (a + b + c) / 2;
						return (Math.sqrt(s * (s - a) * (s - b) * (s - c))).toFixed(2);
					};
//----------------------------------------------------------------------------------------------
					const trapeziumArea = function(a, b, h) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(h) || a < 0 || b < 0 || h < 0) { throw {
																																				name: 'ValueError',
																																				message: 'incorrect side values: a < ' + a + ' >, b < ' + b + ' >, height < ' + h + ' >'
																																			};
						}
						return ((a + b) * h / 2).toFixed(2);
					};
//----------------------------------------------------------------------------------------------
					globals.math.area.circleArea = circleArea;
					globals.math.area.squareArea = squareArea;
					globals.math.area.rectangularArea = rectangularArea;
					globals.math.area.triangleArea = triangleArea;
					globals.math.area.trapeziumArea = trapeziumArea;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.easing = globals.math.easing || {};
//----------------------------------------------------------------------------------------------
				(function() {
					/**
					 * Cubic easing in and out
					 * @memberOf fabric.util.ease
					 */
					const easeInOutCubic = function(t, b, c, d) {
						t /= d / 2;
						if (t < 1) {
						  return c / 2 * t * t * t + b;
						}
						return c / 2 * ((t -= 2) * t * t + 2) + b;
					};
//----------------------------------------------------------------------------------------------	
					/**
					* Quartic easing in
					* @memberOf fabric.util.ease
					*/
					const easeInQuart = function(t, b, c, d) {
						return c * (t /= d) * t * t * t + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Quartic easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutQuart = function(t, b, c, d) {
						return -c * ((t = t / d - 1) * t * t * t - 1) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Quartic easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutQuart = function(t, b, c, d) {
						t /= d / 2;
						if (t < 1) {
							return c / 2 * t * t * t * t + b;
						}
						return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Quintic easing in
					* @memberOf fabric.util.ease
					*/
					const easeInQuint = function(t, b, c, d) {
						return c * (t /= d) * t * t * t * t + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Quintic easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutQuint = function(t, b, c, d) {
						return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Quintic easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutQuint = function(t, b, c, d) {
						t /= d / 2;
						if (t < 1) {
							return c / 2 * t * t * t * t * t + b;
						}
						return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Sinusoidal easing in
					* @memberOf fabric.util.ease
					*/
					const easeInSine = function(t, b, c, d) {
						return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Sinusoidal easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutSine = function(t, b, c, d) {
						return c * Math.sin(t / d * (Math.PI / 2)) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Sinusoidal easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutSine = function(t, b, c, d) {
						return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Exponential easing in
					* @memberOf fabric.util.ease
					*/
					const easeInExpo = function(t, b, c, d) {
						return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Exponential easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutExpo = function(t, b, c, d) {
						return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Exponential easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutExpo = function(t, b, c, d) {
						if (t === 0) {
							return b;
						}
						if (t === d) {
							return b + c;
						}
						t /= d / 2;
						if (t < 1) {
							return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
						}
						return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Circular easing in
					* @memberOf fabric.util.ease
					*/
					const easeInCirc = function(t, b, c, d) {
						return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
					};
//----------------------------------------------------------------------------------------------
				  /**
				   * Circular easing out
				   * @memberOf fabric.util.ease
				   */
					const easeOutCirc = function(t, b, c, d) {
						return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
					};
//----------------------------------------------------------------------------------------------		
					/**
					* Circular easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutCirc = function(t, b, c, d) {
						t /= d / 2;
						if (t < 1) {
							return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
						}
						return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Elastic easing in
					* @memberOf fabric.util.ease
					*/
					const easeInElastic = function(t, b, c, d) {
						var s = 1.70158, p = 0, a = c;
						if (t === 0) {
							return b;
						}
						t /= d;
						if (t === 1) {
							return b + c;
						}
						if (!p) {
							p = d * 0.3;
						}
						var opts = normalize(a, c, p, s);
						return -elastic(opts, t, d) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Elastic easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutElastic = function(t, b, c, d) {
						var s = 1.70158, p = 0, a = c;
						if (t === 0) {
							return b;
						}
						t /= d;
						if (t === 1) {
							return b + c;
						}
						if (!p) {
							p = d * 0.3;
						}
						var opts = normalize(a, c, p, s);
						return opts.a * Math.pow(2, -10 * t) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p ) + opts.c + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Elastic easing in and out
					* @memberOf fabric.util.ease
					*/
					const easeInOutElastic = function(t, b, c, d) {
						var s = 1.70158, p = 0, a = c;
						if (t === 0) {
							return b;
						}
						t /= d / 2;
						if (t === 2) {
							return b + c;
						}
						if (!p) {
						  p = d * (0.3 * 1.5);
						}
						var opts = normalize(a, c, p, s);
						if (t < 1) {
							return -0.5 * elastic(opts, t, d) + b;
						}
						return opts.a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p ) * 0.5 + opts.c + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Backwards easing in
					* @memberOf fabric.util.ease
					*/
					const easeInBack = function(t, b, c, d, s) {
						if (s === undefined) {
							s = 1.70158;
						}
						return c * (t /= d) * t * ((s + 1) * t - s) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					* Backwards easing out
					* @memberOf fabric.util.ease
					*/
					const easeOutBack = function(t, b, c, d, s) {
						if (s === undefined) {
							s = 1.70158;
						}
						return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
					};
//----------------------------------------------------------------------------------------------
				  /**
				   * Backwards easing in and out
				   * @memberOf fabric.util.ease
				   */
					const easeInOutBack = function(t, b, c, d, s) {
						if (s === undefined) {
							s = 1.70158;
						}
						t /= d / 2;
						if (t < 1) {
							return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
						}
						return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
					};
//----------------------------------------------------------------------------------------------
				  /**
				   * Bouncing easing in
				   * @memberOf fabric.util.ease
				   */
					const easeInBounce = function(t, b, c, d) {
						return c - easeOutBounce (d - t, 0, c, d) + b;
					};
//----------------------------------------------------------------------------------------------
				  /**
				   * Bouncing easing out
				   * @memberOf fabric.util.ease
				   */
					const easeOutBounce = function(t, b, c, d) {
						if ((t /= d) < (1 / 2.75)) {
							return c * (7.5625 * t * t) + b;
						} else if (t < (2 / 2.75)) {
							return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
						} else if (t < (2.5 / 2.75)) {
							return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
						} else {
							return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
						}
					};
//----------------------------------------------------------------------------------------------
				  /**
				   * Bouncing easing in and out
				   * @memberOf fabric.util.ease
				   */
					const easeInOutBounce = function(t, b, c, d) {
						if (t < d / 2) {
							return easeInBounce (t * 2, 0, c, d) * 0.5 + b;
						}
						return easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
					};
					/**
//----------------------------------------------------------------------------------------------
					 * Quadratic easing in
					 * @memberOf fabric.util.ease
					 */
					const easeInQuad = function(t, b, c, d) {
						return c * (t /= d) * t + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					 * Quadratic easing out
					 * @memberOf fabric.util.ease
					 */
					const easeOutQuad = function(t, b, c, d) {
						return -c * (t /= d) * (t - 2) + b;
					};
//----------------------------------------------------------------------------------------------
					/**
					 * Quadratic easing in and out
					 * @memberOf fabric.util.ease
					 */
					const easeInOutQuad = function(t, b, c, d) {
						t /= (d / 2);
						if (t < 1) {
							return c / 2 * t * t + b;
						}
						return -c / 2 * ((--t) * (t - 2) - 1) + b;
					};
//----------------------------------------------------------------------------------------------
				   /**
					 * Cubic easing in
					 * @memberOf fabric.util.ease
					 */
					const easeInCubic = function(t, b, c, d) {
						return c * (t /= d) * t * t + b;
					};
//----------------------------------------------------------------------------------------------
					globals.math.easing.easeOutCubic = easeOutCubic;
					globals.math.easing.easeInOutCubic = easeInOutCubic;
					globals.math.easing.easeInQuart = easeInQuart;
					globals.math.easing.easeOutQuart = easeOutQuart;
					globals.math.easing.easeInOutQuart = easeInOutQuart;
					globals.math.easing.easeInQuint = easeInQuint;
					globals.math.easing.easeOutQuint = easeOutQuint;
					globals.math.easing.easeInOutQuint = easeInOutQuint;
					globals.math.easing.easeInSine = easeInSine;
					globals.math.easing.easeOutSine = easeOutSine;
					globals.math.easing.easeInOutSine = easeInOutSine;
					globals.math.easing.easeInExpo = easeInExpo;
					globals.math.easing.easeOutExpo = easeOutExpo;
					globals.math.easing.easeInOutExpo = easeInOutExpo;
					globals.math.easing.easeInCirc = easeInCirc;
					globals.math.easing.easeOutCirc = easeOutCirc;
					globals.math.easing.easeInOutCirc = easeInOutCirc;
					globals.math.easing.easeInElastic = easeInElastic;
					globals.math.easing.easeOutElastic = easeOutElastic;
					globals.math.easing.easeInOutElastic = easeInOutElastic;
					globals.math.easing.easeInBack = easeInBack;
					globals.math.easing.easeOutBack = easeOutBack;
					globals.math.easing.easeInOutBack = easeInOutBack;
					globals.math.easing.easeInBounce = easeInBounce;
					globals.math.easing.easeOutBounce = easeOutBounce;
					globals.math.easing.easeInOutBounce = easeInOutBounce;
				}());
			}());
//----------------------------------------------------------------------------------------------
			(function() {
				globals.math.integral = globals.math.integral || {};
				(function() {
					//Метод прямоугольников
					const squareIntegral = function(a, b, e, func) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																					};
						}
						var ynew = 0, yold, integ, n = 1;
						do {
							yold = ynew;
							integ = 0;
							n *= 2;
							h = (b - a) / n;
							//h /= 2;
							//формула левых прямоугольников
							for(var x=a; x<=b-h; x+=h) {
								integ += func(x);
							}
							//формула правых прямоугольников
							//for(var x=a+h; x<=b; x+=h) {
							//	integ += func(x);
							//}
							//формула средних прямоугольников
							//for(var x=a; x<=b-h; x+=h) {
							//	integ += func(x + h / 2);
							//}
							ynew = (integ *= h);
						} while(Math.abs(yold - ynew) > e);
						return ynew;
					};
//----------------------------------------------------------------------------------------------
					//метод трапеций
					const trapeziumIntegral = function(a, b, e, func) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																					};
						}
						var ynew = 0, yold, n = 1;
						do {
							yold = ynew;
							n *= 2;
							h = (b - a) / n;
							//h /= 2;
							ynew = func(a) + func(b);
							for(var x=a+h; x<b-h; x+=h) {
								ynew += 2 * func(x);
							}
							//ynew *= h;
							ynew *= (h / 2);
						} while(Math.abs(yold - ynew) > e);
						return ynew;
					};
//----------------------------------------------------------------------------------------------
					//метод Симпсона (парабол)
					const simpsonIntegral = function(a, b, e, func) {
						if(!globals.toolset.isNumber(a) || !globals.toolset.isNumber(b) || !globals.toolset.isNumber(e) || !globals.toolset.isFunction(func)) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: lower border < ' + a + ' >, upper border < ' + b + ' >, precision < ' + e + ' >, function < ' + func + ' >'
																																					};
						}
						var ynew = 0, yold, n = 1;
						do {
							yold = ynew;
							n *= 2;
							h = (b - a) / (2 * n);
							ynew = func(a) + func(b);
							for(var i=1; i<=2*n-1; i++) {
								ynew += (2 + 2 * (i % 2)) * func(a + i * h);
							}
							ynew *= (h / 3);
						} while(Math.abs(yold - ynew) > e);
						return ynew;
					};
//----------------------------------------------------------------------------------------------
					globals.math.integral.squareIntegral = squareIntegral;
					globals.math.integral.trapeziumIntegral = trapeziumIntegral;
					globals.math.integral.simpsonIntegral = simpsonIntegral;
				}());
			}());
	}());
//--------------------------------------------------------------------------------------------------------------
}(typeof exports !== 'undefined' ? exports : this));