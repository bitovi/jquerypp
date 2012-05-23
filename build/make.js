
load("steal/rhino/rhino.js");
steal('steal/build/pluginify', 'jquery/build/stealify.js', 'jquery/build/amdify.js', function() {

	var extend = steal.extend,
		out = "jquery/dist/",
		excludes = [ 'steal/dev',
			"can/util/jquery/jquery.1.7.1.js",
			"jquery/build/lib.js" ],
		options = {
			global: "jQuery",
			skipCallbacks: true,
			exclude : excludes.concat(["jquery/jquery.js"])
		},
		plugins = {
			"jquery/dom/animate/animate.js" : "jquery.animate.js",
			"jquery/dom/compare/compare.js" : "jquery.compare.js",
			"jquery/dom/cookie/cookie.js" : "jquery.cookie.js",
			"jquery/dom/dimensions/dimensions.js" : "jquery.dimensions.js",
			"jquery/dom/form_params/form_params.js" : "jquery.form_params.js",
			"jquery/dom/range/range.js" : "jquery.range.js",
			"jquery/dom/selection/selection.js" : "jquery.selection.js",
			"jquery/dom/styles/styles.js" : "jquery.styles.js",
			"jquery/dom/within/within.js" : "jquery.within.js",
			"jquery/event/default/default.js" : "jquery.event.default.js",
			"jquery/event/destroyed/destroyed.js" : "jquery.event.destroyed.js",
			"jquery/event/drag/drag.js" : "jquery.event.drag.js",
			"jquery/event/drop/drop.js" : "jquery.event.drop.js",
			"jquery/event/fastfix/fastfix.js" : "jquery.event.fastfix.js",
			"jquery/event/hover/hover.js" : "jquery.event.hover.js",
			"jquery/event/key/key.js" : "jquery.event.key.js",
			"jquery/event/pause/pause.js" : "jquery.event.pause.js",
			"jquery/event/resize/resize.js" : "jquery.event.resize.js",
			"jquery/event/swipe/swipe.js" : "jquery.event.swipe.js"
		};

	steal.File(out).mkdirs();

	// Create full library
	steal.build.pluginify('jquery/build/lib.js', extend({
		out: out + "jquerypp.js"
	}, options));

	// Create each plugin
	for(var file in plugins) {
		steal.build.pluginify(file, extend({
			out: out + plugins[file]
		}, options));
	}

	// Make Steal distributable
	steal.build.stealify('jquery/build/lib.js', {
		out : out + 'steal/',
		excludes : excludes
	});

	// Make AMD modules
	steal.build.amdify('jquery/build/lib.js', {
		out : out + 'amd/',
		excludes : excludes.concat([
			'jquery/dom/dom.js', 'jquery/event/event.js'
		]),
		map : { // steal file to CommonJS module name mappings
			"jquery/jquery.js" : "jquery",
			"jquery/build/lib.js" : "jquerypp/index",
			"jquery/lang/json/json.js" : "jquerypp/util/json",
			"jquery/lang/vector/vector.js" : "jquerypp/util/vector",
			"jquery/dom/animation/animation.js" : "jquerypp/animation",
			"jquery/dom/compare/compare.js" : "jquerypp/compare",
			"jquery/dom/cookie/cookie.js" : "jquerypp/cookie",
			"jquery/dom/dimensions/dimensions.js" : "jquerypp/dimensions",
			"jquery/dom/form_params/form_params.js" : "jquerypp/form_params",
			"jquery/dom/range/range.js" : "jquerypp/range",
			"jquery/dom/selection/selection.js" : "jquerypp/selection",
			"jquery/dom/styles/styles.js" : "jquerypp/syles",
			"jquery/dom/within/within.js" : "jquerypp/within",
			"jquery/event/default/default.js" : "jquerypp/event/default",
			"jquery/event/destroyed/destroyed.js" : "jquerypp/event/destroyed",
			"jquery/event/drag/drag.js" : "jquerypp/event/drag",
			"jquery/event/drag/limit/limit.js" : "jquerypp/event/drag.limit",
			"jquery/event/drag/scroll/scroll.js" : "jquerypp/event/drag.scroll",
			"jquery/event/drag/step/step.js" : "jquerypp/event/drag.step",
			"jquery/event/drop/drop.js" : "jquerypp/event/drop",
			"jquery/event/fastfix/fastfix.js" : "jquerypp/event/fastfix",
			"jquery/event/hover/hover.js" : "jquerypp/event/hover",
			"jquery/event/key/key.js" : "jquerypp/event/key",
			"jquery/event/livehack/livehack.js" : "jquerypp/event/livehack",
			"jquery/event/pause/pause.js" : "jquerypp/event/pause",
			"jquery/event/resize/resize.js" : "jquerypp/event/resize",
			"jquery/event/swipe/swipe.js" : "jquerypp/event/swipe"
		},
		names : { // Module name to variable name mappings
			'jquery' : 'jQuery'
		},
		global : 'jQuery'
	});
});
