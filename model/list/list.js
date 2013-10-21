steal('can/util', 'can/model/list','jquerypp/model', function(can) {
	// List.get used to take a model or list of models
	var getList = $.Model.List.prototype.get;
	$.Model.List.prototype.get = function(arg) {
		var ids, id;
		if(arg instanceof $.Model.List) {
			ids = [];
			$.each(arg,function() {
				ids.push(this.attr('id'));
			});
			arg = ids;
			return getList.apply(this,arg);
		} else if(arg.attr && arg.constructor && (id = arg.attr(arg.constructor.id))) {
			arg = id;
			return getList.apply(this,[arg]);
		} else {
			return getList.apply(this,arguments);
		}
	};
	// restore the ability to push a list!arg
	var push = $.Model.List.prototype.push;
	$.Model.List.prototype.push = function(arg) {
		if(arg instanceof $.Model.List) {
			return push.apply(this,can.makeArray(arg));
		} else {
			return push.apply(this,arguments);
		}
	};
});
