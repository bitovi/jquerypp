steal('funcunit/qunit','jquerypp/view/tmpl').then(function(){
// use the view/qunit.html test to run this test script
module("jquerypp/view/tmpl")

test("ifs work", function(){
	$("#qunit-test-area").html("");
	
	$("#qunit-test-area").html("//jquerypp/view/tmpl/test.tmpl",{});
	ok($("#qunit-test-area").find('h1').length, "There's an h1")
})
});
