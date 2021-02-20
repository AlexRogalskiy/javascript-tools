;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.common = globals.common || {};
//----------------------------------------------------------------------------------------------
  /**
   * @private
   */
	var _set = function(key, value) {
		this[key] = value;
	};
	var _setObject = function(obj) {
		for (var prop in obj) {
			this._set(prop, obj[prop]);
		}
	};
//----------------------------------------------------------------------------------------------
   /**
    * @private
    * @param {String} eventName
    * @param {Function} handler
    */
	var _removeEventListener = function(eventName, handler) {
		if (!this.__eventListeners[eventName]) {
		  return;
		}
		var eventListener = this.__eventListeners[eventName];
		if (handler) {
		  eventListener[eventListener.indexOf(handler)] = false;
		}
		else {
		  fabric.util.array.fill(eventListener, false);
		}
	};
//----------------------------------------------------------------------------------------------
	/**
	* @private
	*/
	var cache = (function () {
		var elements = {};
		var that = {};
		that.getElement = function (uid) {
			return elements[uid];
		};
		that.setElement = function (uid, element) {
			elements[uid] = element;
		};
		return that;
	})();
//----------------------------------------------------------------------------------------------
	(function() {
		var devicePixelRatio = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;
		var slice = Array.prototype.slice;
		var emptyFunction = Function.prototype;
		var emptyGeneratorFunction = function *() {}.__proto__.constructor;
		var handlers = {};
//----------------------------------------------------------------------------------------------
		function EventTarget() {};
		EventTarget.prototype =
		{
			constructor: EventTarget,
			emit: function() {},
			on: function() {}
		};
//----------------------------------------------------------------------------------------------
		function Subclass() {};
//----------------------------------------------------------------------------------------------
	  /**
	   * Sets object's properties from options
	   * @param {Object} [options] Options object
	   */
		function setOptions(options) {
			for (var prop in options) {
				this.set(prop, options[prop]);
			}
		};
//----------------------------------------------------------------------------------------------
		function mixin(receiver, supplier) {
			Object.keys(supplier).forEach(function(key) {
				receiver[key] = supplier[key];
			});
			return receiver;
		};
		function mixin(...mixins) {
			var base = function() {};
			Object.assign(base.prototype, ...mixins);
			return base;
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns result of promise by timeout
		 */
		function wait(timeout: Number) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve()
				}, timeout)
			});
		};
