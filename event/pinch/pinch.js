steal('jquery', 'jquerypp/event/livehack', function($) {

    var isPhantom = /Phantom/.test(navigator.userAgent),
        supportGestures = !isPhantom && "ongestureend" in document;

        if(!supportGestures) {
            return $;
        }

    /**
     * @add jQuery.event.pinch
     */
    var pinch = $.event.pinch = {
        /**
         * @attribute minScale
         * minScale is the minimum amount of scale change required to trigger a pinch event. This defaults to 0.01.
         * 
         * The scale of the gestureend event must differ by at least this much.
         */
        minScale : 0.01,
    };

    $.event.setupHelper( [
    /**
     * @hide
     * @attribute pinch
     */
    "pinch",
    /**
     * @hide
     * @attribute pinchin
     */
    'pinchin',
    /**
     * @hide
     * @attribute pinchout
     */
    'pinchout'], "gesturestart", function(ev) {
        var delegate = ev.delegateTarget || ev.currentTarget,
            selector = ev.handleObj.selector,
            entered = this;

        $(document.documentElement).one('gestureend', function(event) {
            var scale = event.originalEvent.scale,
                deltaScale = Math.abs(1 - scale),
                events = [];

            if(deltaScale >= pinch.minScale) {
                events.push('pinch');
                if(scale > 1) {
                    events.push('pinchout')
                } else if(scale < 1) {
                    events.push('pinchin')
                }

                $.each($.event.find(delegate, events, selector), function(){
                    this.call(entered, ev);
                });
            }
        })
    });

    return $;
});