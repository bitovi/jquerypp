/*!
 * jQuery++ - 2.0.2
 * http://jquerypp.com
 * Copyright (c) 2016 Bitovi
 * Wed, 06 Apr 2016 00:03:57 GMT
 * Licensed MIT
 */

/*jquerypp@2.0.2#dom/form_params/form_params*/
var $ = require('jquery');
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
module.exports = $;