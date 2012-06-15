(function( $ ) {

	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;

	$.styles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = jQuery.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			if ( getComputedStyle ) {
				name = name.replace(rupper, "-$1").toLowerCase();
				val = currentS.getPropertyValue(name);
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];


				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) { //convert to px
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};

	/**
	 * @function jQuery.fn.styles
	 * @parent jQuery.styles
	 * @plugin jQuery.styles
	 *
	 * Returns a set of computed styles. Pass the names of the styles you want to
	 * retrieve as arguments:
	 *
	 *      $("div").styles('float','display')
	 *      // -> { cssFloat: "left", display: "block" }
	 *
	 * @param {String} style pass the names of the styles to retrieve as the argument list
	 * @return {Object} an object of `style` : `value` pairs
	 */
	$.fn.styles = function() {
		return $.styles(this[0], $.makeArray(arguments));
	};
})(jQuery);
(function ($) {

	var animationNum = 0,
		//Animation events implies animations right?
		//gets the last editable stylesheet or creates one
		getLastStyleSheet = function () {
			var sheets = document.styleSheets,
				x = sheets.length - 1,
				foundSheet = null,
				style;

			while (x >= 0 && !foundSheet) {
				if (sheets[x].cssRules || sheets[x].rules) {
					//any stylesheet which we can access cssRules is good
					foundSheet = sheets[x];
				}
				x -= 1;
			}

			if (!foundSheet) {
				style = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(style);
				if (!window.createPopup) { /* For Safari */
					style.appendChild(document.createTextNode(''));
				}
				foundSheet = sheets[sheets.length - 1];
			}

			return foundSheet;
		},

		//removes an animation rule from a sheet
		removeAnimation = function (sheet, name) {
			for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
				var rule = sheet.cssRules[j];
				// 7 means the keyframe rule
				if (rule.type === 7 && rule.name == name) {
					sheet.deleteRule(j)
					return;
				}
			}
		},

		/**
		 * Returns whether the animation should be passed to the original
		 * jQuery.fn.animate.
		 */
		passThrough = function (props, ops) {
			var nonElement = !(this[0] && this[0].nodeType),
				isInline = !nonElement && $(this).css("display") === "inline" && $(this).css("float") === "none";

			for (var name in props) {
				if (props[name] == 'show' || props[name] == 'hide' // jQuery does something with these two values
					|| jQuery.isArray(props[name]) // Arrays for individual easing
					|| props[name] < 0 // Negative values not handled the same
					|| name == 'zIndex' || name == 'z-index'
					// Firefox doesn't animate 'auto' properties
					// https://bugzilla.mozilla.org/show_bug.cgi?id=571344
					// || (browser.prefix == '-moz-' && (name == 'font-size' || name == 'fontSize'))
					) {  // unit-less value
					return true;
				}
			}

			return props.jquery === true || browser === null ||
				jQuery.isEmptyObject(props) || // Animating empty properties
				jQuery.isPlainObject(ops) || // Second parameter is an object - anifast only handles numbers
				typeof ops == 'string' || // Second parameter is a string like 'slow' TODO: remove
				isInline || nonElement;
		},

		/**
		 * Return the CSS number (with px added as the default unit if the value is a number)
		 */
		cssNumber = function(origName, value) {
			if (typeof value === "number" && !jQuery.cssNumber[ origName ]) {
				return value += "px";
			}
			return value;
		},

		/**
		 * Feature detection borrowed by Modernizr
		 */
		getBrowserProperties = function(){
			var t,
				el = document.createElement('fakeelement'),
				transitions = {
					'transition': {
						transitionEnd : 'transitionEnd',
						prefix : ''
					},
					/*
					'OTransition': {
						transitionEnd : 'oTransitionEnd',
						prefix : '-o-'
					},
					'MSTransition': {
						transitionEnd : 'msTransitionEnd',
						prefix : '-ms-'
					},
					*/
					'MozTransition': {
						transitionEnd : 'animationend',
						prefix : '-moz-'
					},
					'WebkitTransition': {
						transitionEnd : 'webkitAnimationEnd',
						prefix : '-webkit-'
					}
				}

			for(t in transitions){
				if( el.style[t] !== undefined ){
					return transitions[t];
				}
			}
			return null;
		},

		// Properties that Firefox can't animate if set to 'auto'
		// https://bugzilla.mozilla.org/show_bug.cgi?id=571344
		ffProps = {
			top : function(el) {
				return el.position().top;
			},
			left : function(el) {
				return el.position().left;
			},
			width : function(el) {
				return el.width();
			},
			height : function(el) {
				return el.height();
			},
			fontSize : function(el) {
				return '1em';
			}
		},

		browser = getBrowserProperties(),

		/**
		 * Add browser specific prefix
		 */
		addPrefix = function(properties) {
			var result = {};
			jQuery.each(properties, function(name, value) {
				result[browser.prefix + name] = value;
			});
			return result;
		},

		// The animation cache
		cache = [],

		/**
		 * Returns the animation name for a given style. It either uses a cached
		 * version or adds it to the stylesheet, removing the oldest style if the
		 * cache has reached a certain size.
		 */
		getAnimation = function(style) {
			var lastSheet, name, last;

			// Look up the cached style, set it to that name and reset age if found
			// increment the age for any other animation
			$.each(cache, function(i, animation) {
				if(style === animation.style) {
					name = animation.name;
					animation.age = 0;
				} else {
					animation.age += 1;
				}
			});

			if(!name) { // Add a new style
				lastSheet = getLastStyleSheet()
				name = "animate" + (animationNum++);
				// get the last sheet and insert this rule into it
				lastSheet.insertRule("@" + browser.prefix + "keyframes " + name + ' ' + style,
					lastSheet.cssRules.length);

				cache.push({
					name : name,
					style : style,
					age : 0
				});

				// Sort the cache by age
				cache.sort(function(first, second) {
					return first.age - second.age;
				});

				// Remove the last (oldest) item from the cache if it has more than 20 items
				if(cache.length > 20) {
					last = cache.pop();
					removeAnimation(lastSheet, last.name);
				}
			}

			return name;
		},

		oldanimate = jQuery.fn.animate;

	/**
	 * @function jQuery.fn.animate
	 * @parent jQuery.animate
	 *
	 * Animate CSS properties using native CSS animations, if possible.
	 * Uses the original [jQuery.fn.animate()](http://api.jquery.com/animate/) otherwise.
	 *
	 * @param {Object} props The CSS properties to animate
	 * @param {Integer|String|Object} [speed=400] The animation duration in ms.
	 * Will use jQuery.fn.animate if a string or object is passed
	 * @param {Function} [callback] A callback to execute once the animation is complete
	 * @return {jQuery} The jQuery element
	 */
	jQuery.fn.animate = function (props, speed, callback) {
		//default to normal animations if browser doesn't support them
		if (passThrough.apply(this, arguments)) {
			return oldanimate.apply(this, arguments);
		}
		if (jQuery.isFunction(speed)) {
			callback = speed;
		}

		this.queue('fx', function(done) {

			// Add everything to the animation queue
			// Most of of these calls need to happen once per element
			var current, //current CSS values
				properties = [], // The list of properties passed
				to = "",
				prop,
				self = $(this),
				duration = jQuery.fx.speeds[speed] || speed || jQuery.fx.speeds._default,
				//the animation keyframe name
				animationName,
				// The key used to store the animation hook
				dataKey = animationName + '.run',
				//the text for the keyframe
				style = "{ from {",
				// The animation end event handler.
				// Will be called both on animation end and after calling .stop()
				animationEnd = function (currentCSS, exec) {
					self.css(currentCSS);
					
					self.css(addPrefix({
						"animation-duration" : "",
						"animation-name" : "",
						"animation-fill-mode" : ""
					}));

					if (callback && exec) {
						// Call success, pass the DOM element as the this reference
						callback.call(self[0], true)
					}

					jQuery.removeData(self, dataKey, true);
				}

			for(prop in props) {
				properties.push(prop);
			}

			if(browser.prefix === '-moz-') {
				// Normalize 'auto' properties in FF
				$.each(properties, function(i, prop) {
					var converter = ffProps[jQuery.camelCase(prop)];
					if(converter && self.css(prop) == 'auto') {
						self.css(prop, converter(self));
					}
				});
			}

			// Use jQuery.styles
			current = self.styles.apply(self, properties);
			jQuery.each(properties, function(i, cur) {
				// Convert a camelcased property name
				var name = cur.replace(/([A-Z]|^ms)/g, "-$1" ).toLowerCase();
				style += name + " : " + cssNumber(cur, current[cur]) + "; ";
				to += name + " : " + cssNumber(cur, props[cur]) + "; ";
			});

			style += "} to {" + to + " }}";

			animationName = getAnimation(style);

			// Add a hook which will be called when the animation stops
			jQuery._data(this, dataKey, {
				stop : function(gotoEnd) {
					// Pause the animation
					self.css(addPrefix({
						'animation-play-state' : 'paused'
					}));
					// Unbind the animation end handler
					self.off(browser.transitionEnd, animationEnd);
					if(!gotoEnd) { // We were told not to finish the animation
						// Call animationEnd but set the CSS to the current computed style
						animationEnd(self.styles.apply(self, properties), false);
					} else {
						// Finish animaion
						animationEnd(props, true);
					}
				}
			});

			// set this element to point to that animation
			self.css(addPrefix({
				"animation-duration" : duration + "ms",
				"animation-name" : animationName,
				"animation-fill-mode": "forwards"
			}));

			self.one(browser.transitionEnd, function() {
				// Call animationEnd using the current properties
				animationEnd(props, true);
				done();
			});

		});

		return this;
	};
})(jQuery);
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
// TODO remove this, phantom supports touch AND click, but need to make funcunit support touch so its testable
var isPhantom = /Phantom/.test(navigator.userAgent),
	supportTouch = !isPhantom && "ontouchend" in document,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
	data = function(event){
		var d = event.originalEvent.touches ?
			event.originalEvent.touches[ 0 ] :
			event;
		return {
			time: (new Date).getTime(),
			coords: [ d.pageX, d.pageY ],
			origin: $( event.target )
		};
	};

