steal('steal-qunit', 'jquerypp/event/move',function() {
	
	module('jquerypp/event/reverse')
	
	$.event.reverse('test');
	
	test('Event bubbling', 3, function() {
		$('#qunit-fixture').html('<div id="outer">' +
			'<div id="inner">' +
			'<div id="innermost">Innermost div</div>' +
			'</div>' +
			'</div>');

		$('#innermost').on('test', function(ev) {
			ok(true, 'Event reached #innermost div');
		});

		$('#outer').trigger('test');
		$('body').trigger('test');
		$(window).trigger('test');
	});

	test('stopPropagation', 2, function() {
		$('#qunit-fixture').html('<div id="outer">' +
			'<div id="inner">' +
			'<div id="innermost">Innermost div</div>' +
			'</div>' +
			'</div>');

		$('#inner').on('test', function(ev) {
			ok(true, 'Event reached #inner div');
			ev.stopPropagation();
		});

		$('#innermost').on('test', function(ev) {
			ok(false, 'Event should not reach #innermost div');
		});

		$('#outer').trigger('test');
		$('body').trigger('test');
	});

	test('passing data', 1, function() {
		$('#qunit-fixture').html('<div id="outer">' +
			'<div id="inner">' +
			'<div id="innermost">Innermost div</div>' +
			'</div>' +
			'</div>');

		$('#inner').on('test', function(ev, data) {
			equal(data.data, true, 'data passed!');
		});

		$('#outer').trigger('test', { data: true });
		//$('body').trigger('test');
	});
});