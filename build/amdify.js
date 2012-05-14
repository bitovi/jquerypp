steal('steal/build', 'steal/build/pluginify', function(steal) {
	var inexcludes = function(excludes, src) {
		for(var i = 0; i < excludes.length; i++) {
			if(src.indexOf(excludes[i]) !== -1) {
				return true;
			}
		}
		return false;
	},
	variableName = function(name) {
		return '__' + name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
	},
	contents = {},
	modules = {},
	/**
	 * Returns a list of steal dependencies for a given file and caches
	 * the plain content.
	 *
	 * @param {String} file The JavaScript file to load
	 * @param {Array} excludes A list of dependencies to exclude
	 * @param {Object} options Options
	 * @param {Function} callback A callback getting passed an array
	 * of steals
	 */
	getDependencies = function(file, excludes, options, callback) {
		steal.build.open("steal/rhino/empty.html", {
			startFile : file,
			skipCallbacks: true
		}, function(opener){
			var ret = [];
			opener.each(function(stl, text){
				if(!inexcludes(excludes || [], stl.rootSrc)) {
					// Add the parsed content to cache
					if(!contents[stl.rootSrc]) {
						contents[stl.rootSrc] = steal.build.pluginify.content(stl, options, text);
					}
					ret.push(stl);
				}
			});
			callback(ret);
		}, null);
	},
	/**
	 *
	 * @param name
	 * @param excludes
	 * @param options
	 */
	createModule =
		function(name, excludes, options) {
		// options.name
		// options.map
		// options.out
		getDependencies(name, excludes, options, function(steals) {
			print('Creating AMD module for ' + name);
			var content,
				dependencies = [],
				names = [],
				nameMap = options.names || {},
				map = options.map || {},
				where = steal.File(options.out + (map[name] || name));
			steals.forEach(function(stl) {
				var current = (map[stl.rootSrc] || stl.rootSrc);
				dependencies.push("'" + current + "'");
				names.push(nameMap[current] || variableName(current));
			});
			content = "define([" +
				dependencies.join(',') +
				'], function(' +
				names.join(',') +
				') {' +
				(contents[name] || ' return {}; ') +
				'; })';

			modules[name] = content;
			steals.forEach(function(stl) {
				if(!modules[stl.rootSrc]) {
					createModule(stl.rootSrc, excludes, options);
				}
			});

			steal.File(where.dir()).mkdirs();
			where.save(content);
		});
	};

	/**
	 * Creates a deliverable AMD module
	 *
	 * @param source
	 * @param options
	 */
	steal.build.amdify = function(source, options) {
		var out = options.out;
		print('Creating AMD modules for ' + source);
		steal.File(out).mkdirs();
		createModule(source, options.excludes || {}, options);
	}

});
