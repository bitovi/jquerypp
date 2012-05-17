var path            = require("path"),
	program         = require("commander"),
	GitHubApi       = require("github"),
	github          = new GitHubApi({
		version: "3.0.0"
	}),
	qs              = require("querystring"),
	fs              = require("fs"),
	https           = require("https"),
	s3p             = require("./s3-post.js"),
	rhinoPath       = path.join(__dirname, "../../.."),
	distPath        = path.join(__dirname, "../../dist/"),
	spawn           = require("child_process").spawn,
	_               = require("underscore"),
	version         = fs.readFileSync( path.join( __dirname, "../version" )),
	descriptions    = {
		"jquerypp.js" : "jQuery++ full #{VERSION} Development",
		"jquerypp.min.js" : "jQuery++ full #{VERSION} Production"
	},
	username,
	password,
	pluginify;

function uploadFiles() {

	_.each( descriptions, function( desc, filename ) {

		desc = desc.replace("#{VERSION}", version);
		process.stdout.write("\nUploading " + desc + " to " + filename);

		fs.readFile( path.join( distPath, filename ), function( err, buf ) {

			github.httpSend({
				"user" : "jupiterjs",
				"repo" : "jquerypp",
				"name" : filename,
				"size" : buf.length,
				"description" : desc,
				"content_type" : "text/javascript"
			}, {
				"url": "/repos/:user/:repo/downloads",
				"method": "POST",
				"params": {
					"$user": null,
					"$repo": null,
					"$name": null,
					"$size": null,
					"description": null,
					"$content_type": null
				}
			}, function( err, socket ) {

				var data = JSON.parse( socket.data );


				s3p.postToS3({
					key : data.path,
					acl : data.acl,
					success_action_status : "201",
					Filename : data.name,
					AWSAccessKeyId : data.accesskeyid,
					policy64 : data.policy,
					signature64 : data.signature,
					contentType : data.mime_type,
					data : buf,
					bucket: "github"
				}, function( e ) {
					if ( e ) {
						console.log( e );
					}
				})

			});

		});

	});

}

function processFiles() {
	process.stdout.write("\nProcessing files");

	github.authenticate({
		type: "basic",
		username: username,
		password: password
	});

	github.repos.getDownloads({
		user : "jupiterjs",
		repo : "jquerypp"
	}, function( err, downloads ) {

		// Clean up all previous downloads
		var i = 0, count = downloads.length;
		process.stdout.write("\nGot " + downloads.length + " downloads");
		if(!downloads.length) {
			uploadFiles();
		} else {
			downloads.forEach(function( download ) {
				process.stdout.write("\nDeleting old download " + download.id);
				github.repos.deleteDownload({
					user: "jupiterjs",
					repo: "jquerypp",
					id: download.id
				}, function() {
					i++;
					if ( i == count ) {
						uploadFiles();
					}
				})
			});
		}
	});


}

// Run Steal build script
pluginify = spawn(rhinoPath + "/js", ["jquery/build/make.js"], {
	cwd: rhinoPath
});

pluginify.on("exit", function( code ) {
	if ( code !== 0 ) {
		process.stdout.write("\nError in Steal build script.")
		process.exit( code );
	} else {
		process.stdout.write("\nBuild complete!")
		processFiles();
	}
});

// Clean up on process exit
process.on("exit", function() {
	process.stdout.write("\n")
})

program.prompt("Github Username: ", function( name ) {
	username = name;

	program.password("Github Password: ", "*", function( pass ) {
		password = pass;
		process.stdin.pause();
		processFiles();
	})

});

