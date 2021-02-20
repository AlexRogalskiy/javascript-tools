var DEBUG_MODE = false;
//--------------------------------------------------------------
var jsar = {};
jsar.toolset = {};
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
jsar.toolset.operations = (function() {
	var that = {};
	that.add = function() {
		var res = 0;
		for(var i=0; i<arguments.length; i++) {
			res += arguments[i];
		}
		return res;
    };
	that.sub = function() {
		var res = arguments[0] || 0;
		for(var i=1; i<arguments.length; i++) {
			res -= arguments[i];
		}
		return res;
    };
	that.mult = function() {
		var res = 1;
		for(var i=0; i<arguments.length; i++) {
			res *= arguments[i];
		}
		return res;
    };
	that.div = function() {
		var res = arguments[0] || 1;
		for(var i=1; i<arguments.length; i++) {
			res /= arguments[i];
		}
		return res;
    };
	that.run = function(fn) {
		if(!jsar.toolset.isFunction(fn)) {
			throw jsar.exception.typeException('TypeError', 'incorrect type of argument: function < ' + fn + ' >');//new TypeError('');
		}
		var slice = Array.prototype.slice, args = slice.apply(arguments, [1]);
        return fn(args);
    };
	return that;
})();
//var data = [4, 8, 15, 16, 23, 42];
//var sum = data.compute(jsar.toolset.operations.add, 1);
//var data1 = data.process(jsar.toolset.operations.add, 2);
//var substract = data.compute(jsar.toolset.operations.sub, 0);
//var product = data.compute(jsar.toolset.operations.mult, 1);
//var divide = data.compute(jsar.toolset.operations.div, 1);

