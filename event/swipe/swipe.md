@page jQuery.event.swipe
@parent jquerypp

Swipe provides cross browser swipe events [jQuery..  On mobile devices, swipe uses touch events.  On desktop browsers,
swipe uses mouseevents.

A swipe happens when a touch or drag moves.

	$('#swiper').on({
	  'swipe' : function(ev) {
	    console.log('Swiping')
	  },
	  'swipeleft' : function(ev) {
	    console.log('Swiping left')
	  },
	  'swiperight' : function(ev) {
	    console.log('Swiping right')
	  },
	  'swipeup' : function(ev) {
	    console.log('Swiping up')
	  },
	  'swipedown' : function(ev) {
	    console.log('Swiping down')
	  }
	})