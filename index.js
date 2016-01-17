var express    = require('express');        
var app        = express();                 
// var AWS = require('aws-sdk'); 
var upload = require('./upload.js');
var uploadFile = upload.uploadFile;
var response; 

var Bing = require('node-bing-api')({ accKey: "fJa9Rz0oU9/2O+Nq6tL9wZN8EZPhqf7lWO72SFTzom4" });

var port = process.env.PORT || 8080;        // set our port



// var s3 = new AWS.S3(); 

//  s3.createBucket({Bucket: 'myBucket'}, function() {

//   var params = {Bucket: 'myBucket', Key: 'myKey', Body: 'Hello!'};

//   s3.putObject(params, function(err, data) {

//       if (err) {     
//           console.log(err)     
//       } else {
//       	console.log("Successfully uploaded data to myBucket/myKey");   
//       }

//    });

// });

function postImage(req, res) {
	var imgUrl = req.fileurl;

	console.log("image url is", imgUrl);
	res.send({result: "success"});
}

function getSample(req, res) {
	console.log("console test");
	res.send("Test get");
}

app.get('/sample', getSample);

app.get('/:keyword', function(req, res) {   
	Bing.images(req.params.keyword, {skip: 50}, function(error, res, body){
  		response = body["d"]["results"][0]["MediaUrl"].toString();
  		console.log(response);
	});
	res.json({ "message": response });   
});

app.post('/image', uploadFile('post'), postImage);




app.listen(port);
console.log('Server on port ' + port);