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

## $.compare `$(elA).compare(elB)`

[$.fn.compare](http://donejs.com/docs.html#!jQuery.compare) compares
the position of two nodes and returns a number bitmask detailing how they
are positioned relative to each other. The following list shows the `bitmask` -> __number__ and what it corresponds to:

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

## $.cookie

[$.cookie](http://donejs.com/docs.html#!jQuery.cookie) wraps the [jQuery cookie](https://github.com/carhartl/jquery-cookie) plugin for easily manipulating cookies. You can use it like this:

{% highlight javascript %}
// Set a session cookie
$.cookie('the_cookie', 'the_value');
$.cookie('the_cookie'); // -> 'the_value'
// Set a cookie that expires in 7 days
$.cookie('the_cookie', 'the_value', { expires: 7 });
// delete the cookie
$.cookie('the_cookie', null);
{% endhighlight %}

## $.styles `$(el).styles()`

[$.styles](http://donejs.com/docs.html#!jQuery.styles) is a fast way of getting a set of computed styles from an element instead of retrieving them individually (which is much slower). Computed styles reflect the actual style of an element, including browser defaults and CSS settings.

{% highlight javascript %}
$("#foo").styles('float','display')
// -> { cssFloat: "left", display: "block" }
{% endhighlight %}

## $.dimensions

The [$.dimensions](http://donejs.com/docs.html#!jQuery.dimensions) plugin can set the inner and outer width and height on an element. Inner dimensions include the padding where outer dimensions also take care of any borders. You can set and read these values with:

* `$(el).innerHeight([height])`
* `$(el).outerHeight([height])`
* `$(el).innerWidth([width])`
* `$(el).outerWidth([width])`

And use `$(el).animate({ innerHeight : 100 })` to animate them. This is useful when you care about animating/setting the visual dimension of an element (which is what you typically want to do):

{% highlight javascript %}
$('#foo').outerWidth(100).innerHeight(50);
$('#bar').animate({outerWidth: 500});
{% endhighlight %}

## $.selection `$(el).selection([start], [end])`

[$.selection](http://donejs.com/docs.html#!jQuery.selection) adds a jQuery plugin to set or retrieve the currently selected text range. It works on all elements:

{% highlight html %}
<div id="text">This is some text</div>
{% endhighlight %}

{% highlight javascript %}
var selection = $('#text').selection(8, 12).selection();
// -> { start : 8, end : 12 }
$('#text').html().substring(selection.start, selection.end)
// -> some
{% endhighlight %}

## $.Range `$.Range([el])` `$(el).range()`

[$.Range](http://donejs.com/docs.html#!jQuery.Range) helps dealing with creating, moving and comparing text ranges. Use `$.Range().current()` to get the currently selected text range or the jQuery plugin `$(el).range()` to get a *$.Range* instance on an element. Based on the above *$.selection* example you can use *$.Range* like this:

{% highlight javascript %}
var range = $.Range.current();
// Returns the currently selected text
range.toString() // -> some
// Get the beginning of the range
range.start() // -> { offset : 8, container : TextNode }
// Get the end of the range
range.end() // -> { offset : 12, container : TextNode }
// Get the selections common parent
range.parent()
// Set the range start offset to 4
range.start(4)
{% endhighlight %}

The container returned by `start()` and `end()` can be of [type](https://developer.mozilla.org/en/nodeType) `Node.TEXT_NODE` or `Node.CDATA_SECTION_NODE`. To acces the element containing the text use this:

{% highlight javascript %}
var startNode = range.start().container;
if(startNode.nodeType === Node.TEXT_NODE ||
	startNode.nodeType === Node.CDATA_SECTION_NODE) {
  startNode = startNode.parentNode;
}
$(startNode).addClass('highlight');
{% endhighlight %}

## $.within `$(el).within(left, top, [useOffsetCache])`

[$.within](http://donejs.com/docs.html#!jQuery.within) returns all elements on a given position or area. The following example returns all `div` elements on the point 200px left and 200px from the top:

{% highlight javascript %}
$('div').within(200, 200);
{% endhighlight %}

Use `$(el).withinBox(left, top, width, height)` to get all elements within a certain area:

{% highlight javascript %}
$('*').within(200, 200, 100, 100);
{% endhighlight %}

## $.formParams `$(form).formParams([convert])`

[$.formParams](http://donejs.com/docs.html#!jQuery.formParams) returns a JavaScript object for values in a form.

{% highlight html %}
<form>
	<input type="text" name="first" value="John" />
	<input type="text" name="last" value="Doe" />
	<input type="text" name="phone[mobile]" value="1234567890" />
	<input type="text" name="phone[home]" value="0987654321" />
</form>
{% endhighlight %}

{% highlight javascript %}
$('form').formParams()
// -> {
//      first : "John", last : "Doe",
//      phone : { mobile : "1234567890", home : "0987654321" }
// }
{% endhighlight %}

## $.event.drag `dragdown` `draginit` `dragmove` `dragend` `dragover` `dragout`

[$.event.drag](http://donejs.com/docs.html#!jQuery.event.drag) adds drag events to jQuery:

* `dragdown` - the mouse cursor is pressed down
* `draginit` - the drag motion is started
* `dragmove` - the drag is moved
* `dragend` - the drag has ended
* `dragover` - the drag is over a drop point
* `dragout` - the drag moved out of a drop point

An element will become draggable by listening to one of these events on it. A draggable div that can only be moved horizontally can be initialized like this:

{% highlight javascript %}
$('div').on('draginit', function(event, drag) {
  drag.horizontal();
})
{% endhighlight %}

The `drag` object (passed to the event handler as the second parameter) has the following properties:

* `cancel` - stops the drag motion from happening
* `ghost` - copys the draggable and drags the cloned element
* `horizontal` - limits the scroll to horizontal movement
* `location` - where the drag should be on the screen
* `mouseElementPosition` - where the mouse should be on the drag
* `only` - only have drags, no drops
* `representative` - move another element in place of this element
* `revert` - animate the drag back to its position
* `vertical` - limit the drag to vertical movement
* `limit` - limit the drag within an element
* `scrolls` - scroll scrollable areas when dragging near their boundries

## $.event.drop `dropinit` `dropover` `dropout` `dropmove` `dropon` `dropend`

When making an element dragable with $.event.drag you probably want to be able to also drop it somewhere. [$.event.drop](http://donejs.com/docs.html#!jQuery.event.drop) adds events for doing so:

* `dropinit` - the drag motion is started, drop positions are calculated
* `dropover` - a drag moves over a drop element, called once as the drop is dragged over the element
* `dropout` - a drag moves out of the drop element
* `dropmove` - a drag is moved over a drop element, called repeatedly as the element is moved
* `dropon` - a drag is released over a drop element
* `dropend` - the drag motion has completed

The following example adds the `highlight` class when a drag is moved over the element and removes it when it leaves:

{% highlight javascript %}
$('.drop').on({
  "dropover" : function(ev, drop, drag){
    $(this).addClass('highlight');
  },
  "dropout" : function(ev, drop, drag){
    $(this).removeClass('highlight');
  }
})
{% endhighlight %}

## $.event.hover `hoverinit` `hoverenter` `hovermove` `hoverleave`

[$.event.hover](http://donejs.com/docs.html#!jQuery.event.hover) is a flexible way to deal with hover related events. You can listen to the `hoverinit`, `hoverenter`, `hovermove` and `hoverleave` events:

{% highlight javascript %}
$('#menu').on({
  hoverenter : function(){
    $(this).addClass("hovering");
  },
  hoverleave : function(){
    $(this).removeClass("hovering");
  }
}, ".option");
{% endhighlight %}

An element is hovered when the mouse moves less than a certain distance in a specific time over the element. You can modify these values either globally by setting `$.Hover.delay` and `$.Hover.distance` or individually during `hoverinit`:

{% highlight javascript %}
$(".option").on("hoverinit", function(ev, hover){
  //set the distance to 10px
  hover.distance(10)
  //set the delay to 200ms
  hover.delay(10)
})
{% endhighlight %}

## $.event.destroyed `destroyed`

The [destroyed](http://donejs.com/docs.html#!jQuery.event.destroyed) event is triggered when the element is removed from the DOM using one of the jQuery [manipulation methods](http://api.jquery.com/category/manipulation/).

{% highlight javascript %}
$('form').on('destroyed', function() {
  // Clean up when a form element has been removed
});
{% endhighlight %}

*Note: The destroyed event does not bubble.*

## $.event.resize `resize`

Listening to the `resize` event provided by [$.event.resize](http://donejs.com/docs.html#!jQuery.event.resize) is very useful when you need to resize a specific element whenever the parents dimension changes. Unlike other events that bubble from the current element to the top the *resize* event will propagate from the outside-in. This means that outside elements will always resize first.

{% highlight javascript %}
$('#foo').on('resize', function(){
  // adjust #foo's dimensions
})

$(document.body).trigger("resize");
{% endhighlight %}

## $.event.swipe `swipeleft` `swiperight` `swipedown` `swipeup` `swipe`

[$.event.swipe](http://donejs.com/docs.html#!jQuery.event.swipe) adds support for swipe motions on touchscreen devices. You can listen to `swipeleft`, `swiperight`, `swipedown`, `swipeup` and a general `swipe` event:

{% highlight javascript %}
$('#swiper').on({
  'swipe' : function(ev) {
    console.log('Swiping');
  },
  'swipeleft' : function(ev) {
    console.log('Swiping left');
  },
  'swiperight' : function(ev) {
    console.log('Swiping right');
  },
  'swipeup' : function(ev) {
    console.log('Swiping up');
  },
  'swipedown' : function(ev) {
    console.log('Swiping down');
  }
});
{% endhighlight %}

Set `$.event.swipe.delay` to the maximum time the swipe motion should take (default is 500ms).

## $.event.key

[$.event.key](http://donejs.com/docs.html#!jQuery.event.key) allows you to define alternate keymaps or overwrite existing keycodes. For example lets map the arrow up, down, left and right keys to the more gamer friendly WASD mapping:

{% highlight javascript %}
$.event.key({
  "w" : 38,
  "a" : 37,
  "s" : 40,
  "d" : 39
});
{% endhighlight %}

You can also call `event.keyName()` to get a string representation of the key pressed, for example backspaces:

{% highlight javascript %}
$("input").on('keypress', function(ev){
  if(ev.keyName() == '\b') {
    ev.preventDefault();
  }
});
{% endhighlight %}

The following keynames will be mapped by default:

* `\b` - backspace
* `\t` - tab
* `\r` - enter key
* `shift`, `ctrl`, `alt`
* `pause-break`, `caps`, `escape`, `num-lock`, `scroll-loc`, `print`
* `page-up`, `page-down`, `end`, `home`, `left`, `up`, `right`, `down`, `insert`, `delete`
* `' '` - space
* `0-9` - number key pressed
* `a-z` - alpha key pressed
* `num0-9` - number pad key pressed
* `f1-12` - function keys pressed
* Symbols: `/`, `;`, `:`, `=`, `,`, `-`, `.`, `/`, `[`, `\`, `]`, `'`, `"`

## $.event.default `eventname.default`

[$.event.default](http://donejs.com/docs.html#!jQuery.event.default) lets you perform default actions for events. A default event runs when all other event handlers have been triggered and none has called `event.preventDefault()` or returned false. To add a default event just prefix it with the *default* namespace:

{% highlight javascript %}
$("div").on("default.click", function(ev) {
  // ...
});
{% endhighlight %}

## $.event.pause

### pause and resume `event.pause(), event.resume()`

[$.event.pause](http://donejs.com/docs.html#!jQuery.event.pause) lets you pause and resume events. Pausing an event works similar to [.stopImmediatePropagation()](http://api.jquery.com/event.stopImmediatePropagation/) by calling `event.pause()`. Calling `event.resume()` will continue propagation. This is great when going asynchronous processing in an event handler:

{% highlight javascript %}
$('#todos').on('show', function(ev){
  ev.pause();

  $(this).load('todos.html', function(){
    ev.resume();
   });
})
{% endhighlight %}

### .triggerAsync `$(el).triggerAsync(event, [success], [prevented])`

[$.fn.triggerAsync](http://donejs.com/docs.html#!jQuery.fn.triggerAsync) triggers an event and calls a *success* handler when it has finished propagating through the DOM and `event.preventDefault()` is not called. The *prevented* callback will be used otherwise:

{% highlight javascript %}
$('panel').triggerAsync('show', function(){
    $('#panel').show();
  },function(){
    $('#other').addClass('error');
});
{% endhighlight %}

## Get Help

There are several places you can go to ask questions or get help debugging problems.

### Twitter

Follow [@donejs](https://twitter.com/#!/donejs) for updates, announcements and quick answers to your questions.

### Forums

Visit the [Forums](http://forum.javascriptmvc.com/#Forum/jquerypp) for questions requiring more than 140 characters. DoneJS has a thriving community that's always eager to help out.

### IRC

The DoneJS IRC channel (`#donejs` on **irc.freenode.net**) is an awesome place to hang out with fellow DoneJS users and get your questions answered quickly.

__Help Us Help You __

Help the community help you by using the [jQuery++ jsFiddle template](http://jsfiddle.net/donejs/qYdwR/) below. Just fork it and include the URL when you are asking for help.

### Get Help from Bitovi

Bitovi _(developers of jQuery++)_ offers [training](http://bitovi.com/training/) and [consulting](http://bitovi.com/consulting/) for your team. They can also provide private one-on-one support staffed by their JavaScript/Ajax experts. [Contact Bitovi](contact@bitovi.com) if you're interested.

## Why jQuery++

## Developing jQuery++