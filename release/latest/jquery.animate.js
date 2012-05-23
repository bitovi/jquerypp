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
(function () {

	var animationNum = 0,
	//Animation events implies animations right?
		supportsAnimations = !!window.WebKitAnimationEvent;

	//gets the last editable stylesheet or creates one
	var getLastStyleSheet = function () {
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
		 * $.fn.animate.
		 */
		passThrough = function(props, ops) {
			var nonElement = !(this[0] && this[0].nodeType),
				isInline = !nonElement && jQuery(this).css("display") === "inline" && jQuery(this).css("float") === "none";

			for(var name in props) {
				if(props[name] == 'show' || props[name] == 'hide' // jQuery does something with these two values
					|| $.isArray(props[name]) // Array for individual easing
					|| props[name] < 0) { // Can't animate negative properties
					return true;
				}
			}
			return !supportsAnimations ||
				$.isEmptyObject(props) || // Animating empty properties
				($.isPlainObject(ops) || // Second parameter is an object - anifast only handles numbers
				typeof ops == 'string') || // Second parameter is a string lik 'slow'
				isInline || nonElement;
		},
		oldanimate = $.fn.animate;

	// essentially creates webkit keyframes and points the element to that
	/**
	 * @function jQuery.fn.anifast
	 * @parent jQuery.animate
	 *
	 * Animate CSS properties using native CSS animations, if possible.
	 * Uses [jQuery.fn.animate()](http://api.jquery.com/animate/) otherwise.
	 *
	 * @param {Object} props The CSS properties to animate
	 * @param {Integer|String|Object} [speed=400] The animation duration in ms.
	 * Will use jQuery.fn.animate if a string or object is passed
	 * @param {Function} [callback] A callback to execute once the animation is complete
	 * @return {jQuery} The jQuery element
	 */
	$.fn.anifast = function (props, speed, callback) {
		//default to normal animations if browser doesn't support them
		if (passThrough.apply(this, arguments)) {
			return oldanimate.apply(this, arguments);
		}

		if($.isFunction(speed)) {
			callback = speed;
		}

		var current = {}, //current CSS values
			to = "",
			self = this,
			prop,
			animationName = "animate" + (animationNum++), //the animation keyframe name are going to create
			style = "@-webkit-keyframes " + animationName + " { from {";	//the text for the keyframe

		for (prop in props) {
			current[prop] = this.css(prop);
			this.css(props, "") //clear property
			style += prop + " : " + current[prop] + "; ";
			to += prop + " : " + props[prop] + "; ";
		}

//		for(prop in props) {
//			properties.push(prop);
//		}
//		current = this.styles.apply(this, properties);
//		$.each(properties, function(i, prop) {
//			self.css(props, "") //clear property
//			style += prop + " : " + current[prop] + "; ";
//			to += prop + " : " + props[prop] + "; ";
//		})

		style += "} to {" + to + " }}"

		// get the last sheet and insert this rule into it
		var lastSheet = getLastStyleSheet();
		lastSheet.insertRule(style, lastSheet.cssRules.length);

		// set this element to point to that animation
		this.css({
			"-webkit-animation-duration" : (speed ||400) + "ms",
			"-webkit-animation-name" : animationName
		})

		// listen for when it's completed
		this.one('webkitAnimationEnd', function () {

			// clear old properties
			self.css(props).css({
				"-webkit-animation-duration" : "",
				"-webkit-animation-name" : ""
			});
			// remove the animation keyframe
			removeAnimation(lastSheet, animationName);

			// call success (this should happen once for each element)
			if(callback) {

				callback.apply(this, arguments)
			}
		})
		return this;
	};
})(jQuery)