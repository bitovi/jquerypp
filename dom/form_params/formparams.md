@page jQuery.formParams
@parent jquerypp

Returns an object of name-value pairs that represents values in a form.  
It is able to nest values whose element's name has square brackets.

When convert is set to true strings that represent numbers and booleans will
be converted and empty string will not be added to the object. 

Example html:

	<form>
      <input type="text" name="first" value="John" />
      <input type="text" name="last" value="Doe" />
      <input type="text" name="phone[mobile]" value="1234567890" />
      <input type="text" name="phone[home]" value="0987654321" />
    </form>

Example code:

	$('form').formParams()
	// -> {
	//   first : "John", last : "Doe",
	//   phone : { mobile : "1234567890", home : "0987654321" }
	// }

@demo jquery/dom/form_params/form_params.html

