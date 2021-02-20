;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	const descriptor_ = { enumerable: false, configurable: false, writable: false };
//----------------------------------------------------------------------------------------------
	const merge = (...sources) => Object.assign({}, ...sources);
//----------------------------------------------------------------------------------------------
	(function() {
	   /* @public
		* @module object
		* @param {String} name property.
		* @param {Function} value property's value.
		* @param {Object} desc property's descriptor Optional
		*
		* @example
		* desc =   {value: 37,
		*			writable : true,
		*			enumerable : true,
		*			configurable : true}
		*
		* desc = 	{get : function(){ return name; },
		*			 set : function(newValue){ name = newValue; },
		*			 enumerable : true,
		*			 configurable : true}
		*/
		Object.prototype.property = (function() {
			var desc_ = {enumerable: false, configurable: false, writable: true};
			
			return function(name, value, desc) {
				if (!this) return this;
				
				if(globals.toolset.isFunction(value)) {
					throw globals.exception.typeException('TypeError', 'incorrect input argument: {value} is not a function < ' + value + ' >');
				}
				
				//if(!this.prototype[name]) {
					this.prototype[name] = value;
					desc = (globals.toolset.isObject(desc)) ? desc : desc_;
					Object.defineProperty(this.prototype, name, desc);
					globals.utils.logger.Logger.debug('property < ' + name + ' > is added to < ' + ((this.name == '') ? this.constructor.name : this.name) + ' >');
					return this;
				//}
			};
		}());
//----------------------------------------------------------------------------------------------
	   /* @public
		* @module object
		* @param {String} name property.
		* @param {Function} func method.
		* @param {Object} desc property's descriptor Optional
		*
		* @example
		* desc =   {enumerable : true,
		*			configurable : true}
		*/
		Object.prototype.method = (function() {
			var desc_ = {enumerable: false, configurable: false};
			
			return function(name, func, desc) {
				
				if (!this) return this;
				
				if(!globals.toolset.isFunction(func)) {
					throw globals.exception.typeException('TypeError', 'incorrect input argument: {func} is not a function < ' + func + ' >');
				}
				
				var old = this.prototype[name];
				this.prototype[name] = function() {
					if(func.length === arguments.length) {
						return func.apply(this, arguments);
					} else if(globals.toolset.isFunction(old)) {
						return old.apply(this, arguments);
					} else {
						throw globals.exception.valueException('ValueError', 'incorrect signature: invalid function contract for < ' + name + ' >');
					}
				};
				desc = (globals.toolset.isObject(desc)) ? desc : desc_;
				Object.defineProperty(this.prototype, name, desc);
				globals.utils.logger.Logger.debug('method < ' + name + ' > is added to < ' + ((this.name == '') ? this.constructor.name : this.name) + ' >');
				return this;
				
				/*if(!this.prototype[name]) {

					globals.utils.logger.Logger.debug('method < ' + name + ' > is added to < ' + this.name + ' >');

					this.prototype[name] = func;
					desc = (globals.toolset.isObject(desc)) ? desc : desc_;
					Object.defineProperty(this.prototype, name, desc);
					return this;
				}*/
			};
		}());
//----------------------------------------------------------------------------------------------
	   /* @public
		* @module object
		* @param {String} name property.
		* @param {Function} value property's value.
		* @param {Object} desc property's descriptor Optional
		*
		* @example
		* desc =   {value: 37,
		*			writable : true,
		*			enumerable : true,
		*			configurable : true}
		*
		* desc = 	{get : function(){ return name; },
		*			 set : function(newValue){ name = newValue; },
		*			 enumerable : true,
		*			 configurable : true}
		*/
		Object.prototype.staticProperty = (function() {
			var desc_ = {enumerable: false, configurable: false, writable: true};
			
			return function(name, value, desc) {
				if (!this) return this;
				
				if(globals.toolset.isFunction(value)) {
					throw globals.exception.typeException('TypeError', 'incorrect input argument: {value} is not a function < ' + value + ' >');
				}
				
				//if(!this[name]) {
					this[name] = value;
					desc = (globals.toolset.isObject(desc)) ? desc : desc_;
					Object.defineProperty(this, name, desc);
					globals.utils.logger.Logger.debug('static property < ' + name + ' > is added to < ' + ((this.name == '') ? this.constructor.name : this.name) + ' >');
					return this;
				//}
			};
		}());
//----------------------------------------------------------------------------------------------
	   /* @public
		* @module object
		* @param {String} name property.
		* @param {Function} func method.
		* @param {Object} desc property's descriptor Optional
		*
		* @example
		* desc =   {enumerable : true,
		*			configurable : true}
		*/
		Object.prototype.staticMethod = (function() {
			var desc_ = {enumerable: false, configurable: false};
			
			return function(name, func, desc) {
				if (!this) return this;
				
				if(!globals.toolset.isFunction(func)) {
					throw globals.exception.typeException('TypeError', 'incorrect input argument: {func} is not a function < ' + func + ' >');
				}
				
				var old = this[name];
				this[name] = function() {
					if(func.length === arguments.length) {
						return func.apply(this, arguments);
					} else if(globals.toolset.isFunction(old)) {
						return old.apply(this, arguments);
					} else {
						throw globals.exception.valueException('ValueError', 'incorrect signature: invalid function contract for < ' + name + ' >');
					}
				};
				desc = (globals.toolset.isObject(desc)) ? desc : desc_;
				Object.defineProperty(this, name, desc);
				globals.utils.logger.Logger.debug('static method < ' + name + ' > is added to < ' + ((this.name == '') ? this.constructor.name : this.name) + ' >');
				return this;
				
				/*if(!this[name]) {

					globals.utils.logger.Logger.debug('static method < ' + name + ' > is added to < ' + ((this.name == '') ? this.constructor.name : this.name) + ' >');

					this[name] = func;
					desc = (globals.toolset.isObject(desc)) ? desc : desc_;
					Object.defineProperty(this, name, desc);
					return this;
				}*/
			};
		}());
//----------------------------------------------------------------------------------------------
		Object.defineProperty(Object.prototype, "property", descriptor_);
		Object.defineProperty(Object.prototype, "method", descriptor_);
		Object.defineProperty(Object.prototype, "staticProperty", descriptor_);
		Object.defineProperty(Object.prototype, "staticMethod", descriptor_);
	}());
}(typeof exports !== 'undefined' ? exports : this));