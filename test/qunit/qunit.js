(function(){
	var isReady,
		stateAfterScript;
		
//we probably have to have this only describing where the tests are
steal('jquery').then(function(){
	$(function(){
			isReady = true;
	})
})
.then('./jmvc.js')
.then('jquery/dom/compare/compare_test.js')
.then('jquery/dom/dimensions/dimensions_test.js')
.then('jquery/dom/form_params/form_params_test.js')
.then('jquery/dom/styles/styles_test.js')
.then('jquery/event/default/default_test.js')
.then('jquery/event/destroyed/destroyed_test.js')
.then('jquery/event/drag/drag_test.js')
.then('jquery/event/drop/drop_test.js')
.then('jquery/event/hover/hover_test.js')
.then('jquery/event/key/key_test.js')
.then('jquery/event/pause/pause_test.js')
.then('jquery/event/resize/resize_test.js')
.then('jquery/event/swipe/swipe_test.js')
.then('jquery/event/default/default_pause_test.js',function(){
	
	stateAfterScript = isReady;
	module('jquery v steal');


	test("jquery isn't ready", function(){
		ok(!stateAfterScript, "jQuery isn't ready yet")
	})
   	
});

})();
