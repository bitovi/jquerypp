@constructor jQuery.event.removed
@parent jquerypp

@body

`jQuery.event.removed` adds a `removed` event that is triggered when an element has been removed.

The removed event is called when the element is removed as a result of a jQuery DOM
[manipulation method](http://api.jquery.com/category/manipulation/) like *remove*, *html*, *replaceWith*, etc.
Destroyed events do not bubble, so make sure you don't use live or delegate with removed events.

The removed event is very useful when you want to remove certain event handlers or clean up references
when the element has been removed. This is very important in order to create long lived applications
that do not leak.

## Quick Example

	$(".foo").on("removed", function(){
	   //clean up code
	});

## Quick Demo

@demo jquerypp/event/removed/removed.html 200

## More Involved Demo

@demo jquerypp/event/removed/removed_menu.html 