jsar.misc = {};
//--------------------------------------------------------------
jsar.misc.cosec = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (1 / Math.sin(x));
};
jsar.misc.sec = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (1 / Math.cos(x));
};
//--------------------------------------------------------------
jsar.misc.sinh = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (Math.exp(x) - Math.exp(-x)) / 2;
};
jsar.misc.cosh = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (Math.exp(x) + Math.exp(-x)) / 2;
};
jsar.misc.tanh = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (jsar.toolset.sinh(x) / jsar.toolset.cosh(x));
};
jsar.misc.cotanh = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (1 / jsar.toolset.tanh(x));
};
jsar.misc.cosech = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (1 / jsar.toolset.sinh(x));
};
jsar.misc.sech = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return (1 / jsar.toolset.cosh(x));
};
//--------------------------------------------------------------
jsar.misc.arcsinh = function(x) {
	if(!jsar.toolset.isNumber(x)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: x < ' + x + ' >'
									};
	}
	return Math.log(x + Math.sqrt(x * x + 1));
};
jsar.misc.arccosh = function(x) {
	if(!jsar.toolset.isNumber(x) || x < 1) { throw {
												name: 'ValueError',
												message: 'incorrect input value: x < ' + x + ' >'
											};
	}
	return Math.log(x + Math.sqrt(x * x - 1));
};
jsar.misc.arctanh = function(x) {
	if(!jsar.toolset.isNumber(x) || Math.abs(x) >= 1 || Math.abs(x) < 0) { throw {
																			name: 'ValueError',
																			message: 'incorrect input value: x < ' + x + ' >'
																		};
	}
	return (1 / 2) * Math.log((1 + x) / (1 - x));
};
jsar.misc.arctanh = function(x) {
	if(!jsar.toolset.isNumber(x) || Math.abs(x) <= 1) { throw {
															name: 'ValueError',
															message: 'incorrect input value: x < ' + x + ' >'
														};
	}
	return (1 / 2) * Math.log((x + 1) / (x - 1));
};
jsar.misc.arccosech = function(x) {
	if(!jsar.toolset.isNumber(x) || x === 0) { throw {
												name: 'ValueError',
												message: 'incorrect input value: x < ' + x + ' >'
											};
	}
	var res = (x < 0) ? Math.log((1 / x) - Math.sqrt((1 / (x * x)) + 1)) : Math.log((1 / x) + Math.sqrt((1 / (x * x)) + 1))
	return res;
};
jsar.misc.arcsech = function(x) {
	if(!jsar.toolset.isNumber(x) || x > 1 || x <= 0) { throw {
															name: 'ValueError',
															message: 'incorrect input value: x < ' + x + ' >'
														};
	}
	return Math.log((1 / x) + Math.sqrt((1 / (x * x)) - 1));
};
//--------------------------------------------------------------
jsar.misc.summ = function(x, n, m, array) {
	if(!jsar.toolset.isNumber(x) || !jsar.toolset.isNumber(n) || !jsar.toolset.isNumber(m) || !jsar.toolset.isArray(array)) { throw {
																																	name: 'ValueError',
																																	message: 'incorrect input values: x < ' + x + ' >, power < ' + n + ' >, step < ' + m + ' >, array < ' + array + ' >'
																															};
	}
	if(array.length === 0) return;
	var sum = array[0] * Math.pow(x, n);
	for(var i=1; i<array.length; i++) {
		sum += array[i] * Math.pow(x, n + i * m);
	}
	return sum;
};
//--------------------------------------------------------------
jsar.misc.geomProgress = function(a, n) {
	if(!jsar.toolset.isNumber(a) || !jsar.toolset.isNumber(n) || a < 0 || a === 1 || n < 0) { throw {
																								name: 'ValueError',
																								message: 'incorrect input values: ratio < ' + a + ' >, n < ' + n + ' >'
																							};
	}
	return ((1 - Math.pow(a, n + 1)) / (1 - a));
};
//--------------------------------------------------------------
jsar.misc.residue = function(a, d) {
	if(!jsar.toolset.isNumber(a) || !jsar.toolset.isNumber(d)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: numerator < ' + a + ' >, denominator < ' + d + ' >'
																};
	}
	var t = a / d;
	t = (t >= 0) ? Math.floor(t) : Math.floor(t) - 1;
	return (a - d * t);
};
//--------------------------------------------------------------
jsar.misc.maxn = function(array, n) {
	if(!jsar.toolset.isArray(array) || !jsar.toolset.isIntNumber(n) || n < 1 || n > array.length) { throw {
																										name: 'ValueError',
																										message: 'incorrect input value: array < ' + array + ' >, n-th maximum < ' + n + ' >'
																									};
	}
	var arr = jsar.algorithms.shellsort(array).filter(function (e, i, c) {
															return c.indexOf(e) === i;
													});
	if(arr.length < n) return null;
	return arr[(arr.length - 1) - (n - 1)];
};
jsar.misc.minn = function(array, n) {
	if(!jsar.toolset.isArray(array) || !jsar.toolset.isIntNumber(n) || n < 1 || n > array.length) { throw {
																										name: 'ValueError',
																										message: 'incorrect input value: array < ' + array + ' >, n-th minimum < ' + n + ' >'
																									};
	}
	var arr = jsar.algorithms.shellsort(array).filter(function (e, i, c) {
															return c.indexOf(e) === i;
													});
	if(arr.length < n) return null;
	return arr[n - 1];
};
//--------------------------------------------------------------
jsar.misc.factfact = function(x) {
	if(!jsar.toolset.isIntNumber(x) || x < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input value: num < ' + x + ' >'
												};
	}
	var res = 1;
	if(x === 0 || x === 1) return res;
	for(var i=x; i>0; i-=2) {
		res *= i;
	}
	return res;
};
//--------------------------------------------------------------
jsar.misc.log10 = function(x) {
	if(!jsar.toolset.isNumber(x) || x <= 0) { throw {
												name: 'ValueError',
												message: 'incorrect input value: x < ' + x + ' >'
											};
	}
	return Math.log(x) / Math.LN10;
};
jsar.misc.log = function(x, a) {
	if(!jsar.toolset.isNumber(a) || !jsar.toolset.isNumber(x) || x <= 0 || a <= 0 || a === 1) { throw {
																									name: 'ValueError',
																									message: 'incorrect input values: base < ' + a + ' >, num < ' + x + ' >'
																								};
	}
	return Math.log(x) / Math.log(a);
};
//--------------------------------------------------------------
jsar.misc.pow = function(base, exponent) {
	if(!jsar.toolset.isNumber(base) || !jsar.toolset.isNumber(exponent)) { throw {
																			name: 'ValueError',
																			message: 'incorrect input values: base < ' + base + ' >, exponent < ' + exponent + ' >'
																		};
	}
	if(base === 0) return 0;
	if(base === 1) return 1;
	if(base === -1) return (((exponent % 2) === 0) ? 1 : -1);
	var result = 1;
	var flag = (exponent < 0) ? true : false;
	exponent = Math.abs(exponent);
	while(exponent > 0) {
		if(exponent % 2) result *= base;
		base *= base;
		exponent = Math.floor(exponent / 2);
	}
	return (flag) ? (1 / result) : result;
};
//document.writeln('Math.misc.pow() >> ' + Math.misc.pow(2, 3));
//--------------------------------------------------------------
jsar.misc.triangleSide = function(a, b) {
	if(!jsar.toolset.isNumber(a) || !Math.toolset.isNumber(b)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: a < ' + a + ' >, b < ' + b + ' >'
																};
	}
	var angleA = Math.atan(a / b), angleB = Math.atan(b / a), angleC = (Math.PI - angleA - angleB);
	//document.writeln("angleA: " + angleA * 180 / Math.PI + "; angleB: " + angleB * 180 / Math.PI + "; angleC: " + angleC * 180 / Math.PI);
	var c = Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angleC);
	return Math.sqrt(c);
};
//document.writeln('Math.misc.triangleSide: ' + Math.misc.triangleSide(3, 4));
//--------------------------------------------------------------
//[[x1, y1], [x2, y2], [x3, y3]]
jsar.misc.triangleSquare = function(array) {
	if(!jsar.toolset.isArray(array)) { throw {
											name: 'ValueError',
											message: 'incorrect array value: array < ' + array + ' >'
										};
	}
	return Math.abs((array[0][0] - array[2][0]) * (array[1][1] - array[2][1]) - (array[0][1] - array[2][1]) * (array[1][0] - array[2][0])) / 2;
};
//--------------------------------------------------------------
jsar.misc.isArmStrongNumber = function(num) {
	if(!jsar.toolset.isNumber(num)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: num < ' + num + ' >'
									};
	}
	var splitNum = [], res = 0;
	while(num > 0) {
		splitNum.push(num % 10);
		num = Math.floor(num / 10);
	}
	var pw = splitNum.length;
	for(var i=0; i<pw; i++) {
		res += Math.pow(splitNum[i], pw);
	}
	if(res !== num) {
		return false;
	}
	return true;
};
//--------------------------------------------------------------
jsar.misc.isLatinSquare = function(array) {
	if(!jsar.toolset.isArray(array)) { throw {
											name: 'ValueError',
											message: 'incorrect array value: < ' + arrray + ' >'
										};
	}
	var w = array.length ? array.length : 0, h = (array[0] && isArray(array[0])) ? array[0].length : 0;
	if(h === 0 || w === 0 || h !== w) { throw {
											name: 'MatrixSizeError',
											message: 'incorrect matrix size'
										};
	}
	for(var i=0; i<h; i++) {
		for(var j=0; j<h; j++) {
			if(array[i][j] < 1 || array[i][j] > w) {
				return false;
			}
		}
	}
	for(var i=0; i<h; i++) {
		for(var j=0; j<h; j++) {
			for(var k=j+1; k<h; k++) {
				if(array[i][j] === array[i][k]) {
					return false;
				}
			}
		}
	}
	for(var i=0; i<h; i++) {
		for(var j=0; j<h; j++) {
			for(var k=j+1; k<h; k++) {
				if(array[i][j] === array[k][j]) {
					return false;
				}
			}
		}
	}
};
//--------------------------------------------------------------
jsar.misc.denom = function(num) {
	if(!jsar.toolset.isIntNumber(num)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: num < ' + num + ' >'
									};
	}
	var i = 2, result = [], temp = num;
	while(temp > 1 && i <= num) {
		if(temp % i === 0) {
			result.push(i);
			temp /= i;
		}
		i++;
	}
	return result;
};
jsar.misc.denom = function(num) {
	if(!jsar.toolset.isIntNumber(num)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: num < ' + num + ' >'
									};
	}
	var i = 1, result = [];
	while(i <= num) {
		if(num % i === 0) {
			result.push(i);
		}
		i++;
	}
	return result;
};
//--------------------------------------------------------------
jsar.misc.sumNum = function(num) {
	if(!jsar.toolset.isNumber(num)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: num < ' + num + ' >'
									};
	}
	var sum = 0;
	num = Math.abs(num);
	while(num > 0) {
		sum += num % 10;
		num = Math.floor(num / 10);
	}
	return sum;
};
//--------------------------------------------------------------
jsar.misc.prefixAverages = function(array) {
	if(!jsar.toolset.isArray(array)) { throw {
											name: 'ValueError',
											message: 'incorrect array value: < ' + array + ' >'
										};
	}
	var sum = 0, result = null;
	for(var i=0; i<array.length; i++) {
		sum += array[i];
		result[i] = sum / (i+1);
	}
	return result;
};
//--------------------------------------------------------------
//Алгоритм Евклида
jsar.misc.gcd = function(i, j) {
	if(!jsar.toolset.isNumber(i) || !jsar.toolset.isNumber(j)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: x < ' + i + ' >, y < ' + j + ' >'
																};
	}
	i = Math.floor(Math.abs(i));
	j = Math.floor(Math.abs(j));
	while(i != j) {
		if(i > j) {
			i -= j;
		} else {
			j -= i;
		}
	}
	return i;
};
jsar.misc.gcd = function(i, j) {
	if(!jsar.toolset.isNumber(i) || !jsar.toolset.isNumber(j)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: x < ' + i + ' >, y < ' + j + ' >'
																};
	}
	var temp;
	i = Math.floor(Math.abs(i));
	j = Math.floor(Math.abs(j));
	while(j != 0) {
		temp = j;
		j = i % j;
		i = temp;
	}
	return i;
};
jsar.misc.gcd = function(x, y) {
	if(!jsar.toolset.isNumber(x) || !jsar.toolset.isNumber(y)) { throw {
																	name: 'ValueError',
																	message: 'incorrect input values: x < ' + x + ' >, y < ' + y + ' >'
																};
	}
	var temp, temp2 = 0;
	if(x === 0) return y;
	if(y === 0) return x;
	while(((x | y) & 1) === 0) {
		x >>= 1;
		y >>= 1;
		++temp2;
	}
	while((x & 1) === 0) x >>= 1;
	while(y) {
		while((y & 1) === 0) y >>= 1;
		temp = y;
		if(x > y) {
			y = x - y;
		} else {
			y = y - x;
		}
		x = temp;
	}
	return (x << temp2);
};
//var res = jsar.misc.gcd(7, 10);
//document.writeln('jsar.misc.gcd: ' + res);
//--------------------------------------------------------------
jsar.misc.scheduleMaker = function(array) {
	if(!jsar.toolset.isArray(array)) { throw {
											name: 'ValueError',
											message: 'incorrect array value: < ' + array + ' >'
										};
	}
	var it1, it2;
	for(var i=0; i<array.length-1; i++) {
		it1 = 0;
		it2 = array.length;
		document.writeln("Tour <" + (i+1) + " >");
		while(it1 != it2) {
			document.writeln("< " + array[it1++] + " > vs < " + array[--it2] + " >");
			//it1++;
			//it2--;
		}
		array.push(array.shift());
	}
};
//var teams = ['Spartak', 'Zenith', 'Lokomotiv', 'Rubin'];/*jsar.toolset.vector(7, "");*/
//var teamsModified = jsar.misc.scheduleMaker(teams);
//--------------------------------------------------------------
jsar.misc.crossLines = function(line1, line2) {
	if(!jsar.toolset.isObject(line1) || !jsar.toolset.isObject(line2)) { throw {
																			name: 'ValueError',
																			message: 'incorrect input values: line1 < ' + line1 + ' >, line2 < ' + line2 + ' >'
																		};
	}
	if(line1.a * line2.b == line1.b * line2.a) {
		if(line1.a * line2.c != line1.c * line2.a) {
			return 'parallel lines';
		} else {
			return 'coincided lines';
		}
	} else {
		var x0 = (line1.b * line2.c - line2.b * line1.c) / (line1.a * line2.b - line1.b * line2.a);
		var y0 = (line1.a * line2.c - line1.c * line2.a) / (line1.b * line2.a - line2.b * line1.a);
		return {'x0': x0, 'y0': y0};
	}
};
//--------------------------------------------------------------
jsar.misc.getEffectiveRate = function(nominalRate, periods) {
	if(!jsar.toolset.isNumber(nominalRate) || !jsar.toolset.isIntNumber(periods) || nominalRate <= 0 || periods <= 1) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: nominal rate < ' + nominalRate + ' >, number of periods < ' + periods + ' >'
																														};
	}
	return (Math.pow(1 + nominalRate / periods, periods) - 1);
};
jsar.misc.getNominalRate = function(effectiveRate, periods) {
	if(!jsar.toolset.isNumber(effectiveRate) || !jsar.toolset.isIntNumber(periods) || effectiveRate <= 0 || periods <= 1) { throw {
																															name: 'ValueError',
																															message: 'incorrect input values: effective rate < ' + effectiveRate + ' >, number of periods < ' + periods + ' >'
																														};
	}
	return (Math.pow(effectiveRate + 1, 1 / periods) - 1) * periods;
};
jsar.misc.getMonthlyPayment = function(s, n, p) {
	if(!jsar.toolset.isNumber(s) || !jsar.toolset.isIntNumber(n) || !jsar.toolset.isNumber(p) || s < 0 || n < 0 || p < 0) { throw {
																																name: 'ValueError',
																																message: 'incorrect input parameters: loan < ' + s + ' >, period (years) < ' + n + ' >, interest rate < ' + p + ' >'
																															};
	}
	var r = p / 100;
	return (s * r * Math.pow(1 + r, n) / (12 * (Math.pow(1 + r, n) - 1))).toFixed(3);
};
//document.writeln(jsar.misc.getMonthlyPayment(100000, 5, 20));
jsar.misc.getYearRate = function(s, n, m, eps) {
	if(!jsar.toolset.isNumber(s) || !jsar.toolset.isIntNumber(n) || !jsar.toolset.isNumber(m) || s < 0 || n < 0 || m < 0) { throw {
																																name: 'ValueError',
																																message: 'incorrect input parameters: loan < ' + s + ' >, period (years) < ' + n + ' >, monthly payment < ' + m + ' >'
																															};
	}
	eps = (eps == null) ? 1e-6 : (jsar.toolset.isNumber(eps) && eps > 0) ? eps : null;
	if(eps == null) throw {name: 'ValueError', mesage: 'incorrect \'precision\' value: < ' + eps + ' >'};
	//
	var r = 0.1;
	do {
		a = Math.exp(Math.log(1 + r) * n);
		m1 = s * r * a / (12 * (a - 1));
		r = r * m / m1;
	} while(Math.abs(m / m1 - 1) > eps);
	return (r * 100).toFixed(3);
};
//document.writeln(jsar.misc.getYearRate(100000, 5, 2000));
//--------------------------------------------------------------
jsar.misc.isTriangle = function(a, b, c) {
	if(!jsar.toolset.isNumber(a) || !jsar.toolset.isNumber(b) || !jsar.toolset.isNumber(c) || a < 0 || b < 0 || c < 0) { throw {
																														name: 'ValueError',
																														message: 'incorrect input parameters: a < ' + a + ' >, b < ' + b + ' >, c < ' + c + ' >'
																													};
	}
	if(jsar.toolset.doubleGreater(a + b, c) && jsar.toolset.doubleGreater(a + c, b) && jsar.toolset.doubleGreater(b + c, a)) return true;
	return false;
};
//document.writeln(jsar.misc.isTriangle(30, 30, 30));
//--------------------------------------------------------------
jsar.misc.getSingificancy = function(s, n, p) {
	var p = 1, n = 0, base = 10;
	do {
		n++;
		p /= base;
	} while(p);
	return (n - 1);
};
//document.writeln(jsar.misc.getSingificancy());
//--------------------------------------------------------------
jsar.misc.getComputerEpsilon = function() {
	var eps = 1;
	while(eps/2 + 1 > 1) {
		eps /= 2;
	}
	return eps;
};
//document.writeln(jsar.misc.getComputerEpsilon());
//--------------------------------------------------------------
jsar.toolset.getRomanNotation = function(num) {
	if(!jsar.toolset.isIntNumber(num) || num < 0) { throw {
														name: 'ValueError',
														message: 'incorrect input value: number < ' + num + ' >'
													};
	}
	var str = '';
	var props = {'M': 1000, 'IM': 999, 'VM': 995, 'XM': 990, 'LM': 950, 'CM': 900, 'D': 500, 'ID': 499, 'VD': 495, 'XD': 490, 'LD': 450, 'CD': 400, 'C': 100, 'IC': 99, 'VC': 95, 'XC': 90, 'L': 50, 'IL': 49, 'VL': 45, 'XL': 40, 'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1};
	var propNames = Object.getOwnPropertyNames(props);
	propNames.forEach(function(value) {
		while((num - props[value]) >= 0) {
			num = num - props[value];
			str += value;
		}
		//document.writeln(value + " -> " + props[value]);
	});
	return str;
};
//document.writeln(jsar.toolset.getRomanNotation(140));
//--------------------------------------------------------------
jsar.misc.getArabianNotation = function(str) {
	if(!jsar.toolset.isString(str)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: string < ' + str + ' >'
									};
	}
	var state = 1, ok = true, n = 0, symbol;
	for(var i=0; i<str.length; i++) {
		symbol = str[i];
		switch(state) {
			case 1:
				switch(symbol) {
					case 'X':
						n = 10;
						state = 2;
						break;
					case 'V':
						n = 5;
						state = 3;
						break;
					case 'I':
						n = 1;
						state = 6;
						break;
				}
				break;
			case 2:
				switch(symbol) {
					case 'X':
						n += 10;
						state = 2;
						break;
					case 'V':
						n += 5;
						state = 3;
						break;
					case 'I':
						n += 1;
						state = 6;
						break;
				}
				break;
			case 3:
				switch(symbol) {
					case 'X':
					case 'V':
						ok = false;
						break;
					case 'I':
						n += 1;
						state = 4;
						break;
				}
				break;
			case 4:
				switch(symbol) {
					case 'X':
					case 'V':
						ok = false;
						break;
					case 'I':
						n += 1;
						state = 5;
						break;
				}
				break;
			case 5:
				switch(symbol) {
					case 'X':
					case 'V':
						ok = false;
						break;
					case 'I':
						n += 1;
						state = 7;
						break;
				}
				break;
			case 6:
				switch(symbol) {
					case 'X':
						n += 8;
						state = 7;
						break;
					case 'V':
						n += 3;
						state = 7;
						break;
					case 'I':
						n += 1;
						state = 5;
						break;
				}
				break;
			case 7:
				ok = false;
				break;
		}
	}
	if(ok) return n;
	return 0;
};
//document.writeln(jsar.misc.getArabianNotation('XII'));
//--------------------------------------------------------------
// oxoxo + axaxa = axaxax;
jsar.misc.getPuzzleSolution = function() {
	for(var o=1; o<9; o++) {
		for(var a=1; a<9; a++) {
			for(var x=0; x<9; x++) {
				ox = o * 10101 + x * 1010;
				ax = a * 10101 + x * 1010;
				if((ox + ax) === (a * 101010 + x * 101010)) {
					return (ox + ax);
				}
			}
		}
	}
};
//--------------------------------------------------------------
jsar.misc.isPerfectNumber = function(num) {
	if(!jsar.toolset.isIntNumber(num) || num < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + num + ' >'
												};
	}
	var m = 0;
	for(var j=1; j<num; j++) {
		if(num % j === 0) m += j;
	}
	if(num === m) return true;
	return false;
};
//document.writeln(jsar.misc.isPerfectNumber(6));//6,28,496,8128
//--------------------------------------------------------------
jsar.misc.isSimpleNumber = function(num) {
	if(!jsar.toolset.isIntNumber(num) || num < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + num + ' >'
												};
	}
	var m = 0, n = (Math.sqrt(num) + 1).integer();
	for(var j=2; j<n; j++) {
		if(num % j === 0) m++;
	}
	if(m === 0) return true;
	return false;
};
//document.writeln(jsar.misc.isSimpleNumber(13));//31
//--------------------------------------------------------------
jsar.misc.isSuperSimpleNumber = function(num) {
	var str = '';
	if(jsar.misc.isSimpleNumber(num)) {
		while(num) {
			str += num % 10;
			num = Math.floor(num / 10);
		}
		return jsar.misc.isSimpleNumber(num);
	}
	return false;
};
//document.writeln(jsar.misc.isSuperSimpleNumber(71));//31
//--------------------------------------------------------------
jsar.misc.getRadIncircle = function(a, b, c) {
	if(jsar.misc.isTriangle(a, b, c)) {
		var perim = (a + b + c);
		var p = perim / 2;
		var square = Math.sqrt(p * (p - a) * (p - b) * (p - c));
		return (2 * square / perim).toFixed(3);
	}
	return 0;
};
//document.writeln(jsar.misc.getRadIncircle(30, 30, 30));
//--------------------------------------------------------------
jsar.misc.getRadCircumcircle = function(a, b, c) {
	if(jsar.misc.isTriangle(a, b, c)) {
		var p = (a + b + c) / 2;
		var square = Math.sqrt(p * (p - a) * (p - b) * (p - c));
		return (a * b * c / 4 / square).toFixed(3);
	}
	return 0;
};
//document.writeln(jsar.misc.getRadCircumcircle(30, 30, 30));
//--------------------------------------------------------------
jsar.misc.rectToSquares = function(a, b) {
	if(!jsar.toolset.isNumber(a) || !jsar.toolset.isNumber(b) || a <= 0 || b <= 0) { throw {
																						name: 'ValueError',
																						message: 'incorrect rectangle sides: a < ' + a + ' >, b < ' + b + ' >'
																					};
	}
	var n = 0, buf;
	//var a = Math.floor(a), b = Math.floor(b);
	do {
		if(a < b) {
			buf = a;
			a = b;
			b = buf;
		}
		k = Math.floor(a / b);
		a = a % b;
		n += k;
	} while(a !== 0);
	return n;
};
//document.writeln(jsar.misc.rectToSquares(110, 20));
//--------------------------------------------------------------
jsar.misc.getDiv3Xor7 = function(n, m) {
	if(!jsar.toolset.isIntNumber(n) || !jsar.toolset.isIntNumber(m) || n <= 0 || m <= 0 || n >= m) { throw {
																										name: 'ValueError',
																										message: 'incorrect input parameters: lower border < ' + n + ' >, upper border < ' + m + ' >'
																									};
	}
	return Math.abs((Math.floor(n / 7) + Math.floor(n / 3) - 2 * Math.floor(n / 21) - Math.floor((m - 1) / 7) - Math.floor((m - 1) / 3) + 2 * Math.floor((m - 1) / 21)));
};
//document.writeln(jsar.misc.getDiv3Xor7(10, 100));
//1010 xor 0011 = 1001 (xy)
// xy xor 0011 = 1010 (x)
// xy xor 1010 = 0011 (y)
jsar.misc.getDiv3Xor7 = function(n, m) {
	if(!jsar.toolset.isIntNumber(n) || !jsar.toolset.isIntNumber(m) || n <= 0 || m <= 0 || n >= m) { throw {
																										name: 'ValueError',
																										message: 'incorrect input parameters: lower border < ' + n + ' >, upper border < ' + m + ' >'
																									};
	}
	var c = 0;
	for(var j=m; j>=n; j--) {
		if((!(j%3 && j%7)) && (!(!(j%3) && !(j%7)))) {
		//if((!(j%3==0 && j%7==0)) && (!(!(j%3==0) && !(j%7==0)))) {
			c++;
		}
	}
	return c;
};
//document.writeln(jsar.misc.getDiv3Xor7(10, 100));
//(NOT(A AND B)) AND (NOT(NOT A AND NOT B))
//--------------------------------------------------------------
jsar.misc.shortenString = function(str) {
	if(!jsar.toolset.isString(str)) { throw {
										name: 'ValueError',
										message: 'incorrect input string: < ' + str + ' >'
									};
	}
	return str[0].toUpperCase() + str.substring(1, str.length - 1).length + str[str.length - 1].toUpperCase();
};
//document.writeln(jsar.misc.shortenString('internationalisation'));
//--------------------------------------------------------------
//var myRe = /ab*/g;
//var str = "abbcdefabh";
//while ((myArray = myRe.exec(str)) != null) {
//	var msg = "Found " + myArray[0] + ".  ";
//	msg += "Next match starts at " + myRe.lastIndex;
//	print(msg);
//}
//--------------------------------------------------------------
jsar.misc.getRandPrime = function() {
	var n;
	var isPrime = function(n) {
		var d = Math.ceil(Math.sqrt(n));
		while(n % (d--) && d);
		return !d;
	};
	while(n = Math.round(Math.random() * 1000000000), !isPrime(n));
	return n;
};
//document.writeln(jsar.misc.getRandPrime());
//--------------------------------------------------------------
jsar.misc.fibonacci = function(num) {
	if(!jsar.toolset.isIntNumber(num) || num < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input value: count < ' + num + ' >'
												};
	}
	var r = [], n = 0, a = 0, b = 1, next;
	var nextFibonacci = function() {
		next = a + b;
		return b = (a = b, next);
	};
	while(n++ < num) {
		r.push(nextFibonacci());
	}
	return r;
};
jsar.misc.fibonacci = function(num) {
	if(!jsar.toolset.isIntNumber(num) || num < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input string: value < ' + num + ' >'
												};
	}
	for (var i=2, r=[0,1]; i<num; r.push(r[i-1] + r[i-2]), i++);
	return r;
};
//document.writeln(jsar.misc.fibonacci(10));
//--------------------------------------------------------------
jsar.misc.toCurrency = function(total, values, sym) {
	if(!jsar.toolset.isIntNumber(total) || total < 0 || !jsar.toolset.isArray(values)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: total sum < ' + total + ' >, exchange rates < ' + values + ' >'
																					};
	}
	sym = (sym == null) ? '$' : (jsar.toolset.isString(sym)) ? sym : null;
	if(sym == null) throw {name: 'ValueError', message: 'incorrect symbol value: < ' + sym + ' >'};
	//
	for(var i=0, counts=[]; counts[i]=total/values[i], total=total%values[i]; i++);
	//format
	var results = counts.map(function(s, i) {
		return (s>=1 && [Math.floor(s), "x", (sym) + (values[i]).toFixed(2)].join(' '));
	});
	return results.filter(Boolean).join(', ');
	//return counts.map(Math.floor);
};
//document.writeln(jsar.misc.toCurrency(3247, [500, 100, 25, 10, 5, 1]));
//--------------------------------------------------------------
jsar.misc.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
//--------------------------------------------------------------
jsar.misc.absPath = function(url) {
	if(!jsar.toolset.isString(url)) { throw {
										name: 'ValueError',
										message: 'incorrect url value: < ' + url + ' >'
									};
	}
	var Loc = location.href;    
	Loc = Loc.substring(0, Loc.lastIndexOf('/'));
	while (/^\.\./.test(url)){       
		Loc = Loc.substring(0, Loc.lastIndexOf('/'));
		url= url.substring(3);
	}
	return Loc + '/' + url;
};
//--------------------------------------------------------------
jsar.misc.get_random_color = function() {
	return "#"+((1<<24)*Math.random()|0).toString(16);
};
//--------------------------------------------------------------
jsar.misc.getParameterByName = function(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null) return "";
	return decodeURIComponent(results[1].replace(/\+/g, " "));
};
//http://movie.com/index.php?action=showmovies&year=1985&counrty=Germany
//jsar.misc.getParameterByName('action'); // showmovies
//--------------------------------------------------------------
jsar.misc.bbtagit = function(text) {
	if(!jsar.toolset.isString(text)) { throw {
										name: 'ValueError',
										message: 'incorrect text value: < ' + text + ' >'
									};
	}
	text = text.replace(/\[u\]([\s\S]*)\[\/u\]/gim, '<u>$1</u>');
	return text;
};
//var line = "[u]мой\n текст[/u]";
//document.writeln(jsar.misc.bbtagit(line));
//--------------------------------------------------------------
jsar.misc.getDomain = function(url) {
	if(!jsar.toolset.isString(url)) { throw {
										name: 'ValueError',
										message: 'incorrect url value: < ' + url + ' >'
									};
	}
	return url.split('/',3).join('/');
};
//jsar.misc.getDomain("http://www.aneventapart.com/2010/seattle/slides/"); 
//"http://www.aneventapart.com"
//jsar.misc.getDomain("https://addons.mozilla.org/en-US/firefox/bookmarks/"); 
//"https://addons.mozilla.org"
//--------------------------------------------------------------
(function(globals) {
	
	var negate = function(a) {
		var neg = 0;
		var d = a < 0 ? 1 : -1;
		while(a != 0) {
			neg += d;
			a +=d;
		}
		return neg;
	};
	
	var minus = function(a, b) {
		if(!jsar.toolset.isIntNumber(a) || !jsar.toolset.isIntNumber(b)) { throw {
																			name: 'ValueError',
																			message: 'incorrect input parameters: a < ' + a + ' >, b < ' + b + ' >'
																		};
		}
		return a + negate(b);
	};
	
	var abs = function(a) {
		if(a < 0) {
			return negate(a);
		} else {
			return a;
		}
	};
	
	var multiply = (function() {
		
		var multiply_ = function(a, b) {
			if(a < b) {
				return multiply_(b, a);
			}
			var sum = 0;
			for(var i=abs(b); i>0; i--) {
				sum += a;
			}
			if(b < 0) {
				sum = negate(sum);
			}
			return sum;
		};
		
		return function(a, b) {
			if(!jsar.toolset.isIntNumber(a) || !jsar.toolset.isIntNumber(b)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input parameters: a < ' + a + ' >, b < ' + b + ' >'
																			};
			}
			return multiply_(a, b);
		};
	}());
	
	var divide = function(a, b) {
		if(!jsar.toolset.isIntNumber(a) || !jsar.toolset.isIntNumber(b)) { throw {
																			name: 'ValueError',
																			message: 'incorrect input parameters: a < ' + a + ' >, b < ' + b + ' >'
																		};
		}
		if(b == 0) throw { name: 'ArithmeticException', message: 'Division by zero' };
		var absa = abs(a);
		var absb = abs(b);
		
		var product = 0;
		var x = 0;
		while(product + absb <= absa) {
			product += absb;
			x++;
		}
		
		if((a < 0 && b < 0) || (a > 0 && b > 0)) {
			return x;
		} else {
			return negate(x);
		}
	};
	
}(globals));
//--------------------------------------------------------------
jsar.misc.pluralize = function(str, num) {
	if(!jsar.toolset.isString(str)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: not a string < ' + str + ' >'
									};
	}
	if(!jsar.toolset.isIntNumber(num) || num < 1) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: not positive integer number < ' + num + ' >'
													};
	}
	if(str.isEmpty()) return null;
	var plurals = {'fish': 'fish', 'person': 'people'};
	if(1 === num) {
		return str.trim();
	}
	if(plurals[str] != null) {
		return plurals[str];
	}
	return str.trim() + 's';
};
//--------------------------------------------------------------
jsar.mics.randomPointOnCircle = function(radius) {
	if(!jsar.toolset.isNumber(radius) || radius < 0) { throw {
															name: 'TypeError',
															message: 'incorrect input arguments: start point latitude < ' + lat1 + ' > and longitude < ' + lon1 + ' >'
														};
	}
	var angle = Math.random() * 2 * Math.PI;
	return {x: radius * Math.cos(angle), y: radius * Math.sin(angle)};
};
//--------------------------------------------------------------
jsar.misc.calculateDistance = function(lat1, lon1, lat2, lon2, radius) {
	if(!jsar.toolset.isNumber(lat1) || !jsar.toolset.isNumber(lon1)) { throw {
																			name: 'TypeError',
																			message: 'incorrect input arguments: start point latitude < ' + lat1 + ' > and longitude < ' + lon1 + ' >'
																		};
	}
	if(!jsar.toolset.isNumber(lat2) || !jsar.toolset.isNumber(lon2)) { throw {
																			name: 'TypeError',
																			message: 'incorrect input arguments: start point latitude < ' + lat2 + ' > and longitude < ' + lon2 + ' >'
																		};
	}
	radius = (radius == null) ? 6378.135 : (jsar.toolset.isNumber(radius) && radius > 0) ? radius : null;
	if(radius == null) throw {name: 'ValueError', mesage: 'incorrect {radius} value: < ' + radius + ' >'};
	
	var rad = globals.toolset.convertToRadians(Math.PI / 180);
	lat1 = globals.toolset.convertToRadians(lat1) * rad;
	lon1 = globals.toolset.convertToRadians(lon1) * rad;
	lat2 = globals.toolset.convertToRadians(lat2) * rad;
	lon2 = globals.toolset.convertToRadians(lon2) * rad;
	
	var theta = lon2 - lon1;
	var dist = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(theta));
	if(dist < 0) dist += Math.PI;
	return (dist * radius);
};
jsar.misc.calculateDistance = (function() {
	
	const EARTH_RADIUS = 3959;
	
	return function(lat1, lon1, lat2, lon2) {
		
		if(!jsar.toolset.isNumber(lat1) || !jsar.toolset.isNumber(lon1)) { throw {
																			name: 'TypeError',
																			message: 'incorrect input arguments: start point latitude < ' + lat1 + ' > and longitude < ' + lon1 + ' >'
																		};
		}
		
		if(!jsar.toolset.isNumber(lat2) || !jsar.toolset.isNumber(lon2)) { throw {
																			name: 'TypeError',
																			message: 'incorrect input arguments: start point latitude < ' + lat2 + ' > and longitude < ' + lon2 + ' >'
																		};
		}
	
		var dLat = globals.toolset.convertToRadians(lat2 - lat1);
		var dLon = globals.toolset.convertToRadians(lon2 - lon1);
		
		var temp = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(globals.toolset.convertToRadians(lat1)) * Math.cos(globals.toolset.convertToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var temp2 = 2 * Math.atan2(Math.sqrt(temp), Math.sqrt(1 - temp));
		return (EARTH_RADIUS * temp2).toFixed(2);
	};
})();
//--------------------------------------------------------------
jsar.misc.calculateBearing = function(lat1, lon1, lat2, lon2) {
	return Math.atan2(Math.sin(lon2 - lon1) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)).toDegrees();
};
//--------------------------------------------------------------
/*
{
	x: {
		min: 0,
		max: 10
	},
	y: {
		min: 0,
		max: 10
	}
}
*/
jsar.misc.intersection = function(obj1, obj2) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isObject(obj2)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj2} is not an object < ' + obj2 + ' >'
									};
	}
	var x = (obj1.x.max - obj1.x.min + obj2.x.max - obj2.x.min - Math.abs(obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min)) / 2;
	var y = (obj1.y.max - obj1.jy.min + obj2.y.max - obj2.y.min - Math.abs(obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min)) / 2;
	return (x > 0 && y > 0);
};
jsar.misc.penetration = function(obj1, obj2) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isObject(obj2)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj2} is not an object < ' + obj2 + ' >'
									};
	}
	var dx = obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min,
		dy = obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min,
		x = (obj1.x.max - obj1.x.min + obj2.x.max - obj2.x.min - Math.abs(dx)) / 2,
		y = (obj1.y.max - ojb1.y.min + obj2.y.max - obj2.y.min - Math.abs(dy)) / 2;
	if(x > 0 && y > 0) return {x: x, y: y, direction: {x: dx / Math.abs(dx), y: dy / Math.abs(dy)}};
	return null;
};
jsar.misc.direction = function(obj1, obj2) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isObject(obj2)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj2} is not an object < ' + obj2 + ' >'
									};
	}
	var x = obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min,
		y = obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min;
	return {x: x / Math.abs(x), y: y / Math.abs(y)};
};
jsar.misc.distance = function(obj1, obj2) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isObject(obj2)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj2} is not an object < ' + obj2 + ' >'
									};
	}
	var x = Math.abs(obj1.x.max + obj1.x.min - obj2.x.max - obj2.x.min),
		y = Math.abs(obj1.y.max + obj1.y.min - obj2.y.max - obj2.y.min);
	return Math.sqrt(x * x + y * Y);
};
jsar.misc.getVictim = function(obj1, data) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isArray(data)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {data} is not array < ' + data + ' >'
									};
	}
	var victims = jsar.toolset.vector();
	for(var i=0, l=data.length; i<l; i++) {
		if(jsar.misc.intersection(obj1, data[i])) {
			victims.push(data[i]);
		}
	}
	return (victims.length) ? victims : null;
};
jsar.misc.nearestLeft = function(data) {

	if(!jsar.toolset.isArray(data)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {data} is not array < ' + data + ' >'
									};
	}
	var max = data[0].x.max, index = null;
	for(var i=0, l=data.length; i<l; i++) {
		if(data[i].x.max >= max) {
			max = data[i].x.max;
			index = i;
		}
	}
	return (data[index] || null);
};
jsar.misc.nearestRight = function(data) {

	if(!jsar.toolset.isArray(data)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {data} is not array < ' + data + ' >'
									};
	}
	var min = data[0].x.min, index = null;
	for(var i=0, l=data.length; i<l; i++) {
		if(data[i].x.min <= min) {
			min = data[i].x.min;
			index = i;
		}
	}
	return (data[index] || null);
};
jsar.misc.nearestUp = function(data) {

	if(!jsar.toolset.isArray(data)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {data} is not array < ' + data + ' >'
									};
	}
	var min = data[0].y.min, index = null;
	for(var i=0, l=data.length; i<l; i++) {
		if(data[i].y.min <= min) {
			min = data[i].y.min;
			index = i;
		}
	}
	return (data[index] || null);
};
jsar.misc.nearestDown = function(data) {

	if(!jsar.toolset.isArray(data)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {data} is not array < ' + data + ' >'
									};
	}
	var max = data[0].y.max, index = null;
	for(var i=0, l=data.length; i<l; i++) {
		if(data[i].y.max <= max) {
			max = data[i].y.max;
			index = i;
		}
	}
	return (data[index] || null);
};
jsar.misc.intersectionSegments = function(obj1, obj2) {
	
	if(!jsar.toolset.isObject(obj1)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj1} is not an object < ' + obj1 + ' >'
									};
	}
	if(!jsar.toolset.isObject(obj2)) { throw {
										name: 'TypeError',
										message: 'incorrect input argument: {obj2} is not an object < ' + obj2 + ' >'
									};
	}
	var v1 = (obj2.x.max - obj2.x.min) * (obj1.y.min - obj2.y.min) - (obj2.y.max - obj2.y.min) * (obj1.x.min - obj2.x.min),
		v2 = (obj2.x.max - obj2.x.min) * (obj1.y.max - obj2.y.min) - (obj2.y.max - obj2.y.min) * (obj1.x.max - obj2.x.min),
		v3 = (obj1.x.max - obj1.x.min) * (obj2.y.min - obj1.y.min) - (obj1.y.max - obj1.y.min) * (obj2.x.min - obj1.x.min),
		v4 = (obj1.x.max - obj1.x.min) * (obj2.y.max - obj1.y.min) - (obj1.y.max - obj1.y.min) * (obj2.x.max - obj1.x.min);
	return ((v1 * v2 <= 0) && (v3 * v3 <= 0));
};
//--------------------------------------------------------------
	jsar.misc.fibonacci = (function() {
		
		var map = ['0', '1', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '144', '233', '377', '610', '987', '1597', '2584', '4181', '6765', '10946', '17711', '28657', '46368', '75025', '121393', '196418', '317811', '514229', '832040', '1346269', '2178309', '3524578', '5702887', '9227465', '14930352', '24157817', '39088169', '63245986', '102334155', '165580141', '267914296', '433494437', '701408733', '1134903170', '1836311903', '2971215073', '4807526976', '7778742049', '12586269025', '20365011074', '32951280099', '53316291173', '86267571272', '139583862445', '225851433717', '365435296162', '591286729879', '956722026041', '1548008755920', '2504730781961', '4052739537881', '6557470319842', '10610209857723', '17167680177565', '27777890035288', '44945570212853', '72723460248141', '117669030460994', '190392490709135', '308061521170129', '498454011879264', '806515533049393', '1304969544928657', '2111485077978050', '3416454622906707', '5527939700884757', '8944394323791464', '14472334024676221', '23416728348467685', '37889062373143906', '61305790721611591', '99194853094755497', '160500643816367088', '259695496911122585', '420196140727489673', '679891637638612258', '1100087778366101931', '1779979416004714189', '2880067194370816120', '4660046610375530309', '7540113804746346429', '12200160415121876738', '19740274219868223167', '31940434634990099905', '51680708854858323072', '83621143489848422977', '135301852344706746049', '218922995834555169026', '354224848179261915075'];
		
		return function (n) {
			
			if(!jsar.toolset.isIntNumber(n)) { throw {
												name: 'TypeError',
												message: 'incorrect input argument: fibonacci sequence number < ' + n + ' >'
											};
			}
			
			if(n < 0 || n >= map.length) {
				throw {
					name: 'ValueError',
					message: 'incorrect input value: fibonacci sequence number < ' + n + ' > is out of range [0, ' + map.length + ']'
				};
			}
			return map[n];
		};
	}());