//document.writeln(jsar.toolset.operations.add(1, 3, 5, 1, 1, null, 'a'));
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//A.sort(function(a, b) {
//	if (a.length<b.length) return -1;
//	if (a.length>b.length) return 1;
//	if (a.length=b.length) return 0;
//});
//--------------------------------------------------------------
var re = /(\w+)\s(\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1") // "Smith, John"
var str = "welcome to the the jungle baby baby";
str = str.replace(/(\w+) \1/g, "$1");
//--------------------------------------------------------------
//https://developer.mozilla.org/ru/docs/JavaScript/Reference/Global_Objects/Array/forEach
//--------------------------------------------------------------
// String.balance = function(str) {
	// var flag = 0;
	// var fun = function fun(str, symbol) {
		// for(var i=0; i< str.length; i++) {
			// if(flag < 0) return 0;
			// switch(str[i]) {
				// case '(' : flag++; str = fun(str, ')'); break;
				// case '[' : flag++; str = fun(str, ']'); break;
				// case '{' : flag++; str = fun(str, '}'); break;
				// case ')' : case ']' : case '}' :
					// if(str[i-1] === symbol) {
						// flag--;
						// return str;
					// }
					// flag--;
				// break;
			// }
		// }
		// return str;
	// };
	// if(str && typeof str === 'string') {
		// fun(str, 'a');
		// if(!flag) {
			// return true;
		// }
		// return false;
	// }
// };
// var res = String.balance("{[()()[[]]{()(())}(]}");
// document.writeln("balance: " + res);
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
var oldareacode = /\((\d{3})\)/g;
var p = '(555)666-1212'.replace(oldareacode, '$1-');
//--------------------------------------------------------------
var text = 'last, first, middle';
var d = text.split(/\s*,\s*/);
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
var mammal = function(spec) {
	var that = {};
	that.get_name = function() {
		return spec.name;
	};
	that.says = function() {
		return spec.saying || '';
	};
	return that;
};
//var myMammal = mammal({name: 'Herb'});
var cat = function(spec) {
	spec.saying = spec.saying || 'meow';
	var that = mammal(spec);
	that.purr = function(n) {
		var i, s = '';
		for(i=0; i<n; i++) {
			if(s) {
				s += '';
			}
			s += 'r';
		}
		return s;
	};
	that.get_name = function() {
		return that.says() + ' ' + spec.name + ' ' + that.says();
	};
	return that;
};
//var myCat = cat({name: 'Henrietta'});
var coolcat = function(spec) {
	var that = cat(spec),
	super_get_name = that.superior('get_name');
	that.get_name = function(n) {
		return 'like ' + super_get_name() + ' baby';
	};
	return that;
};
//var myCoolCat = coolcat({name: 'Bix'});
//var name = myCoolCat.get_name();
//--------------------------------------------------------------
//--------------------------------------------------------------
var add = function(a, b) {
	if(typeof a !== 'number' || typeof b !== 'number') {
		throw {
			name: 'TypeError',
			message: 'add needs numbers'
		};
	}
};
var try_it = function() {
	try {
		add("seven");
	} catch(e) {
		document.writeln(e.name + ": " + e.message);
	}	
};
//try_it();
//--------------------------------------------------------------
//var name;
//for(name in another_stooge) {
//	if(typeof another_stooge[name] !== 'function' && another_stooge.hasOwnProperty(name)) {
//		document.writeln(name + ": " + another_stooge[name]);
//	}
//};
//var another_stooge = Object.create(stooge);
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
//var c = (a << 4) | b;
//var a = c >> 4;
//var b = c & 0xF;
//--------------------------------------------------------------
//[^a-zA-Z0-9_-]/.test(field);
//--------------------------------------------------------------
//var startTime = new Date().getTime();
//for(var iters=0; timeElapsed<1000; iters++) {
//	timeElapsed = new Date().getTime() - startTime;
//};
//document.writeln("iterations per 1000: " + iters);
//var searchFlags = 128 + 32 + 4;
//var pets = [];
//var numPets = pets.length();
//for(var i=0; i<numPets; i++){
//	if(searchFlags && pets[i].flags === searchFlags) {
//		//
//	}
//};
//value &= 7; // 0-7; mod 8 (1 or 2^power-1);
//toggle ^= 1;
//5 << 3; // 5 * 2^3
//10 >> 3; // / parseInt(10 / 2^3)
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
var autolink = function(data) {
	var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%=-]*>))/g;
	return (data.replace(re, '<a target="_blank" href="$1">$1</a> '));
};
//--------------------------------------------------------------
//var pattern = /(\d{3})(\d{2})(\d{4})/;
//var ssn = "123456789";
//ssn = ssn.replace(pattern, "$1-$2-$3");
//--------------------------------------------------------------
//http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
//http://www.timdown.co.uk/jshashtable/
//http://underscorejs.org
//http://www.spravkaweb.ru/jscript/methods/jsonstringify
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
jsar.toolset.arrayShuffle = function(array) {
	if(!jsar.toolset.isArray(array)) { throw {
										name: 'ValueError',
										message: 'incorrect input array: < ' + array + ' >'
									};
	}
	var l, temp;
	for(var i=0; i<array.length; i++) {
		//l = Math.floor(Math.random() * i + 1);
		l = Math.floor(Math.random() * array.length);
		temp = array[i];
		array[i] = array[l];
		array[l] = temp;
	}
	return array;
};
//document.writeln(jsar.toolset.arrayShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
jsar.toolset.getCurrentPageNumber = function(param) {
	var str = jsar.toolset.getQueryString(param);
	return (!isNaN(parseInt(statPage)) ? parseInt(statPage) : 1);
	//return (jsar.toolset.getQueryString(param) != null) ? parseInt(jsar.toolset.getQueryString(param)) : 1;
};
jsar.toolset.replacePageNumber = function(param, pageNum) {
	return window.location.href.replace(new RegExp(param + "=(\d)"), param + '=' + pageNum);
};
jsar.toolset.loadNextPage = function(param) {
	var pageNum = jsar.toolset.getCurrentPageNumber(param) + 1;
	var url = window.location.href;
	if(url.indexOf(param + '=') != -1) {
		window.location.href = jsar.toolset.replacePageNumber(param, pageNum);
	} else(url.indexOf('?') != -1) {
		window.location.href += '&' + param + '=' + pageNum;
	} else {
		window.location.href += '?' + param + '=' + pageNum;
	}
};
jsar.toolset.loadPreviousPage = function(param) {
	var pageNum = jsar.toolset.getCurrentPageNumber(param) - 1;
	if(pageNum > 0) {
		window.location.href = jsar.toolset.replacePageNumber(param, pageNum);
	}
};
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
/*
jsar.toolset.polymorph = function() {
	var len2func = [];
	for(var i=0; i<arguments.length; i++) {
		if(jsar.toolset.isFunction(arguments[i])) {
			len2func[arguments[i].length] = arguments[i];
		}
	}
	return function() {
		return len2func[arguments.length].apply(this, arguments);
	}
};
*/
/*
var getRectangleArea2 = polymorph(
	function(width, height) {
		return width * height;
	},
	function(x1, y1, x2, y2) {
		return (x2-x1)*(y2-y1);
	}
);

var PolyFunc = polymorph(
    function(a,b,c) {
        return "Three arguments version -- any types";
    },
    
    {i: Number, str: String},
    function(i, str) {
        return "Number and string passed";
    },
    
    {re: RegExp},
    function(re,a) {
        return "RegExp and something else passed";
    },
    
    {f: Function, b: Boolean},
    function(f,b) {
        return "Function and boolean passed";
    },
    
    {f: Function, i: Number},
    function(f,i) {
        return "Function and number passed";
    }
);
alert(PolyFunc(1,2,3)); // "Three arguments version -- any types"
alert(PolyFunc(1,"qq")); // "Number and string passed"
alert(PolyFunc(function() {}, true)); // "Function and boolean passed"
alert(PolyFunc(function() {}, 1)); // "Function and number passed"
alert(PolyFunc(/a/, 1)); // "RegExp and something else passed"
alert(PolyFunc(/a/, "str")); // "RegExp and something else passed"
*/
//--------------------------------------------------------------
<script type="text/javascript">
	var monthNames = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    var monthNums = new Array("01","02","03","04","05","06","07","08","09","10","11","12");
    var now = new Date();
    // Display date in format Month DD, YYYY
    document.write(monthNames[now.getMonth()] + " " + now.getDate() + ", " + now.getYear());
    document.write("<br>");
    // Display date in format MM-DD-YYYY
    document.write(monthNums[now.getMonth()] + "-" + now.getDate() + "-" + now.getYear());
    document.write("<br>");
    // Display date in format DD.MM.YYYY
    document.write(now.getDate() + "." + monthNums[now.getMonth()] + "." + now.getYear());
