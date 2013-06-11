@function jQuery.within jQuery.within
@parent jquerypp
@signature `jQuery(el).within(left, top)`

Helps to determine all elements that have a certain position or area in common by providing `[jQuery.fn.withinBox]` and `[jQuery.fn.within]`. The following example returns all `div` elements on the point 200px left and 200px from the top:

	$('div').within(200, 200)

Use `$(el).withinBox(left, top, width, height)` to get all elements within a certain area:

	$('*').withinBox(200, 200, 100, 100)

 [jQuery.event.drag] uses *$.within* to determine dropable elements at the current position.

 @signature `jQuery(el).withinBox(left, top, width, height)`

 Returns all elements matching the selector that have a given area in common:
 $('*').withinBox(200, 200, 100, 100)

 ### Example

Move the mouse in the following example and it will show the ids for `div` elements within the current mouse position:

<iframe style="width: 100%; height: 330px" src="http://jsfiddle.net/hHLcg/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0">JSFiddle</iframe>


 @param {Number} left the position from the left of the page
 @param {Number} top the position from the top of the page
 @param {Number} width the width of the area
 @param {Number} height the height of the area
 @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 @return {jQuery} a jQuery collection of elements whos area
 overlaps the element position.
