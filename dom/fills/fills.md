@page jQuery.fills
@parent jquerypp

`jQuery.fills` adds `[jQuery.fn.fills jQuery.fn.fills(parent)]` which sets an elements height to fill out the
remaining height of a parent element and keep it up to date when the parent [jQuery.event.resize resizes].

This is extremely useful for complex layouts where sibling elements can wrap automatically and the remaining
height would have to be determined manually.

## Examples

    // Fill out the parent element
    $(element).fills();
    // Fill out the element with id parent
    $(element).fills('#parent');
    // Fill out the element with id parent and add a class
    $(element).fills({
      parent : '#parent',
      className : 'filling'
    });

## Demo

The following example shows a [resizable](http://jqueryui.com/demos/resizable/) `div` with a 10px padding and two
paragraphs. Resize it to see how the `#mainfiller` element adjust it's size properly including the paragraphs margin
and the parent element padding even when a paragraph wraps.
You can also see how fills adjusts areas with scrollbars by clicking *run* in the second demo:

@demo jquery/dom/fills/fills.html