/*global OpenAjax: true */

steal('jquery', 'can/util', 'can/model','can/observe/attributes','can/observe/setter','can/model/elements', function($, can){
	$.Model = can.Model;
	var get = $.Model.prototype.__get;
	$.Model.prototype.__get = function(attr) {
		var getter = attr && ("get" + can.classize(attr));
		return typeof this[getter] === 'function' ? this[getter]() : get.apply(this,arguments);
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