</script>
//--------------------------------------------------------------
/*<spacer type=block width=20 height=4>*/
//(x % y) = x - (x / y) * y;
//(r) = a - (b * (a / b));

//var myObj = {'0':'nil', '1':'one', length:2};
//[].push.call(myObj,'two');
//document.writeln(myObj);

//[].forEach.apply("javascript",[function(char) {console.log("give me a " + char.toUpperCase())}]);

//var increment = function(char) {return String.fromCharCode(char.charCodeAt(0)+1)};
//var hiddenMammal = [].map.call('rhinocerous',increment).join(''); // "sijopdfspvt"

//"".trim.apply([" a","b "]).split(","); //["a","b"]
 
//"".toLowerCase.apply(["DIV","H1","SPAN"]).split(","); //["div","h1","span"]
 
//"".match.call(["a16","b44","b bar"],/[a-z][0-9]+/g); //["a16", "b44"]
 
//"".replace.call(['argentina','brazil','chile'], /\b./g, function(a){ return a.toUpperCase(); }).split(','); //['Argentina',"Brazil","Chile"]

/*Object.defineProperty(Object.prototype, 'values', {enumerable: false});
var competitors = [];
var results = {'Mary':'23:16', 'Ana':'21:19', 'Evelyn':'22:47'};
for (var prop in results) {
	competitors[competitors.length] = prop;
}
document.writeln(competitors); //["Mary", "Ana", "Evelyn"]*/

//console.info("%s numbers %d, %d and %d","hello",1,2,3); // hello numbers 1, 2 and 3
//console.warn("%s numbers %d, %d and %d","hello",1,2,3);
//console.error("%s numbers %d, %d and %d","hello",1,2,3);

//var foo = {baz: "tubular", goo: "rad"}, bar = "baz";
//console.log(
//     "%2$d theory is %1$s %3$s concept. I can only describe it as %s and %s",
//     "string",1,foo.goo,bar,foo.baz
//);

//console.dir(document.documentElement);
//console.dirxml(document.documentElement);

//console.group("Overlord");
//console.log("Overlord stuff");
 
//console.group("Lord");
//console.log("Overlord stuff");
 
//console.group("Minion");
//console.log("Minion stuff");
//console.groupEnd();
 
//console.groupCollapsed("Servant");
//console.log("Servant stuff");

//console.time("Execution time took");
// Some code to execute
//console.timeEnd("Execution time took");

//console.profile();
// Some code to execute
//console.profileEnd();

//var a = 1, b = "1";
//console.assert(a === b, "A doesn't equal B");

