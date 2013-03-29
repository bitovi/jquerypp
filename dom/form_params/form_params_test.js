steal("jquerypp/dom/form_params", 'funcunit/qunit', 'jquerypp/view/micro',
function() {

$.ajaxSetup({
	cache : false
});
     
module("jquerypp/dom/form_params")
test("with a form", function(){

	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{})

	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === "2","two is right");
	ok(formParams.params.three === "3","three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,["2","3"],"five is right");
	equal(typeof formParams.id , 'string', "Id value is empty");

	equal( typeof formParams.singleRadio, "string", "Type of single named radio is string" );
	equal( formParams.singleRadio, "2", "Value of single named radio is right" );

	ok( $.isArray(formParams.lastOneChecked), "Type of checkbox with last option checked is array" );
	equal( formParams.lastOneChecked, "4", "Value of checkbox with the last option checked is 4" );
	
});

test("With a non-form element", function() {

	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/non-form.micro",{})

	var formParams =  $("#divform").formParams() ;

	equal( formParams.id , "foo-bar-baz", "ID input read correctly" );

});


test("with true false", function(){
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/truthy.micro",{});
	
	var formParams =  $("#qunit-test-area form").formParams(true);
	ok(formParams.foo === undefined, "foo is undefined")
	ok(formParams.bar.abc === true, "form bar is true");
	ok(formParams.bar.def === true, "form def is true");
	ok(formParams.bar.ghi === undefined, "form def is undefined");
	ok(formParams.wrong === false, "'false' should become false");
});

test("just strings",function(){
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(false) ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === '2',"two is right");
	ok(formParams.params.three === '3',"three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,['2','3'],"five is right");
	$("#qunit-test-area").html('')
});

test("empty string conversion",function() {
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(false) ;
	ok('' === formParams.empty, 'Default empty string conversion');
	formParams =  $("#qunit-test-area form").formParams(true);
	ok(undefined === formParams.empty, 'Default empty string conversion');
});

test("missing names",function(){
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/checkbox.micro",{});
	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(true, "does not break")
});

test("same input names to array", function() {
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(true);
	same(formParams.param1, ['first', 'second', 'third']);
});

test("#17 duplicate sub-keys", function() {
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(true);
	ok(!$.isArray(formParams.test.first), 'First value is not an array');
	equals(formParams.test.first, 'test_first', 'First test value correct');
	ok(!$.isArray(formParams.bla.first), 'Second value is not an array');
	equals(formParams.bla.first, 'bla_first', 'Second test value correct');
	console.log(formParams);
});

test("#24 disabled elements", function() {
	$("#qunit-test-area").html("//jquerypp/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams();
	console.log(formParams);
	ok(!formParams.is_disabled, 'Disabled field is not included');
	equals(formParams.not_disabled, 'not disabled', 'Not disabled field');
});

});
