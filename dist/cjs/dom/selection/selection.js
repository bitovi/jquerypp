/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/selection/selection*/
var $ = require('jquery');
require('../range/range.js');
var getWindow = function (element) {
        return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window;
    }, getElementsSelection = function (el, win) {
        var current = $.Range.current(el).clone(), entireElement = $.Range(el).select(el);
        if (!current.overlaps(entireElement)) {
            return null;
        }
        if (current.compare('START_TO_START', entireElement) < 1) {
            startPos = 0;
            current.move('START_TO_START', entireElement);
        } else {
            fromElementToCurrent = entireElement.clone();
            fromElementToCurrent.move('END_TO_START', current);
            startPos = fromElementToCurrent.toString().length;
        }
        if (current.compare('END_TO_END', entireElement) >= 0) {
            endPos = entireElement.toString().length;
        } else {
            endPos = startPos + current.toString().length;
        }
        return {
            start: startPos,
            end: endPos,
            width: endPos - startPos
        };
    }, getSelection = function (el) {
        var win = getWindow(el);
        if (el.selectionStart !== undefined) {
            if (document.activeElement && document.activeElement != el && el.selectionStart == el.selectionEnd && el.selectionStart == 0) {
                return {
                    start: el.value.length,
                    end: el.value.length,
                    width: 0
                };
            }
            return {
                start: el.selectionStart,
                end: el.selectionEnd,
                width: el.selectionEnd - el.selectionStart
            };
        } else if (win.getSelection) {
            return getElementsSelection(el, win);
        } else {
            try {
                if (el.nodeName.toLowerCase() == 'input') {
                    var real = getWindow(el).document.selection.createRange(), r = el.createTextRange();
                    r.setEndPoint('EndToStart', real);
                    var start = r.text.length;
                    return {
                        start: start,
                        end: start + real.text.length,
                        width: real.text.length
                    };
                } else {
                    var res = getElementsSelection(el, win);
                    if (!res) {
                        return res;
                    }
                    var current = $.Range.current().clone(), r2 = current.clone().collapse().range, r3 = current.clone().collapse(false).range;
                    r2.moveStart('character', -1);
                    r3.moveStart('character', -1);
                    if (res.startPos != 0 && r2.text == '') {
                        res.startPos += 2;
                    }
                    if (res.endPos != 0 && r3.text == '') {
                        res.endPos += 2;
                    }
                    return res;
                }
            } catch (e) {
                return {
                    start: el.value.length,
                    end: el.value.length,
                    width: 0
                };
            }
        }
    }, select = function (el, start, end) {
        var win = getWindow(el);
        if (el.setSelectionRange) {
            if (end === undefined) {
                el.focus();
                el.setSelectionRange(start, start);
            } else {
                el.select();
                el.selectionStart = start;
                el.selectionEnd = end;
            }
        } else if (el.createTextRange) {
            var r = el.createTextRange();
            r.moveStart('character', start);
            end = end || start;
            r.moveEnd('character', end - el.value.length);
            r.select();
        } else if (win.getSelection) {
            var doc = win.document, sel = win.getSelection(), range = doc.createRange(), ranges = [
                    start,
                    end !== undefined ? end : start
                ];
            getCharElement([el], ranges);
            range.setStart(ranges[0].el, ranges[0].count);
            range.setEnd(ranges[1].el, ranges[1].count);
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (win.document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(el);
            range.collapse();
            range.moveStart('character', start);
            range.moveEnd('character', end !== undefined ? end : start);
            range.select();
        }
    }, replaceWithLess = function (start, len, range, el) {
        if (typeof range[0] === 'number' && range[0] < len) {
            range[0] = {
                el: el,
                count: range[0] - start
            };
        }
        if (typeof range[1] === 'number' && range[1] <= len) {
            range[1] = {
                el: el,
                count: range[1] - start
            };
            ;
        }
    }, getCharElement = function (elems, range, len) {
        var elem, start;
        len = len || 0;
        for (var i = 0; elems[i]; i++) {
            elem = elems[i];
            if (elem.nodeType === 3 || elem.nodeType === 4) {
                start = len;
                len += elem.nodeValue.length;
                replaceWithLess(start, len, range, elem);
            } else if (elem.nodeType !== 8) {
                len = getCharElement(elem.childNodes, range, len);
            }
        }
        return len;
    };
$.fn.selection = function (start, end) {
    if (start !== undefined) {
        return this.each(function () {
            select(this, start, end);
        });
    } else {
        return getSelection(this[0]);
    }
};
$.fn.selection.getCharElement = getCharElement;
module.exports = $;