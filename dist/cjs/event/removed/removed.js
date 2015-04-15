/*!
 * jQuery++ - 2.0.0
 * http://jquerypp.com
 * Copyright (c) 2015 Bitovi
 * Wed, 15 Apr 2015 22:07:45 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.0#event/removed/removed*/
var $ = require('jquery');
var oldClean = $.cleanData;
$.cleanData = function (elems) {
    for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
        $(elem).triggerHandler('removed');
    }
    oldClean(elems);
};
module.exports = $;