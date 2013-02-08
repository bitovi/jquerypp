/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {

	$.fn.triggerAsync = function (type, data, success, prevented) {
		if (typeof data == 'function') {
			prevented = success;
			success = data;
			data = undefined;
		}

		if (this.length) {
			var el = this;
			// Trigger the event with the success callback as the success handler
			// when triggerAsync called within another triggerAsync,it's the same tick time so we should use timeout
			// http://javascriptweblog.wordpress.com/2010/06/28/understanding-javascript-timers/
			setTimeout(function () {
				el.trigger({
					type: type,
					_success: success,
					_prevented: prevented
				}, data);
			}, 0);

		} else {
			// If we have no elements call the success callback right away
			if (success) success.call(this);
		}
		return this;
	}


	//cache default types for performance
	var types = {},
		rnamespaces = /\.(.*)$/,
		$event = $.event;

	$event.special["default"] = {
		add: function (handleObj) {
			//save the type
			types[handleObj.namespace.replace(rnamespaces, "")] = true;
		},
		setup: function () {
			return true
		}
	}

	// overwrite trigger to allow default types
	var oldTrigger = $event.trigger;

	$event.trigger = function defaultTriggerer(event, data, elem, onlyHandlers) {

		// Event object or event type
		var type = event.type || event,
			// Caller can pass in an Event, Object, or just an event type string
			event = typeof event === "object" ?
			// jQuery.Event object
			event[$.expando] ? event :
			// Object literal
			new $.Event(type, event) :
			// Just the event type (string)
			new $.Event(type),
			res = oldTrigger.call($.event, event, data, elem, onlyHandlers),
			paused = event.isPaused && event.isPaused();

		if (!onlyHandlers && !event.isDefaultPrevented() && event.type.indexOf("default") !== 0) {
			// Trigger the default. event
			oldTrigger("default." + event.type, data, elem)
			if (event._success) {
				event._success(event)
			}
		}

		if (!onlyHandlers && event.isDefaultPrevented() && event.type.indexOf("default") !== 0 && !paused) {
			if (event._prevented) {
				event._prevented(event);
			}
		}

		// code for paused
		if (paused) {
			// set back original stuff
			event.isDefaultPrevented =
			event.pausedState.isDefaultPrevented;
			event.isPropagationStopped =
			event.pausedState.isPropagationStopped;
		}
		return res;
	};

	return $;
});