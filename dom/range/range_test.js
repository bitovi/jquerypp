steal("steal-qunit", "jquerypp/dom/range", "jquerypp/dom/selection",function () {

	module("jquerypp/dom/range");

	test("basic range", function () {
		$("#qunit-fixture")
			.html("<p id='1'>0123456789</p>");
		$('#1').selection(1, 5);
		var range = $.Range.current();
		equal(range.start().offset, 1, "start is 1")
		equal(range.end().offset, 5, "end is 5")
	});

	test("jquery helper, start, select", function () {
		var range = $('#qunit-fixture').html("<span>Hello</span> <b>World</b><i>!</i>").range();
		range.start("+2");
		range.end("-2");
		range.select();
		equal(range.toString(), "llo Worl")
	});


	test('jQuery helper', function () {

		$("#qunit-fixture").html("<div id='selectMe'>thisTextIsSelected</div>")

		var range = $('#selectMe').range();

		equal(range.toString(), "thisTextIsSelected")

	});

	test("constructor with undefined", function () {
		var range = $.Range();
		equal(document, range.start().container, "start is right");
		equal(0, range.start().offset, "start is right");
		equal(document, range.end().container, "end is right");
		equal(0, range.end().offset, "end is right");
	});

	test("constructor with element", function () {

		$("#qunit-fixture").html("<div id='selectMe'>thisTextIsSelected</div>");

		var range = $.Range($('#selectMe')[0]);

		equal(range.toString(), "thisTextIsSelected");

	});

	test('selecting text nodes and parent', function () {
		$("#qunit-fixture").html("<div id='selectMe'>this<span>Text</span>Is<span>Sele<span>cted</div>");
		var txt = $('#selectMe')[0].childNodes[2]
		equal(txt.nodeValue, "Is", "text is right");
		var range = $.Range();
		range.select(txt);
		equal(range.parent(), txt, "right parent node");
	});

	test('parent', function () {
		$("#qunit-fixture").html("<div id='selectMe'>thisTextIsSelected</div>");
		var txt = $('#selectMe')[0].childNodes[0];

		var range = $.Range(txt);

		equal(range.parent(), txt);
	});

	test("constructor with point", function () {

		var floater = $("<div id='floater'>thisTextIsSelected</div>").css({
			position : "absolute",
			left : "0px",
			top : "0px",
			border : "solid 1px black"
		});

		$("#qunit-fixture").html("");
		floater.appendTo(document.body);


		var range = $.Range({pageX : 5, pageY : 5});
		equal(range.start().container.parentNode, floater[0])
		floater.remove()
	});

	test('current', function () {
		$("#qunit-fixture").html("<div id='selectMe'>thisTextIsSelected</div>");
		$('#selectMe').range().select();

		var range = $.Range.current();
		equal(range.toString(), "thisTextIsSelected");
	});

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
		$("#qunit-fixture")
			.html("<div id='2'>012<div>3<span>4</span>5</div></div>");
		$('#2').selection(1, 5);
		var range = $.Range.current();
		equal(range.start().container.data, "012", "start is 012")
		equal(range.end().container.data, "4", "last char is 4")
	});

	test("rect", function () {
		$("#qunit-fixture")
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
		$("#qunit-fixture")
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
		$("#qunit-fixture")
			.html("<p id='1'>012<span>34</span>56789</p>");
		$('#1').selection(1, 5);
		var range = $.Range.current(),
			rects = range.rects();
		equal(rects.length, 2, "2 rects found")
	});

	test("multiline rects", function () {
		$("#qunit-fixture")
			.html("<pre id='1'><code>&lt;script type='text/ejs' id='recipes'>\n" +
			"&lt;% for(var i=0; i &lt; recipes.length; i++){ %>\n" +
			"  &lt;li>&lt;%=recipes[i].name %>&lt;/li>\n" +
			"&lt;%} %>\n" +
			"&lt;/script></code></pre>");
		$('#1').selection(3, 56);
		var range = $.Range.current(),
			rects = range.rects();
		ok(rects.length >= 2, "2 rects found");
		ok(rects[1].width, "rect has width");
	});

	test("compare", function () {
		$("#qunit-fixture")
			.html("<p id='1'>012<span>34</span>56789</p>");
		$('#1').selection(1, 5);
		var range1 = $.Range.current();
		$('#1').selection(2, 3);
		var range2 = $.Range.current();
		var pos = range1.compare("START_TO_START", range2)
		equal(pos, -1, "pos works")
	});

	test("move across boundaries", function(){
		
		var div = document.createElement('div');
		div.innerHTML = 'I\'ve been writing up example widgets on bitovi.com. Here\'s the first three:'+
						'<a>THE TEXT</a>';
		$("#qunit-fixture").html(div);
		 
		equal( $(div).range().start("+79").toString(), "TEXT");
		$("#qunit-fixture").empty();
	});

	test("moving left from text node", function(){
		var div = document.createElement('div');
		div.innerHTML = 'a<a>THE TEXT</a>de';
		div.id= "foo"
		$("#qunit-fixture").html(div);
		// move to d
		var range = $(div).range().collapse(false)
		
		range.start("-1").start("-1").end("-1").start("-1");
		

		
		equal(range.toString(),"Td")
	});

});

