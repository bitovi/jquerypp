@page jQuery.selection
@parent jquerypp

Gets or sets the current text selection.

## Getting

Gets the current selection in the context of an element.  For example:
 
	$('textarea').selection() // -> { .... }
     
returns an object with:
 
- __start__ - The number of characters from the start of the element to the start of the selection.
- __end__ - The number of characters from the start of the element to the end of the selection.

This lets you get the selected text in a textarea like:
 
	var textarea = $('textarea')
	selection = textarea.selection(),
	selected = textarea.val().substr(selection.start, selection.end);
       
	alert('You selected '+selected+'.');
     
Selection works with all elements.  If you want to get selection information of the document:
 
	$(document.body).selection();
     
## Setting
 
By providing a start and end offset, you can select text within a given element.
 
	$('#rte').selection(30, 40)
 
## Demo
 
This demo shows setting the selection in various elements
 
@demo jquery/dom/selection/selection.html