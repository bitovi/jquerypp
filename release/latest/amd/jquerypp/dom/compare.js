/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {

	// See http://ejohn.org/blog/comparing-document-position/
	$.fn.compare = function (element) { //usually
		try {
			// Firefox 3 throws an error with XUL - we can't use compare then
			element = element.jquery ? element[0] : element;
		} catch (e) {
			return null;
		}

		// make sure we aren't coming from XUL element
		if (window.HTMLElement) {
			var s = HTMLElement.prototype.toString.call(element)
			if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
				return null;
			}
		}

		if (this[0].compareDocumentPosition) {
			// For browsers that support it, use compareDocumentPosition
			// https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
			return this[0].compareDocumentPosition(element);
		}

		// this[0] contains element
		if (this[0] == document && element != document) return 8;

		var number =
		// this[0] contains element
		(this[0] !== element && this[0].contains(element) && 16) +
		// element contains this[0]
		(this[0] != element && element.contains(this[0]) && 8),
			docEl = document.documentElement;

		// Use the sourceIndex
		if (this[0].sourceIndex) {
			// this[0] precedes element
			number += (this[0].sourceIndex < element.sourceIndex && 4)
			// element precedes foo[0]
			number += (this[0].sourceIndex > element.sourceIndex && 2)
			// The nodes are in different documents
			number += (this[0].ownerDocument !== element.ownerDocument || (this[0] != docEl && this[0].sourceIndex <= 0) || (element != docEl && element.sourceIndex <= 0)) && 1
		}

		return number;
	}

	return $;
});