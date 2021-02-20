;(function(globals) {
	'use strict';
//------------------------------------------------------------------------------
	globals.utils = globals.utils || {};
//------------------------------------------------------------------------------
	var isPoint2d = function(x) {
		return (x instanceof globals.utils.point.point2d);
	};
//------------------------------------------------------------------------------
	(function() {
		globals.utils.point = globals.utils.point || {};
//------------------------------------------------------------------------------
		var point2d = function(spec) {
			var vx = vy = 0;
			//var that = {};
			var that = Object.create(globals.utils.point.point2d.prototype);
			//that.prototype = globals.utils.point.point2d;
			//
			var init = function() {
				if(!globals.toolset.isNull(spec)) {
					if(!globals.toolset.isObject(spec)) { throw {
														name: 'ValueError',
														message: 'incorrect initialization value: [object] <' + spec + '>'
													};
					}
					if(Object.prototype.hasOwnProperty.call(spec, 'x') && Object.prototype.hasOwnProperty.call(spec, 'y')/*spec.hasOwnProperty('x') && spec.hasOwnProperty('y')*/ && globals.toolset.isNumber(spec.x) && globals.toolset.isNumber(spec.y)) {
						vx = spec.x;
						vy = spec.y;
					} else {
						var o = Object.create(Error.prototype, {name: 'ValueError', message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'});
						throw o;
						//throw {
						//	name: 'ValueError',
						//	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number]}'
						//};
					}
				}
			};
			that.addEquals = function(point2d) {
				if(!isPoint2d(point2d)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: not a point2d < ' + point2d + ' >'
										  };
				}
				vx += point2d.vx;
				vy += point2d.vy;
				return this;
			};
			that.addScalar = function(scalar) {
				if(!globals.toolset.isNumber(scalar)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: scalar < ' + scalar + ' >'
													};
				}
				vx += scalar;
				vy += scalar;
				return this;
			};
			that.sum = function(point2d) {
				if(!isPoint2d(point2d)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: not a point2d instance < ' + point2d + ' >'
										  };
				}
				return globals.utils.point.point2d({ 'x': vx + point2d.vx, 'y': vy + point2d.vy });
			};
			/**
			 * Subtracts value from this point
			 * @param {Number} scalar
			 * @return {fabric.Point} thisArg
			 * @chainable
			 */
			that.subtract = function(scalar) {
				vx -= scalar;
				vy -= scalar;
				return this;
			};
			/**
			 * Subtracts another point from this point
			 * @param {fabric.Point} that
			 * @return {fabric.Point} thisArg
			 * @chainable
			 */
			that.diff = function(point2d) {
				return globals.utils.point.point2d({ 'x': vx - point2d.vx, 'y': vy - point2d.vy });
			};
			/**
			 * Divides this point by a value
			 * TODO: rename in scalarDivideEquals in 2.0
			 * @param {Number} scalar
			 * @return {fabric.Point} thisArg
			 * @chainable
			 */
			that.divide = function(scalar) {
				vx /= scalar;
				vy /= scalar;
				return this;
			};
			that.multiply = function(scalar) {
				vx *= scalar;
				vy *= scalar;
				return this;
			};
			that.scale = function(scale) {
				if(!globals.toolset.isNumber(scale)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: scale < ' + scale + ' >'
													};
				}
				vx *= scale;
				vy *= scale;
				return this;
			};
			/**
			 * Returns true if this point is less than another one
			 * @param {fabric.Point} that
			 * @return {Boolean}
			 */
			that.lt = function(point2d) {
				return (vx < point2d.vx && vy < point2d.vy);
			};
			/**
			 * Returns true if this point is less than or equal to another one
			 * @param {fabric.Point} that
			 * @return {Boolean}
			 */
			that.lte = function(point2d) {
				return (vx <= point2d.vx && vy <= point2d.vy);
			};
			/**
			 * Returns true if this point is greater another one
			 * @param {fabric.Point} that
			 * @return {Boolean}
			 */
			that.gt = function(point2d) {
				return (vx > point2d.vx && vy > point2d.vy);
			};
			/**
			 * Returns true if this point is greater than or equal to another one
			 * @param {fabric.Point} that
			 * @return {Boolean}
			 */
			that.gte = function(point2d) {
				return (vx >= point2d.vx && vy >= point2d.vy);
			};
			/**
			 * Returns new point which is the result of linear interpolation with this one and another one
			 * @param {fabric.Point} that
			 * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
			 * @return {fabric.Point}
			 */
			that.lerp = function(point2d, t) {
				t = t || 0.5;
				t = Math.max(Math.min(1, t), 0);
				return new Point(this.vx + (point2d.vx - this.vx) * t, this.vy + (point2d.vy - this.vy) * t);
			};
			distanceFrom: function(point2d) {
				var dx = this.vx - point2d.vx;
				var dy = this.vy - point2d.vy;
				return Math.sqrt(dx * dx + dy * dy);
			};
			/**
			 * Returns the point between this point and another one
			 * @param {fabric.Point} that
			 * @return {fabric.Point}
			 */
			midPointFrom: function(point2d) {
				return that.lerp(point2d);
			};
			/**
			 * Returns a new point which is the min of this and another one
			 * @param {fabric.Point} that
			 * @return {fabric.Point}
			 */
			min: function (point2d) {
			  return new Point(Math.min(this.vx, point2d.vx), Math.min(this.vy, point2d.vy));
			};
			/**
			 * Returns a new point which is the max of this and another one
			 * @param {fabric.Point} that
			 * @return {globals.libs.Point}
			 */
			max: function (point2d) {
			  return new Point(Math.max(this.vx, point2d.vx), Math.max(this.vy, point2d.vy));
			};
			/**
			 * Returns string representation of this point
			 * @return {String}
			 */
			toString: function () {
			  return this.vx + ',' + this.vy;
			};
			/**
			 * Sets x/y of this point
			 * @param {Number} x
			 * @param {Number} y
			 * @chainable
			 */
			setXY: function (x, y) {
				this.vx = x;
				this.vy = y;
				return this;
			},
			/**
			 * Sets x of this point
			 * @param {Number} x
			 * @chainable
			 */
			setX: function (x) {
				this.vx = x;
				return this;
			},
			/**
			 * Sets y of this point
			 * @param {Number} y
			 * @chainable
			 */
			setY: function (y) {
				this.vy = y;
				return this;
			},
			/**
			 * Sets x/y of this point from another point
			 * @param {fabric.Point} point2d
			 * @chainable
			 */
			setFromPoint: function (point2d) {
				this.x = point2d.vx;
				this.y = point2d.vy;
				return this;
			},
			/**
			 * Swaps x/y of this point and another point
			 * @param {fabric.Point} point2d
			 */
			swap: function (point2d) {
				var x = this.vx, y = this.vy;
				this.x = point2d.vx;
				this.y = point2d.vy;
				point2d.vx = x;
				point2d.vy = y;
			},

			/**
			 * return a cloned instance of the point
			 * @return {fabric.Point}
			 */
			clone: function () {
				return new Point(this.vx, this.vy);
			}
			/**
			 * Returns true if this point is equal to another one
			 * @param {fabric.Point} that
			 * @return {Boolean}
			 */
			that.equal = function(obj) {
				return (this.vx === obj.vx && this.vy === obj.vy);
			};
			/////////  [end] getter / setter methods [end] ///////
			init();
			return that;
		};
//------------------------------------------------------------------------------
		globals.utils.point.point2d = point2d;
//------------------------------------------------------------------------------
	}());
})(this);