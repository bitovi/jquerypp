steal('jquery/event').then(function( $ ) {
	/**
	 * @attribute destroyed
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/destroyed/destroyed.js
	 * @test jquery/event/destroyed/qunit.html
	 */
	var oldClean = jQuery.cleanData;

	$.cleanData = function( elems ) {
		for ( var i = 0, elem;
		(elem = elems[i]) !== undefined; i++ ) {
			$(elem).triggerHandler("destroyed");
			//$.event.remove( elem, 'destroyed' );
		}
		oldClean(elems);
	};

});