
steal('jquery/event').then(function($){

/**
 * @function jQuery.fn.triggerAsync
 * @parent jQuery.event.pause
 * @plugin jquery/event/default
 *
 * `jQuery.fn.triggerAsync(type, [data], [success], [prevented]` triggers an event and calls success
 * when the event has finished propagating through the DOM and no other handler
 * called `event.preventDefault()` or returned `false`.
 *
 *     $('#panel').triggerAsync('show', function() {
 *        $('#panel').show();
 *     });
 *
 * You can also provide a callback that gets called if `event.preventDefault()` was called on the event:
 *
 *     $('panel').triggerAsync('show', function(){
 *         $('#panel').show();
 *     },function(){ 
 *         $('#other').addClass('error');
 *     });
 *
 * @param {String} type The type of event
 * @param {Object} data The data for the event
 * @param {Function} success a callback function which occurs upon success
 * @param {Function} prevented a callback function which occurs if preventDefault was called
 */
$.fn.triggerAsync = function(type, data, success, prevented){
	if(typeof data == 'function'){
		success = data;
		data = undefined;
	}
	
	if ( this[0] ) {
		// Create a new jQuery event object and store the original preventDefault
		var event = $.Event( type ),
			old = event.preventDefault;

		event.preventDefault = function(){
			old.apply(this, arguments);
			// call the prevented callback when event.preventDefault is called
			prevented && prevented(this)
		}
		// Trigger the event with the success callback as the success handler
		jQuery.event.trigger( {type: type, _success: success}, data, this[0]  );
	} else{
		// If we have no elements call the success callback right away
		success.call(this);
	}
	return this;
}
	


/**
 * @add jQuery.event.special
 */
//cache default types for performance
var types = {}, rnamespaces= /\.(.*)$/, $event = $.event;
/**
 * @attribute default
 * @parent specialevents
 * @plugin jquery/event/default
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/default/default.js
 * @test jquery/event/default/qunit.html
 *
 */
$event.special["default"] = {
	add: function( handleObj ) {
		//save the type
		types[handleObj.namespace.replace(rnamespaces,"")] = true;
	},
	setup: function() {return true}
}

// overwrite trigger to allow default types
var oldTrigger = $event.trigger;

$event.trigger =  function defaultTriggerer( event, data, elem, onlyHandlers){
	// Event object or event type
	var type = event.type || event,
		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type),
		res = oldTrigger.call($.event, event, data, elem, onlyHandlers);
	
	if(!onlyHandlers && !event.isDefaultPrevented() && event.type.indexOf("default") !== 0) {
		// Trigger the default. event
		oldTrigger("default."+event.type, data, elem)
		if(event._success){
			event._success(event)
		}
	}
	// code for paused
	if( event.isPaused && event.isPaused() ){
		// set back original stuff
		event.isDefaultPrevented = 
			event.pausedState.isDefaultPrevented;
		event.isPropagationStopped = 
			event.pausedState.isPropagationStopped;
	}
	return res;
};
	
	
	
	
});