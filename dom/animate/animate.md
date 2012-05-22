@page jQuery.animate
@parent jquerypp

`jQuery.animate` adds `[jQuery.fn.anifast jQuery.fn.anifast(properties, duration, callback)]`
which allows you to animate properties using CSS animations, if supported.
If the browser doesn't support CSS animations, [jQuery .animate()](http://api.jquery.com/animate/) will be used.

## Example

This makes it possible to create a fade in effect using CSS animations like this:

    $('#element').css({
      opacity : 0
    }).anifast({
      opacity : 1
    }, 1000, function() {
      console.log('Animation done');
    });

## Demo

The following demo is based on the [jQuery .animate reference](http://api.jquery.com/animate/) but uses
[jQuery.fn.anifast]:

@demo jquery/dom/animate/animate.html 400