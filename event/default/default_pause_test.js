steal('steal-qunit','jquerypp/event/default','jquerypp/event/pause', function() {

module("jquerypp/event/default_pause");


test("default and pause with delegate", function(){
	var order = [];
	stop();
	$("#qunit-fixture").html("<div id='foo_default_pause'><p id='bar_default_pause'>hello</p></div>")

	$("#foo_default_pause").delegate("#bar_default_pause","default.show", function(){
		order.push("default")
	});

	$("#foo_default_pause").delegate("#bar_default_pause","show", function(ev){
		order.push('show');
		ev.pause();
		setTimeout(function(){
			ev.resume();
			setTimeout(function(){
				start();
				deepEqual(order,['show','default'])
			},30)

		},50)
	});


	$("#bar_default_pause").trigger("show")

});

test("default and pause with live or on", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [],
		defaultShow = function(){
			order.push("default")
		},
		show = function(ev){
			order.push('show')
			ev.pause();
			setTimeout(function(){
				ev.resume();
				setTimeout(function(){
					start();
					deepEqual(order,['show','default']);
					if($.fn.live){
						$("#foo_default_pause").die("show");
						$("#foo_default_pause").die("default.show");
					} else {
						$(document.body).off("default.show");
						$(document.body).off("show");
					}
					
				},30)
			},50)
		};
	stop();

	if( $.fn.live ){
		$("#foo_default_pause").live("default.show", defaultShow);
		$("#foo_default_pause").live("show", show);
	} else {
		$(document.body).on("default.show", "#foo_default_pause",defaultShow);
		$(document.body).on("show", "#foo_default_pause",show);
	}

	


	$("#foo_default_pause").trigger("show")

});


test("triggerAsync", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [],
		defaultShow = function(){
			order.push("default")
		},
		show = function(ev){
			order.push('show')
			ev.pause();
			setTimeout(function(){
				ev.resume();
				setTimeout(function(){
					start();
					if( $.fn.die ) {
						$("#foo_default_pause").die();
					} else {
						$(document.body).off();
					}
					
					deepEqual(order,['show','default','async'])
				},30)
			},50)
		};
		
	stop();

	if( $.fn.live ){
		$("#foo_default_pause").live("default.show", defaultShow);
		$("#foo_default_pause").live("show", show);
	} else {
		$(document.body).on("default.show", "#foo_default_pause",defaultShow);
		$(document.body).on("show", "#foo_default_pause",show);
	}

	$("#foo_default_pause").triggerAsync("show", function(){
		order.push("async")
	})
});

test("triggerAsync with prevented callback when ev.preventDefault() is called before event pause", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [];
	stop();

	$(document.body).on("default.show","#foo_default_pause", function(){
		order.push("default")
	});

	$(document.body).on("show", "#foo_default_pause", function(ev){
		order.push('show');
		ev.preventDefault();
		ev.pause();
		setTimeout(function(){
			ev.resume();
			setTimeout(function(){
				start();
				$(document.body).off("show");
				$(document.body).off("default.show")
				deepEqual(order,['show','prevented'])
			},30)
		},50)
	});


	$("#foo_default_pause").triggerAsync("show", [5],function(){
		order.push("async")
	}, function(){
		order.push("prevented")
	})
});
test("triggerAsync with prevented callback when ev.preventDefault() is called after event pause", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [];
	stop();

	$(document.body).on("default.show", "#foo_default_pause",function(){
		order.push("default")
	});

	$(document.body).on("show", "#foo_default_pause",function(ev){
		order.push('show');
		
		ev.pause();
		setTimeout(function(){
			ev.preventDefault();
			ev.resume();
			setTimeout(function(){
				start();
				$(document.body).off("show").off("default.show")
				deepEqual(order,['show','prevented'])
			},30)
		},50)
	});


	$("#foo_default_pause").triggerAsync("show", [5],function(){
		order.push("async")
	}, function(){
		order.push("prevented")
	})
});

test("triggerAsync within another triggerAsync", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [];
	stop();

	$(document.body).on("default.show", "#foo_default_pause",function(){
		order.push("show default")
	});
	$(document.body).on("default.hide", "#foo_default_pause", function(){
		order.push("hide default")
	});
	$(document.body).on("hide", "#foo_default_pause",function(){
		order.push("hide")
	});
	$(document.body).on("show", "#foo_default_pause",function(ev){
		order.push('show');
		ev.pause();
		$("#foo_default_pause").triggerAsync("hide",function(){
				order.push("hide async")
				ev.resume();
				setTimeout(function(){
					
					start();
					$(document.body).off()
					deepEqual(order,['show','hide','hide default',"hide async","show default","show async"])
				},30)
				
			}, function(){
				order.push("hide prevented")
		})
	});


	$("#foo_default_pause").triggerAsync("show",function(){
		order.push("show async")
	}, function(){
		order.push("show prevented")
	})
});

test("triggerAsync within another triggerAsync with prevented callback", function(){
	$("#qunit-fixture").html("<div id='foo_default_pause'>hello</div>")

	var order = [];
	stop();

	$(document.body).on("default.show", "#foo_default_pause",function(){
		order.push("show default")
	});
	$(document.body).on("default.hide", "#foo_default_pause", function(){
		order.push("hide default")
	});
	$(document.body).on("hide", "#foo_default_pause",function(){
		order.push("hide")
	});
	$(document.body).on("show", "#foo_default_pause", function(ev){
		order.push('show');
		ev.preventDefault();
		ev.pause();
		$("#foo_default_pause").triggerAsync("hide",function(){
				order.push("hide async")
				ev.resume();
				setTimeout(function(){
					start();
					$(document.body).off()
					deepEqual(order,['show','hide','hide default',"hide async","show prevented"])
				},30)
				
			}, function(){
				order.push("hide prevented")
		})
	});


	$("#foo_default_pause").triggerAsync("show",function(){
		order.push("show async")
	}, function(){
		order.push("show prevented")
	})
});
test("triggerAsync with nothing", function(){
	$("#fool").triggerAsync("show", function(){
		ok(true)
	})
});


});