/**
 * @add jQuery.event.swipe
 */
var swipe = $.event.swipe = {
	/**
	 * @attribute delay
	 * Delay is the upper limit of time the swipe motion can take in milliseconds.  This defaults to 500.
	 * 
	 * A user must perform the swipe motion in this much time.
	 */
	delay : 500,
	/**
	 * @attribute max
	 * The maximum distance the pointer must travel in pixels.  The default is 75 pixels.
	 */
	max : 75,
	/**
	 * @attribute min
	 * The minimum distance the pointer must travel in pixels.  The default is 30 pixels.
	 */
	min : 30
};

$.event.setupHelper( [

/**
 * @hide
 * @attribute swipe
 */
"swipe",
/**
 * @hide
 * @attribute swipeleft
 */
'swipeleft',
/**
 * @hide
 * @attribute swiperight
 */
'swiperight',
/**
 * @hide
 * @attribute swipeup
 */
'swipeup',
/**
 * @hide
 * @attribute swipedown
 */
'swipedown'], touchStartEvent, function(ev){
	//listen to mouseup
	var start = data(ev),
		stop,
		delegate = ev.delegateTarget || ev.currentTarget,
		selector = ev.handleObj.selector,
		entered = this;
	
	function moveHandler(event){
		if ( !start ) {
			return;
		}
		stop = data(event);

		// prevent scrolling
		if ( Math.abs( start.coords[0] - stop.coords[0] ) > 10 ) {
			event.preventDefault();
		}
	};
	$(document.documentElement).bind(touchMoveEvent,moveHandler )
		.one(touchStopEvent, function(event){
			$(this).unbind( touchMoveEvent, moveHandler );
			if ( start && stop ) {
				var deltaX = Math.abs(start.coords[0] - stop.coords[0]),
					deltaY = Math.abs(start.coords[1] - stop.coords[1]),
					distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);

				if ( stop.time - start.time < swipe.delay && distance >= swipe.min ) {
					
					var events = ['swipe']
					if( deltaX >= swipe.min &&  deltaY < swipe.min) {
						events.push( start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight" );
					}else if(deltaY >= swipe.min && deltaX < swipe.min){
						events.push( start.coords[1] < stop.coords[1] ? "swipedown" : "swipeup" );
					}

					
					
					//trigger swipe events on this guy
					$.each($.event.find(delegate, events, selector), function(){
						this.call(entered, ev, {start : start, end: stop})
					})
				
				}
			}
			start = stop = undefined;
		})
});

})(jQuery)