@page jQuery.compare
@parent jquerypp
@test jquery/dom/compare/qunit.html
@plugin dom/compare

Compares the position of two nodes and returns a number representing a bitmask detailing how they are positioned
relative to each other.  

    $('#foo').compare($('#bar')) //-> Number

You can expect it to return the same results as 
[http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].

The following list shows the `bitmask`, the __number__ and what it corresponds to:

* `000000` -> __0__: Elements are identical
* `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
* `000010` -> __2__: #bar precedes #foo
* `000100` -> __4__: #foo precedes #bar
* `001000` -> __8__: #bar contains #foo
* `010000` -> __16__: #foo contains #bar

You can tests if the number returned by $.compare matches any of these conditions by combining them with a binary AND:

	if( $('#foo').compare($('#bar')) & 4 ) {
	    console.log("#foo preceds #bar")
	}

	if( $('#foo').compare($('#bar')) & 8 ) {
        console.log("#bar contains #foo")
    }

## Demo

@demo jquery/dom/compare/compare.html
