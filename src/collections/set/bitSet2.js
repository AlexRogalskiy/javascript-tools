;(function (globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//----------------------------------------------------------------------------------------------
	const isBitSet2 = (value) => (value instanceof globals.collections.set.BitSet2);
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
	* var myBitSet = new globals.collections.set.BitSet2({}, {}, {}, {}, {}, {});
	*/
	(function() {
		globals.collections.set = globals.collections.set || {};
//----------------------------------------------------------------------------------------------
		const DEFAULT_MIN = 0;
		const DEFAULT_MAX = Number.MAX_VALUE;
		const BITSPERWORD = 32;//64
		const SHIFT = 5;//6
		const MASK = 0x1F;//0x3F
//----------------------------------------------------------------------------------------------
		(function() {
			var _min = null;
			var _max = null;
			var _data = null;

			var	getBit = function(num, i) {
				return ((num & (1 << i)) != 0);
			};
			var setBit = function(num) {
				var bit = num - _min;
				_data[bit >> SHIFT] |= (1 << (bit & MASK));
			};
			var clearBit = function(num) {
				var bit = num - _min;
				_data[bit >> SHIFT] &= ~(1 << (bit & MASK));
			};
			//var clearBitsMSBthroughI = function(num, i) {
			//	var mask = (1 << (i+1)) - 1;
			//	return num & mask;
			//};
			//var clearBitsIthrough0 = function(num, i) {
			//	var mask = ~((1 << (i+1)) - 1);
			//	return num & mask;
			//};
			//var updateBit = function(num, i, v) {
			//	var mask = ~(1 << i);
			//	return (num & mask) | (v << i);
			//};
			var checkBit = function(num) {
				var bit = num - _min;
				return ((_data[bit >> SHIFT] & (1 << (bit & MASK))) != 0);
			};
			var toggleBit = function(num) {
				var bit = num - _min;
				_data[bit >> SHIFT] ^= (1 << (bit & MASK));
			};
			var isInRange = function(num) {
				return (num <= _max && num >= _min);
			};
//----------------------------------------------------------------------------------------------
			(function() {
				globals.collections.set.iterator = globals.collections.set.iterator || {};
//----------------------------------------------------------------------------------------------
				(function() {
					var _current = null;
					var _previous = null;
					var _index = null;

					var getNext = function(value) {
						while(isInRange(value) && !checkBit(value)) {
							value++;
						}
						return value;
					};

					var that = {};
					that.hasNext = function() {
						return (isInRange(_current));
					};
					that.next = function() {
						if(!this.hasNext()) return (_previous = null);
						_previous = _current;
						_current = getNext(_current);
						_index++;
						return _previous;
					};
					that.nextIndex = function() {
						if(!this.hasNext()) return _index;
						return (_index + 1);
					};
					that.remove = function() {
						if(_previous == null) return false;
						clearBit(value);
						_index--;
						return true;
					};
					that.add = function(value) {
						if(!globals.toolset.isIntNumber(value)) { throw {
																	name: 'TypeError',
																	message: 'incorrect input argument: not integer number < ' + value + ' >'
																};
						}
						if(!isInRange(value)) { throw {
													name: 'OutOfBoundsError',
													message: 'incorrect input argument: value < ' + value + ' > is out of bounds < ' + _min + ' > and < ' + _max + ' >'
												};
						}
						if(!checkBit(value)) {
							setBit(value);
							_index++;
						}
					};

					function SetIterator() {
						_current = getNext(_min);
						_previous = null;
						_index = -1;
					};
					SetIterator.prototype = that;

					globals.collections.set.iterator.SetIterator = SetIterator;
				}());
			}());
//----------------------------------------------------------------------------------------------
			var that = {};
			that.has = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input argument: value < ' + value + ' > is out of bounds < ' + _min + ' > and < ' + _max + ' >'
										};
				}
				if(this.isEmpty()) return false;
				if(!checkBit(value)) return false;
				return true;
			};
			that.disjunct = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input argument: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input argument: value < ' + value + ' > is out of bounds < ' + _min + ' > and < ' + _max + ' >'
										};
				}
				if(!checkBit(value)) {
					setBit(value);
					_count++;
				}
				return this;
			};
			that.or = function(set) {
				if(!isBitSet2(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set + ' >'
								};
				}
				if(isInRange(set.getMinBound()) && isInRange(set.getMaxBound())) {
					var res = set.entries();
					res.forEach(function(value) {
						if(!checkBit(value)) {
							setBit(value);
							_count++;
						}
					});
				} else {
					var res = this.entries().union(set.entries());

					_min = Math.min(_min, set.getMinBound());
					_max = Math.max(_max, set.getMaxBound());

					var numBits = _max - _min + 1;
					var numBytes = (numBits % BITSPERWORD) ? Math.floor((1 + numBits / BITSPERWORD)) : (numBits / BITSPERWORD);
					_data = globals.toolset.vector(numBytes, 0);

					_count = 0;
					res.forEach(function(value) {
						setBit(value);
						_count++;
					});
				}
				return this;
			};
			that.and = function(set) {
				if(!isBitSet2(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input argument: not a set < ' + set + ' >'
								};
				}
				if(!isInRange(set.getMinBound()) && !isInRange(set.getMaxBound())) {
					_min = 0;
					_max = 0;
					_data = globals.toolset.vector(0, 0);
					_count = 0;
				} else {
					var res = this.entries().intersect(set.entries());

					_min = Math.max(_min, set.getMinBound());
					_max = Math.min(_max, set.getMaxBound());

					var numBits = _max - _min + 1;
					var numBytes = (numBits % BITSPERWORD) ? Math.floor((1 + numBits / BITSPERWORD)) : (numBits / BITSPERWORD);
					_data = globals.toolset.vector(numBytes, 0);

					_count = 0;
					res.forEach(function(value) {
						setBit(value);
						_count++;
					});
				}
				return this;
			};
			that.remove = function(value) {
				if(!globals.toolset.isIntNumber(value)) { throw {
															name: 'TypeError',
															message: 'incorrect input value: not integer number < ' + value + ' >'
														};
				}
				if(!isInRange(value)) { throw {
											name: 'OutOfBoundsError',
											message: 'incorrect input value: value < ' + value + ' > is out of bounds < ' + _min + ' > and < ' + _max + ' >'
										};
				}
				if(checkBit(value)) {
					clearBit(value);
					_count--;
				}
				return this;
			};
			that.diff = function(set) {
				if(!isBitSet2(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input value: not a set < ' + set + ' >'
								};
				}
				if(isInRange(set.getMinBound()) || isInRange(set.getMaxBound())) {
					//var res = this.entries().diff(set.entries());
					var res = this.entries().intersect(set.entries());

					res.forEach(function(value) {
						clearBit(value);
						_count--;
					});
				}
				return this;
			};
			that.symmetricDiff = function(set) {
				if(!isBitSet2(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input value: not a set < ' + set + ' >'
								};
				}
				if(isInRange(set.getMinBound()) || isInRange(set.getMaxBound())) {
					var res1 = this.entries().diff(set.entries());
					var res2 = set.entries().diff(this.entries());
					var res = res1.union(res2);

					_min = Math.min(_min, set.getMinBound());
					_max = Math.max(_max, set.getMaxBound());

					var numBits = _max - _min + 1;
					var numBytes = (numBits % BITSPERWORD) ? Math.floor((1 + numBits / BITSPERWORD)) : (numBits / BITSPERWORD);
					_data = globals.toolset.vector(numBytes, 0);
					_count = 0;

					res.forEach(function(value) {
						setBit(value);
						_count++;
					});
				}
				return this;
			};
			that.inverse = function() {
				if(!this.isEmpty()) {
					for(var i=_min; i<=_max; i++) {
						toggleBit(i);
					}
					//for(var i=0; i<_data.length; i++) {
					//	_data[i] = ~_data[i];
					//}
					_count = (_max - _min + 1 - _count);
				}
				return this;
			};
			that.include = function(set) {
				if(!isBitSet2(set)) { throw {
									name: 'TypeError',
									message: 'incorrect input value: not a set < ' + set + ' >'
								};
				}
				if(isInRange(set.getMinBound()) || isInRange(set.getMaxBound())) {
					var res = set.entries();
					res.forEach(function(value) {
						if(!checkBit(value)) {
							return false;
						}
					});
					return true;
				}
				return false;
			};
			that.removeAll = function() {
				if(!this.isEmpty()) {
					for(var i=_min; i<=_max; i++) {
						clearBit(i);
					}
					//var numBits = _max - _min + 1;
					//var numBytes = (numBits % BITSPERWORD) ? Math.floor((1 + numBits / BITSPERWORD)) : (numBits / BITSPERWORD);
					//_data = globals.toolset.vector(numBytes, 0);

					_count = 0;
				}
				return this;
			};
			that.subSet = function(low, high) {
				low = (low == null) ? _min : ((globals.toolset.isIntNumber(low) && low >= _min) ? low : null;
				if(low == null) throw {name: 'ValueError', message: 'incorrect lower value: < ' + low + ' >'};

				high = (high == null) ? _max : ((globals.toolset.isIntNumber(high) && high <= _max) ? high : null;
				if(high == null) throw {name: 'ValueError', message: 'incorrect upper value: < ' + high + ' >'};

				if(low > high) { throw {
									name: 'ValueError',
									message: 'incorrect input arguments: low border < ' + low + ' >, high border < ' + high + ' >'
								};
				}

				var result = globals.toolset.vector();
				for(var i=low; i<=high; i++) {
					if(checkBit(i)) {
						result.push(i);
					}
				}
				return new globals.collections.set.BitSet2(result, low, high);
			}
			that.entries = function() {
				if(this.isEmpty()) return null;
				var result = globals.toolset.vector();
				for(var i=this.getMinBound(); i<=this.getMaxBound(); i++) {
					if(checkBit(i)) {
						result.push(i);
					}
				}
				return result;
			};
			that.first = function() {
				if(this.isEmpty()) return null;
				for(var i=this.getMinBound(); i<=this.getMaxBound(); i++) {
					if(checkBit(i)) {
						return i;
					}
				}
				return null;
			};
			that.last = function() {
				if(this.isEmpty()) return null;
				for(var i=this.getMaxBound(); i>=this.getMinBound(); i--) {
					if(checkBit(i)) {
						return i;
					}
				}
				return null;
			};
			that.equals = function(set) {
				if(set == this) return true;
				if(!(set instanceof globals.collections.set.BitSet2)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_data === node.getData());// && _next === node.getNext());
				return ((_data == set.getData() || (_data != null && _data.equals(set.getData()))) &&
						(_min == set.getMinBound() || (_min != null && _min.equals(set.getMinBound()))) &&
						(_max == set.getMaxBound() || (_max != null && _max.equals(set.getMaxBound()))));
			};
			that.toString = function() {
				var res = '[ ';
				res += this.entries().join(', ');
				return res + ']';
			};
			that.iterator = function() {
				return new globals.collections.set.iterator.SetIterator();
			};
			that.getMinBound = function() {
				return _min;
			};
			that.getMaxBound = function() {
				return _max;
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
				return new globals.collections.set.BitSet2(_data, _min, _max);
			};

			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						that.disjunct(nodes[i]);
					}
				}
			};

			function BitSet2(nodes, min, max) {
				//nodes.min()
				_min = (min == null) ? DEFAULT_MIN : ((globals.toolset.isIntNumber(min) && min >= 0) ? min : null);
				if(_min == null) throw {name: 'ValueError', message: 'incorrect min value: not positive integer number < ' + _min + ' >'};
				//nodes.max()
				_max = (max == null) ? DEFAULT_MAX : ((globals.toolset.isIntNumber(max) && max >= 0) ? max : null);
				if(_max == null) throw {name: 'ValueError', message: 'incorrect max value: not positive integer number < ' + _max + ' >'};

				if(_min > _max) {
					throw {
						name: 'ValueError',
						message: 'incorrect initialization arguments: min < ' + _min + ' >, max < ' + _max + ' >'
					};
				}

				var numBits = _max - _min + 1;
				var numBytes = (numBits % BITSPERWORD) ? Math.floor((1 + numBits / BITSPERWORD)) : (numBits / BITSPERWORD);

				_data = globals.toolset.vector(numBytes, 0);

				_count = 0;
				initialize(nodes);
			};
			BitSet2.prototype = that;

			globals.collections.set.BitSet2 = BitSet2;
		}());
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));