//console.dir(console)
for(var i=0, s1=s2=0; i<n; i++) {
	(i & 1 == 0) ? s1 += arr[i] : s2 += arr[i];
}
//--------------------------------------------------------------
//console.log("Here's a string", 3.14, { "alpha": 5, "bravo": false}, document.getElementById( "charlie"), new Date());
//log("Here's a string", 3.14, { "alpha": 5, "bravo": false}, document.getElementById( "charlie"), new Date());

//console.log(function() { alert( "hello"); }, ( 2+ 2=== 5), [ 1, "2", 3, 4, "5"]);
//log(function() { alert( "hello"); }, ( 2+ 2=== 5), [ 1, "2", 3, 4, "5"]);

//console.log("Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch");
//log("Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch");

/*var subsys1 = {}, subsys2 = {};
var nextIdMod = function(startId) {
    var id = startId || 0;
 
    this.next = function() {
        return id++;    
    };
 
    this.reset = function() {
        id = 0;     
    }
};
nextIdMod.call(subsys1);    
nextIdMod.call(subsys2,1000);   
window.console && console.log(
    subsys1.next(),
    subsys1.next(),
    subsys2.next(),
    subsys1.reset(),
    subsys2.next(),
    subsys1.next()
) //0, 1, 1000, undefined, 1001, 0*/

/*//library code
var protoQueryMooJo = function() {  
    //everything
}
//user code
var thirdParty = {};
protoQueryMooJo.apply(thirdParty);*/

/*
var results = ['sunil', '23:09', 'bob', '22:09', 'carlos', 'mary', '22:59'];
var badData = results.join(',').match(/[a-zA-Z]+,[a-zA-Z]+/g);
badData; //["carlos,mary"]
*/

/*
var callLater = function(fn, args, context) {
    setTimeout(function(){fn.apply(context, args)}, 2000);
}
 
callLater(alert,['hello']); 
*/

/*
//Good Example
//Create an array of functions that add 1,2 and 3 respectively 
var createAdders = function() {
    var fns = [];
    for (var i=1; i<4; i++) { 
        (function(i) {
            fns[i] = (function(n) {
                return i+n;
            });
        })(i)    
    }
    return fns;
}
 
var adders = createAdders();
adders[1](7); //8 (-:
adders[2](7); //9 (-:
adders[3](7); //10 (-:
*/

/**
 * Returns a function that takes an object, and returns the value of its 'name' property
 */
/*
var pluck = function(name) {
    return function(object) {
        return object[name];
    }
}
 
var getLength = pluck('length');
getLength("SF Giants are going to the World Series!"); //40
*/

/*
var autoCurry = (function () {
 
    var toArray = function toArray(arr, from) {
        return Array.prototype.slice.call(arr, from || 0);
    },
 
    curry = function curry(fn) { // variadic number of args
        var args = toArray(arguments, 1);
        return function curried() {
            return fn.apply(this, args.concat(toArray(arguments)));
        };
    };
 
    return function autoCurry(fn, numArgs) {
        numArgs = numArgs || fn.length;
        return function autoCurried() {
            if (arguments.length < numArgs) {
                return (numArgs-arguments.length > 0) ?
                    autoCurry(curry.apply(this, [fn].concat(toArray(arguments))), numArgs - arguments.length) :
                    curry.apply(this, [fn].concat(toArray(arguments)));
            } else {
                return fn.apply(this, arguments);
            }
        };
    };
 
}());

var foo = function(a, b) {
	return a + b;
};
var auto = autoCurry(foo, 3);
document.writeln(auto(2, 2));

*/

/*
"(penalty)Lampard, Frank(1-0)".match(/\b([\w]+),\s?([\w]+)/g);
 
RegExp.leftContext //"(penalty)"
RegExp.rightContext //"(1-0)"
RegExp.$1 //"Lampard"
RegExp.$2 //"Frank"
*/

/*
var a = /\b[a-z]{10,}\b/i; //match long alpha-only word
RegExp.input=document.body.innerHTML;
a.test(); //true (on google.com)
*/

/*
Here’s a method to return the first n cards from the “pack”, such that their total value does not exceed 21. Notice we define an optional group 2 to match the numeric value of cards with non numeric names (e.g King)

var expr = /\b([^@\(]+)\(?(\d*)\)?@([^\s]+)\s?/g
<pre>var theString = '3@Clubs King(10)@Hearts 3@Spades 5@Diamonds 7@Clubs 2@Hearts 9@Spades Jack(10)@Clubs 4@Diamonds 9@Hearts';
var result = [], total=0, matching = true;
 
while(true) {
    var matching = expr.exec(theString);
    var value = parseInt(RegExp.$2 ? RegExp.$2 : RegExp.$1);
    if (!matching || (total += value)>21) {
        break;
    }
    alert('&' + RegExp.$1);
    result.push(RegExp.$1 + " of " + RegExp.$3);
}
 
result; //["3 of Clubs", "King of Hearts", "3 of Spades", "5 of Diamonds"]
*/