//----------------------------------------------------------------------------------------------
		/**
		 *  returns result of request by retries count
		 */
		function requestWithRetry(url: string, count: Number) {
			const MAX_RETRIES = isPositive(count) ? count : 10;
			for (let i = 0; i <= MAX_RETRIES; i++) {
				try {
					return await request(url)
				} catch (err) {
					const timeout = Math.pow(2, i);
					Logger.debug(`Waiting ${timeout} ms`);
					await wait(timeout);
					Logger.debug(`Retrying with message=$err.message}, count=${i}`);
				}
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		 *  returns result functions executeed asynchronously
		 */
		function executeAsync(fn1: Function, fn2: Function, fn3: Function) {
			try {
				const valueA = await fn1();
				const valueB = await fn2(valueA);
				return fn3(valueA, valueB);
			} catch (err) {
				Logger.error(err);
			}
		};
//----------------------------------------------------------------------------------------------
	  /**
	   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
	   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
	   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
	   * @return {fabric.Object} thisArg
	   * @chainable
	   */
		function set(key, value) {
			if (typeof key === 'object') {
				this._setObject(key);
			} else {
				if (typeof value === 'function' && key !== 'clipTo') {
					this._set(key, value(this.get(key)));
				} else {
					this._set(key, value);
				}
			}
			return this;
		};
//----------------------------------------------------------------------------------------------
	  /**
	   * Basic getter
	   * @param {String} property Property name
	   * @return {*} value of a property
	   */
		function get(property) {
			return this[property];
		};
//----------------------------------------------------------------------------------------------
	  /**
	   * Toggles specified property from `true` to `false` or from `false` to `true`
	   * @param {String} property Property to toggle
	   * @return {fabric.Object} thisArg
	   * @chainable
	   */
		function toggle(property) {
			var value = this.get(property);
			if (typeof value === 'boolean') {
				this.set(property, !value);
			}
			return this;
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Populates an object with properties of another object
		 * @static
		 * @memberOf fabric.util
		 * @param {Object} source Source object
		 * @param {Object} destination Destination object
		 * @return {Array} properties Properties names to include
		 */
		function populateWithProps(source, destination, properties) {
			if (properties && Object.prototype.toString.call(properties) === '[object Array]') {
				for (var i = 0, len = properties.length; i < len; i++) {
					if (properties[i] in source) {
						destination[properties[i]] = source[properties[i]];
					}
				}
			}
		};
//----------------------------------------------------------------------------------------------
		function populate(object, ...keys) {
			let result = Object.create(null);
			for(let i=0, len = keys.length; i<len; i++ {
				result[keys[i]] = object[keys[i]];
			}
			return result;
		};
//----------------------------------------------------------------------------------------------
		// Build a destructive iterator for the value list
		 function iteratorFor(items) {
			var iterator = {
				next: function() {
					var value = items.shift()
					return {
						done: value === undefined,
						value: value
					}
				}
			}

			if (support.iterable) {
				iterator[Symbol.iterator] = function() {
					return iterator
				}
			}
			return iterator
		};
//----------------------------------------------------------------------------------------------
		/**
		 *  returns merged object
		 */
		function mergeRecursive(obj1, obj2) {
			if (obj1 && isNullOrUndefined(obj2)) {
				return obj1;
			}
			const mergedValue = {};
			forEach(obj1, (key, value) => {
				if (isMap(value)) {
					mergedValue[key] = mergeRecursive(value, obj2[key]);
				} else {
					mergedValue[key] = !isNullOrUndefined(obj2[key]) ? obj2[key] : value;
				}
			});
			return mergedValue;
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	executes callback for eack key - >value pair
		 */
		function forEach(obj, callback) {
			if (obj && isObject(obj)) {
				Object.keys(obj).forEach(prop => callback(prop, obj[prop]));
				/*for (const key in obj) {
					if ({}.hasOwnProperty.call(obj, key)) {
						callback(key, obj[key]);
					}
				}*/
			}
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns object with properties filtered by predicate
		 */
		function filter(obj, predicate) {
			if(!isObject(obj) || !isFunction(predicate) return;
			var result = {}, key;
			Object.keys(obj).forEach(prop => {
				if(!predicate(obj[prop])) {
					result[key] = obj[key];
				}
			});
			/*for (const key in obj) {
				if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
					result[key] = obj[key];
				}
			}*/
			return result;
		};
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns true - if object contains property, false - otherwise
		 */
		function hasProperty(obj, property) {
			if(!isObject(obj) || !isFunction(predicate) return;
			let result = false;
			if (obj && isObject(obj)) {
				Object.keys(obj).forEach(prop => {
					if(property === key) {
						result = true;
						break;
					}
				});
				/*for (const key in obj) {
					if ({}.hasOwnProperty.call(obj, key) && property === key) {
						result = true;
						break;
					}
				}*/
			}
			return result;
		};
//----------------------------------------------------------------------------------------------
		/**
		 * Copies all enumerable properties of one js object to another
		 * Does not clone or extend fabric.Object subclasses.
		 * @memberOf fabric.util.object
		 * @param {Object} destination Where to copy to
		 * @param {Object} source Where to copy from
		 * @return {Object}
		 */
		function extend(destination, source, deep) {
			if (deep) {
				  if (!fabric.isLikelyNode && source instanceof Element) {
					// avoid cloning deep images, canvases,
						destination = source;
				  } else if (source instanceof Array) {
						destination = [];
						for (var i = 0, len = source.length; i < len; i++) {
							destination[i] = extend({ }, source[i], deep);
						}
				  } else if (source && typeof source === 'object') {
						Object.keys(source).forEach(prop => destination[prop] = extend({}, source[prop], deep));
						/*for (var property in source) {
							if (source.hasOwnProperty(property)) {
								destination[property] = extend({ }, source[property], deep);
							}
						}*/
				  } else {
						// this sounds odd for an extend but is ok for recursive use
						destination = source;
				  }
				} else {
					for (var property in source) {
						destination[property] = source[property];
					}
				}
				return destination;
		  };
//----------------------------------------------------------------------------------------------
		  /**
		   * Creates an empty object and copies all enumerable properties of another object to it
		   * @memberOf fabric.util.object
		   * TODO: this function return an empty object if you try to clone null
		   * @param {Object} object Object to clone
		   * @return {Object}
		   */
		  function clone(object, deep) {
				return extend({}, object, deep);
		  };
//----------------------------------------------------------------------------------------------
			/**
			* Helper for creation of "classes".
			* @param {Function} [parent] optional "Class" to inherit from
			* @param {Object} [properties] Properties shared by all instances of this class
			*                  (be careful modifying objects defined here as this would affect all instances)
			*/
			function createClass() {
				var parent = null, properties = slice.call(arguments, 0);

				if (typeof properties[0] === 'function') {
					parent = properties.shift();
				}

				function klass() {
					this.initialize.apply(this, arguments);
				}

				klass.superclass = parent;
				klass.subclasses = [];

				if (parent) {
					Subclass.prototype = parent.prototype;
					klass.prototype = new Subclass();
					parent.subclasses.push(klass);
				}
				for (var i = 0, length = properties.length; i < length; i++) {
					addMethods(klass, properties[i], parent);
				}
				if (!klass.prototype.initialize) {
					klass.prototype.initialize = emptyFunction;
				}
				klass.prototype.constructor = klass;
				klass.prototype.callSuper = callSuper;
				return klass;
			};
//----------------------------------------------------------------------------------------------
			(function() {
				globals.common.state = globals.common.state || {};
				(function() {
					var extend = fabric.util.object.extend, originalSet = 'stateProperties';
					/*
					 *	Depends on `stateProperties`
					 */
					function saveProps(origin, destination, props) {
						var tmpObj = {}, deep = true;
						props.forEach(function(prop) {
							tmpObj[prop] = origin[prop];
						});
						extend(origin[destination], tmpObj, deep);
					};
					function _isEqual(origValue, currentValue, firstPass) {
						if (origValue === currentValue) {
							// if the objects are identical, return
							return true;
						} else if (Array.isArray(origValue)) {
							if (!Array.isArray(currentValue) || origValue.length !== currentValue.length) {
								return false;
							}
							for (var i = 0, len = origValue.length; i < len; i++) {
								if (!_isEqual(origValue[i], currentValue[i])) {
									return false;
								}
							}
							return true;
						} else if (origValue && typeof origValue === 'object') {
							var keys = Object.keys(origValue), key;
							if (!currentValue || typeof currentValue !== 'object' || (!firstPass && keys.length !== Object.keys(currentValue).length)) {
								return false;
							}
							for (var i = 0, len = keys.length; i < len; i++) {
								key = keys[i];
								if (!_isEqual(origValue[key], currentValue[key])) {
									return false;
								}
							}
							return true;
						}
					};
//----------------------------------------------------------------------------------------------
					/**
					 * Returns true if object state (one of its state properties) was changed
					 * @param {String} [propertySet] optional name for the set of property we want to save
					 * @return {Boolean} true if instance' state has changed since `{@link fabric.Object#saveState}` was called
					 */
					var hasStateChanged = function(propertySet) {
						propertySet = propertySet || originalSet;
						var dashedPropertySet = '_' + propertySet;
						if (Object.keys(this[dashedPropertySet]).length < this[propertySet].length) {
							return true;
						}
						return !_isEqual(this[dashedPropertySet], this, true);
					};
					/**
					 * Saves state of an object
					 * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
					 * @return {fabric.Object} thisArg
					 */
					var saveState = function(options) {
						var propertySet = options && options.propertySet || originalSet, destination = '_' + propertySet;
						if (!this[destination]) {
							return this.setupState(options);
						}
						saveProps(this, destination, this[propertySet]);
						if (options && options.stateProperties) {
							saveProps(this, destination, options.stateProperties);
						}
						return this;
					};
					/**
					 * Setups state of an object
					 * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
					 * @return {fabric.Object} thisArg
					 */
					var setupState = function(options) {
						options = options || {};
						var propertySet = options.propertySet || originalSet;
						options.propertySet = propertySet;
						this['_' + propertySet] = { };
						this.saveState(options);
						return this;
					};
				});
			})();
//----------------------------------------------------------------------------------------------
		 function callSuper(methodName) {
			var parentMethod = null, _this = this;
				// climb prototype chain to find method not equal to callee's method
				while (_this.constructor.superclass) {
					var superClassMethod = _this.constructor.superclass.prototype[methodName];
					if (_this[methodName] !== superClassMethod) {
						parentMethod = superClassMethod;
						break;
					}
					// eslint-disable-next-line
					_this = _this.constructor.superclass.prototype;
				}
				if (!parentMethod) {
					return console.log('tried to callSuper ' + methodName + ', method not found in prototype chain', this);
				}
				return (arguments.length > 1)
					? parentMethod.apply(this, slice.call(arguments, 1))
					: parentMethod.call(this);
		 };
//----------------------------------------------------------------------------------------------
		  function areHostMethods(object) {
				var methodNames = slice.call(arguments, 1), t, i, len = methodNames.length;
				for (i = 0; i < len; i++) {
					t = typeof object[methodNames[i]];
					if (!(/^(?:function|object|unknown)$/).test(t)) {
						return false;
					}
				}
				return true;
		  };
//----------------------------------------------------------------------------------------------
		  function createListener(uid, handler) {
				return {
					handler: handler,
					wrappedHandler: createWrappedHandler(uid, handler)
				};
		  };
//----------------------------------------------------------------------------------------------
		  function createWrappedHandler(uid, handler) {
				return function (e) {
					handler.call(cache.getElement(uid), e || window.event);
				};
		  };
//----------------------------------------------------------------------------------------------
		  function createDispatcher(uid, eventName) {
				return function (e) {
					if (handlers[uid] && handlers[uid][eventName]) {
						var handlersForEvent = handlers[uid][eventName];
						for (var i = 0, len = handlersForEvent.length; i < len; i++) {
							handlersForEvent[i].call(this, e || window.event);
						}
					}
				};
		  };
//----------------------------------------------------------------------------------------------
	  /**
	   * Observes specified event
	   * @deprecated `observe` deprecated since 0.8.34 (use `on` instead)
	   * @memberOf fabric.Observable
	   * @alias on
	   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
	   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
	   * @return {Self} thisArg
	   * @chainable
	   */
		function observe(eventName, handler) {
			if (!this.__eventListeners) {
				this.__eventListeners = {};
			}
			// one object with key/value pairs was passed
			if (arguments.length === 1) {
				for (var prop in eventName) {
					this.on(prop, eventName[prop]);
				}
			} else {
				if (!this.__eventListeners[eventName]) {
					this.__eventListeners[eventName] = [];
				}
				this.__eventListeners[eventName].push(handler);
				}
			return this;
		};
//----------------------------------------------------------------------------------------------
	  /**
	   * Stops event observing for a particular event handler. Calling this method
	   * without arguments removes all handlers for all events
	   * @deprecated `stopObserving` deprecated since 0.8.34 (use `off` instead)
	   * @memberOf fabric.Observable
	   * @alias off
	   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
	   * @param {Function} handler Function to be deleted from EventListeners
	   * @return {Self} thisArg
	   * @chainable
	   */
		function stopObserving(eventName, handler) {
			if (!this.__eventListeners) {
				return;
			}
			// remove all key/value pairs (event name -> event handler)
			if (arguments.length === 0) {
				for (eventName in this.__eventListeners) {
					_removeEventListener.call(this, eventName);
				}
			} else if (arguments.length === 1 && typeof arguments[0] === 'object') {
				for (var prop in eventName) {
					_removeEventListener.call(this, prop, eventName[prop]);
				}
			} else {
				_removeEventListener.call(this, eventName, handler);
			}
			return this;
		};
//----------------------------------------------------------------------------------------------
	  /**
	   * Fires event with an optional options object
	   * @deprecated `fire` deprecated since 1.0.7 (use `trigger` instead)
	   * @memberOf fabric.Observable
	   * @alias trigger
	   * @param {String} eventName Event name to fire
	   * @param {Object} [options] Options object
	   * @return {Self} thisArg
	   * @chainable
	   */
		function fire(eventName, options) {
			if (!this.__eventListeners) {
				return;
			}
			var listenersForEvent = this.__eventListeners[eventName];
			if (!listenersForEvent) {
				return;
			}
			for (var i = 0, len = listenersForEvent.length; i < len; i++) {
				listenersForEvent[i] && listenersForEvent[i].call(this, options || { });
			}
			this.__eventListeners[eventName] = listenersForEvent.filter(function(value) {
				return value !== false;
			});
			return this;
		};
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.common.setOptions = setOptions;
		globals.common.set = set;
		globals.common.get = get;
		globals.common.toggle = toggle;
		globals.common.populateWithProps = populateWithProps;
		globals.common.populate = populate;

		globals.common.observable =
		{
			observe: observe,
			stopObserving: stopObserving,
			fire: fire,
			on: observe,
			off: stopObserving,
			trigger: fire
		};
	}());
//----------------------------------------------------------------------------------------------
}(typeof exports !== 'undefined' ? exports : this));
