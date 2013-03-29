steal('jquerypp/view/ejs', 'jquerypp/view/tmpl')
	.then('./views/relative.ejs',
	 	  'jquerypp/view/test/compression/views/absolute.ejs',
		  './views/tmplTest.tmpl',
		  './views/test.ejs',
		function(){

	 	$(document).ready(function(){
	 		$("#target").append('//jquerypp/view/test/compression/views/relative.ejs', {})
	 					.append($.View('//jquerypp/view/test/compression/views/absolute.ejs', {} ))
	 					.append($.View('//jquerypp/view/test/compression/views/tmplTest.tmpl', {message: "Jquery Tmpl"} ))
		})
	 })
