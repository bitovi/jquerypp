/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/default/default*/
var $ = require('jquery');
$.fn.triggerAsync = function (type, data, success, prevented) {
    if (typeof data == 'function') {
        prevented = success;
        success = data;
        data = undefined;
    }
    if (this.length) {
        var el = this;
        setTimeout(function () {
            el.trigger({
                type: type,
                _success: success,
                _prevented: prevented
            }, data);
        }, 0);
    } else {
        if (success)
            success.call(this);
    }
    return this;
};
var types = {}, rnamespaces = /\.(.*)$/, $event = $.event;
$event.special['default'] = {
    add: function (handleObj) {
        types[handleObj.namespace.replace(rnamespaces, '')] = true;
    },
    setup: function () {
        return true;
    }
};
var oldTrigger = $event.trigger;
$event.trigger = function defaultTriggerer(event, data, elem, onlyHandlers) {
    var type = event.type || event, event = typeof event === 'object' ? event[$.expando] ? event : new $.Event(type, event) : new $.Event(type), res = oldTrigger.call($.event, event, data, elem, onlyHandlers), paused = event.isPaused && event.isPaused();
    if (!onlyHandlers && !event.isDefaultPrevented() && event.type.indexOf('default') !== 0) {
        oldTrigger('default.' + event.type, data, elem);
        if (event._success) {
            event._success(event);
        }
    }
    if (!onlyHandlers && event.isDefaultPrevented() && event.type.indexOf('default') !== 0 && !paused) {
        if (event._prevented) {
            event._prevented(event);
        }
    }
    if (paused) {
        event.isDefaultPrevented = event.pausedState.isDefaultPrevented;
        event.isPropagationStopped = event.pausedState.isPropagationStopped;
    }
    return res;
};
module.exports = $;