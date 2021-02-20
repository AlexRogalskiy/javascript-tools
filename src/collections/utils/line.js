;(function(globals) {
	'use strict';
//------------------------------------------------------------------------------
	globals.collections = globals.collections || {};
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
	const isTrie = (value) => (value instanceof globals.collections.utils.Line);
//------------------------------------------------------------------------------
	/* @public
	* @module collections
	* @param {Array} nodes Input array of nodes.
	* @param {Function} compare Optional. A function that defines an
	* alternative sort order. The function should return a negative,
	* zero, or positive value, depending on the arguments.
	* @return {Object} Point3d.
	*
	* @example
	* var point3d = new globals.collections.utils.Line([new globals.collections.utils.Point3d(1, 1, 1), new globals.collections.utils.Point3d(2, 2, 2), ...]);
	*/
	(function() {
		globals.collections.utils = globals.collections.utils || {};
//------------------------------------------------------------------------------
		(function() {
			var _points = null;
			
			var isInRange = function(num) {
				return (num < _points.length && num >= 0);
			};
			
			var that = {};
			that.getPoints = function() {
				return _points;
			};
			
			that.setPoints = function(points) {
				_points = points;
			};
			
			that.addAt = function(point, index) {
				if(!(point instanceof globals.collections.utils.Point3d)) {
					throw {
						name: 'TypeError',
						message: 'incorrect input parameter: <point> is not Point3d instance  < ' + point + ' >'
					};
				}
				if(!globals.toolset.isIntNumber(index)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: <index> not integer number < ' + index + ' >'
													};
				}
				if(!isInRange(index)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}');
				}
				_points.splice(index, 0, point);
			};
			
			that.removeAt = function(index) {
				if(!globals.toolset.isIntNumber(index)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: <index> not positive integer number < ' + index + ' >'
													};
				}
				if(!isInRange(index)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}');
				}
				return _points.splice(index, 1);
			};
			
			that.removeAll = function() {
				return _points.splice(0, this.size());
			};
			
			that.updateAt = function(index, value) {
				if(!globals.toolset.isIntNumber(index)) { throw {
														name: 'TypeError',
														message: 'incorrect input argument: <index> not positive integer number < ' + index + ' >'
													};
				}
				if(!isInRange(index)) {
					throw globals.exception.argumentException('OutOfBoundsError', 'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}');
				}
				_points[index] = value;
			};
			
			that.equals = function(line) {
				if(line == this) return true;
				if(!(line instanceof globals.collections.utils.Line)) return false;
				//if((node == null) || (node.getClass() != this.getClass())) return false;
				//return (_end === node.getEnd());
				return (_points === line.getPoints() || (_points != null && _points.equals(line.getPoints())));
			};
						
			that.hashCode = function() {
				var hashValue = 11;
				
				var sfVal = (_points == null) ? 0 : _points.hashCode();
				hashValue = 31 * hashValue + sfVal;
				
				return hashValue;
			};
			
			that.size = function() {
				return _points.length;
			};
			
			that.clone = function() {
				return new globals.collections.utils.Line(_points, compare);
			};
			
			that.toString = function() {
				var str = '';
				_points.foreach(function(item, i, arr) {
					str += '(x: {' + item.getX() + '}, y: {' + item.getY() + '}, z: {' + item.getZ() + '})\n';
				});
				return str;
			};
			
			var initialize = function(nodes) {
				if(!globals.toolset.isNull(nodes)) {
					if(!globals.toolset.isArray(nodes)) { throw {
															name: 'ValueError',
															message: 'incorrect initialization value: array of elements < ' + nodes + ' >'
														};
					}
					for(var i=0; i<nodes.length; i++) {
						_points.push(Object.clone(nodes[i]));
					}
				}
			};
						
			function Line(points) {
				_points = globals.toolset.vector();
				initialize(nodes);
				compare = globals.toolset.isFunction(cmp) ? cmp : compare;
			};
			Line.prototype = that;
						
			globals.collections.utils.Line = Line;
		}());
	}());
}(typeof exports !== 'undefined' ? exports : this));