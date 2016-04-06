/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/animate/animate*/
define(['jquery'], function ($) {
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
                            transitionEnd: 'transitionend',
                            prefix: ''
                        },
                        'MozTransition': {
                            transitionEnd: 'animationend',
                            prefix: '-moz-'
                        },
                        'WebkitTransition': {
                            transitionEnd: 'webkitTransitionEnd',
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
            if (getBrowser().prefix === '-moz-' || /Edge\/\d+/.test(navigator.userAgent)) {
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