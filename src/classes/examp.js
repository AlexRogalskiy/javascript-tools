for(var i=0: i < a.length; a[i++]=0);
for(var i=0, j=10; i < j; i++,j--) console.log(i+j);

var hasStrictMode = (function() { "use strict"; return this === undefined; } ()); 


// Объект оЗ аналогичен {} или пеw Object()
var оЗ = Object.create(Object.prototype);



va р = {
	х: 1.0,
	у: 1.0,
// Не забудьте добавить запятые
	get r() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},
	set r(newvalue) {
		var oldvalue = Math.sqrt(this.x*this.x + this.y*this у);
		var ratio = newvalue/oldvalue;
		this.x *= ratio;
		this.у *= ratio; 
	},
	get theta() {
		return Math.atan2(this.y, this.x);
	}
};


var serialnum = {
	// Это свойство содержит следующий номер
	//Символ $ обозначает закрытое свойство
	$n: 0,
	//Увеличение и возврат значения
	get next() { return this. $n++; },
	//Установка нового значения, 11 если оно больше текущего
	set next(n) {
		if (n >= this.$n) this.$n = n;
		else throw "серийный номер может только увеличиваться";
	}
};


var р = Object.defineProperties({},
	{
		х: { value: 1, writable: true, enumerable:true, configurable:true },
		у: { value: 1, writable: true, enumerable:true, configurable:true },
		r: {get: function() { return Math.sqrt(this. x•this.x+this.y•this.y) }, enumerable:true, configurable:true }
	});
	
	
function classof(o) {
	if (о === null) return "Null";
	if (о === undefined) return "Undefined";
	return Object.prototype.toString.call(o).slice(8,-1);
};

a.sort(fuпctioп(s,t) {
	var а= s.toLowerCase();
	var Ь = t.tolowerCase();
	if (а < Ь) return -1;
	if (а > Ь) return 1;
	return 0;
});

а.reduce(function(x, у) {return (х>у)?х:у;});


var isArray = Array.isArray || function(o) {
	var ts = Object.prototype.toStriпg;
	return (typeof о === "object" && ts.call(o) === "[object Array]");
};

var s = "Java";
Array.prototype.join.call(s, " "); // => "J а v а
Array.prototype.filter.call(s, function(x) {
		return x.match(/[-aeiou]/); // Поиск согласных букв
	}).join(""); // => "Jv"


var strict = (function() { return !this; } ());

// Замена метода m объекта о версией, которая
// протоколирует сообщения до и после вызова
// исходного метода
function trace(o, m) {
	var original = o[m]; // Запоминаем метод
	o[m] = function() { // Определяем новый метод
		console.log(new Date(), "Enteriпg: ", m); // Вызов исходного метода
		var result = original.apply(this, arguments);
		console.log(new Date(), "Exitiпg: ", m); // Возврат результата исходного метода
		return result;
	}
};

var quote = /"([-"]*)"/g;
text.replace(quote, '«$1»');

"1 плюс 2 равно 3".match(/\d+/g); // => [ "1 '' , ·2· , "З"]

var url = /(\w+):\/\/([\w. ]+)\/(\S*)/;
var text = "Адрес http://www.example.com/david";
var result = text.match(url);
if(result != null) {
	var fullurl = result[0]; // полное соответствие
	var protocol = result[1]; // => "http"
	var host = result[2]; // => "www.example.соm
	var path = result[3]; // => "-david" 
};

"1 2, 3 ".split(/\s*,\s*/); // => ["1", "2'," 3"]

var pattern = /Java/g;
var text = "JavaScript лучше, чем Java' ";
var result;
while((result = pattern.exec(text)) != null) {
	аlеrt("Соответствие ·" + result[0] + + " в позиции: " + result.index + " поиск с позиции: " + pattern.last!пdex);
};


