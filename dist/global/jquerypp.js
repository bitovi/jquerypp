/*!
 * jQuery++ - 2.0.0
 * http://jquerypp.com
 * Copyright (c) 2015 Bitovi
 * Wed, 15 Apr 2015 22:07:45 GMT
 * Licensed MIT
 */

/*[global-shim-start]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses only the exports objet
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	global.System = {
		define: function(__name, __code){
			global.define = origDefine;
			eval("(function() { " + __code + " \n }).call(global);");
			global.define = ourDefine;
		},
		orig: global.System
	};
})({"jquery/jquery":"jQuery"},window)
/*jquerypp@2.0.0#dom/animate/animate*/
define('jquerypp/dom/animate/animate', ['jquery/jquery'], function ($) {
    var animationNum = 0, styleSheet = null, cache = [], browser = null, oldanimate = $.fn.animate, getStyleSheet = function () {
            if (!styleSheet) {
                var style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.setAttribute('media', 'screen');
                document.getElementsByTagName('head')[0].appendChild(style);
                if (!window.createPopup) {
                    style.appendChild(document.createTextNode(''));
                }
                styleSheet = style.sheet;
            }
            return styleSheet;
        }, removeAnimation = function (sheet, name) {
            for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
                var rule = sheet.cssRules[j];
                if (rule.type === 7 && rule.name == name) {
                    sheet.deleteRule(j);
                    return;
                }
            }
        }, passThrough = function (props, ops, easing, callback) {
            var nonElement = !(this[0] && this[0].nodeType), isInline = !nonElement && $(this).css('display') === 'inline' && $(this).css('float') === 'none', browser = getBrowser();
            for (var name in props) {
                if (props[name] == 'show' || props[name] == 'hide' || props[name] == 'toggle' || $.isArray(props[name]) || props[name] < 0 || name == 'zIndex' || name == 'z-index' || name == 'scrollTop' || name == 'scrollLeft') {
                    return true;
                }
            }
            return props.jquery === true || browser === null || browser.prefix === '-o-' || $.isEmptyObject(props) || (easing || easing && typeof easing == 'string') || $.isPlainObject(ops) || isInline || nonElement;
        }, cssValue = function (origName, value) {
            if (typeof value === 'number' && !$.cssNumber[origName]) {
                return value += 'px';
            }
            return value;
        }, getBrowser = function () {
            if (!browser) {
                var t, el = document.createElement('fakeelement'), transitions = {
                        'transition': {
                            transitionEnd: 'transitionEnd',
                            prefix: ''
                        },
                        'MozTransition': {
                            transitionEnd: 'animationend',
                            prefix: '-moz-'
                        },
                        'WebkitTransition': {
                            transitionEnd: 'webkitAnimationEnd',
                            prefix: '-webkit-'
                        },
                        'OTransition': {
                            transitionEnd: 'oTransitionEnd',
                            prefix: '-o-'
                        }
                    };
                for (t in transitions) {
                    if (t in el.style) {
                        browser = transitions[t];
                    }
                }
            }
            return browser;
        }, ffProps = {
            top: function (el) {
                return el.position().top;
            },
            left: function (el) {
                return el.position().left;
            },
            width: function (el) {
                return el.width();
            },
            height: function (el) {
                return el.height();
            },
            fontSize: function (el) {
                return '1em';
            }
        }, addPrefix = function (properties) {
            var result = {};
            $.each(properties, function (name, value) {
                result[getBrowser().prefix + name] = value;
            });
            return result;
        }, getAnimation = function (style) {
            var sheet, name, last;
            $.each(cache, function (i, animation) {
                if (style === animation.style) {
                    name = animation.name;
                    animation.age = 0;
                } else {
                    animation.age += 1;
                }
            });
            if (!name) {
                sheet = getStyleSheet();
                name = 'jquerypp_animation_' + animationNum++;
                sheet.insertRule('@' + getBrowser().prefix + 'keyframes ' + name + ' ' + style, sheet.cssRules && sheet.cssRules.length || 0);
                cache.push({
                    name: name,
                    style: style,
                    age: 0
                });
                cache.sort(function (first, second) {
                    return first.age - second.age;
                });
                if (cache.length > 20) {
                    last = cache.pop();
                    removeAnimation(sheet, last.name);
                }
            }
            return name;
        };
    $.fn.animate = function (props, speed, easing, callback) {
        if (passThrough.apply(this, arguments)) {
            return oldanimate.apply(this, arguments);
        }
        var optall = $.speed(speed, easing, callback), overflow = [];
        if ('height' in props || 'width' in props) {
            overflow = [
                this[0].style.overflow,
                this[0].style.overflowX,
                this[0].style.overflowY
            ];
            this.css('overflow', 'hidden');
        }
        this.queue(optall.queue, function (done) {
            var current, properties = [], to = '', prop, self = $(this), duration = optall.duration, animationName, dataKey, style = '{ from {', animationEnd = function (currentCSS, exec) {
                    if (!exec) {
                        self[0].style.overflow = overflow[0];
                        self[0].style.overflowX = overflow[1];
                        self[0].style.overflowY = overflow[2];
                    } else {
                        self.css('overflow', '');
                    }
                    self.css(currentCSS);
                    self.css(addPrefix({
                        'animation-duration': '',
                        'animation-name': '',
                        'animation-fill-mode': '',
                        'animation-play-state': ''
                    }));
                    if ($.isFunction(optall.old) && exec) {
                        optall.old.call(self[0], true);
                    }
                    $.removeData(self, dataKey, true);
                }, finishAnimation = function () {
                    animationEnd(props, true);
                    done();
                };
            for (prop in props) {
                properties.push(prop);
            }
            if (getBrowser().prefix === '-moz-') {
                $.each(properties, function (i, prop) {
                    var converter = ffProps[$.camelCase(prop)];
                    if (converter && self.css(prop) == 'auto') {
                        self.css(prop, converter(self));
                    }
                });
            }
            current = self.css.apply(self, properties);
            $.each(properties, function (i, cur) {
                var name = cur.replace(/([A-Z]|^ms)/g, '-$1').toLowerCase();
                style += name + ' : ' + cssValue(cur, current[cur]) + '; ';
                to += name + ' : ' + cssValue(cur, props[cur]) + '; ';
            });
            style += '} to {' + to + ' }}';
            animationName = getAnimation(style);
            dataKey = animationName + '.run';
            $._data(this, dataKey, {
                stop: function (gotoEnd) {
                    self.css(addPrefix({ 'animation-play-state': 'paused' }));
                    self.off(getBrowser().transitionEnd, finishAnimation);
                    if (!gotoEnd) {
                        animationEnd(self.styles.apply(self, properties), false);
                    } else {
                        animationEnd(props, true);
                    }
                }
            });
            self.css(addPrefix({
                'animation-duration': duration + 'ms',
                'animation-name': animationName,
                'animation-fill-mode': 'forwards'
            }));
            self.one(getBrowser().transitionEnd, finishAnimation);
        });
        return this;
    };
    return $;
});
/*jquerypp@2.0.0#dom/compare/compare*/
define('jquerypp/dom/compare/compare', ['jquery/jquery'], function ($) {
    $.fn.compare = function (element) {
        try {
            element = element.jquery ? element[0] : element;
        } catch (e) {
            return null;
        }
        if (window.HTMLElement) {
            var s = HTMLElement.prototype.toString.call(element);
            if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
                return null;
            }
        }
        if (this[0].compareDocumentPosition) {
            return this[0].compareDocumentPosition(element);
        }
        if (this[0] == document && element != document)
            return 8;
        var number = (this[0] !== element && this[0].contains(element) && 16) + (this[0] != element && element.contains(this[0]) && 8), docEl = document.documentElement;
        if (this[0].sourceIndex) {
            number += this[0].sourceIndex < element.sourceIndex && 4;
            number += this[0].sourceIndex > element.sourceIndex && 2;
            number += (this[0].ownerDocument !== element.ownerDocument || this[0] != docEl && this[0].sourceIndex <= 0 || element != docEl && element.sourceIndex <= 0) && 1;
        }
        return number;
    };
    return $;
});
/*jquerypp@2.0.0#dom/cookie/cookie*/
define('jquerypp/dom/cookie/cookie', ['jquery/jquery'], function ($) {
    $.cookie = function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            if (typeof value == 'object' && JSON.stringify) {
                value = JSON.stringify(value);
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [
                name,
                '=',
                encodeURIComponent(value),
                expires,
                path,
                domain,
                secure
            ].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == name + '=') {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            if (cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = JSON.parse(cookieValue);
                } catch (e) {
                }
            }
            return cookieValue;
        }
    };
    return $;
});
/*jquerypp@2.0.0#dom/form_params/form_params*/
define('jquerypp/dom/form_params/form_params', ['jquery/jquery'], function ($) {
    var keyBreaker = /[^\[\]]+/g, convertValue = function (value) {
            if ($.isNumeric(value)) {
                return parseFloat(value);
            } else if (value === 'true') {
                return true;
            } else if (value === 'false') {
                return false;
            } else if (value === '' || value === null) {
                return undefined;
            }
            return value;
        }, nestData = function (elem, type, data, parts, value, seen, fullName) {
            var name = parts.shift();
            fullName = fullName ? fullName + '.' + name : name;
            if (parts.length) {
                if (!data[name]) {
                    data[name] = {};
                }
                nestData(elem, type, data[name], parts, value, seen, fullName);
            } else {
                if (fullName in seen && type != 'radio' && !$.isArray(data[name])) {
                    if (name in data) {
                        data[name] = [data[name]];
                    } else {
                        data[name] = [];
                    }
                } else {
                    seen[fullName] = true;
                }
                if ((type == 'radio' || type == 'checkbox') && !elem.is(':checked')) {
                    return;
                }
                if (!data[name]) {
                    data[name] = value;
                } else {
                    data[name].push(value);
                }
            }
        };
    $.fn.extend({
        formParams: function (params) {
            var convert;
            if (!!params === params) {
                convert = params;
                params = null;
            }
            if (params) {
                return this.setParams(params);
            } else {
                return this.getParams(convert);
            }
        },
        setParams: function (params) {
            this.find('[name]').each(function () {
                var $this = $(this), value = params[$this.attr('name')];
                if (value !== undefined) {
                    if ($this.is(':radio')) {
                        if ($this.val() == value) {
                            $this.attr('checked', true);
                        }
                    } else if ($this.is(':checkbox')) {
                        value = $.isArray(value) ? value : [value];
                        if ($.inArray($this.val(), value) > -1) {
                            $this.attr('checked', true);
                        }
                    } else {
                        $this.val(value);
                    }
                }
            });
        },
        getParams: function (convert) {
            var data = {}, seen = {}, current;
            this.find('[name]:not(:disabled)').each(function () {
                var $this = $(this), type = $this.attr('type'), name = $this.attr('name'), value = $this.val(), parts;
                if (type == 'submit' || !name) {
                    return;
                }
                parts = name.match(keyBreaker);
                if (!parts.length) {
                    parts = [name];
                }
                if (convert) {
                    value = convertValue(value);
                }
                nestData($this, type, data, parts, value, seen);
            });
            return data;
        }
    });
    return $;
});
/*jquerypp@2.0.0#dom/range/range*/
define('jquerypp/dom/range/range', [
    'jquery/jquery',
    'jquerypp/dom/compare/compare'
], function ($) {
    $.fn.range = function () {
        return $.Range(this[0]);
    };
    var convertType = function (type) {
            return type.replace(/([a-z])([a-z]+)/gi, function (all, first, next) {
                return first + next.toLowerCase();
            }).replace(/_/g, '');
        }, reverse = function (type) {
            return type.replace(/^([a-z]+)_TO_([a-z]+)/i, function (all, first, last) {
                return last + '_TO_' + first;
            });
        }, getWindow = function (element) {
            return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window;
        }, bisect = function (el, start, end) {
            if (end - start == 1) {
                return;
            }
        }, support = {};
    $.Range = function (range) {
        if (this.constructor !== $.Range) {
            return new $.Range(range);
        }
        if (range && range.jquery) {
            range = range[0];
        }
        if (!range || range.nodeType) {
            this.win = getWindow(range);
            if (this.win.document.createRange) {
                this.range = this.win.document.createRange();
            } else if (this.win && this.win.document.body && this.win.document.body.createTextRange) {
                this.range = this.win.document.body.createTextRange();
            }
            if (range) {
                this.select(range);
            }
        } else if (range.clientX != null || range.pageX != null || range.left != null) {
            this.moveToPoint(range);
        } else if (range.originalEvent && range.originalEvent.touches && range.originalEvent.touches.length) {
            this.moveToPoint(range.originalEvent.touches[0]);
        } else if (range.originalEvent && range.originalEvent.changedTouches && range.originalEvent.changedTouches.length) {
            this.moveToPoint(range.originalEvent.changedTouches[0]);
        } else {
            this.range = range;
        }
    };
    $.Range.current = function (el) {
        var win = getWindow(el), selection;
        if (win.getSelection) {
            selection = win.getSelection();
            return new $.Range(selection.rangeCount ? selection.getRangeAt(0) : win.document.createRange());
        } else {
            return new $.Range(win.document.selection.createRange());
        }
    };
    $.extend($.Range.prototype, {
        moveToPoint: function (point) {
            var clientX = point.clientX, clientY = point.clientY;
            if (!clientX) {
                var off = scrollOffset();
                clientX = (point.pageX || point.left || 0) - off.left;
                clientY = (point.pageY || point.top || 0) - off.top;
            }
            if (support.moveToPoint) {
                this.range = $.Range().range;
                this.range.moveToPoint(clientX, clientY);
                return this;
            }
            var parent = document.elementFromPoint(clientX, clientY);
            for (var n = 0; n < parent.childNodes.length; n++) {
                var node = parent.childNodes[n];
                if (node.nodeType === 3 || node.nodeType === 4) {
                    var range = $.Range(node), length = range.toString().length;
                    for (var i = 1; i < length + 1; i++) {
                        var rect = range.end(i).rect();
                        if (rect.left <= clientX && rect.left + rect.width >= clientX && rect.top <= clientY && rect.top + rect.height >= clientY) {
                            range.start(i - 1);
                            this.range = range.range;
                            return this;
                        }
                    }
                }
            }
            var previous;
            iterate(parent.childNodes, function (textNode) {
                var range = $.Range(textNode);
                if (range.rect().top > point.clientY) {
                    return false;
                } else {
                    previous = range;
                }
            });
            if (previous) {
                previous.start(previous.toString().length);
                this.range = previous.range;
            } else {
                this.range = $.Range(parent).range;
            }
        },
        window: function () {
            return this.win || window;
        },
        overlaps: function (elRange) {
            if (elRange.nodeType) {
                elRange = $.Range(elRange).select(elRange);
            }
            var startToStart = this.compare('START_TO_START', elRange), endToEnd = this.compare('END_TO_END', elRange);
            if (startToStart <= 0 && endToEnd >= 0) {
                return true;
            }
            if (startToStart >= 0 && this.compare('START_TO_END', elRange) <= 0) {
                return true;
            }
            if (this.compare('END_TO_START', elRange) >= 0 && endToEnd <= 0) {
                return true;
            }
            return false;
        },
        collapse: function (toStart) {
            this.range.collapse(toStart === undefined ? true : toStart);
            return this;
        },
        toString: function () {
            return typeof this.range.text == 'string' ? this.range.text : this.range.toString();
        },
        start: function (set) {
            if (set === undefined) {
                if (this.range.startContainer) {
                    return {
                        container: this.range.startContainer,
                        offset: this.range.startOffset
                    };
                } else {
                    var start = this.clone().collapse().parent();
                    var startRange = $.Range(start).select(start).collapse();
                    startRange.move('END_TO_START', this);
                    return {
                        container: start,
                        offset: startRange.toString().length
                    };
                }
            } else {
                if (this.range.setStart) {
                    if (typeof set == 'number') {
                        this.range.setStart(this.range.startContainer, set);
                    } else if (typeof set == 'string') {
                        var res = callMove(this.range.startContainer, this.range.startOffset, parseInt(set, 10));
                        this.range.setStart(res.node, res.offset);
                    } else {
                        this.range.setStart(set.container, set.offset);
                    }
                } else {
                    if (typeof set == 'string') {
                        this.range.moveStart('character', parseInt(set, 10));
                    } else {
                        var container = this.start().container, offset;
                        if (typeof set == 'number') {
                            offset = set;
                        } else {
                            container = set.container;
                            offset = set.offset;
                        }
                        var newPoint = $.Range(container).collapse();
                        newPoint.range.move(offset);
                        this.move('START_TO_START', newPoint);
                    }
                }
                return this;
            }
        },
        end: function (set) {
            if (set === undefined) {
                if (this.range.startContainer) {
                    return {
                        container: this.range.endContainer,
                        offset: this.range.endOffset
                    };
                } else {
                    var end = this.clone().collapse(false).parent(), endRange = $.Range(end).select(end).collapse();
                    endRange.move('END_TO_END', this);
                    return {
                        container: end,
                        offset: endRange.toString().length
                    };
                }
            } else {
                if (this.range.setEnd) {
                    if (typeof set == 'number') {
                        this.range.setEnd(this.range.endContainer, set);
                    } else if (typeof set == 'string') {
                        var res = callMove(this.range.endContainer, this.range.endOffset, parseInt(set, 10));
                        this.range.setEnd(res.node, res.offset);
                    } else {
                        this.range.setEnd(set.container, set.offset);
                    }
                } else {
                    if (typeof set == 'string') {
                        this.range.moveEnd('character', parseInt(set, 10));
                    } else {
                        var container = this.end().container, offset;
                        if (typeof set == 'number') {
                            offset = set;
                        } else {
                            container = set.container;
                            offset = set.offset;
                        }
                        var newPoint = $.Range(container).collapse();
                        newPoint.range.move(offset);
                        this.move('END_TO_START', newPoint);
                    }
                }
                return this;
            }
        },
        parent: function () {
            if (this.range.commonAncestorContainer) {
                return this.range.commonAncestorContainer;
            } else {
                var parentElement = this.range.parentElement(), range = this.range;
                iterate(parentElement.childNodes, function (txtNode) {
                    if ($.Range(txtNode).range.inRange(range)) {
                        parentElement = txtNode;
                        return false;
                    }
                });
                return parentElement;
            }
        },
        rect: function (from) {
            var rect = this.range.getBoundingClientRect();
            if (!rect.height && !rect.width) {
                rect = this.range.getClientRects()[0];
            }
            if (from === 'page') {
                var off = scrollOffset();
                rect = $.extend({}, rect);
                rect.top += off.top;
                rect.left += off.left;
            }
            return rect;
        },
        rects: function (from) {
            var rects = $.map($.makeArray(this.range.getClientRects()).sort(function (rect1, rect2) {
                    return rect2.width * rect2.height - rect1.width * rect1.height;
                }), function (rect) {
                    return $.extend({}, rect);
                }), i = 0, j, len = rects.length;
            while (i < rects.length) {
                var cur = rects[i], found = false;
                j = i + 1;
                while (j < rects.length) {
                    if (withinRect(cur, rects[j])) {
                        if (!rects[j].width) {
                            rects.splice(j, 1);
                        } else {
                            found = rects[j];
                            break;
                        }
                    } else {
                        j++;
                    }
                }
                if (found) {
                    rects.splice(i, 1);
                } else {
                    i++;
                }
            }
            if (from == 'page') {
                var off = scrollOffset();
                return $.each(rects, function (ith, item) {
                    item.top += off.top;
                    item.left += off.left;
                });
            }
            return rects;
        }
    });
    (function () {
        var fn = $.Range.prototype, range = $.Range().range;
        fn.compare = range.compareBoundaryPoints ? function (type, range) {
            return this.range.compareBoundaryPoints(this.window().Range[reverse(type)], range.range);
        } : function (type, range) {
            return this.range.compareEndPoints(convertType(type), range.range);
        };
        fn.move = range.setStart ? function (type, range) {
            var rangesRange = range.range;
            switch (type) {
            case 'START_TO_END':
                this.range.setStart(rangesRange.endContainer, rangesRange.endOffset);
                break;
            case 'START_TO_START':
                this.range.setStart(rangesRange.startContainer, rangesRange.startOffset);
                break;
            case 'END_TO_END':
                this.range.setEnd(rangesRange.endContainer, rangesRange.endOffset);
                break;
            case 'END_TO_START':
                this.range.setEnd(rangesRange.startContainer, rangesRange.startOffset);
                break;
            }
            return this;
        } : function (type, range) {
            this.range.setEndPoint(convertType(type), range.range);
            return this;
        };
        var cloneFunc = range.cloneRange ? 'cloneRange' : 'duplicate', selectFunc = range.selectNodeContents ? 'selectNodeContents' : 'moveToElementText';
        fn.clone = function () {
            return $.Range(this.range[cloneFunc]());
        };
        fn.select = range.selectNodeContents ? function (el) {
            if (!el) {
                var selection = this.window().getSelection();
                selection.removeAllRanges();
                selection.addRange(this.range);
            } else {
                this.range.selectNodeContents(el);
            }
            return this;
        } : function (el) {
            if (!el) {
                this.range.select();
            } else if (el.nodeType === 3) {
                var parent = el.parentNode, start = 0, end;
                iterate(parent.childNodes, function (txtNode) {
                    if (txtNode === el) {
                        end = start + txtNode.nodeValue.length;
                        return false;
                    } else {
                        start = start + txtNode.nodeValue.length;
                    }
                });
                this.range.moveToElementText(parent);
                this.range.moveEnd('character', end - this.range.text.length);
                this.range.moveStart('character', start);
            } else {
                this.range.moveToElementText(el);
            }
            return this;
        };
    }());
    var iterate = function (elems, cb) {
            var elem, start;
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    if (cb(elem) === false) {
                        return false;
                    }
                } else if (elem.nodeType !== 8) {
                    if (iterate(elem.childNodes, cb) === false) {
                        return false;
                    }
                }
            }
        }, isText = function (node) {
            return node.nodeType === 3 || node.nodeType === 4;
        }, iteratorMaker = function (toChildren, toNext) {
            return function (node, mustMoveRight) {
                if (node[toChildren] && !mustMoveRight) {
                    return isText(node[toChildren]) ? node[toChildren] : arguments.callee(node[toChildren]);
                } else if (node[toNext]) {
                    return isText(node[toNext]) ? node[toNext] : arguments.callee(node[toNext]);
                } else if (node.parentNode) {
                    return arguments.callee(node.parentNode, true);
                }
            };
        }, getNextTextNode = iteratorMaker('firstChild', 'nextSibling'), getPrevTextNode = iteratorMaker('lastChild', 'previousSibling'), callMove = function (container, offset, howMany) {
            var mover = howMany < 0 ? getPrevTextNode : getNextTextNode;
            if (!isText(container)) {
                container = container.childNodes[offset] ? container.childNodes[offset] : container.lastChild;
                if (!isText(container)) {
                    container = mover(container);
                }
                return move(container, howMany);
            } else {
                if (offset + howMany < 0) {
                    return move(mover(container), offset + howMany);
                } else {
                    return move(container, offset + howMany);
                }
            }
        }, move = function (from, howMany) {
            var mover = howMany < 0 ? getPrevTextNode : getNextTextNode;
            howMany = Math.abs(howMany);
            while (from && howMany >= from.nodeValue.length) {
                howMany = howMany - from.nodeValue.length;
                from = mover(from);
            }
            return {
                node: from,
                offset: mover === getNextTextNode ? howMany : from.nodeValue.length - howMany
            };
        }, supportWhitespace, isWhitespace = function (el) {
            if (supportWhitespace == null) {
                supportWhitespace = 'isElementContentWhitespace' in el;
            }
            return supportWhitespace ? el.isElementContentWhitespace : el.nodeType === 3 && '' == el.data.trim();
        }, within = function (rect, point) {
            return rect.left <= point.clientX && rect.left + rect.width >= point.clientX && rect.top <= point.clientY && rect.top + rect.height >= point.clientY;
        }, withinRect = function (outer, inner) {
            return within(outer, {
                clientX: inner.left,
                clientY: inner.top
            }) && within(outer, {
                clientX: inner.left + inner.width,
                clientY: inner.top
            }) && within(outer, {
                clientX: inner.left,
                clientY: inner.top + inner.height
            }) && within(outer, {
                clientX: inner.left + inner.width,
                clientY: inner.top + inner.height
            });
        }, scrollOffset = function (win) {
            var win = win || window;
            doc = win.document.documentElement, body = win.document.body;
            return {
                left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
                top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
            };
        };
    support.moveToPoint = !!$.Range().range.moveToPoint;
    return $;
});
/*jquerypp@2.0.0#dom/selection/selection*/
define('jquerypp/dom/selection/selection', [
    'jquery/jquery',
    'jquerypp/dom/range/range'
], function ($) {
    var getWindow = function (element) {
            return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window;
        }, getElementsSelection = function (el, win) {
            var current = $.Range.current(el).clone(), entireElement = $.Range(el).select(el);
            if (!current.overlaps(entireElement)) {
                return null;
            }
            if (current.compare('START_TO_START', entireElement) < 1) {
                startPos = 0;
                current.move('START_TO_START', entireElement);
            } else {
                fromElementToCurrent = entireElement.clone();
                fromElementToCurrent.move('END_TO_START', current);
                startPos = fromElementToCurrent.toString().length;
            }
            if (current.compare('END_TO_END', entireElement) >= 0) {
                endPos = entireElement.toString().length;
            } else {
                endPos = startPos + current.toString().length;
            }
            return {
                start: startPos,
                end: endPos,
                width: endPos - startPos
            };
        }, getSelection = function (el) {
            var win = getWindow(el);
            if (el.selectionStart !== undefined) {
                if (document.activeElement && document.activeElement != el && el.selectionStart == el.selectionEnd && el.selectionStart == 0) {
                    return {
                        start: el.value.length,
                        end: el.value.length,
                        width: 0
                    };
                }
                return {
                    start: el.selectionStart,
                    end: el.selectionEnd,
                    width: el.selectionEnd - el.selectionStart
                };
            } else if (win.getSelection) {
                return getElementsSelection(el, win);
            } else {
                try {
                    if (el.nodeName.toLowerCase() == 'input') {
                        var real = getWindow(el).document.selection.createRange(), r = el.createTextRange();
                        r.setEndPoint('EndToStart', real);
                        var start = r.text.length;
                        return {
                            start: start,
                            end: start + real.text.length,
                            width: real.text.length
                        };
                    } else {
                        var res = getElementsSelection(el, win);
                        if (!res) {
                            return res;
                        }
                        var current = $.Range.current().clone(), r2 = current.clone().collapse().range, r3 = current.clone().collapse(false).range;
                        r2.moveStart('character', -1);
                        r3.moveStart('character', -1);
                        if (res.startPos != 0 && r2.text == '') {
                            res.startPos += 2;
                        }
                        if (res.endPos != 0 && r3.text == '') {
                            res.endPos += 2;
                        }
                        return res;
                    }
                } catch (e) {
                    return {
                        start: el.value.length,
                        end: el.value.length,
                        width: 0
                    };
                }
            }
        }, select = function (el, start, end) {
            var win = getWindow(el);
            if (el.setSelectionRange) {
                if (end === undefined) {
                    el.focus();
                    el.setSelectionRange(start, start);
                } else {
                    el.select();
                    el.selectionStart = start;
                    el.selectionEnd = end;
                }
            } else if (el.createTextRange) {
                var r = el.createTextRange();
                r.moveStart('character', start);
                end = end || start;
                r.moveEnd('character', end - el.value.length);
                r.select();
            } else if (win.getSelection) {
                var doc = win.document, sel = win.getSelection(), range = doc.createRange(), ranges = [
                        start,
                        end !== undefined ? end : start
                    ];
                getCharElement([el], ranges);
                range.setStart(ranges[0].el, ranges[0].count);
                range.setEnd(ranges[1].el, ranges[1].count);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (win.document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(el);
                range.collapse();
                range.moveStart('character', start);
                range.moveEnd('character', end !== undefined ? end : start);
                range.select();
            }
        }, replaceWithLess = function (start, len, range, el) {
            if (typeof range[0] === 'number' && range[0] < len) {
                range[0] = {
                    el: el,
                    count: range[0] - start
                };
            }
            if (typeof range[1] === 'number' && range[1] <= len) {
                range[1] = {
                    el: el,
                    count: range[1] - start
                };
                ;
            }
        }, getCharElement = function (elems, range, len) {
            var elem, start;
            len = len || 0;
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    start = len;
                    len += elem.nodeValue.length;
                    replaceWithLess(start, len, range, elem);
                } else if (elem.nodeType !== 8) {
                    len = getCharElement(elem.childNodes, range, len);
                }
            }
            return len;
        };
    $.fn.selection = function (start, end) {
        if (start !== undefined) {
            return this.each(function () {
                select(this, start, end);
            });
        } else {
            return getSelection(this[0]);
        }
    };
    $.fn.selection.getCharElement = getCharElement;
    return $;
});
/*jquerypp@2.0.0#dom/within/within*/
define('jquerypp/dom/within/within', ['jquery/jquery'], function ($) {
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
/*jquerypp@2.0.0#lang/vector/vector*/
define('jquerypp/lang/vector/vector', ['jquery/jquery'], function ($) {
    var getSetZero = function (v) {
            return v !== undefined ? this.array[0] = v : this.array[0];
        }, getSetOne = function (v) {
            return v !== undefined ? this.array[1] = v : this.array[1];
        };
    $.Vector = function (arr) {
        var array = $.isArray(arr) ? arr : $.makeArray(arguments);
        this.update(array);
    };
    $.Vector.prototype = {
        app: function (f) {
            var i, newArr = [];
            for (i = 0; i < this.array.length; i++) {
                newArr.push(f(this.array[i], i));
            }
            return new $.Vector(newArr);
        },
        plus: function () {
            var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments), arr = this.array.slice(0), vec = new $.Vector();
            for (i = 0; i < args.length; i++) {
                arr[i] = (arr[i] ? arr[i] : 0) + args[i];
            }
            return vec.update(arr);
        },
        minus: function () {
            var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments), arr = this.array.slice(0), vec = new $.Vector();
            for (i = 0; i < args.length; i++) {
                arr[i] = (arr[i] ? arr[i] : 0) - args[i];
            }
            return vec.update(arr);
        },
        equals: function () {
            var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments), arr = this.array.slice(0), vec = new $.Vector();
            for (i = 0; i < args.length; i++) {
                if (arr[i] != args[i]) {
                    return null;
                }
            }
            return vec.update(arr);
        },
        x: getSetZero,
        left: getSetZero,
        width: getSetZero,
        y: getSetOne,
        top: getSetOne,
        height: getSetOne,
        toString: function () {
            return '(' + this.array.join(', ') + ')';
        },
        update: function (array) {
            var i;
            if (this.array) {
                for (i = 0; i < this.array.length; i++) {
                    delete this.array[i];
                }
            }
            this.array = array;
            for (i = 0; i < array.length; i++) {
                this[i] = this.array[i];
            }
            return this;
        }
    };
    $.Event.prototype.vector = function () {
        var touches = 'ontouchend' in document && this.originalEvent.changedTouches && this.originalEvent.changedTouches.length ? this.originalEvent.changedTouches[0] : this;
        if (this.originalEvent.synthetic) {
            var doc = document.documentElement, body = document.body;
            return new $.Vector(touches.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), touches.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
        } else {
            return new $.Vector(touches.pageX, touches.pageY);
        }
    };
    $.fn.offsetv = function () {
        if (this[0] == window) {
            return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
        } else {
            var offset = this.offset() || {};
            return new $.Vector(offset.left, offset.top);
        }
    };
    $.fn.dimensionsv = function (which) {
        if (this[0] == window || !which) {
            return new $.Vector(this.width(), this.height());
        } else {
            return new $.Vector(this[which + 'Width'](), this[which + 'Height']());
        }
    };
    return $;
});
/*jquerypp@2.0.0#event/livehack/livehack*/
define('jquerypp/event/livehack/livehack', ['jquery/jquery'], function ($) {
    var event = $.event, findHelper = function (events, types, callback, selector) {
            var t, type, typeHandlers, all, h, handle, namespaces, namespace, match;
            for (t = 0; t < types.length; t++) {
                type = types[t];
                all = type.indexOf('.') < 0;
                if (!all) {
                    namespaces = type.split('.');
                    type = namespaces.shift();
                    namespace = new RegExp('(^|\\.)' + namespaces.slice(0).sort().join('\\.(?:.*\\.)?') + '(\\.|$)');
                }
                typeHandlers = (events[type] || []).slice(0);
                for (h = 0; h < typeHandlers.length; h++) {
                    handle = typeHandlers[h];
                    match = all || namespace.test(handle.namespace);
                    if (match) {
                        if (selector) {
                            if (handle.selector === selector) {
                                callback(type, handle.origHandler || handle.handler);
                            }
                        } else if (selector === null) {
                            callback(type, handle.origHandler || handle.handler, handle.selector);
                        } else if (!handle.selector) {
                            callback(type, handle.origHandler || handle.handler);
                        }
                    }
                }
            }
        };
    event.find = function (el, types, selector) {
        var events = ($._data(el) || {}).events, handlers = [], t, liver, live;
        if (!events) {
            return handlers;
        }
        findHelper(events, types, function (type, handler) {
            handlers.push(handler);
        }, selector);
        return handlers;
    };
    event.findBySelector = function (el, types) {
        var events = $._data(el).events, selectors = {}, add = function (selector, event, handler) {
                var select = selectors[selector] || (selectors[selector] = {}), events = select[event] || (select[event] = []);
                events.push(handler);
            };
        if (!events) {
            return selectors;
        }
        findHelper(events, types, function (type, handler, selector) {
            add(selector || '', type, handler);
        }, null);
        return selectors;
    };
    event.supportTouch = 'ontouchend' in document;
    $.fn.respondsTo = function (events) {
        if (!this.length) {
            return false;
        } else {
            return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
        }
    };
    $.fn.triggerHandled = function (event, data) {
        event = typeof event == 'string' ? $.Event(event) : event;
        this.trigger(event, data);
        return event.handled;
    };
    event.setupHelper = function (types, startingEvent, onFirst) {
        if (!onFirst) {
            onFirst = startingEvent;
            startingEvent = null;
        }
        var add = function (handleObj) {
                var bySelector, selector = handleObj.selector || '', namespace = handleObj.namespace ? '.' + handleObj.namespace : '';
                if (selector) {
                    bySelector = event.find(this, types, selector);
                    if (!bySelector.length) {
                        $(this).delegate(selector, startingEvent + namespace, onFirst);
                    }
                } else {
                    if (!event.find(this, types, selector).length) {
                        event.add(this, startingEvent + namespace, onFirst, {
                            selector: selector,
                            delegate: this
                        });
                    }
                }
            }, remove = function (handleObj) {
                var bySelector, selector = handleObj.selector || '';
                if (selector) {
                    bySelector = event.find(this, types, selector);
                    if (!bySelector.length) {
                        $(this).undelegate(selector, startingEvent, onFirst);
                    }
                } else {
                    if (!event.find(this, types, selector).length) {
                        event.remove(this, startingEvent, onFirst, {
                            selector: selector,
                            delegate: this
                        });
                    }
                }
            };
        $.each(types, function () {
            event.special[this] = {
                add: add,
                remove: remove,
                setup: function () {
                },
                teardown: function () {
                }
            };
        });
    };
    return $;
});
/*jquerypp@2.0.0#event/reverse/reverse*/
define('jquerypp/event/reverse/reverse', ['jquery/jquery'], function ($) {
    $.event.reverse = function (name, attributes) {
        var bound = $(), count = 0, dispatch = $.event.handle || $.event.dispatch;
        $.event.special[name] = {
            setup: function () {
                if (this !== window) {
                    bound.push(this);
                    $.unique(bound);
                }
                return this !== window;
            },
            teardown: function () {
                bound = bound.not(this);
                return this !== window;
            },
            add: function (handleObj) {
                var origHandler = handleObj.handler;
                handleObj.origHandler = origHandler;
                handleObj.handler = function (ev, data) {
                    var isWindow = this === window;
                    if (attributes && attributes.handler) {
                        var result = attributes.handler.apply(this, arguments);
                        if (result === true) {
                            return;
                        }
                    }
                    if (count === 0) {
                        count++;
                        var where = data === false ? ev.target : this;
                        dispatch.call(where, ev, data);
                        if (ev.isPropagationStopped()) {
                            count--;
                            return;
                        }
                        var index = bound.index(this), length = bound.length, child, sub;
                        while (++index < length && (child = bound[index]) && (isWindow || $.contains(where, child))) {
                            dispatch.call(child, ev, data);
                            if (ev.isPropagationStopped()) {
                                while (++index < length && (sub = bound[index])) {
                                    if (!$.contains(child, sub)) {
                                        index--;
                                        break;
                                    }
                                }
                            }
                        }
                        ev.stopImmediatePropagation();
                        count--;
                    } else {
                        handleObj.origHandler.call(this, ev, data);
                    }
                };
            }
        };
        $([
            document,
            window
        ]).bind(name, function () {
        });
        return $.event.special[name];
    };
    return $;
});
/*jquerypp@2.0.0#event/drag/core/core*/
define('jquerypp/event/drag/core/core', [
    'jquery/jquery',
    'jquerypp/lang/vector/vector',
    'jquerypp/event/livehack/livehack',
    'jquerypp/event/reverse/reverse'
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
/*jquerypp@2.0.0#event/drag/step/step*/
define('jquerypp/event/drag/step/step', [
    'jquery/jquery',
    'jquerypp/event/drag/core/core'
], function ($) {
    var round = function (x, m) {
        return Math.round(x / m) * m;
    };
    $.Drag.prototype.step = function (amount, container, center) {
        if (typeof amount == 'number') {
            amount = {
                x: amount,
                y: amount
            };
        }
        container = container || $(document.body);
        this._step = amount;
        var styles = container.css([
                'borderTopWidth',
                'paddingTop',
                'borderLeftWidth',
                'paddingLeft'
            ]);
        var top = parseInt(styles.borderTopWidth) + parseInt(styles.paddingTop), left = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft);
        this._step.offset = container.offsetv().plus(left, top);
        this._step.center = center;
        return this;
    };
    (function () {
        var oldPosition = $.Drag.prototype.position;
        $.Drag.prototype.position = function (offsetPositionv) {
            if (this._step) {
                var step = this._step, center = step.center && step.center.toLowerCase(), movingSize = this.movingElement.dimensionsv('outer'), lot = step.offset.top() - (center && center != 'x' ? movingSize.height() / 2 : 0), lof = step.offset.left() - (center && center != 'y' ? movingSize.width() / 2 : 0);
                if (this._step.x) {
                    offsetPositionv.left(Math.round(lof + round(offsetPositionv.left() - lof, this._step.x)));
                }
                if (this._step.y) {
                    offsetPositionv.top(Math.round(lot + round(offsetPositionv.top() - lot, this._step.y)));
                }
            }
            oldPosition.call(this, offsetPositionv);
        };
    }());
    return $;
});
/*jquerypp@2.0.0#event/drag/limit/limit*/
define('jquerypp/event/drag/limit/limit', [
    'jquery/jquery',
    'jquerypp/event/drag/core/core'
], function ($) {
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
    return $;
});
/*jquerypp@2.0.0#event/drop/drop*/
define('jquerypp/event/drop/drop', [
    'jquery/jquery',
    'jquerypp/event/drag/core/core',
    'jquerypp/dom/within/within',
    'jquerypp/dom/compare/compare'
], function ($) {
    var event = $.event;
    var eventNames = [
            'dropover',
            'dropon',
            'dropout',
            'dropinit',
            'dropmove',
            'dropend'
        ];
    $.Drop = function (callbacks, element) {
        $.extend(this, callbacks);
        this.element = $(element);
    };
    $.each(eventNames, function () {
        event.special[this] = {
            add: function (handleObj) {
                var el = $(this), current = el.data('dropEventCount') || 0;
                el.data('dropEventCount', current + 1);
                if (current == 0) {
                    $.Drop.addElement(this);
                }
            },
            remove: function () {
                var el = $(this), current = el.data('dropEventCount') || 0;
                el.data('dropEventCount', current - 1);
                if (current <= 1) {
                    $.Drop.removeElement(this);
                }
            }
        };
    });
    $.extend($.Drop, {
        lowerName: 'drop',
        _rootElements: [],
        _elements: $(),
        last_active: [],
        endName: 'dropon',
        addElement: function (el) {
            for (var i = 0; i < this._rootElements.length; i++) {
                if (el == this._rootElements[i])
                    return;
            }
            this._rootElements.push(el);
        },
        removeElement: function (el) {
            for (var i = 0; i < this._rootElements.length; i++) {
                if (el == this._rootElements[i]) {
                    this._rootElements.splice(i, 1);
                    return;
                }
            }
        },
        sortByDeepestChild: function (a, b) {
            var compare = a.element.compare(b.element);
            if (compare & 16 || compare & 4)
                return 1;
            if (compare & 8 || compare & 2)
                return -1;
            return 0;
        },
        isAffected: function (point, moveable, responder) {
            return responder.element != moveable.element && responder.element.within(point[0], point[1], responder._cache).length == 1;
        },
        deactivate: function (responder, mover, event) {
            mover.out(event, responder);
            responder.callHandlers(this.lowerName + 'out', responder.element[0], event, mover);
        },
        activate: function (responder, mover, event) {
            mover.over(event, responder);
            responder.callHandlers(this.lowerName + 'over', responder.element[0], event, mover);
        },
        move: function (responder, mover, event) {
            responder.callHandlers(this.lowerName + 'move', responder.element[0], event, mover);
        },
        compile: function (event, drag) {
            if (!this.dragging && !drag) {
                return;
            } else if (!this.dragging) {
                this.dragging = drag;
                this.last_active = [];
            }
            var el, drops, selector, dropResponders, newEls = [], dragging = this.dragging;
            for (var i = 0; i < this._rootElements.length; i++) {
                el = this._rootElements[i];
                var drops = $.event.findBySelector(el, eventNames);
                for (selector in drops) {
                    dropResponders = selector ? jQuery(selector, el) : [el];
                    for (var e = 0; e < dropResponders.length; e++) {
                        if (this.addCallbacks(dropResponders[e], drops[selector], dragging)) {
                            newEls.push(dropResponders[e]);
                        }
                        ;
                    }
                }
            }
            this.add(newEls, event, dragging);
        },
        addCallbacks: function (el, callbacks, onlyNew) {
            var origData = $.data(el, '_dropData');
            if (!origData) {
                $.data(el, '_dropData', new $.Drop(callbacks, el));
                return true;
            } else if (!onlyNew) {
                var origCbs = origData;
                for (var eventName in callbacks) {
                    origCbs[eventName] = origCbs[eventName] ? origCbs[eventName].concat(callbacks[eventName]) : callbacks[eventName];
                }
                return false;
            }
        },
        add: function (newEls, event, drag, dragging) {
            var i = 0, drop;
            while (i < newEls.length) {
                drop = $.data(newEls[i], '_dropData');
                drop.callHandlers(this.lowerName + 'init', newEls[i], event, drag);
                if (drop._canceled) {
                    newEls.splice(i, 1);
                } else {
                    i++;
                }
            }
            this._elements.push.apply(this._elements, newEls);
        },
        show: function (point, moveable, event) {
            var element = moveable.element;
            if (!this._elements.length)
                return;
            var respondable, affected = [], propagate = true, i = 0, j, la, toBeActivated, aff, oldLastActive = this.last_active, responders = [], self = this, drag;
            while (i < this._elements.length) {
                drag = $.data(this._elements[i], '_dropData');
                if (!drag) {
                    this._elements.splice(i, 1);
                } else {
                    i++;
                    if (self.isAffected(point, moveable, drag)) {
                        affected.push(drag);
                    }
                }
            }
            affected.sort(this.sortByDeepestChild);
            event.stopRespondPropagate = function () {
                propagate = false;
            };
            toBeActivated = affected.slice();
            this.last_active = affected;
            for (j = 0; j < oldLastActive.length; j++) {
                la = oldLastActive[j];
                i = 0;
                while (aff = toBeActivated[i]) {
                    if (la == aff) {
                        toBeActivated.splice(i, 1);
                        break;
                    } else {
                        i++;
                    }
                }
                if (!aff) {
                    this.deactivate(la, moveable, event);
                }
                if (!propagate)
                    return;
            }
            for (var i = 0; i < toBeActivated.length; i++) {
                this.activate(toBeActivated[i], moveable, event);
                if (!propagate)
                    return;
            }
            for (i = 0; i < affected.length; i++) {
                this.move(affected[i], moveable, event);
                if (!propagate)
                    return;
            }
        },
        end: function (event, moveable) {
            var la, endName = this.lowerName + 'end', onEvent = $.Event(this.endName, event), dropData;
            for (var i = 0; i < this.last_active.length; i++) {
                la = this.last_active[i];
                if (this.isAffected(event.vector(), moveable, la) && la[this.endName]) {
                    la.callHandlers(this.endName, null, onEvent, moveable);
                }
                if (onEvent.isPropagationStopped()) {
                    break;
                }
            }
            for (var r = 0; r < this._elements.length; r++) {
                dropData = $.data(this._elements[r], '_dropData');
                dropData && dropData.callHandlers(endName, null, event, moveable);
            }
            this.clear();
        },
        clear: function () {
            this._elements.each(function () {
                $.removeData(this, '_dropData');
            });
            this._elements = $();
            delete this.dragging;
        }
    });
    $.Drag.responder = $.Drop;
    $.extend($.Drop.prototype, {
        callHandlers: function (method, el, ev, drag) {
            var length = this[method] ? this[method].length : 0;
            for (var i = 0; i < length; i++) {
                this[method][i].call(el || this.element[0], ev, this, drag);
            }
        },
        cache: function (value) {
            this._cache = value != null ? value : true;
        },
        cancel: function () {
            this._canceled = true;
        }
    });
    return $;
});
/*jquerypp@2.0.0#event/drag/scroll/scroll*/
define('jquerypp/event/drag/scroll/scroll', [
    'jquery/jquery',
    'jquerypp/event/drop/drop'
], function ($) {
    $.Drag.prototype.scrolls = function (elements, options) {
        var elements = $(elements);
        for (var i = 0; i < elements.length; i++) {
            this.constructor.responder._elements.push(elements.eq(i).data('_dropData', new $.Scrollable(elements[i], options))[0]);
        }
    }, $.Scrollable = function (element, options) {
        this.element = jQuery(element);
        this.options = $.extend({
            distance: 30,
            delta: function (diff, distance) {
                return (distance - diff) / 2;
            },
            direction: 'xy',
            delay: 15
        }, options);
        this.x = this.options.direction.indexOf('x') != -1;
        this.y = this.options.direction.indexOf('y') != -1;
    };
    $.extend($.Scrollable.prototype, {
        init: function (element) {
            this.element = jQuery(element);
        },
        callHandlers: function (method, el, ev, drag) {
            this[method](el || this.element[0], ev, this, drag);
        },
        dropover: function () {
        },
        dropon: function () {
            this.clear_timeout();
        },
        dropout: function () {
            this.clear_timeout();
        },
        dropinit: function () {
        },
        dropend: function () {
        },
        clear_timeout: function () {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        },
        distance: function (diff) {
            return (30 - diff) / 2;
        },
        dropmove: function (el, ev, drop, drag) {
            this.clear_timeout();
            var mouse = ev.vector(), location_object = $(el == document.documentElement ? window : el), dimensions = location_object.dimensionsv('outer'), position = location_object.offsetv(), bottom = position.y() + dimensions.y() - mouse.y(), top = mouse.y() - position.y(), right = position.x() + dimensions.x() - mouse.x(), left = mouse.x() - position.x(), dx = 0, dy = 0, distance = this.options.distance;
            if (bottom < distance && this.y) {
                dy = this.options.delta(bottom, distance);
            } else if (top < distance && this.y) {
                dy = -this.options.delta(top, distance);
            }
            if (right < distance && this.options && this.x) {
                dx = this.options.delta(right, distance);
            } else if (left < distance && this.x) {
                dx = -this.options.delta(left, distance);
            }
            if (dx || dy) {
                var self = this;
                this.interval = setTimeout(function () {
                    self.move($(el), drag.movingElement, dx, dy, ev, ev.clientX, ev.clientY, ev.screenX, ev.screenY);
                }, this.options.delay);
            }
        },
        move: function (scroll_element, drag_element, dx, dy, ev) {
            scroll_element.scrollTop(scroll_element.scrollTop() + dy);
            scroll_element.scrollLeft(scroll_element.scrollLeft() + dx);
            drag_element.trigger($.event.fix({
                type: 'mousemove',
                clientX: ev.clientX,
                clientY: ev.clientY,
                screenX: ev.screenX,
                screenY: ev.screenY,
                pageX: ev.pageX,
                pageY: ev.pageY
            }));
        }
    });
    return $;
});
/*jquerypp@2.0.0#event/drag/drag*/
define('jquerypp/event/drag/drag', [
    'jquery/jquery',
    'jquerypp/event/drag/core/core',
    'jquerypp/event/drag/step/step',
    'jquerypp/event/drag/limit/limit',
    'jquerypp/event/drag/scroll/scroll'
], function ($) {
    return $;
});
/*jquerypp@2.0.0#event/hover/hover*/
define('jquerypp/event/hover/hover', [
    'jquery/jquery',
    'jquerypp/event/livehack/livehack'
], function ($) {
    $.Hover = function () {
        this._delay = $.Hover.delay;
        this._distance = $.Hover.distance;
        this._leave = $.Hover.leave;
    };
    $.extend($.Hover, {
        delay: 100,
        distance: 10,
        leave: 0
    });
    $.extend($.Hover.prototype, {
        delay: function (delay) {
            this._delay = delay;
            return this;
        },
        distance: function (distance) {
            this._distance = distance;
            return this;
        },
        leave: function (leave) {
            this._leave = leave;
            return this;
        }
    });
    var event = $.event, handle = event.handle, onmouseenter = function (ev) {
            var delegate = ev.delegateTarget || ev.currentTarget;
            var selector = ev.handleObj.selector;
            var pending = $.data(delegate, '_hover' + selector);
            if (pending) {
                if (!pending.forcing) {
                    pending.forcing = true;
                    clearTimeout(pending.leaveTimer);
                    var leaveTime = pending.leaving ? Math.max(0, pending.hover.leave - (new Date() - pending.leaving)) : pending.hover.leave;
                    var self = this;
                    setTimeout(function () {
                        pending.callHoverLeave();
                        onmouseenter.call(self, ev);
                    }, leaveTime);
                }
                return;
            }
            var loc = {
                    pageX: ev.pageX,
                    pageY: ev.pageY
                }, dist = 0, timer, enteredEl = this, hovered = false, lastEv = ev, hover = new $.Hover(), leaveTimer, callHoverLeave = function () {
                    $.each(event.find(delegate, ['hoverleave'], selector), function () {
                        this.call(enteredEl, ev, hover);
                    });
                    cleanUp();
                }, mousemove = function (ev) {
                    clearTimeout(leaveTimer);
                    dist += Math.pow(ev.pageX - loc.pageX, 2) + Math.pow(ev.pageY - loc.pageY, 2);
                    loc = {
                        pageX: ev.pageX,
                        pageY: ev.pageY
                    };
                    lastEv = ev;
                }, mouseleave = function (ev) {
                    clearTimeout(timer);
                    if (hovered) {
                        if (hover._leave === 0) {
                            callHoverLeave();
                        } else {
                            clearTimeout(leaveTimer);
                            pending.leaving = new Date();
                            leaveTimer = pending.leaveTimer = setTimeout(function () {
                                callHoverLeave();
                            }, hover._leave);
                        }
                    } else {
                        cleanUp();
                    }
                }, cleanUp = function () {
                    $(enteredEl).unbind('mouseleave', mouseleave);
                    $(enteredEl).unbind('mousemove', mousemove);
                    $.removeData(delegate, '_hover' + selector);
                }, hoverenter = function () {
                    $.each(event.find(delegate, ['hoverenter'], selector), function () {
                        this.call(enteredEl, lastEv, hover);
                    });
                    hovered = true;
                };
            pending = {
                callHoverLeave: callHoverLeave,
                hover: hover
            };
            $.data(delegate, '_hover' + selector, pending);
            $(enteredEl).bind('mousemove', mousemove).bind('mouseleave', mouseleave);
            $.each(event.find(delegate, ['hoverinit'], selector), function () {
                this.call(enteredEl, ev, hover);
            });
            if (hover._delay === 0) {
                hoverenter();
            } else {
                timer = setTimeout(function () {
                    if (dist < hover._distance && $(enteredEl).queue().length == 0) {
                        hoverenter();
                        return;
                    } else {
                        dist = 0;
                        timer = setTimeout(arguments.callee, hover._delay);
                    }
                }, hover._delay);
            }
        };
    event.setupHelper([
        'hoverinit',
        'hoverenter',
        'hoverleave',
        'hovermove'
    ], 'mouseenter', onmouseenter);
    return $;
});
/*jquerypp@2.0.0#event/key/key*/
define('jquerypp/event/key/key', ['jquery/jquery'], function ($) {
    var uaMatch = function (ua) {
        ua = ua.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    };
    var keymap = {}, reverseKeyMap = {}, currentBrowser = uaMatch(navigator.userAgent).browser;
    $.event.key = function (browser, map) {
        if (browser === undefined) {
            return keymap;
        }
        if (map === undefined) {
            map = browser;
            browser = currentBrowser;
        }
        if (!keymap[browser]) {
            keymap[browser] = {};
        }
        $.extend(keymap[browser], map);
        if (!reverseKeyMap[browser]) {
            reverseKeyMap[browser] = {};
        }
        for (var name in map) {
            reverseKeyMap[browser][map[name]] = name;
        }
    };
    $.event.key({
        '\b': '8',
        '\t': '9',
        '\r': '13',
        'shift': '16',
        'ctrl': '17',
        'alt': '18',
        'pause-break': '19',
        'caps': '20',
        'escape': '27',
        'num-lock': '144',
        'scroll-lock': '145',
        'print': '44',
        'page-up': '33',
        'page-down': '34',
        'end': '35',
        'home': '36',
        'left': '37',
        'up': '38',
        'right': '39',
        'down': '40',
        'insert': '45',
        'delete': '46',
        ' ': '32',
        '0': '48',
        '1': '49',
        '2': '50',
        '3': '51',
        '4': '52',
        '5': '53',
        '6': '54',
        '7': '55',
        '8': '56',
        '9': '57',
        'a': '65',
        'b': '66',
        'c': '67',
        'd': '68',
        'e': '69',
        'f': '70',
        'g': '71',
        'h': '72',
        'i': '73',
        'j': '74',
        'k': '75',
        'l': '76',
        'm': '77',
        'n': '78',
        'o': '79',
        'p': '80',
        'q': '81',
        'r': '82',
        's': '83',
        't': '84',
        'u': '85',
        'v': '86',
        'w': '87',
        'x': '88',
        'y': '89',
        'z': '90',
        'num0': '96',
        'num1': '97',
        'num2': '98',
        'num3': '99',
        'num4': '100',
        'num5': '101',
        'num6': '102',
        'num7': '103',
        'num8': '104',
        'num9': '105',
        '*': '106',
        '+': '107',
        '-': '109',
        '.': '110',
        '/': '111',
        ';': '186',
        '=': '187',
        ',': '188',
        '-': '189',
        '.': '190',
        '/': '191',
        '`': '192',
        '[': '219',
        '\\': '220',
        ']': '221',
        '\'': '222',
        'left window key': '91',
        'right window key': '92',
        'select key': '93',
        'f1': '112',
        'f2': '113',
        'f3': '114',
        'f4': '115',
        'f5': '116',
        'f6': '117',
        'f7': '118',
        'f8': '119',
        'f9': '120',
        'f10': '121',
        'f11': '122',
        'f12': '123'
    });
    $.Event.prototype.keyName = function () {
        var event = this, test = /\w/, key_Key = reverseKeyMap[currentBrowser][(event.keyCode || event.which) + ''], char_Key = String.fromCharCode(event.keyCode || event.which), key_Char = event.charCode && reverseKeyMap[currentBrowser][event.charCode + ''], char_Char = event.charCode && String.fromCharCode(event.charCode);
        if (char_Char && test.test(char_Char)) {
            return char_Char.toLowerCase();
        }
        if (key_Char && test.test(key_Char)) {
            return char_Char.toLowerCase();
        }
        if (char_Key && test.test(char_Key)) {
            return char_Key.toLowerCase();
        }
        if (key_Key && test.test(key_Key)) {
            return key_Key.toLowerCase();
        }
        if (event.type == 'keypress') {
            return event.keyCode ? String.fromCharCode(event.keyCode) : String.fromCharCode(event.which);
        }
        if (!event.keyCode && event.which) {
            return String.fromCharCode(event.which);
        }
        return reverseKeyMap[currentBrowser][event.keyCode + ''];
    };
    return $;
});
/*jquerypp@2.0.0#event/default/default*/
define('jquerypp/event/default/default', ['jquery/jquery'], function ($) {
    $.fn.triggerAsync = function (type, data, success, prevented) {
        if (typeof data == 'function') {
            prevented = success;
            success = data;
            data = undefined;
        }
        if (this.length) {
            var el = this;
            setTimeout(function () {
                el.trigger({
                    type: type,
                    _success: success,
                    _prevented: prevented
                }, data);
            }, 0);
        } else {
            if (success)
                success.call(this);
        }
        return this;
    };
    var types = {}, rnamespaces = /\.(.*)$/, $event = $.event;
    $event.special['default'] = {
        add: function (handleObj) {
            types[handleObj.namespace.replace(rnamespaces, '')] = true;
        },
        setup: function () {
            return true;
        }
    };
    var oldTrigger = $event.trigger;
    $event.trigger = function defaultTriggerer(event, data, elem, onlyHandlers) {
        var type = event.type || event, event = typeof event === 'object' ? event[$.expando] ? event : new $.Event(type, event) : new $.Event(type), res = oldTrigger.call($.event, event, data, elem, onlyHandlers), paused = event.isPaused && event.isPaused();
        if (!onlyHandlers && !event.isDefaultPrevented() && event.type.indexOf('default') !== 0) {
            oldTrigger('default.' + event.type, data, elem);
            if (event._success) {
                event._success(event);
            }
        }
        if (!onlyHandlers && event.isDefaultPrevented() && event.type.indexOf('default') !== 0 && !paused) {
            if (event._prevented) {
                event._prevented(event);
            }
        }
        if (paused) {
            event.isDefaultPrevented = event.pausedState.isDefaultPrevented;
            event.isPropagationStopped = event.pausedState.isPropagationStopped;
        }
        return res;
    };
    return $;
});
/*jquerypp@2.0.0#event/pause/pause*/
define('jquerypp/event/pause/pause', [
    'jquery/jquery',
    'jquerypp/event/default/default'
], function ($) {
    var current, rnamespaces = /\.(.*)$/, returnFalse = function () {
            return false;
        }, returnTrue = function () {
            return true;
        };
    $.Event.prototype.isPaused = returnFalse;
    $.Event.prototype.pause = function () {
        this.pausedState = {
            isDefaultPrevented: this.isDefaultPrevented() ? returnTrue : returnFalse,
            isPropagationStopped: this.isPropagationStopped() ? returnTrue : returnFalse
        };
        this.stopImmediatePropagation();
        this.preventDefault();
        this.isPaused = returnTrue;
    };
    $.Event.prototype.resume = function () {
        var handleObj = this.handleObj, currentTarget = this.currentTarget;
        var origType = $.event.special[handleObj.origType], origHandle = origType && origType.handle;
        if (!origType) {
            $.event.special[handleObj.origType] = {};
        }
        $.event.special[handleObj.origType].handle = function (ev) {
            if (ev.handleObj === handleObj && ev.currentTarget === currentTarget) {
                if (!origType) {
                    delete $.event.special[handleObj.origType];
                } else {
                    $.event.special[handleObj.origType].handle = origHandle;
                }
            }
        };
        delete this.pausedState;
        this.isPaused = this.isImmediatePropagationStopped = returnFalse;
        if (!this.isPropagationStopped()) {
            $.event.trigger(this, [], this.target);
        }
    };
    return $;
});
/*jquerypp@2.0.0#event/removed/removed*/
define('jquerypp/event/removed/removed', ['jquery/jquery'], function ($) {
    var oldClean = $.cleanData;
    $.cleanData = function (elems) {
        for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            $(elem).triggerHandler('removed');
        }
        oldClean(elems);
    };
    return $;
});
/*jquerypp@2.0.0#event/resize/resize*/
define('jquerypp/event/resize/resize', ['jquerypp/event/reverse/reverse'], function ($) {
    var win = $(window), windowWidth = 0, windowHeight = 0, timer;
    $(function () {
        windowWidth = win.width();
        windowHeight = win.height();
    });
    $.event.reverse('resize', {
        handler: function (ev, data) {
            var isWindow = this === window;
            if (isWindow && ev.originalEvent) {
                var width = win.width(), height = win.height();
                if (width != windowWidth || height != windowHeight) {
                    windowWidth = width;
                    windowHeight = height;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        win.trigger('resize');
                    }, 1);
                }
                return true;
            }
        }
    });
    return $;
});
/*jquerypp@2.0.0#event/swipe/swipe*/
define('jquerypp/event/swipe/swipe', [
    'jquery/jquery',
    'jquerypp/event/livehack/livehack'
], function ($) {
    var isPhantom = /Phantom/.test(navigator.userAgent), supportTouch = !isPhantom && 'ontouchend' in document, scrollEvent = 'touchmove scroll', touchStartEvent = supportTouch ? 'touchstart' : 'mousedown', touchStopEvent = supportTouch ? 'touchend' : 'mouseup', touchMoveEvent = supportTouch ? 'touchmove' : 'mousemove', data = function (event) {
            var d = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            return {
                time: new Date().getTime(),
                coords: [
                    d.clientX,
                    d.clientY
                ],
                origin: $(event.target)
            };
        };
    var swipe = $.event.swipe = {
            delay: 500,
            max: 320,
            min: 30
        };
    $.event.setupHelper([
        'swipe',
        'swipeleft',
        'swiperight',
        'swipeup',
        'swipedown'
    ], touchStartEvent, function (ev) {
        var start = data(ev), stop, delegate = ev.delegateTarget || ev.currentTarget, selector = ev.handleObj.selector, entered = this;
        function moveHandler(event) {
            if (!start) {
                return;
            }
            stop = data(event);
            if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
                event.preventDefault();
            }
        }
        ;
        $(document.documentElement).bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
            $(this).unbind(touchMoveEvent, moveHandler);
            if (start && stop) {
                var deltaX = Math.abs(start.coords[0] - stop.coords[0]), deltaY = Math.abs(start.coords[1] - stop.coords[1]), distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (stop.time - start.time < swipe.delay && distance >= swipe.min && distance <= swipe.max) {
                    var events = ['swipe'];
                    if (deltaX >= swipe.min && deltaY < swipe.min) {
                        events.push(start.coords[0] > stop.coords[0] ? 'swipeleft' : 'swiperight');
                    } else if (deltaY >= swipe.min && deltaX < swipe.min) {
                        events.push(start.coords[1] < stop.coords[1] ? 'swipedown' : 'swipeup');
                    }
                    $.each($.event.find(delegate, events, selector), function () {
                        this.call(entered, ev, {
                            start: start,
                            end: stop
                        });
                    });
                }
            }
            start = stop = undefined;
        });
    });
    return $;
});
/*jquerypp@2.0.0#index*/
define('jquerypp', [
    'jquery/jquery',
    'jquerypp/dom/animate/animate',
    'jquerypp/dom/compare/compare',
    'jquerypp/dom/cookie/cookie',
    'jquerypp/dom/form_params/form_params',
    'jquerypp/dom/range/range',
    'jquerypp/dom/selection/selection',
    'jquerypp/dom/within/within',
    'jquerypp/event/drag/drag',
    'jquerypp/event/drop/drop',
    'jquerypp/event/hover/hover',
    'jquerypp/event/key/key',
    'jquerypp/event/pause/pause',
    'jquerypp/event/removed/removed',
    'jquerypp/event/resize/resize',
    'jquerypp/event/swipe/swipe',
    'jquerypp/lang/vector/vector'
], function ($) {
    return $;
});
/*[global-shim-end]*/
(function (){
	window._define = window.define;
	window.define = window.define.orig;
	window.System = window.System.orig;
})();