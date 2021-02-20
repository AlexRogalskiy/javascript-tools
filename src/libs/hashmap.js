/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.0.3
 * Homepage: https://github.com/flesler/hashmap
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object') {
    // Node js environment
    const HashMap = (module.exports = factory());
    // Keep it backwards compatible
    HashMap.HashMap = HashMap;
  } else {
    // Browser globals (this is window)
    this.HashMap = factory();
  }
})(function () {
  function HashMap(other) {
    this.clear();
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.copy(other);
        break;
      default:
        multi(this, arguments);
        break;
    }
  }

  const proto = (HashMap.prototype = {
    constructor: HashMap,

    get(key) {
      const data = this._data[this.hash(key)];
      return data && data[1];
    },

    set(key, value) {
      // Store original key as well (for iteration)
      this._data[this.hash(key)] = [key, value];
    },

    multi() {
      multi(this, arguments);
    },

    copy(other) {
      for (const key in other._data) {
        this._data[key] = other._data[key];
      }
    },

    has(key) {
      return this.hash(key) in this._data;
    },

    search(value) {
      for (const key in this._data) {
        if (this._data[key][1] === value) {
          return this._data[key][0];
        }
      }

      return null;
    },

    remove(key) {
      delete this._data[this.hash(key)];
    },

    type(key) {
      const str = Object.prototype.toString.call(key);
      const type = str.slice(8, -1).toLowerCase();
      // Some browsers yield DOMWindow for null and undefined, works fine on Node
      if (type === 'domwindow' && !key) {
        return `${key}`;
      }
      return type;
    },

    keys() {
      const keys = [];
      this.forEach(function (value, key) {
        keys.push(key);
      });
      return keys;
    },

    values() {
      const values = [];
      this.forEach(function (value) {
        values.push(value);
      });
      return values;
    },

    count() {
      return this.keys().length;
    },

    clear() {
      // TODO: Would Object.create(null) make any difference
      this._data = {};
    },

    clone() {
      return new HashMap(this);
    },

    hash(key) {
      switch (this.type(key)) {
        case 'undefined':
        case 'null':
        case 'boolean':
        case 'number':
        case 'regexp':
          return `${key}`;

        case 'date':
          return `♣${key.getTime()}`;

        case 'string':
          return `♠${key}`;

        case 'array':
          var hashes = [];
          for (let i = 0; i < key.length; i++) {
            hashes[i] = this.hash(key[i]);
          }
          return `♥${hashes.join('⁞')}`;

        default:
          // TODO: Don't use expandos when Object.defineProperty is not available?
          if (!key.hasOwnProperty('_hmuid_')) {
            key._hmuid_ = ++HashMap.uid;
            hide(key, '_hmuid_');
          }

          return `♦${key._hmuid_}`;
      }
    },

    forEach(func, ctx) {
      for (const key in this._data) {
        const data = this._data[key];
        func.call(ctx || this, data[1], data[0]);
      }
    },
  });

  HashMap.uid = 0;

  //- Automatically add chaining to some methods

  for (const method in proto) {
    // Skip constructor, valueOf, toString and any other built-in method
    if (method === 'constructor' || !proto.hasOwnProperty(method)) {
      continue;
    }
    const fn = proto[method];
    if (fn.toString().indexOf('return ') === -1) {
      proto[method] = chain(fn);
    }
  }

  //- Utils

  function multi(map, args) {
    for (let i = 0; i < args.length; i += 2) {
      map.set(args[i], args[i + 1]);
    }
  }

  function chain(fn) {
    return function () {
      fn.apply(this, arguments);
      return this;
    };
  }

  function hide(obj, prop) {
    // Make non iterable if supported
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, { enumerable: false });
    }
  }

  return HashMap;
});
