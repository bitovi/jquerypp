steal("funcunit/qunit", "jquerypp/dom/range", "jquerypp/dom/selection").then(function () {

	module("jquerypp/dom/range");

	test("basic range", function () {
		$("#qunit-test-area")
			.html("<p id='1'>0123456789</p>");
		$('#1').selection(1, 5);
		var range = $.Range.current();
		equals(range.start().offset, 1, "start is 1")
		equals(range.end().offset, 5, "end is 5")
	});

	test("jquery helper, start, select", function () {
		var range = $('#qunit-test-area').html("<span>Hello</span> <b>World</b><i>!</i>").range();
		range.start("+2");
		range.end("-2");
		range.select();
		equals(range.toString(), "llo Worl")
	})


	test('jQuery helper', function () {

		$("#qunit-test-area").html("<div id='selectMe'>thisTextIsSelected</div>")

		var range = $('#selectMe').range();

		equals(range.toString(), "thisTextIsSelected")

	});

	test("constructor with undefined", function () {
		var range = $.Range();
		equals(document, range.start().container, "start is right");
		equals(0, range.start().offset, "start is right");
		equals(document, range.end().container, "end is right");
		equals(0, range.end().offset, "end is right");
	});

	test("constructor with element", function () {

		$("#qunit-test-area").html("<div id='selectMe'>thisTextIsSelected</div>")

		var range = $.Range($('#selectMe')[0]);

		equals(range.toString(), "thisTextIsSelected")

	});

	test('selecting text nodes and parent', function () {
		$("#qunit-test-area").html("<div id='selectMe'>this<span>Text</span>Is<span>Sele<span>cted</div>")
		var txt = $('#selectMe')[0].childNodes[2]
		equals(txt.nodeValue, "Is", "text is right")
		var range = $.Range();
		range.select(txt);
		equals(range.parent(), txt, "right parent node");
	})

	test('parent', function () {
		$("#qunit-test-area").html("<div id='selectMe'>thisTextIsSelected</div>")
		var txt = $('#selectMe')[0].childNodes[0]

		var range = $.Range(txt);

		equals(range.parent(), txt)
	});

	test("constructor with point", function () {

		var floater = $("<div id='floater'>thisTextIsSelected</div>").css({
			position : "absolute",
			left : "0px",
			top : "0px",
			border : "solid 1px black"
		})

		$("#qunit-test-area").html("");
		floater.appendTo(document.body);


		var range = $.Range({pageX : 5, pageY : 5});
		equals(range.start().container.parentNode, floater[0])
		floater.remove()
	});

	test('current', function () {
		$("#qunit-test-area").html("<div id='selectMe'>thisTextIsSelected</div>");
		$('#selectMe').range().select();

		var range = $.Range.current();
		equals(range.toString(), "thisTextIsSelected")
	})

	/* TODO
	 test('rangeFromPoint', function(){

	 });

	 test('overlaps', function(){});

	 test('collapse', function(){});

	 test('get start', function(){});

	 test('set start to object', function(){});

	 test('set start to number', function(){});

	 test('set start to string', function(){});

	 test('get end', function(){});

	 test('set end to object', function(){});

	 test('set end to number', function(){});

	 test('set end to string', function(){});



	 test('rect', function(){});

	 test('rects', function(){});

	 test('compare', function(){});

	 test('move', function(){});

	 test('clone', function(){});
	 */

	// adding brian's tests

	test("nested range", function () {
		$("#qunit-test-area")
			.html("<div id='2'>012<div>3<span>4</span>5</div></div>");
		$('#2').selection(1, 5);
		var range = $.Range.current();
		equals(range.start().container.data, "012", "start is 012")
		equals(range.end().container.data, "4", "last char is 4")
	});

	test("rect", function () {
		$("#qunit-test-area")
			.html("<p id='1'>0123456789</p>");
		$('#1').selection(1, 5);
		var range = $.Range.current(),
			rect = range.rect();
		ok(rect.height, "height non-zero")
		ok(rect.width, "width non-zero")
		ok(rect.left, "left non-zero")
		ok(rect.top, "top non-zero")
	});

	test("collapsed rect", function () {
		$("#qunit-test-area")
			.html("<p id='1'>0123456789</p>");
		$('#1').selection(1, 1);
		var range = $.Range.current(),
			start = range.clone(),
			rect = start.rect();
		var r = start.rect();
		ok(rect.height, "height non-zero")
		ok(rect.width == 0, "width zero")
		ok(rect.left, "left non-zero")
		ok(rect.top, "top non-zero")
	});

	test("rects", function () {
		$("#qunit-test-area")
			.html("<p id='1'>012<span>34</span>56789</p>");
		$('#1').selection(1, 5);
		var range = $.Range.current(),
			rects = range.rects();
		equals(rects.length, 2, "2 rects found")
	});

	test("multiline rects", function () {
		$("#qunit-test-area")
			.html("<pre id='1'><code>&lt;script type='text/ejs' id='recipes'>\n" +
			"&lt;% for(var i=0; i &lt; recipes.length; i++){ %>\n" +
			"  &lt;li>&lt;%=recipes[i].name %>&lt;/li>\n" +
			"&lt;%} %>\n" +
			"&lt;/script></code></pre>");
		$('#1').selection(3, 56);
		var range = $.Range.current(),
			rects = range.rects();
		equals(rects.length, 2, "2 rects found")
		ok(rects[1].width, "rect has width")
	});

	test("compare", function () {
		$("#qunit-test-area")
			.html("<p id='1'>012<span>34</span>56789</p>");
		$('#1').selection(1, 5);
		var range1 = $.Range.current();
		$('#1').selection(2, 3);
		var range2 = $.Range.current();
		var pos = range1.compare("START_TO_START", range2)
		equals(pos, -1, "pos works")
	});

	test("move across boundaries", function(){
		
		var div = document.createElement('div');
		div.innerHTML = 'I\'ve been writing up example widgets on bitovi.com. Here\'s the first three:'+
						'<a>THE TEXT</a>'
		$("#qunit-test-area").html(div)
		 
		equals( $(div).range().start("+79").toString(), "TEXT")
		$("#qunit-test-area").empty()
	})

	test("moving left from text node", function(){
		var div = document.createElement('div');
		div.innerHTML = 'a<a>THE TEXT</a>de';
		div.id= "foo"
		$("#qunit-test-area").html(div);
		// move to d
		var range = $(div).range().collapse(false)
		
		range.start("-1").start("-1").end("-1").start("-1");
		

		
		equal(range.toString(),"Td")
	})

})

