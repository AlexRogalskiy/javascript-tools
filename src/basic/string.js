(function(globals) {
	'use strict';
//----------------------------------------------------------------------------------------------
	(function() {
		/**
		* @private
		* @module string
		* @param {String} str Input string.
		* @param {Integer} i Index of character.
		* @return {String} Character at a particular position
		*/
		var getChars = function(str, i) {
			var code = str.charCodeAt(i);
			if(0xD800 <= code && code <= 0xDBFF) {
				// Верхний вспомогательный
				if(str.length <= (i+1))  {
					throw 'High surrogate without following low surrogate';
				}
				var next = str.charCodeAt(i+1);
				if(0xDC00 > next || next > 0xDFFF) {
					throw 'High surrogate without following low surrogate';
				}
				return str[i] + str[i + 1];
			} else if(0xDC00 <= code && code <= 0xDFFF) {
				// Нижний вспомогательный
				if(i === 0) {
					throw 'Low surrogate without preceding high surrogate';
				}
				var prev = str.charCodeAt(i - 1);
				if(0xD800 > prev || prev > 0xDBFF) {
					throw 'Low surrogate without preceding high surrogate';
				}
				return '';
			}
			return str[i];
		};
//----------------------------------------------------------------------------------------------
		/**
		* @public
		* @module stromg
		* @param {Integer} codePt Character position in string.
		* @return {String} Character at a particular place.
		*/
		String.method('fixedFromCharCode', function(codePt) {
			if (codePt > 0xFFFF) {
				codePt -= 0x10000; 
				return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF)); 
			} else {
				return String.fromCharCode(codePt); 
			}
		});
//----------------------------------------------------------------------------------------------
		String.method('camelize', function() {
			return this.replace(/-+(.)?/g, function(match, character) {
				return character ? character.toUpperCase() : '';
			});
		});
//----------------------------------------------------------------------------------------------
		String.method('capitalize', function() {
			return this.charAt(0).toUpperCase() + (firstLetterOnly ? this.slice(1) : this.slice(1).toLowerCase());
		});
//----------------------------------------------------------------------------------------------
		String.method('escapeXml', function() {
			return this.replace(/&/g, '&amp;')
					   .replace(/"/g, '&quot;')
					   .replace(/'/g, '&apos;')
					   .replace(/</g, '&lt;')
					   .replace(/>/g, '&gt;');
		});
//----------------------------------------------------------------------------------------------
		/**
		 * Wraps a string around each character/letter
		 *
		 * @param {string} str The string to transform
		 * @param {string} tmpl Template that gets interpolated
		 * @returns {string} The given input as splitted by chars/letters
		 */
		String.method('wrapChars', function(tmpl) {
			tmpl = isString(tmpl) ? tmpl : "<span>$&</span>";
			return this.replace(/\w/g, tmpl);
		});
//----------------------------------------------------------------------------------------------
		/**
		 * Wraps a string around each line
		 *
		 * @param {string} str The string to transform
		 * @param {string} tmpl Template that gets interpolated
		 * @returns {string} The given input splitted by lines
		 */
		String.method('wrapChars', function(tmpl) {
			tmpl = isString(tmpl) ? tmpl : "<span>$&</span>";
			return this.replace(/.+$/gm, tmpl);
		});
//----------------------------------------------------------------------------------------------
		//quote('Hello World', { char: '*' });
		String.method('quote', function({ char = '"', skipIfQuoted = true } = {}) {
			const length = this.length;
			if (skipIfQuoted && this[0] === char && this[length - 1] === char) {
				return this;
			}
			return (char + this + char);
		});
//----------------------------------------------------------------------------------------------
		String.method('equals', function(str) {
			if(str == this) return true;
			if(!(globals.toolset.isString(str) || globals.toolset.isObject(str))) return false;
			return (this.toString() === str.toString());
		});
//----------------------------------------------------------------------------------------------
	  /**
	   * Divide a string in the user perceived single units
	   * @return {Array} array containing the graphemes
	   */
		String.method('graphemeSplit', function() {
			var i = 0, chr, graphemes = [];
			for (i = 0, chr; i < this.length; i++) {
				if ((chr = getWholeChar(this, i)) === false) {
					continue;
				}
				graphemes.push(chr);
			}
			return graphemes;
		});
//----------------------------------------------------------------------------------------------
		String.method('getWholeChar', function(i) {
			var code = this.charCodeAt(i);
			if (isNaN(code)) {
				return ''; // Position not found
			}
			if (code < 0xD800 || code > 0xDFFF) {
				return this.charAt(i);
			}
			// High surrogate (could change last hex to 0xDB7F to treat high private
			// surrogates as single characters)
			if (0xD800 <= code && code <= 0xDBFF) {
				if (this.length <= (i + 1)) {
					throw 'High surrogate without following low surrogate';
				}
				var next = this.charCodeAt(i + 1);
				if (0xDC00 > next || next > 0xDFFF) {
					throw 'High surrogate without following low surrogate';
				}
				return this.charAt(i) + this.charAt(i + 1);
			}
			// Low surrogate (0xDC00 <= code && code <= 0xDFFF)
			if (i === 0) {
				throw 'Low surrogate without preceding high surrogate';
			}
			var prev = this.charCodeAt(i - 1);
			// (could change last hex to 0xDB7F to treat high private
			// surrogates as single characters)
			if (0xD800 > prev || prev > 0xDBFF) {
				throw 'Low surrogate without preceding high surrogate';
			}
			// We can pass over low surrogates now as the second component
			// in a pair which we have already processed
			return false;
		});
//----------------------------------------------------------------------------------------------
		String.method('compress', function() {
			if(this.isEmpty()) return null;
			var r = '';
			var m = this[0], n = 1;
			for(var i=1; i<this.length; i++) {
				if(this[i] == m) {
					n++;
				} else {
					r += n + m;
					m = this[i];
					n = 1;
				}
			}
			return (r + n + m);
		});
//----------------------------------------------------------------------------------------------
		String.method('hashCode', function() {
			var hash = 0;
			var str = this.toString();
			if (str.length === 0) return hash;
			for (var i = 0; i < str.length; i++) {
				hash = ((hash << 5) - hash) + str.charCodeAt(i);
				hash &= hash; // Convert to 32bit integer
			}
			return hash;
		});
		String.method('hashCode2', function() {
			var hash = 5381;
			str = this.toString();
			for (var i = 0; i < str.length; i++) {
				//hash = (hash << 6) + (hash << 16) - hash + str.charCodeAt(i);
				hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
				hash = hash & 0xFFFFFFFF;
			}
			return hash;
		});
//----------------------------------------------------------------------------------------------
		String.method('isEmpty', function() {
			//if a string is blank, null or undefined
			//return (!this || /^\s*$/.test(this));
			//if a string is empty, null or undefined
			//return (!this || 0 === this.length);
			//if a string is blank or contains only white-spaces
			return (!this || this.length === 0 || !this.trim());
		});
//----------------------------------------------------------------------------------------------
		String.method('camelize', function() {
			var strList = this.split('-/\=*_+|(){}[]');
			if(strList.length === 1) {
				return strList[0];
			}
			var strCamelized = this.indexOf('-') == 0
				? strList[0].charAt(0).toUpperCase() + strList[0].substring(1)
				: strList[0];
			for(var i=1, len=strList.length; i<len; i++) {
				var s = strList[i];
				strCamelized += s.charAt(0).toUpperCase() + s.substring(1);
			}
			return strCamelized;
		});
//----------------------------------------------------------------------------------------------
		String.method('knuthMorrisPratt', function(begin, pattern) {
			if(!globals.toolset.isIntNumber(begin) || begin < 0) {
														throw {
															name: 'ValueError',
															message: 'incorrect input value: <begin> position is not positive integer number < ' + begin + ' >'
														};
			}
			if(!globals.toolset.isString(pattern)) {
														throw {
															name: 'ValueError',
															message: 'incorrect input value: <pattern> is not string < ' + pattern + ' >'
														};
			}
			
			if(this.isEmpty()) return -1;
			
			var pf = globals.toolset.vector(pattern.length, 0);
			/* Вычисление префикс-функции */
			for(var k=0, i=1; i<pattern.length; i++) {
				while(k > 0 && pattern[i] != pattern[k]) {
					k = pf[k-1];
				}
				if(pattern[i] == pattern[k]) {
					k++;
				}
				pf[i] = k;
			}
			
			for(var k=0, i=begin; i<this.length; i++) {
				while(k > 0 && pattern[k] != this[i]) {
					k = pf[k-1];
				}
				if(pattern[k] == this[i]) {
					k++;
				}
				if(k == pattern.length) {
					return (i - k + 1);
				}
			}
			return -1;
		});
//----------------------------------------------------------------------------------------------
		String.method('ltrim', function() {
			//if (this.isEmpty()) return this;
			return this.replace(/^\s+/g, '');
		});
//----------------------------------------------------------------------------------------------
		String.method('rtrim', function() {
			return this.replace(/\s+$/g, '');
		});
//----------------------------------------------------------------------------------------------
		String.method('trim', function() {
			return this.ltrim().rtrim(); /*/A\s+|\s+$/g*/ /*or*/ /*/^\s+|\s+$/g*/
		});
//----------------------------------------------------------------------------------------------
		String.method('nbsp', function() {
			return this.replace(/ /g, '&nbsp;');
		});
//----------------------------------------------------------------------------------------------
		String.method('isInt', function() {
			return (/^[+-]?[1-9][\d]*$/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isHex', function() {
			return (/^[+-]?0x[\da-f]+$/i).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isOct', function() {
			return (/^[+-]?0[0-7]+$/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isBin', function() {
			return (/^[01]+$/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isFloat', function() {
			return (/^(\d[\d]*)*\.[\d]*$/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isSci', function() {
			return (/^(\d[\d]*)?\.?[\d]*(e[+-]?)?(\d[\d]*)$/i).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isDate', function() {
			return (/(0?[1-9]|1[0-2])\/([0-2]?[1-9]|[1-3][01])\/(\d\d)(\s)+([01]?[1-9]|[12][0-4]):([0-5]\d):([0-6]\d)?/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isRoman', function() {
			return (/^m{0,3}(d?c{0,3}|c[dm])(l?x{0,3}|x[lc])(v?i{0,3}|i[vx])$/i).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('withRepeats', function() {
			return (/\b(['A-Z]+) +\1\b/i).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('isIPv6', function() {
			return (/^([0-9A-Fa-f]{0,4}:){7}([0-9A-Fa-f]{0,4})$/).test(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('reverse', function() {
			return this.split('').reverse().join('');
		});
//----------------------------------------------------------------------------------------------
		String.method('countWords', function() {
			return this.getWords().length;
		});
//----------------------------------------------------------------------------------------------
		String.method('getWords', function() {
			if(this.isEmpty()) return [];
			//exclude  start and end white-space
			var temp = this.replace(/(^\s*)|(\s*$)/gi, '');
			//2 or more space to 1
			temp = temp.replace(/[ ]{2,}/gi, ' ');
			// exclude newline with a start spacing
			temp = temp.replace(/(\r)?\n /, '\n');
			return temp.split(/\s+/);
			//return this.split(' ');
			//return this.match(/\w+|"[^"]+"/g);
		});
//----------------------------------------------------------------------------------------------
		String.method('getWordAt', function(i) {
			var temp = this.getWords();
			if(!globals.toolset.isIntNumber(i) || i < 0 || i > temp.length-1) { throw {
																					name: 'ValueError',
																					message: 'incorrect input value: char position < ' + i + ' >'
																				};
			}
			return temp[i];
		});
//----------------------------------------------------------------------------------------------
		String.method('getCharAt', function(i) {
			//return ((i < this.length) ? getChars(this, i) : null);
			if(!globals.toolset.isIntNumber(i) || i < 0) { throw {
															name: 'ValueError',
															message: 'incorrect input value: char position < ' + i + ' >'
														};
			}
			for (var ind=0, pos=0, chr; ind < this.length; ind++) {
				if ((chr = getChars(this, ind)) === '') {
					continue;
				}
				if(i === pos++) return chr;
			};
			return null;
		});
//----------------------------------------------------------------------------------------------
		String.method('getLength', function() {
			var len = 0;
			for (var i=0; i < this.length; i++) {
				if ((chr = getChars(this, i)) === '') {
					continue;
				}
				len++;
			};
			return len;
		});
//----------------------------------------------------------------------------------------------
		String.method('insertAt', function(str, n) {
			if(!globals.toolset.isString(str) || !globals.toolset.isIntNumber(n)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: target string < ' + str + ' >, position < ' + n + ' >'
																			};
			}
			return this.slice(0, n) + str + this.slice(n);
		});
//----------------------------------------------------------------------------------------------
		String.method('nthSubstr', function(str, n, repeats) {
			if(!globals.toolset.isString(str) || !globals.toolset.isIntNumber(n)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: search string < ' + str + ' >, n-th position < ' + n + ' >'
																			};
			}
			//
			repeats = (repeats == null) ? false : (globals.toolset.isBoolean(repeats)) ? repeats : null;
			if(repeats == null) throw {name: 'ValueError', message: 'incorrect repeats value: < ' + repeats + ' >'};
			//
			var i = this.indexOf(str);
			var adv = (repeats) ? 1 : str.length;
			for(var j=1; j < n && i != -1; j++) {
				i = this.indexOf(str, i + adv);
			}
			if(j == n) {
				return i;
			}
			return -1;
		});
//----------------------------------------------------------------------------------------------
		String.method('repeatNum', function(str, repeats) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: search string < ' + str + ' >'
											};
			}
			repeats = (repeats == null) ? false : (globals.toolset.isBoolean(repeats)) ? repeats : null;
			if(repeats == null) throw {name: 'ValueError', message: 'incorrect repeats value: < ' + repeats + ' >'};
			//
			var i = this.indexOf(str);
			var adv = (repeats) ? 1 : str.length;
			var count = 0;
			while(i != -1) {
				count++;
				i = this.indexOf(str, i + adv);
			}
			return count;
		});
//----------------------------------------------------------------------------------------------
		String.method('countUnique', function() {
			var chars = '';
			for(var i=0; i<this.length; i++) {
				if(chars.indexOf(this.charAt(i)) === -1) {
					chars += this.charAt(i);
				}
			}
			return chars.length;
		});
//----------------------------------------------------------------------------------------------
		String.method('isUnique', function() {
			var letters = [];
			for(var i=0; i<this.length; i++) {
				if(letters[this.charCodeAt(i)]) {
					return false;
				}
				letters[this.charCodeAt(i)] = true;
			}
			return true;
		});
//----------------------------------------------------------------------------------------------
		String.method('startsWith', function(txt) {
			if(!globals.toolset.isString(txt)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: search string < ' + txt + ' >'
											};
			}
			return (this.indexOf(txt) == 0);
		});
//----------------------------------------------------------------------------------------------
		String.method('isRotation', function(str) {
			
			var isSubstring = function(big, small) {
				if(big.indexOf(small) >= 0) {
					return true;
				} else {
					return false;
				}
			};
			
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: search string < ' + txt + ' >'
											};
			}
			var len = this.length;
			if(len == str.length && len > 0) {
				var s1s1 = this.toString() + this.toString();
				return isSubstring(s1s1, str);
			}
			return false;
		});
//----------------------------------------------------------------------------------------------
		String.method('isPermutation', function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: search string < ' + txt + ' >'
											};
			}
			if(this.length != str.length) {
				return false;
			}
			var letters = [];
			for(var i=0; i<this.length; i++) {
				letters[this.charCodeAt(i)]++;
			}
			for(var i=0; i<str.length; i++) {
				if(--letters[str.charCodeAt(i)] < 0) {
					return false;
				}
			}
			return true;
		});
//----------------------------------------------------------------------------------------------
		/* Converts the first letter of each word in a string to a capital letter */
		String.method('capitalize', function() {
			return this.toLowerCase().replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); });
		});
//----------------------------------------------------------------------------------------------
		String.method('deentityify', function() {
			var entity = {
				'quot' : '"',
				'lt' : '<',
				'gt' : '>',
				'amp' : '&',
				'nbsp' : ' ',
				'reg' : '®',
				'pound' : '£',
				'sect' : '§',
				'copy' : '©',
				'sup2' : '²',
				'sup3' : '³',
				'deg' : '°',
				'frac14' : '¼',
				'frac12' : '½',
				'frac34' : '¾',
				'iquest' : '¿',
				'raquo' : '»',
				'laquo' : '«',
				'ordm' : 'º',
				'micro' : 'µ',
				'not' : '¬',
				'yen' : '¥',
				'cent' : '¢',
				'apos' : '\'',
				'iexcl' : '¡',
				'curren' : '¤',
				'brvbar' : '¦',
				'uml' : '¨',
				'ordf' : 'ª',
				'macr' : '¯',
				'plusmn' : '±',
				'acute' : '´',
				'para' : '¶',
				'middot' : '·',
				'cedil' : '¸',
				'sup1' : '¹',
				'Agrave' : 'À',
				'Aacute' : 'Á',
				'Acirc' : 'Â',
				'Atilde' : 'Ã',
				'Auml' : 'Ä',
				'Aring' : 'Å',
				'AElig' : 'Æ',
				'Ccedil' : 'Ç',
				'Egrave' : 'È',
				'Eacute' : 'É',
				'Ecirc' : 'Ê',
				'Euml' : 'Ë',
				'Igrave' : 'Ì',
				'Iacute' : 'Í',
				'Icirc' : 'Î',
				'Iuml' : 'Ï',
				'ETH' : 'Ð',
				'Ntilde' : 'Ñ',
				'Ograve' : 'Ò',
				'Oacute' : 'Ó',
				'Ocirc' : 'Ô',
				'Otilde' : 'Õ',
				'Ouml' : 'Ö',
				'times' : '×',
				'Oslash' : 'Ø',
				'Ugrave' : 'Ù',
				'Uacute' : 'Ú',
				'Ucirc' : 'Û',
				'Uuml' : 'Ü',
				'Yacute' : 'Ý',
				'THORN' : 'Þ',
				'szlig' : 'ß',
				'agrave' : 'à',
				'aacute' : 'á',
				'acirc' : 'â',
				'atilde' : 'ã',
				'auml' : 'ä',
				'aring' : 'å',
				'aelig' : 'æ',
				'ccedil' : 'ç',
				'egrave' : 'è',
				'eacute' : 'é',
				'ecirc' : 'ê',
				'euml' : 'ë',
				'igrave' : 'ì',
				'iacute' : 'í',
				'icirc' : 'î',
				'iuml' : 'ï',
				'eth' : 'ð',
				'ntilde' : 'ñ',
				'ograve' : 'ò',
				'oacute' : 'ó',
				'ocirc' : 'ô',
				'otilde' : 'õ',
				'ouml' : 'ö',
				'oslash' : 'ø',
				'ugrave' : 'ù',
				'uacute' : 'ú',
				'ucirc' : 'û',
				'uuml' : 'ü',
				'yacute' : 'ý',
				'thorn' : 'þ',
				'yuml' : 'ÿ',
				'OElig' : 'Œ',
				'oelig' : 'œ',
				'Scaron' : 'Š',
				'scaron' : 'š',
				'Yuml' : 'Ÿ',
				'fnof' : 'ƒ',
				'circ' : 'ˆ',
				'tilde' : '˜˜˜˜˜˜˜˜',
				'Alpha' : 'Α',
				'Beta' : 'Β',
				'Delta' : 'Δ',
				'Epsilon' : 'Ε',
				'Zeta' : 'Ζ',
				'Eta' : 'Η',
				'Theta' : 'Θ',
				'Iota' : 'Ι',
				'Kappa' : 'Κ',
				'Lambda' : 'Λ',
				'Mu' : 'Μ',
				'Nu' : 'Ν',
				'Xi' : 'Ξ',
				'Omicron' : 'Ο',
				'Pi' : 'Π',
				'Rho' : 'Ρ',
				'Sigma' : 'Σ',
				'Tau' : 'Τ',
				'Upsilon' : 'Υ',
				'Phi' : 'Φ',
				'Chi' : 'Χ',
				'Psi' : 'Ψ',
				'Omega' : 'Ω',
				'alpha' : 'α',
				'beta' : 'β',
				'gamma' : 'γ',
				'delta' : 'δ',
				'epsilon' : 'ε',
				'zeta' : 'ζ',
				'eta' : 'η',
				'theta' : 'θ',
				'iota' : 'ι',
				'kappa' : 'κ',
				'lambda' : 'λ',
				'mu' : 'μ',
				'nu' : 'ν',
				'xi' : 'ξ',
				'omicron' : 'ο',
				'pi' : 'π',
				'rho' : 'ρ',
				'sigmaf' : 'ς',
				'sigma' : 'σ',
				'tau' : 'τ',
				'upsilon' : 'υ',
				'phi' : 'φ',
				'chi' : 'χ',
				'psi' : 'ψ',
				'omega' : 'ω',
				'thetasym' : 'ϑ',
				'upsih' : 'ϒ',
				'piv' : 'ϖ',
				'ndash' : '–',
				'mdash' : '—',
				'lsquo' : '‘',
				'rsquo' : '’',
				'sbquo' : '‚',
				'ldquo' : '“',
				'rdquo' : '”',
				'bdquo' : '„',
				'dagger' : '†',
				'Dagger' : '‡',
				'bull' : '•',
				'hellip' : '…',
				'permil' : '‰',
				'prime' : '′',
				'Prime' : '″',
				'lsaquo' : '‹',
				'rsaquo' : '›',
				'oline' : '‡',
				'frasl' : '⁄',
				'euro' : '€',
				'trade' : '™',
				'larr' : '←',
				'uarr' : '↑',
				'rarr' : '→',
				'darr' : '↓',
				'harr' : '↔',
				'part' : '∂',
				'prod' : '∏',
				'sum' : '∑',
				'minus' : '−',
				'radic' : '√',
				'infin' : '∞',
				'cap' : '∩',
				'int' : '∫',
				'asymp' : '≈',
				'ne' : '≠',
				'equiv' : '≡',
				'le' : '≤',
				'ge' : '≥',
				'loz' : '◊',
				'spades' : '♠',
				'clubs' : '♣',
				'hearts' : '♥',
				'diams' : '♦'
			};
			return function() {
				return this.replace(/&([A&;]+);/g, function(a, b) {
					return ((globals.toolset.isString(entity[b])) ? entity[b] : a);
				});
			};
		}());
//----------------------------------------------------------------------------------------------
		String.method('entityify', function() {
			var character = {
				'"' : '&quot;',
				'<' : '&lt;',
				'>' : '&gt;',
				'&' : '&amp;',
				' ' : '&nbsp;',
				'®' : '&reg;',
				'£' : '&pound;',
				'§' : '&sect;',
				'©' : '&copy;',
				'²' : '&sup2;',
				'³' : '&sup3;',
				'°' : '&deg;',
				'¼' : '&frac14;',
				'½' : '&frac12;',
				'¾' : '&frac34;',
				'¿' : '&iquest;',
				'»' : '&raquo;',
				'«' : '&laquo;',
				'º' : '&ordm;',
				'µ' : '&micro;',
				'¬' : '&not;',
				'¥' : '&yen;',
				'¢' : '&cent;',
				'\'' : '&apos;',
				'¡' : '&iexcl;',
				'¤' : '&curren;',
				'¦' : '&brvbar;',
				'¨' : '&uml;',
				'ª' : '&ordf;',
				'¯' : '&macr;',
				'±' : '&plusmn;',
				'´' : '&acute;',
				'¶' : '&para;',
				'·' : '&middot;',
				'¸' : '&cedil;',
				'¹' : '&sup1;',
				'À' : '&Agrave;',
				'Á' : '&Aacute;',
				'Â' : '&Acirc;',
				'Ã' : '&Atilde;',
				'Ä' : '&Auml;',
				'Å' : '&Aring;',
				'Æ' : '&AElig;',
				'Ç' : '&Ccedil;',
				'È' : '&Egrave;',
				'É' : '&Eacute;',
				'Ê' : '&Ecirc;',
				'Ë' : '&Euml;',
				'Ì' : '&Igrave;',
				'Í' : '&Iacute;',
				'Î' : '&Icirc;',
				'Ï' : '&Iuml;',
				'Ð' : '&ETH;',
				'Ñ' : '&Ntilde;',
				'Ò' : '&Ograve;',
				'Ó' : '&Oacute;',
				'Ô' : '&Ocirc;',
				'Õ' : '&Otilde;',
				'Ö' : '&Ouml;',
				'×' : '&times;',
				'Ø' : '&Oslash;',
				'Ù' : '&Ugrave;',
				'Ú' : '&Uacute;',
				'Û' : '&Ucirc;',
				'Ü' : '&Uuml;',
				'Ý' : '&Yacute;',
				'Þ' : '&THORN;',
				'ß' : '&szlig;',
				'à' : '&agrave;',
				'á' : '&aacute;',
				'â' : '&acirc;',
				'ã' : '&atilde;',
				'ä' : '&auml;',
				'å' : '&aring;',
				'æ' : '&aelig;',
				'ç' : '&ccedil;',
				'è' : '&egrave;',
				'é' : '&eacute;',
				'ê' : '&ecirc;',
				'ë' : '&euml;',
				'ì' : '&igrave;',
				'í' : '&iacute;',
				'î' : '&icirc;',
				'ï' : '&iuml;',
				'ð' : '&eth;',
				'ñ' : '&ntilde;',
				'ò' : '&ograve;',
				'ó' : '&oacute;',
				'ô' : '&ocirc;',
				'õ' : '&otilde;',
				'ö' : '&ouml;',
				'ø' : '&oslash;',
				'ù' : '&ugrave;',
				'ú' : '&uacute;',
				'û' : '&ucirc;',
				'ü' : '&uuml;',
				'ý' : '&yacute;',
				'þ' : '&thorn;',
				'ÿ' : '&yuml;',
				'Œ' : '&OElig;',
				'œ' : '&oelig;',
				'Š' : '&Scaron;',
				'š' : '&scaron;',
				'Ÿ' : '&Yuml;',
				'ƒ' : '&fnof;',
				'ˆ' : '&circ;',
				'˜˜˜˜˜˜˜˜' : '&tilde;',
				'Α' : '&Alpha;',
				'Β' : '&Beta;',
				'Δ' : '&Delta;',
				'Ε' : '&Epsilon;',
				'Ζ' : '&Zeta;',
				'Η' : '&Eta;',
				'Θ' : '&Theta;',
				'Ι' : '&Iota;',
				'Κ' : '&Kappa;',
				'Λ' : '&Lambda;',
				'Μ' : '&Mu;',
				'Ν' : '&Nu;',
				'Ξ' : '&Xi;',
				'Ο' : '&Omicron;',
				'Π' : '&Pi;',
				'Ρ' : '&Rho;',
				'Σ' : '&Sigma;',
				'Τ' : '&Tau;',
				'Υ' : '&Upsilon;',
				'Φ' : '&Phi;',
				'Χ' : '&Chi;',
				'Ψ' : '&Psi;',
				'Ω' : '&Omega;',
				'α' : '&alpha;',
				'β' : '&beta;',
				'γ' : '&gamma;',
				'δ' : '&delta;',
				'ε' : '&epsilon;',
				'ζ' : '&zeta;',
				'η' : '&eta;',
				'θ' : '&theta;',
				'ι' : '&iota;',
				'κ' : '&kappa;',
				'λ' : '&lambda;',
				'μ' : '&mu;',
				'ν' : '&nu;',
				'ξ' : '&xi;',
				'ο' : '&omicron;',
				'π' : '&pi;',
				'ρ' : '&rho;',
				'ς' : '&sigmaf;',
				'σ' : '&sigma;',
				'τ' : '&tau;',
				'υ' : '&upsilon;',
				'φ' : '&phi;',
				'χ' : '&chi;',
				'ψ' : '&psi;',
				'ω' : '&omega;',
				'ϑ' : '&thetasym;',
				'ϒ' : '&upsih;',
				'ϖ' : '&piv;',
				'–' : '&ndash;',
				'—' : '&mdash;',
				'‘' : '&lsquo;',
				'’' : '&rsquo;',
				'‚' : '&sbquo;',
				'“' : '&ldquo;',
				'”' : '&rdquo;',
				'„' : '&bdquo;',
				'†' : '&dagger;',
				'‡' : '&Dagger;',
				'•' : '&bull;',
				'…' : '&hellip;',
				'‰' : '&permil;',
				'′' : '&prime;',
				'″' : '&Prime;',
				'‹' : '&lsaquo;',
				'›' : '&rsaquo;',
				'‾' : '&oline;',
				'⁄' : '&frasl;',
				'€' : '&euro;',
				'™' : '&trade;',
				'←' : '&larr;',
				'↑' : '&uarr;',
				'→' : '&rarr;',
				'↓' : '&darr;',
				'↔' : '&harr;',
				'∂' : '&part;',
				'∏' : '&prod;',
				'∑' : '&sum;',
				'−' : '&minus;',
				'√' : '&radic;',
				'∞' : '&infin;',
				'∩' : '&cap;',
				'∫' : '&int;',
				'≈' : '&asymp;',
				'≠' : '&ne;',
				'≡' : '&equiv;',
				'≤' : '&le;',
				'≥' : '&ge;',
				'◊' : '&loz;',
				'♠' : '&spades;',
				'♣' : '&clubs;',
				'♥' : '&hearts;',
				'♦' : '&diams;'
			};
			return function() {
				return this.replace(/[<>&"]/g, function(c) {
					return character[c];
				});
			};
		}());
//----------------------------------------------------------------------------------------------
		//console.log('45'.lpad('0', 4)); // "0045"
		String.method('lpad', function(padString, length) {
			if(!globals.toolset.isIntNumber(length) || length < 0) { throw {
																		name: 'ValueError',
																		message: 'incorrect input value: {length} is not positive integer number < ' + length + ' >'
																	};
			}
			var str = this;
			while(str.length < length) {
				str = padString + str;
			}
			return str;
		});
//----------------------------------------------------------------------------------------------
		String.method('replaceAll', function(searchValue, replacer) {
			if(!globals.toolset.isString(searchValue) || !globals.toolset.isString(replacer)) { throw {
																							name: 'ValueError',
																							message: 'incorrect input values: search value < ' + searchValue + ' >, replace value < ' + replacer + ' >'
																						};
			}
			var re = new RegExp(searchValue, 'g');
			this.replace(re, replacer);
		});
		//String.method('replaceAll', function(searchValue, replacer) {
			//if(!globals.toolset.isString(searchValue) || !globals.toolset.isString(replacer)) { throw {
			//																				name: 'ValueError',
			//																				message: 'incorrect input values: search value < ' + searchValue + ' >, replace value < ' + replacer + ' >'
			//																			};
			//}
		//	return this.split(searchValue).join(replacer);
		//});
//----------------------------------------------------------------------------------------------
		String.method('occurences', function(searchValue, matchCase) {
			if(!globals.toolset.isString(searchValue)) { throw {
														name: 'ValueError',
														message: 'incorrect search value: < ' + searchValue + ' >'
													};
			}
			var text = this;
			matchCase || (searchValue = searchValue.toLowerCase(), text = text.toLowerCase());
			return text.split(searchValue).length - 1;
		});
//----------------------------------------------------------------------------------------------
		String.method('repeat', function(times) {
			if(!globals.toolset.isIntNumber(times) || times < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect times value: < ' + times + ' >'
																};
			}
			return new Array(times+1).join(this);
		});
//----------------------------------------------------------------------------------------------
		String.method('chunk', function(len) {
			return str.match(new RegExp('.{1,' + len + '}', 'g'));
			//str.match(/.{1,n}/g); 
			//str.match(/(.|[\r\n]){1,n}/g);
		});
//----------------------------------------------------------------------------------------------
		String.method('countOccurrences', function(regex) {
			if(!globals.toolset.isRegExp(regex)) { throw {
													name: 'ValueError',
													message: 'incorrect regex value: < ' + regex + ' >'
												};
			}
			if (!regex.global) {
				throw new Error('Please set flag /g of regex');
			}
			return (this.match(regex) || []).length;
		});
//----------------------------------------------------------------------------------------------
		String.method('replaceAt', function(index, character) {
			if(!globals.toolset.isIntNumber(index) || index < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: index < ' + index + ' >'
																};
			}
			return this.substr(0, index) + character + this.substr(index + character.length);
		});
//----------------------------------------------------------------------------------------------
		String.method('removeChars', function(chars) {
			if(!globals.toolset.isString(chars)) { throw {
													name: 'ValueError',
													message: 'incorrect input value: characters to remove < ' + chars + ' >'
												};
			}
			var res = '';
			var flags = [];
			for(var i=0; i<chars.length; i++){
				flags[chars.charCodeAt(i)] = true;
			}
			for(var i=0; i<this.length; i++){
				if(!flags[this.charCodeAt(i)]) {
					res += this[i];
				}
			}
			return res;
		});
//----------------------------------------------------------------------------------------------
		String.method('cycle', function(k) {
			if(!globals.toolset.isIntNumber(k) || k < 0) { throw {
															name: 'ValueError',
															message: 'incorrect input parameters: string < ' + str + ' >, shift < ' + k + ' >'
														};
			}
			var array = str.split('');
			array.unshift(array.splice(0, k).reverse().join(''));
			array = array.join('').split('');
			array.push(array.splice(k, array.length).reverse().join(''));
			return array.join('').split('').reverse().join('');//.split('').splice(k, array.length).reverse().join('');
		});
//----------------------------------------------------------------------------------------------
		// returns a char's Unicode codepoint, of the char at index idx of string str
		// 2013-07-16 from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/charCodeAt
		// ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
		// ex. fixedCharCodeAt ('\uD800\uDC00', 1); // 65536
		String.method('fixedCharCodeAt', function(index) {
			if(!globals.toolset.isIntNumber(index) || index < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: index < ' + index + ' >'
																};
			}
			var code = this.charCodeAt(index);
			var hi, low;
			if (0xD800 <= code && code <= 0xDBFF) {
				hi = code;
				low = this.charCodeAt(index + 1);
				if (isNaN(low)) {
					throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
				}
				return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
			}
			if (0xDC00 <= code && code <= 0xDFFF) {
				//return false;
				hi = this.charCodeAt(index - 1);
				low = code;
				return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
			}
			return code;
		});
