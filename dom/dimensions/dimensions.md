@page jQuery.dimensions
@parent jquerypp

@plugin jquery/dom/dimensions

`jQuery.dimensions` adds support for setting and animating inner and outer dimensions.

## Use

When writing reusable plugins, you often want to 
set or animate an element's width and height that include its padding,
border, or margin.  This is especially important in plugins that
allow custom styling.

The dimensions plugin overwrites [jQuery.fn.outerHeight outerHeight],
[jQuery.fn.outerWidth outerWidth], [jQuery.fn.innerHeight innerHeight] 
and [jQuery.fn.innerWidth innerWidth] to let you set these properties and
extends [animate](http://api.jquery.com/animate/) to animate them.

## Quick Examples

     $('#foo').outerWidth(100).innerHeight(50);
     $('#bar').animate({ outerWidth: 500 });
     $('#bar').animate({
       outerWidth: 500,
       innerHeight: 200
     });

## Demo

@demo jquery/dom/dimensions/dimensions.html