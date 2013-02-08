/*!
* jQuery++ - 1.0.1 (2013-02-08)
* http://jquerypp.com
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'jquerypp/event/drag/core', 'jquerypp/dom/styles'], function ($) {

	$.Drag.prototype

	.limit = function (container, center) {
		//on draws ... make sure this happens
		var styles = container.styles('borderTopWidth', 'paddingTop', 'borderLeftWidth', 'paddingLeft'),
			paddingBorder = new $.Vector(
			parseInt(styles.borderLeftWidth, 10) + parseInt(styles.paddingLeft, 10) || 0, parseInt(styles.borderTopWidth, 10) + parseInt(styles.paddingTop, 10) || 0);

		this._limit = {
			offset: container.offsetv().plus(paddingBorder),
			size: container.dimensionsv(),
			center: center === true ? 'both' : center
		};
		return this;
	};

	var oldPosition = $.Drag.prototype.position;
	$.Drag.prototype.position = function (offsetPositionv) {
		//adjust required_css_position accordingly
		if (this._limit) {
			var limit = this._limit,
				center = limit.center && limit.center.toLowerCase(),
				movingSize = this.movingElement.dimensionsv('outer'),
				halfHeight = center && center != 'x' ? movingSize.height() / 2 : 0,
				halfWidth = center && center != 'y' ? movingSize.width() / 2 : 0,
				lot = limit.offset.top(),
				lof = limit.offset.left(),
				height = limit.size.height(),
				width = limit.size.width();

			//check if we are out of bounds ...
			//above
			if (offsetPositionv.top() + halfHeight < lot) {
				offsetPositionv.top(lot - halfHeight);
			}
			//below
			if (offsetPositionv.top() + movingSize.height() - halfHeight > lot + height) {
				offsetPositionv.top(lot + height - movingSize.height() + halfHeight);
			}
			//left
			if (offsetPositionv.left() + halfWidth < lof) {
				offsetPositionv.left(lof - halfWidth);
			}
			//right
			if (offsetPositionv.left() + movingSize.width() - halfWidth > lof + width) {
				offsetPositionv.left(lof + width - movingSize.left() + halfWidth);
			}
		}

		oldPosition.call(this, offsetPositionv);
	};

	return $;
});