steal('steal/build', function(steal) {
	var inexcludes = function(excludes, src) {
		for(var i = 0; i < excludes.length; i++) {
			if(src.indexOf(excludes[i]) !== -1) {
				return true;
			}
		}
		return false;
	};

	steal.build.stealify = function(options) {
		var out = options.out, source = options.src;
		print('Copying Steal dependencies for ' + source + ' to ' + out);
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