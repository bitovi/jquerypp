steal('jquery', 'jquerypp/event/reverse', function($) {
	$.event.reverse('move');
	return $;
});