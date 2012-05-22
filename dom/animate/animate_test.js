steal('jquery/dom/animate',
	'funcunit/qunit').then(function () {

	module("jquery/dom/animate");

	$.fn.animate = $.fn.anifast;

	test("animate negative margin", function () {
		expect(1);
		stop();
		jQuery("#foo").animate({ marginTop : -100 }, 100, function () {
			equal(jQuery(this).css("marginTop"), "-100px", "Verify margin.");
			start();
		});
	});

	test("animate negative padding", function () {
		expect(1);
		stop();
		jQuery("#foo").animate({ paddingBottom : -100 }, 100, function () {
			equal(jQuery(this).css("paddingBottom"), "0px", "Verify paddingBottom.");
			start();
		});
	});

	test("animate negative padding", function() {
		expect(1);
		stop();
		jQuery("#foo").animate({ paddingBottom: -100 }, 100, function() {
			equal( jQuery(this).css("paddingBottom"), "0px", "Verify paddingBottom." );
			start();
		});
	});

	test("animate block width/height", function() {
		expect(3);
		stop();
		jQuery("#foo").css({ display: "block", width: 20, height: 20 }).animate({ width: 42, height: 42 }, 100, function() {
			equal( jQuery(this).css("display"), "block", "inline-block was not set on block element when animating width/height" );
			equal( this.offsetWidth, 42, "width was animated" );
			equal( this.offsetHeight, 42, "height was animated" );
			start();
		});
	});

	test("animate percentage(%) on width/height", function() {
		expect( 2 );

		var $div = jQuery("<div style='position:absolute;top:-999px;left:-999px;width:60px;height:60px;'><div style='width:50%;height:50%;'></div></div>")
			.appendTo("#qunit-fixture").children("div");

		stop();
		$div.animate({ width: "25%", height: "25%" }, 13, function() {
			var $this = jQuery(this);
			equal( $this.width(), 15, "Width was animated to 15px rather than 25px");
			equal( $this.height(), 15, "Height was animated to 15px rather than 25px");
			start();
		});
	});

	test("animate resets overflow-x and overflow-y when finished", function() {
		expect(2);
		stop();
		jQuery("#foo")
			.css({ display: "block", width: 20, height: 20, overflowX: "visible", overflowY: "auto" })
			.animate({ width: 42, height: 42 }, 100, function() {
				equal( this.style.overflowX, "visible", "overflow-x is visible" );
				equal( this.style.overflowY, "auto", "overflow-y is auto" );
				start();
			});
	});

	test("animate hyphenated properties", function() {
		expect(1);
		stop();

		jQuery("#foo")
			.css("font-size", 10)
			.animate({"font-size": 20}, 200, function() {
				equal( this.style.fontSize, "20px", "The font-size property was animated." );
				start();
			});
	});

	/*
	test("animate non-element", function() {
		expect(1);
		stop();

		var obj = { test: 0 };

		jQuery(obj).animate({test: 200}, 200, function(){
			equal( obj.test, 200, "The custom property should be modified." );
			start();
		});
	});
	*/
});