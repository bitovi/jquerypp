/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/drag/core/core*/
define([
    'jquery',
    '../../../lang/vector/vector.js',
    '../../livehack/livehack.js',
    '../../reverse/reverse.js'
], function ($) {
    if (!$.event.special.move) {
        $.event.reverse('move');
    }
    var bind = function (object, method) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function () {
                var args2 = [this].concat(args, $.makeArray(arguments));
                return method.apply(object, args2);
            };
        }, event = $.event, clearSelection = window.getSelection ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
        }, supportTouch = !window._phantom && 'ontouchend' in document, startEvent = supportTouch ? 'touchstart' : 'mousedown', stopEvent = supportTouch ? 'touchend' : 'mouseup', moveEvent = supportTouch ? 'touchmove' : 'mousemove', preventTouchScroll = function (ev) {
            ev.preventDefault();
        };
    $.Drag = function () {
    };
    $.extend($.Drag, {
        lowerName: 'drag',
        current: null,
        distance: 0,
        mousedown: function (ev, element) {
            var isLeftButton = ev.button === 0 || ev.button == 1, doEvent = isLeftButton || supportTouch;
            if (!doEvent || this.current) {
                return;
            }
            var drag = new $.Drag(), delegate = ev.delegateTarget || element, selector = ev.handleObj.selector, self = this;
            this.current = drag;
            drag.setup({
                element: element,
                delegate: ev.delegateTarget || element,
                selector: ev.handleObj.selector,
                moved: false,
                _distance: this.distance,
                callbacks: {
                    dragdown: event.find(delegate, ['dragdown'], selector),
                    draginit: event.find(delegate, ['draginit'], selector),
                    dragover: event.find(delegate, ['dragover'], selector),
                    dragmove: event.find(delegate, ['dragmove'], selector),
                    dragout: event.find(delegate, ['dragout'], selector),
                    dragend: event.find(delegate, ['dragend'], selector),
                    dragcleanup: event.find(delegate, ['dragcleanup'], selector)
                },
                destroyed: function () {
                    self.current = null;
                }
            }, ev);
        }
    });
    $.extend($.Drag.prototype, {
        setup: function (options, ev) {
            $.extend(this, options);
            this.element = $(this.element);
            this.event = ev;
            this.moved = false;
            this.allowOtherDrags = false;
            var mousemove = bind(this, this.mousemove), mouseup = bind(this, this.mouseup);
            this._mousemove = mousemove;
            this._mouseup = mouseup;
            this._distance = options.distance ? options.distance : 0;
            this.mouseStartPosition = ev.vector();
            $(document).bind(moveEvent, mousemove);
            $(document).bind(stopEvent, mouseup);
            if (supportTouch) {
                $(document).bind(moveEvent, preventTouchScroll);
            }
            if (!this.callEvents('down', this.element, ev)) {
                this.noSelection(this.delegate);
                clearSelection();
            }
        },
        destroy: function () {
            $(document).unbind(moveEvent, this._mousemove);
            $(document).unbind(stopEvent, this._mouseup);
            if (supportTouch) {
                $(document).unbind(moveEvent, preventTouchScroll);
            }
            if (!this.moved) {
                this.event = this.element = null;
            }
            if (!supportTouch) {
                this.selection(this.delegate);
            }
            this.destroyed();
        },
        mousemove: function (docEl, ev) {
            if (!this.moved) {
                var dist = Math.sqrt(Math.pow(ev.pageX - this.event.pageX, 2) + Math.pow(ev.pageY - this.event.pageY, 2));
                if (dist < this._distance) {
                    return false;
                }
                this.init(this.element, ev);
                this.moved = true;
            }
            this.element.trigger('move', this);
            var pointer = ev.vector();
            if (this._start_position && this._start_position.equal(pointer)) {
                return;
            }
            this.draw(pointer, ev);
        },
        mouseup: function (docEl, event) {
            if (this.moved) {
                this.end(event);
            }
            this.destroy();
        },
        noSelection: function (elm) {
            elm = elm || this.delegate;
            document.documentElement.onselectstart = function () {
                return false;
            };
            document.documentElement.unselectable = 'on';
            this.selectionDisabled = this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm);
            this.selectionDisabled.css('-moz-user-select', '-moz-none');
        },
        selection: function () {
            if (this.selectionDisabled) {
                document.documentElement.onselectstart = function () {
                };
                document.documentElement.unselectable = 'off';
                this.selectionDisabled.css('-moz-user-select', '');
            }
        },
        init: function (element, event) {
            element = $(element);
            var startElement = this.movingElement = this.element = $(element);
            this._cancelled = false;
            this.event = event;
            this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv());
            this.callEvents('init', element, event);
            if (this._cancelled === true) {
                return;
            }
            this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();
            this.makePositioned(this.movingElement);
            this.oldZIndex = this.movingElement.css('zIndex');
            this.movingElement.css('zIndex', 1000);
            if (!this._only && this.constructor.responder) {
                this.constructor.responder.compile(event, this);
            }
        },
        makePositioned: function (that) {
            var style, pos = that.css('position');
            if (!pos || pos == 'static') {
                style = { position: 'relative' };
                if (window.opera) {
                    style.top = '0px';
                    style.left = '0px';
                }
                that.css(style);
            }
        },
        callEvents: function (type, element, event, drop) {
            var i, cbs = this.callbacks[this.constructor.lowerName + type];
            for (i = 0; i < cbs.length; i++) {
                cbs[i].call(element, event, this, drop);
            }
            return cbs.length;
        },
        currentDelta: function () {
            return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
        },
        draw: function (pointer, event) {
            if (this._cancelled) {
                return;
            }
            clearSelection();
            this.location = pointer.minus(this.mouseElementPosition);
            this.move(event);
            if (this._cancelled) {
                return;
            }
            if (!event.isDefaultPrevented()) {
                this.position(this.location);
            }
            if (!this._only && this.constructor.responder) {
                this.constructor.responder.show(pointer, this, event);
            }
        },
        position: function (newOffsetv) {
            var style, dragged_element_css_offset = this.currentDelta(), dragged_element_position_vector = this.movingElement.offsetv().minus(dragged_element_css_offset);
            this.required_css_position = newOffsetv.minus(dragged_element_position_vector);
            this.offsetv = newOffsetv;
            style = this.movingElement[0].style;
            if (!this._cancelled && !this._horizontal) {
                style.top = this.required_css_position.top() + 'px';
            }
            if (!this._cancelled && !this._vertical) {
                style.left = this.required_css_position.left() + 'px';
            }
        },
        move: function (event) {
            this.callEvents('move', this.element, event);
        },
        over: function (event, drop) {
            this.callEvents('over', this.element, event, drop);
        },
        out: function (event, drop) {
            this.callEvents('out', this.element, event, drop);
        },
        end: function (event) {
            if (this._cancelled) {
                return;
            }
            if (!this._only && this.constructor.responder) {
                this.constructor.responder.end(event, this);
            }
            this.callEvents('end', this.element, event);
            if (this._revert) {
                var self = this;
                this.movingElement.animate({
                    top: this.startPosition.top() + 'px',
                    left: this.startPosition.left() + 'px'
                }, function () {
                    self.cleanup.apply(self, arguments);
                });
            } else {
                this.cleanup(event);
            }
            this.event = null;
        },
        cleanup: function (event) {
            this.movingElement.css({ zIndex: this.oldZIndex });
            if (this.movingElement[0] !== this.element[0] && !this.movingElement.has(this.element[0]).length && !this.element.has(this.movingElement[0]).length) {
                this.movingElement.css({ display: 'none' });
            }
            if (this._removeMovingElement) {
                this.movingElement.remove();
            }
            if (event) {
                this.callEvents('cleanup', this.element, event);
            }
            this.movingElement = this.element = this.event = null;
        },
        cancel: function () {
            this._cancelled = true;
            if (!this._only && this.constructor.responder) {
                this.constructor.responder.clear(this.event.vector(), this, this.event);
            }
            this.destroy();
        },
        ghost: function (parent) {
            var ghost = this.movingElement.clone().css('position', 'absolute');
            if (parent) {
                $(parent).append(ghost);
            } else {
                $(this.movingElement).after(ghost);
            }
            ghost.width(this.movingElement.width()).height(this.movingElement.height());
            ghost.offset(this.movingElement.offset());
            this.movingElement = ghost;
            this.noSelection(ghost);
            this._removeMovingElement = true;
            return ghost;
        },
        representative: function (element, offsetX, offsetY) {
            this._offsetX = offsetX || 0;
            this._offsetY = offsetY || 0;
            var p = this.mouseStartPosition;
            this.movingElement = $(element);
            this.movingElement.css({
                top: p.y() - this._offsetY + 'px',
                left: p.x() - this._offsetX + 'px',
                display: 'block',
                position: 'absolute'
            }).show();
            this.noSelection(this.movingElement);
            this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
            return this;
        },
        revert: function (val) {
            this._revert = val === undefined ? true : val;
            return this;
        },
        vertical: function () {
            this._vertical = true;
            return this;
        },
        horizontal: function () {
            this._horizontal = true;
            return this;
        },
        only: function (only) {
            return this._only = only === undefined ? true : only;
        },
        distance: function (val) {
            if (val !== undefined) {
                this._distance = val;
                return this;
            } else {
                return this._distance;
            }
        }
    });
    event.setupHelper([
        'dragdown',
        'draginit',
        'dragover',
        'dragmove',
        'dragout',
        'dragend',
        'dragcleanup'
    ], startEvent, function (e) {
        $.Drag.mousedown.call($.Drag, e, this);
    });
    return $;
});