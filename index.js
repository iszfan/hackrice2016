var express    = require('express');        
var app        = express();                 
// var AWS = require('aws-sdk'); 
var upload = require('./upload.js');
var uploadFile = upload.uploadFile;
var response; 

// http://nodejs.org/api.html#_child_processes
// var sys = require('sys')
// var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var child;

var Bing = require('node-bing-api')({ accKey: "fJa9Rz0oU9/2O+Nq6tL9wZN8EZPhqf7lWO72SFTzom4" });

var port = process.env.PORT || 8080;        // set our port



function postImage(req, res) {
	var imgUrl = req["file"]["path"];
	var img_content;

	// var imgUrl='f4a05d3a8f0738b104a9127e02c6096d'

	console.log("image url is", imgUrl);
	

	//get words from the image
	var command = "python python/pytesseract.py -f /home/ec2-user/hackrice2016/uploads/"+imgUrl+ " -t /usr/local/bin/tesseract"



	// executes `pwd`
	child = exec("pwd", function (error, stdout, stderr) {


	  sys.print('stdout: ' + stdout);
	  sys.print('stderr: ' + stderr);
	  setTimeout(function() {
	  	console.log("waiting to print");
	  }, 5000);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }

	  //get image url
	if (img_content) {
		Bing.images(img_content, {skip: 50}, function(error, result, body){
	  		response = body["d"]["results"][0]["MediaUrl"].toString();
	  		console.log(response);
			res.send({result: "success", imageUrl: response});
		});
	} else {
		console.log("no img content received")
	}
	});

	 
	
}

function getSample(req, res) {
	console.log("console test");
	res.send("Test get");
}

app.get('/sample', getSample);

app.get('/:keyword', function(req, res) {   
	
});

app.get('/test', postImage);
app.post('/image', uploadFile('post'), postImage);




app.listen(port);
console.log('Server on port ' + port);