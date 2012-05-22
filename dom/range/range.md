@page jQuery.Range
@parent jquerypp

`jQuery.Range` provides text range helpers for creating, moving, and comparing ranges cross browser. You can get the currently selected range by calling [$.Range.current()](jQuery.Range.static.current).

## $.Range

An instance of $.Range offers the following methods:

* `[jQuery.Range.prototype.clone clone]` - clones the range and returns a new $.Range object
* `[jQuery.Range.prototype.collapse collapse]` - clones the range and returns a new `$.Range` object
* `[jQuery.Range.prototype.compare compare]` - compares one range to another range
* `[jQuery.Range.prototype.end end]` - sets or returns the end of the range
* `[jQuery.Range.prototype.move move]` - move the endpoints of a range relative to another range
* `[jQuery.Range.prototype.overlaps overlaps]` - returns if any portion of these two ranges overlap
* `[jQuery.Range.prototype.parent parent]` - returns the most common ancestor element of the endpoints in the range
* `[jQuery.Range.prototype.rect rect]` - returns the bounding rectangle of this range
* `[jQuery.Range.prototype.rects rects]` - returns the client rects
* `[jQuery.Range.prototype.start start]` - sets or returns the beginning of the range
* `[jQuery.Range.prototype.toString toString]` - returns the text of the range

Note, that the container returned by [jQuery.Range.prototype.start start] and [jQuery.Range.prototype.end end] can be a text node or cdata section (see [node types](https://developer.mozilla.org/en/nodeType)). It can be checked by comparing the returned elements `nodeType` with `Node.TEXT_NODE` or `Node.CDATA_SECTION_NODE` which you will need to get the element containing the selected text:

    var startNode = range.start().container;
    if( startNode.nodeType === Node.TEXT_NODE ||
      startNode.nodeType === Node.CDATA_SECTION_NODE ) {
      startNode = startNode.parentNode;
    }
    $(startNode).addClass('highlight');

## Examples

     // Get the current range
     var range = $.Range.current()
     
     // move the end of the range 2 characters right
     range.end(2)
     
     // get the startOffset of the range and the container
     range.start() //-> { offset: 2, container: HTMLELement }
     
     //get the most common ancestor element
     var parent = range.parent()
     
     //select the parent
     var range2 = new $.Range(parent)
