/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/range/range*/
define([
    'jquery',
    '../compare/compare.js'
], function ($) {
    $.fn.range = function () {
        return $.Range(this[0]);
    };
    var convertType = function (type) {
            return type.replace(/([a-z])([a-z]+)/gi, function (all, first, next) {
                return first + next.toLowerCase();
            }).replace(/_/g, '');
        }, reverse = function (type) {
            return type.replace(/^([a-z]+)_TO_([a-z]+)/i, function (all, first, last) {
                return last + '_TO_' + first;
            });
        }, getWindow = function (element) {
            return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window;
        }, bisect = function (el, start, end) {
            if (end - start == 1) {
                return;
            }
        }, support = {};
    $.Range = function (range) {
        if (this.constructor !== $.Range) {
            return new $.Range(range);
        }
        if (range && range.jquery) {
            range = range[0];
        }
        if (!range || range.nodeType) {
            this.win = getWindow(range);
            if (this.win.document.createRange) {
                this.range = this.win.document.createRange();
            } else if (this.win && this.win.document.body && this.win.document.body.createTextRange) {
                this.range = this.win.document.body.createTextRange();
            }
            if (range) {
                this.select(range);
            }
        } else if (range.clientX != null || range.pageX != null || range.left != null) {
            this.moveToPoint(range);
        } else if (range.originalEvent && range.originalEvent.touches && range.originalEvent.touches.length) {
            this.moveToPoint(range.originalEvent.touches[0]);
        } else if (range.originalEvent && range.originalEvent.changedTouches && range.originalEvent.changedTouches.length) {
            this.moveToPoint(range.originalEvent.changedTouches[0]);
        } else {
            this.range = range;
        }
    };
    $.Range.current = function (el) {
        var win = getWindow(el), selection;
        if (win.getSelection) {
            selection = win.getSelection();
            return new $.Range(selection.rangeCount ? selection.getRangeAt(0) : win.document.createRange());
        } else {
            return new $.Range(win.document.selection.createRange());
        }
    };
    $.extend($.Range.prototype, {
        moveToPoint: function (point) {
            var clientX = point.clientX, clientY = point.clientY;
            if (!clientX) {
                var off = scrollOffset();
                clientX = (point.pageX || point.left || 0) - off.left;
                clientY = (point.pageY || point.top || 0) - off.top;
            }
            if (support.moveToPoint) {
                this.range = $.Range().range;
                this.range.moveToPoint(clientX, clientY);
                return this;
            }
            var parent = document.elementFromPoint(clientX, clientY);
            for (var n = 0; n < parent.childNodes.length; n++) {
                var node = parent.childNodes[n];
                if (node.nodeType === 3 || node.nodeType === 4) {
                    var range = $.Range(node), length = range.toString().length;
                    for (var i = 1; i < length + 1; i++) {
                        var rect = range.end(i).rect();
                        if (rect.left <= clientX && rect.left + rect.width >= clientX && rect.top <= clientY && rect.top + rect.height >= clientY) {
                            range.start(i - 1);
                            this.range = range.range;
                            return this;
                        }
                    }
                }
            }
            var previous;
            iterate(parent.childNodes, function (textNode) {
                var range = $.Range(textNode);
                if (range.rect().top > point.clientY) {
                    return false;
                } else {
                    previous = range;
                }
            });
            if (previous) {
                previous.start(previous.toString().length);
                this.range = previous.range;
            } else {
                this.range = $.Range(parent).range;
            }
        },
        window: function () {
            return this.win || window;
        },
        overlaps: function (elRange) {
            if (elRange.nodeType) {
                elRange = $.Range(elRange).select(elRange);
            }
            var startToStart = this.compare('START_TO_START', elRange), endToEnd = this.compare('END_TO_END', elRange);
            if (startToStart <= 0 && endToEnd >= 0) {
                return true;
            }
            if (startToStart >= 0 && this.compare('START_TO_END', elRange) <= 0) {
                return true;
            }
            if (this.compare('END_TO_START', elRange) >= 0 && endToEnd <= 0) {
                return true;
            }
            return false;
        },
        collapse: function (toStart) {
            this.range.collapse(toStart === undefined ? true : toStart);
            return this;
        },
        toString: function () {
            return typeof this.range.text == 'string' ? this.range.text : this.range.toString();
        },
        start: function (set) {
            if (set === undefined) {
                if (this.range.startContainer) {
                    return {
                        container: this.range.startContainer,
                        offset: this.range.startOffset
                    };
                } else {
                    var start = this.clone().collapse().parent();
                    var startRange = $.Range(start).select(start).collapse();
                    startRange.move('END_TO_START', this);
                    return {
                        container: start,
                        offset: startRange.toString().length
                    };
                }
            } else {
                if (this.range.setStart) {
                    if (typeof set == 'number') {
                        this.range.setStart(this.range.startContainer, set);
                    } else if (typeof set == 'string') {
                        var res = callMove(this.range.startContainer, this.range.startOffset, parseInt(set, 10));
                        this.range.setStart(res.node, res.offset);
                    } else {
                        this.range.setStart(set.container, set.offset);
                    }
                } else {
                    if (typeof set == 'string') {
                        this.range.moveStart('character', parseInt(set, 10));
                    } else {
                        var container = this.start().container, offset;
                        if (typeof set == 'number') {
                            offset = set;
                        } else {
                            container = set.container;
                            offset = set.offset;
                        }
                        var newPoint = $.Range(container).collapse();
                        newPoint.range.move(offset);
                        this.move('START_TO_START', newPoint);
                    }
                }
                return this;
            }
        },
        end: function (set) {
            if (set === undefined) {
                if (this.range.startContainer) {
                    return {
                        container: this.range.endContainer,
                        offset: this.range.endOffset
                    };
                } else {
                    var end = this.clone().collapse(false).parent(), endRange = $.Range(end).select(end).collapse();
                    endRange.move('END_TO_END', this);
                    return {
                        container: end,
                        offset: endRange.toString().length
                    };
                }
            } else {
                if (this.range.setEnd) {
                    if (typeof set == 'number') {
                        this.range.setEnd(this.range.endContainer, set);
                    } else if (typeof set == 'string') {
                        var res = callMove(this.range.endContainer, this.range.endOffset, parseInt(set, 10));
                        this.range.setEnd(res.node, res.offset);
                    } else {
                        this.range.setEnd(set.container, set.offset);
                    }
                } else {
                    if (typeof set == 'string') {
                        this.range.moveEnd('character', parseInt(set, 10));
                    } else {
                        var container = this.end().container, offset;
                        if (typeof set == 'number') {
                            offset = set;
                        } else {
                            container = set.container;
                            offset = set.offset;
                        }
                        var newPoint = $.Range(container).collapse();
                        newPoint.range.move(offset);
                        this.move('END_TO_START', newPoint);
                    }
                }
                return this;
            }
        },
        parent: function () {
            if (this.range.commonAncestorContainer) {
                return this.range.commonAncestorContainer;
            } else {
                var parentElement = this.range.parentElement(), range = this.range;
                iterate(parentElement.childNodes, function (txtNode) {
                    if ($.Range(txtNode).range.inRange(range)) {
                        parentElement = txtNode;
                        return false;
                    }
                });
                return parentElement;
            }
        },
        rect: function (from) {
            var rect = this.range.getBoundingClientRect();
            if (!rect.height && !rect.width) {
                rect = this.range.getClientRects()[0];
            }
            if (from === 'page') {
                var off = scrollOffset();
                rect = $.extend({}, rect);
                rect.top += off.top;
                rect.left += off.left;
            }
            return rect;
        },
        rects: function (from) {
            var rects = $.map($.makeArray(this.range.getClientRects()).sort(function (rect1, rect2) {
                    return rect2.width * rect2.height - rect1.width * rect1.height;
                }), function (rect) {
                    return $.extend({}, rect);
                }), i = 0, j, len = rects.length;
            while (i < rects.length) {
                var cur = rects[i], found = false;
                j = i + 1;
                while (j < rects.length) {
                    if (withinRect(cur, rects[j])) {
                        if (!rects[j].width) {
                            rects.splice(j, 1);
                        } else {
                            found = rects[j];
                            break;
                        }
                    } else {
                        j++;
                    }
                }
                if (found) {
                    rects.splice(i, 1);
                } else {
                    i++;
                }
            }
            if (from == 'page') {
                var off = scrollOffset();
                return $.each(rects, function (ith, item) {
                    item.top += off.top;
                    item.left += off.left;
                });
            }
            return rects;
        }
    });
    (function () {
        var fn = $.Range.prototype, range = $.Range().range;
        fn.compare = range.compareBoundaryPoints ? function (type, range) {
            return this.range.compareBoundaryPoints(this.window().Range[reverse(type)], range.range);
        } : function (type, range) {
            return this.range.compareEndPoints(convertType(type), range.range);
        };
        fn.move = range.setStart ? function (type, range) {
            var rangesRange = range.range;
            switch (type) {
            case 'START_TO_END':
                this.range.setStart(rangesRange.endContainer, rangesRange.endOffset);
                break;
            case 'START_TO_START':
                this.range.setStart(rangesRange.startContainer, rangesRange.startOffset);
                break;
            case 'END_TO_END':
                this.range.setEnd(rangesRange.endContainer, rangesRange.endOffset);
                break;
            case 'END_TO_START':
                this.range.setEnd(rangesRange.startContainer, rangesRange.startOffset);
                break;
            }
            return this;
        } : function (type, range) {
            this.range.setEndPoint(convertType(type), range.range);
            return this;
        };
        var cloneFunc = range.cloneRange ? 'cloneRange' : 'duplicate', selectFunc = range.selectNodeContents ? 'selectNodeContents' : 'moveToElementText';
        fn.clone = function () {
            return $.Range(this.range[cloneFunc]());
        };
        fn.select = range.selectNodeContents ? function (el) {
            if (!el) {
                var selection = this.window().getSelection();
                selection.removeAllRanges();
                selection.addRange(this.range);
            } else {
                this.range.selectNodeContents(el);
            }
            return this;
        } : function (el) {
            if (!el) {
                this.range.select();
            } else if (el.nodeType === 3) {
                var parent = el.parentNode, start = 0, end;
                iterate(parent.childNodes, function (txtNode) {
                    if (txtNode === el) {
                        end = start + txtNode.nodeValue.length;
                        return false;
                    } else {
                        start = start + txtNode.nodeValue.length;
                    }
                });
                this.range.moveToElementText(parent);
                this.range.moveEnd('character', end - this.range.text.length);
                this.range.moveStart('character', start);
            } else {
                this.range.moveToElementText(el);
            }
            return this;
        };
    }());
    var iterate = function (elems, cb) {
            var elem, start;
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    if (cb(elem) === false) {
                        return false;
                    }
                } else if (elem.nodeType !== 8) {
                    if (iterate(elem.childNodes, cb) === false) {
                        return false;
                    }
                }
            }
        }, isText = function (node) {
            return node.nodeType === 3 || node.nodeType === 4;
        }, iteratorMaker = function (toChildren, toNext) {
            return function (node, mustMoveRight) {
                if (node[toChildren] && !mustMoveRight) {
                    return isText(node[toChildren]) ? node[toChildren] : arguments.callee(node[toChildren]);
                } else if (node[toNext]) {
                    return isText(node[toNext]) ? node[toNext] : arguments.callee(node[toNext]);
                } else if (node.parentNode) {
                    return arguments.callee(node.parentNode, true);
                }
            };
        }, getNextTextNode = iteratorMaker('firstChild', 'nextSibling'), getPrevTextNode = iteratorMaker('lastChild', 'previousSibling'), callMove = function (container, offset, howMany) {
            var mover = howMany < 0 ? getPrevTextNode : getNextTextNode;
            if (!isText(container)) {
                container = container.childNodes[offset] ? container.childNodes[offset] : container.lastChild;
                if (!isText(container)) {
                    container = mover(container);
                }
                return move(container, howMany);
            } else {
                if (offset + howMany < 0) {
                    return move(mover(container), offset + howMany);
                } else {
                    return move(container, offset + howMany);
                }
            }
        }, move = function (from, howMany) {
            var mover = howMany < 0 ? getPrevTextNode : getNextTextNode;
            howMany = Math.abs(howMany);
            while (from && howMany >= from.nodeValue.length) {
                howMany = howMany - from.nodeValue.length;
                from = mover(from);
            }
            return {
                node: from,
                offset: mover === getNextTextNode ? howMany : from.nodeValue.length - howMany
            };
        }, supportWhitespace, isWhitespace = function (el) {
            if (supportWhitespace == null) {
                supportWhitespace = 'isElementContentWhitespace' in el;
            }
            return supportWhitespace ? el.isElementContentWhitespace : el.nodeType === 3 && '' == el.data.trim();
        }, within = function (rect, point) {
            return rect.left <= point.clientX && rect.left + rect.width >= point.clientX && rect.top <= point.clientY && rect.top + rect.height >= point.clientY;
        }, withinRect = function (outer, inner) {
            return within(outer, {
                clientX: inner.left,
                clientY: inner.top
            }) && within(outer, {
                clientX: inner.left + inner.width,
                clientY: inner.top
            }) && within(outer, {
                clientX: inner.left,
                clientY: inner.top + inner.height
            }) && within(outer, {
                clientX: inner.left + inner.width,
                clientY: inner.top + inner.height
            });
        }, scrollOffset = function (win) {
            var win = win || window;
            doc = win.document.documentElement, body = win.document.body;
            return {
                left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
                top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
            };
        };
    support.moveToPoint = !!$.Range().range.moveToPoint;
    return $;
});