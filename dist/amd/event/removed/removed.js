/*!
 * jQuery++ - 2.0.1
 * http://jquerypp.com
 * Copyright (c) 2015 Bitovi
 * Tue, 11 Aug 2015 16:00:55 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.1#event/removed/removed*/
define(['jquery'], function ($) {
    var oldClean = $.cleanData;
    $.cleanData = function (elems) {
        for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            $(elem).triggerHandler('removed');
        }
        oldClean(elems);
    };
    return $;
});