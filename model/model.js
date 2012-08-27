/*global OpenAjax: true */

steal('jquery', 'can/util', 'can/model','can/observe/attributes','can/observe/setter','can/model/elements', function($, can){
	$.Model = can.Model;
	can.Model.prototype.callback = can.Model.prototype.proxy;
	can.Model.callback = can.Construct.prototype.proxy;

	$.Model.prototype.attrs = $.Model.prototype.attr;
	$.Model.init = function() {
		this.prototype.Class = this;
		this.callback = can.Construct.prototype.proxy;
	};
});