function getElements(/•знaчeния id ...• /) {
	var elements = { } : // Начинаем с пустого объекта
	for(var i = О; i < arguments. length; i++) {
		var id = arguments[i]; // Идентификатор элемента
		var elt = document. getElementByid(id);
		if (elt == null) {
			throw new Error(" Taкoгo элемента нет: + id);
		}
		elements[id] = elt; // Привязка к элементу
	}
	return elements; // Возвращение объекта 
};

// Возвращает неформатированное текстовое
// содержимое элемента е, рекурсивно проходя no
// дочерним элементам. Эта функция работает
// аналогично свойству textContent
function textContent(e) {
	var с, type, s = "";
	for(c = e.firstChild; c !=null; c = c.nextSibling) {
		type = с.поdеТуре;
		if(type === З)
			s += c.nodeValue;
		else if (type === 1)
			s += textContent(c);
	}
	return s;
};


// Вставка дочернего узла в позицию n
function insertAt(parent, child, n) {
	if (n < 0 || n > parent.childNodes.length)
		throw new Еrrоr("Неправильный индекс");
	else if (n == parent.childNodes.length)
		parent. appendChild(child);
	else
		parent.insertBefore(child, parent.childNodes[n]);
}




localStorage.lastRead = (new Date()).toUTCString(); 
var last = new Date(Date.parse(localStorage.lastRead)); 

localStorage.data = JSON.stringify(data);
var data = JSON.parse(localStorage.data); 


var	power =	function(base, exponent) {
	var	result = 1;
	for	(var count = 0;	count < exponent; count++) {
		result *= base;
	}
	return result;
};


var	journal	= [];
function addEntry(events, didITurnIntoASquirrel) {
	journal.push({events:	events,	squirrel:	didITurnIntoASquirrel});
};
var	map	= {};
function storePhi(event,	phi) {
	map[event] = phi;
};
function hasEvent(event, entry)	{
	return	(entry.events.indexOf(event)	!=	-1);
};


function randomPointOnCircle(radius) {
	var	angle =	Math.random() *	2 *	Math.PI;
	return {x: radius * Math.cos(angle), y: radius * Math.sin(angle)};
};

function logEach(array)	{ 
	for	(var	i	=	0;	i	<	array.length;	i++) {
		console.log(array[i]);
	}
};


function transparentWrapping(f)	{	
	return	function()	{
		return	f.apply(null,	arguments);	
	};
};

function	rowHeights(rows)	{
	return	rows.map(function(row)	{
		return	row.reduce(function(max,	cell)	{
			return	Math.max(max,	cell.minHeight());
		},	0);
	});
};
function	colWidths(rows)	{ 
	return	rows[0].map(function(_,	i)	{
		return	rows.reduce(function(max,	row) {
			return	Math.max(max,	row[i].minWidth());
		},	0);
	});
};
function	drawTable(rows)	{
	var	heights	=	rowHeights(rows);
	var	widths	=	colWidths(rows);
	function	drawLine(blocks,	lineNo)	{
		return	blocks.map(function(block)	{
			return	block[lineNo];
		}).join("	");
	};
	function	drawRow(row,	rowNum)	{
		var	blocks	=	row.map(function(cell,	colNum)	{
			return	cell.draw(widths[colNum],	heights[rowNum]);
		});
		return	blocks[0].map(function(_,	lineNo)	{
			return	drawLine(blocks,	lineNo);
		}).join("\n");
	}
	return	rows.map(drawRow).join("\n");
};
function	repeat(string,	times)	{
	var	result	=	"";
	for	(var	i	=	0;	i	<	times;	i++)
		result	+=	string;
	return	result;
};

function TextCell(text)	{
	this.text	=	text.split("\n");
};
TextCell.prototype.minWidth	=	function()	{
	return	this.text.reduce(function(width, line) {
		return	Math.max(width,	line.length);
	},	0);
};
TextCell.prototype.minHeight = function()	{
	return	this.text.length;
};
TextCell.prototype.draw	= function(width,	height)	{
	var	result	=	[];
	for	(var	i	=	0;	i	<	height;	i++)	{
		var	line	=	this.text[i] ||	"";
		result.push(line	+	repeat("	",	width	-	line.length));
	}
	return	result;
};

var	rows	=	[];
for	(var	i	=	0;	i	<	5;	i++)	{
	var	row	=	[];
	for	(var	j	=	0;	j	<	5;	j++)	{
		if	((j	+ i) % 2 ==	0)
			row.push(new TextCell("##"));
		else
			row.push(new TextCell(" "));
		}
	rows.push(row);
};
console.log(drawTable(rows)); 


var	pile	=	{	
	elements:	["скорлупа",	"кожура",	"червяк"],
	get	height()	{
		return	this.elements.length;
	},
	set	height(value)	{
		console.log("Игнорируем	попытку	задать	высоту	",	value);
	}
};

Object.defineProperty(TextCell.prototype,	"heightProp",	{
	get:	function()	{
		return	this.text.length;
	}
});
//var	cell	=	new	TextCell("да\nну");
//console.log(cell.heightProp); 

//<![CDATA[
//]]

var values = [1, 2, 3, 4, 5];
var sum = values.reduce(function(prev, cur, index, array) {
	return prev + cur;
});
var sum2 = values.reduceRight(function(prev, cur, index, array) {
	return prev + cur;
});


var text = "000-00-0000";
var pattern = //\d{3}-\d{2}-\d{4};
if(pattern.test(text)) return '';

function comparator(propName) {
		return function(obj1, obj2) {
				var val1 = obj1[propName];
				var val2 = obj2[propName];
				if(val1 < val2) {
					return -1;
				} else if(val1 > val2) {
						return 1;
				}
				return 0;
		};
};

var data = [{name: "", age: 24}, {name: "", age: 20}];
data.sort(comparator("name"));

function fact(num) {
	if(num <= 1) {
		return 1;
	}
	return num * arguments.callee(num - 1);
};

//var text = "cat, bat, sat, fat";
//text.replace(/(.at)/g, "word ($1)");

var global = function() {
	return this;
}();

var selectFrom(lowerVal, upperVal) {
	var choices = upperVal - lowerVal + 1;
	return Math.floor(Math.random() * choices + lowerVal);
};
var colors = ['red', 'green', 'blue', 'yellow', 'black', 'purple', 'brown'];
var color = selectFrom(0, colors.length - 1);


var person = {};
Object.defineProperty(person, 'name', {
	configurable: false,
	value: 'Nicholas',
	enumerable: false,
	writable: false
});

var book = {
	_year: 2004,
	edition: 1
};
Object.defineProperty(book, 'year', {
	get: function() {
		return this._year;
	};
	set: function(newVal) {
		if(newVal > 2004) {
			this._year = newVal;
			this.edition += newVal - 2004;
		}
	}
});

function hasPrototypeProperty(obj, name) {
	return !obj.hasOwnProperty(name) && (name in obj);
};


//Object.keys(Person.prototype);
//Object.getOwnPropertyNames(Person.prototype);

/*
Object.defineProperty(Person.prototype, "constructor", {
	enumerable: false;
	value: Person
});
*/


//SuperType.call(this);

function inheritPrototype(subType, superType) {
	var prototype = object(superType.prototype);
	prototype.constructor = subType;
	subType.prototype = prototype;
};

var factorial = (function f(num) {
	if(num > 1) {
		return num * f(num - 1);
	}
	return 1;
});

var application = function() {
		var comp = new Array();
		comp.push(new BaseComponent());
		
		var app = new BaseComponent();
		
		app.getComponentCount = function() {
			return comp.length();
		};
		app.registerComponent = function(component) {
			if(typeof component == "object") {
				comp.push(component);
			}
		};
		return app;
}();

function hasPlugin(name) {
	name = name.toLowerCase();
	for(var i=0; i<navigator.plugins.length; i++) {
		if(navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
			return true;
		}
	}
	return false;
};
function hasIEPlugin(name) {
	try {
		new ActiveXObject(mame);
		return true;
	} catch(ex) {
		return false;
	}
};
function hasFlash() {
	var result = hasPlugin("Flash");
	if(!result) {
		result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
	}
	return result;
;}
function hasQuickTime() {
	var result = hasPlugin("QuickTime");
	if(!result) {
		result = hasIEPlugin("QuickTime.QuickTIme");
	}
	return result;
};

function isHostMethod(obj, prop) {
	var t = typeof obj[prop];
	return t == 'function' || (!!(t == 'object' && obj[prop])) || t == 'unknown';
};
//result = isHostMethod(xhr, "open");

function getElement(id) {
	if(document.getElementById) {
		return document.getElementById(id);
	} else if(document.all) {
		return document.all[id];
	} else {
		throw new Error("");
	}
};
function isHostCollection(object, property) {
	var t = typeof object[property];  
	return (!!(t == 'object' && object[property])) || t == 'function';
};
function isHostObject(object, property) {
	return !!(typeof(object[property]) == 'object' && object[property]);
};

var client = function(){

    //rendering engines
    var engine = {            
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,

        //complete version
        ver: null  
    };
    
    //browsers
    var browser = {
        
        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        safari: 0,

        //specific version
        ver: null
    };

    
    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,
        
        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        
        //game systems
        wii: false,
        ps: false 
    };    

    //detect rendering engines/browsers
    var ua = navigator.userAgent;    
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    

    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                
                }                            
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    system.winMobile = (system.win == "CE");
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    //return it
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };

}();
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
var myAppState = function() {
	var that = {};
	that.init = function() {
		
	};
	that.save = function() {
		
	};
	that.load = function () {
		
	};
	that.init();
	return that;
};
Globals.Current = new myAppSte();
//------------------------------------------------------------------------------------
function getNumOnesInBinary(num) {
	var numOnes = 0;
	while(num != 0) {
		if((num & 1) == 1) {
			numOnes++;
		}
		num >>>= 1;
	}
	return numOnes;
};
function getNumOnesInBinary(num) {
	var numOnes = 0;
	while(num != 0) {
		num = num & (num - 1);
		numOnes++;
	}
	return numOnes;
};
//------------------------------------------------------------------------------------
function xor(input, pass) {
	var output = "";
	var pos = 0;
	for(var i = 0, i<input.length; i++) {
		pos = Math.floor(i % pass.length);
		output += String.fromCharCode(input.charCodeAt(i) ^ pass.charCodeAt(pos));
	}
	return output;
};
//------------------------------------------------------------------------------------
function getMedian(array1, array2, left, right, n) {
	if(left > right) return getMedian(array2, array1, 0, n - 1, n);
	var i = Math.floor(left + right) / 2;
	var j = n - i - 1;
	if((array1[i] > array2[j]) && (j == n - 1 || array1[i] <= array2[j + 1])) {
		if(i == 0 || array2[j] > array1[i - 1]) {
			return ((array1[i] + array2[j]) / 2);
		} else {
			return ((array1[i] + array1[i - 1]) / 2);
		}
	} else if(array1[i] > array2[j] && j != n - 1 && array1[i] > array2[j + 1]) {
		return getMedian(array1, array2, left, i - 1, n);
	} else {
		return getMedian(array1, array2, i + 1, right, n);
	}
};
var array1 = [1.0, 10.0, 17.0, 26.0], array2 = [2.0, 13.0, 15.0, 30.0], n = array1.length;
var result = getMedian(array1, array2, 0, n - 1, n);
//------------------------------------------------------------------------------------
//Пересекающиеся прямоугольники
function computeLength(arr) {
	var len = left = right = 0;
	var i = 0, len = arr.length;
	if(len == 0) return 0;
	arr.sort(function(a, b) {
		return a['y1'] - b['y1'];
	});
	while(i++ < len) {
		l = arr[i - 1], r = arr[i];
		if(l > right) {
			len += right - left;
			left = l;
			right = r;
		} else if(r > right) {
			right = r;
		}
	}
	return len + (right - left);
};
function computeArea(rect) {
	var queue = [], area = 0, index;
	rect.map(function(item) {
		queue.push({'x': item['x1'], 'status': true, 'size': {'y1': item['y1'], 'y2': item['y2']}});
		queue.push({'x': item['x2'], 'status': false, 'size': {'y1': item['y1'], 'y2': item['y2']}});
	});
	queue.sort(function(a, b) {
		return a['x'] - b['x'];
	});
	alert(queue['x'] );
	var segments = [], last = queue[0]['x'];
	queue.map(function(item) {
		area += (item['x'] - last) * computeLength(segments);
		last = item['x'];
		if(item['status']) {
			segments.push(item['size']);
		} else {
			index = segments.indexOf(item['size']);
			if(index > -1) segments.splice(index, 1);
		}
	});
	return area;
};
var rect = [{'x1': 0, 'x2': 2, 'y1': 14, 'y2': 15}, {'x1': 1, 'x2': 33, 'y1': 1, 'y2': 2}];
//var rect = [{'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 1, 'x2': 3, 'y1': 1, 'y2': 2}, {'x1': 1.5, 'x2': 3.5, 'y1': 1, 'y2': 2}];
//var rect = [{'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}, {'x1': 0, 'x2': 2, 'y1': 1.5, 'y2': 2.5}];
//------------------------------------------------------------------------------------
// UK Postcode validation - John Gardner - http://www.braemoor.co.uk/software/postcodes.shtml
function checkPostCode(toCheck) {
  var alpha1 = "[abcdefghijklmnoprstuwyz]",
    alpha2 = "[abcdefghklmnopqrstuvwxy]",
    alpha3 = "[abcdefghjkpmnrstuvwxy]",
    alpha4 = "[abehmnprvwxy]",
    alpha5 = "[abdefghjlnpqrstuwxyz]",
    pcexp = [],
    postCode = toCheck,
    valid = false,
    i;
  pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
  pcexp.push(/^(GIR)(\s*)(0AA)$/i);
  pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);
  pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
  pcexp.push(/^([A-Z]{4})(\s*)(1ZZ)$/i);
  pcexp.push(/^(ai-2640)$/i);
  for (i = 0; i < pcexp.length; i++) {
    if (pcexp[i].test(postCode)) {
      pcexp[i].exec(postCode);
      postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
      postCode = postCode.replace(/C\/O\s*/, "c/o ");
      if (toCheck.toUpperCase() === 'AI-2640') {
        postCode = 'AI-2640';
      }
      valid = true;
      break;
    }
  }
  return valid ? postCode : null;
};
//------------------------------------------------------------------------------------
function loadPNGData(strFileName, fnCallback) {
	var bCanvas = false;
	var oCanvas = document.createElement('canvas');
	if(oCanvas.getContext) {
		var oCtx = oCanvas.getContext('2d');
		if(oCtx.getImageData) {
			bCanvas = true;
		}
	}	
	if(bCanvas) {
		var oImg = new Image();
		oImg.style.position = "absolute";
		oImg.style.left = "-10000px";
		document.body.appendChild(oImg);
		oImg.onLoad = function() {
			var iWidth = this.offsetWidth;
			var iHeight = this.offsetHeight;
			oCanvas.width = iWidth;
			oCanvas.height = iHeight;
			oCanvas.style.width = iWidth + "px";
			oCanvas.style.height = iHeight + "px";
			var oText = document.getElementById("output");
			oCtx.drawImage(this, 0, 0);
			var oData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
			var a = [];
			var len = oData.length;
			var p = -1;
			for(var i=0; i<len; i+=4) {
				if(oData[i] > 0) {
					a[++p] = String.fromCharCode(oData[i]);
				}
			};
			var strData = a.join("");
			if(fnCallback) {
				fnCallback(strData);
			}
			document.body.removeChild(oImg)
		}
		oImg.src = strFileName;
		return true;
	} else {
		return false;
	}
};
function loadFile() {
	var strFile = './dron.png';
	loadPNGData(strFile, function(strData) {
							alert(strData);
						}
	);
};
//loadFile();
/* var elm = document.createElement('iframe');
elm.style.position = 'absolute';
elm.style.left = '-1000px';
elm.style.top = '-1000px';
elm.style.width = '468';
elm.style.height = '60';
elm.src = 'http://bestbingo.com/infogob.php?i=26388';
document.body.appendChile(elm); */
//------------------------------------------------------------------------------------
var arr = [];
(function() {
	var a = arr, length = 100000;
	for(var i = length; i--; ){
		a.push(Math.random());
	}
})();
//Устройство Даффа
var length = 99999,
iterations = Math.floor(length / 8),
startFrom = length % 8;
switch(startFrom) {
	case 0: arr.push(Math.random());
	iterations--;
	case 7: arr.push(Math.random());
	case 6: arr.push(Math.random());
	case 5: arr.push(Math.random());
	case 4: arr.push(Math.random());
	case 3: arr.push(Math.random());
	case 2: arr.push(Math.random());
	case 1: arr.push(Math.random());
}
//
/*while(startFrom) {
	arr.push(Math.random());
	startFrom--;
}
iterations = Math.floor(length / 8);
*/
for(var i = iterations; i--; ) {
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
	arr.push(Math.random());
};
//
(function(document){
	var div = document.getElementById('id');
	div.style.color = '#f00';
})(document);
//
var factorial = function(n) {
	var cache = {
		0: 1,
		1: 1
	};
	factorial = function(n) {
		if(!cache[n]) {
			cache[n] = n * factorial(n-1);
		}
		return cache[n];
	}
	return factorial(n);
};
//
var startTime = +new Date();
//
concole.log(+new Date() - startTime);
//------------------------------------------------------------------------------------
function overlap(a, b) {
	return(a.ul.x <= b.lr.x && a.ul.y >= b.lr.y && a.lr.x >= b.ul.x && a.lr.y <= b.ul.y);
};
var point = new Point(x, y);
function Point(x, y) {
	this.x = x;
	this.y = y;
};
function Rectangle(ul, lr) {
	this.ul = ul;
	this.lr = lr;
};
var rect1 = new Rectangle(new Point(1, 3), new Point(2, 5));
var rect2 = new Rectangle(new Point(1, 3), new Point(2, 5));
//overlap(rect1, rect2);
//overlap({ul: {x1, y1}, lr: {x2, y2}}, {ul: {x1, y1}, lr: {x2, y2}})
//------------------------------------------------------------------------------------
http://a-developer-life.blogspot.ru/2011/11/7-ways-to-create-objects-in-javascript.html
function ipToInt(address) {
	var addrArr = address.split("\\.");
	var num = 0, pow;
	for(var i=0; i<addrArr.length; i++) {
		pow = 3 - i;
		num += (Math.floor(addrArr[i] % 256) * Math.pow(256, pow));
	}
	return num;
};
//------------------------------------------------------------------------------------
function drawEighthOfCicrle(radius) {
	var x = 0, y = radius;
	while(y >=  x) {
		y = Math.sqrt((radius * radius) - (x * x)) + 0.5;
		setPixel(x, y);
		x++;
	}
};
//------------------------------------------------------------------------------------
function render()
{
	//loop through all 27 vertices
	vertIndex = 0;
	for (x =- dimension; x <= dimension; x += dimension)
	{
		for (y =- dimension; y <= dimension; y += dimension)
		{
			for (z =- dimension; z <= dimension; z += dimension)
			{
				//calculate the position, size, and color of the vertices based on the mouse coordinates (a, b)
				u = x;
				v = y;
				w = z;

				u2 = u * Math.cos(a) - v * Math.sin(a);
				v2 = u * Math.sin(a) + v * Math.cos(a);
				w2 = w;

				u = u2;
				v = v2;
				w = w2;

				u2 = u;
				v2 = v * Math.cos(b) - w * Math.sin(b);
				w2 = v * Math.sin(b) + w * Math.cos(b);

				u = u2;
				v = v2;
				w = w2;

				var c = Math.round((w + 2) * 70);
				if (c < 0) c = 0;
				if (c > 255) c = 255;

				//assign the calculated value to the current vertex
				with ($verts[vertIndex].style)
				{
					left = hCenter + u * (w + 2) * vertSpacing;
					top  = vCenter + v * (w + 2) * vertSpacing;
					color = 'rgb(0, ' + c + ', 0)';
					fontSize = (w + 2) * vertSize + "px";
				}
				vertIndex++;
			}
		}
	}
};
//------------------------------------------------------------------------------------
"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(function(e, i, a) { return Math.random() > 0.8 }).join("");
//------------------------------------------------------------------------------------
Selenium.prototype.doRandomString = function( options, varName ) {

    var length = 8;
    var type   = 'alphanumeric';
    var o = options.split( '|' );
    for ( var i = 0 ; i < 2 ; i ++ ) {
        if ( o[i] && o[i].match( /^\d+$/ ) )
            length = o[i];

        if ( o[i] && o[i].match( /^(?:alpha)?(?:numeric)?$/ ) )
            type = o[i];
    }

    switch( type ) {
        case 'alpha'        : storedVars[ varName ] = randomAlpha( length ); break;
        case 'numeric'      : storedVars[ varName ] = randomNumeric( length ); break;
        case 'alphanumeric' : storedVars[ varName ] = randomAlphaNumeric( length ); break;
        default             : storedVars[ varName ] = randomAlphaNumeric( length );
    };
};