//----------------------------------------------------------------------------------------------
		String.method('knownCharCodeAt', function(index) {
			if(!globals.toolset.isIntNumber(index) || index < 0) { throw {
																	name: 'ValueError',
																	message: 'incorrect input value: index < ' + index + ' >'
																};
			}
			var code, end = this.length;
			var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
			
			while ((surrogatePairs.exec(this)) != null) {
				var li = surrogatePairs.lastIndex;
				if (li - 2 < index) {
					index++;
				} else {
					break;
				}
			}	
			if (index >= end || index < 0) {
				return NaN;
			}	
			
			code = this.charCodeAt(index);
			var hi, low;
			if (0xD800 <= code && code <= 0xDBFF) {
				hi = code;
				low = this.charCodeAt(index + 1);
				return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
			}
			return code;
		});
//----------------------------------------------------------------------------------------------
		//Returns a string. The string is made up of Unicode characters with codepoints {n1, n2 … }.
		String.staticMethod('fromCodePoint', function() {
			var chars = [], point, offset, units;
			for (var i = 0; i < arguments.length; i++) {
				point = arguments[i];
				offset = point - 0x10000;
				units = ((point > 0xFFFF) ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point]);
				chars.push(String.fromCharCode.apply(null, units));
			}
			return chars.join("");
		});
