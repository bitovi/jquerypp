@page jQuery.within
@parent jquerypp

jQuery.within helps to determine all elements that have a certain position or area in common. The following example returns all `div` elements on the point 200px left and 200px from the top:

	$('div').within(200, 200)

Use `$(el).withinBox(left, top, width, height)` to get all elements within a certain area:

	$('*').withinBox(200, 200, 100, 100)

[jQuery.event.drag] uses *$.within* to determine dropable elements at the current position.
