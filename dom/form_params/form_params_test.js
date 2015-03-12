steal(
	"jquerypp/dom/form_params/test/basics.micro!system-text",
	"jquerypp/dom/form_params/test/non-form.micro!system-text",
	"jquerypp/dom/form_params/test/truthy.micro!system-text",
	"jquerypp/dom/form_params", 'steal-qunit',
	function(basics, nonForm, truthyHtml) {

$.ajaxSetup({
	cache : false
});
     
module("jquerypp/dom/form_params")
test("with a form", function(){

	$("#qunit-fixture").html(basics);

	var formParams =  $("#qunit-fixture form").formParams() ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === "2","two is right");
	ok(formParams.params.three === "3","three is right");
	deepEqual(formParams.params.four,["4","1"],"four is right");
	deepEqual(formParams.params.five,["2","3"],"five is right");
	equal(typeof formParams.id , 'string', "Id value is empty");

	equal( typeof formParams.singleRadio, "string", "Type of single named radio is string" );
	equal( formParams.singleRadio, "2", "Value of single named radio is right" );

	ok( $.isArray(formParams.lastOneChecked), "Type of checkbox with last option checked is array" );
	equal( formParams.lastOneChecked, "4", "Value of checkbox with the last option checked is 4" );
	
});

test("With a non-form element", function() {

	$("#qunit-fixture").html(nonForm);

	var formParams =  $("#divform").formParams() ;

	equal( formParams.id , "foo-bar-baz", "ID input read correctly" );

});


test("with true false", function(){
	$("#qunit-fixture").html(truthyHtml);
	
	var formParams =  $("#qunit-fixture form").formParams(true);
	ok(formParams.foo === undefined, "foo is undefined")
	ok(formParams.bar.abc === true, "form bar is true");
	ok(formParams.bar.def === true, "form def is true");
	ok(formParams.bar.ghi === undefined, "form def is undefined");
	ok(formParams.wrong === false, "'false' should become false");
});

test("just strings",function(){
	$("#qunit-fixture").html(basics);
	var formParams =  $("#qunit-fixture form").formParams(false) ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === '2',"two is right");
	ok(formParams.params.three === '3',"three is right");
	deepEqual(formParams.params.four,["4","1"],"four is right");
	deepEqual(formParams.params.five,['2','3'],"five is right");
	$("#qunit-fixture").html('')
});

test("empty string conversion",function() {
	$("#qunit-fixture").html(basics);
	var formParams =  $("#qunit-fixture form").formParams(false) ;
	ok('' === formParams.empty, 'Default empty string conversion');
	formParams =  $("#qunit-fixture form").formParams(true);
	ok(undefined === formParams.empty, 'Default empty string conversion');
});

test("missing names",function(){
	$("#qunit-fixture").html("//jquerypp/dom/form_params/test/checkbox.micro",{});
	var formParams =  $("#qunit-fixture form").formParams() ;
	ok(true, "does not break")
});

test("same input names to array", function() {
	$("#qunit-fixture").html(basics);
	var formParams =  $("#qunit-fixture form").formParams(true);
	deepEqual(formParams.param1, ['first', 'second', 'third']);
});

test("#17 duplicate sub-keys", function() {
	$("#qunit-fixture").html(basics);
	var formParams =  $("#qunit-fixture form").formParams(true);
	ok(!$.isArray(formParams.test.first), 'First value is not an array');
	equal(formParams.test.first, 'test_first', 'First test value correct');
	ok(!$.isArray(formParams.bla.first), 'Second value is not an array');
	equal(formParams.bla.first, 'bla_first', 'Second test value correct');
	console.log(formParams);
});

test("#24 disabled elements", function() {
	$("#qunit-fixture").html(basics);
	var formParams =  $("#qunit-fixture form").formParams();
	console.log(formParams);
	ok(!formParams.is_disabled, 'Disabled field is not included');
	equal(formParams.not_disabled, 'not disabled', 'Not disabled field');
});

});
