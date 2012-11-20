/*
* jQuery++ - 1.0.0 (2012-11-20)
* http://jquerypp.com
* Copyright (c) 2012 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {


	// Store the old jQuery.cleanData
	var oldClean = jQuery.cleanData;

	// Overwrites cleanData which is called by jQuery on manipulation methods
	$.cleanData = function (elems) {
		for (var i = 0, elem;
		(elem = elems[i]) !== undefined; i++) {
			// Trigger the destroyed event
			$(elem).triggerHandler("destroyed");
		}
		// Call the old jQuery.cleanData
		oldClean(elems);
	};
	return $;
});