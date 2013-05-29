@function jQuery.animate jQuery.animate
@parent jquerypp

@signature `jQuery(element).animate(options)`

Animate CSS properties using native CSS animations, if possible.
Uses the original [$.fn.animate()](http://api.jquery.com/animate/) otherwise.

@param {Object} props The CSS properties to animate
@param {Integer|String|Object} [speed=400] The animation duration in ms.
Will use $.fn.animate if a string or object is passed
@param {Function} [callback] A callback to execute once the animation is complete
@return {jQuery} The jQuery element

@body

`jQuery.animate` overwrites `[jQuery.fn.animate jQuery.fn.animate(properties, duration, callback)]`
and enables it to animate properties using CSS 3 animations, if supported.
If the browser doesn't support CSS animations, the original [jQuery.fn.animate()](http://api.jquery.com/animate/) will be used.

Using browser CSS animations, which can make use of hardware acceleration,
can improve your application performance especially on mobile devices (like the Webkit based
default browsers for iPhone, iPad and Android devices).

## Compatibility

`jQuery.fn.animate` is mostly compatible with the original [jQuery.fn.animate()](http://api.jquery.com/animate/)
which will be used as a fallback when

- The browser doesn't support CSS transitions
- A property is set to `show` or `hide` which is used by jQuery internally to set the original property
- The properties are empty
- The elements are not DOM nodes (e.g. created with `$({ test : 'object' })`)
- The element is displayed `inline`

## Example

The following example creates a fade-in effect using CSS animations:

    $('#element').css({
      opacity : 0
    }).animate({
      opacity : 1
    }, 1000, function() {
      console.log('Animation done');
    });

If you want to force a jQuery animation pass the `jquery` option. The animation callback gets passed `true` if
the animation has been done using CSS animations:

    $('#element').css({
      opacity : 0,
      jquery : true
    }).animate({
      opacity : 1
    }, 1000, function(usedCss) {
      console.log('Animation done');
      if(!usedCss) {
        console.log('Used jQuery animation');
      }
    });
