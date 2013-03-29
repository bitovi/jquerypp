
module("jquerypp/view");




test("multiple template types work", function(){
	
	$.each(["micro","ejs","jaml", "tmpl"], function(){
		$("#qunit-test-area").html("");
		ok($("#qunit-test-area").children().length == 0,this+ ": Empty To Start")
		
		$("#qunit-test-area").html("//jquerypp/view/test/qunit/template."+this,{"message" :"helloworld"})
		ok($("#qunit-test-area").find('h3').length, this+": h3 written for ")
		ok( /helloworld\s*/.test( $("#qunit-test-area").text()), this+": hello world present for ")
	})
})



test("async templates, and caching work", function(){
	can.fixture("jquerypp/view/test/qunit/temp.ejs",function(request, response){
		setTimeout(function(){
			response(200,"success",'<h3><%= message %></h3>',{})
		},20)
		
	})
	
	
	$("#qunit-test-area").html("");
	stop();
	var i = 0;
	$("#qunit-test-area").html("//jquerypp/view/test/qunit/temp.ejs",{"message" :"helloworld"}, function(frag){
		ok( /helloworld\s*/.test( $("#qunit-test-area").text()))
		equal(frag.nodeType, 11, "we got a documentFragment");
		i++;
		equals(i, 2, "Ajax is not synchronous");
		equals(this.attr("id"), "qunit-test-area" )
		start();
	});
	i++;
	equals(i, 1, "Ajax is not synchronous")
})
test("caching works", function(){
	// this basically does a large ajax request and makes sure 
	// that the second time is always faster
	$("#qunit-test-area").html("");
	stop();
	var startT = new Date(),
		first;
	$("#qunit-test-area").html("//jquerypp/view/test/qunit/large.ejs",{"message" :"helloworld"}, function(text){
		first = new Date();
		ok(text, "we got a rendered template");
		
		
		$("#qunit-test-area").html("");
		$("#qunit-test-area").html("//jquerypp/view/test/qunit/large.ejs",{"message" :"helloworld"}, function(text){
			var lap2 = (new Date()) - first,
				lap1 =  first-startT;
			// ok( lap1 > lap2, "faster this time "+(lap1 - lap2) )
			
			start();
			$("#qunit-test-area").html("");
		})
		
	})
})
test("hookup", function(){
	$("#qunit-test-area").html("");
	
	$("#qunit-test-area").html("//jquerypp/view/test/qunit/hookup.ejs",{}); //makes sure no error happens
})

test("inline templates other than 'tmpl' like ejs", function(){
        $("#qunit-test-area").html("");

        $("#qunit-test-area").html($('<script type="test/ejs" id="test_ejs"><span id="new_name"><%= name %></span></script>'));

        $("#qunit-test-area").html('test_ejs', {name: 'Henry'});
        equal( $("#new_name").text(), 'Henry');
	$("#qunit-test-area").html("");
});

test("object of deferreds", function(){
	var foo = $.Deferred(),
		bar = $.Deferred();
	stop();
	$.View("//jquerypp/view/test/qunit/deferreds.ejs",{
		foo : foo.promise(),
		bar : bar
	}).then(function(result){
		ok(result, "FOO and BAR");
		start();
	});
	setTimeout(function(){
		foo.resolve("FOO");
	},100);
	bar.resolve("BAR");
	
});

test("deferred", function(){
	var foo = $.Deferred();
	stop();
	$.View("//jquerypp/view/test/qunit/deferred.ejs",foo).then(function(result){
		ok(result, "FOO");
		start();
	});
	setTimeout(function(){
		foo.resolve({
			foo: "FOO"
		});
	},100);
	
});


test("modifier with a deferred", function(){
	$("#qunit-test-area").html("");
	stop();
	
	var foo = $.Deferred();
	$("#qunit-test-area").html("//jquerypp/view/test/qunit/deferred.ejs", foo );
	setTimeout(function(){
		foo.resolve({
			foo: "FOO"
		});
		start();
		equals($("#qunit-test-area").html(), "FOO", "worked!");
	},100);

});

test("jQuery.fn.hookup", function(){
	$("#qunit-test-area").html("");
	var els = $($.View("//jquerypp/view/test/qunit/hookup.ejs",{})).hookup();
	$("#qunit-test-area").html(els); //makes sure no error happens
});

test("non-HTML content in hookups", function(){
  $("#qunit-test-area").html("<textarea></textarea>");
  $.View.hookup(function(){});
  $("#qunit-test-area textarea").val("asdf");
  equals($("#qunit-test-area textarea").val(), "asdf");
});

test("html takes promise", function(){
	var d = $.Deferred();
	$("#qunit-test-area").html(d);
	stop();
	d.done(function(){
		equals($("#qunit-test-area").html(), "Hello World", "deferred is working");
		start();
	})
	setTimeout(function(){
		d.resolve("Hello World")
	},10)
});

test("val set with a template within a hookup within another template", function(){
	$("#qunit-test-area").html("//jquerypp/view/test/qunit/hookupvalcall.ejs",{});
})

/*test("bad url", function(){
	$.View("//asfdsaf/sadf.ejs")
});*/

test("hyphen in type", function(){
	$(document.body).append("<script type='text/x-ejs' id='hyphenEjs'>\nHyphen\n</script>")

	$("#qunit-test-area").html('hyphenEjs',{});
	
	ok( /Hyphen/.test( $("#qunit-test-area").html() ), "has hyphen" );
})


