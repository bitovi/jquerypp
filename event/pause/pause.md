@page jQuery.event.pause
@parent jquerypp

`jQuery.event.pause` adds the ability to pause and  resume events.

    $('#todos').on('show', function(ev){
      ev.pause();
      
      $(this).load('todos.html', function(){
        ev.resume();
      });
    })

Calling `event.pause()` works similar to
[event.stopImmediatePropagation()](http://api.jquery.com/event.stopImmediatePropagation/) and
stops calling other event handlers for the  event.
When `event.resume()` is called, it will continue calling events on event handlers
after the 'paused' event handler.

Pause-able events complement the [jQuery.event.default default]
event plugin, providing the ability to easy create widgets with
an asynchronous API.  

## Limitations

The element and event handler that the <code>pause</code> is within can not be removed before 
resume is called.

## Example

The following example shows a tabs widget where the user is prompted to save, ignore, or keep editing
a tab when a new tab is clicked.

@demo jquery/event/default/defaultjquery.html