steal("jquerypp/dom/dimensions",'jquerypp/view/micro', 'funcunit/qunit', function() {

module("jquerypp/dom/styles");

test("reading", function(){
	
	$("#qunit-test-area").html("//jquerypp/dom/styles/test/styles.micro",{})

	var res = $.styles( $("#styled")[0],
	   ["padding-left",
		'position',
		'display',
		"margin-top", 
		"borderTopWidth",
		"float"] );
	equals(res.borderTopWidth, "2px","border top");
	equals(res.display, "block","display");
	equals(res.cssFloat, "left","float");
	equals(res.marginTop, "10px","margin top");
	equals(res.paddingLeft, "5px","padding left");
	equals(res.position, "relative","position");
	$("#qunit-test-area").html("")
});

})

