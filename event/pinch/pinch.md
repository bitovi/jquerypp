@page jQuery.event.pinch
@parent jquerypp

`jQuery.event.pinch` provides `pinchout`, `pinchin` and a general `pinch` event in browsers that support multi-touch gesture events.
Detecting pinches is done via gesture events.

A pinch happens when two fingers move away or towards each other and change the scale of the document by more than [jQuery.event.pinch.minScale]. The pinch events are fired when the gesture ends, so pinching in and then out will result in a single `pinchout` event.

    $('#swiper').on({
      'pinch' : function(ev) {
        console.log('Pinched')
      },
      'pinchin' : function(ev) {
        console.log('Pinched In')
      },
      'pinchout' : function(ev) {
        console.log('Pinched Out')
      }
    })
