@page jQuery.Range
@parent jquerypp

Provides text range helpers for creating, moving, and comparing ranges cross browser.

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

The container returned by `start()` and `end()` can be of [type](https://developer.mozilla.org/en/nodeType) `Node.TEXT_NODE` or `Node.CDATA_SECTION_NODE`. To acces the element containing the text use this:

    var startNode = range.start().container;
    if( startNode.nodeType === Node.TEXT_NODE ||
      startNode.nodeType === Node.CDATA_SECTION_NODE ) {
        startNode = startNode.parentNode;
    }
    $(startNode).addClass('highlight');