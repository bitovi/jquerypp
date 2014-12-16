(function () {
	
	steal.config({
		map: {
			"jquery/jquery": "jquery"
		},
		paths: {
			"jquery": "../can/lib/jquery.1.10.2.js",
			"jquerypp/*": "*.js"
		},
		meta: {
			jquery: {
				exports: "jQuery"
			}
		}
	});
	
})();
