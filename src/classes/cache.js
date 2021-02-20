jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.cacheProvider = function() {
	var cache = {};
	var hasLocalStorage = false;
	//
	var that = Object.create(jsar.utils.cacheProvider.prototype);
	//that.prototype = jsar.utils.cacheProvider;
	//
	var init = function() {
		hasLocalStorage = ('localStorage' in window) && (window['localStorage'] !== null);
		if (hasLocalStorage) {
			Storage.prototype.setObject = function(key, value) {//window.localStorage
				this.setItem(key, JSON.stringify(value));
			};
			Storage.prototype.getObject = function(key) {//window.localStorage
				try {
					return JSON.parse(this.getItem(key));
				} catch(e) {
					return null;
				}
			};
		}
	};
	var isCacheProvider = function(x) {
		return (x instanceof jsar.utils.cacheProvider);
	};
	/**
     * {String} k - the key
     * {Boolean} local - get this from local storage?
     * {Boolean} o - is the value you put in local storage an object?
     */
	that.get = function(k, local, o) {
		if (local && hasLocalStorage) {
			var action = o ? 'getObject' : 'getItem';
			return localStorage[action](k) || undefined;
		} else {
			return cache[k] || undefined;
		}
	};
	/**
     * {String} k - the key
     * {Object} v - any kind of value you want to store
     * however only objects and strings are allowed in local storage
     * {Boolean} local - put this in local storage
     */
	that.set = function(k, v, local) {
		if (local && hasLocalStorage) {
			if (typeof v !== 'string') {
				// make assumption if it's not a string, then we're storing an object
				localStorage.setObject(k, v);
			} else {
				try {
					localStorage.setItem(k, v);
				} catch (ex) {
					if (ex.name == 'QUOTA_EXCEEDED_ERR') {
						// developer needs to figure out what to start invalidating
						throw new Exception(v);
						return;
					}
				}
			}
		} else {
			// put in our local object
			cache[k] = v;
		}
		// return our newly cached item
		return v;
	};
	/**
     * {String} k - the key
     * {Boolean} local - put this in local storage
     * {Boolean} o - is this an object you want to put in local storage?
     */
	that.clear = function(k, local, o) {
		if (local && hasLocalStorage) {
			localStorage.removeItem(k);
		}
		// delete in both caches - doesn't hurt.
		delete cache[k];
	};
	init();
	return that;
};
/*
var cache = jsar.utils.cacheProvider();
if(typeof window.getElementsByClassName === 'undefined') {
	window.getElementsByClassName = function(c) {
		var reg = cache.get(c) || cache.set(c, new RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)"));
		var elements = document.getElementsByTagName('*');
		var results = [];
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.match(reg)) {
				results.push(elements[i]);
			}
		}
		return results;
	};
}
*/
/*
var i18nCache = jsar.utils.cacheProvider();
if (i18nCache.get('topnav')) {
	$('#nav').html(i18nCache.get('topnav'));
} else {
	ajax('top-nav.tmpl', function(html) {
		i18nCache.set('topnav', html);
		$('#nav').html(i18nCache.get('topnav'));
	});
}
*/
