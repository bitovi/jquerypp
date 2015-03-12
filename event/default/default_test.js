steal('steal-qunit','jquerypp/event/default',function(){

module("jquerypp/event/default");

test("namespaced with same function", function(){

	var count = 0 ,  func = function(){
		count++;
	};
	$("#qunit-fixture").html("<div id='one'>hey</div>");
	$("#one").bind("foo.bar", func).bind("foo.zar", func);
	$("#one").trigger("foo.bar");
	equal(1, count,"jquery seems ok");
});


test("triggering defaults", function(){

	$("#qunit-fixture").html(
	
	"<div id='bigwrapper'><div id='wrap1'><div id='touchme1'>ClickMe</div></div>"+
	"<div id='wrap2'><div id='touchme2'>ClickMe</a></div></div>");
	
	
	var count1 = 0, defaultNum, touchNum, num = 0;
	
	$("#wrap1").bind("default.touch", function(){
		count1++;
		defaultNum = (++num);
	});
	
	$("#wrap1").bind("touch", function(){
		touchNum = (++num);
	});
	
	$("#touchme1").trigger("touch");
	equal(count1, 1 , "trigger default event");
	equal(touchNum, 1, "default called second");
	equal(defaultNum, 2, "default called second");
	
	//now prevent
	
	$("#bigwrapper").bind("touch", function(e){ e.preventDefault();});
	
	$("#touchme1").trigger("touch");
	
	equal(count1, 1 , "default event not called again"); // breaking
	equal(3, touchNum, "touch called again");
	
	var count2 = 0;
	$("#wrap2").bind("default.hide.me.a", function(){
		count2++;               
	});
	
	$(document.body).bind("hide", function(ev){
		if(ev.target.id == "clickme1"){
			ev.stopPropagation();
			ev.preventDefault();
		}
			
	});
	$(".clickme").click(function(){
		$(this).trigger("hide");
	});
	
	
	$("#qunit-fixture").html("");
});



test("on default events", function(){
	
	$("#qunit-fixture").html(
	
	"<div id='bigwrapper'><div id='wrap1'><div id='touchme1'>ClickMe</div></div>"+
	"<div id='wrap2'><div id='touchme2'>ClickMe</a></div></div>");
	
	var bw = $("#bigwrapper"), 
		count1 = 0, 
		count2 = 0, 
		count3 = 0;
	var jq = $();
	jq.context = bw[0];
	jq.selector = "#wrap1";
	
	$("#qunit-fixture").on("default.touch","#wrap1", function(){
		count1++;
	});
	
	$("#qunit-fixture").on("default.touching", "#wrap2",function(){
		count2++;
	});
	

	bw.delegate("#wrap2","default.somethingElse",function(){
		count3++;
	});
	
	
	$("#touchme1").trigger("touch")
	equal(count1,1,  "doing touch")
	
	$("#touchme2").trigger("touching")
	equal(count2,1,  "doing touching")
	
	$("#touchme2").trigger("somethingElse")
	equal(count3,1,  "delegated live somethingElse")
	
	
	$("#qunit-fixture").html("");
});


test("default and live order", function(){
	var order = [];
	$("#qunit-fixture").html("<div id='foo'></div>");
	
	$(document.body).on("default.show", "#foo",function(){
		order.push("default");
	});
	$(document.body).on("show","#foo", function(){
		order.push("show");
	});
	
	$("#foo").trigger("show");
	
	deepEqual(order, ['show','default'],"show then default");
	$(document.body).off();
});


test("type on objects", function(){
	var ev = $.Event('updated'),
		obj = {foo: 'bar'};
		
	$(obj).trigger(ev);

	equal(ev.type, 'updated');
});

test("namespace on objects", function(){
	var ev = $.Event('updated.ns'),
		obj = {foo: 'bar'};
		
	$(obj).trigger(ev);
	equal(ev.namespace, 'ns');
});


test("default events with argument", function(){

	$("#qunit-fixture").html("<div id='touchme'></div>");
	
	
	var arg = "foobar", touchArg, defaultArg;
	$("#touchme").bind("default.touch", function(e, data){
		defaultArg = data;
	});
	$("#touchme").bind("touch", function(e, data){
		touchArg = data;
	});
	$("#touchme").trigger("touch", arg);
	equal(touchArg, arg, "standard event got args");
	equal(defaultArg, arg, "default event got args");
});


});
