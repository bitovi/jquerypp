/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {

	$.toJSON = function (o, replacer, space, recurse) {
		if (typeof(JSON) == 'object' && JSON.stringify) return JSON.stringify(o, replacer, space);

		if (!recurse && $.isFunction(replacer)) o = replacer("", o);

		if (typeof space == "number") space = "          ".substring(0, space);
		space = (typeof space == "string") ? space.substring(0, 10) : "";

		var type = typeof(o);

		if (o === null) return "null";

		if (type == "undefined" || type == "function") return undefined;

		if (type == "number" || type == "boolean") return o + "";

		if (type == "string") return $.quoteString(o);

		if (type == 'object') {
			if (typeof o.toJSON == "function") return $.toJSON(o.toJSON(), replacer, space, true);

			if (o.constructor === Date) {
				var month = o.getUTCMonth() + 1;
				if (month < 10) month = '0' + month;

				var day = o.getUTCDate();
				if (day < 10) day = '0' + day;

				var year = o.getUTCFullYear();

				var hours = o.getUTCHours();
				if (hours < 10) hours = '0' + hours;

				var minutes = o.getUTCMinutes();
				if (minutes < 10) minutes = '0' + minutes;

				var seconds = o.getUTCSeconds();
				if (seconds < 10) seconds = '0' + seconds;

				var milli = o.getUTCMilliseconds();
				if (milli < 100) milli = '0' + milli;
				if (milli < 10) milli = '0' + milli;

				return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
			}

			var process = ($.isFunction(replacer)) ?
			function (k, v) {
				return replacer(k, v);
			} : function (k, v) {
				return v;
			},
				nl = (space) ? "\n" : "",
				sp = (space) ? " " : "";

			if (o.constructor === Array) {
				var ret = [];
				for (var i = 0; i < o.length; i++)
				ret.push(($.toJSON(process(i, o[i]), replacer, space, true) || "null").replace(/^/gm, space));

				return "[" + nl + ret.join("," + nl) + nl + "]";
			}

			var pairs = [],
				proplist;
			if ($.isArray(replacer)) {
				proplist = $.map(replacer, function (v) {
					return (typeof v == "string" || typeof v == "number") ? v + "" : null;
				});
			}
			for (var k in o) {
				var name, val, type = typeof k;

				if (proplist && $.inArray(k + "", proplist) == -1) continue;

				if (type == "number") name = '"' + k + '"';
				else if (type == "string") name = $.quoteString(k);
				else continue; //skip non-string or number keys
				val = $.toJSON(process(k, o[k]), replacer, space, true);

				if (typeof val == "undefined") continue; //skip pairs where the value is a function.
				pairs.push((name + ":" + sp + val).replace(/^/gm, space));
			}

			return "{" + nl + pairs.join("," + nl) + nl + "}";
		}
	};


	$.evalJSON = function (src) {
		if (typeof(JSON) == 'object' && JSON.parse) return JSON.parse(src);
		return eval("(" + src + ")");
	};


	$.secureEvalJSON = function (src) {
		if (typeof(JSON) == 'object' && JSON.parse) return JSON.parse(src);

		var filtered = src;
		filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
		filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
		filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) return eval("(" + src + ")");
		else throw new SyntaxError("Error parsing JSON, source is not valid.");
	};


	$.quoteString = function (string) {
		if (string.match(_escapeable)) {
			return '"' + string.replace(_escapeable, function (a) {
				var c = _meta[a];
				if (typeof c === 'string') return c;
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};

	var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;

	var _meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};

	return $;
});