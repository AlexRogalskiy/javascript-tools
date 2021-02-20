;(function(globals) {
	'use strict';
//------------------------------------------------------------------------------
	globals.algorithms = globals.algorithms || {};
//------------------------------------------------------------------------------
	/**
	* @private
	* @module sorting
	* @param {String} a Input value.
	* @param {String} b Input value to compare with.
	* @return {Integer} -1 - lower, 0 - equals, 1 - greater
	*/
	var cmpByDefault = function(a, b) {
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
//------------------------------------------------------------------------------
	(function() {
		/**
		* @public
		* @module algorithms
		* @param {Array} nodesList Input array.
		*
		* @example
		* var distance = [[8, 7, 5, 3, 4],
		*				[5, 4, 4, 2, 3],
		* 				[8, 2, 7, 4, 4],
		* 				[5, 6, 5, 4, 4],
		* 				[8, 3, 7, 9, 4]];
		* var minUtility = globals.algorithms.getMinUtility(distance);
		* document.writeln('pairs: ' + minUtility.maxPairs + ', functional: ' + minUtility.functional);
		*/
		var getMinUtility = function(nodesList) {
			if(!globals.toolset.isArray(nodesList)) { throw {
													name: 'ValueError',
													message: 'incorrect vertex matrix < ' + nodesList + ' >'
												};
			}
			var graph = nodesList;
			while(true) {
				var adductArr = globals.algorithms.adductionOnColumns(globals.algorithms.adductionOnRows(graph, false), false);
				var adductArrCopy = globals.toolset.matrix(adductArr.length, adductArr[0].length, 0);
				var temp;
				for(var i=0; i<adductArrCopy.length; i++) {
					temp = 0;
					while((temp = adductArr[i].indexOf(0, temp)) !== -1) {
						adductArrCopy[i][temp] = 1;
						temp++;
					}
				}
				var maxPairs = globals.algorithms.getMaxPairsMatching(adductArrCopy);
				var n = maxPairs.length;
				var nn = (globals.toolset.isArray(maxPairs[0]) ? maxPairs[0].length : 0);
				var orientGraph = globals.toolset.matrix(n + nn, n + nn, 0), k = 0;
				for(var i=0; i<n; i++) {
					for(var j=0; j<nn; j++) {
						if(maxPairs[i][j] === 0) {
							orientGraph[i][j+n] = adductArrCopy[i][j];
						} else {
							orientGraph[j+n][i] = 1;
							k++;
						}
					}
				}
				if(Math.min(n, nn) === k) {
					var sum = 0;
					for(var i=0; i<n; i++) {
						sum += nodesList[i][maxPairs[i].indexOf(1)];
					}
					return {'maxPairs': maxPairs, 'functional': sum};
				}
				var rows = [], columns = [], vertexPath;
				for(var i=0; i<maxPairs.length; i++) {
					if(maxPairs[i].indexOf(1) === -1) {
						vertexPath = globals.algorithms.getVertexPath(i + 1, orientGraph);
						for(var j=0; j<vertexPath.length; j++) {
							if((vertexPath[j] !== -1) && (vertexPath[j] !== i + 1)) {
								((j + 1) <= n) ? (rows.push(j), columns.push(vertexPath[j] - 1)) : (columns.push(j), rows.push(vertexPath[j] - 1));
							}
						}
					}
				}
				columnsFilter = globals.algorithms.diff(globals.toolset.createAndFillArray(n, n + nn, function(x) {return x + 1}), columns);
				var min = Number.POSITIVE_INFINITY;
				for(var i=0; i<rows.length; i++) {
					for(var j=0; j<columnsFilter.length; j++) {
						if(adductArr[rows[i]][columnsFilter[j]%n] < min) {
							min = adductArr[rows[i]][columnsFilter[j]%n];
							ri = rows[i];
							cj = columnsFilter[j]%n;
						}
					}
				}
				for(var i=0; i<rows.length; i++) {
					for(var j=0; j<adductArr[rows[i]].length; j++) {
						adductArr[rows[i]][j] -= min;
					}
				}
				for(var j=0; j<columns.length; j++) {
					for(var i=0; i<adductArr.length; i++) {
						adductArr[i][columns[j]%n] += min;
					}
				}
				graph = adductArr;
			}
		};
//----------------------------------------------------------------------------------------------
		var isBalanced = (function() {
			const openings = ["{", "(", "["];
			const closings = ["}", ")", "]"];

			var isParanthesis = function(ch) {
				return openings.includes(ch) || closings.includes(ch);
			};
			var isClosing = function(ch) {
				return closings.includes(ch);
			};
			var isOpening = function(ch) {
				return openings.includes(ch);
			};

			return function(str) {
				const stack = [];
				const strArr = str.split("");
				var result = true;
				for (let i = 0; i < strArr.length; i++) {
					const ch = strArr[i];
					if (isParanthesis(ch)) {
						if (isOpening(ch)) {
							stack.push(c);
						} else {
							const haveMatch = stack.length > -1 && (openings.indexOf(stack.pop()) === closings.indexOf(ch));
							if (!haveMatch) {
								return false;
							}
						}
					}
				}
				return !stack.length;
			};
		})();
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} nodesList Input array.
		*
		* @example
		* var distance = [[1, 0, 1, 0, 0],
		*				[1, 0, 1, 0, 0],
		*				[0, 1, 0, 0, 1],
		*				[0, 1, 0, 1, 0],
		*				[0, 0, 0, 1, 0]];
		* document.writeln(globals.algorithms.getMaxPairsMatching(distance));
		*/
		var getMaxPairsMatching = function(nodesList) {
			if(!globals.toolset.isArray(nodesList)) { throw {
													name: 'ValueError',
													message: 'incorrect vertex order matrix < ' + nodesList + ' >'
												};
			}
			// initialization step
			var n = nodesList.length;
			var nn = (globals.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
			if(n === 0 || nn === 0) { throw {
										name: 'ValueError',
										message: 'incorrect matrix size: rows < ' + n + ' >, columns < ' + nn + ' >'
									};
			}
			var vertex = [];
			var orientGraph = globals.toolset.matrix(n + nn, n + nn, 0);
			var vertexStatus = {CONNECTED: 1, DISCONNECTED: 0};
			var state = {SATURATED: 4, NOTSATURATED: 3};
			for(var i=0; i<n; i++) {
				for(var j=0; j<nn; j++) {
					if(nodesList[i][j] === vertexStatus.DISCONNECTED) continue;
					if((nodesList[i][j] === vertexStatus.CONNECTED) && (vertex.indexOf(i) === -1) && (vertex.indexOf(j+n) === -1)) {
						vertex.push(i);
						vertex.push(j+n);
						orientGraph[j+n][i] = state.SATURATED;
					} else {
						orientGraph[i][j+n] = state.NOTSATURATED;
					}
				}
			}
			// general step
			var i = 0;
			while(++i <= n) {
				if(vertex.indexOf(i-1) !== -1) continue;
				var orientPath = globals.algorithms.getVertexPath(i, orientGraph);
				var s = 0, ns = 0;
				for(var k=0; k<orientPath.length; k++) {
					if(orientPath[k] !== -1) {
						(orientGraph[orientPath[k]-1][k] === state.SATURATED) ? s++ : ns++;
					}
				}
				if((ns > s) && (ns * s)) {
					for(var k=0; k<orientPath.length; k++) {
						if(orientPath[k] !== -1) {
							orientGraph[k][orientPath[k]-1] = (orientGraph[orientPath[k]-1][k] === state.SATURATED) ? state.NOTSATURATED : state.SATURATED;
							orientGraph[orientPath[k]-1][k] = 0;
						}
					}
					i = 0;
				}
			}
			// output step
			var pairsGraph = globals.toolset.matrix(n, nn, 0);
			for(var i=0; i<n; i++) {
				for(var j=n; j<n+nn; j++) {
					pairsGraph[i][j%n] = ((orientGraph[i][j] === state.SATURATED) ? 1 : 0); //orientGraph[i].indexOf(state.SATURATED);
				}
			}
			for(var i=n; i<n+nn; i++) {
				for(var j=0; j<n; j++) {
					pairsGraph[j][i%n] = ((orientGraph[i][j] === state.SATURATED) ? 1 : 0); //orientGraph[i].indexOf(state.SATURATED);
				}
			}
			return pairsGraph;
		};
//----------------------------------------------------------------------------------------------
		//var X = [0, 'C', 'A', 'T', 'C', 'G', 'A'];
		//var Y = [0, 'G', 'T', 'A', 'C', 'C', 'G', 'T', 'C', 'A'];
		var longestCommonSequence = function(arrayX, arrayY) {

			var _longestCommonSequence = function _longestCommonSequence(arrayX, arrayY, table, i, j) {
				if( table[i][j] == 0 ) return '';
				if( arrayX[i] == arrayY[j] ) {
					return _longestCommonSequence(arrayX, arrayY, table, i-1, j-1) + arrayX[i];
				} else if( table[i][j-1] > table[i-1][j] ) {
					return _longestCommonSequence(arrayX, arrayY, table, i, j-1);
				} else if( table[i][j-1] <= table[i-1][j] ) {
					return _longestCommonSequence(arrayX, arrayY, table, i-1, j);
				}
			};

			if(!globals.toolset.isArray(arrayX) || !globals.toolset.isArray(arrayY)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: arrayX < ' + arrayX + ' >, arrayY < ' + arrayY + ' >'
																					};
			}
			var table = globals.toolset.vector(arrayX.length);
			for(var i=0; i<arrayX.length; i++) {
				table[i] = globals.toolset.vector();
				table[i][0] = 0;
			}
			for(var j=0; j<arrayY.length; j++) {
				table[0][j] = 0;
			}
			for(var i=1; i<arrayX.length; i++) {
				for(var j=1; j<arrayY.length; j++) {
					if( arrayX[i] == arrayY[j] ) {
						table[i][j] = table[i-1][j-1] + 1;
					} else {
						if( table[i-1][j] > table[i][j-1] ) {
							table[i][j] = table[i-1][j];
						} else {
							table[i][j] = table[i][j-1];
						}
					}
				}
			}
			return _longestCommonSequence(arrayX, arrayY, table, arrayX.length-1, arrayY.length-1);
		};
//----------------------------------------------------------------------------------------------
		var longestCommonSequence2 = function(str1, str2) {
			if(!globals.toolset.isString(str1) || !globals.toolset.isString(str2)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input values: str1 < ' + str1 + ' >, str2 < ' + str2 + ' >'
																					};
			}
			if(str1.length == 0 || str2.length == 0) {
				return '';
			}
			if(str1.equals(str2)) {
				return str1;
			}
			var matrix = globals.toolset.matrix(str1.length, str2.length, 0);
			var maxLength = 0, maxI = 0;

			for(var i=0; i<str1.length; i++) {
				for(var j=0; j<str2.length; j++) {
					if(str1.charAt(i) == str2.charAt(j)) {
						if (i != 0 && j != 0) {
							matrix[i][j] = matrix[i - 1][j - 1] + 1;
						} else {
							matrix[i][j] = 1;
						}
						if (matrix[i][j] > maxLength) {
							maxLength = matrix[i][j];
							maxI = i;
						}
					}
				}
			}
			return str1.substring(maxI - maxLength + 1, maxI + 1);
		};
//----------------------------------------------------------------------------------------------
		//http://msdn.microsoft.com/ru-ru/library/cc836466(v=vs.94).aspx
		var generateText = function(text, K, N, precCoeff) {
			precCoeff = precCoeff || 50;
			var analyze = function(text) {
				var i, key = [], count = Array.map(), freq = Array.map(), prob = Array.map();
				for(i=0; i<K; i++) {
					key.push('' + i);
				}
				var word;
				while(true) {
					word = "";
					if(count.has(key)) {
						count.put(key, count.get(key)++);
					} else {
						count.put(key, 1);
					}
					if(freq.has(key)) {
						if(freq.get(key).has(word)) {
							freq.put(key, freq.get(key).put(word, freq.get(key).get(word)++));
						} else {
							freq.put(key, freq.get(key).put(word, 1));
						}
					} else {
						freq.put(key, Array.map());
					}
					key.push(word);
					key.shift();
				}
				var keysmap = freq.keys();
				for(i=0; i<keysmap.length; i++) {
					var keysSubMap = freq.get(keysmap[i]).keys();
					var valuesSubMap = Array.map();
					for(j=0; j<keysSubMap.length; j++) {
						prob.put(keysmap[i], valuesSubMap.put(keysSubMap[i], freq.get(keysmap[i]).get(keysSubMap[i]) / count.get(keysmap[i])));
					}
				}
			};
			var getRandomWord = function(wordTable) {
				var keyMap = wordTable.keys(), i, j, words = [];
				for(i=0; i<keyMap.length; i++) {
					for(j=0; j<precCoeff * wordTable.get(keyMap[i]); j++) {
						words.push(keyMap[i]);
					}
				}
				if(words.length > 0) {
					return words[Math.floor(Math.random() * words.length)];
				}
			};
			analyze(text);
			var probKeys = prob.keys(), i;
			var curKey = probKeys[Math.floor(Math.random() * probKeys.length)];
			for(i=0; i<curKey.length; i++) {
				document.writeln(curKey[i]);
			}
			for(i=0; i<N-K; i++) {
				var temp = getRandomWord(prob.get(curKey));
				curKey.push(temp);
				curKey.shift();
				document.writeln(temp + " ");
			}
		};
//----------------------------------------------------------------------------------------------
		var getLuckyTickets = function(num) {
			num = (num == null) ? 1000 : (globals.toolset.isNumber(num) && num > 0) ? num : null;
			if(num == null) throw {name: 'ValueError', message: 'incorrect \'amount\' value: < ' + num + ' >'};
			//
			var digits = {}, tmp;
			for (var i=0; i<num; i+=1) {
				tmp = (i % 10 + ((i % 100) - (i % 10)) / 10 + (i / 100) ^ 0);
				if (!digits[tmp]) {
					digits[tmp] = 1;
				} else {
					digits[tmp] += 1;
				}
		   }
		   tmp = 0;
		   for (i in digits) {
			   tmp += digits[i] * digits[i];
		   }
		   return tmp;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Integer} start initial position.
		* @param {Array} nodesList Input array.
		*
		* @example
		* var distance = [[0, 1, 0, 0, 0, 0, 0],
		*				[0, 0, 1, 1, 0, 0, 0],
		*				[0, 0, 0, 1, 0, 0, 0],
		*				[0, 0, 0, 0, 1, 0, 0],
		*				[0, 0, 0, 0, 0, 0, 0],
		*				[0, 0, 0, 1, 0, 0, 1],
		*				[0, 0, 0, 0, 1, 0, 0]];
		* document.writeln(globals.algorithms.getVertexPath(1, distance));
		*/
		var getVertexPath = function(start, nodesList) {
			if(!globals.toolset.isIntNumber(start) || !globals.toolset.isArray(nodesList)) { throw {
																							name: 'ValueError',
																							message: 'incorrect input values: vertex order matrix < ' + nodesList + ' >, start vertex < ' + start + ' >'
																						};
			}
			var n = nodesList.length;
			var nn = (globals.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
			if(n === 0 || nn === 0 || n !== nn) { throw {
													name: 'ValueError',
													message: 'incorrect matrix size: rows < ' + n + ' >, columns < ' + nn + ' >'
												};
			}
			if(start < 1 || start > n) { throw {
											name: 'ValueError',
											message: 'incorrect start vertex: < ' + start + ' >'
										};
			}
			var state = {PASSED: true, NOTPASSED: false};
			var a = z = 0; // start/end of q
			var p = globals.toolset.vector(n, -1);
			var q = globals.toolset.vector(n, 0);
			q[a] = start;
			var r = globals.toolset.vector(n, state.NOTPASSED);
			do {
				for(var j=0; j<n; j++) {
					if((nodesList[q[a]-1][j] !== 0) && (r[j] === state.NOTPASSED)) {//nodesList[q[a] - 1].indexOf(1) !== -1
						z++;
						q[z] = j + 1;
						p[j] = q[a];
						r[j] = state.PASSED;
					}
				}
				a++;
			} while(a <= z);
			return p;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} nodesList Input array.
		* @return {Integer} minimum path.
		*
		* @example
		* var distance = [[0, 6, 8, 12, 9, 7],
		*				[6, 0, 2, 6, 3, 8],
		*				[8, 2, 0, 4, 5, 9],
		*				[12, 6, 4, 0, 9, 5],
		*				[9, 3, 5, 9, 0, 5],
		*				[7, 8, 9, 5, 5, 0]];
		* document.writeln(globals.algorithms.getMinMaxPath(distance));
		*/
		var getMinMaxPath = function(nodesList) {
			var res = globals.algorithms.getShortestPaths(nodesList);
			var len = res.length, inf = Number.POSITIVE_INFINITY, mima = inf, ma, ind;
			for(var i=0; i<len; i++) {
				//ma = res[i][0];
				//for(var j=1; j<len; j++) {
				//	if(res[i][j] > ma) {
				//		ma = res[i][j];
				//	}
				//}
				ma = globals.toolset.arrayMax(res[i]);
				if(ma < mima) {
					ind = i;
					mima = ma;
				}
			}
			var mai, maj, di, dj, inj, ini, dist;
			for(var i=0; i<len-1; i++) {
				for(var j=i+1; j<len; j++) {
					if(nodesList[i][j] === inf) continue;
					mai = 0; maj = 0;
					for(var k=0; k<len; k++) {
						if(k === i || k === j) continue;
						if(res[i][k] < inf) di = res[i][k];
						if(res[j][k] < inf) dj = res[j][k];
						if(di > dj) {
							if(dj > maj) {
								maj = dj;
								inj = k;
							}
						} else {
							if(di > mai) {
								mai = di;
								ini = k;
							}
						}
					}
					dist = Math.floor((mai + nodesList[i][j] + maj) / 2);
					if((dist <= mima) && ((dist - mai) > 0) && (dist < (mai + nodesList[i][j]))) {
						mima = dist;
						//document.writeln('between < ' + (i + 1) + ' > and < ' + (j + 1) + ' > on a distance < ' + (dist - mai) + ' > from < ' + (i + 1) + ' >\n');
						//between i and j on a distance (dist - mai) from i then distance to ini and inj = dist;
					}
				}
			}
			return mima;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} nodesList Input array.
		* @param {Array} weightedArray Input array of weights.
		* @return {Integer} minimum of weighted paths.
		*
		* @example
		* var distance = [[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24],
		*				[0, 9, 10, 15, 11, 17, 24]];
		* var weightedArray = [80, 100, 140, 90, 60, 50, 40];
		* document.writeln(globals.algorithms.getMinWeightedPath(distance, weightedArray));
		*/
		var getMinWeightedPath = function(nodesList, weightedArray) {
			if(!globals.toolset.isArray(weightedArray)) { throw {
												name: 'ValueError',
												message: 'incorrect type value: array of weights < ' + weightedArray + ' >'
											};
			}
			var res = globals.algorithms.getShortestPaths(nodesList);
			var len = res.length, sum, min = Number.POSITIVE_INFINITY;
			if(weightedArray.length !== len) return;
			for(var i=0; i<len; i++) {
				sum = 0;
				for(var j=0; j<len; j++) {
					sum += res[i][j] * weightedArray[j];
				}
				min = Math.min(sum, min);
			}
			return min;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		*
		* Floid-Warshall Algorithm
		* @param {Array} nodesList Input array.
		* @return {Array} shortest paths.
		*
		* @example
		* var undef = Number.POSITIVE_INFINITY;
		* var distance = [[0, 23, 12, undef, undef, undef, undef, undef],
		*				[23, 0, 25, undef, 22, undef, undef, 35],
		*				[12, 25, 0, 18, undef, undef, undef, undef],
		*				[undef, undef, 18, 0, undef, 20, undef, undef],
		*				[undef, 22, undef, undef, 0, 23, 14, undef],
		*				[undef, undef, undef, 20, 23, 0, 24, undef],
		*				[undef, undef, undef, undef, 14, 24, 0, 16],
		*				[undef, 35, undef, undef, undef, undef, 16, 0]];
		* document.writeln(globals.algorithms.getShortestPaths(distance));
		*/
		var getShortestPaths = function(nodesDist) {
			if(!globals.toolset.isArray(nodesDist)) { throw {
														name: 'ValueError',
														message: 'incorrect distance matrix: distance matrix < ' + nodesDist + ' >'
													};
			}
			var dist = globals.toolset.copyOfArray(nodesDist);
			var n = dist.length;
			for(var k=0; k<n; k++) {
				for(var i=0; i<n; i++) {
					for(var j=0; j<n; j++) {
						dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
					}
				}
			}
			return dist;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		*
		* Deijkstra algorithm
		* @param {Integer} start Initial vertex.
		* @param {Integer} end End vertex.
		* @param {Array} nodesList Input array.
		* @return {Object} minimum graph path.
		*
		* @example
		* var undef = Number.POSITIVE_INFINITY;
		* var distance = [[0, 23, 12, undef, undef, undef, undef, undef],
		*				[23, 0, 25, undef, 22, undef, undef, 35],
		*				[12, 25, 0, 18, undef, undef, undef, undef],
		*				[undef, undef, 18, 0, undef, 20, undef, undef],
		*				[undef, 22, undef, undef, 0, 23, 14, undef],
		*				[undef, undef, undef, 20, 23, 0, 24, undef],
		*				[undef, undef, undef, undef, 14, 24, 0, 16],
		*				[undef, 35, undef, undef, undef, undef, 16, 0]];
		* var res = globals.algorithms.getDeijkstraPath(3, 8, distance);
		* document.writeln(res.path + ' ' + res.length);
		*/
		var getDeijkstraPath = function(start, end, nodesDist) {
			if(!globals.toolset.isIntNumber(start) || !globals.toolset.isIntNumber(end) || !globals.toolset.isArray(nodesDist)) { throw {
																															name: 'ValueError',
																															message: 'incorrect input types: start vertex < ' + start + ' >, end vertex < ' + end + ' >, distance matrix < ' + nodesDist + ' >'
																														};
			}
			var n = nodesDist.length;
			if(start === end || start < 1 || end < 1 || start > n || end > n) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: start vertex < ' + start + ' >, end vertex < ' + end + ' >, number of vertices < ' + n + ' >'
																				};
			}

			var state = {PASSED: 1, NOTPASSED: 0};
			var a = globals.toolset.vector(n, state.NOTPASSED);
			var b = null;//globals.toolset.vector(n, 0);
			var c = globals.toolset.vector(n, start);
			a[start-1] = state.PASSED;
			c[start-1] = 0;
			b = nodesDist[start-1].slice(0);

			var minVertex, minIndex;
			while(a.indexOf(state.NOTPASSED) !== -1) {
				minVertex = Number.POSITIVE_INFINITY;
				minIndex = -1;
				for(var i=0; i<n; i++) {//b.length
					if(b[i] < minVertex && a[i] === state.NOTPASSED) {
						minVertex = b[i];
						minIndex = i;
					}
				}
				a[minIndex] = state.PASSED;
				for(var m=0; m<n; m++) {//a.length
					if((a[m] === state.NOTPASSED) && (minVertex + nodesDist[minIndex][m]) < b[m]) {
						b[m] = minVertex + nodesDist[minIndex][m];
						c[m] = minIndex + 1;
					}
				}
			}

			var len = b[end-1];
			var res = [], z = c[end-1];
			res.push(end);
			while(z !== 0) {
				res.push(z);
				z = c[z-1];
			}
			return {'path': res.reverse(), 'length': len};
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		*
		* Ford algorithm
		* @param {Integer} n Number of nodes.
		* @param {Integer} start Start node.
		* @param {Integer} end End node.
		* @param {Array} passages Set of objects {'x', 'y', 'time'}.
		* @return {Object} Shortest path {'start', 'end', 'path', 'time'}
		*/
		var fordShortesPath = (function() {

			// Структура переходов
			// x - начальная вершина;
			// y - конечная вершина
			// time - время в пути;
			// next - указатель на следующий переход;
			var makePassage = function(x, y, time, next) {
				return {'x': x, 'y': y, 'time': time, 'next': next};
			};

			var getPath = function(nodes, start, fin) {
				var path = [];
				var getShortestPath = function getShortestPath(s, f) {
					if(nodes[f - 1].yz != s) {
						getShortestPath(s, nodes[f - 1].yz);
					}
					path.push(nodes[f - 1].yz);
				};
				getShortestPath(start, fin);
				return path;
			};

			return function(n, start, end, passages) {

				var nodes = [], temp, i, f;
				for(i=0; i<n; i++) {
					temp = makeNode(0, null, Number.MAV_VALUE, null);
					nodes.push(temp);
				}

				if(!globals.toolset.isIntNumber(start) || !globals.toolset.isIntNumber(end)) { throw {
																								name: 'ValueError',
																								message: 'incorrect input parameters: start node < ' + start + ' >, end node < ' + end + ' >'
																							};
				}
				if((start > n) || (end > n)) return;
				if(start == end) return [];
				nodes[start - 1].best = 0;
				for(i=0; i<passages.length; i++) {
					temp = makePassage(passages[i].x, passages[i].y, passages[i].time, nodes[passages[i].x - 1].next);
					nodes[passages[i].x - 1].next = temp;
				}
				i = start;
				while(i != -1) {
					nodes[i - 1].sw = 1;
					temp = nodes[i - 1].next;
					while(temp) {
						f = nodes[i - 1].best + temp.time;
						if(f < nodes[temp.y - 1].best) {
							nodes[temp.y - 1].best = f;
							nodes[temp.y - 1].yz = i;
							nodes[temp.y - 1].sw = 0;
						}
						temp = temp.next;
					}
					i = -1;
					min = Number.MAX_VALUE;
					for(k=0; k<n; k++) {
						if(!(nodes[k].sw) && (nodes[k].best < min)) {
							min = nodes[k].best;
							i = k;
						}
					}
				}
				if(!nodes[fin - 1].sw) return;
				return {'start': fin, 'end': start, 'path': getPath(nodes, fin, start), 'time': nodes[fin - 1].best};
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		*
		* @param {Integer} num Number of nodes.
		* @param {Integer} start Start node.
		* @param {Integer} end End node.
		* @param {Object} passages Set of passages {'from', 'yz', 'time'}.
		* @return {Object} Shortest path {'bestTime', 'path'}
		*
		* @example
		* var res = globals.algorithms.shortestPath(5, 1, 5, [{'from': 1, 'yz': 2, 'time': 10}, {'from': 2, 'yz': 4, 'time': 15}, {'from': 4, 'yz': 5, 'time': 3}, {'from': 1, 'yz': 3, 'time': 17}, {'from': 3, 'yz': 5, 'time': 10}, {'from': 2, 'yz': 3, 'time': 2}]);
		* document.writeln('bestTime: ' + res.bestTime);
		* document.writeln('path: ' + res.path);
		*/
		var shortestPath = (function() {

			// Структура узла
			// bstm - лучшее время попадания в данный узел из начального узла;
			// bsyz - узел, из которого попадаешь в данный узел при прохождении из начального по кратчайшему пути;
			// sw - может ли участвовать данный узел в прохождении от начального к конечному;
			// h - указатель на структуру переходов, содержащую записи об узле, в который можно попасть из данного узла и время попадания в него;
			var makeNode = function(bstm, bsyz, sw, h) {
				return {'bstm': bstm, 'bsyz': bsyz, 'sw': sw, 'h': h};
			};

			// Структура переходов
			// time - время прохождения до узла;
			// yz - номер узла;
			// next - указатель на следующий узел;
			var makePassage = function(time, yz, next) {
				return {'time': time, 'yz': yz, 'next': next};
			};

			return function(num, start, end, passages) {
				var i, n, p, mas = [];
				if(!globals.toolset.isIntNumber(start) || !globals.toolset.isIntNumber(end)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input parameters: start node < ' + start + ' >, end node < ' + end + ' >'
																					};
				}
				if((start > num) || (end > num)) return;
				if(start == end) return [];
				for(i=1; i<=num; i++) {
					mas[i] = makeNode(Number.MAX_VALUE, 0, 0, null);
				}
				mas[start].bstm = 0;
				mas[start].sw = 1;
				for(i=0; i<passages.length; i++) {
					p = makePassage(passages[i].time, passages[i].yz, mas[passages[i]['from']].h)
					mas[passages[i]['from']].h = p;
				}
				n = start - 1;
				i = 0;
				while(i < num) {
					i++;
					n = n % num + 1;
					if(mas[n].sw) {
						p = mas[n].h;
						while(p !== null) {
							tm = mas[n].bstm + p.time;
							if(tm < mas[p.yz].bstm) {
								i = 0;
								mas[p.yz].bstm = tm;
								mas[p.yz].bsyz = n;
								mas[p.yz].sw = 1;
							}
							p = p.next;
						}
						mas[n].sw = 0;
					}
				}
				bestTime = mas[end].bstm.toFixed(2);
				n = end;
				var result = [];
				while(n) {
					result.push(n);
					n = mas[n].bsyz;
				}
				return {'bestTime': bestTime, 'path': result.join(' ')};
			};
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {String} str1 Initial string.
		* @param {String} str2 String to compare with.
		* @param {Integer} thresh difference coefficient.
		* @return {Boolean} Similarity flag.
		*
		* @example
		* document.writeln(globals.algorithms.similarStrings('polarity', 'hilarity', 3));
		*/
		var similarStrings = function(str1, str2, thresh) {
			if(!globals.toolset.isString(str1) || !globals.toolset.isString(str2)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: string1 < ' + a + ' >, string2 < ' + b + ' >'
																			};
			}
			thresh = (thresh == null) ? 2 : (globals.toolset.isNumber(thresh) && thresh >= 0) ? thresh : null;
			if(thresh == null) throw {name: 'ValueError', message: 'incorrect thresh value: < ' + thresh + ' >'};
			if(globals.calc.levenshteinDistance(str1, str2) < thresh) return true;
			return false;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} rates Initial rates.
		* @param {Integer} sum Amount.
		* @return {Array} Set of exchange rates.
		*/
		var exchangeRates = (function() {
			var rates_ = [5000, 1000, 500, 100, 50, 10, 5, 1]

			return function(rates, sum) {
				if(!globals.toolset.isArray(rates) || !globals.toolset.isNumber(sum)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input parameters: rates < ' + rates + ' >, sum < ' + sum + ' >'
																					};
				}
				rates = (globals.toolset.isArray(rates)) : rates : rates_;
				var change = globals.toolset.vector(rates.length, 0);
				for(var i=0; i<rates.length; i++) {
					while(sum > rates[i]) {
						sum -= rates[i];
						change[i]++;
					}
				}
				return change;//change[i] > 0 {change[i] + ' units of ' rates[i]}
			};
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Integer} rang matrix size.
		* @return {Array} Matrix of specified rang.
		*/
		var pascalTriangle = function(rang) {
			if(!globals.toolset.isIntNumber(rang)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: rang < ' + rang + ' >'
												};
			}
			var res = globals.toolset.matrix(rang, rang, 0);
			for(var i=0; i<rang; i++) {
				res[i][0] = 1;
				for(var j=1; j<=i; j++) {
					res[i][j] = res[i-1][j-1] + res[i-1][j];
				}
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {String} str String to encode.
		* @param {Integer} k Step size.
		* @return {String} Encoded string.
		*/
		var cesarEncode = function(str, k) {
			if(!globals.toolset.isString(str) || !globals.toolset.isIntNumber(k)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input parameters: string < ' + str + ' >, shift < ' + k + ' >'
																				};
			}
			var x, code;
			for(var i=0; i<str.length; i++) {
				code += String.fromCharCode((((str.charCodeAt(i) - 1039) + k) % 32 + 1040));
			}
			return code;
		};
		/**
		* @public
		* @module algorithms
		* @param {String} str String to decode.
		* @param {Integer} k Step size.
		* @return {String} Decoded string.
		*/
		var cesarDecode = function(str, k) {
			if(!globals.toolset.isString(str) || !globals.toolset.isIntNumber(k)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input parameters: string < ' + str + ' >, shift < ' + k + ' >'
																				};
			}
			var x, code;
			for(var i=0; i<str.length; i++) {
				code += String.fromCharCode((((str.charCodeAt(i) - 1040) - k) % 32 + 1039));
			}
			return code;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Integer} a Initial index.
		* @param {Integer} b Index to swap with.
		* @param {Integer} m Number of conversion.
		* @return {Array} Change set.
		*
		* @example
		* var res = globals.algorithms.swap([3, 4, 5, 6, 75, 6, 4, 2, 1, 5, 0], 0, 4, 2);
		*/
		var swapNum = function(array, a, b, m) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
			}
			if(array.length === 0) return;
			a = ((globals.toolset.isIntNumber(a) && a >= 0) ? a % array.length : 0);
			b = ((globals.toolset.isIntNumber(b) && b >= 0) ? b % array.length : 0);
			m = ((globals.toolset.isIntNumber(m) && m >= 0) ? m % array.length : 0);
			for(var i=0; i<m && a<array.length && b<array.length; i++, a++, b++) {
				swap_(array, a, b);
			}
			return array;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {String} str Input string.
		* @return {String} Max subphrase.
		*
		* @example
		* var res = globals.algorithms.maxPhrase('banana');
		* document.writeln('MaxPhrase: ' + res);
		*/
		var maxPhrase = function(str) {
			var comlen = function(a, b) {
				var cmp = cmpLocale_(a, b), i = 0;
				if(cmp === 0) return a.length;
				while(a.charAt(i) === b.charAt(i)) {
					i++;
				}
				return i;
			};
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: string < ' + str + ' >'
											};
			}
			var array = [], maxlen = 0, maxi = null;
			for(var i=0; i<str.length; i++) {
				array.push(str.substring(i));
			}
			array.sort();
			var coml;
			for(var i=0; i<array.length-1; i++) {
				if((coml = comlen(array[i], array[i+1])) > maxlen) {
					maxlen = coml;
					maxi = i;
				}
			}
			return (maxi === null) ? '' : array[maxi];
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Array} Sorted array.
		*/
		var getShuffleNum = function(array, n) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
													};
			}
			if(!globals.toolset.isIntNumber(n) || n > array.length) { throw {
																		name: 'ValueError',
																		message: 'incorrect input parameter: subArray length < ' + m + ' >'
																	};
			}
			var res = [];
			for(var i=0; i<n; i++) {
				res.push(array.randomElement());
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Integer} Max sum.
		*
		* Time: O(n)
		*/
		var maxSum = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			var maxSoFar = 0, maxEndingHere = 0;
			for(var i=0; i<array.length; i++) {
				maxEndingHere = Math.max(maxEndingHere + array[i], 0);
				maxSoFar = Math.max(maxSoFar, maxEndingHere);
			}
			return maxSoFar;
		};
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Integer} Max sum.
		*
		* Time: O(n log n)
		*/
		var maxSum2 = function(array) {
			var maxSum = function(l, u) {
				if(l > u) return 0;
				if(l == u) return Math.max(0, array[l]);
				var m = Math.floor((l + u) / 2), lmax = rmax = sum = 0;
				for(var i=m; i>=l; i--) {
					sum += array[i];
					lmax = Math.max(lmax, sum);
				}
				sum = 0;
				for(var j = m + 1; j<=u; j++) {
					sum += array[i];
					rmax = Math.max(rmax, sum);
				}
				return Math.max(lmax + rmax, maxSum(l, m), maxSum(m + 1, u));
			};
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			return maxSum(0, array.length - 1);
		};
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Integer} Max sum.
		*
		* Time: O(n * n)
		*/
		var maxSum3 = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			var cumArr = Array.vector(array.length, 0);
			cumArr[0] = array[0];
			for(var i=1; i<cumArr.length; i++) {
				cumArr[i] = cumArr[i-1] + array[i];
			}
			var maxSoFar = 0, sum;
			for(var i=1; i<cumArr.length; i++) {
				for(var j=i; j<cumArr.length; j++) {
					sum = cumArr[j] - cumArr[i - 1];
					maxSoFar = Math.max(maxSoFar, sum);
				}
			}
			return maxSoFar;
		};
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Integer} Max sum.
		*
		* Time: O(n * n)
		*/
		var maxSum4 = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
												name: 'ValueError',
												message: 'incorrect input parameter: array < ' + array + ' >'
											};
			}
			var maxSoFar = 0, sum;
			for(var i=0; i<array.length; i++) {
				sum = 0;
				for(var j=i; j<array.length; j++) {
					sum += array[j];
				}
				maxSoFar = Math.max(maxSoFar, sum);
			}
			return maxSoFar;
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @return {Integer} Max sum.
		*
		* @example
		* var res = globals.algorithms.polishNotation("(a+b)*(c+d)-e=");
		* document.writeln(res);
		*/
		var polishNotation = (function() {

			var priority = function(ch) {
				switch(ch) {
					case '*': case '/': return 3;
					case '-': case '+': return 2;
					case '(': 			return 1;
				}
				return 0;
			};
			var push = function(ch) {
				stackOpers.push(ch);
			};
			var getTop = function() {
				return stackOpers.getTop();
			};
			var pop = function() {
				//if(stackOpers.isNull()) return '=';
				return stackOpers.pop();
			};
			var isNull = function() {
				return stackOpers.isNull();
			};

			return function(str) {
				if(!globals.toolset.isString(str)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: string < ' + str + ' >'
												};
				}
				var stackOpers = globals.toolset.stack(), k = 0, output = '';
				var cha = 'a'.charCodeAt(0), chz = 'z'.charCodeAt(0);
				while(str[k] != '=') {
					if(str[k] == ')') {
						while(getTop() && getTop() != '(') {
							output += pop();
						}
						pop();
					}
					if((str[k]).charCodeAt(0) >= cha && (str[k]).charCodeAt(0) <= chz) {
						output += str[k];
					}
					if(str[k] == '(') {
						push(str[k]);
					}
					if(str[k] == '+' || str[k] == '-' || str[k] == '/' || str[k] == '*') {
						while(!isNull() && getTop() && priority(getTop()) >= priority(str[k])) {
							output += pop();
						}
						push(str[k]);
					}
					k++;
				}
				while(!isNull()) {
					output += pop();
				}
				output += '=';
				return output;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} arrays Input arrays.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted union array.
		*
		* @example
		* var result = globals.algorithms.arrayUnion([[1, 6, 3, 6, 7, 2], [4, 2, 5, 1, 6, 2, 4]]);
		* document.writeln(">> " + result);
		*/
		var arrayUnion = (function() {

			var min = function(arrays, index, size, n) {
				var minValue = Number.MAX_VALUE, ind , i;
				for(i=0; i<n; i++) {
					if(index[i] !== -1) {
						if(arrays[i][index[i]] < minValue) {
							minValue = arrays[i][index[i]];
							ind = i;
						}
					}
				}
				index[ind]++;
				if(index[ind] === size[ind]) {
					index[ind] = -1;
				}
				return minValue;
			};
			var size = function(arrays) {
				var i, j, sz = [];
				for(i=0; i<arrays.length; i++) {
					sz[i] = arrays[i].length;
				}
				return sz;
			};

			return function(arrays, cmp) {
				if(!globals.toolset.isArray(arrays)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: arrays < ' + arrays + ' >'
													};
				}
				var n = arrays.length;
				var index = globals.toolset.vector(n, 0);
				var x = 0, resultArray = [], sz = size(arrays);
				for(var i=0; i<n; i++) {
					globals.sorting.sort(arrays[i], cmp);
				}
				for(var i=0; i<n; i++) {
					for(var j=0; j<sz[i]; j++, x++) {
						resultArray[x] = min(arrays, index, sz, n);
					}
				}
				return resultArray;
			};
		}();
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array1 Input array.
		* @param {Array} array2 Input array to concat with.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Array} Sorted union array without duplicates.
		*
		* @example
		* var result = globals.algorithms.arrayConcat([3, 6, 8, 9], [1, 2, 4, 7, 15]);
		* document.writeln("result: " + result);
		*/
		var arrayConcat = (function() {

			var cmp_ = function(a, b) {
				if(a === b) {
					return 0;
				}
				if(typeof a === typeof b) {
					return a < b ? -1 : 1;//a.localCompare(b)
				}
				return typeof a < typeof b ? -1 : 1;
			};

			return function(array1, array2, cmp) {
				if(!globals.toolset.isArray(array1) || !globals.toolset.isArray(array2)) { throw {
																							name: 'ValueError',
																							message: 'incorrect input parameters: array1 < ' + array1 + ' >, array2 < ' + array2 + ' >'
																						};
				}

				cmp = globals.toolset.isFunction(cmp) ? cmp : cmp_;

				var i1 = 0, i2 = 0, ir = 0, res = [];
				while((i1 < array1.length) && (i2 < array2.length)) {
					if(cmp(array1[i1], array2[i2]) < 0) {
						res[ir] = array1[i1++];
					} else {
						res[ir] = array2[i2++];
					}
					ir++;
				}
				while((i1 < array1.length) || (i2 < array2.length)) {
					if(i1 < array1.length) {
						res[ir++] = array1[i1++];
					} else {
						res[ir++] = array2[i2++];
					}
				}
				return res;
			};
		}();
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Object} target Value to search for.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @param {Integer} min Start index.
		* @param {Integer} max End index.
		* @return {Integer} Index of search value.
		*
		* Time: O(n * log(n))
		*/
		var binSearch = (function() {

			return function(array, target, min, max, cmp) {

				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input array: array < ' + array + ' >'
												};
				}

				min = (globals.toolset.isIntNumber(min) && min > 0) ? min : 0;
				max = (globals.toolset.isIntNumber(max) && max > 0) ? max : array.length-1;
				cmp = globals.toolset.isFunction(cmp) ? cmp : cmpByDefault;

				var center, range, order;
				if(min > max) return -1;

				while(true) {
					range = max - min;
					if(range == 0 && array[min] != target) return -1;
					if(cmp(array[min], array[max]) > 0) {
						throw {
							name: 'ValueError',
							message: 'incorrect input parameter: array is not sorted < ' + array + ' >'
						};
					}
					center = Math.floor(range / 2 + min);
					order = cmp(target, array[center]);
					if(order == 0) {
						return center;
					} else if(order < 0) {
						max = center - 1;
					} else {
						min = center + 1;
					}
				}
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Object} target Value to search for.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Integer} Index of search value.
		*
		* Time: O(n * log(n))
		*/
		var binSearch2 = (function() {

			return function(array, target, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: array < ' + array + ' >'
												};
				}
				cmp = globals.toolset.isFunction(cmp) ? cmp : cmpByDefault;
				globals.sorting.sort(array);

				var i = array.length, l = -1, p;
				if(i === 0) return -1;
				while(i != 1) {
					i = Math.floor(i / 2);
					if(cmp(array[l + i], target) < 0) {
						l = l + i;
					}
				}
				p = l + 1;
				if(p > array.length || cmp(array[p], target) != 0) {
					return -1;
				}
				return p;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Object} target Value to search for.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Integer} Index of search value.
		*
		* Time: O(n * log(n))
		*/
		var binSearch3 = (function() {

			return function(array, target, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameters: array < ' + array + ' >'
													};
				}
				cmp = globals.toolset.isFunction(cmp) ? cmp : cmpByDefault;
				globals.sorting.sort(array);

				var i = 0, j = array.length - 1, k, order;
				if(array.length === 0) return -1;
				while(i < j) {
					k = Math.round((i + j)/ 2 + 0.5) - 1;
					order = cmp(target, array[k]);
					if(order < 0 || order == 0) {
						j = k;
					} else {
						i = k + 1;
					}
				}
				if(cmp(target, array[i]) == 0) return i;
				return -1;
			}
		}());
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Object} target Value to search for.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Integer} Index of search value.
		*
		* Time: O(n * log(n))
		*/
		var binSearch4 = (function() {

			var cmp_ = cmpByDefault;

			var binSearchR = function(array, str, first, last) {
				var mid = Math.floor((last + first) / 2);
				if(array[mid].isEmpty()) {
					var left = mid - 1;
					var right = mid + 1;
					while(true) {
						if(left < first && right > last) {
							return -1;
						} else if(right <= last && !array[right].isEmpty()) {
							mid = right;
							break;
						} else if(left >= first && !array[left].isEmpty()) {
							mid = left;
							break;
						}
						right++;
						left--;
					}
				}
				var order = cmp_(str, array[mid]);
				if(order == 0) {
					return mid;
				} else if(order > 0) {
					return binSearchR(array, str, mid + 1, last);
				} else {
					return binSearchR(array, str, first, mid - 1);
				}
			};

			return function(array, str, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameters: array < ' + array + ' >'
													};
				}
				if(!globals.toolset.isString(str)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: string < ' + str + ' >'
													};
				}
				cmp_ = globals.toolset.isFunction(cmp) ? cmp : cmp_;
				return binSearchR(array, str, 0, array.length - 1);
			}
		}());
