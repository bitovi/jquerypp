//we probably have to have this only describing where the tests are
steal("jquerypp/model","jquerypp/dom/fixture")  //load your app
 .then('funcunit/qunit')  //load qunit
 .then("./model_test.js")//,"./associations_test.js")
 .then(
	"jquerypp/model/backup/qunit",
	"jquerypp/model/list/list_test.js"
  )
  .then("jquerypp/model/validations/qunit/validations_test.js")
