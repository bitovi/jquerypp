
load("steal/rhino/rhino.js");
steal('steal/build/pluginify', function() {

	var each = function( obj, fn ) {
		var i, len;

		if ( obj instanceof Array ) {
			for ( i = 0, len = obj.length; i < len; i++ ) {
				if ( fn.call( obj, obj[ i ], i, obj ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( fn.call( obj, obj[ i ], i, obj ) === false ) {
					break;
				}
			}
		}
	},
	extend = function( d, s ) {
		for ( var p in s ) {
			d[p] = s[p];
		}
		return d;
	},
	plugins = {
		"dom/compare/compare" : "compare",
		"dom/cookie/cookie" : "cookie",
		"dom/dimensions/dimensions" : "dimensions",
		"dom/form_params/form_params" : "formparams",
		"dom/range/range" : "range",
		"dom/selection/selection" : "selection",
		"dom/styles/styles" : "styles",
		"dom/within/within" : "within",
		"event/default/default" : "event.default",
		"event/destroyed/destroyed" : "event.destroyed",
		"event/drag/drag" : "event.drag",
		"event/drop/drop" : "event.drop",
		"event/hover/hover" : "event.hover",
		"event/key/key" : "event.key",
		"event/pause/pause" : "event.pause",
		"event/resize/resize" : "event.resize",
		"event/swipe/swipe" : "event.swipe"
	},
	out = "jquery/dist/edge/";

	steal.File(out).mkdirs();

	/*
	each( plugins, function( output, input ) {
		var source = "jquery/" + input + ".js";
		steal.build.pluginify(source, {
			out: out + "jquery." + output + ".js",
			global: "jQuery",
			compress: false,
			skipCallbacks: true,
			standAlone: true
		});

		steal.build.pluginify(source, {
			out: out + "jquery." + output + ".min.js",
			global: "jQuery",
			onefunc: true,
			compress: true,
			skipCallbacks: true,
			standAlone: true
		});

		// steal.File(out + input)
		// steal.File(source).copyTo()
	});
	*/

	var options = {
		global: "jQuery",
		skipCallbacks: true,
		exclude : "can/util/jquery/jquery.1.7.1.js",
		compress : false
	};

	steal.build.pluginify('jquery/build/lib.js', extend({
		out: out + "jquerypp.js"
	}, options));

	steal.build.pluginify('jquery/build/lib.js',  extend({
		out: out + "jquerypp.min.js",
		compress: true
	}, options));

	steal.File(out + 'amd').mkdirs();

	steal.build.pluginify('jquery/build/lib.js',  extend({
		out: out + "amd/jquerypp.js",
		compress: false,
		wrapInner : [
			"define(['jquery'], function() {",
			"; return jQuery; });"
		]
	}, options));

//	steal.build.open("steal/rhino/empty.html", {
//		startFile : 'jquery/build/lib.js',
//		skipCallbacks: true
//	}, function(opener){
//		opener.each(function(stl, text, i){
//			for(var key in stl) {
//				print(key + " : " + stl[key]);
//			}
//		})
//	});
});
