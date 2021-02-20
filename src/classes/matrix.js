jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.matrix = function(spec) {
	var matrix1 = [];
	//var that = {};
	var that = Object.create(jsar.utils.matrix.prototype);
	//that.prototype = jsar.utils.matrix;
	//
	var init = function() {
		if(!jsar.toolset.isNull(spec)) {
			if(!jsar.toolset.isObject(spec)) {
				throw jsar.exception.typeException({name: 'TypeException', message: 'incorrect initialization value: [object]'});
				//throw {
				//								name: 'ValueError',
				//								message: 'incorrect initialization value: [object]'
				//							};
			}
			if(Object.prototype.hasOwnProperty.call(spec, 'matrix')/*spec.hasOwnProperty('matrix')*/ && jsar.toolset.isArray(spec.matrix)) {
				spec.matrix.forEach(function(item, i) {
					(jsar.toolset.isArray(item)) ? matrix1.push(item.slice(0)) : matrix1.push(item);
				});
			} else if(Object.prototype.hasOwnProperty.call(spec, 'rows') && Object.prototype.hasOwnProperty.call(spec, 'columns')/*spec.hasOwnProperty('rows') && spec.hasOwnProperty('columns')*/ && jsar.toolset.isIntNumber(spec.rows) && jsar.toolset.isIntNumber(spec.columns) && spec.rows > 0 && spec.columns > 0) {
				matrix1 = jsar.toolset.matrix(spec.rows, spec.columns, 0);
			} else {
				throw jsar.exception.argumentException({name: 'ArgumentException', message: 'incorrect initialization value: {\'matrix\': [array of elements]} or {\'rows\': [integer number] > 0, \'columns\': [integer number] > 0}'});
				//throw {
				//	name: 'ValueError',
				//	message: 'incorrect initialization value: {\'matrix\': [array of elements]} or {\'rows\': [integer number] > 0, \'columns\': [integer number] > 0}'
				//};
			}
		}
	};
	var det1 = function(matrix) {
		return matrix[0];
	};
	var det2 = function(matrix) {
		return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	};
	var det3 = function(matrix) {
		var result = 0, n = 3;
		for(var i=0; i<n; i++) {
			result += (Math.pow(-1, i) * matrix[0][i]) * (matrix[n - 2][(i + 1) % n] * matrix[n - 1][(i + 2) % n] - matrix[n - 2][(i + 2) % n] * matrix[n - 1][(i + 1) % n]);
		}
		return result;
	};
	var detn = function(matrix) {
		var result = 0, i = 1;
		for(var j=0; j<matrix.length; j++) {
			result += Math.pow(-1, i + j + 1) * calculateDeterminant(getSubMatrix(i - 1, j, matrix));
		}
		return result;
	};
	var getSubMatrix = function(i, j, matrix) {
		var subMatrix = [], tmp;
		for(var ii=0; ii<matrix.length; ii++) {
			if(ii === i) continue;
			tmp = [];
			for(var jj=0; jj<matrix[0].length; jj++) {
				if(jj === j) continue;
				tmp.push(matrix[ii][jj]);
			}
			subMatrix.push(tmp);
		}
		return subMatrix;
	};
	var calculateDeterminant = function(subMatrix) {
		var len = subMatrix.length;
		switch(len) {
			case 1: return det1(subMatrix);
			case 2: return det2(subMatrix);
			case 3: return det3(subMatrix);
			default: return detn(subMatrix);
		}
	};
	var isMatrix = function(x) {
		return (x instanceof jsar.utils.matrix);
	};
	that.multMatrix = function(matrix2) {
		if(!isMatrix(matrix2)) { throw {
									name: 'ValueError',
									message: 'not matrix instance: < ' + matrix2 + ' >'
								};
		}
		var mi2 = matrix2.getRowsNum(), mj2 = matrix2.getColumnsNum();
		var mi1 = this.getColumnsNum(), mj1 = this.getColumnsNum();
		if(mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mj1 !== mi2) { throw {
																				name: 'MatrixSizeError',
																				message: 'incorrect matrix size: matrix1<' + mi1 + ', ' + mj1 + '>, matrix2<' + mi2 + ', ' + mj2 + '>'
																			};
		}
		var result = jsar.toolset.matrix(mi2, mj1, 0);
		for(var i=0; i<mi2; i++) {
			for(var j=0; j<mj1; j++) {
				for(var k=0; k<mj1; k++) {
					result[i][j] += matrix1[i][k] * matrix2.getElementAt(k + 1, j + 1);
				}
			}
		}
		return jsar.utils.matrix({'matrix': result});
	};
	that.sum = function(matrix2) {
		if(!isMatrix(matrix2)) { throw {
									name: 'ValueError',
									message: 'not matrix instance: < ' + matrix2 + ' >'
								};
		}
		var mi2 = matrix2.getRowsNum(), mj2 = matrix2.getColumnsNum();
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) { throw {
																								name: 'MatrixSizeError',
																								message: 'incorrect matrix size: matrix1<' + mi1 + ', ' + mj1 + '>, matrix2<' + mi2 + ', ' + mj2 + '>'
																							};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				matrix1[i][j] += matrix2.getElementAt(i + 1, j + 1);
			}
		}
		return this;
	};
	that.diff = function(matrix2) {
		if(!isMatrix(matrix2)) { throw {
									name: 'ValueError',
									message: 'not matrix instance: < ' + matrix2 + ' >'
								};
		}
		var mi2 = matrix2.getRowsNum(), mj2 = matrix2.getColumnsNum();
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) { throw {
																								name: 'MatrixSizeError',
																								message: 'incorrect matrix size: matrix1<' + mi1 + ', ' + mj1 + '>, matrix2<' + mi2 + ', ' + mj2 + '>'
																							};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				matrix1[i][j] -= matrix2.getElementAt(i + 1, j + 1);
			}
		}
		return this;
	};
	that.mult = function(value) {
		if(!jsar.toolset.isNumber(value)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: multiplicator < ' + value + ' >'
											};
		}
		var mi = this.getRowsNum(), mj = this.getColumnsNum();
		for(var i=0; i<mi; i++) {
			for(var j=0; j<mj; j++) {
				matrix1[i][j] *= value;
			}
		}
		return this;
	};
	that.div = function(value) {
		if(!jsar.toolset.isNumber(value) || value === 0) { throw {
																name: 'ValueError',
																message: 'incorrect input value: divider < ' + value + ' >'
														};
		}
		var mi = this.getRowsNum(), mj = this.getColumnsNum();
		for(var i=0; i<mi; i++) {
			for(var j=0; j<mj; j++) {
				matrix1[i][j] /= value;
			}
		}
		return this;
	};
	that.det = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
													name: 'MatrixSizeError',
													message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
												};
		}
		var result = 0, i = 1;
		for(var j=0; j<mj1; j++) {
			result += Math.pow(-1, i + j + 1) * matrix1[i - 1][j] * calculateDeterminant(getSubMatrix(i - 1, j, matrix1));
		}
		return result;
	};
	that.normalize = function() {
		var det = this.det();
		if(det === 0) { throw {
							name: 'DeterminantError',
							message: 'incorrect matrix determinant: < ' + det + ' >'
						};
		}
		var mi = this.getRowsNum(), mj = this.getColumnsNum();
		var result = jsar.toolset.matrix(w, h, 0);
		for(var i=0; i<mi; i++) {
			for(var j=0; j<mj; j++) {
				result[i][j] = matrix1[i][j] / det;
			}
		}
		return result;
	};
	that.nullMatrix = function() {
		var matrixT = this.transpose(matrix1);
		var k1, k2, s1 = matrixT[0][1], s2 = matrixT[matrixT.length - 1][matrixT[matrixT.length - 1].length - 2], j1 = 1, j2 = matrixT[matrixT.length - 1].length - 2;
		for(var i=0; i<matrixT.length; i++) {
			k1 = k2 = 0;
			for(var j=0; j<matrixT[i].length; j++) {
				if(j > i) {
					k1 += matrixT[i][j];
				} else {
					if(j < i) {
						k2 += matrixT[i][j];
					}
				}
			}
			if(s1 < k1) {
				s1 = k1;
				j1 = i;
			}
			if(s2 > k2 && i < matrixT[i].length - 1) {
				s2 = k2;
				j2 = i;
			}
		}
		for(var i=0; i<matrixT.length; i++) {
			if(i < j1) {
				matrixT[j1][i] = 0;
			}
			if(i > j2) {
				matrixT[j2][i] = 0;
			}
		}
		return this.transpose(matrixT);
		// var result = Array.nullMatrix([[1, 2, 3, 45, 7], [1, 2, 3, 54, 8], [1, 2, 3, 56, 9], [1, 2, 4, 1, 10], [1, 2, 4, 67, 1]]);
		// for(i=0; i<result.length; i++) {
			// for(j=0; j<result[i].length; j++) {
				// document.write(result[i][j] + ' ');
			// }
			// document.writeln(">>>>>>><<<<<<<");
		// };
	};
	that.transpose = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var result = jsar.toolset.matrix(mj1, mi1, 0), temp;
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
		//for(var i=1; i<mi1; i++) {
		//	for(var j=0; j<i; j++) {
				//temp = matrix1[i][j];
				//matrix1[i][j] = matrix1[j][i];
				//matrix1[j][i] = temp;
			    result[i][j] = matrix1[j][i];
			}
		}
		return jsar.utils.matrix({'matrix': result});
	};
	that.sort = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var result = this.nativeCopy();//matrix1.slice(0);
		var mi, mj, temp;
		for(var i=0; i<mi1*mj1; i++) {
			for(var j=0; j<mi1*mj1; j++) {
				mi = Math.floor(i / mj1);
				mj = Math.floor(j / mj1);
				if(result[mi][i % mj1] < result[mj][j % mj1]) {
					temp = result[mi][i % mj1];
					result[mi][i % mj1] = result[mj][j % mj1];
					result[mj][j % mj1] = temp;
				}
			}
		}
		return jsar.utils.matrix({'matrix': result});
	};
	that.identity = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var result = jsar.toolset.matrix(mi1, mj1, 0);
		for(var i=0; i<mj1; i++) {
			result[i][i] = 1;
		}
		return jsar.utils.matrix({'matrix': result});
	};
	that.equals = function(matrix2) {
		if(!isMatrix(matrix2)) { throw {
									name: 'ValueError',
									message: 'not matrix instance: < ' + matrix2 + ' >'
								};
		}
		var mi2 = matrix2.getRowsNum(), mj2 = matrix2.getColumnsNum();
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi2 === 0 || mj2 === 0 || mi1 === 0 || mj1 === 0 || mi2 !== mi1 || mj2 !== mj1) { throw {
																								name: 'MatrixSizeError',
																								message: 'incorrect matrix size: matrix1<' + mi1 + ', ' + mj1 + '>, matrix2<' + mi2 + ', ' + mj2 + '>'
																							};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] !== matrix2.getElementAt(i + 1, j + 1)) return false;
			}
		}
		return true;
	};
	that.getRowsNum = function() {
		return (matrix1.length);
	};
	that.getColumnsNum = function() {
		return (jsar.toolset.isArray(matrix1[0]) ? matrix1[0].length : 0);
	};
	that.getElementAt = function(i, j) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isIntNumber(i) || !jsar.toolset.isIntNumber(j) || i < 1 || j < 1 || i > mi1 || j > mj1) { throw {
																														name: 'ValueError',
																														message: 'incorrect input values: row < ' + i + ' >, column <' + j + ' >'
																												};
		}
		return matrix1[i-1][j-1];
	};
	that.setElementAt = function(i, j, value) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isIntNumber(i) || !jsar.toolset.isIntNumber(j) || !jsar.toolset.isNumber(value) || i < 1 || j < 1 || i > mi1 || j > mj1) { throw {
																																						name: 'ValueError',
																																						message: 'incorrect input values: row < ' + i + ' >, column <' + j + ' >, value < ' + value + ' >'
																																				};
		}
		matrix1[i-1][j-1] = value;
		return this;
	};
	that.isRowsInequal = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				for(var k=j+1; j<mj1; j++){
					if(matrix1[i][j] === matrix1[i][k]) {
						return false;
					}
				}
			}
		}
		return true;
	};
	that.isColumnsInequal = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				for(var k=j+1; j<mi1; j++){
					if(matrix1[i][j] === matrix1[k][j]) {
						return false;
					}
				}
			}
		}
		return true;
	};
	that.isLatinSquare = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		for(var i=0; i<mj1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] < 1 || matrix1[i][j] > mi1) {
					return false;
				}
			}
		}
		for(var i=0; i<mj1; i++) {
			for(var j=0; j<mj1; j++) {
				for(var k=j+1; k<mj1; k++) {
					if(matrix1[i][j] === matrix1[i][k]) {
						return false;
					}
				}
			}
		}
		for(var i=0; i<mj1; i++) {
			for(var j=0; j<mj1; j++) {
				for(var k=j+1; k<mj1; k++) {
					if(matrix1[i][j] === matrix1[k][j]) {
						return false;
					}
				}
			}
		}
	};
	that.sumGDiagonal = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var sum = 0;
		for(var i=0; i<mj1; i++) {
			sum += matrix1[i][i];
		}
		return sum;
	};
	that.prodADiagonal = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var prod = 1;
		for(var i=0; i<mj1; i++) {
			prod *= matrix1[i][mj1-i-1];
		}
		return prod;
	};
	that.invert = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var det = this.det();
		if(det === 0) { throw {
							name: 'DeterminantError',
							message: 'incorrect matrix determinant: < ' + det + ' >'
						};
		}
		var result = jsar.toolset.matrix(mi1, mj1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; i++) {
				result[i][j] = (Math.pow(-1, i + j) * calculateDeterminant(getSubMatrix(i, j, matrix1))) / det;
			}
		}
		return jsar.utils.matrix({'matrix': result});
	};
	that.subMatrix = function(i, j) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isIntNumber(i) || !jsar.toolset.isIntNumber(j) || i < 1 /*|| i > mi1 */|| j < 1 /*|| j > mj1*/) { throw {
																																name: 'ValueError',
																																message: 'incorrect input values: row < ' + i + ' >, column < ' + j + ' >'
																														};
		}
		i = (i - 1) % mi1;
		j = (j - 1) % mj1;
		var subMatrix = [], tmp;
		for(var ii=0; ii<mi1; ii++) {
			if(ii === i) continue;
			tmp = [];
			for(var jj=0; jj<mj1; jj++) {
				if(jj === j) continue;
				tmp.push(matrix1[ii][jj]);
			}
			subMatrix.push(tmp);
		}
		return jsar.utils.matrix({'matrix': subMatrix});
	};
	that.each = function(func) }
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isFunction(func)) { throw {
												name: 'ValueError',
												message: 'incorrect function value < ' + func + ' >'
											};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; i++) {
				matrix1[i][j] = func(matrix1[i][j]);
			}
		}
		return this;
	};
	that.shiftRows = function(shift) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		shift = (shift == null) ? 1 : (jsar.toolset.isIntNumber(shift)) ? (shift % mi1) : null;
		if(shift == null) throw {name: 'ValueError', mesage: 'incorrect shift value < ' + shift + ' >'};
		var index = Math.abs(shift), temp, sign = (shift > 0) ? 1 : 0;
		while(index > 0) {
			if(sign) {
				temp = matrix1[mi1-1];
				for(var i=mi1-1; i>0; i--) {
					matrix1[i] = matrix1[i-1];
				}
				matrix1[0] = temp;
			} else {
				temp = matrix1[0];
				for(var i=1; i<mi1; i++) {
					matrix1[i-1] = matrix1[i];
				}
				matrix1[mi1-1] = temp;
			}
			index--;
		}
		return this;
	};
	that.shiftColumns = function(shift) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		shift = (shift == null) ? 1 : (jsar.toolset.isIntNumber(shift)) ? (shift % mj1) : null;
		if(shift == null) throw {name: 'ValueError', mesage: 'incorrect shift value < ' + shift + ' >'};
		var index = Math.abs(shift), temp, sign = (shift > 0) ? 1 : 0;
		for(var i=0; i<mi1; i++) {
			while(index > 0) {
				if(sign) {
					temp = matrix1[i][mj1-1];
					for(var j=mj1-1; j>0; j--) {
						matrix1[i][j] = matrix1[i][j-1];
					}
					matrix1[i][0] = temp;
				} else {
					temp = matrix1[i][0];
					for(var j=1; j<mj1; j++) {
						matrix1[i][j-1] = matrix1[i][j];
					}
					matrix1[i][mj1-1] = temp;
				}
				index--;
			}
		}
		return this;
	};
	that.swapRows = function(row1, row2) {
		var swap = function(col, row1, row2) {
			var temp = matrix1[row1][col];
			matrix1[row1][col] = matrix1[row2][col];
			matrix1[row2][col] = temp;
		};
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isIntNumber(row1) || !jsar.toolset.isIntNumber(row2) || row1 < 1 || row2 < 1) { throw {
																											name: 'ValueError',
																											message: 'incorrect input value: row1 < ' + row1 + ' >, row2 < ' + row2 + ' >'
																										};
		}
		if(row1 === row2) return;
		row1 = (row1 - 1) % mi1;
		row2 = (row2 - 1) % mi1;
		for(var j=0; j<mj1; j++) {
			swap(j, row1, row2);
		}
		return this;
	};
	that.swapColumns = function(col1, col2) {
		var swap = function(row, col1, col2) {
			var temp = matrix1[row][col1];
			matrix1[row][col1] = matrix1[row][col2];
			matrix1[row][col2] = temp;
		};
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		if(!jsar.toolset.isIntNumber(col1) || !jsar.toolset.isIntNumber(col2) || col1 < 1 || col2 < 1) { throw {
																											name: 'ValueError',
																											message: 'incorrect input value: column1 < ' + col1 + ' >, column2 < ' + col2 + ' >'
																										};
		}
		if(col1 === col2) return;
		col1 = (col1 - 1) % mj1;
		col2 = (col2 - 1) % mj1;
		for(var i=0; i<mi1; i++) {
			swap(i, col1, col2);
		}
		return this;
	};
	that.sumRows = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var sumRow = jsar.toolset.vector(mi1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				sumRow[i] += matrix1[i][j];
			}
		}
		return jsar.utils.matrix({'matrix': sumRow});//sumRow;
	};
	that.sumColumns = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var sumColumn = jsar.toolset.vector(mj1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				sumColumn[j] += matrix1[i][j];
			}
		}
		return jsar.utils.matrix({'matrix': sumColumn});//sumColumn;
	};
	that.addRow = function(row, index) {
		if(!jsar.toolset.isArray(row)) { throw {
											name: 'ValueError',
											mesage: 'incorrect input value: row < ' + row + ' >'
										};
		}
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		index = (index == null) ? mi1 : (jsar.toolset.isIntNumber(index) && index >= 1 && index <= mi1) ? index : null;
		if(index == null) throw {name: 'ValueError', mesage: 'incorrect row index: < ' + index + ' >'};
		matrix1.splice(index, 0, row);
		return this;
	};
	that.addColumn = function(column, index) {
		if(!jsar.toolset.isArray(column)) { throw {
												name: 'ValueError',
												mesage: 'incorrect input value: column < ' + column + ' >'
											};
		}
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		index = (index == null) ? mi1 : (jsar.toolset.isIntNumber(index) && index >= 1 && index <= mj1) ? index : null;
		if(index == null) throw {name: 'ValueError', mesage: 'incorrect column index: < ' + index + ' >'}
		for(var i=0; i<mi1; i++) {
			matrix1[i].splice(index, 0, (column[i] && typeof column[i] === 'number') ? column[i] : null);
		}
		return this;
	};
	that.deleteRow = function(index) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		index = (index == null) ? mi1 : (jsar.toolset.isIntNumber(index) && index >= 1 && index <= mi1) ? index : null;
		if(index == null) throw {name: 'ValueError', mesage: 'incorrect row index: < ' + index + ' >'};
		matrix1.splice(index - 1, 1);
		return this;
	};
	that.deleteColumn = function(index) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		index = (index == null) ? mi1 : (jsar.toolset.isIntNumber(index) && index >= 1 && index <= mj1) ? index : null;
		if(index == null) throw {name: 'ValueError', mesage: 'incorrect column index: < ' + index + ' >'};
		for(var i=0; i<mi1; i++) {
			matrix1[i].splice(index - 1, 1);
		}
		return this;
	};
	that.hasNullRow = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var n = 0;
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] === 0) n++;
			}
			if(n === mj1) return true;
		}
		return false;
	};
	that.hasNullColumn = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var nullColumns = jsar.toolset.vector(mj1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] === 0) nullColumns[j]++;
			}
		}
		if(nullColumns.indexOf(mi1) !== -1) return true;
		return false;
	};
	that.getMin = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var min = Number.POSITIVE_INFINITY;
		for(var i=0; i<mi1; i++) {
			min = Math.min(jsar.toolset.arrayMin(matrix1[i]), min);
		}
		return min;
	};
	that.getMax = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0) { throw {
										name: 'MatrixSizeError',
										message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
									};
		}
		var max = Number.NEGATIVE_INFINITY;
		for(var i=0; i<mi1; i++) {
			max = Math.max(jsar.toolset.arrayMax(matrix1[i]), max);
		}
		return max;
	};
	that.clone = function() {
		return jsar.utils.matrix({'matrix': matrix1});
	};
	that.nativeCopy = function() {
		var res = [];//matrix1.slice(0);
		matrix1.forEach(function(item, i) {
			(jsar.toolset.isArray(item)) ? res.push(item.slice(0)) : res.push(item);
		});
		return res;
	};
	that.toString = function() {
		var res = '';
		matrix1.forEach(function(item, i) {
			res += item.join(' ').concat('\n');
		});
		return res;
	};
	that.getGauss = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || (mi1 + 1) !== mj1) { throw {
															name: 'MatrixSizeError',
															message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
														};
		}
		var tempMatrix = this.clone(), rowIndex;
		//Прямой ход
		for(var k=1; k<=(mi1-1); k++) {
			for(var i=k+1; i<=mi1; i++) {
				rowIndex = 1;
				while((tempMatrix.getElementAt(k, k) === 0) && (k + rowIndex) <= mi1) {
					tempMatrix.swapRows(k, k + rowIndex);
					rowIndex++;
				}
				var m = tempMatrix.getElementAt(i, k) / tempMatrix.getElementAt(k, k);
				tempMatrix.setElementAt(i, k, 0);
				for(var j=k+1; j<=mi1; j++) {
					tempMatrix.setElementAt(i, j, (tempMatrix.getElementAt(i, j) - m * tempMatrix.getElementAt(k, j)));
				}
			}
		}
		//Обратный ход
		var arrayX = jsar.toolset.vector(mi1 - 1, 0), sum;
		arrayx[mi1 - 1] = tempMatrix.getElementAt(mi1, mj1) / tempMatrix.getElementAt(mi1, mi1);
		for(var k=mi1-1; k>=1; k--) {
			sum = 0;
			for(var j=k+1; j<=mi1; j++) {
				sum += tempMatrix.getElementAt(k, j) * arrayX[j - 1];
			}
			arrayX[k - 1] = (tempMatrix.getElementAt(k, mj1) - sum) / tempMatrix.getElementAt(k, k);
		}
		return arrayX;
	};
	that.getDeijkstraPath = function(start, end) {
		if(!jsar.toolset.isIntNumber(start) || !jsar.toolset.isIntNumber(end)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input types: start vertex < ' + start + ' >, end vertex < ' + end + ' >'
																				};
		}
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		if(start === end || start < 1 || end < 1 || start > mi1 || end > mi1) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: start vertex < ' + start + ' >, end vertex < ' + end + ' >, number of vertices < ' + mi1 + ' >'
																			};
		}
		// initialization step
		var state = {PASSED: 1, NOTPASSED: 0};
		var a = jsar.toolset.vector(mi1, state.NOTPASSED);
		var b = matrix1[start-1].slice(0);
		var c = jsar.toolset.vector(mi1, start);
		a[start-1] = state.PASSED;
		c[start-1] = 0;
		// general step
		var minVertex, minIndex;
		while(a.indexOf(state.NOTPASSED) !== -1) {
			minVertex = Number.POSITIVE_INFINITY;
			minIndex = -1;
			for(var i=0; i<mi1; i++) {//b.length
				if(b[i] < minVertex && a[i] === state.NOTPASSED) {
					minVertex = b[i];
					minIndex = i;
				}
			}
			a[minIndex] = state.PASSED;
			for(var m=0; m<mi1; m++) {//a.length
				if((a[m] === state.NOTPASSED) && (minVertex + matrix1[minIndex][m]) < b[m]) {
					b[m] = minVertex + matrix1[minIndex][m];
					c[m] = minIndex + 1;
				}
			}
		}
		// output step
		var len = b[end-1];
		var res = [], z = c[end-1];
		res.push(end);
		while(z !== 0) {
			res.push(z);
			z = c[z-1];
		}
		return {'path': res.reverse(), 'length': len};
	};
	that.getShortestPaths = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var dist = this.nativeCopy();
		for(var k=0; k<n; k++) {
			for(var i=0; i<n; i++) {
				for(var j=0; j<n; j++) {
					dist[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
				}
			}
		}
		return jsar.utils.matrix({'matrix': dist});
	};
	that.getMinWeightedPath = function(weightedMatrix) {
		if(!isMatrix(weightedMatrix)) { throw {
											name: 'ValueError',
											message: 'not matrix instance: < ' + weightedMatrix + ' >'
										};
		}
		var res = this.getShortestPaths();
		return weightedMatrix.multMatrix(res).getMin();
	};
	that.getMaxWeightedPath = function(weightedMatrix) {
		if(!isMatrix(weightedMatrix)) { throw {
											name: 'ValueError',
											message: 'not matrix instance: < ' + weightedMatrix + ' >'
										};
		}
		var res = this.getShortestPaths();
		return weightedMatrix.multMatrix(res).getMax();
	};
	that.getMinMaxPath = function() {
		var res = this.getShortestPaths().nativeCopy();
		// Выбор в пунктах
		var len = res.length, inf = Number.POSITIVE_INFINITY, mima = inf, ma, ind;
		for(var i=0; i<len; i++) {
			//ma = res[i][0];
			//for(var j=1; j<len; j++) {
			//	if(res[i][j] > ma) {
			//		ma = res[i][j];
			//	}
			//}
			ma = jsar.toolset.arrayMax(res[i]);
			if(ma < mima) {
				ind = i;
				mima = ma;
			}
		}
		//Выбор на дорогах
		var mai, maj, di, dj, inj, ini, dist;
		for(var i=0; i<len-1; i++) {
			for(var j=i+1; j<len; j++) {
				if(matrix1[i][j] === inf) continue;
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
				dist = (mai + matrix1[i][j] + maj) / 2;
				if((dist <= mima) && ((dist - mai) > 0) && (dist < (mai + matrix1[i][j]))) {
					mima = dist;
					//document.writeln('between < ' + (i + 1) + ' > and < ' + (j + 1) + ' > on a distance < ' + (dist - mai) + ' > from < ' + (i + 1) + ' >\n');
					//between i and j on a distance (dist - mai) from i then distance to ini and inj = dist;
				}
			}
		}
		return mima;
	};
	that.adductionOnRows = function(isNullDiagonal) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		//
		isNullDiagonal = (isNullDiagonal == null) ? true : (jsar.toolset.isBoolean(isNullDiagonal)) ? isNullDiagonal : null;
		if(isNullDiagonal == null) throw {name: 'ValueError', message: 'incorrect parameter: diagonal values included < ' + isNullDiagonal + ' >'};
		//
		var copy = this.nativeCopy();
		for(var i=0; i<mi1; i++) { 
			min = (isNullDiagonal) ? jsar.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1))) : jsar.toolset.arrayMin(copy[i]);
			for(var j=0; j<mj1; j++) {
				if(isNullDiagonal && (i === j)) continue;
				copy[i][j] -= min;
			}
		}
		return jsar.utils.matrix({'matrix': copy});
	};
	that.adductionOnColumns = function(isNullDiagonal) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		//
		isNullDiagonal = (isNullDiagonal == null) ? true : (jsar.toolset.isBoolean(isNullDiagonal)) ? isNullDiagonal : null;
		if(isNullDiagonal == null) throw {name: 'ValueError', message: 'incorrect parameter: diagonal values included < ' + isNullDiagonal + ' >'};
		//
		var copy = this.transpose().nativeCopy();
		for(var i=0; i<mj1; i++) { 
			min = (isNullDiagonal) ? jsar.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1))) : jsar.toolset.arrayMin(copy[i]);
			for(var j=0; j<mi1; j++) {
				if(isNullDiagonal && (i === j)) continue;
				copy[i][j] -= min;
			}
		}
		return jsar.utils.matrix({'matrix': copy}).transpose();
	};
	that.getVertexPath = function(start) {
		if(!jsar.toolset.isIntNumber(start)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: start vertex < ' + start + ' >'
											};
		}
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		if(start < 1 || start > mi1) { throw {
										name: 'ValueError',
										message: 'incorrect start vertex: < ' + start + ' >'
									};
		}
		// initialization step
		var state = {PASSED: true, NOTPASSED: false};
		var a = z = 0; // start/end of q
		var p = jsar.toolset.vector(mi1, -1);
		var q = jsar.toolset.vector(mi1, 0);
		q[a] = start;
		var r = jsar.toolset.vector(mi1, state.NOTPASSED);
		// general step
		do {
			for(var j=0; j<mi1; j++) {
				if((matrix1[q[a]-1][j] !== 0) && (r[j] === state.NOTPASSED)) {//matrix1[q[a] - 1].indexOf(1) !== -1
					z++;
					q[z] = j + 1;
					p[j] = q[a];
					r[j] = state.PASSED;
				}
			}
			a++;
		} while(a <= z);
		// output step
		return p;
	};
	that.getMaxPairsMatching = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		// initialization step
		var vertex = [];
		var orientGraph = jsar.toolset.matrix(mi1 + mj1, mi1 + mj1, 0);
		var vertexStatus = {CONNECTED: 1, DISCONNECTED: 0};
		var state = {SATURATED: 4, NOTSATURATED: 3};
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] === vertexStatus.DISCONNECTED) continue;
				if((matrix1[i][j] === vertexStatus.CONNECTED) && (vertex.indexOf(i) === -1) && (vertex.indexOf(j+mi1) === -1)) {
					vertex.push(i);
					vertex.push(j+mi1);
					orientGraph[j+mi1][j] = state.SATURATED;
				} else {
					orientGraph[i][j+mi1] = state.NOTSATURATED;
				}
			}
		}
		// general step
		var i = 0;
		while(++i <= mi1) {
			if(vertex.indexOf(i-1) !== -1) continue;
			var orientPath = this.getVertexPath(i);
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
		var pairsGraph = jsar.toolset.matrix(mi1, mj1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=mi1; j<mi1+mj1; j++) {
				pairsGraph[i][j%mi1] = ((orientGraph[i][j] === state.SATURATED) ? 1 : 0); //orientGraph[i].indexOf(state.SATURATED);
			}
		}
		for(var i=mi1; i<mi1+mj1; i++) {
			for(var j=0; j<mi1; j++) {
				pairsGraph[j][i%mi1] = ((orientGraph[i][j] === state.SATURATED) ? 1 : 0); //orientGraph[i].indexOf(state.SATURATED);
			}
		}
		return pairsGraph;
	};
	that.getMinUtility = function() {
		var graph = matrix1;//jsar.toolset.copyOfArray(matrix1);
		while(true) {
			var adductArr = this.adductionOnColumns(this.adductionOnRows(graph, false), false);
			var adductArrCopy = jsar.toolset.matrix(adductArr.length, adductArr[0].length, 0);
			var temp;
			for(var i=0; i<adductArrCopy.length; i++) {
				temp = 0;
				while((temp = adductArr[i].indexOf(0, temp)) !== -1) {
					adductArrCopy[i][temp] = 1;
					temp++;
				}
			}
			var maxPairs = this.getMaxPairsMatching(adductArrCopy);
			var n = maxPairs.length;
			var nn = (jsar.toolset.isArray(maxPairs[0]) ? maxPairs[0].length : 0);
			var orientGraph = jsar.toolset.matrix(n + nn, n + nn, 0), k = 0;
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
					sum += matrix1[i][maxPairs[i].indexOf(1)];
				}
				return {'maxPairs': maxPairs, 'functional': sum};
			}
			var rows = [], columns = [], vertexPath;
			for(var i=0; i<maxPairs.length; i++) {
				if(maxPairs[i].indexOf(1) === -1) {
					vertexPath = this.getVertexPath(i + 1, orientGraph);
					for(var j=0; j<vertexPath.length; j++) {
						if((vertexPath[j] !== -1) && (vertexPath[j] !== i + 1)) {
							((j + 1) <= n) ? (rows.push(j), columns.push(vertexPath[j] - 1)) : (columns.push(j), rows.push(vertexPath[j] - 1));
						}
					}
				}
			}
			columnsFilter = jsar.algorithms.diff(jsar.toolset.createAndFillArray(n, n + nn, function(x) {return x + 1}), columns);
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
	that.getMinInRows = function(func) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var jm, res = jsar.toolset.vector(mi1, 0);
		for(var i=0; i<mi1; i++) {
			jm = 0;
			for(var j=1; j<mj1; j++) {
				if(matrix1[i][j] < matrix1[i][jm]) {//(jsar.toolset.isFunction(func)) ? func(matrix1[i][j], matrix1[i][jm]) : (matrix1[i][j] < matrix1[i][jm]);
					jm = j;
				}
			}
			res[i] = array[jm];//jm;
		}
		return res;
	};
	that.getMinInColumns = function(func) {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var jm, res = jsar.toolset.vector(mj1, 0);
		for(var j=0; i<mj1; j++) {
			jm = 0;
			for(var i=1; i<mi1; i++) {
				if(matrix1[i][j] < matrix1[jm][j]) {//(jsar.toolset.isFunction(func)) ? func(matrix1[i][j], matrix1[jm][j]) : (matrix1[i][j] < matrix1[jm][j]);
					jm = i;
				}
			}
			res[j] = array[jm];//jm;
		}
		return res;
	};
	that.sortByRowsSum = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var sum = jsar.toolset.vector(mi1, 0);
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				sum[i] += matrix1[i][j];
			}
		}
		var nmin, temp, buf;
		for(var i=0; i<mi1-1; i++) {
			nmin = i;
			for(var j = i+1; j<mi1; j++) {
				if(sum[j] < sum[nmin]) nmin = j;
			}
			temp = sum[i];
			sum[i] = sum[nmin];
			sum[nmin] = temp;
			for(var j=0; j<mj1; j++) {
				buf = matrix1[i][j];
				matrix1[i][j] = matrix1[nmin][j];
				matrix1[nmin][j] = buf;
			}
		}
		return this;
	};
	that.getMinMax = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		var rows = jsar.toolset.vector(mi1, 0), temp, min, max, res = [];
		for(var i=0; i<mi1; i++) {
			min = matrix1[i].min();
			temp = [];
			ind = -1;
			while((ind = matrix1[i].indexOf(min, ind + 1)) !== -1) {
				temp.push(ind);
			}
			rows[i] = temp;
		}
		var columns = this.transpose().nativeCopy();
		for(var j=0; j<mj1; j++) {
			max = columns[j].max();
			ind = -1;
			while((ind = columns[j].indexOf(max, ind + 1)) !== -1) {
				if(rows[ind].indexOf(j) !== -1) {
					res.push({'row': ind, 'column': j});
				}
			}
		}
		return res;
	};
	that.isSymmetric = function() {
		var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
		if(mi1 === 0 || mj1 === 0 || mi1 !== mj1) { throw {
														name: 'MatrixSizeError',
														message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
													};
		}
		for(var i=0; i<mi1; i++) {
			for(var j=0; j<mj1; j++) {
				if(matrix1[i][j] !== matrix1[j][i]) return false;
			}
		}
		return true;
	};
	init();
	return that;
};
//--------------------------------------------------------------
 