//----------------------------------------------------------------------------------------------
		String.method('remove', String.prototype.replace.partial(___, ''));
		//String.prototype.remove = String.prototype.replace.partial(___, '');
//----------------------------------------------------------------------------------------------
		String.method('sliceAfterChar', String.prototype.slice.compose(String.prototype.indexOf.express('r+1')));
		//String.prototype.sliceAfterChar = String.prototype.slice.compose(String.prototype.indexOf.express('r+1'));
//----------------------------------------------------------------------------------------------
		String.staticMethod('format', function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: regexp string < ' + str + ' >'
											};
			}
			var args = arguments;
			var pattern = RegExp("%([1-" + (arguments.length-1) + "])", "g");
			return str.replace(pattern, function(match, index) {
				return args[index];
			});
		});
//----------------------------------------------------------------------------------------------
		String.staticMethod('toFixedWidth', function(str, length, padString) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: regexp string < ' + str + ' >'
											};
			}
			if(!globals.toolset.isIntNumber(length) || length < 0) { throw {
																		name: 'ValueError',
																		message: 'incorrect input value: {length} is not positive integer number < ' + length + ' >'
																	};
			}
			padString = padString || '0';
			var padding = length - str.length;
			if(padding < 0) {
				str = str.substr(-padding);
			} else {
				for(var n=0; n<padding; n++) {
					str = padString + str;
				}
			}
			return str;
		});
