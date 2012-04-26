steal('jquery/class','can/control/plugin',function( $ ) {
	can.Control.prototype.bind = can.Control.prototype.on;
	can.Control.prototype.find = function(selector) {
		return this.element.find(selector);
	}

	$.Controller = can.Control;
	$.fn.controller = $.fn.control;
	$.fn.controllers = $.fn.controllers;
});