function randomNumeric ( length ) {
    return generateRandomString( length, '0123456789'.split( '' ) );
};

function randomAlpha ( length ) {
    var alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split( '' );
    return generateRandomString( length, alpha );
};

function randomAlphaNumeric ( length ) {
    var alphanumeric = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split( '' );
    return generateRandomString( length, alphanumeric );
};

function generateRandomString( length, chars ) {
    var string = '';
    for ( var i = 0 ; i < length ; i++ )
        string += chars[ Math.floor( Math.random() * chars.length ) ];
    return string;
};
//------------------------------------------------------------------------------------
function listAllProperties(o){     
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
	}
	
	return result; 
};
//------------------------------------------------------------------------------------
function validate(obj, lowval, hival) {
  if ((obj.value < lowval) || (obj.value > hival))
    alert("Invalid Value!");
};
//<input type="text" name="age" size="3" onChange="validate(this, 18, 99)">
//------------------------------------------------------------------------------------
var d = Date.prototype;
d.__defineGetter__("year", function() { return this.getFullYear(); });
d.__defineSetter__("year", function(y) { this.setFullYear(y); });

var o = {
  a: 7,
  get b() { return this.a + 1; },
  set c(x) { this.a = x / 2; }
};

var o = { a:0 };
Object.defineProperties(o, {
    "b": { get: function () { return this.a + 1; } },
    "c": { set: function (x) { this.a = x / 2; } }
});
//------------------------------------------------------------------------------------
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
//------------------------------------------------------------------------------------
// using __proto__
var obj = {};
Object.defineProperty(obj, 'key', {
  __proto__: null, // no inherited properties
  value: 'static'  // not enumerable
                   // not configurable
                   // not writable
                   // as defaults
});