/*
var a = "Smith, Bob; Raman, Ravi; Jones, Mary";
a.replace(/([\w]+), ([\w]+)/g,"$2 $1"); //"Bob Smith; Ravi Raman; Mary Jones"
 
var a  = "California, San Francisco, O'Rourke, Gerry";
a.replace(/([\w'\s]+), ([\w'\s]+), ([\w'\s]+), ([\w'\s]+)/,"$4 $3 lives in $2, $1"); //"Gerry O'Rourke lives in San Francisco, California"
*/

/*
var chars = "72 101 108 108 111  87 111 114 108 100 33";
chars.replace(/(\d+)(\s?)/gi,function(all,$1){return String.fromCharCode($1)}); //"Hello World!"
*/

/*
var unCube = Math.pow.partial(___,1/3);
unCube(27); //3
unCube(15); //2.46621207433047

var later = timeOut.partial(___,1000);
later(alert.curry("here I am!"));//... ... "here I am!"

parseInt("035"); //29 ( literals starting with 0 assumed to be base 8 )
var toInt = parseInt.partial(___,10); //specifies base 10
toInt("035"); //35

var incrementAll = jQuery.map.partial(___,function(x) {return x+1});
incrementAll([0,2,4,6,8]); //[1,3,5,7,9];

var a = [1,2,3,4];
var b = [5,6,7,8];
//regular push adds all supplied arguments...
Array.prototype.push.apply(a,b); //a = [1,2,3,4,5,6,7,8];
//using partial we can create a pushFirst that will ignore surplus args....
var pushFirst = Array.prototype.push.partial(___);
pushFirst.apply(a,b); //a = [1,2,3,4,5]
*/

/*
//use curry  to make a slice(0,x) function, then use compose to wrap it around  search.
var sliceToRegEx =  String.prototype.slice.curry(0).compose(String.prototype.search);
 
//now curry with a regEx that returns first non alpha character
var parseAlpha = sliceToRegEx.curry(/[^ a-zA-Z]/);
parseAlpha.call("Pork Bellies #45678"); //Pork Bellies
*/

/*
var  queryString =  String.prototype.substring.compose(String.prototype.indexOf).curry('?');
queryString.call("http://www.wunderground.com?query=94101&amp;weekday=Tuesday");  //?query=94101&amp;weekday=Tuesday
*/

/*
var longestSequence = function(compareFunc, myEnum) {
    var result = {member:null, count:0};
    var thisCount = 1;
    for (var i=1; i&lt;myEnum.length; ++i) {
        if ((myEnum[i]!==" ") &amp;&amp; compareFunc(myEnum[i-1], myEnum[i])) {
            if (++thisCount &gt;= result.count) {
                result = {member: myEnum[i], count: thisCount};
            }
        } else {
            thisCount = 1;
        }
    }
    return result.member + " (" + result.count + ")";
};

longestSequence(function(a,b){return  a==b}, 'skiing'); //i (2)

var longestEqualRun = longestSequence.curry(function(a,b){return a==b});
longestEqualRun([1,1,2,2,2,2,3,3]); //2 (4)

var  mostFrequent = longestEqualRun.compose(function(myEnum){return myEnum.split('').sort()});
mostFrequent("The quick brown fox jumps over the lazy dog"); //o  (4)

function getInnerText(elem) {
    return elem.innerText || elem.textContent;    
};
var  mostFrequentInPage = mostFrequent.compose(function() {return getInnerText(document.body)});
mostFrequentInPage(); //e (263)
*/

/*
var System = function() {};
System.prototype.download = function(file) {
    this.download = function() {
         alert("still downloading");
    };
   requestDownload(file, {
        callback: function() {
            delete this.download;
        }
    });
};

System.prototype.download();
System.prototype.download();
*/

/*
system.shutdown = function() {
    system.shutdown = function() {
        alert("don't worry - we're already processing your shutdown request");
    };
    lengthyShutdownProcess();
}
 
system.shutdown();
system.shutdown(); //"don't worry - we're already processing your shutdown request"

*/

