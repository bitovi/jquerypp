steal("funcunit/qunit", "jquery/dom/selection").then(function(){
  	
module("jquery/dom/selection");

test("getCharElement", function(){
	$("#qunit-test-area")
		.html("<textarea>012\n456</textarea>"+
			  "<input text='text' value='01234567' id='inp'/>"+
			  "<p id='1'>0123456789</p>"+
			  "<div id='2'>012<div>3<span>4</span>5</div></div>");
	stop();
	setTimeout(function(){
		var types = ['textarea','#inp','#1','#2'];
		/*
		$('textarea').selection(1,5);
		$('input').selection(1,5);
		$('#1').selection(1,5);
		$('#2').selection(1,5);
		*/
		for(var i = 0; i < types.length; i++){
			$(types[i]).selection(1, 5);
			same($(types[i]).selection(), {start: 1, end: 5, width: 4}, types[i]);
		}
		
		start();
	},1000)
});

});