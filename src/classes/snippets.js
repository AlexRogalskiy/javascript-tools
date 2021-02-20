var Class = function(parent) {
	var klass = function() {
		this.init.apply(this, arguments);
	};
	if(parent) {
		var subClass = function() {};
		subClass.prototype = parent.prototype;
		klass.prototype = new subClass;
	};
	// Constructor
	klass.prototype.init = function() {};
	
	//Proxy function
	klass.proxy = function(func) {
		var self = this;
		return (function() {
			return func.apply(self, arguments);
		});
	};
	
	//Properties /class/
	klass.extend = function(obj) {
		var extended = obj.extended;
		for(var i in obj) {
			klass[i] = obj[i];
		}
		if(extended) extended(klass);
	};
	//Properties /instance/
	klass.include = function(obj) {
		var included = obj.included;
		for(var i in obj) {
			klass.fn[i] = obj[i];
		}
		if(included) included(klass);
	};
	
	//Abbreviations
	klass.fn = klass.prototype;
	klass.fn.proxy = klass.proxy;
	klass.fn.parent = klass;
	klass._super = klass.__proto__;
	
	return klass;
};
//-----------------------------------------------
function checkDate(month, day, year){
      
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
      
    switch (month) {
        case 4:
        case 6:
        case 9:
        case 11:
            if (day > 30) return false;
            break;
        case 2:
            if (year % 4) {
                if (day > 28) return false;
            } else {
                if (day > 29) return false;
            }
            break;
    }
      
    return true;
};
//bool isPowerOfTwo = x && !(x & (x - 1));
//-----------------------------------------------
var Animal = new Class;
Animal.find = function() {};
var animal = Animal.find(1);
Animal.include({
	breath: function() {
		console.log('breath');
	}
});
var Cat = new Class(Animal);
var tommy = new Cat;
tommy.breath();
//-----------------------------------------------
//var Controller = {};
//(Controller.users = function($) {
//	var nameClick = function() {};
//	$(function() {
//		$("#view .name").click(nameClick);
//	});
//})(jQuery);
//-----------------------------------------------
// Shimming
if(!Function.prototype.bind) {
	Function.prototype.bind = function(obj) {
		var slice = [].slice, args = slice.call(arguments, 1), self = this, nop = function() {};
		var bound = function() {
			return self.apply((this instanceof nop ? this : (obj || {})), args.concat(slice.call(arguments)));
		};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
	};
};
//-----------------------------------------------
var Person = function() {};
(function() {
	var findById = function(id) {/**/};
	Person.find = function(id) {
		if(typeof id == 'integer') {
			return findById(id);
		}
	};
})();
//----------------------------------------------
var addEventHandler = function(that) {
	//var that = {};
	that.subscribe = function(event, callback) {
		var calls = this._callbacks || (this._callbacks = {});
		(this._callbacks[event] || (this._callbacks[event] = [])).push(callback);
		return this;
	};
	that.unsubscribe = function(event) {
		var calls = this._callbacks || (this._callbacks = {});
		if(this._callbacks[event]) {
			delete this._callbacks[event];
		}
		return this;
	};
	that.unsubscribe = function(event, callback) {
		var calls = this._callbacks || (this._callbacks = {});
		if(this._callbacks[event]) {
			if(isArray(this._callbacks[event])) {
				for(var i=0; i<this._callbacks[event].length; i++) {
					if(this._callbacks[event][i] === callback) {
						this._callbacks[event].splice(i, 1);
					}
				}
			} else {
				delete this._callbacks[event];
			}
		}
		return this;
	};
	that.publish = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var event = args.shift();
		var list, calls;
		if(!(calls = this._callbacks)) return this;
		if(!(list = this._callbacks[event])) return this;
		for(var i=0, l = list.length; i<l; i++) {
			list[i].apply(this, args);
		}
		return this;
	};
	//return that;
};
var obj = {};
addEventHandler(obj);
obj.subscribe("user:create", function() {
	alert("Wem!");
});
obj.publish("user:create");
//----------------------------------------------
if(typeof Object.create !== 'function') {
	Object.create = function(o) {
		function F() {};
		F.prototype = o;
		return new F();
	};
};
//----------------------------------------------
var Model = {
	inherited: function() {},
	created: function() {},
	prototype: {
		init: function() {}
	},
	create: function() {
		var object = Object.create(this);
		object.parent = this;
		object.prototype = object.fn = Object.create(this.prototype);
		object.created();
//		this.inherited(object);
		return object;
	},
	init: function() {
		var instance = Object.create(this.prototype);
		instance.parent = this;
		instance.init.apply(instance, arguments);
		return instance;
	},
	extend: function(obj) {
		var extended = obj.extended;
		for(var i in obj) {
			this[i] = obj[i];
		}
		if(extended) extended(this);
	},
	include: function(obj) {
		var included = obj.included;
		for(var i in obj) {
			this.prototype[i] = obj[i];
		}
		if(included) included(this);
	}
};
Model.extend({
	find: function() {}
});
Model.include({
	init: function(atts) {
		if(atts) {
			this.load(atts);
		}
	},
	load: function(attributes) {
		for(var name in attributes) {
			this[name] = attributes[name];
		}
	}
});
//var User = Model.create();
//var user = User.init();
var Asset = Model.create();
var asset1 = Asset.init({name: 'foo.png', id: 1});
//asset1.save();
//asset1.destroy();
var asset2 = Asset.init({name: 'but different', ext: '.txt', id: 2});
//asset2.save();
//asset2.destroy();
//asset2.attributes();
//
Model.records = {};
Model.include({
	newRecord: true,
	create: function() {
		if(!this.id) this.id = Math.guid();
		this.newRecord = false;
		this.parent.records[this.id] = this.dup();
	},
	destroy: function() {
		delete this.parent.records[this.id];
	},
	update: function() {
		this.parent.records[this.id] = this.dup();
	},
	save: function() {
		this.newRecord ? this.create() : this.update();
	},
	dup: function() {
		return clone(this);//jQuery.extend(true, {}, oldObject);
	},
	attributes: function() {
		var result = {};
		for(var i in this.parent.attributes) {
			var attr = this.parent.attributes[i];
			result[attr] = this[attr];
		}
		result.id = this.id;
		return result;
	},
	toJSON: function() {
		return (this.attributes());
	},
	createRemote: function(url, callback) {
		$.post(url, this.attributes(), callback);
	},
	updateRemote: function(url, callback) {
		$.ajax({
			url: url,
			data: this.attributes(),
			success: callback,
			type: "PUT"
		});
	}
});
Model.extend({
	find: function(id) {
		var record = this.records[id];
		if(!record) throw("Unknown entry");
		return record.dup();
		//return this.records[id] || throw("Unknown record");
	},
	created: function() {
		this.records = {};
		this.attributes = [];
	},
	populate: function(values) {
		this.records = {};
		for(var i=0, il = values.length; i<il; i++) {
			var record = this.init(values[i]);
			record.newRecord = false;
			this.records[record.id] = record;
		}
	}
});
Asset.attributes = ["name", "ext"];
var json = JSON.stringify(Asset.records);
Asset.init({name: "jason.txt"}).createRemote("/assets");
//--------------------------------------------------------------
jQuery.getJSON("/assets", function(result) {
	Asset.populate(result);
});
//--------------------------------------------------------------
Model.LocalStorage = {
	saveLocal: function(name) {
		var result = [];
		for(var i in this.records) {
			result.push(this.records[i]);
		}
		localStorage[name] = JSON.stingify(result);
	},
	loadLocal: function(name) {
		var result = JSON.parse(localStorage[name]);
		this.populate(result);
	}
};
Asset.extend(Model.LocalStorage);
//--------------------------------------------------------------
(function($, exports) {
	var mod = {};
	mod.create = function(includes) {
		var result = function() {
			this.init.apply(this, arguments);
		};
		result.fn = result.prototype;
		result.fn.init = function() {};
		result.proxy = function(func) {
			return $.proxy(func, this);
		};
		result.fn.proxy = result.proxy;
		result.include = function(obj) {
			$.extend(this.fn, obj);
		};
		result.include = function(obj) {
			$.extend(this, obj);
		};
		if(includes) {
			result.include(includes);
		}
		return result;
	};
	exports.Controller = mod;
})(jQuery, window);
(function($, Controller) {
	var mod = new Controller;
	mod.toogleClass = function(event) {
		this.view.toogleClass("over", event.data);
	};
	mod.load(function() {
		this.view = $("#view");
		this.view.mouseover(this.proxy(this.toggleClass), true);
		this.view.mouseout(this.proxy(this.toggleClass), false);
	});
})(jQuery, Controller);
Controller.fn.unload = function(func) {
	jQuery(window).bind('unload', this.proxy(func));
};
var mod = new Controller;
mod.include(StateMachine);
jQuery(function($) {
	var SearchView = Controller.create({
		elements: {
			"input[type=search]": "searchInput",
			"form": "searchForm"
		},
		events: {
			"submit form" : "search"
		},
		init: function(element) {
			this.el = $(element);
			this.refreshElements();
			this.delegateEvents();
			this.searchForm.submit(this.proxy(this.search));
			//this.view.mouseover(this.proxy(this.toggleClass), true);
			//this.view.mouseout(this.proxy(this.toggleClass), false);
		},
		search: function() {
			console.log("Searching: ", this.searchInput.val());
			return false;
		},
		$: function(selector) {
			return $(selector, this.el);
		},
		eventSplitter: /^(\w+)\s*(.*)$/,
		delegateEvents: function() {
			for(var key in this.events) {
				var methodName = this.events[key];
				var method = this.proxy(this[methodname]);
				var match = key.match(this.eventSplitter);
				var eventName = match[1], selector = match[2];
				if(selector === '') {
					this.el.bind(eventName, method);
				} else {
					this.el.delegate(selector, eventName, method);
				}
			}
		},
		refreshElements: function() {
			for(var key in this.elements) {
				this[this.elements[key]] = this.$(key);
			}
		},
		//this.toogleClass: function(event) {
		//	this.view.toogleClass("over", event.data);
		//}
	});
	new SearchView({el: "#users"});
});
//--------------------------------------------------------------
//Checking a bit
//bit = number & (1 << x);
//Toggling a bit
//number ^= 1 << x;
//Clearing a bit
//number &= ~(1 << x);
//Setting a bit
//number |= 1 << x;
//--------------------------------------------------------------
//a = a.map(function(item) { return item == 3452 ? 1010 : item; });
//a.forEach(function(item, i) { if (item == 3452) a[i] = 1010; });
//--------------------------------------------------------------
function censor(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}
function transparentWrapping(f)	{
	return	function()	{
		return	f.apply(null,	arguments);
	};
};

	//try {
//	var transformed = JSON.parse('{"p": 5}',
// 		function(k, v) { if (k === "") return v; return v * 2; });
//	// transformed is { p: 10 }
//} catch (e) {
//		console.error("Parsing error:", e); 
//}
//var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
//var jsonString = JSON.stringify(foo, censor);
//--------------------------------------------------------------




