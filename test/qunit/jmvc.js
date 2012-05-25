// Tests for the JavaScriptMVC compatibility layer. Will be removed eventually
steal('funcunit/qunit').then('jquery/controller/view/test/qunit')
	.then('jquery/class/class_test.js')
	.then('jquery/model/test/qunit')
	.then('jquery/controller/controller_test.js')
	.then('jquery/view/test/qunit')
	.then('jquery/dom/route/route_test.js')
	.then('./integration.js')