//----------------------------------------------------------------------------------------------
		var interpolationSearch = (function() {

			return function(array, target, cmp) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameters: array < ' + array + ' >'
													};
				}
				cmp = globals.toolset.isFunction(cmp) ? cmp : cmpByDefault;
				globals.sorting.sort(array);

				var mid, low = 0, high = array.length - 1;
				while(array[low] < target && array[high] > target) {
					mid = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));
					var order = cmp(array[mid], target);
					if(order < 0) {
						low = mid + 1;
					} else if(order > 0) {
						high = mid - 1;
					} else {
						return mid;
					}
				}

				if(cmp(array[low], target) == 0) {
					return low;
				} else if(cmp(array[high], target) == 0) {
					return high;
				} else {
					return -1;
				}
			};
		}());
//------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Array} array Input array.
		* @param {Object} target Value to search for.
		* @param {Function} cmp Optional. A function that defines an
		* alternative sort order. The function should return a negative,
		* zero, or positive value, depending on the arguments.
		* @return {Integer} Index of search value.
		*
		* Time: O(n * log(n))
		*/
		var createWordRectangle = (function() {

			var newRectangle = (function() {

				var height = length = 0;
				var matrix = null;

				//var that = {};
				var that = Object.create(newRectangle.prototype);
				//that.prototype = newRectangle;
				//

				that.getLetter = function(i, j) {
					if(!globals.toolset.isIntNumber(i) || !globals.toolset.isIntNumber(j) || i < 0 || j < 0) { throw {
																name: 'ValueError',
																message: 'incorrect input parameters: row < ' + i + ' >, column < ' + j + ' >'
															};
					}
					return matrix[i][j];
				};

				that.getColumn = function(i) {
					if(!globals.toolset.isIntNumber(i) || i < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect inmput parameter: column < ' + i + ' >'
																};
					}
				};

				that.isComplete = function(l, h, groupList) {
					if(!globals.toolset.isIntNumber(l) || l < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input parameter: length < ' + l + ' >'
																};
					}
					if(!globals.toolset.isIntNumber(h) || h < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input parameter: height < ' + h + ' >'
																};
					}
					if(height == h) {
						for(var col, i=0; i<l; i++) {
							col = this.getColumn(i);
							if(!groupList.containsWord(col)) {
								return false;
							}
						}
						return true;
					}
					return false;
				};

				that.isPartialOK = function(l, trie) {
					if(height == 0) return true;
					for(var col, i=0; i<l; i++) {
						col = getColumn(i);
						if(!trie.contains(col)) {
							return false;
						}
					}
					return true;
				};

				that.append = function(s) {
					if(!globals.toolset.isString(s)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: string < ' + s + ' >'
													};
					}
					//
				};

				return function(letters) {
					if(!globals.toolset.isArray(letters)) { throw {
																name: 'ValueError',
																message: 'incorrect letters matrix < ' + letters + ' >'
															};
					}
					var n = letters.length;
					var nn = (globals.toolset.isArray(letters[0]) ? letters[0].length : 0);
					if(n === 0 || nn === 0) { throw {
												name: 'ValueError',
												message: 'incorrect letters size: rows < ' + n + ' >, columns < ' + nn + ' >'
											};
					}
					height = letters.length;
					length = letters[0].length;
					matrix = letters;
					return that;
				};

				/*return function(l) {
					if(!globals.toolset.isIntNumber(l)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: length < ' + l + ' >'
													};
					}
					height = 0;
					length = l;
				}*/
			}());

			var newWordGroupFactory = (function() {

				var newWordGroup = (function() {

					var lookup = globals.collections.hashmap();
					var group = globals.collections.arrayList();

					//var that = {};
					var that = Object.create(newWordGroup.prototype);
					//that.prototype = newWordGroup;
					//

					that.containsWord = function(s) {
						return lookup.containsKey(s);
					};

					that.addWord = function(s) {
						group.add(s);
						lookup.put(s, Boolean.TRUE);
					};

					that.length = function() {
						return group.size();
					};

					that.getWord = function(i) {
						return group.get(i);
					};

					that.getWords = function() {
						return group;
					};

					return function() {
						return that;
					};
				}());

				var that = {};
				that.createWordGroups = function(list) {
					if(!globals.toolset.isArray(list)) { 	throw {
																name: 'ValueError',
																message: 'incorrect input array: < ' + list + ' >'
															};
					}

					var maxWordLength = 0;
					for(var i=0; i<list.length; i++) {
						if(list[i].length() > maxWordLength) {
							maxWordLength = list[i].length();
						}
					}

					var groupList = globals.toolset.vector(maxWordLength, newWordGroup());
					for(var i=0; i<list.length; i++) {
						var wordLength = list[i].length()-1;
						if(groupList[wordLength] == null) {
							groupList[wordLength] = newWordGroup();
						}
						groupList[wordLength].addWord(list[i]);
					}
					return groupList;
				};
				return that;
			}());

			///////////////////////////////////
			var groupList = newWordGroupFactory.createWordGroups(list);
			var maxWordLength = groupList.length;
			var trieList = globals.toolset.vector(maxWordLength, newTrie());
			///////////////////////////////////

			/*var cmp_ = function(a, b) {
				if(a === b) {
					return 0;
				}
				if(typeof a === typeof b) {
					return a.localCompare(b)
				}
				return typeof a < typeof b ? -1 : 1;
			};*/

			var maxRectangle = function() {
				var maxSize = maxWordLength * maxWordLength;
				var j, rectangle = null;
				for(var z=maxSize; z>0; z--) {
					for(var i=1; i<=maxWordLength; i++) {
						if(z % i == 0) {
							j = z / i;
							if(j <= maxWordLength) {
								rectangle = makeRectangle(i, j);
								if(rectangle != null) {
									return rectangle;
								}
							}
						}
					}
				}
				return null;
			};

			var makeRectangle = function(length, height) {
				if(groupList[length-1] == null || groupList[height-1] == null) {
					return null;
				}
				if(trieList[height-1] == null) {
					var words = groupList[height-1].getWords();
					trieList[height-1] = newTrie(words);
				}
				return makePartialRectangle(length, height, newRectangle(length));
			};

			var makePartialRectangle = function(l, h, rectangle) {
				if(rectangle.height == h) {
					if(rectangle.isComplete(l, h, groupList[h-1])) {
						return rectangle;
					} else {
						return null;
					}
				}

				if(!rectangle.isPartialOK(l, trieList[h-1])) {
					return null;
				}

				for(var i=0; i<groupList[l-1].length(); i++) {
					var orgPlus = rectangle.append(groupList[l-1].getWord(i));
					var rect = makePartialRectangle(l, h, orgPlus);
					if(rect != null) {
						return rect;
					}
				}
				return null;
			};

			return function() {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameters: array < ' + array + ' >'
													};
				}
				//cmp = globals.toolset.isFunction(cmp) ? cmp : cmp_;
			}
		}());
