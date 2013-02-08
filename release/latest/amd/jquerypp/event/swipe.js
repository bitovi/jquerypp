/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/event/livehack'], function ($) {
	var isPhantom = /Phantom/.test(navigator.userAgent),
		supportTouch = !isPhantom && "ontouchend" in document,
		scrollEvent = "touchmove scroll",
		// Use touch events or map it to mouse events
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
		data = function (event) {
			var d = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
			return {
				time: (new Date).getTime(),
				coords: [d.pageX, d.pageY],
				origin: $(event.target)
			};
		};

	var swipe = $.event.swipe = {

		delay: 500,

		max: 320,

		min: 30
	};

	$.event.setupHelper([

	"swipe",

	'swipeleft',

	'swiperight',

	'swipeup',

	'swipedown'], touchStartEvent, function (ev) {
		var
		// update with data when the event was started
		start = data(ev),
			stop, delegate = ev.delegateTarget || ev.currentTarget,
			selector = ev.handleObj.selector,
			entered = this;

		function moveHandler(event) {
			if (!start) {
				return;
			}
			// update stop with the data from the current event
			stop = data(event);

			// prevent scrolling
			if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
				event.preventDefault();
			}
		};

		// Attach to the touch move events
		$(document.documentElement).bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
			$(this).unbind(touchMoveEvent, moveHandler);
			// if start and stop contain data figure out if we have a swipe event
			if (start && stop) {
				// calculate the distance between start and stop data
				var deltaX = Math.abs(start.coords[0] - stop.coords[0]),
					deltaY = Math.abs(start.coords[1] - stop.coords[1]),
					distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				// check if the delay and distance are matched
				if (stop.time - start.time < swipe.delay && distance >= swipe.min && distance <= swipe.max) {
					var events = ['swipe'];
					// check if we moved horizontally
					if (deltaX >= swipe.min && deltaY < swipe.min) {
						// based on the x coordinate check if we moved left or right
						events.push(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
					} else
					// check if we moved vertically
					if (deltaY >= swipe.min && deltaX < swipe.min) {
						// based on the y coordinate check if we moved up or down
						events.push(start.coords[1] < stop.coords[1] ? "swipedown" : "swipeup");
					}

					// trigger swipe events on this guy
					$.each($.event.find(delegate, events, selector), function () {
						this.call(entered, ev, {
							start: start,
							end: stop
						})
					})

				}
			}
			// reset start and stop
			start = stop = undefined;
		})
	});

	return $;
});