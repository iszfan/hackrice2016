// this is upload.js which will handle file logic for us

var fs     = require('node-fs')
var multer = require('multer')
var upload = multer({
    // initially upload to 'uploads' directory
    dest: 'uploads/',
    limits: {
        // 50MB upload size
        fileSize: 50 * 1000 * 1000
    }
})

// we will always upload single files with the key "image" in the FormData
var uploadSingle = upload.single('image')

// this is a function that returns middleware
exports.uploadFile = uploadFile

function uploadFile(prefix) {
    return function(req, res, next) {
        uploadSingle(req, res, function(err) {    
            if (err) {
                err.Error = err.message
                res.writeHead(500, err)
                res.end()
            } else {    
                console.log(req);            
                if (req.file) {
                    // we got an upload, now move the file
                    console.log("got a file");
                    rename(prefix, req, res, next) 
                    next()   
                } else {
                    // if there's no file then proceed
                    console.log("there is no file")
                    next()
                }                
            }
        })
    }
}

// move files from uploads directory to per-user location
function rename(prefix, req, res, next) {    
    if (!req.user) {
        return res.sendStatus(401) // unauthorized
    }

    if (!prefix) {
        prefix = 'upload'
    }

    // we'll place each upload in a per-user directory
    var targetDir = 'img/' + req.user + '/' + prefix    

    // we need the user directory to be created, we do that here
    // and set the permissions so we can move files into it
    fs.mkdir(targetDir, 0755, true, function() {

        // this will be the final name of the file
        var targetPath = targetDir + '/' + req.file.originalname

        // copy the file from the upload location to the target
        console.log('copy from ' + req.file.path + ' to ' + targetPath)
        var src = fs.createReadStream(req.file.path)
        var dest = fs.createWriteStream(targetPath)
        src.pipe(dest)

        // when the copy is complete
        src.on('end', function() {            
            // remove the temporary file
            fs.unlink(req.file.path)

            // clean up the request parameters
            req.filepath = targetPath
            req.fileurl = req.protocol + '://' + req.get('host') + '/' + req.filepath

            // proceed
            next()
        })

        src.on('error', function() {
            // you may want to improve this error message
            console.error('oh noes!')            
            res.sendStatus(500) // Server Error            
        })

    }) // end mkdir()
}