//------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Integer} num Input number.
		* @return {String} String equivalent of number
		*/
		var numToString = (function() {

			const ZERO_NUMBER = "Zero";
			const NEGATIVE_NUMBER = "Negative";
			const HUNDRED_NUMBER = "Hundred";
			const DELIMITER = " ";

			var digits = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
			var teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
			var tens = ["Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
			var bigs = ["", "Thousand", "Million"];

			var numToString_ = function(num) {
				if(num == 0) {
					return ZERO_NUMBER;
				} else if(num < 0) {
					return NEGATIVE_NUMBER + DELIMITER + arguments.callee(-1 * num);
				}
				var count = 0, str = '';
				while(num > 0) {
					if(num % 1000 != 0) {
						str = numToString100(num % 1000) + bigs[count] + DELIMITER + str;
					}
					num /= 1000;
					count++;
				}
				return str;
			};

			var numToString100 = function(num) {
				var str = '';
				if(num >= 100) {
					str += digits[num / 100 - 1] + DELIMITER + HUNDRED_NUMBER + DELIMITER;
					num %= 100;
				}
				if(num >= 11 && num <= 19) {
					return str + teens[num - 11] + DELIMITER;
				} else if(num == 10 || num >= 20) {
					str += tens[num / 10 - 1] + DELIMITER;
					num %= 10;
				}
				if(num >= 1 && num <= 9) {
					str += digits[num - 1] + DELIMITER;
				}
				return str;
			};

			return function(num) {
				if(!globals.toolset.isIntNumber(num)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: integer < ' + num + ' >'
													};
				}
				return numToString_(num);
			}
		}());
