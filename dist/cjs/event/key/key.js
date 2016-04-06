/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#event/key/key*/
var $ = require('jquery');
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
module.exports = $;