/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/drag/limit/limit*/
var $ = require('jquery');
require('../core/core.js');
$.Drag.prototype.limit = function (container, center) {
    var styles = container.css([
            'borderTopWidth',
            'paddingTop',
            'borderLeftWidth',
            'paddingLeft'
        ]), paddingBorder = new $.Vector(parseInt(styles.borderLeftWidth, 10) + parseInt(styles.paddingLeft, 10) || 0, parseInt(styles.borderTopWidth, 10) + parseInt(styles.paddingTop, 10) || 0);
    this._limit = {
        offset: container.offsetv().plus(paddingBorder),
        size: container.dimensionsv(),
        center: center === true ? 'both' : center
    };
    return this;
};
var oldPosition = $.Drag.prototype.position;
$.Drag.prototype.position = function (offsetPositionv) {
    if (this._limit) {
        var limit = this._limit, center = limit.center && limit.center.toLowerCase(), movingSize = this.movingElement.dimensionsv('outer'), halfHeight = center && center != 'x' ? movingSize.height() / 2 : 0, halfWidth = center && center != 'y' ? movingSize.width() / 2 : 0, lot = limit.offset.top(), lof = limit.offset.left(), height = limit.size.height(), width = limit.size.width();
        if (offsetPositionv.top() + halfHeight < lot) {
            offsetPositionv.top(lot - halfHeight);
        }
        if (offsetPositionv.top() + movingSize.height() - halfHeight > lot + height) {
            offsetPositionv.top(lot + height - movingSize.height() + halfHeight);
        }
        if (offsetPositionv.left() + halfWidth < lof) {
            offsetPositionv.left(lof - halfWidth);
        }
        if (offsetPositionv.left() + movingSize.width() - halfWidth > lof + width) {
            offsetPositionv.left(lof + width - movingSize.left() + halfWidth);
        }
    }
    oldPosition.call(this, offsetPositionv);
};
module.exports = $;