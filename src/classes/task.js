//k = j + rotdist;
//if(k >= n) k -= n;
/*const g = 9.8;
var T = function() {
	return 2 * v0 * Math.sin(alpha) / g;
};
var coordX = function(t) {
	if(t <= T()) return v0 * Math.cos(alpha) * t;
	else return v0 * Math.cos(alpha) * T();
};
var coordY = function(t) {
	if(t <= T()) return v0 * Math.sin(alpha) * t - g * t * t / 2;
	else return 0;
};
var vx = function(t) {
	if(t <= T()) return v0 * Math.cos(alpha);
	else return 0;
};
var vy = function(t) {
	if(t <= T()) return v0 * Math.sin(alpha) - g * t;
	else return 0;
};
var v0 = 10;
var alpha = Math.PI / 3;
for(var i=0; i<10; i++) {
	document.writeln('t: ' + 0.2 * i + 'x: ' + coordX(0.2 * i) + 'y: ' + coordY(0.2 * i) + 'vx: ' + vx(0.2 * i) + 'vy: ' + vy(0.2 * i));
};*/
//циклоида
/*var r0 = 30;
var a0 = 0, g, x, y;
for() {
	a0 += 8;
	g = a0 * Math.PI / 180;
	x = r0 * (g - Math.sin(g));
	y = 150 + r0 * (Math.cos(g) - 1);
};*/
//синусоида
/*var r0 = 50;
var a0 = 0, g, x, y;
for() {
	a0 += 8;
	g = a0 * Math.PI / 180;
	x = g * 50;
	y = 250 + r0 * Math.sin(g);
};
*/
//спираль
/*var r0 = 20;
var a0 = 0, g, x, y;
for() {
	a0 += 3;
	g = a0 * Math.PI / 180;
	x = 370 + r0 * (Math.cos(g) + g * Math.sin(g));
	y = 350 + r0 * (Math.sin(g) + g * Math.cos(g));
};
*/
//окружность
/*var rx = 250;
var ry = 250;
var f = 0, r = 0, c = 1.35;
for() {
	f++;
	r++;
	f1 = Math.cos(f);
	f2 = Math.sin(f);
	x = (rx - r / c) * f1 - (ry - r / c) * f2 - rx * f1 + ry * f2 + rx;
	y = (rx - r / c) * f2 + (ry - r / c) * f1 - rx * f2 - ry * f1 + ry;
};
*/
//прямая
/*var rx = 250;
var ry = 250;
var r = 0;
for() {
	r++;
	x = rx - r - 45;
	y = ry - r - 45;
};
*/
/*var CONFIG = (function() {
	var constants = {
		'MY_CONST': '1',
		'ANOTHER_CONST': '2'
	};
	return {
		get: function(name) { return private[name]; }
	};
})();*/
//jsar.algorithms = {};
//--------------------------------------------------------------
jsar.algorithms.getVertexPath = function(start, nodesList) {
	if(!jsar.toolset.isIntNumber(start) || !jsar.toolset.isArray(nodesList)) { throw {
																					name: 'ValueError',
																					message: 'incorrect input values: vertex order matrix < ' + nodesList + ' >, start vertex < ' + start + ' >'
																				};
	}
	var n = nodesList.length;
	var nn = (jsar.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
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
	// initialization step
	var state = {PASSED: true, NOTPASSED: false};
	var a = z = 0; // start/end of q
	var p = jsar.toolset.vector(n, -1);
	var q = jsar.toolset.vector(n, 0);
	q[a] = start;
	var r = jsar.toolset.vector(n, state.NOTPASSED);
	// general step
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
	// output step
	return p;
};
//var distance = [[0, 1, 0, 0, 0, 0, 0],
//				[0, 0, 1, 1, 0, 0, 0],
//				[0, 0, 0, 1, 0, 0, 0],
//				[0, 0, 0, 0, 1, 0, 0],
//				[0, 0, 0, 0, 0, 0, 0],
//				[0, 0, 0, 1, 0, 0, 1],
//				[0, 0, 0, 0, 1, 0, 0]];
//document.writeln(jsar.algorithms.getVertexPath(1, distance));
//--------------------------------------------------------------
jsar.algorithms.getMaxPairsMatching = function(nodesList) {
	if(!jsar.toolset.isArray(nodesList)) { throw {
											name: 'ValueError',
											message: 'incorrect vertex order matrix < ' + nodesList + ' >'
										};
	}
	// initialization step
	var n = nodesList.length;
	var nn = (jsar.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
	if(n === 0 || nn === 0) { throw {
								name: 'ValueError',
								message: 'incorrect matrix size: rows < ' + n + ' >, columns < ' + nn + ' >'
							};
	}
	var vertexRows = [], vertexColumns = [];
	var orientGraph = jsar.toolset.matrix(n + nn, n + nn, 0);
	var vertexStatus = {CONNECTED: 1, DISCONNECTED: 0};
	var state = {SATURATED: 4, NOTSATURATED: 3};
	for(var i=0; i<n; i++) {
		for(var j=0; j<nn; j++) {
			if(nodesList[i][j] === vertexStatus.DISCONNECTED) continue;
			if((nodesList[i][j] === vertexStatus.CONNECTED) && (vertexRows.indexOf(i) === -1) && (vertexColumns.indexOf(j+n) === -1)) {
				vertexRows.push(i);
				vertexColumns.push(j+n);
				orientGraph[j+n][i] = state.SATURATED;
			} else {
				orientGraph[i][j+n] = state.NOTSATURATED;
			}
		}
	}
	// general step
	var i = 0;
	while(++i <= n) {
		if(vertexRows.indexOf(i-1) !== -1) continue;
		var orientPath = jsar.algorithms.getVertexPath(i, orientGraph);
		var s = ns = 0;
		for(var k=0; k<orientPath.length; k++) {
			if(orientPath[k] !== -1) {
				(orientGraph[orientPath[k]-1][k] === state.SATURATED) ? s++ : ns++;
			}
		}
		if((ns > s) && (ns * s)) {
			for(var k=0; k<orientPath.length; k++) {
				if(orientPath[k] !== -1) {
					if(orientGraph[orientPath[k]-1][k] === state.SATURATED) {
						orientGraph[k][orientPath[k]-1] = state.NOTSATURATED;
						vertexRows.splice(vertexRows.indexOf(k), 1);
						vertexColumns.splice(vertexColumns.indexOf(orientPath[k]-1), 1);
					} else {
						orientGraph[k][orientPath[k]-1] = state.SATURATED;
						vertexRows.push(orientPath[k]-1);
						vertexColumns.push(k);
					}
					orientGraph[orientPath[k]-1][k] = 0;
					//orientGraph[k][orientPath[k]-1] = (orientGraph[orientPath[k]-1][k] === state.SATURATED) ? state.NOTSATURATED : state.SATURATED;
					//orientGraph[orientPath[k]-1][k] = 0;
					//(orientGraph[orientPath[k]-1][k] === state.SATURATED) ? (vertexRows.splice(vertexRows.indexOf(k), 1), vertexColumns.splice(vertexColumns.indexOf(orientPath[k]-1), 1)) : (vertexRows.push(orientPath[k]-1), vertexColumns.push(k));
				}
			}
			i = 0;
		}
	}
	// output step
	var pairsGraph = jsar.toolset.matrix(n, nn, 0);
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
var distance = [[1, 0, 1, 0, 0],
				[1, 0, 1, 0, 0],
				[0, 1, 0, 0, 1],
				[0, 1, 0, 1, 0],
				[0, 0, 0, 1, 0]];
//document.writeln(jsar.algorithms.getMaxPairsMatching(distance));
//--------------------------------------------------------------
jsar.algorithms.adductionOnRows = function(nodesList, isNullDiagonal) {
	if(!jsar.toolset.isArray(nodesList)) { throw {
											name: 'ValueError',
											message: 'incorrect vertex order matrix < ' + nodesList + ' >'
										};
	}
	var n = nodesList.length;
	var nn = (jsar.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
	if(n === 0 || nn === 0) { throw {
								name: 'ValueError',
								message: 'incorrect matrix size: rows < ' + n + ' >, columns < ' + nn + ' >'
							};
	}
	//
	isNullDiagonal = (isNullDiagonal == null) ? true : (jsar.toolset.isBoolean(isNullDiagonal)) ? isNullDiagonal : null;
	if(isNullDiagonal == null) throw {name: 'ValueError', message: 'incorrect parameter: diagonal values included < ' + isNullDiagonal + ' >'};
	//
	var copy = jsar.toolset.copyOfArray(nodesList);
	for(var i=0; i<n; i++) {
		min = (isNullDiagonal) ? jsar.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1))) : jsar.toolset.arrayMin(copy[i]);
		for(var j=0; j<nn; j++) {
			if(isNullDiagonal && (i === j)) continue;
			copy[i][j] -= min;
		}
	}
	return copy;
};
//var distance = [[0, 7, 3, 7, 1],
//				[1, 0, 8, 6, 3],
//				[1, 1, 0, 0, 1],
//				[0, 5, 0, 0, 0],
//				[1, 23, 1, 1, 0]];
//document.writeln(jsar.algorithms.adductionOnRows(distance));
//--------------------------------------------------------------
jsar.algorithms.adductionOnColumns = function(nodesList, isNullDiagonal) {
	if(!jsar.toolset.isArray(nodesList)) { throw {
											name: 'ValueError',
											message: 'incorrect vertex order matrix < ' + nodesList + ' >'
										};
	}
	//var mi1 = this.getRowsNum(), mj1 = this.getColumnsNum();
	//if(mi1 === 0 || mj1 === 0/* || mi1 !== mj1*/) { throw {
	//											name: 'MatrixSizeError',
	//												message: 'incorrect matrix size: rows < ' + mi1 + ' >, columns < ' + mj1 + ' >'
	//											};
	//}
	var n = nodesList.length;
	var nn = (jsar.toolset.isArray(nodesList[0]) ? nodesList[0].length : 0);
	if(n === 0 || nn === 0) { throw {
								name: 'ValueError',
								message: 'incorrect matrix size: rows < ' + n + ' >, columns < ' + nn + ' >'
							};
	}
	//
	isNullDiagonal = (isNullDiagonal == null) ? true : (jsar.toolset.isBoolean(isNullDiagonal)) ? isNullDiagonal : null;
	if(isNullDiagonal == null) throw {name: 'ValueError', message: 'incorrect parameter: diagonal values included < ' + isNullDiagonal + ' >'};
	//
	var copy = jsar.algorithms.transpose(nodesList);
	for(var i=0; i<n; i++) { 
		min = (isNullDiagonal) ? jsar.toolset.arrayMin(copy[i].slice(0, i).concat(copy[i].slice(i + 1))) : jsar.toolset.arrayMin(copy[i]);
		for(var j=0; j<nn; j++) {
			if(isNullDiagonal && (i === j)) continue;
			copy[i][j] -= min;
		}
	}
	return jsar.algorithms.transpose(copy);
};
//var distance = [[0, 7, 3, 7, 1],
//				[1, 0, 8, 6, 3],
//				[1, 1, 0, 0, 1],
//				[0, 5, 0, 0, 0],
//				[1, 23, 1, 1, 0]];
//document.writeln(jsar.algorithms.adductionOnColumns(distance));
//--------------------------------------------------------------
jsar.algorithms.getMinUtility = function(nodesList) {
	if(!jsar.toolset.isArray(nodesList)) { throw {
											name: 'ValueError',
											message: 'incorrect vertex matrix < ' + nodesList + ' >'
										};
	}
	var graph = nodesList;
	while(true) {
		var adductArr = jsar.algorithms.adductionOnColumns(jsar.algorithms.adductionOnRows(graph, false), false);
		var adductArrCopy = jsar.toolset.matrix(adductArr.length, adductArr[0].length, 0);
		var temp;
		for(var i=0; i<adductArrCopy.length; i++) {
			temp = 0;
			while((temp = adductArr[i].indexOf(0, temp)) !== -1) {
				adductArrCopy[i][temp] = 1;
				temp++;
			}
		}
		var maxPairs = jsar.algorithms.getMaxPairsMatching(adductArrCopy);
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
				sum += nodesList[i][maxPairs[i].indexOf(1)];
			}
			return {'maxPairs': maxPairs, 'functional': sum};
		}
		var rows = [], columns = [], vertexPath;
		for(var i=0; i<maxPairs.length; i++) {
			if(maxPairs[i].indexOf(1) === -1) {
				vertexPath = jsar.algorithms.getVertexPath(i + 1, orientGraph);
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
//var distance = [[8, 7, 5, 3, 4],
//				[5, 4, 4, 2, 3],
//				[8, 2, 7, 4, 4],
//				[5, 6, 5, 4, 4],
//				[8, 3, 7, 9, 4]];
//var minUtility = jsar.algorithms.getMinUtility(distance);
//document.writeln('pairs: ' + minUtility.maxPairs + ', funtional: ' + minUtility.functional);
//--------------------------------------------------------------
jsar.algorithms.getMaxUtilityOfBottleneck = function(nodesList, initAssign) {
	if(!jsar.toolset.isArray(nodesList) || !jsar.toolset.isArray(initAssign)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input parameters: vertex matrix < ' + nodesList + ' >, initial assignment < ' + initAssign + ' >'
																			};
	}
	var graph = jsar.toolset.copyOfArray(nodesList);
	var n = graph.length;
	var nn = (jsar.toolset.isArray(graph[0]) ? graph[0].length : 0);
	if(n === 0 || nn === 0 || n !== initAssign.length) { throw {
															name: 'MatrixSizeError',
															message: 'incorrect matrix size: number of workers < ' + n + ' >, number of jobs < ' + nn + ' >, number of initial assignments < ' + initAssign.length + ' >'
													};
	}
	// initialization step
	var functional = Number.POSITIVE_INFINITY;
	for(var i=0; i<n; i++) {
		if(graph[i][initAssign[i]-1] < functional) {
			functional = graph[i][initAssign[i]-1];
		}
	}
	// general step
	for(var i=0; i<n; i++) {
		for(var j=0; j<nn; j++) {
			graph[i][j] = (graph[i][j] > functional) ? 1 : 0;
		}
	}
	var maxPairs = jsar.algorithms.getMaxPairsMatching(graph);
	var n = maxPairs.length;
	var nn = (jsar.toolset.isArray(maxPairs[0]) ? maxPairs[0].length : 0);
	return maxPairs;
	// output step
};
var distance = [[1, 3, 2, 6, 0, 1],
				[4, 2, 3, 8, 3, 1],
				[8, 1, 1, 5, 0, 9],
				[3, 5, 4, 8, 8, 3],
				[2, 6, 9, 5, 2, 4],
				[3, 2, 3, 6, 7, 1]];
var assign = [1, 2, 3, 4, 5, 6];
var maxUtilityBottleneck = jsar.algorithms.getMaxUtilityOfBottleneck(distance, assign);
//document.writeln(maxUtilityBottleneck);
//document.writeln('pairs: ' + minUtility.maxPairs + ', funtional: ' + minUtility.functional);
//--------------------------------------------------------------
//var element = h && h['x'] && h['x']['y'];
/*var people = ['Daniel', 'Dustin', 'David', 'Damarcus', 'Russ'];
function matchPeople(input) {
	var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
	return people.filter(function(person) {
		if (person.match(reg)) return person;
	});
};*/

/*
//Выполняет код(или функцию), указанный в первом аргументе, асинхронно, с задержкой в delay миллисекунд.
setTimeout("console.log('first invoke!')", 1000);

setTimeout(function(){
    console.log('second invoke!');
}, 1000);

setTimeout(someFunction, 1000);
function someFunction(){
    console.log('third invoke!');
}
*/

/*
//Выполняет код много раз, через равные промежутки времени, пока не будет остановлен при помощи clearInterval.
setInterval("console.log('first invoke')", 1000);

function someFunction() {
    console.log('second invoke');
}
setInterval(someFunction, 1000);

setInterval(function(){
    console.log('third invoke');
}, 1000);

var fouthInvoke = setInterval("console.log('fouth invoke')", 1000);
clearInterval(fouthInvoke);
*/

/*
//скрипт для выравнивания высоты или ширины колонок
var getMaxHeight = function ($elms) {
  var maxHeight = 0;
  $elms.each(function () {
    // В некоторых случаях можно использовать outerHeight()
    var height = $(this).height();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });
  return maxHeight;
};

$(elements).height( getMaxHeight($(elements)) );
-------------------------------------------------------------------------------
var maxheight = 0;
$("div.col").each(function(){
  if($(this).height() > maxheight) { maxheight = $(this).height(); }
});

$("div.col").height(maxheight);
*/

/*
//Эффективная проверка дат
function isValidDate(value, userFormat) {
 
  // Используем формат по умолчанию, если ничего не указано
  userFormat = userFormat || 'mm/dd/yyyy';
 
  // Находим разделитель исключая символы месяца, дня и года (в английском варианте - m, d, y)
  var delimiter = /[^mdy]/.exec(userFormat)[0];
 
  // Создаем массив из месяца, дня и года,
  // то есть мы знаем порядок формата
  var theFormat = userFormat.split(delimiter);
 
  // Создаем массив из даты пользователя
  var theDate = value.split(delimiter);
 
  function isDate(date, format) {
    var m, d, y, i = 0, len = format.length, f;
    for (i; i < len; i++) {
      f = format[i];
      if (/m/.test(f)) m = date[i];
      if (/d/.test(f)) d = date[i];
      if (/y/.test(f)) y = date[i];
    }
    return (
      m > 0 && m < 13 &&
      y && y.length === 4 &&
      d > 0 &&
      // Проверяем правильность дня месяца
      d <= (new Date(y, m, 0)).getDate()
    );
  }
 
  return isDate(theDate, theFormat);
}

isValidDate('dd-mm-yyyy', '31/11/2012')
*/

/*
//Устанавливаем соответствие между шириной экрана и точками излома для адаптивного дизайна
function isBreakPoint(bp) {
  // Tочки излома, которые установлены в коде CSS
  var bps = [320, 480, 768, 1024];
  var w = $(window).width();
  var min, max;
  for (var i = 0, l = bps.length; i < l; i++) {
    if (bps[i] === bp) {
      min = bps[i-1] || 0;
      max = bps[i];
      break;
    }
  }
  return w > min && w <= max;
}

if ( isBreakPoint(320) ) { 
  // Ширина экрана меньше точки 320
}
if ( isBreakPoint(480) ) { 
  // Ширина экрана между точками излома 320 и 480
}
*/

/*
//Выделение текста
function highlight(text, words, tag) {
 
  // Устанавливаем тег по умолчанию, если ничего не указано
  tag = tag || 'span';
 
  var i, len = words.length, re;
  for (i = 0; i < len; i++) {
    // Глобальное регульрное выражение для подсвечивания всех терминов
    re = new RegExp(words[i], 'g');
    if (re.test(text)) {
      text = text.replace(re, '<'+ tag +' class="highlight">$&</'+ tag +'>');
    }
  }
 
  return text;
}

function unhighlight(text, tag) {
  // Устанавливаем тег по умолчанию, если ничего не указано
  tag = tag || 'span';
  var re = new RegExp('(<'+ tag +'.+?>|<\/'+ tag +'>)', 'g');
  return text.replace(re, '');
}

$('p').html( highlight(
    $('p').html(), // Текст
    ['foo', 'bar', 'baz', 'hello world'], // Список терминов для выделения
    'strong' // Пользовательский тег
));
*/

/*
//Анимированные текстовые эффекты
$.fn.animateText = function(delay, klass) {
  
  var text = this.text();
  var letters = text.split('');
  
  return this.each(function(){
    var $this = $(this);
    $this.html(text.replace(/./g, '<span class="letter">$&</span>'));
    $this.find('span.letter').each(function(i, el){
      setTimeout(function(){ $(el).addClass(klass); }, delay * i);
    });
  });
  
};

$('p').animateText(15, 'foo');
*/

/*
//Проявление элементов одного за другим
$.fn.fadeAll = function (ops) {
  var o = $.extend({
    delay: 500, // задержка между появлением элементов
    speed: 500, // скорость анимации
    ease: 'swing' // функция перехода (другие требуют подключения специального плагина)
  }, ops);
  var $el = this;
  for (var i=0, d=0, l=$el.length; i<l; i++, d+=o.delay) {
    $el.eq(i).delay(d).fadeIn(o.speed, o.ease);
  }
  return $el;
}

$(elements).fadeAll({ delay: 300, speed: 300 });
*/

/*
//Подсчет нажатий кнопки мыши
$(element)
    .data('counter', 0) // Сбрасываем счетчик
    .click(function() {
        var counter = $(this).data('counter'); // Получаем значение
        $(this).data('counter', counter + 1); // Устанавливаем значение
        // Выполняем нужные действия
    });
*/	

/*
//Встраивание видео Youtube из ссылки
function embedYoutube(link, ops) {
 
  var o = $.extend({
    width: 480,
    height: 320,
    params: ''
  }, ops);
 
  var id = /\?v\=(\w+)/.exec(link)[1];
 
  return '<iframe style="display: block;"'+
    ' class="youtube-video" type="text/html"'+
    ' width="' + o.width + '" height="' + o.height +
    ' "src="http://www.youtube.com/embed/' + id + '?' + o.params +
    '&amp;wmode=transparent" frameborder="0" />';
}

embedYoutube(
  'https://www.youtube.com/watch?v=JaAWdljhD5o', 
  { params: 'theme=light&fs=0' }
);
//https://developers.google.com/youtube/player_parameters
*/

/*
//Уменьшаем размер текста
function excerpt(str, nwords) {
  var words = str.split(' ');
  words.splice(nwords, words.length-1);
  return words.join(' ') + 
    (words.length !== str.split(' ').length ? '&hellip;' : '');
}

var $p = $('p');
var $more = $('#more');
var $less = $('#less');

function less() {
  $p.data('text', $p.html()); // store untouched text first
  $p.html( excerpt($p.html(), 50) );
  $more.show();
  $less.hide();
}

function more() {
  $p.html($p.data('text'));
  $more.hide();
  $less.show();
}

less(); // init
$('#more').click(more);
$('#less').click(less);
*/

/*
//Создаем динамическое меню
function makeMenu(items, tags) {
 
  tags = tags || ['ul', 'li']; // Теги по умолчанию
  var parent = tags[0];
  var child = tags[1];
 
  var item, value = '';
  for (var i = 0, l = items.length; i < l; i++) {
    item = items[i];
    // Разделяем пункты и значения, если они имеются
    if (/:/.test(item)) {
      item = items[i].split(':')[0];
      value = items[i].split(':')[1];
    }
    // Оборачиваем  пункт в тег
    items[i] = '<'+ child +' '+ 
      (value && 'value="'+value+'"') +'>'+ // Добавляем значение, если оно есть
        item +'</'+ child +'>';
  }
 
  return '<'+ parent +'>'+ items.join('') +'</'+ parent +'>';
}

// Выпадающий список месяцев
makeMenu(
  ['January:JAN', 'February:FEB', 'March:MAR'], // пункт:значение
  ['select', 'option']
);
 
// Список бакалеи
makeMenu(
  ['Carrots', 'Lettuce', 'Tomatos', 'Milk'],
  ['ol', 'li']
);
*/

/*
//Прокрутка на начало страницы
$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
*/

/*
//Дублирование заголовков колонок на конце таблицы
var $tfoot = $('<tfoot></tfoot>');
$($('thead').clone(true, true).children().get().reverse()).each(function(){
    $tfoot.append($(this));
});
$tfoot.insertAfter('table thead');
//http://ruseller.com/lessons.php?rub=32&id=1558
*/

/*
//Оформление таблицы в стиле “зебра”
$(document).ready(function(){
     $("table tr:even").addClass('stripe');
});
*/

/*
//Пред-загрузка фотографий
$.preloadImages = function() {
       for(var i = 0; i < arguments.length; i++) {
               $("<img />").attr("src", arguments[i]);
       }
}

$(document).ready(function() {
       $.preloadImages("hoverimage1.jpg","hoverimage2.jpg");
});
*/

/*
//Открытие всех сторонних ссылок в новом окне
$('a').each(function() {
   var a = new RegExp('/' + window.location.host + '/');
   if(!a.test(this.href)) {
       $(this).click(function(event) {
           event.preventDefault();
           event.stopPropagation();
           window.open(this.href, '_blank');
       });
   }
});
*/

/*
//Изменение размера блока в зависимости от области видимости
var winWidth = $(window).width();
var winHeight = $(window).height();

// выставляем свойства height / width
$('div').css({
    'width': winWidth,
    'height': winHeight,
});

// меняем размеры блока при изменении размеров страницы
$(window).resize(function(){
        $('div').css({
        'width': winWidth,
        'height': winHeight,
    });
});
*/

/*
//Проверка надёжности пароля
<input type="password" name="pass" id="pass" />
<span id="passstrength"></span>

$('#pass').keyup(function(e) {
     var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
     var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
     var enoughRegex = new RegExp("(?=.{6,}).*", "g");
     if (false == enoughRegex.test($(this).val())) {
             $('#passstrength').html('More Characters');
     } else if (strongRegex.test($(this).val())) {
             $('#passstrength').className = 'ok';
             $('#passstrength').html('Strong!');
     } else if (mediumRegex.test($(this).val())) {
             $('#passstrength').className = 'alert';
             $('#passstrength').html('Medium!');
     } else {
             $('#passstrength').className = 'error';
             $('#passstrength').html('Weak!');
     }
     return true;
});
*/

/*
//Частичное обновление контента
setInterval(function() {
$("#refresh").load(location.href+" #refresh>*","");
}, 10000); // ожидание в миллисекундах
*/

/*
//Проверка загрузилось ли изображение
var imgsrc = 'img/image1.png';
$('<img/>').load(function () {
    alert('image loaded');
}).error(function () {
    alert('error loading image');
}).attr('src', imgsrc);
*/

/*
try {
    eval(someThing)
} catch (e) {
    if (e instanceof EvalError) {
        alert("Ошибка при выполнении: " + e.message);
    } else {
        throw(e)
    }
}
*/

/*
var str = "count 36-26, 18-9";
var re =  /(\d+)-(\d+)/g;
var res;
while((res = re.exec(str)) != null) {
	alert("Найдено " + res[0] + ":  ("+ res[1]+") и ("+res[2]+")");
	alert("Дальше ищу с позиции " + re.lastIndex);
};
*/

/*
var str = "sdfsd23321 3asdfds 23-023 sdaf12d2d201m21"; //например такая строка
var arr = [];
arr = str.match(/\d+/g); // возьмём match и он сразу сам в массив всё запишет
for (var i=0; i < arr.length; i++){  // и выводим для проверки
	alert(arr[i]);
};
*/

/*
function dateReviver(key, value) {
    if (typeof value === 'string') {
        var a = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3]));
        }
    }
    return value;
};
 
var myCookies = JSON.parse(cookieJSON, dateReviver);
myCookies.cookies.oatmeal.eatBy; //Sat Dec 04 2010 16:00:00 GMT-0800 (Pacific Standard Time) 


JSON.stringify(cookies, ['cookies','oatmeal','chocolate','calories'], '\t')
'{
    "cookies":{
        "oatmeal":{ 
            "calories":430 
        }, 
        "chocolate":{
            "calories":510 
        } 
    } 
}'
*/

/*
var jsonp = {
    callbackCounter: 0,
 
    fetch: function(url, callback) {
        var fn = 'JSONPCallback_' + this.callbackCounter++;
        window[fn] = this.evalJSONP(callback);
        url = url.replace('=JSONPCallback', '=' + fn);
 
        var scriptTag = document.createElement('SCRIPT');
        scriptTag.src = url;
        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    },
 
    evalJSONP: function(callback) {
        return function(data) {
            var validJSON = false;
        if (typeof data == "string") {
            try {validJSON = JSON.parse(data);} catch (e) {
                //invalid JSON}
        } else {
            validJSON = JSON.parse(JSON.stringify(data));
                window.console && console.warn(
                'response data was not a JSON string');
            }
            if (validJSON) {
                callback(validJSON);
            } else {
                throw("JSONP call returned invalid or empty JSON");
            }
        }
    }
}

//The U.S. President's latest tweet...
var obamaTweets = "http://www.twitter.com/status/user_timeline/BARACKOBAMA.json?count=5&callback=JSONPCallback";
jsonp.fetch(obamaTweets, function(data) {console.log(data[0].text)});
 
//console logs:
//From the Obama family to yours, have a very happy Thanksgiving. http://OFA.BO/W2KMjJ
 
//The latest reddit...
var reddits = "http://www.reddit.com/.json?limit=1&jsonp=JSONPCallback";
jsonp.fetch(reddits , function(data) {console.log(data.data.children[0].data.title)});
 
//console logs:
//You may remember my kitten Swarley wearing a tie. Well, he's all grown up now, but he's still all business. (imgur.com)
*/

/*
var rectangle = {height:20, width:10};
 
rectangle .__defineGetter__("area", function() {
    return rectangle.height * rectangle.width;  
});
rectangle .__defineSetter__("area", function(val) {
    alert("sorry, you can't update area directly");  
});
 
rectangle.area; //200
rectangle.area = 150; //alerts "sorry..." etc.
rectangle.area; //still 200
*/

/*
var rectangle = {
    height:20, 
    width:10,
    get area() {
        return rectangle.height * rectangle.width;
    },  
    set area(val) {
        alert("sorry, you can't update area directly");
    }  
}
*/

/*
var rectangle = {
    width: 20,
    height: 10,
};
 
Object.defineProperty(rectangle, "area", {
    get: function() {
        return this.width*this.height;
    },
    set: function(val) {
        alert("no no no");
    }
});
*/

/*
rectangle.__lookupGetter__("area"); //area Getter function
rectangle.__lookupSetter__("area"); //area Setter function
rectangle.__lookupGetter__("width"); //undefined
rectangle.__lookupSetter__("width"); //undefined
*/

/*
function extendAsArray(obj) {
    if (obj.length === undefined || obj.__lookupGetter__('length')) {
        var index = 0;
        for (var prop in obj) {
            if(!obj.__lookupGetter__(prop)) {
                (function(thisIndex, thisProp) {
                    obj.__defineGetter__(thisIndex, function() {return obj[thisProp]});
                })(index, prop)
                index++;
            }
        };
        obj.__defineGetter__("length", function() {return index});
    }
    return obj;
}

var myObj = {
    left:50,
    top:20,
    width:10,
    height:10
}
 
extendAsArray(myObj);
 
var arr = [];
arr.join.call(myObj, ', '); //"50 ,20 ,10, 10" 
arr.slice.call(myObj, 2); [10,10]
arr.map.call(myObj,function(s){return s+' px'}).join(', '); 
//"50px ,20px ,10px, 10px" 
arr.every.call(myObj,function(s){return !(s%10)}); 
//true (all values divisible by 10)
arr.forEach.call(myObj,function(s){window.console && console.log(s)}); 
//(logs all values)

var fxP = extendAsArray(jQuery.fx.prototype);
//make an array of all functions in jQuery.fx.prototype
[].filter.call(fxP, function(s){
    return typeof s == "function"
}); //(6 functions)


var expenses = {
    hotel: 147.16,
    dinner: 43.00,
    drinks: 15.20,
    taxi: 13.00,
    others: 12.15
}

extendAsArray(expenses);
var biggestExpense = 
    Math.max.apply(null, [].slice.call(expenses)); //147.16
var totalExpenses = 
    [].reduce.call(expenses, function(t,s){return t+s}); //230.51
*/

/*
function commonHandle(event) {
  event = fixEvent(event)
  handlers = this.events[event.type]
  
  // (1)
  var errors = []
 
  for ( var g in handlers ) {
    try {
      var ret =  handlers[g].call(this, event)
      if ( ret === false ) {
        event.preventDefault()
        event.stopPropagation()
      }
    } catch(e) {
      // (2)
      errors.push(e)
    }
  }
  
  // (3)
  if (errors.length == 1) {
      throw errors[0]
  } else if (errors.length > 1) {
      var e = new Error("Multiple errors thrown in handling 'sig', see errors property");
      e.errors = errors
      throw e
  }  
}
*/

/*
<a href='help.html' data-width='600' data-height='400' title='' class='popup'></a>
$(function() {
	$('.popup').click(function(event) {
		event.preventDefault();
		var href = $(this).attr('href');
		var href = $(this).attr('data-width');
		var href = $(this).attr('data-height');
		var popup = window.open(href, 'popup', 'height=' + height + ',width=' + width + '');
	});
});
*/

/*
function isValidStockInfo(stock) {
	var re = /^[A-Z0-9\/\,\ "\s]{1,18}/ig;
	return re.test(stock);
};
*/



