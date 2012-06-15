steal('funcunit').then(function(){

module("jQuery.fn.fills",{
	setup: function(){
        S.open("//jquery/dom/fills/fills.html");
	}
})

test("Filler Tests", function(){
	var main = S.win.$('#main');
	main.width(main.width() + 100).height(main.height() + 100).trigger('resize');
	// S('#mainfiller').height()
})


	
})