//--------------------------------------------------------------
'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
//--------------------------------------------------------------
for ( int   bit = 1<<30 ; bit > 0 ; bit >>= 1 );
//--------------------------------------------------------------
function cleanWhitespace(element) {
	// If no element is provided, do the whole HTML document
	element = element || document;
	// Use the first child as a starting point
	var cur = element.firstChild;
	// Go until there are no more child nodes
	while (cur != null) {
		// If the node is a text node, and it contains nothing but whitespace
		if ( cur.nodeType == 3 && ! /\S/.test(cur.nodeValue) ) {
			// Remove the text node
		element.removeChild(cur);
		// Otherwise, if it's an element
		} else if (cur.nodeType == 1) {
			// Recurse down through the document
			cleanWhitespace(cur);
		}
		cur = cur.nextSibling; // Move through the child nodes
	}
};
//--------------------------------------------------------------
HTMLElement.prototype.next = function() {
	var elem = this;
	do {
		elem = elem.nextSibling;
	}
	while ( elem && elem.nodeType != 1 );
	return elem;
};
function parent(elem, num) {
	num = num || 1;
	for ( var i = 0; i < num; i++ )
		if (elem != null)
			elem = elem.parentNode;
	return elem;
};
function last(elem) {
	elem = elem.lastChild;
	return ((elem && elem.nodeType != 1) ? prev (elem) : elem);
};
function first(elem) {
	elem = elem.firstChild;
	return ((elem && elem.nodeType != 1) ? next (elem) : elem);
};
function next(elem) {
	do {
		elem = elem.nextSibling;
	} while (elem && elem.nodeType != 1);
	return elem;
};
function prev( elem ) {
	do {
		elem = elem.previousSibling;
	} while (elem && elem.nodeType != 1);
	return elem;
};
function tag(name, elem) {
	// If the context element is not provided, search the whole document
	return (elem || document).getElementsByTagName(name);
};
function domReady( f ) {
	// If the DOM is already loaded, execute the function right away
	if ( domReady.done ) return f();
	// If we've already added a function
	if ( domReady.timer ) {
		// Add it to the list of functions to execute
		domReady.ready.push( f  );
	} else {
		// Attach an event for when the page finishes loading,
		// just in case it finishes first. Uses addEvent.
		addEvent( window, "load", isDOMReady );
		// Initialize the array of functions to execute
		domReady.ready = [ f ];
		//  Check to see if the DOM is ready as quickly as possible
		domReady.timer = setInterval( isDOMReady, 13 );
	}
};
function isDOMReady() {
	// If we already figured out that the page is ready, ignore
	if ( domReady.done ) return false;
	// Check to see if a number of functions and elements are
	// able to be accessed
	if ( document && document.getElementsByTagName && document.getElementById && document.body ) {
		// If they're ready, we can stop checking
		clearInterval( domReady.timer );
		domReady.timer = null;
		// Execute all the functions that were waiting
		for ( var i = 0; i < domReady.ready.length; i++ ) {
			domReady.ready[i]();
		}
		// Remember that we're now done
		domReady.ready = null;
		domReady.done = true;
	}
};
function hasClass(name,type) {
	var r = [];
	// Locate the class name (allows for multiple class names)
	var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
	// Limit search by type, or look through all elements
	var e = document.getElementsByTagName(type || "*");
	for ( var j = 0; j < e.length; j++ )
		// If the element has the class, add it for return
		if ( re.test(e[j]) ) r.push( e[j] );
	// Return the list of matched elements
	return r;
};
function text(e) {
	var t = "";
	// If an element was passed, get its children,
	// otherwise assume it's an array
	e = e.childNodes || e;
	// Look through all child nodes
	for ( var j = 0; j < e.length; j++ ) {
		// If it's not an element, append its text value
		// Otherwise, recurse through all the element's children
		t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
	}
	// Return the matched text
	return t;
};
function hasAttribute(elem, name) {
	return elem.getAttribute(name) != null;
};
function attr(elem, name, value) {
	// Make sure that a valid name was provided
	if ( !name || name.constructor != String ) return '';
	// Figure out if the name is one of the weird naming cases
	name = { 'for': 'htmlFor', 'class': 'className' }[name] || name;
	// If the user is setting a value, also
	if (typeof value != 'undefined') {
		// Set the quick way first
		elem[name] = value;
		// If we can, use setAttribute
		if (elem.setAttribute)
			elem.setAttribute(name, value);
		// Return the value of the attribute
		return (elem[name] || elem.getAttribute(name) || '');
	}
};
// Wait until the DOM is Ready
domReady(function(){
	// Find all the definition terms
	var dt = tag("dt");
	for ( var i = 0; i < dt.length; i++ ) {
		// Watch for a user click on the term
		addEvent( dt[i], "click", function() {
			// See if the definition is already open, or not
			var open = attr( this, "open" );
			// Toggle the display of the definition
			next( this ).style.display = open ? 'none' : 'block';
			// Remember if the defnition is open
			attr( this, "open", open ? '' : 'yes' );
		});
	}
});
function create( elem ) {
	return document.createElementNS
		? document.createElementNS( 'http://www.w3.org/1999/xhtml', elem )
		: document.createElement( elem );
};
function before( parent, before, elem ) {
	// Check to see if no parent node was provided
	if ( elem == null ) {
		elem = before;
		before = parent;
		parent  = before.parentNode;
	}
	// Get the new array of elements
	var elems = checkElem( elem );
	// Move through the array backwards,
	// because we're prepending elements
	for ( var i = elems.length - 1; i >= 0; i-- ) {
		parent.insertBefore( elems[i], before );
	}
};
function append( parent, elem ) {
	// Get the array of elements
	var elems = checkElem( elem );
	// Append them all to the element
	for ( var i = 0; i <= elems.length; i++ ) {
		parent.appendChild( elems[i] );
	}
};
//before( last( tag("ol")[0] ), "<li>Zebra.</li>" );
//append( tag("ol")[0], "<li>Mouse trap.</li>" );
function checkElem(a) {
	var r = [];
	// Force the argument into an array, if it isn't already
	if ( a.constructor != Array ) a = [ a ];
	for ( var i = 0; i < a.length; i++ ) {
		// If there's a String
		if ( a[i].constructor == String ) {
			// Create a temporary element to house the HTML
			var div = document.createElement("div");
			// Inject the HTML, to convert it into a DOM structure
			div.innerHTML = a[i];
			// Extract the DOM structure back out of the temp DIV
			for ( var j = 0; j < div.childNodes.length; j++ )
				r[r.length] = div.childNodes[j];
		} else if ( a[i].length ) {
			// If it's an array // Assume that it's an array of DOM Nodes
			for ( var j = 0; j < a[i].length; j++ )
				r[r.length] = a[i][j];
		} else {
			// Otherwise, assume it's a DOM Node
			r[r.length] = a[i];
		}
	}
	return r;
};
// Remove a single Node from the DOM
function remove( elem ) {
	if ( elem ) {
		elem.parentNode.removeChild( elem );
	}
};
// Remove all of an Element's children from the DOM
function empty( elem ) {
	while ( elem.firstChild ) {
		remove( elem.firstChild );
	}
};
//remove( last( tag("ol")[0] ) )
//empty( last( tag("ol")[0] ) )
function stopBubble(e) {
	// If an event object is provided, then this is a non-IE browser
	if ( e && e.stopPropagation )
		// and therefore it supports the W3C stopPropagation() method
		e.stopPropagation();
	else
		// Otherwise, we need to use the Internet Explorer
		// way of cancelling event bubbling
		window.event.cancelBubble = true;
};
function stopDefault( e ) {
	// Prevent the default browser action (W3C)
	if ( e && e.preventDefault )
		e.preventDefault();
		// A shortcut for stoping the browser action in IE
	else
		window.event.returnValue = false;
	return false;
};
// Get a style property (name) of a specific element (elem)
function getStyle( elem, name ) {
	// If the property exists in style[], then it's been set
	// recently (and is current)
	if (elem.style[name])
		return elem.style[name];
		// Otherwise, try to use IE's method
	else if (elem.currentStyle) return elem.currentStyle[name];
		// Or the W3C's method, if it exists
	else if (document.defaultView && document.defaultView.getComputedStyle) {
		// It uses the traditional 'text-align' style of rule writing,
		// instead of textAlign
		name = name.replace(/([A-Z])/g,"-$1");
		name = name.toLowerCase();
		// Get the style object and get the value of the property (if it exists)
		var s = document.defaultView.getComputedStyle(elem,"");
		return s && s.getPropertyValue(name);
	// Otherwise, we're using some other browser
	} else
		return null;
};
// Find the X (Horizontal, Left) position of an element
function pageX(elem) {
	// See if we're at the root element, or not
	return elem.offsetParent ?
	// If we can still go up, add the current offset and recurse upwards
	elem.offsetLeft + pageX( elem.offsetParent ) :
	// Otherwise, just get the current offset
	elem.offsetLeft;
};
// Find the Y (Vertical, Top) position of an element
function pageY(elem) {
	// See if we're at the root element, or not
	return elem.offsetParent ?
	// If we can still go up, add the current offset and recurse upwards
	elem.offsetTop + pageY( elem.offsetParent ) :
	// Otherwise, just get the current offset
	elem.offsetTop;
};
// Find the horizontal positioing of an element within its parent
function parentX(elem) {
	// If the offsetParent is the element's parent, break early
	return elem.parentNode == elem.offsetParent ?
	elem.offsetLeft :
	// Otherwise, we need to find the position relative to the entire
	// page for both elements, and find the difference
	pageX( elem ) - pageX( elem.parentNode );
};
// Find the vertical positioning of an element within its parent
function parentY(elem) {
	// If the offsetParent is the element's parent, break early
	return elem.parentNode == elem.offsetParent ?
	elem.offsetTop :
	// Otherwise, we need to find the position relative to the entire
	// page for both elements, and find the difference
	pageY( elem ) - pageY( elem.parentNode );
};
// Find the left position of an element
function posX(elem) {
	// Get the computed style and get the number out of the value
	return parseInt( getStyle( elem, "left" ) );
};
// Find the top position of an element
function posY(elem) {
	// Get the computed style and get the number out of the value
	return parseInt( getStyle( elem, "top" ) );
};
// A function for setting the horizontal position of an element
function setX(elem, pos) {
	// Set the 'left' CSS property, using pixel units
	elem.style.left = pos + "px";
};
// A function for setting the vertical position of an element
function setY(elem, pos) {
	// Set the 'left' CSS property, using pixel units
	elem.style.top = pos + "px";
};
// A function for adding a number of pixels to the horizontal // position of an element
function addX(elem,pos) {
	// Get the current horz. position and add the offset to it.
	setX( posX(elem) + pos );
};
// A function that can be used to add a number of pixels to the // vertical position of an element
function addY(elem,pos) {
	// Get the current vertical position and add the offset to it
	setY( posY(elem) + pos );
};
// Get the actual height (using the computed CSS) of an element
function getHeight( elem ) {
	// Gets the computed CSS value and parses out a usable number
	return parseInt( getStyle( elem, 'height' ) );
};
// Get the actual width (using the computed CSS) of an element
function getWidth( elem ) {
	// Gets the computed CSS value and parses out a usable number
	return parseInt( getStyle( elem, 'width' ) );
};
// Find the full, possible, height of an element (not the actual, // current, height)
function fullHeight( elem ) {
	// If the element is being displayed, then offsetHeight
	// should do the trick, barring that, getHeight() will work
	if ( getStyle( elem, 'display' ) != 'none' ) return elem.offsetHeight || getHeight( elem );
	// Otherwise, we have to deal with an element with a display
	// of none, so we need to reset its CSS properties to get a more
	// accurate reading
	var old = resetCSS( elem, { display: '', visibility: 'hidden', position: 'absolute' });
	// Figure out what the full height of the element is, using clientHeight
	// and if that doesn't work, use getHeight
	var h = elem.clientHeight || getHeight( elem );
	// Finally, restore the CSS properties back to what they were
	restoreCSS( elem, old );
	// and return the full height of the element
	return h;
};
// Find the full, possible, width of an element (not the actual, // current, width)
function fullWidth( elem ) {
	// If the element is being displayed, then offsetWidth
	// should do the trick, barring that, getWidth() will work
	if ( getStyle( elem, 'display' ) != 'none' ) return elem.offsetWidth || getWidth( elem );
	// Otherwise, we have to deal with an element with a display
	// of none, so we need to reset its CSS properties to get a more
	// accurate reading
	var old = resetCSS( elem, { display: '', visibility: 'hidden', position: 'absolute' });
	// Figure out what the full width of the element is, using clientWidth
	// and if that doesn't work, use getWidth
	var w = elem.clientWidth || getWidth( elem );
	// Finally, restore the CSS properties back to what they were
	restoreCSS( elem, old );
	// and return the full width of the element
	return w;
};
// A function used for setting a set of CSS properties, which // can then be restored back again later
function resetCSS( elem, prop ) {
	var old = {};
	// Go through each of the properties
	for ( var i in prop ) { // Remember the old property value
		old[ i ] = elem.style[ i ];
		// And set the new value
		elem.style[ i ] = prop[i];
	};
	// Retun the set of changed values, to be used by restoreCSS
	return old;
}
// A function for restoring the side effects of the resetCSS function
function restoreCSS( elem, prop ) {
	// Reset all the properties back to their original values
	for ( var i in prop ) elem.style[ i ] = prop[ i ];
};
// A function for hiding (using display) an element
function hide( elem ) {
	// Find out what its current display state is
	var curDisplay = getStyle( elem, 'display' );
	//  Remember its display state for later
	if ( curDisplay != 'none' ) elem.$oldDisplay = curDisplay;
	// Set the display to none (hiding the element)
	elem.style.display = 'none';
};
// A function for showing (using display) an element
function show( elem ) {
	// Set the display property back to what it use to be, or use
	// 'block', if no previous display had been saved
	elem.style.display = elem.$oldDisplay || '';
};
// Set an opacity level for an element
// (where level is a number 0-100)
function setOpacity( elem, level ) {
	// If filters exist, then this is IE, so set the Alpha filter
	if ( elem.filters )
			elem.style.filters = 'alpha(opacity=' + level + ')';
	// Otherwise use the W3C opacity property
	else
		elem.style.opacity = level / 100;
};
function slideDown( elem ) {
	// Start the slide down at 0
	elem.style.height = '0px';
	// Show the element (but you can see it, since the height is 0)
	show( elem );
	// Find the full, potential, height of the element
	var h = fullHeight( elem );
	// We're going to do a 20 'frame' animation that takes
	// place over one second
	for ( var i = 0; i <= 100; i += 5 ) {
		// A closure to make sure that we have the right 'i'
		(function(){
			var pos = i;
			// Set the timeout to occur at the specified time in the future
			setTimeout(function(){
				// Set the new height of the element
				elem.style.height = (( pos / 100 ) * h ) + "px";
			}, ( pos + 1 ) * 10 );
		})();
	}
};
function fadeIn( elem ) {
	// Start the opacity at 0
	setOpacity( elem, 0 );
	// Show the element (but you can see it, since the opacity is 0)
	show( elem );
	// We're going to do a 20 'frame' animation that takes
	// place over one second
	for ( var i = 0; i <= 100; i += 5 ) { // A closure to make sure that we have the right 'i'
		(function(){ var pos = i;
			// Set the timeout to occur at the specified time in the future
			setTimeout(function(){
				// Set the new opacity of the element
				setOpacity( elem, pos );
			}, ( pos + 1 ) * 10 );
		})();
	}
};
// Find the horizontal position of the cursor
function getX(e) {
	// Normalize the event object
	e = e || window.event;
	// Check for the non-IE position, then the IE position
	return (e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
};
// Find the vertical position of the cursor
function getY(e) { // Normalize the event object
	e = e || window.event;
	// Check for the non-IE position, then the IE position
	return (e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
};
// Get the X position of the mouse relative to the element target // used in event object 'e'
function getElementX( e ) {
	// Find the appropriate element offset
	return ( e && e.layerX ) || window.event.offsetX;
};
// Get the Y position of the mouse relative to the element target // used in event object 'e'
function getElementY( e ) {
	// Find the appropriate element offset
	return ( e && e.layerY ) || window.event.offsetY;
};
// Returns the height of the web page // (could change if new content is added to the page)
function pageHeight() {
	return document.body.scrollHeight;
};
// Returns the width of the web page
function pageWidth() {
	return document.body.scrollWidth;
};
// A function for determining how far horizontally the browser is scrolled
function scrollX() {
	// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
	var de = document.documentElement;
	// If the pageXOffset of the browser is available, use that
	return (self.pageXOffset ||
	// Otherwise, try to get the scroll left off of the root node
	( de && de.scrollLeft ) ||
	// Finally, try to get the scroll left off of the body element
	document.body.scrollLeft);
};
// A function for determining how far vertically the browser is scrolled
function scrollY() {
	// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
	var de = document.documentElement;
	// If the pageYOffset of the browser is available, use that
	return (self.pageYOffset ||
	// Otherwise, try to get the scroll top off of the root node 
	 de && de.scrollTop ) ||
	// Finally, try to get the scroll top off of the body element
	document.body.scrollTop);
};
// If you wanted to scroll the browser up to the top of the browser, you could do:
//window.scrollTo(0,0);
// If you wanted to scroll to the position of a specific element, you could do:
//window.scrollTo( 0, pageY( document.getElementById("body") ) );

// Find the height of the viewport
function windowHeight() {
	// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
	var de = document.documentElement;
	// If the innerHeight of the browser is available, use that
	return (self.innerHeight ||
	// Otherwise, try to get the height off of the root node
	( de && de.clientHeight ) ||
	// Finally, try to get the height off of the body element
	document.body.clientHeight);
};
// Find the width of the viewport
function windowWidth() {
	// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
	var de = document.documentElement;
	// If the innerWidth of the browser is available, use that
	return (self.innerWidth ||
	// Otherwise, try to get the width off of the root node
	( de && de.clientWidth ) ||
	// Finally, try to get the width off of the body element
	document.body.clientWidth);
};
// A generic function for checking to see if an input element has // had information entered into it
function checkRequired( elem ) {
	if ( elem.type == "checkbox" || elem.type == "radio" )
		return getInputsByName( elem.name ).numChecked;
	else
		return elem.value.length > 0 && elem.value != elem.defaultValue;
};
// Find all input elements that have a specified name (good for finding
// and dealing with checkboxes or radio buttons)
function getInputsByName( name ) {
	// The array of input elements that will be matched
	var results = [];
	// Keep track of how many of them were checked
		results.numChecked = 0;
	// Find all the input elements in the document
	var input = document.getElementsByTagName("input");
		for ( var i = 0; i < input.length; i++ ) {
			// Find all the fields that have the specified name
			if ( input[i].name == name ) {
				// Save the result, to be returned later
				results.push( input[i] );
				// Remember how many of the fields were checked
				if ( input[i].checked )
					results.numChecked++;
			}
		}
	// Return the set of matched fields
	return results;
};
// Wait for the document to finish loading
window.onload = function() {
	// Get the form and watch for a submit attempt.
	document.getElementsByTagName("form")[0].onsubmit = function() {
	// Get an input element to check
	var elem = document.getElementById("age");
	// Make sure that the required age field has been checked
	if ( ! checkRequired( elem ) ) {
		// Display an error and keep the form from submitting.
		alert( "Required field is empty – " + "you must be over 13 to use this site." );
		return false;
	}
	// Get an input element to check
	var elem = document.getElementById("name");
	// Make sure that some text has been entered into the name field
		if ( ! checkRequired( elem ) ) {
			// Otherwise display an error and keep the form from submitting
			alert( "Required field is empty – please provide your name." );
			return false;
		}
	};
};
// A generic function for checking to see if an input element
// looks like an email address
function checkEmail( elem ) {
	// Make sure that something was entered and that it looks like
	// a valid email address
	return elem && elem.value && /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i.test( elem.value );
};
// Get an input element to check
var elem = document.getElementById("email");
// Check to see if the field is valid, or not
if ( ! checkEmail( elem ) ) {
	alert( "Field is not an email address." );
}
// A generic function for checking to see if an input element has
// a URL contained in it
function checkURL( elem ) {
	// Make sure that some text was entered, and that it's
	// not the default http:// text
	return elem && elem.value &&
	// Make sure that it looks like a valid URL
	/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test( elem.value );
};
// Get an input element to check
var elem = document.getElementById("url");
// Check to see if the field is a valid URL
if ( ! checkURL( elem ) ) {
	alert( "Field does not contain a URL." );
}
// A generic function for checking to see if an input element has
// a Phone Number entered in it
function checkPhone( elem ) {
	// Check to see if we have something that looks like
	// a valid phone number
	var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec( elem.value );
	// If it is, seemingly, valid - force it into the specific
	// format that we desire: (123) 456-7890
	if ( m !== null ) elem.value = "(" + m[1] + ") " + m[2] + "-" + m[3];
	return elem && elem.value && m !== null);
};
// Get an input element to check
var elem = document.getElementById("phone");
// Check to see if the field contains a valid phone number
if ( ! checkPhone( elem ) ) {
	alert( "Field does not contain a phone number." );
}
// A generic function for checking to see if an input element has
// a date entered into it
function checkDate( elem ) {
	// Make sure that something is entered, and that it
	// looks like a valid MM/DD/YYYY date
	return elem && elem.value && /^\d{2}\/\d{2}\/\d{2,4}$/.test(elem.value);
};
// Get an input element to check
var elem = document.getElementById("date");
// Check to see if the field contains a valid date
if ( ! checkDate( elem ) ) {
	alert( "Field is not a date." );
}
//--------------------------------------------------------------
var errMsg = {
	// Checks for when a specified field is required
	required: {
		msg: "This field is required.",
		test: function(obj, load) {
			// Make sure that there is no text was entered in the field and that
			// we aren't checking on page load (showing 'field required' messages
			// would be annoying on page load)
			return load || (obj && obj.value && obj.value !== obj.defaultValue);
		}
	},
	// Makes sure that the field s a valid email address
	email: {
		msg: "Not a valid email address.",
		test: function(obj) {
			// Make sure that something was entered and that it looks like
			// an email address
			return obj && obj.value && /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i.test( obj.value );
		}
	},
	// Makes sure the field is a phone number and
	// auto-formats the number if it is one
	phone: {
		msg: "Not a valid phone number.",
		test: function(obj) {
			// Check to see if we have something that looks like
			// a valid phone number
			var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec( obj.value );
			// If it is, seemingly, valid - force it into the specific
			// format that we desire: (123) 456-7890
			if ( m ) obj.value = "(" + m[1] + ") " + m[2] + "-" + m[3];
			return obj && obj.value && m;
		}
	},
	// Makes sure that the field is a valid MM/DD/YYYY date
	date: {
		msg: "Not a valid date.",
		test: function(obj) {
			// Make sure that something is entered, and that it
			// looks like a valid MM/DD/YYYY date
			return obj && obj.value && /^\d{2}\/\d{2}\/\d{2,4}$/.test(obj.value);
		}
	},
	// Makes sure that the field is a valid URL
	url: {
		msg: "Not a valid URL.",
		test: function(obj) {
			// Make sure that some text was entered, and that it's
			// not the default http:// text
			return obj && obj.value &&
			// Make sure that it looks like a valid URL
			/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test( obj.value );
		}
	}
};
//--------------------------------------------------------------
// A function for validating all fields within a form.
// The form argument should be a reference to a form element
// The load argument should be a boolean referring to the fact that
// the validation function is being run on page load, versus dynamically
function validateForm( form, load ) {
	var valid = true;
	// Go through all the field elements in form
	// form.elements is an array of all fields in a form
	for ( var i = 0; i < form.elements.length; i++ ) {
		// Hide any error messages, if they're being shown
		hideErrors( form.elements[i] );
		// Check to see if the field contains valid contents, or not
		if ( ! validateField( form.elements[i], load ) ) {
			valid = false;
			break;
		}
	}
	// Return false if a field does not have valid contents
	// true if all fields are valid
	return valid;
};
// Validate a single field's contents
function validateField( elem, load ) {
	var errors = [];
	// Go through all the possible validation techniques
	for ( var name in errMsg ) {
		// See if the field has the class specified by the error type
		var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
		// Check to see if the element has the class and that it passes the
		// validation test
		if ( re.test( elem.className ) && !errMsg[name].test( elem, load ) )
			// If it fails the validation, add the error message to list
			errors.push( errMsg[name].msg );
	}
	// Show the error messages, if they exist
	if ( errors.length )
		showErrors( elem, errors );
	// Return false if the field fails any of the validation routines
	return errors.length > 0;
};
// Hide any validation error messages that are currently shown
function hideErrors( elem ) {
	// Find the next element after the current field
	var next = elem.nextSibling;
	// If the next element is a ul and has a class of errors
	if ( next && next.nodeName == "UL" && next.className == "errors" )
		// Remove it (which is our means of 'hiding')
		elem.parentNode.removeChild( next );
};
// Show a set of errors messages for a specific field within a form
function showErrors( elem, errors ) {
	// Find the next element after the field
	var next = elem.nextSibling;
	
	// If the field isn't one of our special error-holders.
	if ( next && ( next.nodeName != "UL" || next.className != "errors" ) ) {
		// We need to make one instead
		next = document.createElement( "ul" );
		next.className = "errors";
		// and then insert into the correct place in the DOM
		elem.paretNode.insertBefore( next, elem.nextSibling );
	}
	
	// Now that we have a reference to the error holder UL
	// We then loop through all the error messages
	for ( var i = 0; i < errors.length; i++ ) {
		// Create a new li wrapper for each
		var li = document.createElement( "li" );
		li.innerHTML = errors[i];
		// and insert it into the DOM
		next.appendChild( li );
	}
};
/*ul.errors {
	list-style: none;
	background: #FFCECE;
	padding: 3px;
	margin: 3px 0 3px 70px;
	font-size: 0.9em;
	width: 165px;
};*/
function watchForm( form ) {
	// Watch the form for submission
	addEvent( form, 'submit',  function(){
		// make sure that the form's contents validate correctly
		return validateForm( form );
	});
};
// Find the first form on the page
//var form = document.getElementsByTagName( "form" )[0];
// and watch for when its submitted, to validate it
//watchForm( form );
function watchFields( form ) {
	// Go through all the field elements in form
	for ( var i = 0; i < form.elements.length; i++ ) {
		// and attach a 'change' event handler (which watches for a user
		// to lose focus of an input element)
		addEvent( form.elements[i], 'change',  function() {
			// Once the focus has been lost, re-validate the field
			return validateField( this );
		});
	}
};
// Locate the first form on the page
//var form = document.getElementsByTagName( "form" )[0];
// Watch all the fields in the form for changes
//watchFields( form );
addEvent( window, "load", function() {
	// Find all the forms on the page
	var forms = document.getElementsByTagName("form");
	// Go through all the forms on the page
	for ( var i = 0; i < forms.length; i++ ) {
		// Validate each of the forms, being sure to set the 'load' argument to
		// true, which stops certain, unnecessary, errors from appearing
		validateForm( forms[i], true );
	}
});
HTMLElement.prototype.hasClass = function( class ) {
	return new RegExp("(^|\\s)" + class + "(\\s|$)").test( this.className );
};
function text(e) { var t = "";
	// If an element was passed, get its children,
	// otherwise assume it's an array
	e = e.childNodes || e;
	// Look through all child nodes
	for ( var j = 0; j < e.length; j++ ) {
		// If it's not an element, append its text value 
		// Otherwise, recurse through all the element's children
		t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
	}
	// Return the matched text
	return t;
};
var box = { locked: true,
			unlock: function() {
				this.locked = false;
			},
			lock: function() {
				this.locked = true;
			},
			_content: [],
			get content() {
				if (this.locked)
					throw new Error("Locked!");
				return this._content;
			}
		}; 
