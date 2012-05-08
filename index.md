---
layout: default
---

# Welcome to jQuery++

jQuery++ is a collection of useful jQuery extensions and events.

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
are positioned relative to each other. The following list shows the `bitmask` __number__ and what it corresponds to:

* `000000` -> __0__: Elements are identical
* `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
* `000010` -> __2__: #bar precedes #foo
* `000100` -> __4__: #foo precedes #bar
* `001000` -> __8__: #bar contains #foo
* `010000` -> __16__: #foo contains #bar

You can tell if `#foo` precedes `#bar` like:

{% highlight javascript %}
if( $('#foo').compare($('#bar')) & 4 ) {
    console.log("#foo preceds #bar")
}
{% endhighlight %}

This is useful when you want to rapidly compare element positions.  This is
common when widgets can reorder themselves (drag-drop) or with nested widgets (trees).


## $.event.destroyed

The [destroyed](http://donejs.com/docs.html#!jQuery.event.destroyed) event is triggered when the element is removed from the DOM through one of the jQuery modifiers like remove, html or replaceWith.

{% highlight javascript %}
$('form').on('destroyed', function() {
	// Clean up when a form element has been removed
});
{% endhighlight %}

## $.event.resize

The [resize](http://donejs.com/docs.html#!jQuery.event.resize) event can update the

## $.event.swipe

[$.event.swipe](http://donejs.com/docs.html#!jQuery.event.swipe)

## $.event.key

[$.event.key](http://donejs.com/docs.html#!jQuery.event.key) allows you to define alternate keymaps or overwrite existing keycodes. For example lets map the arrow up, down, left and right keys to the more gamer friendly WASD mapping:

	$.event.key({
		"w" : 38,
		"a" : 37,
		"s" : 40,
		"d" : 39
	});

## $.event.default `$(el).bind('eventname.default', handler)`

[$.event.default](http://donejs.com/docs.html#!jQuery.event.default) lets you perform default actions for events. A default event runs when all other event handlers have been triggered and none has called `event.preventDefault()` or returned false. To add a default event just prefix it with the *default* namespace:

{% highlight javascript %}
$("div").bind("default.show", function(ev) {
	// ...
});
{% endhighlight %}

## .triggerAsync `$(el).triggerAsync(event, [success], [prevented])`

[$.fn.triggerAsync](http://donejs.com/docs.html#!jQuery.fn.triggerAsync) triggers an event and calls a *success* handler when it has finished propagating through the DOM and preventDefault is not called. The *prevented* callback will be used otherwise:

{% highlight javascript %}
$('panel').triggerAsync('show', function(){
		$('#panel').show();
    },function(){
		$('#other').addClass('error');
});
{% endhighlight %}


## $.event.pause `event.pause(), event.resume()`

[$.event.pause](http://donejs.com/docs.html#!jQuery.event.pause) lets you pause and resume events. Pausing an event works similar to [.stopImmediatePropagation()](http://api.jquery.com/event.stopImmediatePropagation/) by calling `event.pause()`. When `event.resume()` is being called propagation will continue. This is great for asynchronous processing when handling an event:

{% highlight javascript %}
$('#todos').bind('show', function(ev){
	ev.pause();

    $(this).load('todos.html', function(){
        ev.resume();
	});
})
{% endhighlight %}

## Get Help

## Why jQuery++

## Developing jQuery++