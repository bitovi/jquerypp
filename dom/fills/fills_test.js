steal('funcunit').then(function(){
	
module("jQuery.fn.fills",{
	setup: function(){
        S.open("//jquery/dom/fills/fills.html");
	}
})

test("Filler Tests", function(){
	/* No Pading/No Borders */
	var height1,
		height2,
		height3,
		withinAPixel = function(a, b){
			return  Math.abs(a- b)  <= 1;
		};
	
	// get heights when they start
	S(function(){
		height1 = S("#fill1").height();
		height2 = S("#fill2").height()
		height3 = S("#fill3 ").height()
	})
	// let filler get going
	

	S("a#run").click()
	
	S.wait(500, function(){
		var height = S("#fill1").height()
		ok(withinAPixel(height1, height),"heights are close "+height1+" "+height);
		
		
		
		var height = S("#fill2").height()
		ok(withinAPixel(height2, height),"heights are close "+height2+" "+height);
		
		var height = S("#fill3").height()
		ok(withinAPixel(height3, height),"heights are close "+height3+" "+height);
		
		
		height1 = S("#fill1 .fill").height();
		height2 = S("#fill2 .fill").height();
		height3 = S("#fill3 .fill").height();
	});
	
	S("#fill1 .ui-resizable-se").visible().drag("+0 +50");
	S("#fill2 .ui-resizable-se").visible().drag("+0 +50");
	S("#fill3 .ui-resizable-se").visible().drag("+0 +50", function(){
		ok(withinAPixel(height1+50, S("#fill1 .fill").height()),"heights are close ")
		
		ok(withinAPixel(height2+50, S("#fill2 .fill").height()),"heights are close")
		
		ok(withinAPixel(height3+50, S("#fill3 .fill").height()),"heights are close")
	});
})


	
})
