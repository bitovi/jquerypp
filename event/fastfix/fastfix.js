steal('jquery', function () {
	// http://bitovi.com/blog/2012/04/faster-jquery-event-fix.html
	// https://gist.github.com/2377196


	var set = function (obj, prop, val) {
		Object.defineProperty(obj, prop, {
			value : val
		})
		return val;
	};

	var special = {
		pageX : function (original) {
			var eventDoc = this.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;
			return original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
		},
		pageY : function (original) {
			var eventDoc = this.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;
			return original.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0 );
		},
		relatedTarget : function (original) {
			if(!original) {
				return original;
			}
			return original.fromElement === this.target ? original.toElement : original.fromElement;
		},
		metaKey : function (originalEvent) {
			return originalEvent.ctrlKey;
		},
		/* TODO this was in here twice. Probably wrong
		 which : function(original){
		 var button = original.button;
		 return ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
		 },
		 */
		which : function (original) {
			return original.charCode != null ? original.charCode : original.keyCode;
		}
	};

	$.each($.event.keyHooks.props.concat($.event.mouseHooks.props).concat($.event.props), function (i, prop) {
		if (prop !== "target") {
			(function () {
				Object.defineProperty(jQuery.Event.prototype, prop, {
					get : function () {
						// get the original value
						var originalValue = this.originalEvent ? this.originalEvent[prop] : null;
						// overwrite getter lookup
						return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,
							// if we have a special function and no value
							special[prop] && originalValue == null ?
								// call the special function
								special[prop].call(this, this.originalEvent) :
								// use the original value
								originalValue)
					},
					set : function (newValue) {
						this['_' + prop] = newValue;
					}
				})
			})();
		}
	})


	$.event.fix = function (event) {
		if (event[ jQuery.expando ]) {
			return event;
		}
		// Create a jQuery event with at minimum a target and type set
		var originalEvent = event,
			event = jQuery.Event(originalEvent);
		event.target = originalEvent.target;
		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if (!event.target) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if (event.target.nodeType === 3) {
			event.target = event.target.parentNode;
		}

		return event;
	}

});
