/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/compare/compare*/
define(['jquery'], function ($) {
    $.fn.compare = function (element) {
        try {
            element = element.jquery ? element[0] : element;
        } catch (e) {
            return null;
        }
        if (window.HTMLElement) {
            var s = HTMLElement.prototype.toString.call(element);
            if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
                return null;
            }
        }
        if (this[0].compareDocumentPosition) {
            return this[0].compareDocumentPosition(element);
        }
        if (this[0] == document && element != document)
            return 8;
        var number = (this[0] !== element && this[0].contains(element) && 16) + (this[0] != element && element.contains(this[0]) && 8), docEl = document.documentElement;
        if (this[0].sourceIndex) {
            number += this[0].sourceIndex < element.sourceIndex && 4;
            number += this[0].sourceIndex > element.sourceIndex && 2;
            number += (this[0].ownerDocument !== element.ownerDocument || this[0] != docEl && this[0].sourceIndex <= 0 || element != docEl && element.sourceIndex <= 0) && 1;
        }
        return number;
    };
    return $;
});