---
layout: default
---

# Welcome to jQuery++

jQuery++ is a collection of useful jQuery
extensions and events.  

They are organized in two broad categories:

 - DOM Helpers - helpers to work with DOM function or improve jQuery performance
 - Events - jQuery special events

## Get jQuery++

### Download Builder

Check the files you want to download and a zip file will be created.  The
zip file will contain each individual plugin, and a combined version of all plugins
minified and unminified.

### Using Steal

Add these to your jQuery folder:

### Using AMD

require('jquery/compare')

## $.compare `$(elA).compare(elB) -> Number`

[$.fn.compare](http://donejs.com/docs.html#!jQuery.compare) compares
the position of two nodes and returns a number bitmask detailing how they
are positioned relative to each other.

<table class='options'>
    <tr><th>Bits</th><th>Number</th><th>Meaning</th></tr>
    <tr><td>000000</td><td>0</td><td>Elements are identical.</td></tr>
    <tr><td>000001</td><td>1</td><td>The nodes are in different
                    documents (or one is outside of a document).</td></tr>
    <tr><td>000010</td><td>2</td><td>#bar precedes #foo.</td></tr>
    <tr><td>000100</td><td>4</td><td>#foo precedes #bar.</td></tr>
    <tr><td>001000</td><td>8</td><td>#bar contains #foo.</td></tr>
    <tr><td>010000</td><td>16</td><td>#foo contains #bar.</td></tr>
</table>

You can tell if `#foo` precedes `#bar` like:

    if( $('#foo').compare($('#bar')) & 4 ) {
       console.log("#foo preceds #bar")
    }

This is useful when you want to rapidly compare element positions.  This is
common when widgets can reorder themselves (drag-drop) or with nested widgets (trees).

## $.cookie




## $.styles

Reads a bunch of styles


## $.dimensions

Animate innerHeight, innerWidget, outerHeight, outerWidth.


This is useful when you care about animating/settings the visual dimension of an element
(which is actually what you typically want to animate).

## $.selection

Gets or sets the selection

## $.within

## $.Range



## $.event.drag

## $.event.drop

## $.event.hover

## $.event.destroyed

## $.event.resize

## $.event.swipe

## $.event.key

## $.event.default

## $.event.pause

## Get Help

## Why jQuery++

## Developing jQuery++