//------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Integer} num Input number.
		* @return {String} String equivalent of number
		*/
		var findUnsortedSequence = (function() {

			var findEndOfLeftSubSequence = function(arr) {
				for(var i=1; i<arr.length; i++) {
					if(arr[i] < arr[i-1]) return (i-1);
				}
				return arr.length - 1;
			};

			var findStartOfRigthSubsequence = function(arr) {
				for(var i=arr.length-2; i>=0; i--) {
					if(arr[i] > arr[i+1]) return (i+1);
				}
				return 0;
			};

			var shrinkLeft = function(arr, minIndex, start) {
				var comp = arr[minIndex];
				for(var i=start-2; i>=0; i--) {
					if(arr[i] <= comp) return i+1;
				}
				return 0;
			};

			var shrinkRight = function(arr, maxIndex, start) {
				var comp = arr[maxIndex];
				for(var i=start; i<arr.length; i++) {
					if(arr[i] >= comp) return i-1;
				}
				return arr.length - 1;
			};

			return function(arr) {
				if(!globals.toolset.isArray(arr)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + arr + ' >'
													};
				}
				var endLeft = findEndOfLeftSubSequence(arr);
				var startRight = findStartOfRigthSubsequence(arr);

				var minIndex = endLeft + 1;
				if(minIndex >= arr.length) return;
				var maxIndex = startRight - 1;
				for(var i=endLeft; i<=startRight; i++) {
					if(arr[i] < arr[minIndex]) minIndex = i;
					if(arr[i] > arr[maxIndex]) maxIndex = i;
				}

				var leftIndex = shrinkLeft(arr, minIndex, endLeft);
				var rightIndex = shrinkRight(arr, maxIndex, startRight);

				return {'left': leftIndex, 'right': rightIndex};
			}
		}());