//----------------------------------------------------------------------------------------------
		String.staticMethod('utf8ToWin', function(str) {
			if(!globals.toolset.isString(str)) { throw {
												name: 'ValueError',
												message: 'incorrect input value: regexp string < ' + str + ' >'
											};
			}
			var out = c1 = '';
			var byte2 = false, new_c2, new_c1, new_i, out_i;
			for (var c=0, i; c < str.length; c++) {
				i = str.fixedCharCodeAt(c);
				if (i <= 127) {
					out += String.fromCharCode(i);
				}
				if (byte2) {
					new_c2 = (c1 & 3) * 64 + (i & 63);
					new_c1 = (c1 >> 2) & 5;
					new_i = new_c1 * 256 + new_c2;
					if (new_i == 1025) {
						out_i = 168;
					} else {
						if (new_i == 1105) {
							out_i = 184;
						} else {
							out_i = new_i - 848;
						}
					}
					// UKRAINIAN fix
					switch (out_i){
						case 262: out_i=179;break;// і
						case 182: out_i=178;break;// І
						case 260: out_i=186;break;// є
						case 180: out_i=170;break;// Є
						case 263: out_i=191;break;// ї
						case 183: out_i=175;break;// Ї
						case 321: out_i=180;break;// ґ
						case 320: out_i=165;break;// Ґ
					}
					out += String.fromCharCode(out_i);
					byte2 = false;
				}
				if ((i >> 5) == 6) {
					c1 = i;
					byte2 = true;
				}
			}
			return out;
		});
	}());
}(typeof exports !== 'undefined' ? exports : this));

