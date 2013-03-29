steal("jquerypp/event/hover", 'funcunit/syn', 'funcunit/qunit', function ($, Syn) {

	module("jquerypp/dom/hover")

	test("hovering", function () {
		$("#qunit-test-area").append("<div id='hover'>Content<div>")
		var hoverenters = 0,
			hoverinits = 0,
			hoverleaves = 0,
			delay = 15;
		$("#hover").bind("hoverinit", function (ev, hover) {
			hover.delay(delay);
			hoverinits++;
		})
			.bind('hoverenter', function () {
				hoverenters++;
			})
			.bind('hoverleave', function () {
				hoverleaves++;
			})
		var hover = $("#hover")
		var off = hover.offset();

		//add a mouseenter, and 2 mouse moves
		Syn("mouseover", {pageX : off.top, pageY : off.left}, hover[0])
		ok(hoverinits, 'hoverinit');
		ok(hoverenters === 0, "hoverinit hasn't been called");
		stop();

		setTimeout(function () {
			ok(hoverenters === 1, "hoverenter has been called");

			ok(hoverleaves === 0, "hoverleave hasn't been called");
			Syn("mouseout", {pageX : off.top, pageY : off.left}, hover[0]);

			ok(hoverleaves === 1, "hoverleave has been called");

			delay = 30;

			Syn("mouseover", {pageX : off.top, pageY : off.left}, hover[0]);
			ok(hoverinits === 2, 'hoverinit');

			setTimeout(function () {

				Syn("mouseout", {pageX : off.top, pageY : off.left}, hover[0]);


				setTimeout(function () {
					ok(hoverenters === 1, "hoverenter was not called");
					ok(hoverleaves === 1, "hoverleave was not called");
					start();
				}, 30)

			}, 10)

		}, 30)
	});

	test("hoverInit delay 0 triggers hoverenter (issue #57)", function () {
		$("#qunit-test-area").append("<div id='hoverzero'>Content<div>");

		var hoverenters = 0,
			hoverinits = 0,
			hoverleaves = 0,
			delay = 0;

		$("#hoverzero").on({
			hoverinit : function (ev, hover) {
				hover.delay(delay);
				hoverinits++;
			},
			hoverenter : function () {
				hoverenters++;
			},
			'hoverleave' : function () {
				hoverleaves++;
			}
		});

		var hover = $("#hoverzero")
		var off = hover.offset();

		//add a mouseenter, and 2 mouse moves
		Syn("mouseover", { pageX : off.top, pageY : off.left }, hover[0])
		ok(hoverinits, 'hoverinit');
		ok(hoverenters === 1, "hoverenter has been called");
	});

});
