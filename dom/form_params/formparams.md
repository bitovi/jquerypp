@page jQuery.formParams
@parent jquerypp

@plugin jquery/dom/form_params
@test jquery/dom/form_params/qunit.html

Returns an object of name-value pairs that represents values in a form.  
It is able to nest values whose element's name has square brackets.

When convert is set to true strings that represent numbers and booleans will
be converted and empty string will not be added to the object. 

Example html:
@codestart html
&lt;form>
  &lt;input name="foo[bar]" value='2'/>
  &lt;input name="foo[ced]" value='4'/>
&lt;form/>
@codeend
Example code:

    $('form').formParams() //-> { foo:{bar:'2', ced: '4'} }

@demo jquery/dom/form_params/form_params.html

@param {Object} [params] If an object is passed, the form will be repopulated
with the values of the object based on the name of the inputs within
the form
@param {Boolean} [convert=false] True if strings that look like numbers 
and booleans should be converted and if empty string should not be added 
to the result. Defaults to false.
@return {Object} An object of name-value pairs.
