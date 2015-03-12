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

		testee: {
			all: ['test.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('testee');

	grunt.registerTask('test', ['testee'])
};
