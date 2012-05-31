steal('jquery', 'jquery/dom/styles').then(function ($) {

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

			// Look up the cached style, increment the age for any other animation
			$.each(cache, function(i, animation) {
				if(style === animation.style) {
					name = animation.name;
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
});
