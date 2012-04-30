@page jQuery.dimensions
@parent jquerypp

@plugin jquery/dom/dimensions

The dimensions plugin adds support for setting+animating inner+outer height and widths.

### Quick Examples

     $('#foo').outerWidth(100).innerHeight(50);
     $('#bar').animate({outerWidth: 500});
     
## Use

When writing reusable plugins, you often want to 
set or animate an element's width and height that include its padding,
border, or margin.  This is especially important in plugins that
allow custom styling.

The dimensions plugin overwrites [jQuery.fn.outerHeight outerHeight],
[jQuery.fn.outerWidth outerWidth], [jQuery.fn.innerHeight innerHeight] 
and [jQuery.fn.innerWidth innerWidth]
to let you set and animate these properties.

## Demo

@demo jquery/dom/dimensions/dimensions.html