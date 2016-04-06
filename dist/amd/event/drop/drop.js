/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/drop/drop*/
define([
    'jquery',
    '../drag/core/core.js',
    '../../dom/within/within.js',
    '../../dom/compare/compare.js'
], function ($) {
    var event = $.event;
    var eventNames = [
            'dropover',
            'dropon',
            'dropout',
            'dropinit',
            'dropmove',
            'dropend'
        ];
    $.Drop = function (callbacks, element) {
        $.extend(this, callbacks);
        this.element = $(element);
    };
    $.each(eventNames, function () {
        event.special[this] = {
            add: function (handleObj) {
                var el = $(this), current = el.data('dropEventCount') || 0;
                el.data('dropEventCount', current + 1);
                if (current == 0) {
                    $.Drop.addElement(this);
                }
            },
            remove: function () {
                var el = $(this), current = el.data('dropEventCount') || 0;
                el.data('dropEventCount', current - 1);
                if (current <= 1) {
                    $.Drop.removeElement(this);
                }
            }
        };
    });
    $.extend($.Drop, {
        lowerName: 'drop',
        _rootElements: [],
        _elements: $(),
        last_active: [],
        endName: 'dropon',
        addElement: function (el) {
            for (var i = 0; i < this._rootElements.length; i++) {
                if (el == this._rootElements[i])
                    return;
            }
            this._rootElements.push(el);
        },
        removeElement: function (el) {
            for (var i = 0; i < this._rootElements.length; i++) {
                if (el == this._rootElements[i]) {
                    this._rootElements.splice(i, 1);
                    return;
                }
            }
        },
        sortByDeepestChild: function (a, b) {
            var compare = a.element.compare(b.element);
            if (compare & 16 || compare & 4)
                return 1;
            if (compare & 8 || compare & 2)
                return -1;
            return 0;
        },
        isAffected: function (point, moveable, responder) {
            return responder.element != moveable.element && responder.element.within(point[0], point[1], responder._cache).length == 1;
        },
        deactivate: function (responder, mover, event) {
            mover.out(event, responder);
            responder.callHandlers(this.lowerName + 'out', responder.element[0], event, mover);
        },
        activate: function (responder, mover, event) {
            mover.over(event, responder);
            responder.callHandlers(this.lowerName + 'over', responder.element[0], event, mover);
        },
        move: function (responder, mover, event) {
            responder.callHandlers(this.lowerName + 'move', responder.element[0], event, mover);
        },
        compile: function (event, drag) {
            if (!this.dragging && !drag) {
                return;
            } else if (!this.dragging) {
                this.dragging = drag;
                this.last_active = [];
            }
            var el, drops, selector, dropResponders, newEls = [], dragging = this.dragging;
            for (var i = 0; i < this._rootElements.length; i++) {
                el = this._rootElements[i];
                var drops = $.event.findBySelector(el, eventNames);
                for (selector in drops) {
                    dropResponders = selector ? jQuery(selector, el) : [el];
                    for (var e = 0; e < dropResponders.length; e++) {
                        if (this.addCallbacks(dropResponders[e], drops[selector], dragging)) {
                            newEls.push(dropResponders[e]);
                        }
                        ;
                    }
                }
            }
            this.add(newEls, event, dragging);
        },
        addCallbacks: function (el, callbacks, onlyNew) {
            var origData = $.data(el, '_dropData');
            if (!origData) {
                $.data(el, '_dropData', new $.Drop(callbacks, el));
                return true;
            } else if (!onlyNew) {
                var origCbs = origData;
                for (var eventName in callbacks) {
                    origCbs[eventName] = origCbs[eventName] ? origCbs[eventName].concat(callbacks[eventName]) : callbacks[eventName];
                }
                return false;
            }
        },
        add: function (newEls, event, drag, dragging) {
            var i = 0, drop;
            while (i < newEls.length) {
                drop = $.data(newEls[i], '_dropData');
                drop.callHandlers(this.lowerName + 'init', newEls[i], event, drag);
                if (drop._canceled) {
                    newEls.splice(i, 1);
                } else {
                    i++;
                }
            }
            this._elements.push.apply(this._elements, newEls);
        },
        show: function (point, moveable, event) {
            var element = moveable.element;
            if (!this._elements.length)
                return;
            var respondable, affected = [], propagate = true, i = 0, j, la, toBeActivated, aff, oldLastActive = this.last_active, responders = [], self = this, drag;
            while (i < this._elements.length) {
                drag = $.data(this._elements[i], '_dropData');
                if (!drag) {
                    this._elements.splice(i, 1);
                } else {
                    i++;
                    if (self.isAffected(point, moveable, drag)) {
                        affected.push(drag);
                    }
                }
            }
            affected.sort(this.sortByDeepestChild);
            event.stopRespondPropagate = function () {
                propagate = false;
            };
            toBeActivated = affected.slice();
            this.last_active = affected;
            for (j = 0; j < oldLastActive.length; j++) {
                la = oldLastActive[j];
                i = 0;
                while (aff = toBeActivated[i]) {
                    if (la == aff) {
                        toBeActivated.splice(i, 1);
                        break;
                    } else {
                        i++;
                    }
                }
                if (!aff) {
                    this.deactivate(la, moveable, event);
                }
                if (!propagate)
                    return;
            }
            for (var i = 0; i < toBeActivated.length; i++) {
                this.activate(toBeActivated[i], moveable, event);
                if (!propagate)
                    return;
            }
            for (i = 0; i < affected.length; i++) {
                this.move(affected[i], moveable, event);
                if (!propagate)
                    return;
            }
        },
        end: function (event, moveable) {
            var la, endName = this.lowerName + 'end', onEvent = $.Event(this.endName, event), dropData;
            for (var i = 0; i < this.last_active.length; i++) {
                la = this.last_active[i];
                if (this.isAffected(event.vector(), moveable, la) && la[this.endName]) {
                    la.callHandlers(this.endName, null, onEvent, moveable);
                }
                if (onEvent.isPropagationStopped()) {
                    break;
                }
            }
            for (var r = 0; r < this._elements.length; r++) {
                dropData = $.data(this._elements[r], '_dropData');
                dropData && dropData.callHandlers(endName, null, event, moveable);
            }
            this.clear();
        },
        clear: function () {
            this._elements.each(function () {
                $.removeData(this, '_dropData');
            });
            this._elements = $();
            delete this.dragging;
        }
    });
    $.Drag.responder = $.Drop;
    $.extend($.Drop.prototype, {
        callHandlers: function (method, el, ev, drag) {
            var length = this[method] ? this[method].length : 0;
            for (var i = 0; i < length; i++) {
                this[method][i].call(el || this.element[0], ev, this, drag);
            }
        },
        cache: function (value) {
            this._cache = value != null ? value : true;
        },
        cancel: function () {
            this._canceled = true;
        }
    });
    return $;
});