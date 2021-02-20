;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		RegExp.method('reset', function() {
			this.lastIndex = 0;
			return this;
		});
//----------------------------------------------------------------------------------------------
		RegExp.method('forEach', function(str, fun, scope) {
			if(!jsar.toolset.isString(str) || !jsar.toolset.isFunction(fun)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: string < ' + str + ' >, function < ' + fun + ' >'
																			};
			}
			this.reset();
			for(var res = null; (res = this.exec(str)) != null;) {
				if(fun.apply(scope, res) === false) break;
			}
			return this;
		});
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this));