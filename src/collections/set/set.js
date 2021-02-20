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
	const isSet = (value) => (value instanceof globals.collections.set.Set);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Integer} size Collecton _size.
	* @param {Integer} maxVal Collection is limited by maximum value.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Set.
	*
	* @example
	* var mySet = new globals.collections.set.Set([3, 4, 1, 54, 6, 6]);
	*/
	(function() {
		globals.collections.set = globals.collections.set || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
//----------------------------------------------------------------------------------------------
		(function() {
			var _size = null;
			var _maxVal = null;
			var _dict = null;
			var _count = null;
			
			var that = {};
			that.has = function(value) {
				if(this.isEmpty()) return -1;
				var i = 0, j = this.getCount() - 1, k;
				while(i<j) {
					k = Math.round((i+j)/2+0.5) - 1;
					if(compare(value, _dict[k]) <= 0) {
						j = k;
					} else {
						i = k + 1;
					}
				}
				if(compare(_dict[i], value) == 0) {
					return i;
				} else {
					return -1;
				}
			};
			that.add = function(value) {
				if(value) {
					for(var i=0; _dict[i]<value; i++);
					if(compare(_dict[i], value) == 0) return;
					for(var j=this.getCount(); j>=i; j--) {
						_dict[j+1] = _dict[j];
					}
					_dict[i] = Object.clone(value);
					_count++;
				}
			};
			that.remove = function(value) {
				if(this.isEmpty()) return false;
				var index = this.has(value);
				if(p !== -1) {
					delete _dict[p];
					for(var i=p; i<this.getCount(); i++) {
						_dict[i] = _dict[i+1];
					}
					_count--;
					return true;
				}
				return false;
			};
			that.removeAll = function() {
				for(var i=0; i<this.getCount(); i++) {
					delete _dict[i];
					_dict[i] = null;
				}
				_count = 0;
			};
			that.first = function() {
				//if(this.isEmpty()) return null;
				return _dict[0];
			};
			that.each = function(func) {
				if(!globals.toolset.isFunction(func)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: function < ' + func + ' >'
												};
				}
				for(var i=0; i<this.size(); i++) {
					_dict[i] = func(_dict[i]);
					//func(_dict[i]);
				}
			};
			that.entries = function() {
				var res = globals.toolset.vector();//data.slice(0);
				_dict.forEach(function(item, i) {
					res.push(Object.clone(item));
				});
				return res;
			};
			that.size = function() {
				return _dict.length;
			};
			that.report = function() {
				return _dict.slice(0, this.size());
			};
			that.isEmpty = function() {
				return (this.getCount() === 0);
			};
			that.getCount = function() {
				return _count;
			};
			that.clone = function() {
				return new globals.collections.set.Set(this.entries(), this.size(), _maxVal, compare);
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.add(nodes[i]);
					}
				}
			};
			
			function Set(nodes, size, maxVal, cmp) {
				_size = (size == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(size) && size > 0) ? size : null;
				if(_size == null) throw {name: 'ValueError', mesage: 'incorrect size value: < ' + _size + ' >'};

				_maxVal = (maxVal == null) ? Number.MAX_VALUE : ((globals.toolset.isIntNumber(maxVal) && maxVal > 0) ? maxVal : null);
				if(_maxVal == null) throw {name: 'ValueError', mesage: 'incorrect max value: < ' + _maxVal + ' >'};
				
				_dict = globals.toolset.vector(_size + 1, null);
				_dict[0] = _maxVal;
				
				_count = 0;
				
				initialize(nodes);

				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Set.prototype = that;
			
			globals.collections.set.Set = Set;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));