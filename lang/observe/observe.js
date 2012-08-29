steal('jquery', 'can/util','can/observe').then(function($, can) {
 $.Observe = can.Observe;
 $.Observe.prototype.attrs = $.Observe.prototype.attr;
});
