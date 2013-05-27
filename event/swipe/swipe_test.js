steal('funcunit/qunit', 'funcunit/syn', 'jquerypp/event/swipe', function (QUnit, Syn) {
	var swipe;

	module("jquerypp/swipe", {
		setup : function () {
			$("#qunit-test-area").html("")
			var div = $("<div id='outer'>" +
				"<div id='inner1'>one</div>" +
				"<div id='inner2'>two<div id='inner3'>three</div></div>" +
				"</div>");

			div.appendTo($("#qunit-test-area"));
			var basicCss = {
				position : "absolute",
				border : "solid 1px black"
			}
			$("#outer").css(basicCss).css({top : "10px", left : "10px",
				zIndex : 1000, backgroundColor : "green", width : "200px", height : "200px"})


			swipe = {};

			$("#outer").bind("swipe",function () {
				swipe.general = true;
			})
			.bind("swipeleft",function () {
				swipe.left = true;
			})
			.bind("swiperight", function () {
				swipe.right = true;
			})
			.bind("swipeup", function () {
				swipe.up = true;
			})
			.bind("swipedown", function () {
				swipe.down = true;
			});
		}
	});

	test("swipe right event", 5, function () {
		stop();
		Syn.drag({
			from : "20x20",
			to : "50x20",
			duration : 100
		}, "outer", function () {
			start();

			ok(swipe.general, 'swipe');
			ok(swipe.right, 'swipe right');

			ok(!swipe.left, 'swipe left');
			ok(!swipe.up, 'swipe up');
			ok(!swipe.down, 'swipe down');
		})

	});



	test("swipe left event", 5, function () {
		stop();

		Syn.drag({
			from : "50x20",
			to : "20x20",
			duration : 100
		}, "outer", function () {
			start();

			ok(swipe.general, 'swipe');
			ok(swipe.left, 'swipe left');

			ok(!swipe.right, 'swipe right');
			ok(!swipe.up, 'swipe up');
			ok(!swipe.down, 'swipe down');
		})
	});


	test("swipe up event", 5, function () {
		stop();
		Syn.drag({
			from : "20x50",
			to : "20x20",
			duration : 100
		}, "outer", function () {
			start();

			ok(swipe.general, 'swipe');
			ok(swipe.up, 'swipe up');

			ok(!swipe.left, 'swipe left');
			ok(!swipe.right, 'swipe right');
			ok(!swipe.down, 'swipe down');
		})

	});

	test("swipe down event", 5, function () {
		stop();
		Syn.drag({
			from : "20x20",
			to : "20x50",
			duration : 100
		}, "outer", function () {
			start();
			ok(swipe.general, 'swipe');
			ok(swipe.down, 'swipe down');

			ok(!swipe.left, 'swipe left');
			ok(!swipe.right, 'swipe right');
			ok(!swipe.up, 'swipe up');
		})

	});

	test("#33: using swipe.max", function () {

		$.event.swipe.max = 75;
		$("#outer").bind("swipe", function () {
			ok(false, "Swipe shouldn't be called when dragged more than swipe.max");
		});
		stop();
		Syn.drag({
			from : "20x20",
			to : "20x96",
			duration : 100
		}, "outer", function () {
			ok(true, 'Done dragging');
			start();
		})

	})

})
