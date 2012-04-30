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

## Demo
@demo jquery/dom/compare/compare.html



@param {HTMLElement|jQuery}  element an element or jQuery collection to compare against.
@return {Number} A bitmap number representing how the elements are positioned from each other.

If the code looks like:

    $('#foo').compare($('#bar')) //-> Number

Number is a bitmap with with the following values:
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