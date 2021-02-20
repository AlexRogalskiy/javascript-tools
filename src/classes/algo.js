//https://ru.wikiversity.org/wiki/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC_%D0%BD%D0%B0_%D1%8F%D0%B7%D1%8B%D0%BA%D0%B5_Python
//https://ru.wikibooks.org/wiki/Реализации_алгоритмов
//Редакционное предписание
class Prescription {
	public String route;
	public int distance;
	Prescription(int distance, String route) {
		this.distance = distance;
		this.route = route;
	}
}
//С максимальной скоростью
//time = O(n * n)
//memory = O(n * n)
Prescription Levenshtein1(String S1, String S2) {
	int m = S1.length(), n = S2.length();
	int[][] D = new int[m + 1][n + 1];
	char[][] P = new char[m + 1][n + 1];

	// Базовые значения
	for (int i = 0; i <= m; i++) {
		D[i][0] = i;
		P[i][0] = 'D';
	}
	for (int i = 0; i <= n; i++) {
		D[0][i] = i;
		P[0][i] = 'I';
	}

	for (int i = 1; i <= m; i++)
		for (int j = 1; j <= n; j++) {
			int cost = (S1.charAt(i - 1) != S2.charAt(j - 1)) ? 1 : 0;
			if(D[i][j - 1] < D[i - 1][j] && D[i][j - 1] < D[i - 1][j - 1] + cost) {
				//Вставка
				D[i][j] = D[i][j - 1] + 1;
				P[i][j] = 'I';
			}
			else if(D[i - 1][j] < D[i - 1][j - 1] + cost) {
				//Удаление
				D[i][j] = D[i - 1][j] + 1;
				P[i][j] = 'D';
			}
			else {
				//Замена или отсутствие операции
				D[i][j] = D[i - 1][j - 1] + cost;
				P[i][j] = (cost == 1) ? 'R' : 'M';
			}
		}

	//Восстановление предписания
	StringBuilder route = new StringBuilder("");
	int i = m, j = n;
	do {
		char c = P[i][j];
		route.append(c);
		if(c == 'R' || c == 'M') {
			i --;
			j --;
		}
		else if(c == 'D') {
			i --;
		}
		else {
			j --;
		}
	} while((i != 0) || (j != 0));
	return new Prescription(D[m][n], route.reverse().toString());
}
//С минимальным потреблением памяти
//time = O(n * n * n)
//memory = O(n)
Prescription Levenshtein2(String S1, String S2) {
	int m = S1.length(), n = S2.length();
	int[] D1 = new int[n + 1];
	int[] D2 = new int[n + 1];
	char[] P1 = new char[n + 1];
	char[] P2 = new char[n + 1];

	int d = 0;
	StringBuilder route = new StringBuilder("");
	int iPos = m, jPos = n;
	do {
		for(int i = 0; i <= jPos; i ++)
			D2[i] = i;

		for(int i = 1; i <= iPos; i ++) {

			D1 = D2;
			D2 = new int[jPos + 1];

			P1 = P2;
			P2 = new char[jPos + 1];

			for(int j = 0; j <= jPos; j ++) {
				if(j == 0) D2[j] = i;
				else {
					int cost = (S1.charAt(i - 1) != S2.charAt(j - 1)) ? 1 : 0;
					if(D2[j - 1] < D1[j] && D2[j - 1] < D1[j - 1] + cost) {
						//Вставка
						D2[j] = D2[j - 1] + 1;
						P2[j] = 'I';
					}
					else if(D1[j] < D1[j - 1] + cost) {
						//Удаление
						D2[j] = D1[j] + 1;
						P2[j] = 'D';
					}
					else {
						//Замена или отсутствие операции
						D2[j] = D1[j - 1] + cost;
						P2[j] = (cost == 1) ? 'R' : 'M';
					}
				}
			}
		}
		if(iPos == m && jPos == n) d = D2[n];
		//Восстановление действий за две последние строки
		int _iPos = iPos;
		while(iPos >= _iPos - 1 && iPos !=0 && jPos != 0) {
			char c = (iPos == _iPos) ? P2[jPos] : P1[jPos];
			route.append(c);
			if(c == 'R' || c == 'M') {
				iPos --;
				jPos --;
			}
			else if(c == 'D') {
				iPos --;
			}
			else {
				jPos --;
			}
		}
	} while((iPos != 0) && (jPos != 0));
	return new Prescription(d, route.reverse().toString());
}
//Сбалансированный вариант
//time = O(n * n * Math.sqrt(n));
//memory = O(n * Math.sqrt(n))
Prescription Levenshtein3(String S1, String S2) {
	int m = S1.length(), n = S2.length();
	int h = (int)Math.sqrt(m + 1);
	int[][] D = new int[h + 1][n + 1];
	char[][] P = new char[h + 1][n + 1];

	int d = 0;
	StringBuilder route = new StringBuilder("");
	int iPos = m, jPos = n;
	do {
		for (int i = 0; i <= jPos; i++) {
			D[0][i] = i;
			P[0][i] = 'I';
		}
		int _i = 1;
		for(int i = 1; i <= iPos; i ++) {
			for(int j = 0; j <= jPos; j ++) {
				if(j == 0) D[_i][j] = i;
				else {
					int cost = (S1.charAt(i - 1) != S2.charAt(j - 1)) ? 1 : 0;
					if(D[_i][j - 1] < D[_i - 1][j] && D[_i][j - 1] < D[_i - 1][j - 1] + cost) {
						//Вставка
						D[_i][j] = D[_i][j - 1] + 1;
						P[_i][j] = 'I';
					}
					else if(D[_i - 1][j] < D[_i - 1][j - 1] + cost) {
						//Удаление
						D[_i][j] = D[_i - 1][j] + 1;
						P[_i][j] = 'D';
					}
					else {
						//Замена или отсутствие операции
						D[_i][j] = D[_i - 1][j - 1] + cost;
						P[_i][j] = (cost == 1) ? 'R' : 'M';
					}
				}
			}
			if(i % h == 0) {
				//Выделение памяти для новых строк и копирование последней из прошлой полосы в первую строку новой
				int[] vRow = new int[n + 1];
				char[] cRow = new char[n + 1];
				for(int j = 0; j <= n; j ++) {
					vRow[j] = D[_i][j];
					cRow[j] = P[_i][j];
				}
				D = new int[h + 1][n + 1];
				P = new char[h + 1][n + 1];
				for(int j = 0; j <= n; j ++) {
					D[0][j] = vRow[j];
					P[0][j] = cRow[j];
				}
				_i = 0;
			}
			_i++;
		}
		if(iPos == m && jPos == n) d = D[_i - 1][n];
		//Восстановление предписания в последних _i - 1 строках
		while(_i > 0 && iPos !=0 && jPos != 0) {
			char c = P[_i - 1][jPos];
			route.append(c);
			if(c == 'R' || c == 'M') {
				iPos --;
				jPos --;
				_i --;
			}
			else if(c == 'D') {
				iPos --;
				_i --;
			}
			else {
				jPos --;
			}
		}
	} while((iPos != 0) && (jPos != 0));

	return new Prescription(d, route.reverse().toString());
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Построение магических квадратов
//Метод квадратных решеток (для порядка двойной четности)
size = 12
square = [[0 for j in range(size)] for i in range(size + 2 * (size / 2 - 1))]
counter = 1
i0 = size / 2 - 1
for k in range(size / 4):
    for j, i in enumerate(range(size / 2) + sorted(range(size / 2), reverse=True)):
        square[i0 - i][j] = counter
        counter += 1
    for j, i in enumerate(range(size / 2) + sorted(range(size / 2), reverse=True)):
        square[i0 + 1 + i][size - 1 - j] = counter
        counter += 1
    for j, i in enumerate(range(size / 2) + sorted(range(size / 2), reverse=True)):
        square[i0 + 2 - i][size - 1 - j] = counter
        counter += 1
    for j, i in enumerate(range(size / 2) + sorted(range(size / 2), reverse=True)):
        square[i0 + 3 + i][j] = counter
        counter += 1
    i0 += 4
for i in range(size / 2 - 1):
    for j in range(size):
        square[i - (size / 2) * 2 + 2][j] = square[i][j] or square[i - (size / 2) * 2 + 2][j]
        square[i][j] = 0
        square[i + (size / 2) - 1][j] = square[i - (size / 2) + 1][j] or square[i + (size / 2) - 1][j]
        square[i - (size / 2) + 1][j] = 0
square = [square[i] for i in range(size / 2 - 1, size + size / 2 - 1)]
for i in range(len(square)):
    for j in range(len(square[i])):
        print '%d\t' %square[i][j],
    print
//Метод четырех квадратов (для четного порядка)
size = 14
square = [[0 for j in range(size)] for i in range(size)]
quarter_square = get_terrace(size / 2)         # получаем методом террас
for n, ij0 in enumerate([(0, 0), (size / 2, size / 2), (0, size / 2), (size / 2, 0)]):
    i0, j0 = ij0
    for i in range(size / 2):
        for j in range(size / 2):
            square[i + i0][j + j0] = quarter_square[i][j] + n * (size / 2) ** 2
square[0][0],           square[size / 2][0],    square[size / 2 - 1][0],    square[size - 1][0] = \
square[size / 2][0],    square[0][0],           square[size - 1][0],        square[size / 2 - 1][0]
for i in range(1, size / 2 - 1):
    square[i][1], square[i + size / 2][1] = square[i + size / 2][1], square[i][1]
if size > 6:
    for j in range(size / 2 - (size / 2 - 3) / 2, size / 2 + (size / 2 - 3) / 2):
        for i in range(size / 2):
            square[i][j], square[size / 2 + i][j] = square[size / 2 + i][j], square[i][j]
for i in range(len(square)):
    for j in range(len(square[i])):
        print '%d\t' %square[i][j],
    print
	
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Тест Пепина
base = 3

while True:
    try:
        character = int(input('Input an index of the Fermat number, please: '))
        break
    except ValueError:
        print("The index should be a number. Try again, please.")

power = 2 ** character - 1
fermat_number = 2 ** (2 ** character) + 1

for i in range(1, power+1):
    base = (base ** 2) % fermat_number

if base == (fermat_number - 1):
    print ('The number F' + str(character) + ' is prime')
else:
    print ('The number F' + str(character) + ' is composite')

print('F' + str(character) + ' = ' + str(fermat_number))
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import java.util.ArrayList;

public class Hungarian {

	private int numRows;
	private int numCols;

	private boolean[][] primes;
	private boolean[][] stars;
	private boolean[] rowsCovered;
	private boolean[] colsCovered;
	private float[][] costs;

	public Hungarian(float theCosts[][]) {
		costs = theCosts;
		numRows = costs.length;
		numCols = costs[0].length;

		primes = new boolean[numRows][numCols];
		stars = new boolean[numRows][numCols];

		// Инициализация массивов с покрытием строк/столбцов
		rowsCovered = new boolean[numRows];
		colsCovered = new boolean[numCols];
		for (int i = 0; i < numRows; i++) {
			rowsCovered[i] = false;
		}
		for (int j = 0; j < numCols; j++) {
			colsCovered[j] = false;
		}
		// Инициализация матриц
		for (int i = 0; i < numRows; i++) {
			for (int j = 0; j < numCols; j++) {
				primes[i][j] = false;
				stars[i][j] = false;
			}
		}
	}

	public int[][] execute() {
		subtractRowColMins();

		this.findStars(); // O(n^2)
		this.resetCovered(); // O(n);
		this.coverStarredZeroCols(); // O(n^2)

		while (!allColsCovered()) {
			int[] primedLocation = this.primeUncoveredZero(); // O(n^2)

			// It's possible that we couldn't find a zero to prime, so we have to induce some zeros so we can find one to prime
			if (primedLocation[0] == -1) {
				this.minUncoveredRowsCols(); // O(n^2)
				primedLocation = this.primeUncoveredZero(); // O(n^2)
			}

			// is there a starred 0 in the primed zeros row?
			int primedRow = primedLocation[0];
			int starCol = this.findStarColInRow(primedRow);
			if (starCol != -1) {
				// cover ther row of the primedLocation and uncover the star column
				rowsCovered[primedRow] = true;
				colsCovered[starCol] = false;
			} else { // otherwise we need to find an augmenting path and start over.
				this.augmentPathStartingAtPrime(primedLocation);
				this.resetCovered();
				this.resetPrimes();
				this.coverStarredZeroCols();
			}
		}

		return this.starsToAssignments(); // O(n^2)

	}

	/*
	 * the starred 0's in each column are the assignments.
	 * O(n^2)
	 */
	public int[][] starsToAssignments() {
		int[][] toRet = new int[numCols][];
		for (int j = 0; j < numCols; j++) {
			toRet[j] = new int[] {
				this.findStarRowInCol(j), j
			}; // O(n)
		}
		return toRet;
	}

	/*
	 * resets prime information
	 */
	public void resetPrimes() {
		for (int i = 0; i < numRows; i++) {
			for (int j = 0; j < numCols; j++) {
				primes[i][j] = false;
			}
		}
	}


	/*
	 * resets covered information, O(n)
	 */
	public void resetCovered() {
		for (int i = 0; i < numRows; i++) {
			rowsCovered[i] = false;
		}
		for (int j = 0; j < numCols; j++) {
			colsCovered[j] = false;
		}
	}

	/*
	 * get the first zero in each column, star it if there isn't already a star in that row
	 * cover the row and column of the star made, and continue to the next column
	 * O(n^2)
	 */
	public void findStars() {
		boolean[] rowStars = new boolean[numRows];
		boolean[] colStars = new boolean[numCols];

		for (int i = 0; i < numRows; i++) {
			rowStars[i] = false;
		}
		for (int j = 0; j < numCols; j++) {
			colStars[j] = false;
		}

		for (int j = 0; j < numCols; j++) {
			for (int i = 0; i < numRows; i++) {
				if (costs[i][j] == 0 && !rowStars[i] && !colStars[j]) {
					stars[i][j] = true;
					rowStars[i] = true;
					colStars[j] = true;
					break;
				}
			}
		}
	}

	/*
	 * Finds the minimum uncovered value, and adds it to all the covered rows then
	 * subtracts it from all the uncovered columns. This results in a cost matrix with
	 * at least one more zero.
	 */
	private void minUncoveredRowsCols() {
		// find min uncovered value
		float minUncovered = Float.MAX_VALUE;
		for (int i = 0; i < numRows; i++) {
			if (!rowsCovered[i]) {
				for (int j = 0; j < numCols; j++) {
					if (!colsCovered[j]) {
						if (costs[i][j] < minUncovered) {
							minUncovered = costs[i][j];
						}
					}
				}
			}
		}

		// add that value to all the COVERED rows.
		for (int i = 0; i < numRows; i++) {
			if (rowsCovered[i]) {
				for (int j = 0; j < numCols; j++) {
					costs[i][j] = costs[i][j] + minUncovered;

				}
			}
		}

		// subtract that value from all the UNcovered columns
		for (int j = 0; j < numCols; j++) {
			if (!colsCovered[j]) {
				for (int i = 0; i < numRows; i++) {
					costs[i][j] = costs[i][j] - minUncovered;
				}
			}
		}
	}

	/*
	 * Finds an uncovered zero, primes it, and returns an array
	 * describing the row and column of the newly primed zero.
	 * If no uncovered zero could be found, returns -1 in the indices.
	 * O(n^2)
	 */
	private int[] primeUncoveredZero() {
		int[] location = new int[2];

		for (int i = 0; i < numRows; i++) {
			if (!rowsCovered[i]) {
				for (int j = 0; j < numCols; j++) {
					if (!colsCovered[j]) {
						if (costs[i][j] == 0) {
							primes[i][j] = true;
							location[0] = i;
							location[1] = j;
							return location;
						}
					}
				}
			}
		}

		location[0] = -1;
		location[1] = -1;
		return location;
	}

	/*
	 * Starting at a given primed location[0=row,1=col], we find an augmenting path
	 * consisting of a primed , starred , primed , ..., primed. (note that it begins and ends with a prime)
	 * We do this by starting at the location, going to a starred zero in the same column, then going to a primed zero in
	 * the same row, etc, until we get to a prime with no star in the column.
	 * O(n^2)
	 */
	private void augmentPathStartingAtPrime(int[] location) {
		// Make the arraylists sufficiently large to begin with
		ArrayList < int[] > primeLocations = new ArrayList < int[] > (numRows + numCols);
		ArrayList < int[] > starLocations = new ArrayList < int[] > (numRows + numCols);
		primeLocations.add(location);

		int currentRow = location[0];
		int currentCol = location[1];
		while (true) { // add stars and primes in pairs
			int starRow = findStarRowInCol(currentCol);
			// at some point we won't be able to find a star. if this is the case, break.
			if (starRow == -1) {
				break;
			}
			int[] starLocation = new int[] {
				starRow, currentCol
			};
			starLocations.add(starLocation);
			currentRow = starRow;

			int primeCol = findPrimeColInRow(currentRow);
			int[] primeLocation = new int[] {
				currentRow, primeCol
			};
			primeLocations.add(primeLocation);
			currentCol = primeCol;
		}

		unStarLocations(starLocations);
		starLocations(primeLocations);
	}


	/*
	 * Given an arraylist of  locations, star them
	 */
	private void starLocations(ArrayList < int[] > locations) {
		for (int k = 0; k < locations.size(); k++) {
			int[] location = locations.get(k);
			int row = location[0];
			int col = location[1];
			stars[row][col] = true;
		}
	}

	/*
	 * Given an arraylist of starred locations, unstar them
	 */
	private void unStarLocations(ArrayList < int[] > starLocations) {
		for (int k = 0; k < starLocations.size(); k++) {
			int[] starLocation = starLocations.get(k);
			int row = starLocation[0];
			int col = starLocation[1];
			stars[row][col] = false;
		}
	}


	/*
	 * Given a row index, finds a column with a prime. returns -1 if this isn't possible.
	 */
	private int findPrimeColInRow(int theRow) {
		for (int j = 0; j < numCols; j++) {
			if (primes[theRow][j]) {
				return j;
			}
		}
		return -1;
	}




	/*
	 * Given a column index, finds a row with a star. returns -1 if this isn't possible.
	 */
	public int findStarRowInCol(int theCol) {
		for (int i = 0; i < numRows; i++) {
			if (stars[i][theCol]) {
				return i;
			}
		}
		return -1;
	}


	public int findStarColInRow(int theRow) {
		for (int j = 0; j < numCols; j++) {
			if (stars[theRow][j]) {
				return j;
			}
		}
		return -1;
	}

	// looks at the colsCovered array, and returns true if all entries are true, false otherwise
	private boolean allColsCovered() {
		for (int j = 0; j < numCols; j++) {
			if (!colsCovered[j]) {
				return false;
			}
		}
		return true;
	}

	/*
	 * sets the columns covered if they contain starred zeros
	 * O(n^2)
	 */
	private void coverStarredZeroCols() {
		for (int j = 0; j < numCols; j++) {
			colsCovered[j] = false;
			for (int i = 0; i < numRows; i++) {
				if (stars[i][j]) {
					colsCovered[j] = true;
					break; // break inner loop to save a bit of time
				}
			}
		}
	}

	private void subtractRowColMins() {
		for (int i = 0; i < numRows; i++) { //for each row
			float rowMin = Float.MAX_VALUE;
			for (int j = 0; j < numCols; j++) { // grab the smallest element in that row
				if (costs[i][j] < rowMin) {
					rowMin = costs[i][j];
				}
			}
			for (int j = 0; j < numCols; j++) { // subtract that from each element
				costs[i][j] = costs[i][j] - rowMin;
			}
		}

		for (int j = 0; j < numCols; j++) { // for each col
			float colMin = Float.MAX_VALUE;
			for (int i = 0; i < numRows; i++) { // grab the smallest element in that column
				if (costs[i][j] < colMin) {
					colMin = costs[i][j];
				}
			}
			for (int i = 0; i < numRows; i++) { // subtract that from each element
				costs[i][j] = costs[i][j] - colMin;
			}
		}
	}

}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