//--------------------------------------------------------------
function stripComments(code) {
	return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
};
console.log(stripComments("1 + /* 2 */3")); // → 1 + 3
console.log(stripComments("x = 10;// ten!")); // → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1")); // → 1 1
//--------------------------------------------------------------
var input = "A string with 3 numbers in it... 42 and 88.";
var number = /\b(\d+)\b/g;
var match;
while (match = number.exec(input))
	console.log("Found", match[1], "at", match.index);
// → Found 3 at 14 // Found 42 at 33 // Found 88 at 40 
//--------------------------------------------------------------
function parseINI(string) {
	// Start with an object to hold the top-level fields
	var currentSection = {name: null, fields: []};
	var categories = [currentSection];
	string.split(/\r?\n/).forEach(function(line) {
		var match;
		if (/^\s*(;.*)?$/.test(line)) {
			return;
		} else if (match = line.match(/^\[(.*)\]$/)) {
			currentSection = {name: match[1], fields: []};
			categories.push(currentSection);
		} else if (match = line.match(/^(\w+)=(.*)$/)) {
			currentSection.fields.push({name: match[1], value: match[2]});
		} else {
			throw new Error("Line '" + line + " ' is invalid."); }
		});
	return categories;
};
function time(name, action) {
	var start = Date.now();
	// Current time in milliseconds
	action();
	console.log(name, "took", Date.now() - start, "ms");
};

