steal('jquery', function( $ ) {
	/**
	 * @attribute destroyed
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/dom/removed/removed
	 * @test jquerypp/event/destroyed/qunit.html
	 */

	// Store the old jQuery.cleanData
	var oldClean = $.cleanData;

	// Overwrites cleanData which is called by jQuery on manipulation methods
	$.cleanData = function( elems ) {
		for ( var i = 0, elem;
		(elem = elems[i]) !== undefined; i++ ) {
			// Trigger the destroyed event
			$(elem).triggerHandler("removed");
		}
		// Call the old jQuery.cleanData
		oldClean(elems);
	};
return $;
});