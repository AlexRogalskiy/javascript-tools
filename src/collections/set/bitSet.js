;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	const isBitSet = (value) => (value instanceof globals.collections.set.BitSet);
//----------------------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of items.
	* @param {Integer} maxVal Input array of items.
	* @param {Function} cmp Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Bit Set.
	*
	* @example
	* var myBitSet = new globals.collections.set.BitSet({}, {}, {}, {}, {}, {});
	*/
	(function() {
		globals.collections.set = globals.collections.set || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_SIZE = 100;
		const BITSPERWORD = 32;
		const SHIFT = 5;
		const MASK = 0x1F;
//----------------------------------------------------------------------------------------------
		(function() {
			var _data = null;
			var _count = null;
			var _maxSize = null;

			var set = function(i) {
				_data[i>>SHIFT] |= (1<<(i & MASK));
			};

			var clr = function(i) {
				_data[i>>SHIFT] &= ~(1<<(i & MASK));
			};

			var test = function(i) {
				return _data[i>>SHIFT] & (1<<(i & MASK));
			};

			var check = function(i) {
				return (i <= (_data.length * BITSPERWORD));
			};

			var isInRange = function(num) {
				return (num <= (_data.length * BITSPERWORD) && num >= 0);
			};

			var that = {};
			that.report = function() {
				if(this.isEmpty()) return null;
				var result = globals.toolset.vector();
				for(var i=0; i<this.size(); i++) {
					if(test(i)) {
						result.push(i);
					}
				}
				return result;
			};
			that.first = function() {
				if(this.isEmpty()) return null;
				for(var i=0; i<this.size(); i++) {
					if(test(i)) {
						return i;
					}
				}
				return null;
			};
			that.last = function() {
				if(this.isEmpty()) return null;
				for(var i=this.size()-1; i>=0; i--) {
					if(test(i)) {
						return i;
					}
				}
				return null;
			};
			that.insert = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input value: value < ' + value + ' > is out of bounds < ' + 0 + ' > and < ' + this.size() + ' >'
										};
				}
				if(test(value)) return;
				set(value);
				_count++;
			};
			that.remove = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input value: value < ' + value + ' > is out of bounds < ' + 0 + ' > and < ' + this.size() + ' >'
										};
				}
				if(this.isEmpty()) return false;
				if(!test(value)) return false;
				clr(value);
				_count--;
			};
			that.removeAll = function() {
				if(this.isEmpty()) return;
				for(var i=0; i<this.size(); i++) {
					clr(i);
				}
				_count = 0;
			};
			that.intersect = function(set2) {
				if(!isBitSet(set2)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set2 + ' >'
								};
				}
				var result = globals.algorithms.intersect(this.report(), set2.report());
				return globals.collections.bitSet(result);
			};
			that.union = function(set2) {
				if(!isBitSet(set2)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set2 + ' >'
								};
				}
				var result = globals.algorithms.union(this.report(), set2.report());
				return globals.collections.bitSet(result);
			};
			that.diff = function(set2) {
				if(!isBitSet(set2)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set2 + ' >'
								};
				}
				var result = globals.algorithms.diff(this.report(), set2.report());
				return globals.collections.bitSet(result);
			};
			that.symmetricDiff = function(set2) {
				if(!isBitSet(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set2 + ' >'
								};
				}
				var setDiff1 = this.diff(set2), setDiff2 = set2.diff(this);
				return setDiff1.union(setDiff2);
				//var setDiff1 = globals.algorithms.diff(this.report(), set2.report());
				//var setDiff2 = globals.algorithms.diff(set2.report(), this.report());
				//return globals.collections.bitSet(setDiff1.concat(setDiff2));
			};
			that.has = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input argument: value < ' + value + ' > is out of bounds < ' + 0 + ' > and < ' + this.size() + ' >'
										};
				}
				if(this.isEmpty()) return false;
				if(!test(value)) return false;
				return true;
			};
			that.subSet = function(low, high) {
				low = (low == null) ? 0 : ((globals.toolset.isIntNumber(low) && low >= 0) ? low : null;
				if(low == null) throw {name: 'ValueError', message: 'incorrect lower value: < ' + low + ' >'};

				high = (high == null) ? this.size() : ((globals.toolset.isIntNumber(high) && high >= 0) ? high : null;
				if(high == null) throw {name: 'ValueError', message: 'incorrect upper value: < ' + high + ' >'};

				if(low > high) { throw {
									name: 'ValueError',
									message: 'incorrect input values: low border < ' + low + ' >, high border < ' + high + ' >'
								};
				}
				var result = globals.toolset.vector();
				if(this.isEmpty()) return result;
				for(var i=low; i<high; i++) {
					if(test(i)) {
						result.push(i);
					}
				}
				return new globals.collections.set.BitSet(result);
			};
			that.equivalent = function(set2) {
				var diff = this.diff(set2);
				if(diff.isEmpty()) return true;
				return false;
			};
			that.include = function(set2) {
				var diff = this.diff(set2);
				if(diff.isEmpty()) return true;
				var n1 = this.getCount(), n2 = set2.getCount();
				if(n1 < n2) return false;
				if(diff.getCount() === (n1 - n2)) return true;
				return false;
			};
			that.equals = function(set) {
				if(set == this) return true;
				if(!(set instanceof globals.collections.set.BitSet)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_data === node.getData());// && _next === node.getNext());
				return ((_data == set.getData() || (_data != null && _data.equals(set.getData()))) &&
						(_count == set.getCount() || (_count != null && _count.equals(set.getCount()))) &&
						(this.size() == set.size() || (this.size != null && this.size().equals(set.size()))));
			};
			that.toString = function() {
				var res = '[ ';
				res += this.report().join(', ');
				return res + ']';
			};
			that.size = function() {
				return (_data.length * BITSPERWORD);
			};
			that.isEmpty = function() {
				return (this.getCount() === 0);
			};
			that.getCount = function() {
				return _count;
			};
			that.clone = function() {
				return new globals.collections.set.BitSet(_data, _maxSize);
			};

			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					_data = globals.toolset.vector(Math.max(nodes.max(), _maxSize), 0);
					for(var i=0; i<nodes.length; i++) {
						that.insert(nodes[i]);
					}
				} else {
					_data = globals.toolset.vector(Math.floor((_maxSize % BITSPERWORD) ? (1 + _maxSize / BITSPERWORD) : (_maxSize / BITSPERWORD)), 0);
				}
			};

			function BitSet(nodes, maxVal) {
				_data = null;
				_count = 0;

				_maxSize = (maxVal == null) ? DEFAULT_SIZE : ((globals.toolset.isIntNumber(maxVal) && maxVal > 0) ? maxVal : null);
				if(_maxSize == null) throw {name: 'ValueError', message: 'incorrect max size value: not positive integer number < ' + _maxSize + ' >'};

				initialize(nodes);
			};
			BitSet.prototype = that;

			globals.collections.set.BitSet = BitSet;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));
