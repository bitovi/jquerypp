steal("jquery",
 	'funcunit/qunit').then(function(){

module("jquery/event/fastfix");

test('Event handling', function() {
	var el = $('#qunit-test-area').on('click', function(ev) {
		var original = ev.originalEvent;
		deepEqual(original.relatedTarget, ev.relatedTarget);
		console.log(original, ev);
//			original.fromElement === this.target ?
//			original.toElement :
//			original.fromElement
	});
	// Trigger a native click
	el[0].click();
})

});