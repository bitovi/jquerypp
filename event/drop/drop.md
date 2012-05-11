@page jQuery.event.drop
@parent jquerypp

Provides drop events as a special event to jQuery. By binding to a drop event, your callback functions will be called during the corresponding phase of drag.
 
## Drop Events

All drop events are called with the native event, an instance of drop, and the drag.  Here are the available drop 
events:

* `dropinit` - the drag motion is started, drop positions are calculated.
* `dropover` - a drag moves over a drop element, called once as the drop is dragged over the element.
* `dropout` - a drag moves out of the drop element.
* `dropmove` - a drag is moved over a drop element, called repeatedly as the element is moved.
* `dropon` - a drag is released over a drop element.
* `dropend` - the drag motion has completed.

## Examples

Here's how to listen for when a drag moves over a drop:

    $('.drop').delegate("dropover", function(ev, drop, drag){
      $(this).addClass("drop-over")
    })

A bit more complex example:

@demo jquery/event/drop/drop.html 1000

## How it works

1. When you bind on a drop event, it adds that element to the list of rootElements.
  RootElements might be drop points, or might have delegated drop points in them.

2. When a drag motion is started, each rootElement is queried for the events listening on it.
  These events might be delegated events so we need to query for the drop elements.

3. With each drop element, we add a Drop object with all the callbacks for that element.
  Each element might have multiple event provided by different rootElements.  We merge
  callbacks into the Drop object if there is an existing Drop object.

4. Once Drop objects have been added to all elements, we go through them and call draginit
  if available.

