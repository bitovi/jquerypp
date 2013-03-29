module.exports = function (grunt) {

	var _ = grunt.util._;
	var outFiles = {
		edge : '<%= meta.out %>/edge/**/*.js',
		latest : '<%= meta.out %>/<%= pkg.version %>/**/*.js'
	};
	var shellOpts = {
		stdout : true,
		failOnError : true
	};

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		meta : {
			out : "dist/",
			beautifier : {
				options : {
					indentSize : 1,
					indentChar : "\t"
				},
				exclude : [/\.min\./, /qunit\.js/]
			},
			banner : '/*!\n* <%= pkg.title || pkg.name %> - <%= pkg.version %> ' +
				'(<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n*/'
		},
		beautifier : {
			codebase : '<%= meta.beautifier %>',
			dist : '<%= meta.beautifier %>'
		},
		beautify : {
			codebase : [
				'dom/**/*.js',
				'event/**/*.js',
				'lang/**/*.js'
			],
			dist : '<%= meta.out %>/**/*.js'
		},
		build : {
			edge : {
				src : "jquerypp/build/build.js",
				out : 'jquerypp/<%= meta.out %>'
			},
			latest : {
				src : 'jquerypp/build/build.js',
				version : '<%= pkg.version %>',
				out : 'jquerypp/<%= meta.out %>'
			}
		},
		shell : {
			makeSteal : {
				command : 'rm -rf mkdir <%= meta.out %>/<%= pkg.version %>/steal && mkdir <%= meta.out %>/<%= pkg.version %>/steal && git archive HEAD | tar -x -C <%= meta.out %>/<%= pkg.version %>/steal',
				options : shellOpts
			},

			bundleLatest : {
				command : 'cd <%= meta.out %> && zip -r jquerypp-<%= pkg.version %>.zip <%= pkg.version %>/',
				options : shellOpts
			},

			getGhPages : {
				command : 'git clone -b gh-pages <%= pkg.repository.url %> build/gh-pages',
				options : shellOpts
			},

			copyLatest : {
				command : 'rm -rf build/gh-pages/release/<%= pkg.version %> && ' +
				'cp -R <%= meta.out %>/<%= pkg.version %> build/gh-pages/release/<%= pkg.version %> && ' +
				'cp <%= meta.out %>/jquerypp-<%= pkg.version %>.zip build/gh-pages/downloads/ &&' +
				'rm -rf build/gh-pages/release/latest && ' +
				'cp -R <%= meta.out %>/<%= pkg.version %> build/gh-pages/release/latest',
				options : shellOpts
			},

			copyEdge : {
				command : 'rm -rf build/gh-pages/release/edge && ' +
				'cp -R <%= meta.out %>/edge build/gh-pages/release/edge',
				options : shellOpts
			},

			updateGhPages : {
				command : 'cd build/gh-pages && git add . --all && git commit -m "Updating release (latest: <%= pkg.version %>)" && ' +
				'git push origin',
				options : shellOpts
			},

			cleanup : {
				command : 'rm -rf build/gh-pages',
				options : shellOpts
			}
		},

		bannerize : {
			latest : {
				files : '<%= meta.out %>/<%= pkg.version %>/**/*.js',
				banner : '<%= meta.banner %>'
			}
		},

		docco : {
			edge : {
				src : '<%= meta.out %>/edge/raw/**/*.js',
				docco : {
					output : '<%= meta.out %>/edge/docs'
				}
			},
			latest : {
				src : '<%= meta.out %>/<%= pkg.version %>/**/*.js',
				docco : {
					output : '<%= meta.out %>/<%= pkg.version %>/docs'
				}
			},
			_options : {
				exclude : [/\.min\./, /steal\//, /amd\//]
			}
		},

		'string-replace' : {
			dist: {
				files: '<%= meta.out %>/<%= pkg.version %>/**/*.js',
				options: {
					replacements: [{
						pattern: /\/\*([\s\S]*?)\*\//gim, // multiline comments
						replacement: ''
					}, {
						pattern: /\/\/(\s*)\n/gim,
						replacement: ''
					}, {
						pattern: /;[\s]*;/gim, // double ;;
						replacement: ';'
					}, {
						pattern: /(\/\/.*)\n[\s]*;/gi,
						replacement: '$1'
					}, {
						pattern: /(\n){3,}/gim, //single new lines
						replacement: '\n\n'
					}]
				}
			}
		}
	});

	grunt.loadTasks("../build/tasks");

	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-shell');

	// grunt.registerTask('edge', 'build:edge strip:edge beautify:dist bannerize:edge');
	grunt.registerTask('latest', ['build:latest', 'string-replace', 'beautify:dist', 'docco:latest', 'bannerize:latest', 'shell:makeSteal', 'shell:bundleLatest']);
	grunt.registerTask('ghpages', ['shell:cleanup', 'shell:getGhPages', 'shell:copyLatest', 'shell:updateGhPages', 'shell:cleanup']);
	grunt.registerTask('deploy', ['latest', 'ghpages']);
};
