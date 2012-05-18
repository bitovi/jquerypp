(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle, 
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					
					match = (all || namespace.test(handle.namespace));
					
					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);
							
						} 
					}
					
					
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);
(function($){
/**
 * @class jQuery.Hover
 * @plugin jquery/event/hover
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/hover/hover.js
 * @parent jQuery.event.hover
 *
 * Creates a new hover. The constructor should not be called directly.
 *
 * An instance of `$.Hover` is passed as the second argument to each
 * `jQuery.event.hover` handler:
 *
 *      $('#menu').on("hoverinit", function(ev, hover) {
 *          // Set the hover distance to 20px
 *          hover.distance(20);
 *      });
 */
$.Hover = function(){
	this._delay =  $.Hover.delay;
	this._distance = $.Hover.distance;
	this._leave = $.Hover.leave
};
/**
 * @Static
 */
$.extend($.Hover,{
	/**
	 * @attribute delay
	 * `$.Hover.delay` is the delay (in milliseconds) after which the hover is
	 * activated by default.
	 *
	 * Set this value as a global default. The default is 100ms.
	 */
	delay: 100,
	/**
	 * @attribute distance
	 *
	 * `$.Hover.distance` is the maximum distance (in pixels) that the mouse is allowed to
	 * travel within the time of [jQuery.Hover.delay] in order to activate a hover.
	 *
	 * Set this value as a global default. The default is 10px.
	 */
	distance: 10,
	leave : 0
})

/**
 * @Prototype
 */
$.extend($.Hover.prototype,{
	/**
	 * Sets the delay for this hover. This method should only be used in
	 * [jQuery.event.hover.hoverinit hoverinit].
	 *
	 * @param {Number} delay the number of milliseconds used to determine a hover
	 * @return {$.Hover} The hover object
	 */
	delay: function( delay ) {
		this._delay = delay;
		return this;
	},
	/**
	 * Sets the distance for this hover. This method should only be used in
	 * [jQuery.event.hover.hoverinit hoverinit].
	 *
	 * @param {Number} distance the max distance in pixels a mouse can move to be considered a hover
	 * @return {$.Hover} The hover object
	 */
	distance: function( distance ) {
		this._distance = distance;
		return this;
	},
	/**
	 * Sets a delay after which the hover stops. This method should only be used in
	 * [jQuery.event.hover.hoverinit hoverinit].
	 *
	 * @param {Number} delay the number of milliseconds the hover should stay active after the mouse leaves
	 * @return {$.Hover} The hover object
	 */
	leave : function(leave){
		this._leave = leave;
		return this;
	}
})
var event = $.event, 
	handle  = event.handle,
	onmouseenter = function(ev){
		//now start checking mousemoves to update location
		var delegate = ev.delegateTarget || ev.currentTarget;
		var selector = ev.handleObj.selector;
		//prevents another mouseenter until current has run its course
		if($.data(delegate,"_hover"+selector)){
			return;
		}
		$.data(delegate,"_hover"+selector, true)
		var loc = {
				pageX : ev.pageX,
				pageY : ev.pageY
			}, 
			dist = 0, 
			timer, 
			enteredEl = this, 
			hovered = false,
			lastEv = ev, 
			hover = new $.Hover(),
			leaveTimer,
			callHoverLeave = function(){
				$.each(event.find(delegate, ["hoverleave"], selector), function(){
					this.call(enteredEl, ev, hover)
				})
				cleanUp();
			},
			mouseenter = function(ev){
				clearTimeout(leaveTimer);
				dist += Math.pow( ev.pageX-loc.pageX, 2 ) + Math.pow( ev.pageY-loc.pageY, 2 ); 
				loc = {
					pageX : ev.pageX,
					pageY : ev.pageY
				}
				lastEv = ev
			},
			mouseleave = function(ev){
				clearTimeout(timer);
				// go right away
				if(hovered){
					if(hover._leave === 0){
						callHoverLeave();
					}else{
						clearTimeout(leaveTimer);
						leaveTimer = setTimeout(function(){
							callHoverLeave();
						}, hover._leave)
					}
				}else{
					cleanUp();
				}
			},
			cleanUp = function(){
				$(enteredEl).unbind("mouseleave",mouseleave)
				$(enteredEl).unbind("mousemove",mouseenter);
				$.removeData(delegate,"_hover"+selector)
			};
		
		$(enteredEl).bind("mousemove",mouseenter).bind("mouseleave", mouseleave);
		$.each(event.find(delegate, ["hoverinit"], selector), function(){
			this.call(enteredEl, ev, hover)
		})
		
		timer = setTimeout(function(){
			//check that we aren't moveing around
			if(dist < hover._distance && $(enteredEl).queue().length == 0){
				$.each(event.find(delegate, ["hoverenter"], selector), function(){
					this.call(enteredEl, lastEv, hover)
				})
				hovered = true;
				return;
			}else{
				dist = 0;
				timer = setTimeout(arguments.callee, hover._delay)
			}
		}, hover._delay)
		
	};
		
/**
 * @add jQuery.event.hover
 */
event.setupHelper( [
/**
 * @attribute hoverinit
 *
 * `hoverinit` is called when a hover is about to start (on `mouseenter`). Listen for `hoverinit` events to configure
 * [jQuery.Hover.prototype.delay] and [jQuery.Hover.prototype.distance]
 * for this specific event:
 *
 *      $(".option").on("hoverinit", function(ev, hover){
 *          //set the distance to 10px
 *          hover.distance(10)
 *          //set the delay to 200ms
 *          hover.delay(10)
 *      })
 */
"hoverinit", 
/**
 * @attribute hoverenter
 *
 * `hoverenter` events are called when the mouses less than [jQuery.Hover.prototype.distance] pixels in
 * [jQuery.Hover.prototype.delay] milliseconds.
 *
 *      $(".option").on("hoverenter", function(ev, hover){
 *          $(this).addClass("hovering");
 *      })
 */
"hoverenter",
/**
 * @attribute hoverleave
 *
 * `hoverleave` is called when the mouse leaves an element that has been hovered.
 *
 *      $(".option").on("hoverleave", function(ev, hover){
 *          $(this).removeClass("hovering");
 *      })
 */
"hoverleave",
/**
 * @attribute hovermove
 *
 * `hovermove` is called when a `mousemove` occurs on an element that has been hovered.
 *
 *      $(".option").on("hovermove", function(ev, hover){
 *          // not sure why you would want to listen for this
 *          // but we provide it just in case
 *      })
 */
"hovermove"], "mouseenter", onmouseenter )
		

	
})(jQuery)