;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	var compare = function(a, b) {
		var hasProperty = function(obj, prop) {
			var proto = obj.__proto__ || obj.constructor.prototype;
			return (prop in obj) || ((prop in proto) || proto[prop] === obj[prop]);
			//return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
		}
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			if(hasProperty(a, 'compareTo')) {
				return a.compareTo(b);
			} else {
				return a < b ? -1 : 1;//a.localCompare(b)
			}
		}
		return typeof a < typeof b ? -1 : 1;
	};
//----------------------------------------------------------------------------------------------
	const isCollection2 = (value) => (value instanceof globals.collections.common.collection2);
//----------------------------------------------------------------------------------------------
	(function() {
		globals.collections.common = globals.collections.common || {};
//----------------------------------------------------------------------------------------------
		var collection2 = (function() {

			return function(spec, cmp) {
				var _objects = [];
				var that = Object.create(globals.collections.common.collection2);
				that.prototype = globals.collections.common.collection2;

				var init = function() {
					if(!globals.toolset.isNull(spec)) {
						if(!globals.toolset.isArray(spec)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements [any type]'
														};
						}
						spec.forEach(function(value, index) {
							if(globals.toolset.isObject(value)) {
								for(var key in value) {
									if(!globals.toolset.isFunction(value[key]) && Object.prototype.hasOwnProperty.call(value, key)) {
										that.add(key, value[key]);
									}
								}
							} else {
								that.add(index, value);
							}
						});
					}
					cmp = globals.toolset.isFunction(cmp) ? cmp : compare;
				};
				  /**
				   * Adds objects to collection, Canvas or Group, then renders canvas
				   * (if `renderOnAddRemove` is not `false`).
				   * in case of Group no changes to bounding box are made.
				   * Objects should be instances of (or inherit from) fabric.Object
				   * Use of this function is highly discouraged for groups.
				   * you can add a bunch of objects with the add method but then you NEED
				   * to run a addWithUpdate call for the Group class or position/bbox will be wrong.
				   * @param {...fabric.Object} object Zero or more fabric instances
				   * @return {Self} thisArg
				   * @chainable
				   */
				that.add = function ) {
					this._objects.push.apply(this._objects, arguments);
					if (this._onObjectAdded) {
					  for (var i = 0, length = arguments.length; i < length; i++) {
						this._onObjectAdded(arguments[i]);
					  }
					}
					this.renderOnAddRemove && this.requestRenderAll();
					return this;
				};
				  /**
				   * Inserts an object into collection at specified index, then renders canvas (if `renderOnAddRemove` is not `false`)
				   * An object should be an instance of (or inherit from) fabric.Object
				   * Use of this function is highly discouraged for groups.
				   * you can add a bunch of objects with the insertAt method but then you NEED
				   * to run a addWithUpdate call for the Group class or position/bbox will be wrong.
				   * @param {Object} object Object to insert
				   * @param {Number} index Index to insert object at
				   * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
				   * @return {Self} thisArg
				   * @chainable
				   */
				that.insertAt = function(object, index, nonSplicing) {
					var objects = this._objects;
					if (nonSplicing) {
					  objects[index] = object;
					}
					else {
					  objects.splice(index, 0, object);
					}
					this._onObjectAdded && this._onObjectAdded(object);
					this.renderOnAddRemove && this.requestRenderAll();
					return this;
				};
				/**
				   * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
				   * @param {...fabric.Object} object Zero or more fabric instances
				   * @return {Self} thisArg
				   * @chainable
				   */
				that.remove = function() {
					var objects = this._objects,
						index, somethingRemoved = false;

					for (var i = 0, length = arguments.length; i < length; i++) {
					  index = objects.indexOf(arguments[i]);

					  // only call onObjectRemoved if an object was actually removed
					  if (index !== -1) {
						somethingRemoved = true;
						objects.splice(index, 1);
						this._onObjectRemoved && this._onObjectRemoved(arguments[i]);
					  }
					}
					this.renderOnAddRemove && somethingRemoved && this.requestRenderAll();
					return this;
				};
				  /**
				   * Executes given function for each object in this group
				   * @param {Function} callback
				   *                   Callback invoked with current object as first argument,
				   *                   index - as second and an array of all objects - as third.
				   *                   Callback is invoked in a context of Global Object (e.g. `window`)
				   *                   when no `context` argument is given
				   *
				   * @param {Object} context Context (aka thisObject)
				   * @return {Self} thisArg
				   * @chainable
				   */
				that.forEachObject = function(callback, context) {
					var objects = this.getObjects();
					for (var i = 0, len = objects.length; i < len; i++) {
					  callback.call(context, objects[i], i, objects);
					}
					return this;
				};
				  /**
				   * Returns an array of children objects of this instance
				   * Type parameter introduced in 1.3.10
				   * since 2.3.5 this method return always a COPY of the array;
				   * @param {String} [type] When specified, only objects of this type are returned
				   * @return {Array}
				   */
				that.getObjects = function(type) {
					if (typeof type === 'undefined') {
					  return this._objects.concat();
					}
					return this._objects.filter(function(o) {
					  return o.type === type;
					});
				};
				  /**
				   * Returns object at specified index
				   * @param {Number} index
				   * @return {Self} thisArg
				   */
				that.item = function (index) {
					return this._objects[index];
				};
				  /**
				   * Returns true if collection contains no objects
				   * @return {Boolean} true if collection is empty
				   */
				that.isEmpty = function () {
					return this._objects.length === 0;
				};
				  /**
				   * Returns a size of a collection (i.e: length of an array containing its objects)
				   * @return {Number} Collection size
				   */
				that.size = function() {
					return this._objects.length;
				};
				  /**
				   * Returns true if collection contains an object
				   * @param {Object} object Object to check against
				   * @return {Boolean} `true` if collection contains an object
				   */
				that.contains = function(object) {
					return this._objects.indexOf(object) > -1;
				};
				  /**
				   * Returns number representation of a collection complexity
				   * @return {Number} complexity
				   */
				that.complexity = function () {
					return this._objects.reduce(function (memo, current) {
					  memo += current.complexity ? current.complexity() : 0;
					  return memo;
					}, 0);
				};
				init();
				return that;
			}
		}());
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.collections.common.collection2 = collection2;
//----------------------------------------------------------------------------------------------
	}());
}(typeof globals !== 'undefined' ? globals : this));
