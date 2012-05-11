@page jQuery.event.selection
@parent jquerypp

[jQuery.selection](http://donejs.com/docs.html#!jQuery.selection) adds `$.fn.selection` to set or retrieve the currently selected text range. It works on all elements:

	<div id="text">This is some text</div>

Can be used like this:

	$('#text').selection(8, 12);
	$('#text').selection() // -> { start : 8, end : 12 }
	$('#text').text().substring(selection.start, selection.end) // -> some