//------------------------------------------------------------------------------
		/**
		* @public
		* @module algorithms
		* @param {Integer} num Input number.
		* @return {String} String equivalent of number
		*/
		var getMax = (function() {

			return function(a, b) {
				if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
																						name: 'ValueError',
																						message: 'incorrect input parameters: a < ' + a + ' >, b < ' + b + ' >'
																					};
				}
				var c = a - b;
				var sa = globals.toolset.sign(a), sb = globals.toolset.sign(b), sc = globals.toolset.sign(c);

				var ua = sa ^ sb;
				var uc = flip(sa ^ sb);

				var k = ua * sa + uc * sc;
				var q = flip(k);

				return a * k + b * q;
			}
		}());
//------------------------------------------------------------------------------
		var search = function(array, left, right, elem) {
			var mid = Math.floor((left + right) / 2);
			if(elem == array[mid]) {
				return mid;
			}
			if(right < left) return -1;
			if(array[left] < array[mid]) {
				if(elem >= array[left] && elem <= array[mid]) {
					return search(array, left, mid - 1, elem);
				} else {
					return search(array, mid + 1, right, elem);
				}
			} else if(array[mid] < array[left]) {
				if(elem >= array[mid] && elem <= array[right]) {
					return search(array, mid + 1, right, elem);
				} else {
					return search(array, left, mid - 1, elem);
				}
			} else if(array[left] == array[mid]) {
				if(array[mid] != array[right]) {
					return search(array, mid + 1, right, elem);
				} else {
					var result = search(array, left, mid - 1, elem);
					if(result == -1) {
						return search(array, mid + 1, right, elem);
					} else {
						return result;
					}
				}
			}
			return -1;
		};
//------------------------------------------------------------------------------
		var merge = function(array1, array2, last1, last2) {
			var index1 = last1 - 1;
			var index2 = last2 - 1;
			var indexMerged = last2 + last1 - 1;

			while(index1 >= 0 && index2 >= 0) {
				if(array1[index1] > array2[index2]) {
					array1[indexMerged] = array1[index1];
					indexMerged--;
					index1--;
				} else {
					array1[indexMerged] = array2[index2];
					indexMerged--;
					index2--;
				}
			}

			while(index2 >= 0) {
				array1[indexMerged] = array2[index2];
				indexMerged--;
				index2--;
			}
		};