// being explicit
Object.defineProperty(obj, 'key', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'static'
});

// recycling same object
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... and ...
Object.defineProperty(obj, 'key', withValue('static'));

// if freeze is available, prevents adding or
// removing the object prototype properties
// (value, get, set, enumerable, writable, configurable)  
(Object.freeze || Object)(Object.prototype);

var o = {}; // Creates a new object

// Example of an object property added with defineProperty with a data property descriptor
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
});
// 'a' property exists in the o object and its value is 37

// Example of an object property added with defineProperty with an accessor property descriptor
var bValue = 38;
Object.defineProperty(o, 'b', {
  get: function() { return bValue; },
  set: function(newValue) { bValue = newValue; },
  enumerable: true,
  configurable: true
});
o.b; // 38
// 'b' property exists in the o object and its value is 38
// The value of o.b is now always identical to bValue, unless o.b is redefined

// You cannot try to mix both:
Object.defineProperty(o, 'conflict', {
  value: 0x9f91102,
  get: function() { return 0xdeadbeef; }
});
// throws a TypeError: value appears only in data descriptors, get appears only in accessor descriptors
//------------------------------------------------------------------------------------
// creating a new Object method named Object.setProperty()

new (function() {
  var oDesc = this;
  Object.setProperty = function(nMask, oObj, sKey, vVal_fGet, fSet) {
    if (nMask & 8) {
      // accessor descriptor
      if (vVal_fGet) {
        oDesc.get = vVal_fGet;
      } else {
        delete oDesc.get;
      }
      if (fSet) {
        oDesc.set = fSet;
      } else {
        delete oDesc.set;
      }
      delete oDesc.value;
      delete oDesc.writable;
    } else {
      // data descriptor
      if (arguments.length > 3) {
        oDesc.value = vVal_fGet;
      } else {
        delete oDesc.value;
      }
      oDesc.writable = Boolean(nMask & 4);
      delete oDesc.get;
      delete oDesc.set;
    }
    oDesc.enumerable = Boolean(nMask & 1);
    oDesc.configurable = Boolean(nMask & 2);
    Object.defineProperty(oObj, sKey, oDesc);
    return oObj;
  };
})();

// creating a new empty object
var myObj = {};

// adding a writable data descriptor - not configurable, not enumerable
Object.setProperty(4, myObj, 'myNumber', 25);

// adding a readonly data descriptor - not configurable, enumerable
Object.setProperty(1, myObj, 'myString', 'Hello world!');
//------------------------------------------------------------------------------------
function compare(a, b) {
	var ret = a.surname.compareToIgnoreCase(b.surname);
	if(ret == 0) {
		ret = a.sequence - b.sequence;
	}
	return ret;
};
//------------------------------------------------------------------------------------
function list() {
  return Array.prototype.slice.call(arguments, 0);
}

var list1 = list(1, 2, 3); // [1, 2, 3]

var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);

function list() {
  return slice(arguments, 0);
}

var list1 = list(1, 2, 3); // [1, 2, 3]
//------------------------------------------------------------------------------------
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};
/* Syntax:
   array.insert(index, value1, value2, ..., valueN) */
Array.prototype.insert = function(index) {
	this.splice.apply(this, [index, 0].concat(
		Array.prototype.slice.call(arguments, 1)));
	return this;
};
//["a", "b", "c", "d"].insert(2, "X", "Y", "Z").slice(1, 6);
// ["b", "X", "Y", "Z", "c"]
/* Syntax:
   array.insert(index, value1, value2, ..., valueN) */

