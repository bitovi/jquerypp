/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/livehack/livehack*/
var $ = require('jquery');
var event = $.event, findHelper = function (events, types, callback, selector) {
        var t, type, typeHandlers, all, h, handle, namespaces, namespace, match;
        for (t = 0; t < types.length; t++) {
            type = types[t];
            all = type.indexOf('.') < 0;
            if (!all) {
                namespaces = type.split('.');
                type = namespaces.shift();
                namespace = new RegExp('(^|\\.)' + namespaces.slice(0).sort().join('\\.(?:.*\\.)?') + '(\\.|$)');
            }
            typeHandlers = (events[type] || []).slice(0);
            for (h = 0; h < typeHandlers.length; h++) {
                handle = typeHandlers[h];
                match = all || namespace.test(handle.namespace);
                if (match) {
                    if (selector) {
                        if (handle.selector === selector) {
                            callback(type, handle.origHandler || handle.handler);
                        }
                    } else if (selector === null) {
                        callback(type, handle.origHandler || handle.handler, handle.selector);
                    } else if (!handle.selector) {
                        callback(type, handle.origHandler || handle.handler);
                    }
                }
            }
        }
    };
event.find = function (el, types, selector) {
    var events = ($._data(el) || {}).events, handlers = [], t, liver, live;
    if (!events) {
        return handlers;
    }
    findHelper(events, types, function (type, handler) {
        handlers.push(handler);
    }, selector);
    return handlers;
};
event.findBySelector = function (el, types) {
    var events = $._data(el).events, selectors = {}, add = function (selector, event, handler) {
            var select = selectors[selector] || (selectors[selector] = {}), events = select[event] || (select[event] = []);
            events.push(handler);
        };
    if (!events) {
        return selectors;
    }
    findHelper(events, types, function (type, handler, selector) {
        add(selector || '', type, handler);
    }, null);
    return selectors;
};
event.supportTouch = 'ontouchend' in document;
$.fn.respondsTo = function (events) {
    if (!this.length) {
        return false;
    } else {
        return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
    }
};
$.fn.triggerHandled = function (event, data) {
    event = typeof event == 'string' ? $.Event(event) : event;
    this.trigger(event, data);
    return event.handled;
};
event.setupHelper = function (types, startingEvent, onFirst) {
    if (!onFirst) {
        onFirst = startingEvent;
        startingEvent = null;
    }
    var add = function (handleObj) {
            var bySelector, selector = handleObj.selector || '', namespace = handleObj.namespace ? '.' + handleObj.namespace : '';
            if (selector) {
                bySelector = event.find(this, types, selector);
                if (!bySelector.length) {
                    $(this).delegate(selector, startingEvent + namespace, onFirst);
                }
            } else {
                if (!event.find(this, types, selector).length) {
                    event.add(this, startingEvent + namespace, onFirst, {
                        selector: selector,
                        delegate: this
                    });
                }
            }
        }, remove = function (handleObj) {
            var bySelector, selector = handleObj.selector || '';
            if (selector) {
                bySelector = event.find(this, types, selector);
                if (!bySelector.length) {
                    $(this).undelegate(selector, startingEvent, onFirst);
                }
            } else {
                if (!event.find(this, types, selector).length) {
                    event.remove(this, startingEvent, onFirst, {
                        selector: selector,
                        delegate: this
                    });
                }
            }
        };
    $.each(types, function () {
        event.special[this] = {
            add: add,
            remove: remove,
            setup: function () {
            },
            teardown: function () {
            }
        };
    });
};
module.exports = $;