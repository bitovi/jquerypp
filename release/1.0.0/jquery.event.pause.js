(function($){

/**
 * @function jQuery.fn.triggerAsync
 * @parent jQuery.event.pause
 * @plugin jquery/event/default
 *
 * Triggers an event and calls success when the event has finished propagating through the DOM and preventDefault is not called.
 *
 *     $('#panel').triggerAsync('show', function() {
 *        $('#panel').show();
 *     });
 *
 * You can also provide a callback that gets called if preventDefault was called on the event:
 *
 *     $('panel').triggerAsync('show', function(){
 *         $('#panel').show();
 *     },function(){ 
 *         $('#other').addClass('error');
 *     });
 *
 * triggerAsync is design to work with the [jquery.event.pause] 
 * plugin although it is defined in _jquery/event/default_.
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
		var event = $.Event( type ),
			old = event.preventDefault;
		
		event.preventDefault = function(){
			old.apply(this, arguments);
			prevented && prevented(this)
		}
		//event._success= success;
		jQuery.event.trigger( {type: type, _success: success}, data, this[0]  );
	} else{
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
		namespaces = [],

	// Caller can pass in an Event, Object, or just an event type string
	event = typeof event === "object" ?
		// jQuery.Event object
		event[ jQuery.expando ] ? event :
		// Object literal
		new jQuery.Event( type, event ) :
		// Just the event type (string)
		new jQuery.Event( type );
		
    //event._defaultActions = []; //set depth for possibly reused events
	
	var res = oldTrigger.call($.event, event, data, elem, onlyHandlers);
	
	
	if(!onlyHandlers && !event.isDefaultPrevented() && event.type.indexOf("default") !== 0){
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
	
	
	
	
})(jQuery);
(function($){


var current,
	rnamespaces = /\.(.*)$/,
	returnFalse = function(){return false},
	returnTrue = function(){return true};

/**
 * @function
 * @parent jquery.event.pause
 * Pauses an event (to be resumed later);
 */
//
/**
 * @function
 * @parent jquery.event.pause
 * 
 * Resumes an event
 */
//
/**
 * @page jquery.event.pause Pause-Resume
 * @plugin jquery/event/pause
 * @parent specialevents
 * The jquery/event/pause plugin adds the ability to pause and 
 * resume events. 
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * When an event is paused, stops calling other event handlers for the 
 * event (similar to event.stopImmediatePropagation() ).  But when 
 * resume is called on the event, it will begin calling events on event handlers
 * after the 'paused' event handler.
 * 
 * 
 * Pause-able events complement the [jQuery.event.special.default default]
 * events plugin, providing the ability to easy create widgets with 
 * an asynchronous API.  
 * 
 * ## Example
 * 
 * Consider a basic tabs widget that:
 * 
 *   - trigger's a __show__ event on panels when they are to be displayed
 *   - shows the panel after the show event.
 *   
 * The sudo code for this controller might look like:
 * 
 *     $.Controller('Tabs',{
 *       ".button click" : function( el ){
 *         var panel = this.getPanelFromButton( el );
 *         panel.triggerAsync('show', function(){
 *           panel.show();
 *         })
 *       }
 *     })
 *     
 * Someone using this plugin would be able to delay the panel showing until ready:
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * Or prevent the panel from showing at all:
 * 
 *     $('#todos').bind('show', function(ev){
 *       if(! isReady()){
 *         ev.preventDefault();
 *       }
 *     })
 *     
 * ## Limitations
 * 
 * The element and event handler that the <code>pause</code> is within can not be removed before 
 * resume is called.
 * 
 * ## Big Example
 * 
 * The following example shows a tabs widget where the user is prompted to save, ignore, or keep editing
 * a tab when a new tab is clicked.
 * 
 * @demo jquery/event/pause/pause.html
 * 
 * It's a long, but great example of how to do some pretty complex state management with JavaScriptMVC.
 * 
 */
$.Event.prototype.isPaused = returnFalse


$.Event.prototype.pause = function(){
	// stop the event from continuing temporarily
	// keep the current state of the event ...
	this.pausedState = {
		isDefaultPrevented : this.isDefaultPrevented() ?
			returnTrue : returnFalse,
		isPropagationStopped : this.isPropagationStopped() ?
			returnTrue : returnFalse
	};
	
	this.stopImmediatePropagation();
	this.preventDefault();
	this.isPaused = returnTrue;
	
	
	
	
};

$.Event.prototype.resume = function(){
	// temporarily remove all event handlers of this type 
	var handleObj = this.handleObj,
		currentTarget = this.currentTarget;
	// temporarily overwrite special handle
	var origType = jQuery.event.special[ handleObj.origType ],
		origHandle = origType && origType.handle;
		
	if(!origType){
		jQuery.event.special[ handleObj.origType ] = {};
	}
	jQuery.event.special[ handleObj.origType ].handle = function(ev){
		// remove this once we have passed the handleObj
		if(ev.handleObj === handleObj && ev.currentTarget === currentTarget){
			if(!origType){
				delete jQuery.event.special[ handleObj.origType ];
			} else {
				jQuery.event.special[ handleObj.origType ].handle = origHandle;
			}
		}
	}
	delete this.pausedState;
	// reset stuff
	this.isPaused = this.isImmediatePropagationStopped = returnFalse;
	
	
	// re-run dispatch
	//$.event.dispatch.call(currentTarget, this)
	
	// with the events removed, dispatch
	
	if(!this.isPropagationStopped()){
		// fire the event again, no events will get fired until
		// same currentTarget / handler
		$.event.trigger(this, [], this.target);
	}
	
};

/*var oldDispatch = $.event.dispatch;
$.event.dispatch = function(){
	
}*/
// we need to finish handling

// and then trigger on next element ...
// can we fake the target ?


})(jQuery)