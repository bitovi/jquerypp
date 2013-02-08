/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/lang/json'], function ($) {

	$.cookie = function (name, value, options) {
		if (typeof value != 'undefined') {
			// name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			// convert value to JSON string
			if (typeof value == 'object' && $.toJSON) {
				value = $.toJSON(value);
			}
			var expires = '';
			// Set expiry
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				}
				else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			// CAUTION: Needed to parenthesize options.path and options.domain
			// in the following expressions, otherwise they evaluate to undefined
			// in the packed version for some reason...
			var path = options.path ? '; path=' + (options.path) : '';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			// Set the cookie name=value;expires=;path=;domain=;secure-
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		}
		else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = $.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						// Get the cookie value
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			// Parse JSON from the cookie into an object
			if ($.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
				try {
					cookieValue = $.evalJSON(cookieValue);
				}
				catch (e) {}
			}
			return cookieValue;
		}
	};

	return $;
});