function relativePos(event, element) {
	var rect = element.getBoundingClientRect();
	return {x: Math.floor(event.clientX - rect.left),
			y: Math.floor(event.clientY - rect.top)};
};

function pixelAt(cx, x, y) {
	var data = cx.getImageData(x, y, 1, 1);
	console.log(data.data);
};

module.exports = function(string) {
	return string.split("").map(function(ch) {
		return String.fromCharCode(ch.charCodeAt(0) + 5);
	}).join("");
}; 
function getDay(day,mon,year) {
	var days = ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];
	day=parseInt(day, 10); //если день двухсимвольный и <10 
	mon=parseInt(mon, 10); //если месяц двухсимвольный и <10 
	var a=parseInt((14-mon)/12, 10);
	var y=year-a;
	var m=mon+12*a-2;
	var d=(7000+parseInt(day+y+parseInt(y/4, 10)-parseInt(y/100, 10)+parseInt(y/400, 10)+(31*m)/12, 10))%7;
	return days[d];
};
//--------------------------------------------------------------
// Full version of `log` that:
//  * Prevents errors on console methods when no console present.
//  * Exposes a global 'log' function that preserves line numbering and formatting.
(function () {
  var method;
  var noop = function () { };
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
        console[method] = noop;
    }
  }


  if (Function.prototype.bind) {
    window.log = Function.prototype.bind.call(console.log, console);
  }
  else {
    window.log = function() { 
      Function.prototype.apply.call(console.log, console, arguments);
    };
  }
})();
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------