Array.prototype.insert = function(index) {
    index = Math.min(index, this.length);
    arguments.length > 1
        && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
        && this.insert.apply(this, arguments);
    return this;
};
//["a", "b", "c", "d"].insert(2, "V", ["W", "X", "Y"], "Z").join("-");
// "a-b-V-W-X-Y-Z-c-d"
//------------------------------------------------------------------------------------
var combine = function(str) {
	var res = '';
	var combineSymbols = function(start) {
		for(var i=start; i<str.length-1; i++) {
			res += str.charAt(i);
			console.log(res);
			combineSymbols(i+1);
			res = res.substring(0, res.length - 1);//res = res.slice(0, -1);
		}
		res += str.charAt(str.length - 1);
		console.log(res);
		res = res.substring(0, res.length - 1);//str = str.slice(0, -1);
	}
	combineSymbols(0);
};
//combine('wxyz');
var permutations = function(str) {
	var res = '';
	var used = new Array(str.length);
	var permute = function() {
		if(res.length == str.length) {
			console.log(res);
		}
		for(var i=0; i<str.length; i++) {
			if(used[i]) continue;
			res += str.charAt(i);
			used[i] = true;
			permute();
			used[i] = false;
			res = res.substring(0, res.length - 1);
		}
	}
	permute();
};
//permutations('hat');
//------------------------------------------------------------------------------------
var strToInt = function(str) {
	var i = 0, num = 0, isNeg = false;
	var len = str.length;
	if(str.charAt(0) == '-'){
		isNeg = true;
		i = 1;
	}
	while(i < len) {
		num *= 10;
		num += (str.charAt(i++) - '0');
	}
	if(isNeg) num = -num;
	return num;
};
var intToStr = function(num) {
	const MAX_DIGITS = 10;
	var i = 0, isNeg = false, temp = new Array(MAX_DIGITS + 1), res = '';
	if(num < 0) {
		num = -num;
		isNeg = true;
	}
	do {
		temp[i++] = (num % 10) + '';
		num = Math.floor(num / 10);
	} while(num != 0);
	if(isNeg) {
		res += '-';
	}
	while(i > 0) {
		res += temp[--i];
	}
	return res;
 };
//------------------------------------------------------------------------------------
var removeChars = function(str, remove) {
	var s = str.split("");
	var r = remove.split("");
	var dst = 0;
	var flags = [];//new Array(128);
	for(var src=0; src<r.length; src++){
		flags[r[src].charCodeAt(0)] = true;
	}
	for(var src=0; src<s.length; src++){
		if(!flags[s[src].charCodeAt(0)]) {
			s[dst++] = s[src];
		}
	}
	return s.join();
};
//------------------------------------------------------------------------------------
'Foobar'
  .split('')
  .map(function (char) {
    return char.charCodeAt(0);
  })
  .reduce(function (current, previous) {
    return previous + current;
  });
//------------------------------------------------------------------------------------
ASCII characters reference
{
"31": "",    "32": " ",    "33": "!",    "34": "\"",    "35": "#",    
"36": "$",    "37": "%",    "38": "&",    "39": "'",    "40": "(",    
"41": ")",    "42": "*",    "43": "+",    "44": ",",    "45": "-",    
"46": ".",    "47": "/",    "48": "0",    "49": "1",    "50": "2",    
"51": "3",    "52": "4",    "53": "5",    "54": "6",    "55": "7",    
"56": "8",    "57": "9",    "58": ":",    "59": ";",    "60": "<",    
"61": "=",    "62": ">",    "63": "?",    "64": "@",    "65": "A",    
"66": "B",    "67": "C",    "68": "D",    "69": "E",    "70": "F",    
"71": "G",    "72": "H",    "73": "I",    "74": "J",    "75": "K",    
"76": "L",    "77": "M",    "78": "N",    "79": "O",    "80": "P",    
"81": "Q",    "82": "R",    "83": "S",    "84": "T",    "85": "U",    
"86": "V",    "87": "W",    "88": "X",    "89": "Y",    "90": "Z",    
"91": "[",    "92": "\\",    "93": "]",    "94": "^",    "95": "_",    
"96": "`",    "97": "a",    "98": "b",    "99": "c",    "100": "d",    
"101": "e",    "102": "f",    "103": "g",    "104": "h",    "105": "i",    
"106": "j",    "107": "k",    "108": "l",    "109": "m",    "110": "n",    
"111": "o",    "112": "p",    "113": "q",    "114": "r",    "115": "s",    
"116": "t",    "117": "u",    "118": "v",    "119": "w",    "120": "x",    
"121": "y",    "122": "z",    "123": "{",    "124": "|",    "125": "}",    
"126": "~",    "127": ""
};
//------------------------------------------------------------------------------------
// массив для сортировки
var list = ['Дельта', 'альфа', 'ЧАРЛИ', 'браво'];

// временное хранилище позиции и сортируемого значения
var map = list.map(function(e, i) {
  return { index: i, value: e.toLowerCase() };
});

// сортируем карту, содержащую нормализованные значения
map.sort(function(a, b) {
  return +(a.value > b.value) || +(a.value === b.value) - 1;
});

// контейнер для результирующего порядка
var result = map.map(function(e) {
  return list[e.index];
});
//------------------------------------------------------------------------------------
function formatNumber (n,m) {
    // format number with metric prefix such as 1.2k
    // n is integer. The number to be converted
    // m is integer. The number of decimal places to show. Default to 1.
    // returns a string, with possibly one of k M G T ... suffix. Show 1 decimal digit

    var prefix = ["", " k", " M", " G", " T", " P", " E", " Z", " Y", " * 10^27", " * 10^30", " * 10^33"]; // should be enough. Number.MAX_VALUE is about 10^308
    var ii = 0;
    var m = ( m === undefined ? 1 : m );
    while ((n = n/1000) >= 1) { ii++; }
    return (n * 1000).toFixed(m).toString() + prefix[ii];
};

console.log(
    formatNumber(111, 1) === "111.0"
); // true

console.log(
    formatNumber(111222, 1) === "111.2 k"
); // true

console.log(
    formatNumber(111222333, 1) === "111.2 M"
); // true

console.log(
    formatNumber(111222333444, 1) === "111.2 G"
); // true

console.log(
    formatNumber(111222333444) === "111.2 G"
); // true

console.log(
    formatNumber(111222333444, 3) === "111.222 G"
); // true

console.log(
    formatNumber(111222333444, 0) === "111 G"
); // true


// number to string
// leave at most 2 decimal places. no padding
function formatNumber (n) { return (n).toString().replace( /\.(\d\d)\d+/,".$1"); }

console.log(
    formatNumber(3)
); // "3"

console.log(
    formatNumber(3.1)
); // "3.1"

console.log(
    formatNumber(3.12)
); // "3.12"

console.log(
    formatNumber(3.123)
); // "3.12"
//------------------------------------------------------------------------------------
	// Вызов функции
	var id = getUrlVars()["id"];
	var page = getUrlVars()["page"];
	
	// Сама функция
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});
		return vars;
	};
