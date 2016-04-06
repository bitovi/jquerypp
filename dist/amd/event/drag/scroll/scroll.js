/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/drag/scroll/scroll*/
define([
    'jquery',
    '../../drop/drop.js'
], function ($) {
    $.Drag.prototype.scrolls = function (elements, options) {
        var elements = $(elements);
        for (var i = 0; i < elements.length; i++) {
            this.constructor.responder._elements.push(elements.eq(i).data('_dropData', new $.Scrollable(elements[i], options))[0]);
        }
    }, $.Scrollable = function (element, options) {
        this.element = jQuery(element);
        this.options = $.extend({
            distance: 30,
            delta: function (diff, distance) {
                return (distance - diff) / 2;
            },
            direction: 'xy',
            delay: 15
        }, options);
        this.x = this.options.direction.indexOf('x') != -1;
        this.y = this.options.direction.indexOf('y') != -1;
    };
    $.extend($.Scrollable.prototype, {
        init: function (element) {
            this.element = jQuery(element);
        },
        callHandlers: function (method, el, ev, drag) {
            this[method](el || this.element[0], ev, this, drag);
        },
        dropover: function () {
        },
        dropon: function () {
            this.clear_timeout();
        },
        dropout: function () {
            this.clear_timeout();
        },
        dropinit: function () {
        },
        dropend: function () {
        },
        clear_timeout: function () {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        },
        distance: function (diff) {
            return (30 - diff) / 2;
        },
        dropmove: function (el, ev, drop, drag) {
            this.clear_timeout();
            var mouse = ev.vector(), location_object = $(el == document.documentElement ? window : el), dimensions = location_object.dimensionsv('outer'), position = location_object.offsetv(), bottom = position.y() + dimensions.y() - mouse.y(), top = mouse.y() - position.y(), right = position.x() + dimensions.x() - mouse.x(), left = mouse.x() - position.x(), dx = 0, dy = 0, distance = this.options.distance;
            if (bottom < distance && this.y) {
                dy = this.options.delta(bottom, distance);
            } else if (top < distance && this.y) {
                dy = -this.options.delta(top, distance);
            }
            if (right < distance && this.options && this.x) {
                dx = this.options.delta(right, distance);
            } else if (left < distance && this.x) {
                dx = -this.options.delta(left, distance);
            }
            if (dx || dy) {
                var self = this;
                this.interval = setTimeout(function () {
                    self.move($(el), drag.movingElement, dx, dy, ev, ev.clientX, ev.clientY, ev.screenX, ev.screenY);
                }, this.options.delay);
            }
        },
        move: function (scroll_element, drag_element, dx, dy, ev) {
            scroll_element.scrollTop(scroll_element.scrollTop() + dy);
            scroll_element.scrollLeft(scroll_element.scrollLeft() + dx);
            drag_element.trigger($.event.fix({
                type: 'mousemove',
                clientX: ev.clientX,
                clientY: ev.clientY,
                screenX: ev.screenX,
                screenY: ev.screenY,
                pageX: ev.pageX,
                pageY: ev.pageY
            }));
        }
    });
    return $;
});