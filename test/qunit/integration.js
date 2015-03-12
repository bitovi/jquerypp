steal('steal-qunit',
	'jquerypp/model',
	'jquerypp/controller',
	'jquerypp/view/ejs',
	'can/util/fixture')
	.then(function(){
	
module('integration',{
	setup : function(){
		$("#qunit-fixture").html("")
	}
});

test("controller can listen to model instances and model classes", function(){
	
	
	$("#qunit-fixture").html("");
	
	
	
	$.Controller("Test.BinderThing",{
		init : function(){
			this.element.html("HELLO")
		},
		"{model} created" : function(){
			ok(true,"model called");
			start();
		},
		"{instance} created" : function(){
			ok(true, "instance updated")
		}
	});
	
	$.Model("Test.ModelThing",{
		create : function(attrs){
			var deferred = $.Deferred()
			setTimeout(function(){
				deferred.resolve({id: 1})
			},2)
			return deferred;
		}
	},{});
	
	
	var inst = new Test.ModelThing();
	
	$("<div>").appendTo( $("#qunit-fixture") )
		.test_binder_thing({
			model : Test.ModelThing,
			instance: inst
		});
	
	inst.save();
	
	stop();
})


test("Model and Views", function(){
	stop();
	
	$.Model("Test.Thing",{
		findOne : "/thing"
	},{})
	
	$.fixture("/thing","//jquerypp/test/thing.json")
	
	var res = $.View("//jquerypp/test/template.ejs",
		Test.Thing.findOne());
		
	res.done(function(resolved){
		ok(resolved,"works")
		start()
	})
})
	
})
