steal('jquery', 'can/control', 'jquery/class','can/control/plugin',function($, Control) {
	$.Controller = Control;
	$.fn.controller = $.fn.control;
	$.fn.controllers = $.fn.controllers;
	can.Control.prototype.callback = can.Control.prototype.proxy;
	$.Controller.init = function() {
		this.prototype.Class = this;
	};
});
