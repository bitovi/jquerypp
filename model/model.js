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
	// restore the ability to push a list!arg
	var push = $.Model.List.prototype.push;
	$.Model.List.prototype.push = function(arg) {
		if(arg instanceof $.Model.List) {
			arg = can.makeArray(arg);
		}
		return push.apply(this,arguments);
	};

	$.Model.prototype.update = function( attrs, success, error ) {
		steal.dev.log('$.Model.update is deprecated. You can use attr + save instead.');
		this.attr(attrs);
		return this.save(success, error);
	};
});
