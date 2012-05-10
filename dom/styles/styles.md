@page jQuery.styles
@parent jquerypp

Use $.fn.styles to rapidly get a bunch of computed styles from an element.

## Quick Example


    $("#foo").styles('float','display') //->
    // {
    //  cssFloat: "left", display: "block"
    // }

## Use

An element's __computed__ style is the current calculated style of the property.
This is different than the values on `element.style` as
`element.style` doesn't reflect styles provided by css or the browser's default
css properties.

Getting computed values individually (e.g. by using jQuery [.css()](http://api.jquery.com/css/)) is expensive!
This plugin lets you get all the style properties you need all at once.

## Demo

The following demo illustrates the performance improvement curStyle provides by providing
a faster 'height' jQuery function called 'fastHeight'.

@demo jquery/dom/styles/styles.html

