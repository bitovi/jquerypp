/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {


	// Store the old jQuery.cleanData
	var oldClean = $.cleanData;

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