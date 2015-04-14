module.exports = function (grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			lib: [
				'dom/**/*.js', 'event/**/*.js', 'lang/**/*.js', 'test/**/*.js'
			]
		},

		'steal-export': {
			dist: {
				system: {
					config: "package.json!npm",
					main: ["jquerypp"]
				},
				outputs: {
					"+cjs": {},
					"+amd": {}
					// "global-js": {}
				}
			}
		},

		testee: {
			all: ['test.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('testee');
	grunt.loadNpmTasks('steal-tools');

	grunt.registerTask('test', ['testee']);
	grunt.registerTask('build', ['steal-export']);
};