//------------------------------------------------------------------------------
		var placeQueens = (function() {

			const GRID_SIZE = 8;

			var placeQueens_ = function(row, columns, results) {
				if(row == GRID_SIZE) {
					results.push(Object.clone(columns));
				} else {
					for(var col=0; col<GRID_SIZE; col++) {
						if(checkValid(columns, row, col)) {
							columns[row] = col;
							placeQueens_(row+1, columns, results);
						}
					}
				}
			};

			var checkValid = function(columns, row1, column1) {
				for(var row2=0; row2<row1; row2++) {
					var column2 = columns[row2];
					if(column1 == column2) {
						return false;
					}

					var columnDistance = Math.abs(column2 - column1);

					var rowDistance = row1 - row2;
					if(columnDistance == rowDistance) {
						return false;
					}
				}
				return true;
			};

			return function(row, columns, results) {
				if(!globals.toolset.isArray(columns)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + columns + ' >'
													};
				}
				if(!globals.toolset.isIntNumber(row)) { throw {
															name: 'ValueError',
															message: 'incorrect input parameter: row < ' + row + ' >'
														};
				}
				results = results || [];
				placeQueens_(row, columns, results);
				return results;
			};
		}());

		var queen = (function() {

			var reQueen = function(arr, k) {
				var n = arr.length;
				if(k == n) return arr;
				for(var j=1; j<=n; j++) {
					var correct = true;
					for(var i=0; i<k; i++) {
						if(arr[i] == j || k-i == Math.abs(j-arr[i])) {
							correct = false;
							break;
						}
					}
					if(correct) {
						arr[k] = j
						var pos = recQueen(arr, k+1);
						if(pos != null) return pos;
					}
				}
				return null;
			};

			return function(n) {
				if(!globals.toolset.isIntNumber(n)) { throw {
															name: 'ValueError',
															message: 'incorrect input argument: size < ' + n + ' >'
														};
				}
				var vec = globals.toolset.vector(n);
				return recQueen(vec, 0);
			};
		}());
//------------------------------------------------------------------------------
		var paintFill = (function() {

			var paintFill_ = function(screen, x, y, ocolor, ncolor) {
				if(x < 0 || x >= screen[0].length || y < 0 || y >= screen.length) {
					return false;
				}
				if(screen[y][x] == ocolor) {
					screen[y][x] = ncolor;
					paintFill_(screen, x-1, y, ocolor, ncolor);
					paintFill_(screen, x+1, y, ocolor, ncolor);
					paintFill_(screen, x, y-1, ocolor, ncolor);
					paintFill_(screen, x, y+1, ocolor, ncolor);
				}
				return true;
			};

			return function(screen, x, y, ncolor) {
				if(!globals.toolset.isArray(screen)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + screen + ' >'
													};
				}
				if(!globals.toolset.isIntNumber(x) || !globals.toolset.isIntNumber(y)) { throw {
																							name: 'ValueError',
																							message: 'incorrect input parameter: row < ' + y + ' >, column < ' + x + ' >'
																						};
				}
				return paintFill_(screen, x, y, screen[y][x], ncolor);
			}
		}());
//------------------------------------------------------------------------------
		var generateParens = (function() {

			var addParen = function(list, leftRem, rightRem, str, count) {
				if(leftRem < 0 || rightRem < leftRem) return;
				if(leftRem == 0 && rightRem == 0) {
					list.push(str.join(''));
				} else {
					if(leftRem > 0) {
						str[count] = '(';
						addParen(list, leftRem-1, rightRem, str, count+1);
					}

					if(rightRem > leftRem) {
						str[count] = ')';
						addParen(list, leftRem, rightRem-1, str, count+1);
					}
				}
			};

			return function(count) {
				if(!globals.toolset.isIntNumber(count)) { throw {
															name: 'ValueError',
															message: 'incorrect input parameter: count < ' + count + ' >'
														};
				}
				var str = [], list = [];
				addParen(list, count, count, str, 0);
				return list;
			};
		}());
//------------------------------------------------------------------------------
		var getPerms = (function() {

			var insertCharAt = function(word, c, i) {
				var start = word.substring(0, i);
				var end = word.substring(i);
				return start + c + end;
			};

			var getPerms_ = function(str) {
				if(str == null) return null;
				var res = [];
				if(str.length == 0) {
					res.push('');
					return res;
				}
				var first = str[0];
				var remainder = str.substring(1);
				var words = getPerms_(remainder);
				words.forEach(function(value) {
					for(var j=0; j<=value.length; j++) {
						var s = insertCharAt(value, first, j);
						res.push(s);
					}
				});
				return res;
			};

			return function(str) {
				if(!globals.toolset.isString(str)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: string < ' + str + ' >'
													};
				}
				return getPerms_(str);
			};
		}());
//------------------------------------------------------------------------------
		var getSubsets = (function() {

			var getSubsets_ = function(set, index) {
				var allsubsets = null;
				if(set.length == index) {
					allsubsets = [];
					allsubsets.push([]);
				} else {
					allsubsets = getSubsets_(set, index+1);
					var item = set[index];
					var moresubsets = [];
					allsubsets.forEach(function(value) {
						var newsubset = [];
						Array.prototype.push.apply(newsubset, value);
						newsubset.push(item);
						moresubsets.push(newsubset);
					});
					Array.prototype.push.apply(allsubsets, moresubsets);
				}
				return allsubsets;
			};

			return function(set, index) {
				if(!globals.toolset.isArray(set)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + set + ' >'
													};
				}
				index = (index == null) ? 0 : (globals.toolset.isIntNumber(index) && index >= 0) ? index : null;
				if(index == null) throw {name: 'ValueError', message: 'incorrect index value: < ' + index + ' >'};
				return getSubsets_(set, index);
			};
		}());
//------------------------------------------------------------------------------
		//var a = getSubsets2(['a', 'b', 'c']);
		var getSubsets2 = (function() {

			var convertIntToSet = function(x, set) {
				var subset = [];
				var index = 0;
				for(var k=x; k>0; k>>=1) {
					if((k & 1) == 1) {
						subset.push(set[index]);
					}
					index++;
				}
				return subset;
			};

			var getSubsets2_ = function(set) {
				var allsubsets = {};
				//var allsubsets = [];
				var max = 1 << set.length;
				for(var k=0; k<max; k++) {
					var subset = convertIntToSet(k, set);
					allsubsets[k] = subset;
					//allsubsets.push(subset);
				}
				return allsubsets;
			};

			return function(set) {
				if(!globals.toolset.isArray(set)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + set + ' >'
													};
				}
				return getSubsets2_(set);
			};
		}());
//------------------------------------------------------------------------------
		var magicFast = (function() {

			var magicFast_ = function(array, start, end) {
				if(end < start || start < 0 || end >= array.length) {
					return -1;
				}

				var midIndex = Math.floor((start + end) / 2);
				var midValue = array[midIndex];
				if(midValue == midIndex) {
					return midIndex;
				}

				var leftIndex = Math.min(midIndex-1, midValue);
				var left = magicFast_(array, start, leftIndex);
				if(left >= 0) return left;

				var rightIndex = Math.max(midIndex+1, midValue);
				var right = magicFast_(array, rightIndex, end);
				return right;
			};

			return function(array) {
				if(!globals.toolset.isArray(array)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + array + ' >'
													};
				}
				return magicFast_(array, 0, array.length-1);
			};
		}());
//------------------------------------------------------------------------------
		//getPath([1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 1, 1]);
		var getPath = (function() {

			var point = function(x, y) {
				return {'x': x, 'y': y};
			}

			var getPath_ = function(maze, row, col, path, cache) {

				if(col < 0 || row < 0 || !maze[row][col]) {
					return false;
				}
				var p = point(row, col);

				//if(cache.containsKey(p)) {
				//	return cache.get(p);
				//}
				if(cache[p.x + ':' + p.y] != null) {
					return cache[p.x + ':' + p.y];
				}

				var isAtOrigin = (row == 0) && (col == 0);
				var success = false;

				if(isAtOrigin || getPath_(maze, row, col-1, path, cache) || getPath_(maze, row-1, col, path, cache)) {
					path.push(p);
					success = true;
				}

				//cache.put(p, success);
				cache[p.x + ':' + p.y] = success;
				return success;
			};

			return function(maze) {
				if(!globals.toolset.isArray(maze)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: array < ' + maze + ' >'
													};
				}
				if(maze.length == 0) return null;
				var path = [];
				var cache = {}; //globals.toolset.map();
				var lastRow = maze.length - 1;
				var lastCol = (globals.toolset.isArray(maze[0]) ? maze[0].length - 1 : 0);
				if(getPath_(maze, lastRow, lastCol, path, cache)) {
					return path;
				}
				return null;
			};
		}());
//------------------------------------------------------------------------------
		var countWaysDP = (function() {

			var countWaysDP_ = function(n, map) {
				if(n < 0) {
					return 0;
				} else if(n == 0) {
					return 1;
				} else if(map[n] > -1) {
					return map[n];
				} else {
					map[n] = countWaysDP_(n-1, map) + countWaysDP_(n-2, map) + countWaysDP_(n-3, map);
					return map[n];
				}
			};

			return function(n) {
				if(!globals.toolset.isIntNumber(n)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: number < ' + n + ' >'
													};
				}
				var map = [];
				return countWaysDP_(n, map);
			};
		}());
//------------------------------------------------------------------------------
		var getKthMagicNumber = function(k) {
			if(!globals.toolset.isIntNumber(k)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + k + ' >'
												};
			}
			if(k < 0) return 0;
			var val = 0;
			var queue3 = globals.collections.queue();
			var queue2 = globals.collections.queue();
			var queue1 = globals.collections.queue();
			queue3.enqueue(1);

			for(var i=0; i<=k; i++) {
				var v3 = queue3.size() > 0 ? queue3.front() : Number.MAX_VALUE;
				var v5 = queue5.size() > 0 ? queue5.front() : Number.MAX_VALUE;
				var v7 = queue7.size() > 0 ? queue7.front() : Number.MAX_VALUE
				val = Math.min(v3, v5, v7);
				if(val == v3) {
					queue3.dequeue();
					queue3.enqueue(3 * val);
					queue5.enqueue(5 * val);
				} else if(val == v5) {
					queue5.dequeue();
					queue5.add(5 * val);
				} else if(val == v7) {
					queue7.dequeue();
				}
				queue7.enqueue(7 * val);
			}
			return val;
		};
