steal('jquery', 'jquery/dom/styles').then(function () {

	var animationNum = 0,
	//Animation events implies animations right?
		supportsAnimations = !!window.WebKitAnimationEvent,
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
		 * $.fn.animate.
		 */
		passThrough = function (props, ops) {
			var nonElement = !(this[0] && this[0].nodeType),
				isInline = !nonElement && jQuery(this).css("display") === "inline" && jQuery(this).css("float") === "none";

			for (var name in props) {
				if (props[name] == 'show' || props[name] == 'hide' // jQuery does something with these two values
					|| $.isArray(props[name]) // Arrays for individual easing
					|| props[name] < 0 // Negative values not handled the same
					|| name == 'zIndex' || name == 'z-index') { // unit-less value
					return true;
				}
			}
			return !supportsAnimations ||
				$.isEmptyObject(props) || // Animating empty properties
				$.isPlainObject(ops) || // Second parameter is an object - anifast only handles numbers
				typeof ops == 'string' || // Second parameter is a string like 'slow' TODO: remove
				isInline || nonElement;
		},
		oldanimate = $.fn.animate,
		oldTick = jQuery.fx.tick;

	// essentially creates webkit keyframes and points the element to that
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
	$.fn.animate = function (props, speed, callback) {
		//default to normal animations if browser doesn't support them
		if (passThrough.apply(this, arguments)) {
			return oldanimate.apply(this, arguments);
		}

		if ($.isFunction(speed)) {
			callback = speed;
		}

		var current = {}, //current CSS values
			to = "",
			self = this,
			prop,
			duration = jQuery.fx.speeds[speed] || speed || jQuery.fx.speeds._default,
			animationName = "animate" + (animationNum++), //the animation keyframe name are going to create
			style = "@-webkit-keyframes " + animationName + " { from {";	//the text for the keyframe

		for (prop in props) {
			current[prop] = this.css(prop);
			this.css(props, "") //clear property
			style += prop + " : " + current[prop] + "; ";
			to += prop + " : " + props[prop] + "; ";
		}

		/* TODO use jQuery.styles - returns different values than this.css
		 var cleared = {}, properties = [];
		 for(prop in props) {
		 cleared[prop] = '';
		 this.css(prop, '');
		 properties.push(prop);
		 }
		 current = this.styles.apply(this, properties);
		 // this.css(cleared);
		 $.each(properties, function(i, cur) {
		 style += cur + " : " + current[cur] + "; ";
		 to += cur + " : " + props[cur] + "; ";
		 });
		 */

		style += "} to {" + to + " }}"

		// get the last sheet and insert this rule into it
		var lastSheet = getLastStyleSheet();
		lastSheet.insertRule(style, lastSheet.cssRules.length);

		// set this element to point to that animation
		this.css({
			"-webkit-animation-duration" : duration + "ms",
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
			if (callback) {
				callback.apply(this, arguments)
			}
		})
		return this;
	};
});
