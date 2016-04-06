/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/within/within*/
define(['jquery'], function ($) {
    var withinBox = function (x, y, left, top, width, height) {
        return y >= top && y < top + height && x >= left && x < left + width;
    };
    $.fn.within = function (left, top, useOffsetCache) {
        var ret = [];
        this.each(function () {
            var q = jQuery(this);
            if (this == document.documentElement) {
                return ret.push(this);
            }
            var offset = useOffsetCache ? $.data(this, 'offsetCache') || $.data(this, 'offsetCache', q.offset()) : q.offset();
            var res = withinBox(left, top, offset.left, offset.top, this.offsetWidth, this.offsetHeight);
            if (res) {
                ret.push(this);
            }
        });
        return this.pushStack($.unique(ret), 'within', left + ',' + top);
    };
    $.fn.withinBox = function (left, top, width, height, useOffsetCache) {
        var ret = [];
        this.each(function () {
            var q = jQuery(this);
            if (this == document.documentElement)
                return ret.push(this);
            var offset = useOffsetCache ? $.data(this, 'offset') || $.data(this, 'offset', q.offset()) : q.offset();
            var ew = q.width(), eh = q.height(), res = !(offset.top > top + height || offset.top + eh < top || offset.left > left + width || offset.left + ew < left);
            if (res)
                ret.push(this);
        });
        return this.pushStack($.unique(ret), 'withinBox', $.makeArray(arguments).join(','));
    };
    return $;
});