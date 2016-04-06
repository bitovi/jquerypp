/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/swipe/swipe*/
var $ = require('jquery');
require('../livehack/livehack.js');
var isPhantom = /Phantom/.test(navigator.userAgent), supportTouch = !isPhantom && 'ontouchend' in document, scrollEvent = 'touchmove scroll', touchStartEvent = supportTouch ? 'touchstart' : 'mousedown', touchStopEvent = supportTouch ? 'touchend' : 'mouseup', touchMoveEvent = supportTouch ? 'touchmove' : 'mousemove', data = function (event) {
        var d = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
        return {
            time: new Date().getTime(),
            coords: [
                d.clientX,
                d.clientY
            ],
            origin: $(event.target)
        };
    };
var swipe = $.event.swipe = {
        delay: 500,
        max: 320,
        min: 30
    };
$.event.setupHelper([
    'swipe',
    'swipeleft',
    'swiperight',
    'swipeup',
    'swipedown'
], touchStartEvent, function (ev) {
    var start = data(ev), stop, delegate = ev.delegateTarget || ev.currentTarget, selector = ev.handleObj.selector, entered = this;
    function moveHandler(event) {
        if (!start) {
            return;
        }
        stop = data(event);
        if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
            event.preventDefault();
        }
    }
    ;
    $(document.documentElement).bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
        $(this).unbind(touchMoveEvent, moveHandler);
        if (start && stop) {
            var deltaX = Math.abs(start.coords[0] - stop.coords[0]), deltaY = Math.abs(start.coords[1] - stop.coords[1]), distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (stop.time - start.time < swipe.delay && distance >= swipe.min && distance <= swipe.max) {
                var events = ['swipe'];
                if (deltaX >= swipe.min && deltaY < swipe.min) {
                    events.push(start.coords[0] > stop.coords[0] ? 'swipeleft' : 'swiperight');
                } else if (deltaY >= swipe.min && deltaX < swipe.min) {
                    events.push(start.coords[1] < stop.coords[1] ? 'swipedown' : 'swipeup');
                }
                $.each($.event.find(delegate, events, selector), function () {
                    this.call(entered, ev, {
                        start: start,
                        end: stop
                    });
                });
            }
        }
        start = stop = undefined;
    });
});
module.exports = $;