steal("jquerypp/dom/compare",'steal-qunit',function(){

module("jquerypp/dom/compare");

test("Compare cases", function(){
    $(document.body).append("<div id='outer'><div class='first'></div><div class='second'></div>");
    var outer = $("#outer"), 
		first= outer.find(".first"), second = outer.find('.second');
    equal(outer.compare(outer) , 0, "identical elements");
    var outside = document.createElement("div");
    ok(outer.compare(outside) & 1, "different documents");
    
    equal(outer.compare(first), 20, "A container element");
    equal(outer.compare(second), 20, "A container element");
    
    equal(first.compare(outer), 10, "A parent element");
    equal(second.compare(outer), 10, "A parent element");
    
    equal(first.compare(second), 4, "A sibling elements");
    equal(second.compare(first), 2, "A sibling elements");
    outer.remove();
});

});