steal('funcunit/qunit', 'jquery/event/move').then(function() {
	test('Event bubbling', 2, function() {
		$('#qunit-test-area').html('<div id="outer">' +
			'<div id="inner">' +
			'<div id="innermost">Innermost div</div>' +
			'</div>' +
			'</div>');

		$('#innermost').on('move', function(ev) {
			ok(true, 'Event reached #innermost div');
		});

		$('#outer').trigger('move');
		$('body').trigger('move');
	});

	test('stopPropagation', 2, function() {
		$('#qunit-test-area').html('<div id="outer">' +
			'<div id="inner">' +
			'<div id="innermost">Innermost div</div>' +
			'</div>' +
			'</div>');

		$('#inner').on('move', function(ev) {
			ok(true, 'Event reached #inner div');
			ev.stopPropagation();
		});

		$('#innermost').on('move', function(ev) {
			ok(false, 'Event should not reach #innermost div');
		});

		$('#outer').trigger('move');
		$('body').trigger('move');
	});
});