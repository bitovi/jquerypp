/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/hover/hover*/
var $ = require('jquery');
require('../livehack/livehack.js');
$.Hover = function () {
    this._delay = $.Hover.delay;
    this._distance = $.Hover.distance;
    this._leave = $.Hover.leave;
};
$.extend($.Hover, {
    delay: 100,
    distance: 10,
    leave: 0
});
$.extend($.Hover.prototype, {
    delay: function (delay) {
        this._delay = delay;
        return this;
    },
    distance: function (distance) {
        this._distance = distance;
        return this;
    },
    leave: function (leave) {
        this._leave = leave;
        return this;
    }
});
var event = $.event, handle = event.handle, onmouseenter = function (ev) {
        var delegate = ev.delegateTarget || ev.currentTarget;
        var selector = ev.handleObj.selector;
        var pending = $.data(delegate, '_hover' + selector);
        if (pending) {
            if (!pending.forcing) {
                pending.forcing = true;
                clearTimeout(pending.leaveTimer);
                var leaveTime = pending.leaving ? Math.max(0, pending.hover.leave - (new Date() - pending.leaving)) : pending.hover.leave;
                var self = this;
                setTimeout(function () {
                    pending.callHoverLeave();
                    onmouseenter.call(self, ev);
                }, leaveTime);
            }
            return;
        }
        var loc = {
                pageX: ev.pageX,
                pageY: ev.pageY
            }, dist = 0, timer, enteredEl = this, hovered = false, lastEv = ev, hover = new $.Hover(), leaveTimer, callHoverLeave = function () {
                $.each(event.find(delegate, ['hoverleave'], selector), function () {
                    this.call(enteredEl, ev, hover);
                });
                cleanUp();
            }, mousemove = function (ev) {
                clearTimeout(leaveTimer);
                dist += Math.pow(ev.pageX - loc.pageX, 2) + Math.pow(ev.pageY - loc.pageY, 2);
                loc = {
                    pageX: ev.pageX,
                    pageY: ev.pageY
                };
                lastEv = ev;
            }, mouseleave = function (ev) {
                clearTimeout(timer);
                if (hovered) {
                    if (hover._leave === 0) {
                        callHoverLeave();
                    } else {
                        clearTimeout(leaveTimer);
                        pending.leaving = new Date();
                        leaveTimer = pending.leaveTimer = setTimeout(function () {
                            callHoverLeave();
                        }, hover._leave);
                    }
                } else {
                    cleanUp();
                }
            }, cleanUp = function () {
                $(enteredEl).unbind('mouseleave', mouseleave);
                $(enteredEl).unbind('mousemove', mousemove);
                $.removeData(delegate, '_hover' + selector);
            }, hoverenter = function () {
                $.each(event.find(delegate, ['hoverenter'], selector), function () {
                    this.call(enteredEl, lastEv, hover);
                });
                hovered = true;
            };
        pending = {
            callHoverLeave: callHoverLeave,
            hover: hover
        };
        $.data(delegate, '_hover' + selector, pending);
        $(enteredEl).bind('mousemove', mousemove).bind('mouseleave', mouseleave);
        $.each(event.find(delegate, ['hoverinit'], selector), function () {
            this.call(enteredEl, ev, hover);
        });
        if (hover._delay === 0) {
            hoverenter();
        } else {
            timer = setTimeout(function () {
                if (dist < hover._distance && $(enteredEl).queue().length == 0) {
                    hoverenter();
                    return;
                } else {
                    dist = 0;
                    timer = setTimeout(arguments.callee, hover._delay);
                }
            }, hover._delay);
        }
    };
event.setupHelper([
    'hoverinit',
    'hoverenter',
    'hoverleave',
    'hovermove'
], 'mouseenter', onmouseenter);
module.exports = $;