/*
var URL = function(protocol, domain, queryParams) {
    this.protocol = protocol;
    this.domain = domain;
    this.queryParams = queryParams || {};
}
 
URL.prototype.paramsToString = function() {
    var stringArray = [];
    for (var prop in this.queryParams) {
        stringArray.push(this.printParam(prop));
    }
    delete this.printParam;//reset so prototype version used on first pass of next call
    return stringArray.join('');
}
 
URL.prototype.addParam = function(name,value) {
    this.queryParams[name] = value;
}
 
URL.prototype.printParam = function(param) {
    var queryParams = this.queryParams;
    var printAssignment = function(delimiter, prop) {
        return escape(delimiter + prop + "=" + queryParams[prop]);
    }
    this.printParam = printAssignment.curry('&amp;'); //define new function on instance that will be used on next pass
   return printAssignment.curry('?')(param); //used on this pass only
}
 
URL.prototype.toString = function() {
    return this.protocol + "://" +
    this.domain + this.paramsToString();
}
 
var googleURL = new URL('http','news.google.com',{q:'earthquake','geo':'California'});
googleURL.toString(); //"http://news.google.com?q=earthquake&geo=California"</span>
 
googleURL.addParam('as_nsrc','New York Times');
googleURL.toString(); //"http://news.google.com?q=earthquake&amp;geo=California&as_nsrc=New%20York%20Times"</span>
*/

/*
var formatElement(elem, instructions) {
    for (var i=0; i&lt;instructions.length; i++) {
        instructions[i](elem);
    }
}
 
var formatCorrectAnswer  = [
    function(elem) {elem.innerHTML="you are right!"}
    function(elem) {elem.className="correct"},
    function(elem) {Effect.Scale(elem,400)},
    function(elem) {Effect.Pulsate(elem, {pulses: 5, duration: 1.5 })
];
 
var formatIncorrectAnswer  = [
    function(elem) {elem.innerHTML="try again"}
    function(elem) {elem.className="incorrect"},
    function(elem) {Effect.Scale(elem,200)},
    function(elem) {Effect.Shake(elem, {pulses: 2, duration: 1.5 })
];
 
formatElement(myElement, answer.correct ? formatCorrectAnswer : formatIncorrectAnswer);
*/

/*
var whatToBring;
switch(weather) {
    case "Sunny":
        whatToBring = "Sunscreen and hat";
        break;
    case "Rain":
        whatToBring  ="Umbrella and boots"
        break;
    case "Cold":
        whatToBring = "Scarf and Gloves";
        break;
    default : whatToBring = "Play it by ear";
}

var whatToBring = {
    "Sunny" : "Sunscreen and hat",
    "Rain" : "Umbrella and boots",
    "Cold" : "Scarf and Gloves",
    "Default" : "Play it by ear"
}
 
var gear = whatToBring[weather] || whatToBring["Default"];
*/

/*
var counter = {
        count: 0,
        inc: function () {
            this.count++;
        }
    }

    callIt(counter.inc.bind(counter));

    // It worked!
    console.log(counter.count); // 1
*/

/*
    loop: function () {
        'use strict';
        this.friends.forEach(function (friend) {
            console.log(this.name+' knows '+friend);
        }.bind(this));
    }
	
	loop: function () {
        'use strict';
        this.friends.forEach(function (friend) {
            console.log(this.name+' knows '+friend);
        }, this);
    }
*/

/*
function raffle(rowSize, colSize) {
    return {
		row: Math.floor(Math.random() * rowSize),
        colDir: (Math.random() < 0.5 ? 'left' : 'right'),
        column: Math.floor(Math.random() * colSize)
    }
};
*/

/*
function computeMaxCallStackSize() {
	try {
		return 1 + computeMaxCallStackSize();
    } catch (e) {
        // Call stack overflow
		return 1;
    }
};
document.writeln(computeMaxCallStackSize());
*/

/*
<style>
input:checked + label { color: green; }
</style>
<input id="check1" type="checkbox">
<label for="check1">Some option</label>
*/

/*
[1, 2, 3, 4, 5].reduce(function (x, y) { return x + y }, 100);  // 115

entries = Array.apply(0, Array(entries.length)).reduce(function (r) {
  return r.concat(entries.splice(
    entries.reduce(function (longest, e, i) {
      return e.length >= longest.e.length ?  { i: i, e: e } : longest;
    }, { e: '' }).i, 1
  ));
}, []);

function findLongest(entries) {
	return entries.reduce(function (longest, entry, index) {
		return entry.length > longest.value.length ? { index: index, value: entry } : longest;
	}, { index: -1, value: '' });
};
document.writeln(findLongest(['fsd', 'sa', 'sadfdafsafds', 'werwe']).value);
*/

