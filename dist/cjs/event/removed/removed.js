/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/removed/removed*/
var $ = require('jquery');
var oldClean = $.cleanData;
$.cleanData = function (elems) {
    for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
        $(elem).triggerHandler('removed');
    }
    oldClean(elems);
};
module.exports = $;