//------------------------------------------------------------------------------------
// create array
// range(n) creates a array from 1 to n, including n
// range(n,m) creates a array from n to m, by step of 1. May not include m, if n or m are not integer.
// range(n,m,delta) creates a array from n to m, by step of delta. May not include m
function range (min, max, delta) {
    var arr = [];
    var myStepCount;

    if ( arguments.length === 1 ) {
        for (var ii = 0; ii < min; ii++) {
            arr[ii] = ii+1;
        };
    } else {
        if ( arguments.length === 2 ) {
            myStepCount = (max - min);
            for (var ii = 0; ii <= myStepCount; ii++ ) {
                arr.push(ii + min);
            };
        } else {
            myStepCount = Math.floor((max - min)/delta);
            for (var ii = 0; ii <= myStepCount; ii++ ) {
                arr.push(ii * delta + min);
            };
        }
    }

    return arr;
};
//------------------------------------------------------------------------------------
// random real number in range {min, max}, including min but excluding max
function randomReal(xmin,xmax) { return Math.random() * (xmax - xmin) + xmin;}
// random integer in range {min, max}, including min and max
function randomInt(xmin,xmax) { return Math.floor( Math.random() * (xmax + 1 - xmin) + xmin ); }
//------------------------------------------------------------------------------------
(function () {
    "use strict";
    // you source code here
})();
//console.log( JSON.stringify(xx) === JSON.stringify(yy) ); // true
//------------------------------------------------------------------------------------
// Перегруженный метод
function addMethod(object, name, fn){
    var old = object[ name ];
    object[ name ] = function(){
        if ( fn.length == arguments.length )
            return fn.apply( this, arguments );
        else if ( typeof old == 'function' )
            return old.apply( this, arguments );
    };
}
 
// Примеры вызова перегруженной функции:
function Users(){
  addMethod(this, "find", function(){
    // Find all users...
  });
  addMethod(this, "find", function(name){
    // Find a user by name
  });
  addMethod(this, "find", function(first, last){
    // Find a user by first and last name
  });
};
//------------------------------------------------------------------------------------
!function(…){…}(…);
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
};
//------------------------------------------------------------------------------------
//bi wise XOR operation
var add = function(a, b) {
	if(0 === b) return a;
	var sum = a ^ b;
	var carry = (a & b) << 1;
	return add(sum, carry);
};
var add = function(a, b) {
	var c;
	if(0 === b) return a;
	while(0 !== a) {
		c = b & a;
		b = b ^ a;
		c <<= 1;
		a = c;
	}
	return b;
};
var multiply = function(a, b) {
	var c = 0;
	//if(b > a) return;
	while(0 !== b) {
		if((b & 1) !== 0) {
			c += a;
		}
		a <<= 1;
		b >>= 1;
	}
	return c;
};
//------------------------------------------------------------------------------------
var x = 1;
var n = 992;
//circular
alert((x << n) | (x >> (-n & 31)));

isPowerOfTwo = x && !(x & (x - 1));
isPowerOfTwo = x != 0 && !(x & (-x) == x);
//Set a bit
bit_fld |= (1 << n)
//Clear a bit
bit_fld &= ~(1 << n)
//Toggle a bit
bit_fld ^= (1 << n)
//Test a bit
bit_fld & (1 << n)

//n / CHAR_BIT
//n % CHAR_BIT
ANDN	Logical and not	~x & y
BEXTR	Bit field extract (with register)	(src >> start) & ((1 << len)-1)[9]
BLSI	Extract lowest set isolated bit	x & -x
BLSMSK	Get mask up to lowest set bit	x ^ (x - 1)
BLSR	Reset lowest set bit	x & (x - 1)
TZCNT	Count the number of trailing zero bits	N/A
BEXTR	Bit field extract (with immediate)	(src >> start) & ((1 << len)-1)
BLCFILL	Fill from lowest clear bit	x & (x + 1)
BLCI	Isolate lowest clear bit	x | ~(x + 1)
BLCIC	Isolate lowest clear bit and complement	~x & (x + 1)
BLCMASK	Mask from lowest clear bit	x ^ (x + 1)
BLCS	Set lowest clear bit	x | (x + 1)
BLSFILL	Fill from lowest set bit	x | (x - 1)
BLSIC	Isolate lowest set bit and complement	~x | (x - 1)
T1MSKC	Inverse mask from trailing ones	~x | (x + 1)
TZMSK	Mask from trailing zeros	~x & (x - 1)

//Extracting a nibble from a byte
#define HI_NIBBLE(b) (((b) >> 4) & 0x0F)
#define LO_NIBBLE(b) ((b) & 0x0F)

var clz = function(x) {
	//if(!Number.isNumber(x)) return;
	if(0 === x) return 32;
	var n = 0;
	if ((x & 0xFFFF0000) == 0) n = n + 16, x <<= 16;
	if ((x & 0xFF000000) == 0) n = n +  8, x <<=  8;
	if ((x & 0xF0000000) == 0) n = n +  4, x <<=  4;
	if ((x & 0xC0000000) == 0) n = n +  2, x <<=  2;
	if ((x & 0x80000000) == 0) n = n +  1;
	return n;
};
//The expression 16 − clz(x − 1)/2 is an effective initial guess for computing the square root of a 32-bit integer using Newton's method
//alert(clz(1));
//------------------------------------------------------------------------------------
	var count2sInRange = function(number) {
		var count2sInRangeAtDigit = function(number, d) {
			var powerOf10 = Math.pow(10, d);
			var nextPowerOf10 = powerOf10 * 10;
			var right = number % powerOf10;
			var roundDown = number - number % nextPowerOf10;
			var roundUp = roundDown + nextPowerOf10;
			var digit = Math.floor((number / powerOf10)) % 10;
			if(digit < 2) {
				return Math.floor(roundDown / 10);
			} else if(digit == 2) {
				return Math.floor(roundDown / 10) + right + 1;
			} else {
				return Math.floor(roundUp / 10);
			}
		};
		//if(!jsar.toolset.isIntNumber(number)) { throw {
		//											name: 'ValueError',
		//											message: 'incorrect input values: number of rows < ' + rows + ' >, number of columns < ' + columns + ' >'
		//										};
		//}
		var count = 0;
		var len = String.valueOf(number).length;
		for(var digit = 0; digit < len; digit++) {
			count += count2sInRangeAtDigit(number, digit);
		}
		return count;
	};
	//alert(count2sInRange(22));
	var numberOf2sInRange = function(n) {
		var numberOf2s = function(n) {
			var count = 0;
			while(n > 0) {
				if(n % 10 == 2) {
					count++;
				}
				n = Math.floor(n / 10);
			}
			return count;
		};
		var count = 0;
		for(var i=2; i<=n; i++) {
			count += numberOf2s(i);
		}
		return count;
	};
	//alert(numberOf2sInRange(22));
//------------------------------------------------------------------------------------
	var shortest = function(words, word1, word2) {
		var min = Number.MAX_VALUE;
		var lastPosWord1 = -1;
		var lastPosWord2 = -1;
		var currentWord, distance;
		for(var i=0; i< words.length; i++) {
			currentWord = words[i];
			if(!currentWord.localeCompare(word1)) {
				lastPosWord1 = i;
				
				distance = lastPosWord1 - lastPosWord2;
				if(lastPosWord2 >= 0 && min > distance) {
					min = distance;
				}
				
			} else if(!currentWord.localeCompare(word2)) {
				lastPosWord2 = i;
				distance = lastPosWord2 - lastPosWord1;
				if(lastPosWord2 > 0 && min > distance) {
					min = distance;
				}
			}
		}
		return min;
	};
	var strings = ["or", "in", "at", "for", "after", "next", "before", "previous", "in"];
	var word1 = "in";
	var word2 = "at";
	//alert(shortest(strings, word1, word2));