/*
var obj = {
	valueOf: function() {
		console.log("valueOf");
		return {};
	},
	toString: function() {
		console.log("toString");
		return 123;
	}
};

//3 + obj;
//'3' + obj;

function f(pos) {
	console.log("f" + pos);
	return {
		valueOf: function() {
			console.log("valueOf" + pos);
			return {};
		},
		toString: function() {
			console.log("toString" + pos);
			return "result";
		}
	};
};
Object.defineProperty(this, 'x', {
	//writable: true,
	//configurable: true,
	//enumerable: true,
	//value: '',
	set: function(x) {
		console.log("set: " + x);
		this.value = x;
	},
	get: function() {
		return this.value;
	}
});

x = f(1) + f(2);
alert(x);
*/

/*
function StringBuilder() {
	this.data = "";
};

StringBuilder.prototype.valueOf = function() {
	console.log("valueOf");
	StringBuilder.current = this;
};

StringBuilder.prototype.toString = function() {
	console.log("toString");
	return this.data;
};

function addd(value) {
	return {
		valueOf: function() {
			console.log("internal valueOf");
			StringBuilder.current.data += value;
		}
	};
};

//var sb = new StringBuilder();
//sb << addd('abc') << addd('def');
//console.log(sb.toString());
*/

/*
 function extend(target, source) {
        Object.getOwnPropertyNames(source)
        .forEach(function(propName) {
            Object.defineProperty(target, propName,
                Object.getOwnPropertyDescriptor(source, propName));
        });
        return target;
    };
	function inherits(SubC, SuperC) {
        var subProto = Object.create(SuperC.prototype);
        // At the very least, we keep the "constructor" property
        // At most, we keep additions that have already been made
        extend(subProto, SubC.prototype);
		SubC._super = SuperC.prototype;
        SubC.prototype = subProto;
    };
	
	function ColorPoint(x, y, color) {
        ColorPoint._super.constructor.call(this, x, y);
        this.color = color;
    }
    ColorPoint.prototype.toString = function() {
        return this.color + " " + ColorPoint._super.toString.call(this);
    };
    inherits(ColorPoint, Point);
*/

/*
function Point(x, y) {
	this.x = x;
	this.y = y;
};
Point.operands = [];
Point.prototype.dist = function () {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
};
Point.prototype.toString = function () {
	console.log("toString");
	return "("+ this.x+ ", "+ this.y +")";
};
Point.prototype.valueOf = function() {
	console.log("valueOf");
	Point.operands.push(this);
	return 3;
};
Point.prototype.mult = function() {
	for(var i=0; i<arguments.length; i++) {
		this.x *= arguments[i].x;
		this.y *= arguments[i].y;
	}
	return this;
};
Point.prototype.div = function() {
	for(var i=0; i<arguments.length; i++) {
		this.x /= arguments[i].x;
		this.y /= arguments[i].y;
	}
	return this;
};
Point.prototype.add = function() {
	for(var i=0; i<arguments.length; i++) {
		this.x += arguments[i].x;
		this.y += arguments[i].y;
	}
	return this;
};
Point.prototype.substract = function() {
	for(var i=0; i<arguments.length; i++) {
		this.x -= arguments[i].x;
		this.y -= arguments[i].y;
	}
	return this;
};
Object.defineProperty(Point.prototype, "_", {
	set: function(value) {
		var ops = Point.operands, operator;
		if(ops.length >= 2 && (value === 3 * ops.length)) {
			operator = this.add;
		} else if(ops.length === 2 && value === 0) {
			operator = this.substract;
		} //else
		Point.operands = []; //reset
		return operator.apply(this, ops);
	}
});
var p = new Point(2, 2);
p._ = new Point(1, 2) + new Point(3, 4) + new Point(5, 6);
console.log(p.toString());
//p._ = new Point(1, 2) * new Point(3, 4) * new Point(5, 6);
//console.log(p.toString());
*/

/*
function stringRepeat(str, num) {
	num = Number(num);
	var result = '';
	while (true) {
		if (num & 1) { // (1)
			result += str;
		}
		num >>>= 1; // (2)
		if (num <= 0) break;
		str += str;
	}
	return result;
};
*/

