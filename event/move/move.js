steal('jquery/event').then(function( $ ) {
	var movers = $(),
		moveCount = 0;

	/**
	 * @attribute move
	 */
	$.event.special.move = {
		setup: function() {
			movers.push(this);
			$.unique(movers);
			return true;
		},
		teardown: function() {
			// we shouldn't have to sort
			movers = movers.not(this);
			return true;
		},
		add: function( handleObj ) {
			var origHandler = handleObj.handler;
			handleObj.origHandler = origHandler;

			handleObj.handler = function( ev, data ) {
				var isWindow = this === window;
				// if this is the first handler for this event ...
				if ( moveCount === 0 ) {
					// prevent others from doing what we are about to do
					moveCount++;
					var where = data === false ? ev.target : this

					// trigger all this element's handlers
					$.event.handle.call(where, ev);
					if ( ev.isPropagationStopped() ) {
						moveCount--;
						return;
					}

					// get all other elements within this element that listen to move
					// and trigger their resize events
					var index = movers.index(this),
						length = movers.length,
						child, sub;

					// if index == -1 it's the window
					while (++index < length && (child = movers[index]) && (isWindow || $.contains(where, child)) ) {

						// call the event
						$.event.handle.call(child, ev);

						if ( ev.isPropagationStopped() ) {
							// move index until the item is not in the current child
							while (++index < length && (sub = movers[index]) ) {
								if (!$.contains(child, sub) ) {
									// set index back one
									index--;
									break
								}
							}
						}
					}

					// prevent others from responding
					ev.stopImmediatePropagation();
					moveCount--;
				} else {
					handleObj.origHandler.call(this, ev, data);
				}
			}
		}
	};

	// automatically bind on these
	$([document, window]).bind('move', function() {})
})