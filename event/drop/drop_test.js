steal("jquerypp/event/drop",'syn', 'jquerypp/event/drag/limit', 'jquerypp/event/drop/tolerance', 'steal-qunit', function($, syn) {
	
	module("jquerypp/event/drop");



	var visibleFixture = function(){
		//make fixture visible
		var $qunitFixture = $("#qunit-fixture");

		$qunitFixture.css({
		  "width": "100px",
		  "height": "100px",
		  "position": "absolute",
		  "top": "0",
		  "left": "0",
		  "background-color": "rgba(0,0,0,0.3)"
		});
	},
	undoVisibleFixture = function(){
		var $qunitFixture = $("#qunit-fixture");

		//undo make fixture visible
		$qunitFixture.css({
		  "width": "",
		  "height": "",
		  "position": "",
		  "top": "",
		  "left": "",
		  "background-color": ""
		});
	},
	unbindDragDrop = function($drag, $drop){
		$drag.bind("draginit");
		$drop.unbind("dropinit").unbind("dropover").unbind("dropout");
	};

	test("new drop added", 3, function(){
		var div = $("<div>"+
				"<div id='drag'></div>"+
				"<div id='midpoint'></div>"+
				"<div id='drop'></div>"+
				"</div>");

		div.appendTo($("#qunit-fixture"));
		var basicCss = {
			width: "20px",
			height: "20px",
			position: "absolute",
			border: "solid 1px black"
		};
		$("#drag").css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "red"});
		$("#midpoint").css(basicCss).css({top: "0px", left: "30px"});
		$("#drop").css(basicCss).css({top: "0px", left: "60px"});

		$('#drag').bind("draginit", function(){});

		$("#midpoint").bind("dropover",function(){
			ok(true, "midpoint called");

			$("#drop").bind("dropover", function(){
				ok(true, "drop called");
			});

			$('body').on("dropon", function(ev) {
				ok(false, 'parent dropon should not be called');
			});

			$('#drop').on("dropon", function(ev) {
				ok(true, 'dropon called');
				ev.stopPropagation();
			});

			$.Drop.compile();
		});
		stop();
		syn.drag("drag",{to: "#drop"}, function(){
			$('body').off('dropon');
			start();
		});
	});



	// ------- TOLERANCE POINTER -------
	test("tolerance - pointer", 2, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("pointer");
	    })
	    .bind("dropover", function(){
	        ok(true, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(true, "dropout called");
	    });


	    

	    //start the drag at 50 (which should trigger dragover) 
	    //then move one to the left (which should trigger dragout)
		syn.drag($drag.css("left","50px"),{
			from: {
				pageX: 50,
				pageY: 0
			},
			to: {
				pageX: 49,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});

	test("tolerance - pointer - no pointer", 0, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("pointer");
	    })
	    .bind("dropover", function(){
	        ok(false, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(false, "dropout called");
	    });


	    

	    //start the drag at 0
	    //then move until all but the piece with the pointer is inside drop
		syn.drag($drag,{
			from: {
				pageX: 0,
				pageY: 0
			},
			to: {
				pageX: 49,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});
	// ------- END TOLERANCE POINTER -------


	// ------- TOLERANCE TOUCH -------
	test("tolerance - touch", 2, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("touch");
	    })
	    .bind("dropover", function(){
	        ok(true, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(true, "dropout called");
	    });


	    

	    //start the drag at 30 (which should trigger dragover) 
	    //then move one to the left (which should trigger dragout)
		syn.drag($drag.css("left","30px"),{
			from: {
				pageX: 30,
				pageY: 0
			},
			to: {
				pageX: 29,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});

	test("tolerance - touch - no touch", 0, function(){
		
		stop();
		
		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("touch");
	    })
	    .bind("dropover", function(){
	        ok(false, "dropover called");
	    })
	    .bind("dropout", function(){ 
	        ok(false, "dropout called");
	    });


	    

	    //start the drag at 29 (which shouldn't trigger dragover) 
	    //then move one to the left (which shouldn't trigger dragout)
		syn.drag($drag.css("left","29px"),{
			from: {
				pageX: 29,
				pageY: 0
			},
			to: {
				pageX: 28,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});
	// ------- END TOLERANCE TOUCH -------


	// ------- TOLERANCE FIT -------
	test("tolerance - fit", 2, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px",
			width: "28px",
			height: "28px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("fit");
	    })
	    .bind("dropover", function(){
	        ok(true, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(true, "dropout called");
	    });


	    

	    //start the drag at 50 (which should trigger dragover) 
	    //then move 10 to the right (which should trigger dragout)
	    //the top should be 1 so that the drag resides *within* the drop
		syn.drag($drag.css({left: "50px", top: "1px"}),{
			from: {
				pageX: 50,
				pageY: 1
			},
			to: {
				pageX: 60,
				pageY: 1
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});

	test("tolerance - fit - no fit", 0, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px",
			width: "28px",
			height: "28px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("fit");
	    })
	    .bind("dropover", function(){
	        ok(false, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(false, "dropout called");
	    });


	    //since the top is 0, it should't trigger the drop (its outside is equal to the drop, not within)
		syn.drag($drag.css({left: "50px", top: "0px"}),{
			from: {
				pageX: 50,
				pageY: 0
			},
			to: {
				pageX: 60,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});
	// ------- END TOLERANCE FIT -------



	// ------- TOLERANCE INTERSECT -------
	test("tolerance - intersect", 2, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("intersect");
	    })
	    .bind("dropover", function(){
	        ok(true, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(true, "dropout called");
	    });


	    

	    //start the drag at 40 (which should trigger dragover) 
	    //then move 1 to the left (which should trigger dragout)
		syn.drag($drag.css("left", "40px"),{
			from: {
				pageX: 40,
				pageY: 0
			},
			to: {
				pageX: 39,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});

	test("tolerance - intersect - no intersect", 0, function(){
		
		stop();

		var $qunitFixture = $("#qunit-fixture"),
			$div = $("<div></div>").appendTo($qunitFixture),
			$drag = $("<div id='drag'></div>").appendTo($div),
			$drop = $("<div id='drop'></div>").appendTo($div),
			basicCss = {
				width: "18px", //18 + 2px for border === 20px square
				height: "18px",
				position: "absolute",
				border: "solid 1px black"
			};

		

		visibleFixture();


		$drag.css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "green"});
		$drop.css(basicCss).css({
			top: "0px", 
			left: "50px"
		});

		$drag.bind("draginit", function(){});

		$drop.bind("dropinit", function(ev, drop, drag){
	        drop.tolerance("intersect");
	    })
	    .bind("dropover", function(){
	        ok(false, "dropover called");
	    })
	    .bind("dropout", function(){
	        ok(false, "dropout called");
	    });


	    //start at 0, move to where drag is 1 less than half-way over drop
		syn.drag($drag,{
			from: {
				pageX: 0,
				pageY: 0
			},
			to: {
				pageX: 39,
				pageY: 0
			}
		}, function(){
			undoVisibleFixture();
			unbindDragDrop($drag, $drop);
			start();
		});
	});
	// ------- END TOLERANCE INTERSECT -------


});