/*
function newOperator(Constr, args) {
	var thisValue = Object.create(Constr.prototype); // (1)
	var result = Constr.apply(thisValue, args);
	if (typeof result === 'object' && result !== null) {
		return result; // (2)
	}
	return thisValue;
};
*/

/*
(function () { 'use strict'; 'abc'.length = 1 }());
*/

/*
function fillArrayWithNumbers(n) {
	var arr = Array.apply(null, Array(n));
	return arr.map(function (x, i) { return i });
};
fillArrayWithNumbers(5);
*/

/*
Number.isSafeInteger = function(n) {
	return (typeof n === 'number' && Math.round(n) === n && Number.MIN_SAFE_INTEGER <= n && n <= Number.MAX_SAFE_INTEGER);
};
*/

/*
function toUTF16(codePoint) {
	var TEN_BITS = parseInt('1111111111', 2);
	function u(codeUnit) {
		return '\\u'+codeUnit.toString(16).toUpperCase();
	}
	if (codePoint <= 0xFFFF) {
		return u(codePoint);
	}
	codePoint -= 0x10000;
	// Shift right to get to most significant 10 bits
	var leadSurrogate = 0xD800 + (codePoint >> 10);
	// Mask to get least significant 10 bits
	var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);
	return u(leadSurrogate) + u(tailSurrogate);
};
*/
/*
function Names(data) {
        if (data) this.data = data;
    }
    Names.prototype = {
        constructor: Names,
        get function() {
            // Define, don’t assign [3]
            // => ensures an own property is created
            Object.defineProperty(this, 'data', {
                value: this.data,
                enumerable: true
                // Default – configurable: false, writable: false
                // Set to true if property’s value must be changeable
            });
            //return this.data;
        }
    };


var a = new Names('a');
alert(a.data);
*/

/*
// New objects are extensible.
var empty = {};
console.assert(Object.isExtensible(empty) === true);

// ...but that can be changed.
Object.preventExtensions(empty);
console.assert(Object.isExtensible(empty) === false);

// Sealed objects are by definition non-extensible.
var sealed = Object.seal({});
console.assert(Object.isExtensible(sealed) === false);

// Frozen objects are also by definition non-extensible.
var frozen = Object.freeze({});
console.assert(Object.isExtensible(frozen) === false);

Object.getOwnPropertyDescriptor(obj, 'foo');
Object.isSealed(obj);
Object.isFrozen(point)
*/

/*
var arr = [2, 4, 5, 6];
var p = arr.every(function (x) { return (typeof x === 'number'); });
alert(p);

var arr = [2, 4, 5, 6];
var p = arr.some(function (x) { return (typeof x === 'number'); });
alert(p);
*/

/*
function Point(x, y) {
        this.x = x;
        this.y = y;
        this.maybeFreeze(Point);
    }
    function ColorPoint(x, y, color) {
        Point.call(this, x, y);
        this.color = color;
        this.maybeFreeze(ColorPoint);
    }
Point.prototype.maybeFreeze = function (constr) {
        if (Object.getPrototypeOf(this) === constr.prototype) {
            Object.freeze(this);
        }
    };
*/

/*
https://developer.mozilla.org/en-US/docs/Web/Reference/Events
Constructor(DOMString type, optional EventInit eventInitDict);
dictionary EventInit {
	boolean bubbles;
	boolean cancelable;
};

var elem = document.getElementById('myForm');
var event = new Event('submit');  // (*)
elem.dispatchEvent(event);
*/

/*
Array.prototype.forEach.call(
        document.getElementsByClassName('columnClick'),
        function (elem, col) {  // (*)
            elem.addEventListener('click', function () {
                currentState.columnClick(col);
                event.preventDefault();
            });
        });
*/

/*
if (x === void 0)  // always safe
function getClass(x) {
        var str = Object.prototype.toString.call(x);
        return /^\[object (.*)\]$/.exec(str)[1];
    }
*/


/*
var obj = {
        __proto__: {
            get foo() {
                return 1;
            },
            set foo(x) {
                console.log("Setter called: "+x);
            }
        }
    };
	
	var obj = {
        __proto__: {
            get foo() {
                return 1;
            }
        }
    };
	
	var proto = Object.defineProperty({},
        "foo",
        {
            value: 1,
            writable: false
        });
    var obj = { __proto__: proto };
*/
/*
var uvOptions = {};
(function() {
  var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
  uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/YOURSPECIALKEY.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
})();
*/

















