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
	 * A build plugin that copies only actual dependencies for a given file into
	 * a destination folder. The destination folder content is the minimal fileset
	 * you can deliver to be used with Steal.
	 *
	 * @param {String} source The source file to copy the dependencies for
	 * @param {Object} options The following options are available:
	 * - `out` - The output folder (will be created if it doesn't exist)
	 * - `excludes` - An array of files to exclude from copying
	 */
	steal.build.stealify = function(source, options) {
		var out = options.out || steal.File(source).dir();
		print('Copying Steal dependencies for ' + source + ' to ' + out);
		steal.File(out).mkdirs();
		steal.build.open("steal/rhino/empty.html", {
			startFile : source,
			skipCallbacks: true
		}, function(opener){
			opener.each(function(stl){
				if(!inexcludes(options.exclude || [], stl.rootSrc.toString())) {
					var file = steal.File(stl.rootSrc.toString()),
						outPath = steal.File(out + file.dir()),
						copyTo = outPath.path + '/' + file.filename();
					outPath.mkdirs();
					print('  > ' + copyTo);
					file.copyTo(copyTo);
				} else {
					print('  Ignoring ' + stl.rootSrc.toString());
				}
			})
		});
	}
})