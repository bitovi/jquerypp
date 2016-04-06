/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/reverse/reverse*/
var $ = require('jquery');
$.event.reverse = function (name, attributes) {
    var bound = $(), count = 0, dispatch = $.event.handle || $.event.dispatch;
    $.event.special[name] = {
        setup: function () {
            if (this !== window) {
                bound.push(this);
                $.unique(bound);
            }
            return this !== window;
        },
        teardown: function () {
            bound = bound.not(this);
            return this !== window;
        },
        add: function (handleObj) {
            var origHandler = handleObj.handler;
            handleObj.origHandler = origHandler;
            handleObj.handler = function (ev, data) {
                var isWindow = this === window;
                if (attributes && attributes.handler) {
                    var result = attributes.handler.apply(this, arguments);
                    if (result === true) {
                        return;
                    }
                }
                if (count === 0) {
                    count++;
                    var where = data === false ? ev.target : this;
                    dispatch.call(where, ev, data);
                    if (ev.isPropagationStopped()) {
                        count--;
                        return;
                    }
                    var index = bound.index(this), length = bound.length, child, sub;
                    while (++index < length && (child = bound[index]) && (isWindow || $.contains(where, child))) {
                        dispatch.call(child, ev, data);
                        if (ev.isPropagationStopped()) {
                            while (++index < length && (sub = bound[index])) {
                                if (!$.contains(child, sub)) {
                                    index--;
                                    break;
                                }
                            }
                        }
                    }
                    ev.stopImmediatePropagation();
                    count--;
                } else {
                    handleObj.origHandler.call(this, ev, data);
                }
            };
        }
    };
    $([
        document,
        window
    ]).bind(name, function () {
    });
    return $.event.special[name];
};
module.exports = $;