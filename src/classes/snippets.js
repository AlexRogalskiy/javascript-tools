const Class = function (parent) {
  const klass = function () {
    this.init.apply(this, arguments);
  };
  if (parent) {
    const subClass = function () {};
    subClass.prototype = parent.prototype;
    klass.prototype = new subClass();
  }
  // Constructor
  klass.prototype.init = function () {};

  //Proxy function
  klass.proxy = function (func) {
    const self = this;
    return function () {
      return func.apply(self, arguments);
    };
  };

  //Properties /class/
  klass.extend = function (obj) {
    const extended = obj.extended;
    for (const i in obj) {
      klass[i] = obj[i];
    }
    if (extended) extended(klass);
  };
  //Properties /instance/
  klass.include = function (obj) {
    const included = obj.included;
    for (const i in obj) {
      klass.fn[i] = obj[i];
    }
    if (included) included(klass);
  };

  //Abbreviations
  klass.fn = klass.prototype;
  klass.fn.proxy = klass.proxy;
  klass.fn.parent = klass;
  klass._super = klass.__proto__;

  return klass;
};
//-----------------------------------------------
function checkDate(month, day, year) {
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
}
//bool isPowerOfTwo = x && !(x & (x - 1));
//-----------------------------------------------
const Animal = new Class();
Animal.find = function () {};
const animal = Animal.find(1);
Animal.include({
  breath() {
    console.log('breath');
  },
});
const Cat = new Class(Animal);
const tommy = new Cat();
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
if (!Function.prototype.bind) {
  Function.prototype.bind = function (obj) {
    const slice = [].slice,
      args = slice.call(arguments, 1),
      self = this,
      nop = function () {};
    const bound = function () {
      return self.apply(this instanceof nop ? this : obj || {}, args.concat(slice.call(arguments)));
    };
    nop.prototype = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}
//-----------------------------------------------
const Person = function () {};
(function () {
  const findById = function (id) {
    /**/
  };
  Person.find = function (id) {
    if (typeof id == 'integer') {
      return findById(id);
    }
  };
})();
//----------------------------------------------
const addEventHandler = function (that) {
  //var that = {};
  that.subscribe = function (event, callback) {
    const calls = this._callbacks || (this._callbacks = {});
    (this._callbacks[event] || (this._callbacks[event] = [])).push(callback);
    return this;
  };
  that.unsubscribe = function (event) {
    const calls = this._callbacks || (this._callbacks = {});
    if (this._callbacks[event]) {
      delete this._callbacks[event];
    }
    return this;
  };
  that.unsubscribe = function (event, callback) {
    const calls = this._callbacks || (this._callbacks = {});
    if (this._callbacks[event]) {
      if (isArray(this._callbacks[event])) {
        for (let i = 0; i < this._callbacks[event].length; i++) {
          if (this._callbacks[event][i] === callback) {
            this._callbacks[event].splice(i, 1);
          }
        }
      } else {
        delete this._callbacks[event];
      }
    }
    return this;
  };
  that.publish = function () {
    const args = Array.prototype.slice.call(arguments, 0);
    const event = args.shift();
    let list, calls;
    if (!(calls = this._callbacks)) return this;
    if (!(list = this._callbacks[event])) return this;
    for (let i = 0, l = list.length; i < l; i++) {
      list[i].apply(this, args);
    }
    return this;
  };
  //return that;
};
const obj = {};
addEventHandler(obj);
obj.subscribe('user:create', function () {
  alert('Wem!');
});
obj.publish('user:create');
//----------------------------------------------
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
//----------------------------------------------
const Model = {
  inherited() {},
  created() {},
  prototype: {
    init() {},
  },
  create() {
    const object = Object.create(this);
    object.parent = this;
    object.prototype = object.fn = Object.create(this.prototype);
    object.created();
    //		this.inherited(object);
    return object;
  },
  init() {
    const instance = Object.create(this.prototype);
    instance.parent = this;
    instance.init.apply(instance, arguments);
    return instance;
  },
  extend(obj) {
    const extended = obj.extended;
    for (const i in obj) {
      this[i] = obj[i];
    }
    if (extended) extended(this);
  },
  include(obj) {
    const included = obj.included;
    for (const i in obj) {
      this.prototype[i] = obj[i];
    }
    if (included) included(this);
  },
};
Model.extend({
  find() {},
});
Model.include({
  init(atts) {
    if (atts) {
      this.load(atts);
    }
  },
  load(attributes) {
    for (const name in attributes) {
      this[name] = attributes[name];
    }
  },
});
//var User = Model.create();
//var user = User.init();
const Asset = Model.create();
const asset1 = Asset.init({ name: 'foo.png', id: 1 });
//asset1.save();
//asset1.destroy();
const asset2 = Asset.init({ name: 'but different', ext: '.txt', id: 2 });
//asset2.save();
//asset2.destroy();
//asset2.attributes();
//
Model.records = {};
Model.include({
  newRecord: true,
  create() {
    if (!this.id) this.id = Math.guid();
    this.newRecord = false;
    this.parent.records[this.id] = this.dup();
  },
  destroy() {
    delete this.parent.records[this.id];
  },
  update() {
    this.parent.records[this.id] = this.dup();
  },
  save() {
    this.newRecord ? this.create() : this.update();
  },
  dup() {
    return clone(this); //jQuery.extend(true, {}, oldObject);
  },
  attributes() {
    const result = {};
    for (const i in this.parent.attributes) {
      const attr = this.parent.attributes[i];
      result[attr] = this[attr];
    }
    result.id = this.id;
    return result;
  },
  toJSON() {
    return this.attributes();
  },
  createRemote(url, callback) {
    $.post(url, this.attributes(), callback);
  },
  updateRemote(url, callback) {
    $.ajax({
      url,
      data: this.attributes(),
      success: callback,
      type: 'PUT',
    });
  },
});
Model.extend({
  find(id) {
    const record = this.records[id];
    if (!record) throw 'Unknown entry';
    return record.dup();
    //return this.records[id] || throw("Unknown record");
  },
  created() {
    this.records = {};
    this.attributes = [];
  },
  populate(values) {
    this.records = {};
    for (let i = 0, il = values.length; i < il; i++) {
      const record = this.init(values[i]);
      record.newRecord = false;
      this.records[record.id] = record;
    }
  },
});
Asset.attributes = ['name', 'ext'];
const json = JSON.stringify(Asset.records);
Asset.init({ name: 'jason.txt' }).createRemote('/assets');
//--------------------------------------------------------------
jQuery.getJSON('/assets', function (result) {
  Asset.populate(result);
});
//--------------------------------------------------------------
Model.LocalStorage = {
  saveLocal(name) {
    const result = [];
    for (const i in this.records) {
      result.push(this.records[i]);
    }
    localStorage[name] = JSON.stingify(result);
  },
  loadLocal(name) {
    const result = JSON.parse(localStorage[name]);
    this.populate(result);
  },
};
Asset.extend(Model.LocalStorage);
//--------------------------------------------------------------
(function ($, exports) {
  const mod = {};
  mod.create = function (includes) {
    const result = function () {
      this.init.apply(this, arguments);
    };
    result.fn = result.prototype;
    result.fn.init = function () {};
    result.proxy = function (func) {
      return $.proxy(func, this);
    };
    result.fn.proxy = result.proxy;
    result.include = function (obj) {
      $.extend(this.fn, obj);
    };
    result.include = function (obj) {
      $.extend(this, obj);
    };
    if (includes) {
      result.include(includes);
    }
    return result;
  };
  exports.Controller = mod;
})(jQuery, window);
(function ($, Controller) {
  const mod = new Controller();
  mod.toogleClass = function (event) {
    this.view.toogleClass('over', event.data);
  };
  mod.load(function () {
    this.view = $('#view');
    this.view.mouseover(this.proxy(this.toggleClass), true);
    this.view.mouseout(this.proxy(this.toggleClass), false);
  });
})(jQuery, Controller);
Controller.fn.unload = function (func) {
  jQuery(window).bind('unload', this.proxy(func));
};
const mod = new Controller();
mod.include(StateMachine);
jQuery(function ($) {
  const SearchView = Controller.create({
    elements: {
      'input[type=search]': 'searchInput',
      'form': 'searchForm',
    },
    events: {
      'submit form': 'search',
    },
    init(element) {
      this.el = $(element);
      this.refreshElements();
      this.delegateEvents();
      this.searchForm.submit(this.proxy(this.search));
      //this.view.mouseover(this.proxy(this.toggleClass), true);
      //this.view.mouseout(this.proxy(this.toggleClass), false);
    },
    search() {
      console.log('Searching: ', this.searchInput.val());
      return false;
    },
    $(selector) {
      return $(selector, this.el);
    },
    eventSplitter: /^(\w+)\s*(.*)$/,
    delegateEvents() {
      for (const key in this.events) {
        const methodName = this.events[key];
        const method = this.proxy(this[methodname]);
        const match = key.match(this.eventSplitter);
        const eventName = match[1],
          selector = match[2];
        if (selector === '') {
          this.el.bind(eventName, method);
        } else {
          this.el.delegate(selector, eventName, method);
        }
      }
    },
    refreshElements() {
      for (const key in this.elements) {
        this[this.elements[key]] = this.$(key);
      }
    },
    //this.toogleClass: function(event) {
    //	this.view.toogleClass("over", event.data);
    //}
  });
  new SearchView({ el: '#users' });
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
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}
function transparentWrapping(f) {
  return function () {
    return f.apply(null, arguments);
  };
}

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
