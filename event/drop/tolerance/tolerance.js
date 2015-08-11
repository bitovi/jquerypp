/**
 * @add jQuery.Drop.prototype
 */

steal('jquery', 'jquerypp/event/drop', function( $ ) {


	var allowedTolerances = [
		'touch', 'pointer', 'fit', 'intersect'
	];


	$.Drop.prototype
	/**
	 * @plugin jquerypp/event/drop/tolerance
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/event/drop/tolerance/tolerance.js
	 *
	 * @function jQuery.Drop.prototype.tolerance tolerance
	 * @parent jQuery.Drop.prototype
	 *
	 * @body
	 * `drop.tolerance(tolerance)` sets the tolerance.
	 *
	 *     $("#todos-droparea").on("dropinit", function( ev, drop ) {
	 *       drop.tolerance('touch');
	 *     })
	 *
	 * @param {String} tolerance "fit" | "intersect" | "pointer" | "touch" (default: "pointer")
	 * @return {drop} returns the drop for chaining.
	 */
	.tolerance = function( tolerance ) {
		if(allowedTolerances.indexOf(tolerance) > -1){
			this.tolerance = tolerance;
		}
		return this;
	};


	$.extend($.Drop,{
	  tolerance: 'pointer',
	  isAffected: function( point, moveable, responder ) {
	    switch(responder.tolerance){
	    	case "touch":
	    		//TODO: would be nice to use this, but it does not handle outerWidth
	    		//return (responder.element != moveable.element) && (moveable.element.withinBox(responder.element.offset().left, responder.element.offset().top, responder.element.outerWidth(), responder.element.outerHeight()).length == 1));

				//TODO: cache width/height of elements for faster calculations
        		var $m = moveable.element,
        			$r = responder.element,
        			ro = $r.offset(),
        			rw = $r.outerWidth(),
        			rh = $r.outerHeight(),
        			rTop = ro.top,
        			rBottom = ro.top + rh,
        			rLeft = ro.left,
        			rRight = ro.left + rw,

        			mo = moveable.element.offset(),
        			mw = $m.outerWidth(), 
        			mh = $m.outerHeight(),
        			mTop = mo.top,
        			mBottom = mo.top + mh,
        			mLeft = mo.left,
        			mRight = mo.left + mw,
	        		res =  !( (mTop > rBottom) || (mBottom < rTop) || (mLeft > rRight) || (mRight < rLeft));

	    		return ((responder.element != moveable.element) && res);
	    		break;

	    	case "fit":
				//TODO: cache width/height of elements for faster calculations
        		var $m = moveable.element,
        			$r = responder.element,
        			ro = $r.offset(),
        			rw = $r.outerWidth(),
        			rh = $r.outerHeight(),
        			rTop = ro.top,
        			rBottom = ro.top + rh,
        			rLeft = ro.left,
        			rRight = ro.left + rw,

        			mo = moveable.element.offset(),
        			mw = $m.outerWidth(), 
        			mh = $m.outerHeight(),
        			mTop = mo.top,
        			mBottom = mo.top + mh,
        			mLeft = mo.left,
        			mRight = mo.left + mw,
	        		res =  (mTop > rTop) && (mBottom < rBottom) && (mLeft > rLeft) && (mRight < rRight);

	    		return ((responder.element != moveable.element) && res);
	    		break;

	    	case "intersect":
				//TODO: cache width/height of elements for faster calculations
        		var $m = moveable.element,
        			$r = responder.element,
        			ro = $r.offset(),
        			rw = $r.outerWidth(),
        			rh = $r.outerHeight(),
        			rTop = ro.top,
        			rBottom = ro.top + rh,
        			rLeft = ro.left,
        			rRight = ro.left + rw,

        			mo = moveable.element.offset(),
        			mw = $m.outerWidth(), 
        			mh = $m.outerHeight(),
        			mTop = mo.top,
        			mBottom = mo.top + mh,
        			mLeft = mo.left,
        			mRight = mo.left + mw,
	        		res =  !( (mTop+(mh/2) > rBottom) || (mBottom-(mh/2) < rTop) || (mLeft+(mw/2) > rRight) || (mRight-(mw/2) < rLeft));

	    		return ((responder.element != moveable.element) && res);
	    		break;
	    	case "pointer":
	    	default:
	    		return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
	    	break;
	    }
	  }
	});

	return $;
});
