module.exports = function (grunt) {
	var _ = grunt.utils._;
	var outFiles = {
		edge : '<%= meta.out %>/edge/**/*.js',
		latest : '<%= meta.out %>/<%= pkg.version %>/**/*.js'
	};
	var withExclude = _.extend({
		_options : {
			exclude : [/steal\//, /\.min\./, /qunit\.js/]
		}
	}, outFiles);

	grunt.initConfig({
		pkg : '<json:package.json>',
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
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n*/'
		},
		beautifier : {
			codebase : '<config:meta.beautifier>',
			dist : '<config:meta.beautifier>'
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
				src : "jquery/build/build.js",
				out : 'jquery/<%= meta.out %>'
			},
			latest : {
				src : "jquery/build/build.js",
				version : '<%= pkg.version %>',
				out : 'jquery/<%= meta.out %>'
			}
		},
		shell : {
			makeSteal: 'rm -rf mkdir <%= meta.out %>/<%= pkg.version %>/steal && mkdir <%= meta.out %>/<%= pkg.version %>/steal && git archive HEAD | tar -x -C <%= meta.out %>/<%= pkg.version %>/steal',
			bundleLatest : 'cd <%= meta.out %> && zip -r jquerypp-<%= pkg.version %>.zip <%= pkg.version %>/',
			getGhPages : 'git clone -b gh-pages <%= pkg.repository.url %> build/gh-pages',
			copyLatest : 'rm -rf build/gh-pages/release/<%= pkg.version %> && ' +
				'cp -R <%= meta.out %>/<%= pkg.version %> build/gh-pages/release/<%= pkg.version %> && ' +
				'cp <%= meta.out %>/jquerypp-<%= pkg.version %>.zip build/gh-pages/downloads/ &&' +
				'rm -rf build/gh-pages/release/latest && ' +
				'cp -R <%= meta.out %>/<%= pkg.version %> build/gh-pages/release/latest',
			copyEdge : 'rm -rf build/gh-pages/release/edge && ' +
				'cp -R <%= meta.out %>/edge build/gh-pages/release/edge',
			updateGhPages : 'cd build/gh-pages && git add . --all && git commit -m "Updating release (latest: <%= pkg.version %>)" && ' +
				'git push origin',
			cleanup : 'rm -rf build/gh-pages',
			_options : {
				stdout : true,
				failOnError : true
			}
		},
		bannerize : outFiles,
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
		strip : withExclude
	});

	grunt.loadTasks("../build/tasks");
	grunt.registerTask('edge', 'build:edge strip:edge beautify:dist bannerize:edge');
	grunt.registerTask('latest', 'build:latest strip:latest beautify:dist docco:latest bannerize:latest shell:makeSteal shell:bundleLatest');
	grunt.registerTask("ghpages", "shell:cleanup shell:getGhPages shell:copyLatest shell:updateGhPages shell:cleanup");
	grunt.registerTask('deploy', 'latest ghpages');
};
