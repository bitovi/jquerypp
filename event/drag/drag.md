@page jQuery.event.drop
@parent jquerypp

Provides drag events as a special events to jQuery.
A jQuery.Drag instance is created on a drag and passed
as a parameter to the drag event callbacks.  By calling
methods on the drag event, you can alter the drag's
behavior.

## Drag Events

The drag plugin allows you to listen to the following events:

<ul>
 <li><code>dragdown</code> - the mouse cursor is pressed down</li>
 <li><code>draginit</code> - the drag motion is started</li>
 <li><code>dragmove</code> - the drag is moved</li>
 <li><code>dragend</code> - the drag has ended</li>
 <li><code>dragover</code> - the drag is over a drop point</li>
 <li><code>dragout</code> - the drag moved out of a drop point</li>
</ul>

Just by binding or delegating on one of these events, you make
the element dragable.  You can change the behavior of the drag
by calling methods on the drag object passed to the callback.

### Example

Here's a quick example:

    //makes the drag vertical
    $(".drags").delegate("draginit", function(event, drag){
      drag.vertical();
    })
    //gets the position of the drag and uses that to set the width
    //of an element
    $(".resize").delegate("dragmove",function(event, drag){
      $(this).width(drag.position.left() - $(this).offset().left   )
    })

## Drag Object

<p>The drag object is passed after the event to drag 
event callback functions.  By calling methods
and changing the properties of the drag object,
you can alter how the drag behaves.
</p>
<p>The drag properties and methods:</p>
<ul>
 <li><code>[jQuery.Drag.prototype.cancel cancel]</code> - stops the drag motion from happening</li>
 <li><code>[jQuery.Drag.prototype.ghost ghost]</code> - copys the draggable and drags the cloned element</li>
 <li><code>[jQuery.Drag.prototype.horizontal horizontal]</code> - limits the scroll to horizontal movement</li>
 <li><code>[jQuery.Drag.prototype.location location]</code> - where the drag should be on the screen</li>
 <li><code>[jQuery.Drag.prototype.mouseElementPosition mouseElementPosition]</code> - where the mouse should be on the drag</li>
 <li><code>[jQuery.Drag.prototype.only only]</code> - only have drags, no drops</li>
 <li><code>[jQuery.Drag.prototype.representative representative]</code> - move another element in place of this element</li>
 <li><code>[jQuery.Drag.prototype.revert revert]</code> - animate the drag back to its position</li>
 <li><code>[jQuery.Drag.prototype.vertical vertical]</code> - limit the drag to vertical movement</li>
 <li><code>[jQuery.Drag.prototype.limit limit]</code> - limit the drag within an element (*limit plugin)</li>
 <li><code>[jQuery.Drag.prototype.scrolls scrolls]</code> - scroll scrollable areas when dragging near their boundries (*scroll plugin)</li>
</ul>
<h2>Demo</h2>
Now lets see some examples:
@demo jquery/event/drag/drag.html 1000