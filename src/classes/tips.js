var arrowGreeting = (message, name) => message + name;

var deliveryBoy = {
	name: "",
	handleMessage: function(message, handler) {
		handler(message);
	};
	receive: function(message) {
		var that = this;
		this.handleMessage(message, function(message) {
			console.log(message + that.name);
		});
		//this.handleMessage("Hello, ", (message) => {
		//	console.log(message + this.name);
		//});
	}
};
deliveryBoy.receive('Hello');

let firstName = '1';
let lastName = '2';
let person = {firstName, lastName};
console.log(person);

var car = {
	color,
	speed,
	go() {
		console.log('vroom');
	}
	["go"]: function() {
		console.log('vroom');
	}
};

var greeting = `${salutation}, world`;
var greeting = `${x} + ${y} = ${x + y}`;
var greeting = `It's ${new Date().getHours()} I'm sleepy`;

function tag(strings, ...values) {
	console.log(strings);
	console.log(values);
}
var message = tag`It's ${new Date().getHours()} I'm sleepy`;

function tag(strings, ...values) {
	if(values[0] < 20) {
		values[1] = "awake";
	}
	return `${strings[0]}${values[0]}${strings[1]}${values[1]}`;
}
var message = tag`It's ${new Date().getHours()} I'm ${''}`;


export function (){};
export{sumTwo};

import {sumTwo as addTwo} from 'math/addition';
import * as addition from 'math/addition';
console.log("2 + 3", addition.addTwo(2, 3));

import * as _ from 'lodash';
console.log(_.where(users, {age: 36}));

const products = Array.from(document.querySelectorAll('.products'));
products.filter(product => parseFloat(product.innerHMTL))
		.foreach(product => product.style.color = 'red');
console.log(products);


var d = new Promise((resolve, reject) => {
	setTimeOut(() => {
		if(true) {
			resolve('');
		} else {
			reject('');
		}
	}, 2000);
});
d.then((data) => console.log('success', data), (error) => {console.log('')});
d.catch((error) => console.log('error: ', error));

d.then((data) => {
	console.log('success: ', data);
	throw new Error('');
	return 'foo bar';
}).then((data) => console.log('success 2:', data))
.catch((error) => console.log('error: ', error));

function* greet() {
	console.log(`You called 'next()'`);
	yield "hello";
}
let greeter = greet();
console.log(greeter);
let next = greeter.next();
console.log(next);
let done = greeter.next();
console.log(done);

var greeter = greet();
for(let word of greeter) {
	console.log(word);
};

function* greet() {
	let friendly = yield "How";
	console.log(friendly);
	yield "hello";
}
var greeter = greet();
console.log(greeter.next().value);
console.log(greeter.next(" the heck ").value);
console.log(greeter.next().value);

function* greet() {
	let friendly = yield "How";
	friendly = yield friendly + "are";
	yield friendly + "you?";
}
var greeter = greet();
console.log(greeter.next().value);
console.log(greeter.next(" the heck ").value);
console.log(greeter.next(" silly ol' ").value);

function* graph() {
	let x = 0;
	let y = 0;
	while(true) {
		yield {x: x, y: y};
		x += 2;
		y += 1;
	}
};
var graphGenerator = graph();
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);
console.log(graphGenerator.next().value);


for(var key of myMap.keys()) {
	console.log(key);
}
for(var [key, value] of myMap.entries()) {
	console.log(key + ' = ' + value);
}


var data = [15, 3, 20];
var reducer = function(accumulator, item) {
	return accumulator + item;
};
var initialValue = 0;
var total = data.reduce(reducer, initialValue);
console.log("The sum is", total);

var data = ['angular', 'ember', 'react', 'vanilla'];
var reducer = function(tally, vote) {
	if(!tally[vote]) {
		tally[vote] = 1;
	} else {
		tally[vote] = tally[vote] + 1;
	}
};
var initialValue = {};
var total = data.reduce(reducer, initialValue);
console.log(total);

var data = [15, 3, 20];
var initialValue = 0;
var total = data.reduce(function(acc, value) {
	acc.push(value * 2);
	return acc;
}, []);
console.log(total);
var total = data.map(function(item) {
	return item * 2;
});
var total = data.filter(function(item) {
	return (item%2 === 0);
});

console.time('bigData');
console.timeEnd('bidgData');
console.log(JSON.stringify(symbols));

var Observable = Rx.Observable;
var clicks = Observable.fromEvent(button, 'click');
var subscription = clicks.forEach(function onNext(e) {
	alert('');
	subscription.dispose();
}, function onError(error) {
	console.log('error');
}, function onCompleted() {
	console.log('done');
});

console.log(str.replace(regex, str => 'XXX${str}XXX'));

const output = (str, regex, target) => {
	target.innerHTML = str.replace(regex, str => `<span>${str}</span>`);
};
output(str, /is/gi, document.querySelector('pre'));


var filtered = lessons.filter(x => x.tags.indexOf(searchItem) > -1).
						.filter(x => x.views > minViews)
						.sort((a, b) = > b.views - a.views)
						.map(x => `<li>${x.title}</li>`)
						.join('\n')
console.log(`<ul>${filtered}</ul>`);


const input = document.querySelector('#input');
const button = document.querySelector('#button');
const list = document.querySelector('#list');

const pets = [];

button.addEventListener("click", function(evt) {
	if(input.value.length > 0) {
		pets.push(input.value);
		input.value = "";
		render();
	}
});

function render() {
	list.innerHMTL = pets.map(x => `<li>${x}</li>`).join('');
};

function bbtagit(text) {
  text = text.replace(/\[u\]([\s\S]*)\[\/u\]/gim, '<u>$1</u>'); ///\[u\](.*?)\[\/u\]/gim

  return text
}

var line = "[u]мой\n текст[/u]"
alert(bbtagit(line))


var text = '1 <A href="#">...</A> 2'
text = text.replace(/<A([^>]*)>/, 'TEST'); ///<A(.*)>/
alert(text)

var text = ' [b]a [u]b[/u] c [/b] ';

var reg = /\[([bus])\](.*?)\[\/\1\] /;
text = text.replace(reg, '<$1>$2</$1>');  // <b>a [u]b[/u] c </b>
alert(text);

alert("2 ++ 1".replace(/\+/g, "*"))

var str = "count 36 - 26, 18 - 9"
str = str.replace(/(\d+) - (\d+)/g, function(a,b,c) { return b-c })
alert(str)

var str = "count 36-26, 18-9";
var re = /(\d+)-(\d+)/g;
var result = str.match(re);
for (var i = 0; i < result.length; i++) {
  alert(result[i]);
}

var str = "count 36-26, 18-9"
var re = /(\d+)-(\d+)/g
var res
while ((res = re.exec(str)) != null) {
  alert("Найдено " + res[0] + ":  (" + res[1] + ") и (" + res[2] + ")")
  alert("Дальше ищу с позиции " + re.lastIndex)
}
























