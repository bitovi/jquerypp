steal("jquerypp/event/removed", 'steal-qunit', function() {

module("jquerypp/event/destroyed");

test("removing an element", function(){
	var div = $("<div/>").data("testData",5);
	div.appendTo($("#qunit-fixture"));
	var destroyed = false;
	div.bind("removed",function(){
		destroyed = true;
		equal($(this).data("testData"),5, "other data still exists");
	});
	
	div.remove();
	ok(destroyed, "removed called");
});

});