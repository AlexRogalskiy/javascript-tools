;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	//const addThenMult = pipeline(plus1, mult2);
	//addThenMult(5);
	const pipeline = (...funcs) => val => funcs.reduce((a, b) => b(a), val);
//----------------------------------------------------------------------------------------------
	//	Tasks.actions.push(function() {}, function() {}, function() {});
	// var it = Tasks[Symbol.iterator]();
	// it.next();
	const ActionManager = {
		[Symbol.iterator]() {
			const steps = this.actions.slice();
			return {
				[Symbol.iterator]() {
					return this;
				}
				next(...args) {
					if(steps.length > 0) {
						let res = steps.shift()(...args);
						return { value: res, done: false };
					} else {
						return { done: true  };
					}
				},
				return(v) {
					steps.length = 0;
					return { value: v, done: true };
				}
			};
		},
		actions: []
	};
//----------------------------------------------------------------------------------------------
	try {
		new Function('( () => {} )');
		ARROW_FUNCS_ENABLED = true;
	} catch (err) {
		ARROW_FUNCS_ENABLED = false;
	}
//----------------------------------------------------------------------------------------------
	const trampoline = (res) => {
		while(isFunction(res)) {
			res = res();
		}
		return res;
	};
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		Function.method('bind', function(that) {
			var method = this, slice = Array.prototype.slice, args = slice.apply(arguments, [1]);
			return function() {
				return method.apply(that, args.concat(slice.apply(arguments, [0])));
			};
		});	
//----------------------------------------------------------------------------------------------
		Function.method('curry', function() {
			if (arguments.length < 1) return this; //nothing to curry with - return function
			var slice = Array.prototype.slice, args = slice.apply(arguments), that = this;
			return function() {
				return that.apply(null, args.concat(slice.apply(arguments)));
			};
		});
//----------------------------------------------------------------------------------------------
		Function.method('getName', function() {
			return this.name || this.toString().match(/function\s*([^(]*)\(/)[1]; 
		});
//----------------------------------------------------------------------------------------------
		Function.method('partial', function() {
			if (arguments.length < 1) return this;
			var __method = this;
			var args = arguments;
			return function() {
				var argIndex = 0, myArgs = [];
				for (var i = 0; i < args.length; i++) {
					myArgs[i] = (null == args[i]) ? arguments[argIndex++] : args[i];
				}
				return __method.apply(this, myArgs);
			};
		});
//----------------------------------------------------------------------------------------------
		Function.method('express', function(expr) {
			if(!jsar.toolset.isString(expr)) return this; //typeof expr !== 'string'
			//minify-safe version of eval
			var evalR = function(x, expr) {
				var expr = expr.replace(/\br\b/g, "arguments[0]");
				return eval(expr);
			}; 
			var __method = this;
			return function() {
				return evalR(__method.apply(this, arguments), expr);
			}
		});
//----------------------------------------------------------------------------------------------
		Function.method('compose', function(argFunction) {
			var invokingFunction = this;
			return function() {
				return invokingFunction.call(this, argFunction.apply(this, arguments));
			}
		});
//----------------------------------------------------------------------------------------------
		/*
		* @example
		* LivingThing = { 
		*	beBorn : function(){ 
		*		this.alive = true;
		*		return 1;
		*	},
		*	a: 3
		* };
		* var mammal = {};
		* mammal.inheritsFrom(LivingThing);
		* mammal.prototype.beBorn();
		*/
		Function.method('inherits', function(parentClass){
			if (globals.toolset.isFunction(parentClass.constructor)) {
				this.prototype = new parentClass;
				this.prototype.constructor = this;
				this.prototype.parent = parentClass.prototype;
			} else { 
				this.prototype = parentClass;
				this.prototype.constructor = this;
				this.prototype.parent = parentClass;
			} 
			return this;
		});
//----------------------------------------------------------------------------------------------
		Function.method('inherits', function(parentClass){
			var depth = 0;
			var proto = this.prototype = new parentClass();
			this.method('uber', function uber(name) {
				var func, ret, v = parentClass.prototype;
				if(depth) {
					for(var i=d; i>0; i--) {
						v = v.constructor.prototype;
					}
					func = v[name];
				} else {
					func = proto[name];
					if(func == this[name]) {
						func = v[name];
					}
				}
				depth++;
				ret = func.apply(this, Array.prototype.slice.apply(arguments, [1]));
				depth--;
				return ret;
			});
			return this;
		});
//----------------------------------------------------------------------------------------------
		Function.method('swiss', function(parentClass){
			for(var i=1; i<arguments.length; i++) {
				var name = arguments[i];
				this.prototype[name] = parentClass.prototype[name];
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));

//var x = function() {
//	return this.value;
//}.bind({value: 666});
//document.writeln(x());

//var add1 = add.curry(1);
//document.writeln(add1(6));
//var add = function(a, b) {
//	return a + b;
//};

//var subtract = function(a,b) {
//    return a - b;
//};
//var subtractFrom8 = subtract.curry(8);
//document.writeln(subtractFrom8(2)); //6

//var subtract5 = subtract.partial(null, 5);
//document.writeln(subtract5(13)); //8;

//var loudly = String.prototype.toUpperCase.express('"** " + r + "!! **"');
//document.writeln(loudly.call("Can you hear me?")); //"** CAN YOU HEAR ME?!! **"
 
//var randrandomPercentage = Math.random.express('Math.round(100*r) + "%"');
//document.writeln(randomPercentage()); //23%
 
//isPerfectSquare = Math.sqrt.express('r == Math.round(r)');
//document.writeln(isPerfectSquare(25)); //true

//using express
//var roundedSqrt = Math.sqrt.express('Math.round(r)');
//document.writeln(roundedSqrt(34)); //6
//using compose
//var roundedSqrt = Math.round.compose(Math.sqrt);
//document.writeln(roundedSqrt(34)); //6

//var  alertPower = alert.compose(Math.pow);
//alertPower(9,8); //alert shows 43046721
//var  roundedSqRoot = Math.round.compose(Math.sqrt);
//document.writeln(roundedSqRoot(28)); //5