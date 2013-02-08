/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/dom/styles'], function ($) {

	var
	//margin is inside border
	weird = /button|select/i,
		getBoxes = {},
		checks = {
			width: ["Left", "Right"],
			height: ['Top', 'Bottom'],
			oldOuterHeight: $.fn.outerHeight,
			oldOuterWidth: $.fn.outerWidth,
			oldInnerWidth: $.fn.innerWidth,
			oldInnerHeight: $.fn.innerHeight
		},
		supportsSetter = $.fn.jquery >= '1.8.0';

	$.each({

		width:

		"Width",

		height:

		// for each 'height' and 'width'
		"Height"
	}, function (lower, Upper) {

		//used to get the padding and border for an element in a given direction
		getBoxes[lower] = function (el, boxes) {
			var val = 0;
			if (!weird.test(el.nodeName)) {
				//make what to check for ....
				var myChecks = [];
				$.each(checks[lower], function () {
					var direction = this;
					$.each(boxes, function (name, val) {
						if (val) myChecks.push(name + direction + (name == 'border' ? "Width" : ""));
					})
				})
				$.each($.styles(el, myChecks), function (name, value) {
					val += (parseFloat(value) || 0);
				})
			}
			return val;
		}

		//getter / setter
		if (!supportsSetter) {
			$.fn["outer" + Upper] = function (v, margin) {
				var first = this[0];
				if (typeof v == 'number') {
					// Setting the value
					first && this[lower](v - getBoxes[lower](first, {
						padding: true,
						border: true,
						margin: margin
					}))
					return this;
				} else {
					// Return the old value
					return first ? checks["oldOuter" + Upper].apply(this, arguments) : null;
				}
			}
			$.fn["inner" + Upper] = function (v) {
				var first = this[0];
				if (typeof v == 'number') {
					// Setting the value
					first && this[lower](v - getBoxes[lower](first, {
						padding: true
					}))
					return this;
				} else {
					// Return the old value
					return first ? checks["oldInner" + Upper].apply(this, arguments) : null;
				}
			}
		}

		//provides animations
		var animate = function (boxes) {
			// Return the animation function
			return function (fx) {
				if (fx[supportsSetter ? 'pos' : 'state'] == 0) {
					fx.start = $(fx.elem)[lower]();
					fx.end = fx.end - getBoxes[lower](fx.elem, boxes);
				}
				fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
			}
		}
		$.fx.step["outer" + Upper] = animate({
			padding: true,
			border: true
		})
		$.fx.step["outer" + Upper + "Margin"] = animate({
			padding: true,
			border: true,
			margin: true
		})
		$.fx.step["inner" + Upper] = animate({
			padding: true
		})

	})

	return $;
});