(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.matrix = globals.matrix || {};
  //----------------------------------------------------------------------------------------------
  (function () {
    const comparator = function (colIndex) {
      return function (obj1, obj2) {
        const hasProperty = function (obj, prop) {
          const proto = obj.__proto__ || obj.constructor.prototype;
          return prop in obj || prop in proto || proto[prop] === obj[prop];
          //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        };

        const a = obj1[colIndex];
        const b = obj2[colIndex];

        if (a === b) {
          return 0;
        }

        if (typeof a === typeof b) {
          if (hasProperty(a, 'compareTo')) {
            return a.compareTo(b);
          } else {
            return a < b ? -1 : 1; //a.localCompare(b)
          }
        }
        return typeof a < typeof b ? -1 : 1;
      };
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input array.
     * @param {Number} colum1 Index of a column.
     * @param {Number} colum2 Index of a column to swap with.
     */
    const swapColumns = function (matrix, column1, column2) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      column1 = globals.toolset.isIntNumber(column1) && column1 >= 0 && column1 < nn ? column1 : null;
      if (column1 == null)
        throw {
          name: 'ValueError',
          message: `incorrect {column1} value: < ${column1} >`,
        };
      //
      column2 = globals.toolset.isIntNumber(column2) && column2 >= 0 && column2 < nn ? column2 : null;
      if (column2 == null)
        throw {
          name: 'ValueError',
          message: `incorrect {column2} value: < ${column2} >`,
        };

      for (let i = 0; i < n; i++) {
        matrix[i][column2] = [matrix[i][column1], (matrix[i][column1] = matrix[i][column2])][0];
      }
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input array.
     * @param {Number} colum1 Index of a column.
     * @param {Number} colum2 Index of a column to swap with.
     */
    const swapRows = function (matrix, row1, row2) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      row1 = globals.toolset.isIntNumber(row1) && row1 >= 0 && row1 < n ? row1 : null;
      if (row1 == null)
        throw {
          name: 'ValueError',
          message: `incorrect {row1} value: < ${row1} >`,
        };
      //
      row2 = globals.toolset.isIntNumber(row2) && row2 >= 0 && row2 < n ? row2 : null;
      if (row2 == null)
        throw {
          name: 'ValueError',
          message: `incorrect {row2} value: < ${row2} >`,
        };

      //matrix[row2] = [matrix[row1], matrix[row1] = matrix[row2]][0];
      for (let j = 0; j < nn; j++) {
        matrix[row2][j] = [matrix[row1][j], (matrix[row1][j] = matrix[row2][j])][0];
      }
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input array.
     * @param {Number} colum1 Index of a column.
     * @param {Number} colum2 Index of a column to swap with.
     */
    const sortByColumn = function (matrix, colIndex) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      colIndex = globals.toolset.isIntNumber(colIndex) && colIndex >= 0 && colIndex < nn ? colIndex : null;
      if (colIndex == null)
        throw {
          name: 'ValueError',
          message: `incorrect {colIndex} value: < ${colIndex} >`,
        };

      matrix.sort(comparator(colIndex));
      //return matrix;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input array.
     * @return {Array} min-max array.
     *
     * @example
     * var distance = [[1, 1, 2, 6, 0, 1],
     *				[4, 0, 3, 8, 3, 1],
     *				[8, 0, 1, 5, 0, 9],
     *				[3, 1, 4, 8, 8, 3],
     *				[2, 2, 9, 5, 2, 4],
     *				[3, 2, 3, 6, 7, 3]];
     * document.writeln(globals.matrix.getMinMax(distance)[0].row);
     */
    const getMinMax = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect input parameter: array < ${matrix} >`,
        };
      }
      let rows = jsar.toolset.vector(matrix.length, 0),
        temp,
        min,
        max,
        res = globals.toolset.vector();
      for (let i = 0; i < matrix.length; i++) {
        min = matrix[i].min();
        temp = globals.toolset.vector();
        ind = -1;
        while ((ind = matrix[i].indexOf(min, ind + 1)) !== -1) {
          temp.push(ind);
        }
        rows[i] = temp;
      }
      const columns = jsar.algorithms.transpose(matrix);
      for (let j = 0; j < matrix[0].length; j++) {
        max = columns[j].max();
        ind = -1;
        while ((ind = columns[j].indexOf(max, ind + 1)) !== -1) {
          if (rows[ind].indexOf(j) !== -1) {
            res.push({ row: ind, column: j });
          }
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} rows Input rows array.
     * @param {Array} columns Input columns array.
     * @return {String} multiplication order.
     *
     * @example
     * var s = globals.algorithms.multiplicationOrder([10, 20, 50, 1], [20, 50, 1, 100]);
     * document.writeln(s);
     * var ss = globals.algorithms.multiplicationOrder([3, 5], [4, 2]);
     * document.writeln(ss);
     * var sss = globals.algorithms.multiplicationOrder([3, 5, 4], [4, 2, 5]);
     * document.writeln(sss);
     */
    const multiplicationOrder = (function () {
      const getOps = function getOps(i, j) {
        if (i == j) {
          return 0;
        }
        if (cache.has([i, j])) {
          return cache.get([i, j]);
        }
        let minOps = Number.MAX_VALUE,
          minK,
          k;
        for (k = i; k < j; k++) {
          const ops = getOps(i, k) + rows[i - 1] * columns[k - 1] * columns[j - 1] + getOps(k + 1, j);
          if (ops < minOps) {
            minOps = ops;
            minK = k;
          }
        }
        subProblems.put([i, j], minK);
        cache.put([i, j], minOps);
        return minOps;
      };

      const matrixMultiplication = function matrixMultiplication(i, j) {
        if (!globals.toolset.isIntNumber(i) || !globals.toolset.isIntNumber(j) || i <= 0 || j <= 0) {
          throw {
            name: 'ValueError',
            message: `incorrect input parameters: number of rows < ${i} >, number of columns < ${j} >`,
          };
        }
        if (i == j) {
          return i.toString();
        } else {
          const k = subProblems.get([i, j]);
          let s1 = matrixMultiplication(i, k);
          if (s1.length > 1) {
            s1 = `( ${s1} )`;
          }
          let s2 = matrixMultiplication(k + 1, j);
          if (s2.length > 1) {
            s2 = `( ${s2} )`;
          }
          return `${s1} * ${s2}`;
        }
      };

      return function (rows, columns) {
        if (
          !globals.toolset.isArray(rows) ||
          !globals.toolset.isArray(columns) ||
          rows.length !== columns.length
        ) {
          throw {
            name: 'ValueError',
            message: `incorrect input parameters: array1 < ${rows} >, array2 < ${columns} >`,
          };
        }
        const cache = globals.collections.map(),
          subProblems = globals.collections.map();
        if (getOps(1, rows.length) === Number.MAX_VALUE) return;
        //console.log(getOps(1, rows.length));
        return matrixMultiplication(1, rows.length);
      };
    })();
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @return {Array} Current sorted matrix.
     */
    const sort = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix value: matrix < ${matrix} >`,
        };
      }
      const w = matrix.length ? matrix.length : 0;
      const h = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      let i, j, mi, mj, temp;
      for (i = 0; i < w * h; i++) {
        for (j = 0; j < w * h; j++) {
          mi = Math.floor(i / h);
          mj = Math.floor(j / h);
          if (matrix[mi][i % h] < matrix[mj][j % h]) {
            temp = matrix[mi][i % h];
            matrix[mi][i % h] = matrix[mj][j % h];
            matrix[mj][j % h] = temp;
          }
        }
      }
      return matrix;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @return {Array} Transposed matrix.
     */
    const transpose = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix value: matrix < ${matrix} >`,
        };
      }
      const result = matrix[0].map(function (col, i) {
        return matrix.map(function (row) {
          return row[i];
        });
      });
      return result;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix1 Input matrix.
     * @param {Array} matrix2 Input matrix to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    const multMatrix = function (matrix1, matrix2) {
      if (!globals.toolset.isArray(matrix1) || !globals.toolset.isArray(matrix2)) {
        throw {
          name: 'TypeError',
          message: `incorrect input arguments: matrix1 < ${matrix1} >, matrix2 < ${matrix2} >`,
        };
      }
      const k1 = matrix2.length;
      const k2 = globals.toolset.isArray(matrix1[0]) ? matrix1[0].length : 0;
      if (k1 !== k2) return;
      w = matrix1.length;
      h = globals.toolset.isArray(matrix2[0]) ? matrix2[0].length : 0;
      const result = globals.toolset.matrix(w, h, 0);
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          for (let k = 0; k < k1; k++) {
            result[i][j] += matrix1[i][k] * matrix2[k][j];
          }
        }
      }
      return result;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @param {Number} num Input number to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    const multNumber = function (matrix, num) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {matrix} is not array < ${matrix} >`,
        };
      }
      if (!globals.toolset.isNumber(num)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {num} is not number < ${num} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const res = globals.toolset.matrix(n, nn, 0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nn; j++) {
          res[i][j] = matrix[i][j] * num;
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix1 Input matrix.
     * @param {Array} matrix2 Input matrix to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    const sumMatrix = function (matrix1, matrix2) {
      if (!globals.toolset.isArray(matrix1) || !globals.toolset.isArray(matrix2)) {
        throw {
          name: 'TypeError',
          message: `incorrect input arguments: matrix1 < ${matrix1} >, matrix2 < ${matrix2} >`,
        };
      }
      const n = matrix1.length,
        n2 = matrix2.length;
      const nn = globals.toolset.isArray(matrix1[0]) ? matrix1[0].length : 0,
        nn2 = globals.toolset.isArray(matrix2[0]) ? matrix2[0].length : 0;
      if (n === 0 || nn === 0 || n !== n2 || nn !== nn2) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const res = globals.toolset.matrix(n, nn, 0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nn; j++) {
          res[i][j] = matrix1[i][j] + matrix2[i][j];
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    /* @public
     * @module matrix
     * @param {Array} matrix Input matrix.
     * @param {Number} num Input number to multiplicate with.
     * @return {Array} Multiplicated matrix.
     */
    var matrixPow = function (matrix, num) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {matrix} is not array < ${matrix} >`,
        };
      }
      if (!globals.toolset.isIntNumber(num) || n < 1) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {num} is not positive integer number < ${num} >`,
        };
      }
      var n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      return num === 1 ? matrix : multMatrix(matrix, matrixPow(num - 1, matrix));
    };
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} nodesList Input array.
     * @param {Boolean} isNullDiagonal Boolean flag.
     * @return {Array} Matrix
     *
     * @example
     * var distance = [[0, 7, 3, 7, 1],
     *        [1, 0, 8, 6, 3],
     *        [1, 1, 0, 0, 1],
     *        [0, 5, 0, 0, 0],
     *        [1, 23, 1, 1, 0]];
     * document.writeln(globals.matrix.addOnColumns(distance));
     */
    const addOnColumns = function (nodesList, isNullDiagonal) {
      if (!globals.toolset.isArray(nodesList)) {
        throw {
          name: 'ValueError',
          message: `incorrect vertex order matrix < ${nodesList} >`,
        };
      }
      //var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
      //if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
      //											name: 'MatrixSizeError',
      //												message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
      //											};
      //}
      const n = nodesList.length;
      const nn = globals.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      //
      isNullDiagonal =
        isNullDiagonal == null ? true : globals.toolset.isBoolean(isNullDiagonal) ? isNullDiagonal : null;
      if (isNullDiagonal == null)
        throw {
          name: 'ValueError',
          message: `incorrect parameter: diagonal values included < ${isNullDiagonal} >`,
        };
      //
      const copy = globals.matrix.transpose(nodesList);
      for (let i = 0; i < n; i++) {
        min = isNullDiagonal
          ? globals.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
          : jsar.toolset.arrayMin(copy[i]);
        for (let j = 0; j < nn; j++) {
          if (isNullDiagonal && i === j) continue;
          copy[i][j] -= min;
        }
      }
      return globals.matrix.transpose(copy);
    };
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} nodesList Input array.
     * @param {Boolean} isNullDiagonal Boolean flag.
     * @return {Array} Matrix
     *
     * @example
     * var distance = [[0, 7, 3, 7, 1],
     *        [1, 0, 8, 6, 3],
     *        [1, 1, 0, 0, 1],
     *        [0, 5, 0, 0, 0],
     *        [1, 23, 1, 1, 0]];
     * document.writeln(globals.matrix.addOnRows(distance));
     */
    const addOnRows = function (nodesList, isNullDiagonal) {
      if (!globals.toolset.isArray(nodesList)) {
        throw {
          name: 'ValueError',
          message: `incorrect vertex order matrix < ${nodesList} >`,
        };
      }
      const n = nodesList.length;
      const nn = globals.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      //
      isNullDiagonal =
        isNullDiagonal == null ? true : globals.toolset.isBoolean(isNullDiagonal) ? isNullDiagonal : null;
      if (isNullDiagonal == null)
        throw {
          name: 'ValueError',
          message: `incorrect parameter: diagonal values included < ${isNullDiagonal} >`,
        };
      //
      const copy = globals.toolset.copyOfArray(nodesList);
      for (let i = 0; i < n; i++) {
        min = isNullDiagonal
          ? globals.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1)))
          : jsar.toolset.arrayMin(copy[i]);
        for (let j = 0; j < nn; j++) {
          if (isNullDiagonal && i === j) continue;
          copy[i][j] -= min;
        }
      }
      return copy;
    };
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Integer} n Matrix rang.
     * @return {Array} Matrix.
     *
     * @example
     * var myMatrixIdentity = globals.toolset.identity(4);
     */
    const identity = function (n) {
      if (!globals.toolset.isInteger(n) || n < 0) {
        throw {
          name: 'ValueError',
          message: `incorrect input value: matrix size is not positive integer < ${n} >`,
        };
      }
      const mat = globals.toolset.matrix(n, n, 0);
      for (let i = 0; i < n; i++) {
        mat[i][i] = 1;
      }
      return mat;
    };
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Object} {row: row, col: col, squareSize: squareSize}.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var mySquare = globals.toolset.findSquare(matrix);
     */
    const findSquare = (function () {
      const subSquare = function (row, col, squareSize) {
        return { row, col, squareSize };
      };

      let findSquareWithSize;
      matrix, squareSize;
      {
        const count = matrix.length - squareSize + 1;
        for (let row = 0; row < count; row++) {
          for (let col = 0; col < count; col++) {
            if (isSquare(matrix, row, col, squareSize)) {
              return subSquare(row, col, squareSize);
            }
          }
        }
      }
      var isSquare = function (matrix, row, col, size) {
        for (let j = 0; j < size; j++) {
          if (matrix[row][col + j] == 1 || matrix[row + size - 1][col + j] == 1) {
            return false;
          }
        }
        for (let i = 1; i < size - 1; i++) {
          if (matrix[row + i][col] == 1 || matrix[row + i][col + size - 1] == 1) {
            return false;
          }
        }
        return true;
      };

      return function (matrix) {
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect vertex order matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }
        let square = null;
        for (let i = matrix.length; i >= 1; i--) {
          square = findSquareWithSize(matrix, i);
          if (square != null) return square;
        }
        return null;
      };
    })();
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Object} {row: row, col: col, squareSize: squareSize}.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var mySquare = globals.toolset.findSquare(matrix);
     */
    const findSquare2 = (function () {
      const squareCell = function () {
        return { zerosRight: 0, zerosBelow: 0 };
      };

      const subSquare = function (row, col, squareSize) {
        return { row, col, squareSize };
      };

      let findSquareWithSize;
      processed, squareSize;
      {
        const count = processed.length - squareSize + 1;
        for (let row = 0; row < count; row++) {
          for (let col = 0; col < count; col++) {
            if (isSquare(processed, row, col, squareSize)) {
              return subSquare(row, col, squareSize);
            }
          }
        }
      }
      var isSquare = function (matrix, row, col, size) {
        const topLeft = matrix[row][col];
        const topRight = matrix[row][col + size - 1];
        const bottomRight = matrix[row + size - 1][col];

        if (topLeft.zerosRight < size) return false;
        if (topLeft.zerosBelow < size) return false;
        if (topRight.zerosBelow < size) return false;
        if (bottomRight.zerosRight < size) return false;
        return true;
      };

      const processSquare = function (matrix) {
        const processed = globals.toolset.matrix(matrix.length, matrix.length, squareCell());
        let previous = null;

        for (let r = matrix.length - 1; r >= 0; r--) {
          for (let c = matrix.length - 1; c >= 0; c--) {
            let rightZeros = 0,
              belowZeros = 0;
            if (matrix[r][c] == 0) {
              rightZeros++;
              belowZeros++;

              if (c + 1 < matrix.length) {
                previous = processed[r][c + 1];
                rightZeros += previous.zerosRight;
              }
              if (r + 1 < matrix.length) {
                previous = processed[r + 1][c];
                belowZeros += previous.zerosBelow;
              }
            }
            processed[r][c] = squareCell(rightZeros, belowZeros);
          }
        }
        return processed;
      };

      return function (matrix) {
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect vertex order matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }
        let square = null,
          processed = processSquare(matrix);
        for (let i = matrix.length; i >= 1; i--) {
          square = findSquareWithSize(processed, i);
          if (square != null) return square;
        }
        return null;
      };
    })();
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Integer} maximum sum of submatrix elements.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var maxSubmatrixSum = globals.toolset.getMaxSubMatrix(matrix);
     */
    const getMaxSubMatrix = (function () {
      const precomputeMatrix = function (matrix) {
        const sumMatrix = globals.toolset.matrix(matrix.length, matrix[0].length, 0);
        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[0].length; j++) {
            if (i == 0 && j == 0) {
              sumMatrix[i][j] = matrix[i][j];
            } else if (j == 0) {
              sumMatrix[i][j] = sumMatrix[i - 1][j] + matrix[i][j];
            } else if (i == 0) {
              sumMatrix[i][j] = sumMatrix[i][j - 1] + matrix[i][j];
            } else {
              sumMatrix[i][j] =
                sumMatrix[i - 1][j] + sumMatrix[i][j - 1] - sumMatrix[i - 1][j - 1] + matrix[i][j];
            }
          }
        }
        return sumMatrix;
      };

      const computeSum = function (sumMatrix, i1, i2, j1, j2) {
        if (i1 == 0 && j1 == 0) {
          return sumMatrix[i2][j2];
        } else if (i1 == 0) {
          return sumMatrix[i2][j2] - sumMatrix[i2][j1 - 1];
        } else if (j1 == 0) {
          return sumMatrix[i2][j2] - sumMatrix[i1 - 1][j2];
        } else {
          return (
            sumMatrix[i2][j2] - sumMatrix[i2][j1 - 1] - sumMatrix[i1 - 1][j2] + sumMatrix[i1 - 1][j1 - 1]
          );
        }
      };

      return function (matrix) {
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect vertex order matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }

        let maxArea = Number.MIN_VALUE;
        const matrixCompute = precomputeMatrix(matrix);
        for (let row1 = 0; row1 < n; row1++) {
          for (let row2 = row1; row2 < n; row2++) {
            for (let col1 = 0; col1 < nn; col1++) {
              for (let col2 = col1; col2 < nn; col2++) {
                maxArea = Math.max(maxArea, computeSum(matrix, row1, row2, col1, col2));
              }
            }
          }
        }
        return maxArea;
      };
    })();
    //----------------------------------------------------------------------------------------------
    /**
     * @public
     * @module matrix
     * @param {Array} matrix Matrix array.
     * @return {Integer} maximum sum of submatrix elements.
     *
     * @example
     * var matrix = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
     * var maxSubmatrixSum = globals.toolset.getMaxSubMatrix(matrix);
     */
    const getMaxSubMatrix2 = (function () {
      const clearArray = function (array) {
        for (let i = 0; i < array.length; i++) {
          array[i] = 0;
        }
      };

      const maxSubArray = function (array, N) {
        let maxSum = 0;
        let runningSum = 0;

        for (let i = 0; i < N; i++) {
          runningSum += array[i];
          maxSum = Math.max(maxSum, runningSum);

          if (runningSum < 0) runningSum = 0;
        }
        return maxSum;
      };

      return function (matrix) {
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect vertex order matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }

        const partialSum = globals.toolset.vector(nn, 0);
        let maxSum = 0,
          tempMaxSum;

        for (let rowStart = 0; rowStart < n; rowStart++) {
          clearArray(partialSum);

          for (let rowEnd = rowStart; rowEnd < n; rowEnd++) {
            for (let i = 0; i < nn; i++) {
              partialSum[i] += matrix[rowEnd][i];
            }

            tempMaxSum = maxSubArray(partialSum, nn);
            maxSum = Math.max(maxSum, tempMaxSum);
          }
        }
        return maxSum;
      };
    })();
    //----------------------------------------------------------------------------------------------
    const hasWon = (function () {
      const EMPTY = 0;
      const CROSS = 1;
      const NOUGHT = 2;

      return function (matrix) {
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }
        let row = (col = 0);
        for (row = 0; row < n; row++) {
          if (matrix[row][0] != EMPTY) {
            for (col = 1; col < nn; col++) {
              if (matrix[row][col] != matrix[row][col - 1]) break;
            }
            if (col == nn) return matrix[row][0];
          }
        }
        for (col = 0; col < nn; col++) {
          if (matrix[0][col] != EMPTY) {
            for (row = 1; row < n; row++) {
              if (matrix[row][col] != matrix[row - 1][col]) break;
            }
            if (row == n) return matrix[0][col];
          }
        }

        if (matrix[0][0] != EMPTY) {
          for (row = 1; row < n; row++) {
            if (matrx[row][row] != matrix[row - 1][row - 1]) break;
          }
          if (row == n) return matrix[0][0];
        }

        if (matrix[n - 1][0] != EMPTY) {
          for (row = 1; row < n; row++) {
            if (matrix[n - row - 1][row] != matrix[n - row][row - 1]) break;
          }
          if (row == n) return matrix[n - 1][0];
        }
        return EMPTY;
      };
    })();
    //----------------------------------------------------------------------------------------------
    const findElement = function (matrix, elem) {
      if (!globals.toolset.isNumber(elem)) {
        throw {
          name: 'ValueError',
          message: `incorrect input parameter: elem < ${elem} >`,
        };
      }
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect vertex order matrix < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      let row = 0,
        col = nn - 1;
      while (row < n && col >= 0) {
        if (matrix[row][col] == elem) {
          return true;
        } else if (matrix[row][col] > elem) {
          col--;
        } else {
          row++;
        }
      }
      return false;
    };
    //----------------------------------------------------------------------------------------------
    const findElement2 = (function () {
      var coordinate = function (row, column) {
        //var that = {};
        const that = Object.create(globals.collections.coordinate);
        that.prototype = globals.collections.coordinate;
        //
        const isCoordinate = function (x) {
          return true;
          //return (x instanceof coordinate);
        };
        //
        const init = function () {
          if (!globals.toolset.isIntNumber(row) || !globals.toolset.isIntNumber(column)) {
            throw {
              name: 'ValueError',
              message: `incorrect initialization values: row < ${row} >, column < ${column} >`,
            };
          }
          that.row = row;
          that.column = column;
        };
        that.inbounds = function (matrix) {
          if (!globals.toolset.isArray(matrix)) {
            throw {
              name: 'ValueError',
              message: `incorrect vertex order matrix < ${matrix} >`,
            };
          }
          const n = matrix.length;
          const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
          return this.row >= 0 && this.column >= 0 && this.row < n && this.column < nn;
        };
        that.isBefore = function (coord) {
          if (!isCoordinate(coord)) {
            throw {
              name: 'ValueError',
              message: `incorrect coordinate object < ${coord} >`,
            };
          }
          return this.row <= coord.row && this.column <= coord.column;
        };
        that.clone = function () {
          return coordinate(this.row, this.column);
        };
        that.setToAverage = function (min, max) {
          if (!isCoordinate(min) || !isCoordinate(max)) {
            throw {
              name: 'ValueError',
              message: `incorrect coordinate objects: min < ${min} >, max < ${max} >`,
            };
          }
          this.row = Math.floor((min.row + max.row) / 2);
          this.column = Math.floor((min.column + max.column) / 2);
        };
        init();
        return that;
      };

      const partitionAndSearch = function (matrix, origin, dest, pivot, elem) {
        const lowerLeftOrigin = coordinate(pivot.row, origin.column);
        const lowerLeftDest = coordinate(dest.row, pivot.column - 1);
        const upperRightOrigin = coordinate(origin.row, pivot.column);
        const upperRightDest = coordinate(pivot.row - 1, dest.column);

        const lowerLeft = findElement_(matrix, lowerLeftOrigin, lowerLeftDest, elem);
        if (lowerLeft == null) {
          return findElement_(matrix, upperRightOrigin, upperRightDest, elem);
        }
        return lowerLeft;
      };

      const findElemement_ = function (matrix, origin, dest, elem) {
        if (!origin.inbounds(matrix) || !dest.inbounds(matrix)) {
          return null;
        }
        if (matrix[origin.row][origin.column] == elem) {
          return origin;
        } else if (!origin.isBefore(dest)) {
          return null;
        }

        const start = origin.clone();
        const diagDist = Math.min(dest.row - origin.row, dest.column - origin.column);
        const end = coordinate(start.row + diagDist, start.column + diagDist);
        const p = coordinate(0, 0);

        while (start.isBefore(end)) {
          p.setToAverage(start, end);
          if (elem > matrix[p.row][p.column]) {
            start.row = p.row + 1;
            start.column = p.column + 1;
          } else {
            end.row = p.row - 1;
            end.column = p.column - 1;
          }
        }
        return partitionAndSearch(matrix, origin, dest, start, elem);
      };

      return function (matrix, elem) {
        if (!globals.toolset.isNumber(elem)) {
          throw {
            name: 'ValueError',
            message: `incorrect input parameter: elem < ${elem} >`,
          };
        }
        if (!globals.toolset.isArray(matrix)) {
          throw {
            name: 'ValueError',
            message: `incorrect vertex order matrix < ${matrix} >`,
          };
        }
        const n = matrix.length;
        const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
        if (n === 0 || nn === 0 || n !== nn) {
          throw {
            name: 'ValueError',
            message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
          };
        }
        const origin = coordinate(0, 0);
        const dest = coordinate(n - 1, nn - 1);
        return findElement_(matrix, origin, dest, elem);
      };
    })();
    //----------------------------------------------------------------------------------------------
    const setZeros = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect input parameter: array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const row = globals.toolset.vector(n),
        column = globals.toolset.vector(nn);
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < nn; j++) {
          if (matrix[i][j] == 0) {
            row[i] = true;
            column[j] = true;
          }
        }
      }
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < nn; j++) {
          if (row[i] || column[j]) {
            matrix[i][j] = 0;
          }
        }
      }
    };
    //----------------------------------------------------------------------------------------------
    const rotate = function (matrix, n) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect input parameter: array < ${matrix} >`,
        };
      }
      var n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const num = Math.floor(n / 2);
      for (let i = 0; i < num; ++i) {
        const first = i;
        const last = n - 1 - i;
        for (let j = first; j < last; ++j) {
          const offset = j - first;
          const t = matrix[first][j];
          matrix[first][j] = matrix[last - offset][first];
          matrix[last - offset][first] = matrix[last][last - offset];
          matrix[last][last - offset] = matrix[j][last];
          matrix[j][last] = top;
        }
      }
    };
    //----------------------------------------------------------------------------------------------
    const vectorToMatrix = function (vec, rang) {
      if (!globals.toolset.isArray(vec)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {array} not an array < ${vec} >`,
        };
      }
      if (!globals.toolset.isIntNumber(rang)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {rang} not an integer number < ${rang} >`,
        };
      }
      if (rang <= 0 || rang >= vec.length) {
        throw {
          name: 'ValueError',
          message: `incorrect input argument: {rang} is out of bounds {1, ${vec.length}}`,
        };
      }
      const mat = globals.toolset.matrix(rang, rang, null);
      for (var k = 0, i, j; k < vec.length; k++) {
        i = Math.floor(k / rang);
        j = k - Math.floor(k / rang) * rang;
        mat[i][j] = vec[k];
      }
      return mat;
    };
    //----------------------------------------------------------------------------------------------
    const matrixToVector = function (mat) {
      if (!globals.toolset.isArray(mat)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {mat} not a matrix < ${mat} >`,
        };
      }
      const n = mat.length;
      const nn = globals.toolset.isArray(mat[0]) ? mat[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const vec = globals.toolset.vector(n * nn, null);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nn; j++) {
          vec[i * nn + j] = mat[i][j];
        }
      }
      return vec;
    };
    //----------------------------------------------------------------------------------------------
    const matrixToVector2 = function (mat) {
      if (!globals.toolset.isArray(mat)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: {mat} not a matrix < ${mat} >`,
        };
      }
      const n = mat.length;
      const nn = globals.toolset.isArray(mat[0]) ? mat[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const vec = globals.toolset.vector((n * (n + 1)) / 2, null);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          vec[k] = mat[i][j];
          k++;
        }
      }
      return vec;
    };
    //----------------------------------------------------------------------------------------------
    const norm = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'ValueError',
          message: `incorrect input parameter: array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      let s = 0,
        norm = -1;
      for (let i = 0; i < n; i++) {
        s = 0;
        for (let j = 0; j < nn; j++) {
          s += Math.abs(matrix[i][j]);
        }
        if (s > norm) norm = s;
      }
      return norm;
    };
    //----------------------------------------------------------------------------------------------
    const spiral = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      const res = globals.toolset.vector();
      for (let sh = n; sh > 1; sh--) {
        for (var j = n - sh; j < sh; j++) {
          res.push(matrix[n - sh][j]);
        }
        --j;
        for (var i = n - sh + 1; i < sh; i++) {
          res.push(matrix[i][j]);
        }
        --i;
        for (j = sh - 1 - 1; j >= n - sh; j--) {
          res.push(matrix[i][j]);
        }
        ++j;
        for (i = sh - 1 - 1; i > n - sh; i--) {
          res.push(matrix[i][j]);
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    const sortByMaxColumn = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      let maxSum, sum;
      for (let j = 0; j < nn - 1; j++) {
        maxSum = 0;
        for (var i = 0; i < n; i++) {
          maxSum += matrix[i][j];
        }
        for (let jj = j + 1; jj < nn; jj++) {
          sum = 0;
          for (var i = 0; i < n; i++) {
            sum += matrix[i][jj];
          }
          if (maxSum < sum) {
            maxSum = sum;
            swapColumns(matrix, j, jj);
          }
        }
      }
    };
    //----------------------------------------------------------------------------------------------
    // Используется алгоритм Барейса, сложность O(n^3)
    const determinant = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      //clone matrix
      let matrix2 = globals.toolset.matrix(n, nn, 0),
        denom = 1,
        exchanges = 0;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < nn; j++) {
          matrix2[i][j] = matrix[i][j];
        }
      }

      for (var i = 0; i < n - 1; i++) {
        let maxN = i,
          maxValue = Math.abs(matrix2[i][i]);
        for (var j = i + 1; j < nn; j++) {
          const value = Math.abs(matrix2[j][i]);
          if (value > maxValue) {
            maxN = j;
            maxValue = value;
          }
        }
        if (maxN > i) {
          swapRows(matrix2, i, maxN);
          exchanges++;
        } else {
          if (maxValue === 0) {
            return maxValue;
          }
        }

        const value1 = matrix2[i][i];
        for (var j = i + 1; j < n; j++) {
          const value2 = matrix2[j][i];
          matrix2[j][i] = 0;
          for (let k = i + 1; k < nn; k++) {
            matrix2[j][k] = Math.floor((matrix2[j][k] * value1 - matrix2[i][k] * value2) / denom);
          }
        }
        denom = value1;
      }
      return exchanges % 2 ? -matrix2[n - 1][nn - 1] : matrix2[n - 1][nn - 1];
    };
    //----------------------------------------------------------------------------------------------
    const adjugateMatrix = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }

      const res = globals.toolset.matrix(n, nn, 0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nn; j++) {
          const temp = [],
            sign = (i + j) % 2 == 0 ? 1 : -1;
          for (var m = 0; m < j; m++) {
            temp[m] = [];
            for (var c = 0; c < i; c++) {
              temp[m][c] = matrix[m][c];
            }
            for (var c = i + 1; c < nn; c++) {
              temp[m][c - 1] = matrix[m][c];
            }
          }
          for (var m = j + 1; m < n; m++) {
            temp[m - 1] = [];
            for (var c = 0; c < i; c++) {
              temp[m - 1][c] = matrix[m][c];
            }
            for (var c = i + 1; c < nn; c++) {
              temp[m - 1][c - 1] = matrix[m][c];
            }
          }
          res[i][j] = sign * determinant(temp);
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    const inverseMatrix = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }

      const det = determinant(matrix);
      if (det == 0) return false;

      const res = adjugateMatrix(matrix);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < nn; j++) {
          res[i][j] = Math.floor(res[i][j] / det);
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    const matrixRank = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      let k = n < nn ? n : nn,
        r = 1,
        rank = 0;
      while (r <= k) {
        const temp = globals.toolset.matrix(r, r, 0);
        for (let a = 0; a < n - r + 1; a++) {
          for (let b = 0; b < nn - r + 1; b++) {
            for (let c = 0; c < r; c++) {
              for (let d = 0; d < r; d++) {
                temp[c][d] = matrix[a + c][b + d];
              }
            }
            if (determinant(temp) !== 0) {
              rank = r;
            }
          }
        }
        r++;
      }
      return rank;
    };
    //----------------------------------------------------------------------------------------------
    const maxInRows = function (rows) {
      if (!globals.toolset.isArray(rows)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <rows> is not array < ${rows} >`,
        };
      }
      const n = rows.length;
      const nn = globals.toolset.isArray(rows[0]) ? rows[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }

      return rows.map(function (row) {
        return row.reduce(function (max, cell) {
          return Math.max(max, cell);
        }, 0);
      });
    };
    //----------------------------------------------------------------------------------------------
    const maxInCols = function (rows) {
      if (!globals.toolset.isArray(rows)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <rows> is not array < ${rows} >`,
        };
      }
      const n = rows.length;
      const nn = globals.toolset.isArray(rows[0]) ? rows[0].length : 0;
      if (n === 0 || nn === 0) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }

      return rows[0].map(function (_, i) {
        return rows.reduce(function (max, row) {
          return Math.max(max, row[i]);
        }, 0);
      });
    };
    //----------------------------------------------------------------------------------------------
    /*
     *	Функция отдаёт число, обозначающее:
     *	1 - не магический квадрат
     *	2 - полумагический (только строки и столбцы)
     *	3 - диагональный магический квадрат (только диагонали!)
     *	4 - магический квадрат (строки, столбцы, диагонали)
     */
    const isMagicSquare = function (matrix) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <matrix> is not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }

      const m = (n * (n * n + 1)) / 2;
      let mag = 2;
      let leftDiagonal = (rightDiagonal = 0);

      for (let i = 0; i < n; i++) {
        let row = 0;
        let col = 0;

        for (let j = 1; j <= nn; j++) {
          row += matrix[i][j];
          col += matrix[j][i];
          rightDiagonal += i == j ? matrix[i][i] : 0;
          leftDiagonal += n - i == j - 1 ? matrix[i][j] : 0;
        }
        if (row != m || col != m) {
          mag = 1;
        }
      }
      if (leftDiagonal == m && rightDiagonal == m) {
        mag += 2;
      }
      return mag;
    };
    //----------------------------------------------------------------------------------------------
    const createMagicSquare = function (n) {
      if (!globals.toolset.isInteger(n) || n < 0 || n % 2 == 0) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <n> is not odd number < ${n} >`,
        };
      }
      const res = globals.toolset.matrix(n, n, 0);
      for (let i = 0, nn = 1, ss = (n - 1) / 2; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const x = (-ss + i + j + n) % n;
          const y = (ss + i - j + n) % n;
          res[x][y] = nn++;
        }
      }
      return res;
    };
    //----------------------------------------------------------------------------------------------
    const createMagicSquareTerraces = function (n) {
      if (!globals.toolset.isInteger(n) || n < 0 || n % 2 == 0) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <n> is not odd number < ${n} >`,
        };
      }
      const res = globals.toolset.matrix(n, n, null);

      let num = 1;
      let glob_i = Math.round(n / 2);
      let glob_j = 2 - glob_i;

      while (num < n * n) {
        var i = glob_i;
        var j = glob_j;

        while (i + 1 != glob_j) {
          res[i--][j++] = num++;
        }

        glob_i++;
        glob_j++;
      }

      // заполнение левой части квадрата, относительно
      // левой диагонали (саму диагональ не трогаем)
      glob_i = 1;
      glob_j = n;

      while (glob_i <= n - 1 && glob_j >= 2) {
        for (j = 1; j <= glob_j; j++) {
          if (res[glob_i][j] == null) {
            if (res[glob_i + n][j] != null) {
              res[glob_i][j] = res[glob_i + n][j];
              res[glob_i + n][j] = null;
            } else {
              res[glob_i][j] = res[glob_i][j + n];
              res[glob_i][j + n] = null;
            }
          }
        }
        glob_i++;
        glob_j--;
      }

      // заполнение правой части квадрата, относительно
      // левой диагонали (саму диагональ не трогаем)
      glob_j = n - 2;
      for (i = n; i >= 2; i--) {
        for (j = n; j >= n - glob_j; j--) {
          if (res[i][j] == null) {
            if (res[i - n][j] != null) {
              res[i][j] = res[i - n][j];
              res[i - n][j] = null;
            } else {
              res[i][j] = res[i][j - n];
              res[i][j - n] = null;
            }
          }
        }
        glob_j--;
      }

      res.foreach(function (item, i, arr) {
        const temp = item.every(function (elem, index, array) {
          return elem == null;
        });
        //item.every(elem => elem == null);
        if (temp) {
          //res.splice(i, 1);
          res[i] = null;
        }
      });

      return res;
    };
    //----------------------------------------------------------------------------------------------
    /**
     * Multiply matrix A by matrix B to nest transformations
     * @static
     * @memberOf fabric.util
     * @param  {Array} a First transformMatrix
     * @param  {Array} b Second transformMatrix
     * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
     * @return {Array} The product of the two transform matrices
     */
    const multiplyTransformMatrices = function (a, b, is2x2) {
      // Matrix multiply a * b
      return [
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
        is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
      ];
    };
    //----------------------------------------------------------------------------------------------
    /**
     * Decomposes standard 2x2 matrix into transform componentes
     * @static
     * @memberOf fabric.util
     * @param  {Array} a transformMatrix
     * @return {Object} Components of transform
     */
    const qrDecompose = function (a) {
      const angle = atan2(a[1], a[0]),
        denom = pow(a[0], 2) + pow(a[1], 2),
        scaleX = sqrt(denom),
        scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
        skewX = atan2(a[0] * a[2] + a[1] * a[3], denom);
      return {
        angle: angle / PiBy180,
        scaleX,
        scaleY,
        skewX: skewX / PiBy180,
        skewY: 0,
        translateX: a[4],
        translateY: a[5],
      };
    };
    //----------------------------------------------------------------------------------------------
    const customTransformMatrix = function (scaleX, scaleY, skewX) {
      const skewMatrixX = [1, 0, abs(Math.tan(skewX * PiBy180)), 1],
        scaleMatrix = [abs(scaleX), 0, 0, abs(scaleY)];
      return multiplyTransformMatrices(scaleMatrix, skewMatrixX, true);
    };
    //----------------------------------------------------------------------------------------------
    const choleskyDecomposition = function (array) {
      if (!globals.toolset.isArray(matrix)) {
        throw {
          name: 'TypeError',
          message: `incorrect input argument: <matrix> is not array < ${matrix} >`,
        };
      }
      const n = matrix.length;
      const nn = globals.toolset.isArray(matrix[0]) ? matrix[0].length : 0;
      if (n === 0 || nn === 0 || n !== nn) {
        throw {
          name: 'ValueError',
          message: `incorrect matrix size: rows < ${n} >, columns < ${nn} >`,
        };
      }
      var matrix = globals.toolset.vector(n, null);
      for (let i = 0; i < array.length; i++) {
        //L - треугольная матрица, поэтому в i-ой строке i+1 элементов
        matrix[i] = globals.toolset.vector(i + 1, null);
        var temp;
        //Сначала вычисляем значения элементов слева от диагонального элемента,
        //так как эти значения используются при вычислении диагонального элемента.
        for (let j = 0; j < i; j++) {
          temp = 0;
          for (var k = 0; k < j; k++) {
            temp += matrix[i][k] * matrix[j][k];
          }
          matrix[i][j] = (array[i][j] - temp) / matrix[j][j];
        }

        //Находим значение диагонального элемента
        temp = array[i][i];
        for (var k = 0; k < i; k++) {
          temp -= matrix[i][k] * matrix[i][k];
        }
        matrix[i][i] = Math.sqrt(temp);
      }
      return matrix;
    };
    //----------------------------------------------------------------------------------------------
    /*
    function MatrixRank(A)
    {
        var m = A.length, n = A[0].length, k = (m < n ? m : n), r = 1, rank = 0;
        while (r <= k)
         { var B = [];
           for (var i = 0; i < r; i++) B[i] = [];
           for (var a = 0; a < m-r+1; a++)
            { for (var b = 0; b < n-r+1; b++)
               { for (var c = 0; c < r; c++)
                  { for (var d = 0; d < r; d++) B[c][d] = A[a+c][b+d]; }
                 if (Determinant(B) != 0) rank = r;
               }       // Функцию Determinant см. выше
            }
           r++;
         }
        return rank;
    }
    */
    //----------------------------------------------------------------------------------------------
    // Exports
    globals.matrix.swapColumns = swapColumns;
    globals.matrix.swapRows = swapRows;
    globals.matrix.sortByColumn = sortByColumn;
    globals.matrix.getMinMax = getMinMax;
    globals.matrix.multiplicationOrder = multiplicationOrder;
    globals.matrix.sort = sort;
    globals.matrix.transpose = transpose;
    globals.matrix.multMatrix = multMatrix;
    globals.matrix.multNumber = multNumber;
    globals.matrix.sumMatrix = sumMatrix;
    globals.matrix.matrixPow = matrixPow;
    globals.matrix.addOnColumns = addOnColumns;
    globals.matrix.addOnRows = addOnRows;
    globals.matrix.identity = identity;
    globals.matrix.findSquare = findSquare;
    globals.matrix.getMaxSubMatrix = getMaxSubMatrix;
    globals.matrix.hasWon = hasWon;
    globals.matrix.findElement = findElement;
    globals.matrix.setZeros = setZeros;
    globals.matrix.rotate = rotate;
    globals.matrix.matrixToVector = matrixToVector;
    globals.matrix.vectorToMatrix = vectorToMatrix;
    globals.matrix.norm = norm;
    globals.matrix.spiral = spiral;
    globals.matrix.sortByMaxColumn = sortByMaxColumn;
    globals.matrix.determinant = determinant;
    globals.matrix.adjugateMatrix = adjugateMatrix;
    globals.matrix.inverseMatrix = inverseMatrix;
    globals.matrix.matrixRank = matrixRank;
    globals.matrix.maxInCols = maxInCols;
    globals.matrix.maxInRows = maxInRows;
    globals.matrix.isMagicSquare = isMagicSquare;
  })();
})(typeof exports !== 'undefined' ? exports : this);
