steal('jquery', 'can/control', 'jquery/class','can/control/plugin',function($, Control) {
	$.Controller = Control;
	$.fn.controller = $.fn.control;
	$.fn.controllers = $.fn.controls;
	can.Control.prototype.find = can.Control.prototype.find || function(s) {
		return this.element.find(s);
	};
	can.Control.prototype.callback = can.Control.prototype.proxy;
	$.Controller.prototype.bind = $.Controller.prototype.on;
	$.Controller.prototype.delegate = $.Controller.prototype.on;
	$.Controller.init = function() {
		this.prototype.Class = this;
	};
});
