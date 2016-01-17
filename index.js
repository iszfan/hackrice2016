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
	var imgUrl = req.fileurl;
	var img_content;

	console.log("image url is", imgUrl);
	

	//get words from the image
	var command = "python pytesseract.py -f /home/ec2-user/hackrice2016/uploads/"+imgUrl+ ".jpg -t /usr/local/bin/tesseract"


	var child = spawn(command);
	child.stdout.on('data', function(data) {
	    console.log('stdout: ' + data)
	    //Here is where the output goes
	    img_content = data
	});
	child.stderr.on('data', function(data) {
	    console.log('stdout: ' + data);
	    //Here is where the error output goes
	});
	child.on('close', function(code) {
	    console.log('closing code: ' + code);
	    //Here you can get the exit code of the script
	});

	//get image url
	if (img_content) {
		Bing.images(req.params.keyword, {skip: 50}, function(error, res, body){
	  		response = body["d"]["results"][0]["MediaUrl"].toString();
	  		console.log(response);
		});
	} else {
		console.log("no img content received")
	}
	 
	res.send({result: "success", imageUrl: response});
}

function getSample(req, res) {
	console.log("console test");
	res.send("Test get");
}

app.get('/sample', getSample);

app.get('/:keyword', function(req, res) {   
	
});

app.post('/image', uploadFile('post'), postImage);




app.listen(port);
console.log('Server on port ' + port);