//var str = ' \n\t\r test \n\t\r ';
//document.writeln('!' + str + '!');
//document.writeln('!' + str.ltrim() + '!');
//document.writeln('!' + str.rtrim() + '!');
//document.writeln('!' + str.trim() + '!');
//document.writeln(" neat ".nbsp());
//document.writeln('33'.isInt());
//document.writeln('0xFF'.isHex());
//document.writeln('033'.isOct());
//document.writeln('0101'.isBin());
//document.writeln('5.6'.isFloat());
//document.writeln('5.09e-04'.isSci());
//document.writeln('12/12/12 13:59:56'.isDate());
//document.writeln('v'.isRoman());
//(\w+)\s*=\s*(.*?)$/
//document.writeln('Ther there'.withRepeats());
//document.writeln('Ther there'.isIPv6());
//document.writeln('Ther there'.reverse());
//document.writeln('A\uD800\uDC00Z');
//document.writeln('A\uD800\uDC00Z\uD800\uDC00'.getCharAt(3));
//document.writeln('A\uD800\uDC00Z\uD800\uDC00'.getLength());
//document.writeln("AGATGCCATATATATACGATATCCTTA".nthSubstr("ATAT", 3));
//document.writeln("AGATGCCATATATATACGATATCCTTA".nthSubstr("ATAT", 3, true));
//document.writeln("AGATGCCATATATATACGATATCCTTA".repeatNum("ATAT"));
//document.writeln("AGATGCCATATATATACGATATCCTTA".repeatNum("ATAT", true));
//document.writeln("Abracadabra".countUnique());
//document.writeln('&lt;&quot;&gt;'.deentityify());
//document.writeln("<&>".entityify());
//document.writeln(String.format("a %1 and a %2", "cat", "dog"));

//document.body.innerHTML.occurences("div"); //google home page has 114
//document.body.innerHTML.occurences("/div"); //google home page has 57
//"England engages its engineers".occurrences("eng",true); //2

//"go ".repeat(3) + "Giants!"; //"go go go Giants!"

//document.writeln("12654I 2am2 13not12 3a45 3number3 453".remove(/\d/gi));

//var domainFromEmail = String.prototype.sliceAfterChar.curry('@');
//var queryParams = String.prototype.sliceAfterChar.curry('?'); //assumes we don't want '?'

//var regex = /x/g;
//document.writeln('_x_x'.occurences('x'));
//document.writeln('_x_x'.countOccurrences(regex));