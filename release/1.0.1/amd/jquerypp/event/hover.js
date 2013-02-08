/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/event/livehack'], function ($) {

	$.Hover = function () {
		this._delay = $.Hover.delay;
		this._distance = $.Hover.distance;
		this._leave = $.Hover.leave
	};

	$.extend($.Hover, {

		delay: 100,

		distance: 10,
		leave: 0
	})


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
	})
	var event = $.event,
		handle = event.handle,
		onmouseenter = function (ev) {
			// now start checking mousemoves to update location
			var delegate = ev.delegateTarget || ev.currentTarget;
			var selector = ev.handleObj.selector;
			var pending = $.data(delegate, "_hover" + selector);
			// prevents another mouseenter until current has run its course
			if (pending) {
				// Under some  circumstances, mouseleave may never fire
				// (e.g., the element is removed while hovered)
				// so if we've entered another element, wait the leave time,
				// then force it to release.
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
			},
				// The current distance
				dist = 0,
				// Timer that checks for the distance travelled
				timer, enteredEl = this,
				// If we are hovered
				hovered = false,
				// The previous event
				lastEv = ev,
				// The $.Hover instance passed to events
				hover = new $.Hover(),
				// timer if hover.leave has been called
				leaveTimer,
				// Callback for triggering hoverleave
				callHoverLeave = function () {
					$.each(event.find(delegate, ["hoverleave"], selector), function () {
						this.call(enteredEl, ev, hover)
					})
					cleanUp();
				},
				mousemove = function (ev) {
					clearTimeout(leaveTimer);
					// Update the distance and location
					dist += Math.pow(ev.pageX - loc.pageX, 2) + Math.pow(ev.pageY - loc.pageY, 2);
					loc = {
						pageX: ev.pageX,
						pageY: ev.pageY
					}
					lastEv = ev
				},
				mouseleave = function (ev) {
					clearTimeout(timer);
					if (hovered) {
						// go right away
						if (hover._leave === 0) {
							callHoverLeave();
						} else {
							clearTimeout(leaveTimer);
							// leave the hover after the time set in hover.leave(time)
							pending.leaving = new Date();
							leaveTimer = pending.leaveTimer = setTimeout(function () {
								callHoverLeave();
							}, hover._leave)
						}
					} else {
						cleanUp();
					}
				},
				cleanUp = function () {
					// Unbind all events and data
					$(enteredEl).unbind("mouseleave", mouseleave)
					$(enteredEl).unbind("mousemove", mousemove);
					$.removeData(delegate, "_hover" + selector)
				},
				hoverenter = function () {
					$.each(event.find(delegate, ["hoverenter"], selector), function () {
						this.call(enteredEl, lastEv, hover)
					})
					hovered = true;
				};
			pending = {
				callHoverLeave: callHoverLeave,
				hover: hover
			};
			$.data(delegate, "_hover" + selector, pending);

			// Bind the mousemove event
			$(enteredEl).bind("mousemove", mousemove).bind("mouseleave", mouseleave);
			// call hoverinit for each element with the hover instance
			$.each(event.find(delegate, ["hoverinit"], selector), function () {
				this.call(enteredEl, ev, hover)
			})

			if (hover._delay === 0) {
				hoverenter();
			} else {
				timer = setTimeout(function () {
					// check that we aren't moving around
					if (dist < hover._distance && $(enteredEl).queue().length == 0) {
						hoverenter();
						return;
					} else {
						// Reset distance and timer
						dist = 0;
						timer = setTimeout(arguments.callee, hover._delay)
					}
				}, hover._delay);
			}
		};


	// Attach events
	event.setupHelper([

	"hoverinit",

	"hoverenter",

	"hoverleave",

	"hovermove"], "mouseenter", onmouseenter)

	return $;
});