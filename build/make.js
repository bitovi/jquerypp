
load("steal/rhino/rhino.js");
steal('steal/build/pluginify', 'jquery/build/stealify.js', function() {

	var extend = steal.extend,
		out = "jquery/dist/edge/",
		excludes = [ 'steal/dev',
			"can/util/jquery/jquery.1.7.1.js",
			"jquery/build/lib.js" ];

	steal.File(out).mkdirs();

	var options = {
		global: "jQuery",
		skipCallbacks: true,
		exclude : "can/util/jquery/jquery.1.7.1.js"
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
		wrapInner : [
			"define(['jquery'], function(jQuery) {",
			"; return jQuery; });"
		]
	}, options));

	steal.build.stealify({
		src : 'jquery/build/lib.js',
		out : out + 'steal/',
		excludes : excludes
	});
});
