/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/lang/vector', 'jquerypp/event/livehack', 'jquerypp/event/reverse'], function ($) {

	if (!$.event.special.move) {
		$.event.reverse('move');
	}

	//modify live
	//steal the live handler ....
	var bind = function (object, method) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function () {
			var args2 = [this].concat(args, $.makeArray(arguments));
			return method.apply(object, args2);
		};
	},
		event = $.event,
		// function to clear the window selection if there is one
		clearSelection = window.getSelection ?
		function () {
			window.getSelection().removeAllRanges()
		} : function () {},

		supportTouch = "ontouchend" in document,
		// Use touch events or map it to mouse events
		startEvent = supportTouch ? "touchstart" : "mousedown",
		stopEvent = supportTouch ? "touchend" : "mouseup",
		moveEvent = supportTouch ? "touchmove" : "mousemove",
		// On touchmove events the default (scrolling) event has to be prevented
		preventTouchScroll = function (ev) {
			ev.preventDefault();
		};


	$.Drag = function () {};


	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,

		mousedown: function (ev, element) {
			var isLeftButton = ev.button === 0 || ev.button == 1,
				doEvent = isLeftButton || supportTouch;

			if (!doEvent || this.current) {
				return;
			}

			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector),
					dragcleanup: event.find(delegate, ["dragcleanup"], selector)
				},
				destroyed: function () {
					self.current = null;
				}
			}, ev);
		}
	});


	$.extend($.Drag.prototype, {
		setup: function (options, ev) {
			$.extend(this, options);

			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;

			//where the mouse is located
			this.mouseStartPosition = ev.vector();

			$(document).bind(moveEvent, mousemove);
			$(document).bind(stopEvent, mouseup);
			if (supportTouch) {
				// On touch devices we want to disable scrolling
				$(document).bind(moveEvent, preventTouchScroll);
			}

			if (!this.callEvents('down', this.element, ev)) {
				this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},



		destroy: function () {
			// Unbind the mouse handlers attached for dragging
			$(document).unbind(moveEvent, this._mousemove);
			$(document).unbind(stopEvent, this._mouseup);
			if (supportTouch) {
				// Enable scrolling again for touch devices when the drag is done
				$(document).unbind(moveEvent, preventTouchScroll);
			}

			if (!this.moved) {
				this.event = this.element = null;
			}

			if (!supportTouch) {
				this.selection(this.delegate);
			}
			this.destroyed();
		},
		mousemove: function (docEl, ev) {
			if (!this.moved) {
				var dist = Math.sqrt(Math.pow(ev.pageX - this.event.pageX, 2) + Math.pow(ev.pageY - this.event.pageY, 2));
				// Don't initialize the drag if it hasn't been moved the minimum distance
				if (dist < this._distance) {
					return false;
				}
				// Otherwise call init and indicate that the drag has moved
				this.init(this.element, ev);
				this.moved = true;
			}

			this.element.trigger('move', this);
			var pointer = ev.vector();
			if (this._start_position && this._start_position.equals(pointer)) {
				return;
			}
			this.draw(pointer, ev);
		},

		mouseup: function (docEl, event) {
			//if there is a current, we should call its dragstop
			if (this.moved) {
				this.end(event);
			}
			this.destroy();
		},


		noSelection: function (elm) {
			elm = elm || this.delegate
			document.documentElement.onselectstart = function () {
				// Disables selection
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},


		selection: function () {
			if (this.selectionDisabled) {
				document.documentElement.onselectstart = function () {};
				document.documentElement.unselectable = "off";
				this.selectionDisabled.css('-moz-user-select', '');
			}
		},

		init: function (element, event) {
			element = $(element);
			//the element that has been clicked on
			var startElement = (this.movingElement = (this.element = $(element)));
			//if a mousemove has come after the click
			//if the drag has been cancelled
			this._cancelled = false;
			this.event = event;


			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			this.callEvents('init', element, event);

			// Check what they have set and respond accordingly if they canceled
			if (this._cancelled === true) {
				return;
			}
			// if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			// Adjust the drag elements z-index to a high value
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder) {
				// calls $.Drop.prototype.compile if there is a drop element
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function (that) {
			var style, pos = that.css('position');

			// Position properly, set top and left to 0px for Opera
			if (!pos || pos == 'static') {
				style = {
					position: 'relative'
				};

				if (window.opera) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function (type, element, event, drop) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for (i = 0; i < cbs.length; i++) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},

		currentDelta: function () {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function (pointer, event) {
			// only drag if we haven't been cancelled;
			if (this._cancelled) {
				return;
			}
			clearSelection();

			// the offset between the mouse pointer and the representative that the user asked for
			this.location = pointer.minus(this.mouseElementPosition);

			// call move events
			this.move(event);
			if (this._cancelled) {
				return;
			}
			if (!event.isDefaultPrevented()) {
				this.position(this.location);
			}

			// fill in
			if (!this._only && this.constructor.responder) {
				this.constructor.responder.show(pointer, this, event);
			}
		},

		position: function (newOffsetv) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				// the vector between the movingElement's page and css positions
				// this can be thought of as the original offset
				dragged_element_position_vector = this.movingElement.offsetv().minus(dragged_element_css_offset);
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function (event) {
			this.callEvents('move', this.element, event);
		},
		over: function (event, drop) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function (event, drop) {
			this.callEvents('out', this.element, event, drop);
		},

		end: function (event) {
			// If canceled do nothing
			if (this._cancelled) {
				return;
			}
			// notify the responder - usually a $.Drop instance
			if (!this._only && this.constructor.responder) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if (this._revert) {
				var self = this;
				// animate moving back to original position
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function () {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup(event);
			}
			this.event = null;
		},

		cleanup: function (event) {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if (this.movingElement[0] !== this.element[0] && !this.movingElement.has(this.element[0]).length && !this.element.has(this.movingElement[0]).length) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if (this._removeMovingElement) {
				// Remove the element when using drag.ghost()
				this.movingElement.remove();
			}

			if (event) {
				this.callEvents('cleanup', this.element, event);
			}

			this.movingElement = this.element = this.event = null;
		},

		cancel: function () {
			this._cancelled = true;
			if (!this._only && this.constructor.responder) {
				// clear the drops
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},

		ghost: function (parent) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			if (parent) {
				$(parent).append(ghost);
			} else {
				$(this.movingElement).after(ghost)
			}
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())

			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},

		representative: function (element, offsetX, offsetY) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;
			// Just set the representative as the drag element
			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
			return this;
		},

		revert: function (val) {
			this._revert = val === undefined ? true : val;
			return this;
		},

		vertical: function () {
			this._vertical = true;
			return this;
		},

		horizontal: function () {
			this._horizontal = true;
			return this;
		},

		only: function (only) {
			return (this._only = (only === undefined ? true : only));
		},


		distance: function (val) {
			if (val !== undefined) {
				this._distance = val;
				return this;
			} else {
				return this._distance
			}
		}
	});

	event.setupHelper([

	'dragdown',

	'draginit',

	'dragover',

	'dragmove',

	'dragout',

	'dragend',

	'dragcleanup'], startEvent, function (e) {
		$.Drag.mousedown.call($.Drag, e, this);
	});

	return $;
});