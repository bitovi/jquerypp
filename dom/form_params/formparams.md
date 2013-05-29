@page jQuery.formParams jQuery.formParams
@parent jquerypp
@signature `jQuery(el).formParams([convert])`

`jQuery.formParams` adds `[jQuery.fn.formParams jQuery.fn.formParams(convert)]` which serializes a form into a JavaScript object. It creates nested objects by using bracket notation in the form element name.

@param {Boolean} [convert=false]

If *convert* is `true`, values that look like numbers or booleans will be converted and empty strings won't be added to the object. For a form like this:

    <form>
      <input type="text" name="first" value="John" />
      <input type="text" name="last" value="Doe" />
      <input type="text" name="phone[mobile]" value="1234567890" />
      <input type="text" name="phone[home]" value="0987654321" />
    </form>

@return {Object} returns an object with the form's element names and values:

    $('form').formParams()
    // -> {
    //   first : "John", last : "Doe",
    //   phone : { mobile : "1234567890", home : "0987654321" }
    // }

@signature `jQuery(el).formParams(values)`

@param {Object} values

It is also possible to set form values by passing an object:

    $('form').formParams({
      first : 'Mike',
      last : 'Smith'
    });

## Demo

@demo jquerypp/dom/form_params/form_params.html 350
