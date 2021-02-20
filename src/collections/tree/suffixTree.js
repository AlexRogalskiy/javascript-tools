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
	const isSuffixTree = (value) => (value instanceof globals.collections.tree.SuffixTree);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} spec Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Suffix tree.
	*
	* @example
	* var obj = {}, str = 'abcde';
	* for(var i=0; i<str.length; i++) {
	*	obj[i] = str.substring(i);
	* }
	* var sufTree = globals.collections.tree.SuffixTree(obj);
	*/
	(function() {
		globals.collections.tree = globals.collections.tree || {};
//----------------------------------------------------------------------------------------------
		var SuffixTree = (function() {
				
			var suffixTreeNode = (function() {

				return function(cmp) {
					var children = null;
					var indexes = globals.toolset.vector();
					//var that = {};
					var that = Object.create(suffixTreeNode);
					that.prototype = suffixTreeNode;
					//
					var init = function() {
						cmp = globals.toolset.isFunction(cmp) ? cmp : compare;
						children = globals.collections.map(null, cmp);
					};
					that.insertString = function(index, str) {
						var child = null, remainder, value;
						indexes[indexes.length] = index;
						if(str != null && str.length > 0) {
							value = str.charAt(0);
						}
						if(children.containsKey(value)) {
							child = children.get(value);
						} else {
							child = suffixTreeNode(cmp);
							children.put(value, child);
						}
						remainder = str.substring(1);
						child.insertString(index, remainder);
					};
					that.search = function(str) {
						var first, remainder;
						if(str == null || str.length == 0) {
							return indexes;
						} else {
							first = str.charAt(0);
							if(children.containsKey(first)) {
								remainder = str.substring(1);
								return children.get(first).search(remainder);
							}
						}
						return null;
					};
					that.isEmpty = function() {
						return (children.isEmpty());
					};
					that.has = function(key) {
						return (map.containsKey(key));
					};
					that.size = function() {
						return children.size();
					};
					that.clear = function() {
						children.clear();
					};
					that.entries = function() {
						return children.entries();
					};
					init();
					return that;
				};
			}());
//----------------------------------------------------------------------------------------------
			return function(spec, cmp) {
				var root = suffixTreeNode(cmp);
				//var that = {};
				var that = Object.create(globals.collections.tree.SuffixTree);
				that.prototype = globals.collections.tree.SuffixTree;
				//
				var init = function() {
					if(!globals.toolset.isNull(spec)) {
						if(!globals.toolset.isObject(spec)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: [object] required'
														};
						}
						for(var key in spec) {
							//if(!globals.toolset.isFunction(key) && Object.prototype.hasOwnProperty.call(spec, key)) {
								that.add(key, spec[key]);
							//}
						}
					}
				};
				that.add = function(key, value) {
					root.insertString(key, value);
				};
				that.search = function(str) {
					if(this.isEmpty()) return;
					if(!globals.toolset.isString(str)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: [string] required'
														};
					}
					return root.search(str);
				};
				that.has = function(key) {
					return (root.has(key));
				};
				that.isEmpty = function() {
					return (root.isEmpty());
				};
				that.clear = function() {
					root.clear();
				};
				that.size = function() {
					return root.size();
				};
				that.clone = function() {
					var entries = {};
					root.entries().forEach(function(value) {
						entries[value[key]] = value[value];
					});
					return globals.collections.tree.SuffixTree(entries, cmp);
				};
				init();
				return that;
			}
		}());
//----------------------------------------------------------------------------------------------
		//Exports block
		globals.collections.tree.SuffixTree = SuffixTree;
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));