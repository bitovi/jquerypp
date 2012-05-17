@page jQuery.formParams
@parent jquerypp

`$.fn.formParams` returns an object of name-value pairs that represents values in a form.
It is able to nest values use a square bracket notation in the element name.

When convert is set to `true` strings that represent numbers and booleans will
be converted and empty strings will not be added to the object.

## Example

A form like this:

    <form>
      <input type="text" name="name[first]" value="John" />
      <input type="text" name="name[middle]" value="" />
      <input type="text" name="name[last]" value="Doe" />
      <input type="text" name="age" value="42" />
    </form>

Will return a JavaScript object like this:

    $('form').formParams()
    // -> {
    //   name : { first : "John", middle : "", last : "Doe" },
    //   age : "42"
    // }

With *convert* set to `true` it will look like this:

    $('form').formParams(true)
    // -> {
    //   name : { first : "John", last : "Doe" },
    //   age : 42
    // }

It is also possible to set the form values by passing an object to `$.fn.formParams`:

    $('form').formParams({
      name : {
        first : 'Mike'
      },
      age : 23
    });

## Demo

@demo jquery/dom/form_params/form_params.html