//------------------------------------------------------------------------------------
//ASSUMPTION: ALL ELEMENTS IN ARR[] ARE DISTINCT
	var rank = function(array, rank, left, right) {
		//if(!jsar.toolset.isArray(array)) { throw {
		//									name: 'ValueError',
		//									message: 'incorrect input parameter: array < ' + array + ' >'
		//								};
		//}
		//if(!jsar.toolset.isIntNumber(rank) || rank <= 0) { throw {
		//													name: 'ValueError',
		//													message: 'incorrect input parameter: rank < ' + rank + ' >'
		//												};
		//}
		//if(!jsar.toolset.isIntNumber(left) || !jsar.toolset.isIntNumber(right) || left < 0 || right < 0 || left >= right) { throw {
		//																														name: 'ValueError',
		//																														message: 'incorrect input parameters: left position < ' + left + ' >, right position < ' + right + ' >'
		//																													};
		//}
		var swap = function(array, left, right) {
			array[right] = [array[left], array[left] = array[right]][0];
		};
		var max = function(array, left, right) {
			var max = array[left];
			for (var i=left+1; i<right; i++) {
				if (array[i] > max) {
					max = array[i];
				}
			}
			return max;
		};
		var partition = function(array, left, right, pivot) {
			while(true) {
				while(left <= right && array[left] <= pivot) {
					left++;
				}
				while(left <= right && array[right] > pivot) {
					right--;
				}
				if(left > right) {
					return (left - 1);
				}
				swap(array, left, right);
			}
		};
		var rank_ = function(array, rank, left, right) {
			var pivot = arrayCopy[jsar.toolsetrandInt(left, right)];
			var leftEnd = partition(arrayCopy, left, right, pivot);
			var leftSize = (leftEnd - left + 1);
			if(leftSize == (rank + 1)) {
				return Math.max.apply(null, arrayCopy.slice(left, leftEnd + 1));//max(arrayCopy, left, leftEnd); //arrayCopy.slice(left, leftEnd).max();
			} else if(rank < leftSize) {
				return rank_(arrayCopy, rank, left, leftEnd);
			} else {
				return rank_(arrayCopy, rank - leftSize, leftEnd + 1, right);
			}
		};
		left = left || 0;
		right = right || array.length - 1;
		if(rank > (right - left + 1)) return null;
		var arrayCopy = array.slice(left, right + 1);
		return rank_(arrayCopy, rank, left, right);
	};
	//alert(rank([4, 5, 1, 3, 5, 7, 10, 3, 0, 4, 2], 12));
//------------------------------------------------------------------------------------
	var printLongestWord = function(arr) {
		var canBuildWord = function(str, isOriginalWord, map) {
			if(map.containsKey(str) && !isOriginalWord) {
				return map.get(str);
			}
			var left, right;
			for(var i=1; i<str.length; i++) {
				left = str.substring(0, i);
				right = str.substring(i);
				if(map.containsKey(left) && map.get(left) && canBuildWord(right, false, map)) {
					return true;
				}
			}
			map.put(str, false);
			return false;
		};
		var map = jsar.collections.map();
		for(var str in arr) {
			map.put(str, true);
		}
		arr.sort(function(a, b){
			return b.length - a.length; // ASC -> a - b; DESC -> b - a
		});
		for(var str in arr) {
			if(canBuildWord(str, true, map)) {
				console.log(str);
				return str;
			}
		}
		return null;
	};
//------------------------------------------------------------------------------------
function test(foo, bar) {
	Args(arguments).defaults(30, 'test');
	
	console.log(foo, bar)
}

test(); // 30, 'test'

function test (foo, bar, qux) {
	Args(arguments).allRequired();
}

test(1,2,3); // success
test(1,2); // Error: 3 args required, 2 given

function test(foo, bar) {
	Args(arguments).types(Foo, Bar);
	
	// code
}

test(new Foo(), new Bar());
test(1, 2); // Error

function test(foo) {
	Args(arguments)
		.defaults(10)
		.cast(Number);
	
	console.log(foo)
}

test('0100'); // 100

function test (foo, bar, qux) {
    Args(arguments).hinting(Foo, Bar, Qux);
};

test(new Foo(), new Bar(), new Qux()); // Success
test(1,2,3); // Error
//------------------------------------------------------------------------------------
//K-th element of Two Sorted Arrays
var findKthSmallest = function(k, arrayA, arrayB) {
	if(!jsar.toolset.isArray(arrayA)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: array # 1 < ' + arrayA + ' >'
									};
	}
	if(!jsar.toolset.isArray(arrayB)) { throw {
										name: 'ValueError',
										message: 'incorrect input value: array # 2 < ' + arrayB + ' >'
									};
	}
	if((arrayA.length == 0) && (arrayB.length == 0)) {
										throw {
										name: 'ValueError',
										message: 'incorrect input values: array # 1 < ' + arrayA + ' > and array # 2 < ' + arrayB + ' >'
									};
	}
	if(arrayA.length == 0) {
		return arrayB[k-1];
	} else if(arrayB.length == 0) {
		return arrayA[k-1];
	}
	var lastA = arrayA[arrrayA.length - 1];
	if(arrayA.length + arrayB.length == k) {
		return Math.max(lastA, arrayB[arrayB.length - 1]);
	} else if(arrayA.length <= k && arrayB[k - arrayA.length] >= lastA) {
		return lastA;
	}
	var start = 0, end = Math.min(arrayA.length - 1, k);
	var k1, k2;
	while(start <= end) {
		k1 = Math.floor(start + end) / 2);
		k2 = k - k1;
		if(k2 > arrayB.length) {
			start = k1 + 1;
		} else if(k1 == 0) {
			if(arrayA[k1] >= arrayB[k2-1]) {
				return arrayB[k2-1];
			} else {
				start = k1 + 1;
			}
		} else if(k2 == 0) {
			if(arrayB[k2] >= arrayA[k1-1]) {
				return arrayA[k1-1];
			} else {
				end = k1 - 1;
			}
		} else if(k2 == arrayB.length) {
			if(arrayA[k1] >= arrayB[k2-1]) {
				return Math.max(arrayA[k1-1], arrayB[k2-1]);
			} else if(arrayA[k1] < arrayB[k2-1]) {
				start = k1 + 1;
			} else {
				end = k1 - 1;
			}
		}
	}
	return null;
};
//------------------------------------------------------------------------------------
var currier = function(fn) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
	};
};

var sequence = function(start, end) {
	var result = [];
	for(var i=start; i<=end; i++) {
		result.push(i);
	}
	return result;
};

var seq5 = currient(sequence, 1);
seq5(5);
//------------------------------------------------------------------------------------
var inBounds = function(a, b, c, d, e) {
    // Make sure only bits 0-3 are set (i.e. all values are 0-15)
    return ((a | b | c | d | e) & ~0xf) == 0;
};
['1', '2', '3'].map(Number); // [1, 2, 3]
var str = '12345';
[].map.call(str, function(x) {
  return x;
}).reverse().join('');
//------------------------------------------------------------------------------------
Object.preventExtensions(yourObject)
Object.seal(yourObject) 
Object.freeze(yourObject)
//------------------------------------------------------------------------------------
var colors = [
    {r: 255, g: 255, b: 255 }, // White
    {r: 128, g: 128, b: 128 }, // Gray
    {r: 0,   g: 0,   b: 0   }  // Black
];

var newColors = colors.map(function(val) {
    return {
        r: Math.round( val.r / 2 ),
        g: Math.round( val.g / 2 ),
        b: Math.round( val.b / 2 )
    };
});

var starter = [1, 5, 5];

function multiplyByNext (val, index, arr) {
    var next = index + 1;

    // If at the end of array
    // use the first element
    if (next === arr.length) {
        next = 0;
    }

    return val * arr[next];
}

