@page jQuery.event.key
@parent jquerypp

`jQuery.event.key` adds a [jQuery.Event.prototype.keyName keyName()] method to the
[event object](http://api.jquery.com/category/events/event-object/)
that returns a string representation of the current key:

	$("input").on('keypress', function(ev){
	  // Don't allow backspace keys
	  if(ev.keyName() == '\b') {
	    ev.preventDefault()
	  }
	  if(ev.keyName() == 'f1') {
	    alert('I could be a tooltip for help')
	  }
	})

The following keynames are mapped by default:

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

## Demo

@demo jquery/event/key/key.html
