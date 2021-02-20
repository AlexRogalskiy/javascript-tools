jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.complex = function(spec) {
	var cx = cy = cr = cphi = 0;
	//var that = {};
	var that = Object.create(jsar.utils.complex.prototype);
	//that.prototype = jsar.utils.complex;
	//
	var init = function() {
		if(!jsar.toolset.isNull(spec)) {
			if(!jsar.toolset.isObject(spec)) {
				throw jsar.exception.typeException({name: 'TypeException', message: 'incorrect initialization value: [object]'});
					//throw {
					//	name: 'ValueError',
					//	message: 'incorrect initialization value: [object]'
					//};
			}
			if(Object.prototype.hasOwnProperty.call(spec, 'x') && Object.prototype.hasOwnProperty.call(spec, 'y')/*spec.hasOwnProperty('x') && spec.hasOwnProperty('y')*/ && jsar.toolset.isNumber(spec.x) && jsar.toolset.isNumber(spec.y)) {
				cx = spec.x;
				cy = spec.y;
				that.convertToTrig();
			} else if(Object.prototype.hasOwnProperty.call(spec, 'r') && Object.prototype.hasOwnProperty.call(spec, 'phi')/*spec.hasOwnProperty('r') && spec.hasOwnProperty('phi')*/ && jsar.toolset.isNumber(spec.r) && jsar.toolset.isNumber(spec.phi)) {
				cr = spec.r;
				cphi = spec.phi;
				that.convertToAlg();
			} else {
				throw jsar.exception.argumentException({name: 'ArgumentException', message: 'incorrect initialization value: {\'x\': [number], \'y\': [number]} or {\'r\': [number], \'phi\': [number]}'});
				//throw {
				//	name: 'ValueError',
				//	message: 'incorrect initialization value: {\'x\': [number], \'y\': [number]} or {\'r\': [number], \'phi\': [number]}'
				//};
			}
		}
	};
	var convertToAlg = function() {
		cx = cr * Math.cos(cphi);
		cy = cr * Math.sin(cphi);
	};
	var convertToTrig = function() {
		cr = Math.sqrt(cx * cx + cy * cy);
		cphi = Math.atan2(cy, cx);
	};
	var isComplex = function(x) {
		return (x instanceof jsar.utils.complex);
	};
	that.toAlgebraicString = function() {
		return '(' + cx.toFixed(3) + ' + ' + cy.toFixed(3) + ' * i)';
	};
	that.toTrigonometricString = function() {
		return '(' + cr.toFixed(3) + ' * exp(' + cphi.toFixed(3) + ' * i))';
	};
	that.getReal = function() {
		return cx;
	}:
	that.getImag = function() {
		return cy;
	};
	that.getR = function() {
		return cr;
	};
	that.getPhi = function() {
		return cphi;
	};
	that.add = function(complex2) {
		if(!isComplex(complex2)) { throw {
									name: 'ValueError',
									message: 'not complex number instance: < ' + complex2 + ' >'
								};
		}
		cx += complex2.getReal();
		cy += complex2.getImag();
		convertToTrig();
	};
	that.sub = function(complex2) {
		if(!isComplex(complex2)) { throw {
									name: 'ValueError',
									message: 'not complex number instance: < ' + complex2 + ' >'
								};
		}
		cx -= complex2.getReal();
		cy -= complex2.getImag();
		convertToTrig();
	};
	that.mult = function(complex2) {
		if(!isComplex(complex2)) { throw {
									name: 'ValueError',
									message: 'not complex number instance: < ' + complex2 + ' >'
								};
		}
		var cxx = cx * complex2.getReal() - cy * complex2.getImag();
		var cyy = cx * complex2.getImag() + cy * complex2.getReal();
		//var cxx = cr * complex2.getR() * Math.cos(cphi + complex2.getPhi());
		//var cyy = cr * complex2.getR() * Math.sin(cphi + complex2.getPhi());
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.div = function(complex2) {
		if(!isComplex(complex2)) { throw {
									name: 'ValueError',
									message: 'not complex number instance: < ' + complex2 + ' >'
								};
		}
		var cxx = (cx * complex2.getReal() + cy * complex2.getImag()) / (complex2.getReal() * complex2.getReal() + complex2.getImag() * complex2.getImag()), cyy = (cy * complex2.getReal() - cx * complex2.getImag()) / (complex2.getReal() * complex2.getReal() + complex2.getImag() * complex2.getImag());
		//var cxx = (cr / complex2.getR()) * Math.cos(cphi - complex2.getPhi());
		//var cyy = (cr / complex2.getR()) * Math.sin(cphi - complex2.getPhi());
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.scale = function(value) {
		if(!jsar.toolset.isNumber(value) || value === 0) { throw {
																name: 'ValueError',
																message: 'incorrect input value: scale < ' + value + ' >'
														};
		}
		cx /= value;
		cy /= value;
		convertToTrig();
	};
	//that.getSource = function() {
	//	return {'re': cx, 'im': cy, 'r': cr, 'phi': cphi};
	//};
	that.addnum = function(value) {
		if(!jsar.toolset.isNumber(n)) { throw {
											name: 'ValueError',
											message: 'incorrect input value: number < ' + value + ' >'
									};
		}
		cx += value;
		convertToTrig();
	};
	that.subnum = function(value) {
		if(!jsar.toolset.isNumber(n)) { throw {
											name: 'ValueError',
											message: 'incorrect input value: number < ' + value + ' >'
										};
		}
		cx -= value;
		convertToTrig();
	};
	that.exp = function() {
		var cxx = Math.exp(cx) * Math.cos(cy);
		var cyy = Math.exp(cx) * Math.sin(cy);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.power = function(n) {
		if(!jsar.toolset.isNumber(n)) { throw {
											name: 'ValueError',
											message: 'incorrect power value: < ' + n + ' >'
									};
		}
		var rr = Math.pow(cr, n), rphi = n * cphi;
		var cxx = rr * Math.cos(rphi);
		var cyy = rr * Math.sin(rphi);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.sqrt = function() {
		var rr = Math.sqrt(cr), rphi = cphi / 2;
		var cxx = rr * Math.cos(rphi);
		var cyy = rr * Math.sin(rphi);
		return [jsar.utils.complex({'x': cxx, 'y': cyy}), jsar.utils.complex({'x': cxx, 'y': -cyy})];
	};
	that.cos = function() {
		var cxx = Math.cos(cx) * ((Math.exp(cy) + Math.exp(-cy)) / 2);
		var cyy = Math.sin(cx) * ((Math.exp(cy) - Math.exp(-cy)) / 2);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.sin = function() {
		var cxx = Math.sin(cx) * ((Math.exp(cy) + Math.exp(-cy)) / 2);
		var cyy = -Math.cos(cx) * ((Math.exp(cy) - Math.exp(-cy)) / 2);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.ch = function() {
		var cxx = ((Math.exp(cx) + Math.exp(-cx)) / 2) * Math.cos(cy);
		var cyy = -((Math.exp(cx) - Math.exp(-cx)) / 2) * Math.sin(cy);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};
	that.sh = function() {
		var cxx = -((Math.exp(cx) - Math.exp(-cx)) / 2) * Math.cos(cy);
		var cyy = ((Math.exp(cx) + Math.exp(-cx)) / 2) * Math.sin(cy);
		return jsar.utils.complex({'x': cxx, 'y': cyy});
	};//http://www.milefoot.com/math/complex/functionsofi.htm
	that.ln = function() {
		var rr = Math.log(cr);
		return jsar.utils.complex({'x': rr, 'y': cphi});
	};
	that.log10 = function() {
		var rr = (1 / Math.LN10) * Math.log(cr); //Math.log(x) / Math.LN10
		var rphi = (1 / Math.LN10) * cphi;
		return jsar.utils.complex({'x': rr, 'y': rphi});
	};
	that.log2 = function() {
		var rr = (1 / Math.LN2) * Math.log(cr); //Math.log(x) / Math.LN2
		var rphi = (1 / Math.LN2) * cphi;
		return jsar.utils.complex({'x': rr, 'y': rphi});
	};
	that.equals = function(complex2) {
		if(!isComplex(complex2)) { throw {
									name: 'ValueError',
									message: 'not complex number instance: < ' + complex2 + ' >'
								};
		}
		//if(complex2.getReal() === 0 && complex2.getImag() === 0) { throw {
		//												name: 'DivisionError',
		//												message: 'division by zero'
		//											};
		//}
		return ((cx === complex2.getReal() && cy === complex2.getImag()) || (cr === complex2.getR() && cphi === complex2.getPhi()));
	};
	that.clone = function() {
		return jsar.utils.complex({'x': cx, 'y': cy});
	};
	that.complement = function() {
		return jsar.utils.complex({'x': cxx, 'y': -cyy});
	};
	init();
	return that;
};