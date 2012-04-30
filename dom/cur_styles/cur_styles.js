steal('jquery/dom').then(function( $ ) {

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

	$.curStyles = function( el, styles ) {
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
	 * @function jQuery.fn.curStyles
	 * 
	 * @parent jQuery.curStyles
	 * @plugin jQuery.curStyles
	 * @param {String} style pass style names as arguments
	 * @return {Object} an object of style:value pairs
	 */
	$.fn.curStyles = function() {
		return $.curStyles(this[0], $.makeArray(arguments));
	};
});