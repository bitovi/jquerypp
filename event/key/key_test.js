steal('steal-qunit', 'syn', 'jquerypp/event/key', function(QUnit, Syn) {
	
module('jquerypp/event/key');

test("type some things", function(){
	$("#qunit-fixture").append("<input id='key' />")
	var keydown, keypress, keyup;
	$('#key').keydown(function(ev){
		keydown = ev.keyName();
	}).keypress(function(ev){
		keypress = ev.keyName();
	}).keyup(function(ev){
		keyup = ev.keyName();
	});
	
	stop();
	
	Syn.key("key","a", function(){
		equal(keydown, "a","keydown");
		equal(keypress,"a","keypress");
		equal(keyup,   "a","keyup");
		start();
	});
})
	
})