//------------------------------------------------------------------------------
		//var graphPoint = graphPoint(1, 1);
		var graphPoint = function(x, y) {
			var that = {};
			//var that = Object.create(graphPoint);
			//that.prototype = graphPoint;
			//
			that.equals = function(point) {
				return ((x === point.getX()) && (y === point.getY()));
			};
			that.getX = function() {
				return x;
			};
			that.getY = function() {
				return y;
			};
			that.toString = function() {
				console.log("(" + x + ", " + y + ")");
			};
			return that;
		};

		//var line = line(graphPoint(0, 0), graphPoint(1, 1));
		var line = function() {

			const EPSILON = 0.0001;

			return function(p, q) {
				var that = {};
				//var that = Object.create(graphPoint);
				//that.prototype = graphPoint;
				//
				var slope = null;
				var intercept = null;
				var infinite_slope = false;

				var init = function() {
					if(Math.abs(p.getX() - q.getX()) > EPSILON) {
						slope = ((p.getY() - q.getY()) / (p.getX() - q.getX())).toFixed(2);
						intercept = p.getY() - slope * p.getX();
					} else {
						infinite_slope = true;
						intercept = p.getX();
					}
				};
				that.getSlope = function() {
					return slope;
				};
				that.getIntercept = function() {
					return intercept;
				};
				that.equals = function(line) {
					return (((slope === null) ? (slope === line.getSlope()) : (this.isEqual(slope, line.getSlope())) && (this.isEqual(intercept, line.getIntercept())));
				};
				that.isEqual = function(a, b) {
					return (Math.abs(a - b) < EPSILON);
				};
				that.hashCode = function() {
					var sl = (slope * 1000) | 0;
					var in = (intercept * 1000) | 0;
					return s1 | in;
				};
				that.intersect = function(line2) {
					return (!isEqual(slope, line2.getSlope()) || isEqual(intercept, line2.getIntercept()));
				};
				init();
				return that;
			}
		}());

		//points.push(graphPoint(0, 0));
		//points.push(graphPoint(1, 1));
		var findBestLine = (function() {

			return function(points) {
				if(!globals.toolset.isArray(points)) { throw {
														name: 'ValueError',
														message: 'incorrect input parameter: points < ' + points + ' >'
													};
				}
				var bestLine = null;
				var lineCount = globals.collections.map();
				for(var i=0; i<points.length; i++) {
					for(var j=i+1; j<points.length; j++) {
						var line = line(points[i], points[j]);
						if(!lineCount.containsKey(line)) {
							lineCount.put(line, 0);
						}
						lineCount.put(line, lineCount.get(line) + 1);
						if(bestLine == null || lineCount.get(line) > lineCount.get(bestLine)) {
							bestLine = line;
						}
					}
				}
				return bestLine;
			};
		}());
//------------------------------------------------------------------------------
		var swapOddEvenBits = function(x) {
			if(!globals.toolset.isIntNumber(x)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + x + ' >'
												};
			}
			return ((x & 0xaaaaaaaa) >> 1 | (x & 0x55555555) << 1);
		};
//------------------------------------------------------------------------------
		var bitSwapRequired = function(a, b) {
			if(!globals.toolset.isIntNumber(a) || !globals.toolset.isIntNumber(b)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + x + ' >'
												};
			}
			var count = 0;
			for(var c = a ^ b; c != 0; c = c & (c - 1)) {
				count++;
			}
			return count;
		};
//------------------------------------------------------------------------------
		var printBinary = function(num) {
			if(!globals.toolset.isNumber(num)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + num + ' >'
												};
			}
			if(num >= 1 || num <= 0) {
				return null;
			}
			var binary = '.';
			while(num > 0) {
				var r = num * 2;
				if(r >= 1) {
					binary += 1;
					num = r - 1;
				} else {
					binary += 0;
					num = r;
				}
			}
			return binary;
		};
//----------------------------------------------------------------------------------------------
		var printBinary2 = function(num) {
			if(!globals.toolset.isNumber(num)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + num + ' >'
												};
			}
			if(num >= 1 || num <= 0) {
				return null;
			}
			var binary = '.';
			var frac = 0.5;
			while(num > 0) {
				if(num >= frac) {
					binary += 1;
					num -= frac;
				} else {
					binary += 0;
				}
				frac /= 2;
			}
			return binary;
		};
//------------------------------------------------------------------------------
		var checkBST = function(node) {

			var lastPrinted = Number.MIN_VALUE;

			var checkBST_ = function(node) {
				if(node == null) return null;
				if(!checkBST_(node.left)) return false;
				if(node.data < lastPrinted) return false;
				lastPrinted = node.data;
				if(!checkBST_(node.right)) return false;
				return true;
			};

			return checkBST_(node);
		};
//----------------------------------------------------------------------------------------------
		var checkBST = function(node) {

			var checkBST_ = function(node, min, max) {
				if(node == null) {
					return true;
				}
				if(node.data <= min || node.data > max) {
					return false;
				}
				if(!checkBST_(node.left, min, node.data) || !checkBST_(node.right, node.data, max)) {
					return false;
				}
				return true;
			};

			return checkBST_(node, Number.MIN_VALUE, Number.MAX_VALUE);
		};
//------------------------------------------------------------------------------
		var search = (function() {
			const UNVISITED = 1;
			const VISITED = 2;
			const VISITING = 3;

			var STATE = {'unvisited': UNVISITED, 'visited': VISITED, 'visiting': VISITING};

			return function(graph, start, end) {
				var q = globals.collections.queue();
				var nodes = graph.getNodes();
				for(var i=0; i<nodes.length; i++) {
					nodes[i].state = STATE.unvisited;
				}
				start.state = STATE.VISITING;
				q.enqueue(start);
				var u = null;
				while(!q.isEmpty()) {
					u = q.dequeue();
					if(u != null) {
						var list = u.getAdjacent();
						for(var i=0; i<list.length; i++) {
							if(list[i].state && list[i].state == STATE.unvisited) {
								if(list[i] == end) {
									return true;
								} else {
									list[i].state = STATE.visiting;
									q.enqueue(list[i]);
								}
							}
						}
						u.state = STATE.visited;
					}
				}
				return false;
			};
		}());
//------------------------------------------------------------------------------
		var compress = function(str) {

			var countCompression = function(str) {
				var last = str.charAt(0);
				var size = 0;
				var count = 1;
				for(var i=1; i<str.length; i++) {
					if(str.charAt(i) == last) {
						count++;
					} else {
						last = str.charAt(i);
						size += 1 + ('' + count).length;
						count = 0;
					}
				}
				size += 1 + ('' + count).length;
				return size;
			};

			var setChar = function(str, arr, c, index, count) {
				arr[index] = c;
				index++;
				var cnt = ('' + count).split('');
				cnt.forEach(function(value) {
					arr[index] = value;
					index++;
				});
				return index;
			};

			if(!globals.toolset.isString(str)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: string < ' + str + ' >'
												};
			}
			var size = countCompression(str);
			if(size >= str.length) {
				return str;
			}
			var arr = globals.toolset.vector(size);
			var index = 0;
			var last = str.charAt(0);
			var count = 1;
			for(var i=1; i<str.length; i++) {
				if(str.charAt(i) == last) {
					count++;
				} else {
					index = setChar(str, arr, last, index, count);
					last = str.charAt(i);
					count = 1;
				}
			}
			index = setChar(str, arr, last, index, count);
			return arr.join('');
		};
//----------------------------------------------------------------------------------------------
		var compress2 = function(str) {

			var countCompression = function(str) {
				var last = str.charAt(0);
				var size = 0;
				var count = 1;
				for(var i=1; i<str.length; i++) {
					if(str.charAt(i) == last) {
						count++;
					} else {
						last = str.charAt(i);
						size += 1 + ('' + count).length;
						count = 0;
					}
				}
				size += 1 + ('' + count).length;
				return size;
			};

			if(!globals.toolset.isString(str)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: string < ' + str + ' >'
												};
			}
			var size = countCompression(str);
			if(size >= str.length) {
				return str;
			}
			var myStr = '';
			var last = str.charAt(0);
			var count = 1;
			for(var i=1; i<str.length; i++) {
				if(str.charAt(i) == last) {
					count++;
				} else {
					myStr += (last + count);
					last = str.charAt(i);
					count = 1;
				}
			}
			myStr += (last + count);
			return myStr;
		};
//----------------------------------------------------------------------------------------------
		var sieveOfEratosthenes = function(max) {

			var crossOff = function(flags, prime) {
				for(var i=prime*prime; i<flags.length; i+=prime) {
					flags[i] = 0;
				}
			};

			var getNextPrime = function(flags, prime) {
				var next = prime + 1;
				while(next < flags.length && !flags[next]) {
					next++;
				}
				return next;
			};

			if(!globals.toolset.isIntNumber(max)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: max number < ' + max + ' >'
												};
			}
			var flags = globals.toolset.vector(max, 1);
			flags[0] = 0;
			flags[1] = 0;
			var count = 0;
			var prime = 2;
			while(prime <= max) {
				crossOff(flags, prime);
				prime = getNextPrime(flags, prime);
				if(prime >= flags.length) {
					break;
				}
			}
			return flags;
		};
//----------------------------------------------------------------------------------------------
		var isPrime = function(n) {
			if(!globals.toolset.isIntNumber(n)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + n + ' >'
												};
			}
			if(n < 2) {
				return false;
			}
			var sqrt = Math.sqrt(n) | 0;
			for(var i=2; i<=sqrt; i++) {
				if(n % i == 0) return false;
			}
			return true;
		};
//----------------------------------------------------------------------------------------------
		var isEven = function(n) {
			if(!globals.toolset.isIntNumber(n)) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + n + ' >'
												};
			}
			return ((n & 0x1) == 0);
		};
//----------------------------------------------------------------------------------------------
		var countBits = function(n) {
			if(!globals.toolset.isIntNumber(n) || n < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + n + ' >'
												};
			}
			var accum = n, count = 0;
			while(accum > 0) {
				accum &= (accum - 1);
				count++;
			}
			return count;
		};
//----------------------------------------------------------------------------------------------
		var snapInteger = function(n, multiplier) {
			if(!globals.toolset.isNumber(n) || !globals.toolset.isNumber(multiplier) || multiplier < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + n + ' >'
												};
			}
			return ((((n + (multiplier / 2.0)) | 0) / multiplier) * multiplier) | 0;
		};
//----------------------------------------------------------------------------------------------
		var snapDouble = function(n, multiplier, precision) {
			if(!globals.toolset.isNumber(n) || !globals.toolset.isNumber(multiplier) || multiplier < 0 || !globals.toolset.isNumber(precision) || precision < 0) { throw {
													name: 'ValueError',
													message: 'incorrect input parameter: number < ' + n + ' >'
												};
			}
			var scalar = Math.pow(10, precision);
			return snapInteger(scalar * n, (scalar * multiplier) | 0) / scalar;
		};
//----------------------------------------------------------------------------------------------
		var	getBit = function(num, i) {
			return ((num & (1 << i)) != 0);
		};
		var setBit = function(num, i) {
			return num | (1 << i);
		};
		var clearBit = function(num, i) {
			var mask = ~(1 << i);
			return (num & mask);
		};
		var clearBitsMSBthroughI = function(num, i) {
			var mask = (1 << (i+1)) - 1;
			return (num & mask);
		};
		var clearBitsIthrough0 = function(num, i) {
			var mask = ~((1 << (i+1)) - 1);
			return (num & mask);
		};
		var updateBit = function(num, i, v) {
			var mask = ~(1 << i);
			return ((num & mask) | (v << i));
		};
		var flip = function(bit) {
			return 1 ^ bit;
		};
//----------------------------------------------------------------------------------------------
		var nod = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: not array < ' + array + ' >'
												};
			}

			var n = array.length, x = Math.abs(array[0]);
			for (var i=1; i<n; i++) {
				var y = Math.abs(array[i]);
				while (x && y) {
					(x > y ? x %= y : y %= x);
				}
				x += y;
			}
			return x;
		};
//----------------------------------------------------------------------------------------------
		var nok = function(array) {
			if(!globals.toolset.isArray(array)) { throw {
													name: 'TypeError',
													message: 'incorrect input argument: not array < ' + array + ' >'
												};
			}

			var n = array.length, a = Math.abs(array[0]);
			for (var i=1; i<n; i++) {
				var b = Math.abs(array[i]), c = a;
				while (a && b) {
					(a > b ? a %= b : b %= a);
				}
				a = Math.abs(c * array[i]) / (a + b);
			}
			return a;
		};
