steal('jquery/class','can/control/plugin',function( $ ) {
	
	$.Controller = can.Control;
	$.fn.controller = $.fn.control;
	$.fn.controllers = $.fn.controllers;

	$.Controller.prototype.find = function(selector) {
		return this.element.find(selector);
	}
});
