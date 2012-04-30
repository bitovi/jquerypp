steal('jquery/class','can/control/plugin',function( $ ) {
	$.Controller = can.Control;
	$.fn.controller = $.fn.control;
	$.fn.controllers = $.fn.controllers;
});