//----------------------------------------------------------------------------------------------
		//Решето́ <Сундара́ма> — детерминированный алгоритм нахождения всех простых чисел до некоторого целого числа
		var sundarama = function(n) {
			if(!globals.toolset.isIntNumber(n) || n < 0) {
													throw {
															name: 'TypeError',
															message: 'incorrect input argument: <n> is not positive integer < ' + n + ' >'
													};
			}
			var a = globals.toolset.vector(n, 0);
			var res = globals.toolset.vector();
			for(var i=1; 3*i+1<n; i++) {
				for(var j=1; (k=i+j+2*i*j) < n && j <= i; j++) {
					a[k] = 1;
				}
			}
			for(var i=1; i<n; i++) {
				if(a[i] == 0) {
					res.push(2 * i + 1);
				}
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		//faststep(2, 2, 0) == 4
		var faststep = function (val, step, mod) {
			if(!globals.toolset.isIntNumber(val)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <val> is not number < ' + val + ' >'
										};
			}
			if(!globals.toolset.isIntNumber(step)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <step> is not number < ' + step + ' >'
										};
			}
			//
			mod = (mod == null) ? 0 : (globals.toolset.isIntNumber(mod) && mod > 0) ? mod : null;
			if(mod == null) throw {name: 'ValueError', message: 'incorrect \'mod\' value: < ' + mod + ' >'};
			//
			var s = 1, v = step, c = val;
			while (v != 0) {
				flag = 0;
				if (v%2 == 1) {
					if (!mod)
						s = s*c;
					else
						s = (s*c) % mod;
					v = (v-1)/2;
					if (!mod)
						c = c*c;
					else
						c = (c*c) % mod;
					flag = 1;
				}
				else {
					v = v/2;
				}
				if (!flag)
					if (!mod)
						c = c*c;
					else
						c = (c*c) % mod;
			}
			return s;
		};
//----------------------------------------------------------------------------------------------
		//faststep(2, 2) == 4
		var fastStep2 = function(t, k) {
			if(!globals.toolset.isIntNumber(t)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <base> is not number < ' + t + ' >'
										};
			}
			if(!globals.toolset.isIntNumber(k)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <power> is not number < ' + k + ' >'
										};
			}
			var res = 1;
			while(k) {
				if(k & 1) {
					res *= t;
				}
				t *= t;
				k >>= 1;
			}
			return res;
		};
//----------------------------------------------------------------------------------------------
		var gcd = function(m, n) { // НОД двух чисел
			if(!globals.toolset.isIntNumber(m)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <m> is not number < ' + m + ' >'
										};
			}
			if(!globals.toolset.isIntNumber(n)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <n> is not number < ' + n + ' >'
										};
			}
			var factor = 1;
			while(true) {
				//НОД(0, n) = n; НОД(m, 0) = m; НОД(m, m) = m;
				if(m == n) {
					if(m == 0)
						return m;
					else
						return (factor * m);
				}
				if(m == 0) return (factor * n);
				if(n == 0) return (factor * m);
				//НОД(1, n) = 1; НОД(m, 1) = 1;
				if(m == 1 || n == 1) return factor;
				//Если m, n чётные, то НОД(m, n) = 2 * НОД(m/2, n/2);
				if(!(m & 1) && !(n & 1)) {
					factor <<= 1;
					m >>= 1;
					n >>= 1;
				}
				//Если m чётное, n нечётное, то НОД(m, n) = НОД(m/2, n);
				else if(!(m & 1)) m >>= 1;
				//Если n чётное, m нечётное, то НОД(m, n) = НОД(m, n/2);
				else if(!(n & 1)) n >>= 1;
				//Если m, n нечётные и n > m, то НОД(m, n) = НОД((n-m)/2, m);
				else if(n > m) n = (n - m) >> 1;
				//Если m, n нечётные и n < m, то НОД(m, n) = НОД((m-n)/2, n);
				else m = (m - n) >> 1;
			}
		};
//----------------------------------------------------------------------------------------------
		var gcd2 = function(m,n){ // НОД двух чисел
			if(!globals.toolset.isIntNumber(m)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <m> is not number < ' + m + ' >'
										};
			}
			if(!globals.toolset.isIntNumber(n)) {
										throw {
											name: 'TypeError',
											message: 'incorrect input argument: <n> is not number < ' + n + ' >'
										};
			}

			if(m == 0 || n == 0) {
				return m | n;
			}

			//Let shift := lg K, where K is the greatest power of 2, dividing both u and v.
			for(var shift=0; ((m|n)&1) == 0; shift++) {
				m >>= 1;
				n >>= 1;
			}

			while((m & 1) == 0) {
				m >>= 1;
			}

			do {
				while((n & 1) == 0) {
					n >>= 1;
				}

				//Let u = min(u, v), v = diff(u, v)/2. */
				if(m < n) {
					n -= m;
				} else {
					var diff = m - n;
					m = n;
					n = diff;
				}
				n >>= 1;
			} while(n != 0);

			return m << shift;
		};
//----------------------------------------------------------------------------------------------
		/**
		*	var p1 = new globals.collections.utils.Point3d(1, 1, 1);
		*	var p2 = new globals.collections.utils.Point3d(2, 2, 2);
		*	var area = {nlu: p1, frb: p2};
		*		nlu: near_left_upper
		*		frb: far_right_bottom
		*/
		var cohenSutherlandClip = (function() {

			const BOTTOM = 1;
			const LEFT = 2;
			const TOP = 4;
			const RIGHT = 8;
			const BACK = 16;
			const FRONT = 32;

			var getCode = funcxtion(point, area) {
				var code = 0;
				if(point.y > area.nlu.y) {
					code |= TOP;
				} else if(point.y < area.frb.y) {
					code |= BOTTOM;
				}
				if(point.x > area.frb.x) {
					code |= RIGHT:
				} else if(point.x < area.nlu.x) {
					code |= LEFT;
				}
				if(point.z < area.nlu.z) {
					code |= FRONT;
				} else if(point.z > area.frb.z) {
					code |= BACK;
				}
				return code;
			};

			return function(beginPoint, endPoint, areaObj) {
				// Коды концов отрезка
				var outcode0 = 0, outcode1 = 0, outcodeOut = 0;
				// Флаг видимости и флаг завершения отсечения
				var accept = false, done = false;
				// Вычисляем начальные коды концов отрезка
				outcode0 = getCode(beginPoint, areaObj);
				outcode1 = getCode(endPoint, areaObj);

				var x, y, z;
				var p1 = p2 = null;
				do {
					// Отрезок полностью видимый
					if(!(outcode0 | outcode1)) {
						accept = true;
						done = true;
					// Отрезок полностью невидимый
					} else if(outcod0 & outcode1) {
						done = true;
					// Отрезок частично видимый. Вычисление точек пересечения отрезка и области отсечения
					} else {
						outcodeOut = outcode0 ? outcode0 : outcode1;
						if(outcodeOut & TOP) {
							x = beginPoint.getX() + (endPoint.getX() - beginPoint.getX()) * (areaObj.nlu.getY() - beginPoint.getY()) / (endPoint.getY() - beginPoint.getY());
							z = beginPoint.getZ() + (endPoint.getZ() - beginPoint.getZ()) * (areaObj.nlu.getY() - beginPoint.getY()) / (endPoint.getY() - beginPoint.getY());
							y = areaObj.nlu.getY();
						} else if(outcodeOut & BOTTOM) {
							x = beginPoint.getX() + (endPoint.getX() - beginPoint.getX()) * (areaObj.frb.getY() - beginPoint.getY()) / (endPoint.getY() - beginPoint.getY());
							z = beginPoint.getZ() + (endPoint.getZ() - beginPoint.getZ()) * (areaObj.frb.getY() - beginPoint.getY()) / (endPoint.getY() - beginPoint.getY());
							y = areaObj.frb.getY();
						} else if(outcodeOut & RIGHT) {
							y = beginPoint.getY() + (endPoint.getY() - beginPoint.getY()) * (areaObj.frb.getX() - beginPoint.getX()) / (endPoint.getX() - beginPoint.getX());
							z = beginPoint.getZ() + (endPoint.getZ() - beginPoint.getZ()) * (areaObj.frb.getX() - beginPoint.getX()) / (endPoint.getX() - beginPoint.getX());
							x = areaObj.frb.getX();
						} else if(outcodeOut & LEFT) {
							y = beginPoint.getY() + (endPoint.getY() - beginPoint.getY()) * (areaObj.nlu.getX() - beginPoint.getX()) / (endPoint.getX() - beginPoint.getX());
							z = beginPoint.getZ() + (endPoint.getZ() - beginPoint.getZ()) * (areaObj.nlu.getX() - beginPoint.getX()) / (endPoint.getX() - beginPoint.getX());
							x = areaObj.nlu.getX();
						} else if(outcodeOut & FRONT) {
							x = beginPoint.getX() + (endPoint.getX() - beginPoint.getX()) * (areaObj.nlu.getZ() - beginPoint.getZ()) / (endPoint.getZ() - beginPoint.getZ());
							y = beginPoint.getT() + (endPoint.getY() - beginPoint.getY()) * (areaObj.nlu.getZ() - beginPoint.getZ()) / (endPoint.getZ() - beginPoint.getZ());
							z = areaObj.frb.getZ();
						} else if(outcodeOut & BACK) {
							x = beginPoint.getX() + (endPoint.getX() - beginPoint.getX()) * (areaObj.frb.getZ() - beginPoint.getZ()) / (endPoint.getZ() - beginPoint.getZ());
							y = beginPoint.getT() + (endPoint.getY() - beginPoint.getY()) * (areaObj.frb.getZ() - beginPoint.getZ()) / (endPoint.getZ() - beginPoint.getZ());
							z = areaObj.nlu.getZ();
						}
						if(outcodeOut == outcode0) {
							p1 = new globals.collections.utils.Point3d(x, y, z);
							outcode0 = getCode(p1, areaObj);
						} else {
							p2 = new globals.collections.utils.Point3d(x, y, z);
							outcode1 = getCode(p2, areaObj);
						}
					}
				} while(!done);

				// Отрезок полностью видимый. Вывод отрезка на экран.
				if(accept) {
					//return {start: p1, end: p2}
					return new globals.collections.utils.Line([p1, p2]);
				}
			};
		}());
//----------------------------------------------------------------------------------------------
		//Exports
		globals.algorithms.binSearch = binSearch;

		globals.algorithms.arrayConcat = arrayConcat;
		globals.algorithms.arrayUnion = arrayUnion;

		globals.algorithms.polishNotation = polishNotation;
		globals.algorithms.maxSum = maxSum;
		globals.algorithms.getShuffleNum = getShuffleNum;
		globals.algorithms.maxPhrase = maxPhrase;
		globals.algorithms.swapNum = swapNum;
		globals.algorithms.cesarEncode = cesarEncode;
		globals.algorithms.cesarDecode = cesarDecode;
		globals.algorithms.pascalTriangle = pascalTriangle;
		globals.algorithms.exchangeRates = exchangeRates;
		globals.algorithms.shortestPath = shortestPath;
		globals.algorithms.fordShortesPath = fordShortesPath;
		globals.algorithms.getDeijkstraPath = getDeijkstraPath;
		globals.algorithms.getShortestPaths = getShortestPaths;
		globals.algorithms.getMinWeightedPath = getMinWeightedPath;
		globals.algorithms.getMinMaxPath = getMinMaxPath;
		globals.algorithms.getVertexPath = getVertexPath;
		globals.algorithms.getMaxPairsMatching = getMaxPairsMatching;
		globals.algorithms.getMinUtility = getMinUtility;
	}());
})(typeof exports !== 'undefined' ? exports : this);
