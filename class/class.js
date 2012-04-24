//jQuery.Class 
// This is a modified version of John Resig's class
// http://ejohn.org/blog/simple-javascript-inheritance/
// It provides class level inheritance and callbacks.
//!steal-clean
steal("can/construct/proxy","can/construct/super",function( $ ) {

	$.Class = can.Construct;

	var old = $.Class.extend;
	$.Class.extend = function() {
		var cls = old.apply(this, arguments);
		cls.prototype.Class = cls.prototype.constructor;
		cls.prototype.callback = cls.prototype.proxy;
		return cls;
	}
})();
