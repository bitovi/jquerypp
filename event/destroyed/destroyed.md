@constructor jQuery.event.destroyed
@parent jquerypp

@body

`jQuery.event.destroyed` adds a `destroyed` event that is triggered when an element has been removed.

The destroyed event is called when the element is removed as a result of a jQuery DOM
[manipulation method](http://api.jquery.com/category/manipulation/) like *remove*, *html*, *replaceWith*, etc.
Destroyed events do not bubble, so make sure you don't use live or delegate with destroyed events.

The destroyed event is very useful when you want to remove certain event handlers or clean up references
when the element has been removed. This is very important in order to create long lived applications
that do not leak.

## Quick Example

	$(".foo").on("destroyed", function(){
	   //clean up code
	});

## Quick Demo

@demo jquerypp/event/destroyed/destroyed.html 200

## More Involved Demo

@demo jquerypp/event/destroyed/destroyed_menu.html 