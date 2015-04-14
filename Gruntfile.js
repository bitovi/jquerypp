var path = require('path');
var normalize = function(depName, depLoad, curName, curLoad) {
	depName = depName.substring(depName.indexOf('#') + 1, depName.length);

	if(depName === 'dist/jquery') {
		return 'jquery';
	}

	if(curLoad) {
		depName = path.relative(path.dirname(curLoad.address), depLoad.address);
		if(depName[0] !== '.') {
			depName = './' + depName;
		}
	}

	return depName;
};

module.exports = function (grunt) {
	var _ = grunt.util._;
	var builderJSON = grunt.file.readJSON('builder.json');
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
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
					main: "jquerypp"
				},
				outputs: {
					"cjs": {
						graphs: ['jquerypp'],
						format: 'cjs',
						useNormalizedDependencies: true,
						ignore: ['jquery'],
						normalize: normalize,
						dest: function(moduleName){
							return path.join(__dirname, 'dist/cjs/' + normalize(moduleName) + '.js');
						}
					},
					"amd": {
						graphs: ['jquerypp'],
						format: 'amd',
						useNormalizedDependencies: true,
						ignore: ['jquery'],
						normalize: normalize,
						dest: function(moduleName){
							return path.join(__dirname, 'dist/amd/' + normalize(moduleName) + '.js');
						}
					},
					"+global-js": {
						ignore: ['jquery'],
						exports: { 'jquery/jquery': 'jQuery' }
					},
					'min +global-js': {
						minify: true,
						dest: path.join(__dirname, 'dist/global/jquerypp.min.js')
					}
				}
			}
		},

		usebanner: {
			taskName: {
				options: {
					position: 'top',
					banner: _.template(builderJSON.banner, {
						pkg: pkg,
						ids: [ 'jQuery++ dist build' ]
					}),
					linebreak: true
				},
				files: {
					src: [ 'dist/**/*.js' ]
				}
			}
		},

		testee: {
			options: {
				browsers: [ 'firefox' ]
			},
			all: ['test.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('testee');
	grunt.loadNpmTasks('steal-tools');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('test', ['testee']);
	grunt.registerTask('build', ['steal-export', 'usebanner']);
};
