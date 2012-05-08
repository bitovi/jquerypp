@page jQuery.compare
@parent jquerypp
@test jquery/dom/compare/qunit.html
@plugin dom/compare

Compares the position of two nodes and returns a bitmask detailing how they are positioned 
relative to each other.  

    $('#foo').compare($('#bar')) //-> Number

You can expect it to return the same results as 
[http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].

The following list shows the `bitmask` -> __number__ that compare returns and what it corresponds to:

* `000000` -> __0__: Elements are identical
* `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
* `000010` -> __2__: #bar precedes #foo
* `000100` -> __4__: #foo precedes #bar
* `001000` -> __8__: #bar contains #foo
* `010000` -> __16__: #foo contains #bar

You can test if #foo precedes #bar like:

	if( $('#foo').compare($('#bar')) & 4 ) {
	    console.log("#foo preceds #bar")
	}

## Demo

@demo jquery/dom/compare/compare.html
