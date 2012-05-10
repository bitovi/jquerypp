@page jQuery.event.destroyed
@parent jquerypp

Provides a destroyed event on an element.

The destroyed event is called when the element
is removed as a result of jQuery DOM manipulators like remove, html,
replaceWith, etc. Destroyed events do not bubble, so make sure you don't use live or delegate with destroyed
events.

## Quick Example

	$(".foo").on("destroyed", function(){
	   //clean up code
	})

> Note: The destroyed event does not bubble.

## Quick Demo

@demo jquery/event/destroyed/destroyed.html 

## More Involved Demo<

@demo jquery/event/destroyed/destroyed_menu.html
