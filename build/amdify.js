steal('steal/build', function(steal) {
	var inexcludes = function(excludes, src) {
		for(var i = 0; i < excludes.length; i++) {
			if(src.indexOf(excludes[i]) !== -1) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Creates a deliverable
	 *
	 * @param source
	 * @param options
	 */
	steal.build.amdify = function(source, options) {
		var out = options.out,
			map = {};
		print('Creating AMD modules for ' + source);
		steal.File(out).mkdirs();
		steal.build.open("steal/rhino/empty.html", {
			startFile : source,
			skipCallbacks: true
		}, function(opener){
			opener.each(function(stl){
				if(!inexcludes(options.excludes || [], stl.rootSrc)) {
					var file = steal.File(stl.rootSrc),
						outPath = steal.File(out + file.dir()),
						copyTo = outPath.path + '/' + file.filename();
					outPath.mkdirs();
					print('  > ' + copyTo);
					file.copyTo(copyTo);
				} else {
					print('  Ignoring ' + stl.rootSrc);
				}
			})
		});
	}
})