/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery'], function ($) {
	var getSetZero = function (v) {
		return v !== undefined ? (this.array[0] = v) : this.array[0]
	},
		getSetOne = function (v) {
			return v !== undefined ? (this.array[1] = v) : this.array[1]
		};

	$.Vector = function (arr) {
		var array = $.isArray(arr) ? arr : $.makeArray(arguments);
		this.update(array);
	};
	$.Vector.prototype =

	{

		app: function (f) {
			var i, newArr = [];

			for (i = 0; i < this.array.length; i++) {
				newArr.push(f(this.array[i], i));
			}
			return new $.Vector(newArr);
		},

		plus: function () {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for (i = 0; i < args.length; i++) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},

		minus: function () {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for (i = 0; i < args.length; i++) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},

		equals: function () {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for (i = 0; i < args.length; i++) {
				if (arr[i] != args[i]) {
					return null;
				}
			}
			return vec.update(arr);
		},

		x: getSetZero,

		left: getSetZero,

		width: getSetZero,

		y: getSetOne,

		top: getSetOne,

		height: getSetOne,

		toString: function () {
			return "(" + this.array.join(', ') + ")";
		},

		update: function (array) {
			var i;
			if (this.array) {
				for (i = 0; i < this.array.length; i++) {
					delete this.array[i];
				}
			}
			this.array = array;
			for (i = 0; i < array.length; i++) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function () {
		// Get the first touch element for touch events
		var touches = "ontouchend" in document && this.originalEvent.touches && this.originalEvent.touches.length ? this.originalEvent.changedTouches[0] : this;
		if (this.originalEvent.synthetic) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(touches.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), touches.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(touches.pageX, touches.pageY);
		}
	};

	$.fn.offsetv = function () {
		if (this[0] == window) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function (which) {
		if (this[0] == window || !which) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};

	return $;
});