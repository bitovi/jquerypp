/*global OpenAjax: true */

steal('jquery', 'can/util', 'can/model','can/observe/attributes','can/observe/setter','can/model/elements', function($, can){
	$.Model = can.Model;
	can.Model.prototype.callback = can.Model.prototype.proxy;
	can.Model.callback = can.Construct.prototype.proxy;

	$.Model.prototype.attrs = $.Model.prototype.attr;
	var get = $.Model.prototype.__get;
	$.Model.prototype.__get = function(attr) {
		var getter = attr && ("get" + can.classize(attr));
		return typeof this[getter] === 'function' ? this[getter]() : get.apply(this,arguments);
	};
	$.Model.init = function() {
		this.prototype.Class = this;
		this.callback = can.Construct.prototype.proxy;
	};
	// make defaults work again
	var setup = $.Model.prototype.setup;
	$.Model.prototype.setup = function(attrs) {
		attrs = $.extend(true,{},this.Class.defaults,attrs);
		return setup.apply(this,arguments);
	};
	// List.get used to take a model or list of models
	var getList = $.Model.List.prototype.get;
	$.Model.List.prototype.get = function(arg) {
		var ids;
		if(arg instanceof $.Model.List) {
			ids = [];
			$.each(arg,function() {
				ids.push(this.attr('id'));
			});
			arg = ids;
		} else if(arg.attr && arg.attr('id')) {
			arg = arg.attr('id');
		}
		return getList.apply(this,arguments);
	};
});
