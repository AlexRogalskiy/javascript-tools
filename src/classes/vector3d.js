(function (globals) {
  'use strict';
  //------------------------------------------------------------------------------
  globals.utils = globals.utils || {};
  //------------------------------------------------------------------------------
  var isVector3d = function (x) {
    return x instanceof globals.utils.vector.vector3d;
  };
  //------------------------------------------------------------------------------
  (function () {
    globals.utils.vector = globals.utils.vector || {};
    //------------------------------------------------------------------------------
    var vector3d = function (spec) {
      var vx = (vy = vz = 0);
      //var that = {};
      var that = Object.create(globals.utils.vector.vector3d.prototype);
      //that.prototype = globals.utils.vector.vector3d;
      //
      var init = function () {
        if (!globals.toolset.isNull(spec)) {
          if (!globals.toolset.isObject(spec)) {
            throw {
              name: 'ValueError',
              message: 'incorrect initialization value: [object] <' + spec + '>',
            };
          }
          if (
            Object.prototype.hasOwnProperty.call(spec, 'x') &&
            Object.prototype.hasOwnProperty.call(spec, 'z') &&
            Object.prototype.hasOwnProperty.call(
              spec,
              'y'
            ) /*spec.hasOwnProperty('x') && spec.hasOwnProperty('y') && spec.hasOwnProperty('z')*/ &&
            globals.toolset.isNumber(spec.x) &&
            globals.toolset.isNumber(spec.y) &&
            globals.toolset.isNumber(spec.z)
          ) {
            vx = spec.x;
            vy = spec.y;
            vz = spec.z;
          } else {
            var o = Object.create(Error.prototype, {
              name: 'ValueError',
              message: "incorrect initialization values: {'x': [number], 'y': [number], 'z': [number]}",
            });
            throw o;
            //throw {
            //	name: 'ValueError',
            //	message: 'incorrect initialization values: {\'x\': [number], \'y\': [number], \'z\': [number]}'
            //};
          }
        }
      };

      that.scale = function (scale) {
        if (!globals.toolset.isNumber(scale)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: scale < ' + scale + ' >',
          };
        }
        vx *= scale;
        vy *= scale;
        vz *= scale;
        return this;
      };
      that.scaleXYZ = function (scaleX, scaleY, scaleZ) {
        if (
          !globals.toolset.isNumber(scaleX) ||
          !globals.toolset.isNumber(scaleY) ||
          !globals.toolset.isNumber(scaleZ)
        ) {
          throw {
            name: 'ValueError',
            message:
              'incorrect scale values: scaleX < ' +
              scaleX +
              ' >, scaleY < ' +
              scaleY +
              ' >, scaleZ < ' +
              scaleZ +
              ' >',
          };
        }
        vx *= scaleX;
        vy *= scaleY;
        vz *= scaleZ;
        return this;
      };
      that.add = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        vx += vector2.getCoordX();
        vy += vector2.getCoordY();
        vz += vector2.getCoordZ();
        return this;
      };
      that.sub = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        vx -= vector2.getCoordX();
        vy -= vector2.getCoordY();
        vz -= vector2.getCoordZ();
        return this;
      };
      that.negate = function () {
        vx = -vx;
        vy = -vy;
        vz = -vz;
        return this;
      };
      that.length = function () {
        return Math.sqrt(this.lengthSquared());
      };
      that.lengthSquared = function () {
        return vx * vx + vy * vy + vz * vz;
      };
      that.normalize = function () {
        var len = this.length();
        if (len === 0) {
          throw {
            name: 'LengthError',
            message: 'incorrect vector3d length: < ' + len + ' >',
          };
        }
        vx /= len;
        vy /= len;
        vz /= len;
        return this;
      };
      /*	that.rotate = function(angle) {
				if(!globals.toolset.isNumber(angle)) { throw {
														name: 'ValueError',
														message: 'incorrect input value: angle < ' + angle + ' >'
													};
				}
				var vxx = vx, vyy = vy, vzz = vz, cosVal = Math.cos(angle), sinVal = Math.sin(angle);
				vx = vxx * cosVal - vyy * sinVal + vzz * sinVal;
				vy = vxx * sinVal + vyy * cosVal - vzz * sinVal;
				vz = -vxx * sinVal + vyy * sinVal + vzz * cosVal;
				return this;
			};
			*/
      that.rotate = function (angle) {
        if (!globals.toolset.isNumber(angle)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: angle < ' + angle + ' >',
          };
        }
        var phi = Math.acos(vz / this.length());
        var theta =
          vx > 0
            ? Math.atan2(vy, vx)
            : vx < 0
            ? Math.PI + Math.atan2(vy, vx)
            : vx === 0 && vy >= 0
            ? Math.PI / 2
            : (3 * Math.PI) / 2;
        //
        var vxx = vx,
          vyy = vy,
          cosVal = Math.cos(theta),
          sinVal = Math.sin(theta);
        vx = vxx * cosVal + vyy * sinVal;
        vy = -vxx * sinVal + vyy * cosVal;
        //
        (vxx = vx), (vzz = vz), (cosVal = Math.cos(phi)), (sinVal = Math.sin(phi));
        vx = vxx * cosVal - vzz * sinVal;
        vz = vxx * sinVal + vzz * cosVal;
        this.rotateZ(angle);
        this.rotateZ(theta);
        this.rotateY(phi);
      };
      that.rotateX = function (angle) {
        if (!globals.toolset.isNumber(angle)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: angle < ' + angle + ' >',
          };
        }
        var vyy = vy,
          vzz = vz,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);
        vy = vyy * cosVal - vzz * sinVal;
        vz = vyy * sinVal + vzz * cosVal;
        return this;
      };
      that.rotateY = function (angle) {
        if (!globals.toolset.isNumber(angle)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: angle < ' + angle + ' >',
          };
        }
        var vxx = vx,
          vzz = vz,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);
        vx = vxx * cosVal + vzz * sinVal;
        vz = -vxx * sinVal + vzz * cosVal;
        return this;
      };
      that.rotateZ = function (angle) {
        if (!globals.toolset.isNumber(angle)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: angle < ' + angle + ' >',
          };
        }
        var vxx = vx,
          vyy = vy,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);
        vx = vxx * cosVal - vyy * sinVal;
        vy = vxx * sinVal + vyy * cosVal;
        return this;
      };
      that.shift = function (deltaX, deltaY, deltaZ) {
        if (
          !globals.toolset.isNumber(deltaX) ||
          !globals.toolset.isNumber(deltaY) ||
          !globals.toolset.isNumber(deltaZ)
        ) {
          throw {
            name: 'ValueError',
            message:
              'incorrect shift values: deltaX < ' +
              deltaX +
              ' >, deltaY < ' +
              deltaY +
              ' >, deltaZ < ' +
              deltaZ +
              ' >',
          };
        }
        vx += deltaX;
        vy += deltaY;
        vz += deltaZ;
        return this;
      };
      that.toString = function () {
        return '(x: ' + vx.toFixed(3) + ', y: ' + vy.toFixed(3) + ', z: ' + vz.toFixed(3) + ')';
      };
      that.vectorMult = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        var vxx = vx * vector2.getCoordZ() - vz * vector2.getCoordY();
        var vyy = vz * vector2.getCoordX() - vx * vector2.getCoordZ();
        var vzz = vx * vector2.getCoordY() - vy * vector2.getCoordX();
        return globals.utils.vector.vector3d({ x: vxx, y: vyy, z: vzz });
      };
      that.scalarMult = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        var res = vx * vector2.getCoordX() + vy * vector2.getCoordY() + vz * vector2.getCoordZ();
        return res;
      };
      that.distance = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        var resX = (vx - vector2.getCoordX()) * (vx - vector2.getCoordX());
        var resY = (vy - vector2.getCoordY()) * (vy - vector2.getCoordY());
        var resZ = (vz - vector2.getCoordZ()) * (vz - vector2.getCoordZ());
        var res = resX + resY + resZ;
        return res > 0 ? Math.sqrt(res) : 0;
      };
      that.angle = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        var res = Math.acos(this.scalarMult(vector2) / (this.length() * vector2.length()));
        return res;
      };
      that.equals = function (vector2) {
        if (!isVector3d(vector2)) {
          throw {
            name: 'ValueError',
            message: 'not vector3d instance: < ' + vector2 + ' >',
          };
        }
        return vx === vector2.getCoordX() && vy === vector2.getCoordY() && vz === vector2.getCoordZ();
      };
      that.toMatrix = function () {
        return globals.utils.matrix(('matrix': [vx, vy, vz]));
      };
      that.toSphereCoordinates = function () {
        var vr = this.length(),
          vpsi = Math.asin(vz / vr),
          vphi = vy / Math.sqrt(vx * vx + vy * vy);
        return { r: vr, psi: vpsi, phi: vphi };
      };
      ///////// [begin] getter / setter methods [begin] ///////
      that.getCoordX = function () {
        return vx;
      };
      that.getCoordY = function () {
        return vy;
      };
      that.getCoordZ = function () {
        return vz;
      };
      /**
       * Returns true if this point is equal to another one
       * @param {fabric.Point} that
       * @return {Boolean}
       */
      that.equal = function (obj) {
        return this.vx === obj.vx && this.vy === obj.vy && this.vz === obj.vz;
      };
      that.setCoordX = function (x) {
        if (!globals.toolset.isNumber(x)) {
          throw {
            name: 'ValueError',
            message: 'incorrect coord-X value: < ' + x + ' >',
          };
        }
        vx = x;
      };
      that.setCoordY = function (y) {
        if (!globals.toolset.isNumber(y)) {
          throw {
            name: 'ValueError',
            message: 'incorrect coord-Y value: < ' + y + ' >',
          };
        }
        vy = y;
      };
      that.setCoordZ = function (z) {
        if (!globals.toolset.isNumber(z)) {
          throw {
            name: 'ValueError',
            message: 'incorrect coord-Z value: < ' + z + ' >',
          };
        }
        vz = z;
      };
      that.clone = function () {
        return globals.utils.vector.vector3d({ x: vx, y: vy, z: vz });
      };
      /////////  [end] getter / setter methods [end] ///////
      init();
      return that;
    };
    //------------------------------------------------------------------------------
    globals.utils.vector.vector3d = vector3d;
    //------------------------------------------------------------------------------
  })();
})(this);
