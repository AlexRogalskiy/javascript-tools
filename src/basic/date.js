;(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	];
	const dayNames = {
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	];
//----------------------------------------------------------------------------------------------
	(function() {
//----------------------------------------------------------------------------------------------
		Date.method('equals', function(date) {
			if(date == this) return true;
			if(!globals.toolset.isObject(date)) return false;
			return (this.toString() === date.toString());
		});
//----------------------------------------------------------------------------------------------
		Date.method('toDayDate', function() {
			return dayNames[this.getDay()].toString() + ' ' + this.getDate();
		});
//----------------------------------------------------------------------------------------------
		Date.method('toDayDate', function() {
			return this.toString().slice(0, 3) + ' ' + this.toString().slice(8, 10);
		});
//----------------------------------------------------------------------------------------------
		Date.method('toYMD', function() {
			var d = this.getDate();
			var m = this.getMonth() + 1;
			var y = this.getFullYear();
			return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
		});
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns current date
		 */
		Date.method('currentDate', function() {
			const now = this;
			return ((now.getDate() < 10) ? '0' : '') + now.getDate() + '/' + (((now.getMonth()+1) < 10) ? '0' : '') + (now.getMonth() + 1) + '/' + now.getFullYear();
		});
//----------------------------------------------------------------------------------------------
		/**
		 * 	returns current time
		 */
		Date.method('currentTime', function() {
			const now = this;
			return ((now.getHours() < 10) ? '0' : '') + now.getHours() + ':' + ((now.getMinutes() < 10) ? '0' : '') + now.getMinutes() + ':' + ((now.getSeconds() < 10) ? '0' : '') + now.getSeconds();
		});
//----------------------------------------------------------------------------------------------
		//today.format("dd-m-yy");
		Date.method('format', function(mask, utc) {
			return dateFormat(this, mask, utc);
		});
//----------------------------------------------------------------------------------------------
		Date.method('format2', function(format) {
			const o = {
				"M+" : this.getMonth()+1, //month
				"d+" : this.getDate(),    //day
				"h+" : this.getHours(),   //hour
				"m+" : this.getMinutes(), //minute
				"s+" : this.getSeconds(), //second
				"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
				"S" : this.getMilliseconds() //millisecond
			};
			if(/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
			for(var k in o) {
				if(new RegExp("("+ k +")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		});
//----------------------------------------------------------------------------------------------
		/*
		* @example
		* var now=new Date();
		* now.customFormat('#DDDD#, #MMMM# #D##th#')
		* now.customFormat('#h#:#mm##ampm#')
		*/
		Date.method('customFormat', function(formatStr) {
			if(!globals.toolset.isString(formatStr)) { throw {
											name: 'ValueError',
											message: 'incorrect format string: < ' + formatStr + ' >'
										};
			}
			var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,dMod,th;
			YY = ((YYYY = this.getFullYear()) + "").substr(2,2);
			MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
			MMM = (MMMM = monthNames[M-1]).substr(0,3);
			DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
			DDD = (DDDD = dayNames[this.getDay()]).substr(0,3);
			th = (D >= 10 && D <= 20) ? 'th': ((dMod = D%10) == 1) ? 'st': (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
			formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

			h=(hhh = this.getHours());
			if (h == 0) h = 24;
			if (h > 12) h -= 12;
			hh = h < 10 ? ('0' + h) : h;
			ampm = hhh < 12 ? 'am' : 'pm';
			mm=(m = this.getMinutes()) < 10 ? ('0' + m) : m;
			ss=(s = this.getSeconds()) < 10 ? ('0' + s) : s;
			return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm);
		});
//----------------------------------------------------------------------------------------------
		//For example, this code will adjust a date 3 months and 5 days into the future:
		//var d = new Date();
		//d.adjust(0, 3, 5, 0, 0, 0);
		Date.staticMethod('adjust', function(yr,mn,dy,hr,mi,se) {
			var m,t;
			this.setYear(this.getFullYear() + yr);
			m = this.getMonth() + mn;
			if(m !== 0) { this.setYear(this.getFullYear() + Math.floor(m/12)); }
			if(m < 0) {
				this.setMonth(12 + (m%12));
			} else if(m > 0) {
				this.setMonth(m%12);
			}
			t = this.getTime();
			t += (dy * 86400000);
			t += (hr * 3600000);
			t += (mi * 60000);
			t += (se * 1000);
			this.setTime(t);
		});
//----------------------------------------------------------------------------------------------
		Date.staticMethod('toLexical', function(date) {
			if(!globals.toolset.isDate(date)) { throw {
														name: 'ValueError',
														message: 'incorrect date instance: < ' + date + ' >'
													};
			}
			var diff = (((new Date()).getTime() - date.getTime()) / 1000);
			var day_diff = Math.floor(diff / 86400);
			return 	day_diff == 0 &&
				diff < 60 && 'just now' ||
				diff < 120 && '1 minute ago' ||
				diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
				diff < 7200 && '1 hour ago' ||
				diff < 86400 && Math.floor(diff / 3600) + " hours ago" ||
				day_diff == 1 && 'Yesterday' ||
				day_diff < 7 && day_diff + ' days ago' ||
				Math.ceil(day_diff / 7) + ' weeks ago';
		});
//----------------------------------------------------------------------------------------------
		Date.staticMethod('format', function(date, pattern) {
			const patternParts = /^(yy(yy)?|M9M(M(M)?)?)?|d(d)?|EEE(E)?|a}H(H)?|h(h)?|m(m)?|s(s)?|S)/;
			const patternValue = {
				yy: function(date) {
					return String.toFixedWidth(date.getFullYear(), 2);
				},
				yyyy: function(date) {
					return date.getFullYear().toString();
				},
				MMMM: function(date) {
					return monthNames[date.getMonth()];
				},
				MMM: function(date) {
					return this.MMMM(date).substr(0, 3);
				},
				MM: function(date) {
					return String.toFixedWidth(this.M(date), 2);
				},
				M: function(date) {
					return date.getMonth() + 1;
				},
				dd: function(date) {
					return String.toFixedWidth(this.d(date), 2);
				},
				d: function(date) {
					return date.getDate();
				},
				EEEE: function(date) {
					return dayNames[date.getDay()];
				},
				EEE: function(date) {
					return this.EEEE(date).substr(0, 3);
				},
				HH: function(date) {
					return String.toFixedWidth(this.H(date), 2);
				},
				H: function(date) {
					return date.geHours();
				},
				hh: function(date) {
					const hours = this.H(date);
					return String.toFixedWidth(hours > 12 ? hours - 12 : hours, 2);
				},
				h: function(date) {
					return this.H(date) % 12;
				},
				mm: function(date) {
					return String.toFixedWidth(this.m(date), 2);
				},
				m: function(date) {
					return date.getMinutes();
				},
				ss: function(date) {
					return String.toFixedWidth(this.s(date), 2);
				},
				s: function(date) {
					return date.getSeconds();
				},
				S: function(date) {
					return String.toFixedWidth(date.getMilliseconds(), 3);
				},
				SS: function(date) {
					return thi.H(date) < 12 ? 'AM' : 'PM';
				}
			};

			if(!globals.toolset.isString(pattern)) { throw {
														name: 'ValueError',
														message: 'incorrect format string: < ' + pattern + ' >'
													};
			}
			if(!globals.toolset.isDate(date)) { throw {
														name: 'ValueError',
														message: 'incorrect date instance: < ' + date + ' >'
													};
			}
			const result = [];
			while(pattern.length > 0) {
				patternParts.lastIndex = 0;
				var matched = patternParts.exec(pattern);
				if(matched) {
					result.push(patternValue[matched[0].call(this, date));
					pattern = pattern.slice(matched[0].length);
				} else {
					result.push(pattern.charAt(0));
					pattern = pattern.slice(1);
				}
			}
			return result.join('');
		});
//----------------------------------------------------------------------------------------------
	}());
}(typeof exports !== 'undefined' ? exports : this);

//new Date().format("yyyy-MM-dd")
//new Date("january 12 2008 11:12:30").format("yyyy-MM-dd h:mm:ss")