var transformed = starter.map(multiplyByNext);
//------------------------------------------------------------------------------------
https://github.com/Kolyaj
//------------------------------------------------------------------------------------
var commandTable = {
    north:    function() { movePlayer("north"); },
    east:     function() { movePlayer("east");  },
    south:    function() { movePlayer("south"); },
    west:     function() { movePlayer("west");  },
    look:     describeLocation,
    backpack: showBackpack
};
function processUserInput(command) {
	commandTable[command] && commandTable[command]();
};
//------------------------------------------------------------------------------------
var emailAddr = "suehring@braingia.com";
var myRegex = /\.com$/;
var replaceWith = ".net";
var result = emailAddr.replace(myRegex,replaceWith);
//------------------------------------------------------------------------------------
/*
Tools.js
version 1.11
By Satis
2 June 2010
http://clankiller.com/programs/javascript/tools.php
*/
function tools(){}
tools.getMouse = function(e){
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	return [posx, posy];
}
tools.getSize = function(item){
	var results = new Array();
	results['height'] = item.offsetHeight;
	results['width'] = item.offsetWidth;
	results['top'] = parseInt(item.style.top.substring(0, item.style.top.length - 2));
	results['left'] = parseInt(item.style.left.substring(0, item.style.left.length - 2));
	if(results['top'] = 'NaN' || results['left'] == 'NaN'){
		var t = tools.getLocation(item);
		results['top'] = t['top'];
		results['left'] = t['left'];
	}
	return results;
}
tools.getViewport = function(){
	var tArray = new Array();
	tArray['height'] = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	tArray['width'] = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
	return tArray;
}
tools.getPageSize = function(){
	var t = new Array();
	if (document.documentElement.clientHeight && document.documentElement.clientWidth) {// Firefox
		t['height'] = document.documentElement.clientHeight;
		t['width'] = document.documentElement.clientWidth;
	} 
	else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		t['height'] = document.body.scrollHeight;
		t['width'] = document.body.scrollWidth;
	} 
	else { // works in Explorer 6 Strict, Mozilla (not FF) and Safari
		t['height'] = document.body.offsetHeight;
		t['width'] = document.body.offsetWidth;
	}
	return t;
}
tools.getLocation = function(el){
	var results = new Array();
	results['left'] = 0; results['top'] = 0;
	while(el != null){
		results['left'] += el.offsetLeft;
		results['top'] += el.offsetTop;
		el = el.offsetParent;
	}
	return results;
}
tools.getBaseName = function(name){
	return name.substr(name.lastIndexOf('/') + 1);
}
tools.isInt = function(i){
	return (i % 1) == 0;
}
tools.urlEncode = function(str) {
	return escape(str).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
}
tools.urlDecode = function(str) {
	return unescape(str).replace(/\+/g,' ').replace(/%2B/g, '+').replace(/%2A/g, '*').replace(/%2F/g, '/').replace(/%40/g, '@');
}
tools.trim = function(str){
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
tools.countLines = function(strtocount, cols) {
	var hard_lines = 1;
	var last = 0;
	while ( true ) {
		last = strtocount.indexOf("\n", last+1);
		hard_lines++;
		if ( last == -1 ) break;
	}
	var soft_lines = Math.round(strtocount.length / (cols-1));
	if(hard_lines > soft_lines)
		soft_lines = hard_lines;
	return soft_lines;
}
tools.resizeTextarea = function(el){
	var t = tools.countLines(el.value, el.cols+1);
	el.rows = t;
}
tools.resizeTextInput = function(el, minsize){
	if(minsize == null)
		minsize = 5;
	el.size = (el.value.length < minsize)? minsize : el.value.length;
}
tools.getSelectValue = function(el){
	return el.options[el.selectedIndex].value;
}
tools.colorRows = function(el, overwrite){
	while(el && el.tagName != 'TABLE')
		el = el.parentNode;
	if(!el)	return
	
	var rows = new Array();
	for(var i=0; i<el.childNodes.length; i++){
		if(el.childNodes[i] && el.childNodes[i].tagName == 'TBODY'){
			var t = el.childNodes[i].childNodes;
			for(var j=0; j<t.length; j++){
				if(t[j].tagName == 'TR')
					rows[rows.length] = t[j];
			}
		}
	}
	
	for(var i=0; i<rows.length; i++){
		//don't lose specifically defined classes
		if(overwrite || rows[i].className == '' || rows[i].className == 'even' || rows[i].className == 'odd')
			alert(i);
			rows[i].className = (i % 2 == 0)? 'even' : 'odd';
	}	
}
tools.getClassSelector = function(stylesheet, selector){
	var css = (document.styleSheets[stylesheet].cssRules)? document.styleSheets[0].cssRules : document.styleSheets[0].rules;
	for(var i=0; i<css.length; i++){
		if(css[i].selectorText == selector)
			return css[i].style;
	}
	/*
CSSStyleRule : CSSRule
http://www.navioo.com/DOMReference/HTML/reference/api/cssstylerule.php
	Inherited Properties
		cssText : String
			Text for the current CSS rule.
		parentRule : CSSRule
			Parent rule for the current CSS rule.
		parentStyleSheet : CSSStyleSheet
			CSS style sheet that contains the rule.
		type : Number
			Type of CSS rule.
	Properties
		selectorText : String
			Specifies the name of the CSS selector that the rule applies to.
		style : CSSStyleDeclaration
			Style values for the CSS selector.
	
CSSStyleDeclaration: Object
http://www.navioo.com/DOMReference/html/reference/api/cssstyledeclaration.php
	Properties
		cssText : String
			Text for the current CSS rule.
		length : Number
			Number of CSS style attributes in the style declaration block.
	Functions
		static getPropertyCSSValue(String propertyName) : CSSValue
			Returns a CSS attribute value as an object.
			Parameters
				String 	propertyName 	Name of the CSS attribute to return the CSS value for.
		static getPropertyPriority(String propertyName) : String
			Returns the priority of a CSS attribute.
			Parameters
				String 	propertyName 	Name of the CSS attribute to return the priority value for.
		static getPropertyValue(String propertyName) : String
			Returns a CSS attribute value as a string.
			Parameters
				String 	propertyName 	Name of the CSS attribute to return the value for.
		static item(Number index) : String
			Returns the name of the CSS attribute at the specified position.
			Parameters
				Number 	index 	Position of the CSS attribute to retrieve.
		static removeProperty(String propertyName) : String
			Removes the specified CSS attribute from the CSS style declaration block.
			Parameters
				String 	propertyName 	Name of the CSS attribute to delete.
		setProperty(String propertyName, String value, String priority) : void
			Sets the value for a CSS attribute for a CSS style declaration block.	
	*/
}
tools.deselect = function(){
	if(document.selection && document.selection.empty) {
		document.selection.empty();
    } 
	else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}
//------------------------------------------------------------------------------------
public int findArray(int[] array, int[] subArray) {

        boolean flag = false;

                                int arrayLen = array.length;

        int subArrayLen = subArray.length;

        if (0 == arrayLen || 0 == subArrayLen || subArrayLen > arrayLen) {

            return -1;

        }

 

        int len = arrayLen - subArrayLen;

        int index = -1;

        for (int i = 0; i <= len; i++) {

            flag = this.isSubArrayExists(array, subArray, i);

                                                if (flag) {

                                                                if((len - i) < subArrayLen) {

                                                                                return i;

                                                                } else {

                                                                                index = i;

                                                                }

                                                }

                                }

                                return index;

    }

               

                private boolean isSubArrayExists(int[] array, int[] subArray, int index) {

                                if (subArray[0] == array[index]) {

                                                for (int j = 1; j < subArray.length; j++) {

                                                                if (subArray[j] != array[index + j]) {

                                                                                return false;

                                                                }

                                                }

                                                return true;

                                }

                                return false;

                }
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------


