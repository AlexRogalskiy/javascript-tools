;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.error = globals.error || {};
//----------------------------------------------------------------------------------------------
	var errorType = (function() {
		var ERROR_TYPE =
		{
			TYPE_ERROR: "TypeError",
			VALUE_ERROR: "ValueError"
		};
		
		Object.freeze(ERROR_TYPE);
		Object.preventExtensions(ERROR_TYPE);
		
		globals.error.ERROR_TYPE = ERROR_TYPE;
	}());
//----------------------------------------------------------------------------------------------
	var errorMessage = (function() {
		var ERROR_MESSAGE =
		{
			ERROR_ARGUMENT_OUT_OF_RANGE: "Argument was out of the range of valid values.",
			ERROR_METHOD_NOT_IMPLEMENTED: "Method not implemented.",
			ERROR_ARRAY_SIZE: "The number of elements in the source is greater than the number of elements that the destination array can contain.",
			ERROR_KEY_NOT_FOUND: "The given key was not present in the collection.",
			ERROR_DUPLICATE_KEY: "An item with the same key has already been added.",
			ERROR_EMPTY_COLLECTION: "Collection is empty.",
			ERROR_MORE_THAN_ONE_ELEMENT: "Sequence contains more than one element.",
			ERROR_MORE_THAN_ONE_MATCH: "Sequence contains more than one match.",
			ERROR_NO_MATCH: "Sequence contains no matching element.",
			ERROR_NO_ELEMENTS: "Sequence contains no elements.",
			ERROR_NON_NUMERIC_TYPE: "Value is not a number."
		};
		
		Object.freeze(ERROR_MESSAGE);
		Object.preventExtensions(ERROR_MESSAGE);
		
		globals.error.ERROR_MESSAGE = ERROR_MESSAGE;
	}());
//----------------------------------------------------------------------------------------------
	const isError = (value) => (value instanceof Error);
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		var basicError = (function() {
			var _name = null;
			var _message = null;
			
			//var that = {}
			//that.inheritsFrom(Error);
			var that = Object.create(Error.prototype);
			that.toString = function() {
				return this.constructor.name + ': (name: ' + _name + ', message: ' + _message + ')';
			};
			that.equals = function(error) {
				if(error == this) return true;
				if(!(error instanceof globals.error.BasicError)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_end === node.getEnd());
				return (_name == error.getName() || (_name != null && _name.equals(error.getName())) &&
						(_message == error.getMessage() || (_message != null && _message.equals(error.getMessage()))));
			};
			that.getName = function() {
				return _name;
			};
			that.getMessage = function() {
				return _message;
			};
			that.clone = function() {
				return new globals.error.BasicError({'name': _name, 'message': _message});
			};

			var initialize = function(spec) {
				if(!globals.toolset.isNull(spec)) {
					if(!globals.toolset.isObject(spec)) {
						var o = Object.create(Error.prototype, {name: 'TypeError', message: 'incorrect input argument: {spec} is not object < ' + spec + ' >'});
						throw o;
						//throw {
						//		name: 'ValueError',
						//		message: 'incorrect initialization value: [object]'
						//}
					}
					if(Object.prototype.hasOwnProperty.call(spec, 'name') && Object.prototype.hasOwnProperty.call(spec, 'message')/*spec.hasOwnProperty('name') && spec.hasOwnProperty('message')*/ && jsar.toolset.isString(spec.name) && jsar.toolset.isString(spec.message)) {
						_name = spec.name;
						_message = spec.message;
					} else {
						var o = Object.create(Error.prototype, {name: 'ValueError', message: 'incorrect initialization values: {\'name\': [string], \'message\': [string]'});
						throw o;
						//throw {
						//	name: 'ValueError',
						//	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'
						//};
					}
				}
			};

			function BasicError(spec) {
				Error.call(this);
				
				_name = '';
				_message = '';
				
				initialize(spec);
			};
			BasicError.prototype = that;
			BasicError.prototype.constructor = BasicError;
			
			globals.error.BasicError = BasicError;
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var that = Object.create(globals.error.BasicError.prototype);
			that.toString = function() {
				return this.constructor.name + ': (name: ' + globals.error.BasicError.getName.apply(this) + ', message: ' + globals.error.BasicError.getMessage.apply(this) + ')';
			};
			that.equals = function(error) {
				if(error == this) return true;
				if(!(error instanceof globals.error.TypeError)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_end === node.getEnd());
				return globals.error.BasicError.prototype.equals.apply(this, error));
			};
			that.clone = function() {
				return new globals.error.TypeError({'name': globals.error.BasicError.getName.apply(this), 'message': globals.error.BasicError.getMessage.apply(this)});
			};
			
			function TypeError(spec) {
				globals.error.BasicError.call(this, spec);
			};
			TypeError.prototype = that;
			TypeError.prototype.constructor = TypeError;
			
			globals.error.TypeError = TypeError;
		}());
//----------------------------------------------------------------------------------------------
		(function() {
			var that = Object.create(globals.error.BasicError.prototype);
			that.toString = function() {
				return this.constructor.name + ': (name: ' + globals.error.BasicError.getName.apply(this) + ', message: ' + globals.error.BasicError.getMessage.apply(this) + ')';
			};
			that.equals = function(error) {
				if(error == this) return true;
				if(!(error instanceof globals.error.ValueError)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_end === node.getEnd());
				return globals.error.BasicError.prototype.equals.apply(this, error));
			};
			that.clone = function() {
				return new globals.error.ValueError({'name': globals.error.BasicError.getName.apply(this), 'message': globals.error.BasicError.getMessage.apply(this)});
			};

			function ValueError(spec) {
				globals.error.BasicError.call(this, spec);
			};
			ValueError.prototype = that;
			ValueError.prototype.constructor = ValueError;
			
			globals.error.ValueError = ValueError;
		}());
	}());
}(typeof exports !== 'undefined' ? exports : this));

//jsar.error.BasicError.prototype = Object.create(Error.prototype);
//var a = jsar.error.BasicError();
//alert(Object.getPrototypeOf(a));
//document.writeln(a.self instanceof jsar.error.BasicError);
//document.writeln(a instanceof Error);
//--------------------------------------------------------------
//var b = jsar.error.TypeError({'name': 'name', 'message': 'message'});
//document.writeln(b.self instanceof jsar.error.BasicError);
//document.writeln(b.self instanceof jsar.error.TypeError);
//document.writeln(b instanceof Error);
//document.writeln(b instanceof TypeError);
//document.writeln(a instanceof jsar.error.TypeError);
//--------------------------------------------------------------
//var c = jsar.error.argumenterror({'name': 'name', 'message': 'message'});
//document.writeln('<br><br>');
//document.writeln(c.self instanceof jsar.error.BasicError);
//document.writeln(c.self instanceof jsar.error.TypeError);
//document.writeln(c.self instanceof jsar.error.argumenterror);
//document.writeln(c instanceof Error);
//document.writeln(c instanceof TypeError);
//document.writeln(c instanceof jsar.error.TypeError);
//document.writeln(c instanceof jsar.error.argumenterror);
//document.writeln(c instanceof jsar.error.BasicError);