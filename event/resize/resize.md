@page jQuery.event.resize
@parent jquerypp

The resize event is useful for updating elements dimensions when a parent element
has been resized.  It allows you to only resize elements that need to be resized
in the 'right order'.

By listening to a resize event, you will be alerted whenever a parent
element has a <code>resize</code> event triggered on it.  For example:

  $('#foo').bind('resize', function(){
     // adjust #foo's dimensions
  })

  $(document.body).trigger("resize");

## The 'Right Order'

When a control changes size, typically, you want only internal controls to have to adjust their
dimensions.  Furthermore, you want to adjust controls from the 'outside-in', meaning
that the outermost control adjusts its dimensions before child controls adjust theirs.

Resize calls resize events in exactly this manner.

When you trigger a resize event, it will propagate up the DOM until it reaches
an element with the first resize event
handler.  There it will move the event in the opposite direction, calling the element's
children's resize event handlers.

If your intent is to call resize without bubbling and only trigger child element's handlers,
use the following:

  $("#foo").trigger("resize", false);

## Stopping Children Updates

If your element doesn't need to change it's dimensions as a result of the parent element, it should
call ev.stopPropagation().  This will only stop resize from being sent to child elements of the current element.

## Demo

@demo jquery/event/resize/demo.html
