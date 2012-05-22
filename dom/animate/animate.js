steal('jquery', 'jquery/dom/styles').then(function () {

	var animationNum = 0,
	//Animation events implies animations right?
		suportsAnimations = !!window.WebKitAnimationEvent;

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
		}

	// essentially creates webkit keyframes and points the element to that
	/**
	 * @function jQuery.fn.anifast
	 * @parent jQuery.animate
	 *
	 * Uses CSS animations if available.
	 *
	 * @param props
	 * @param speed
	 * @param callback
	 * @return {jQuery} The jQuery element
	 */
	$.fn.anifast = function (props, speed, callback) {

		//default to normal animations if browser doesn't support them
		if (!suportsAnimations) {
			return this.animate(props, speed, callback)
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
});
