/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/pause/pause*/
define([
    'jquery',
    '../default/default.js'
], function ($) {
    var current, rnamespaces = /\.(.*)$/, returnFalse = function () {
            return false;
        }, returnTrue = function () {
            return true;
        };
    $.Event.prototype.isPaused = returnFalse;
    $.Event.prototype.pause = function () {
        this.pausedState = {
            isDefaultPrevented: this.isDefaultPrevented() ? returnTrue : returnFalse,
            isPropagationStopped: this.isPropagationStopped() ? returnTrue : returnFalse
        };
        this.stopImmediatePropagation();
        this.preventDefault();
        this.isPaused = returnTrue;
    };
    $.Event.prototype.resume = function () {
        var handleObj = this.handleObj, currentTarget = this.currentTarget;
        var origType = $.event.special[handleObj.origType], origHandle = origType && origType.handle;
        if (!origType) {
            $.event.special[handleObj.origType] = {};
        }
        $.event.special[handleObj.origType].handle = function (ev) {
            if (ev.handleObj === handleObj && ev.currentTarget === currentTarget) {
                if (!origType) {
                    delete $.event.special[handleObj.origType];
                } else {
                    $.event.special[handleObj.origType].handle = origHandle;
                }
            }
        };
        delete this.pausedState;
        this.isPaused = this.isImmediatePropagationStopped = returnFalse;
        if (!this.isPropagationStopped()) {
            $.event.trigger(this, [], this.target);
        }
    };
    return $;
});