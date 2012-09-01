/*global OpenAjax: true */

steal('jquery', 'can/util', 'can/model','can/observe/attributes','can/observe/setter','can/model/elements', function($, can){
	$.Model = can.Model;
	var get = $.Model.prototype.__get;
	$.Model.prototype.__get = function(attr) {
		var getter = attr && ("get" + can.classize(attr));
		return typeof this[getter] === 'function' ? this[getter]() : get.apply(this,arguments);
	};
});
