var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var ExifImage = require('exif').ExifImage;
var images = require('../utils/images')

if (fs.existsSync('./keys/api')) {
  // TODO
  //var user_credentials = require('../keys/api');
}
/*
 * GET users listing.
 */

exports.list = function (req, res) {
  images.getImages(function(results){
    results = results.map(images.addInfoToImage)
    results.sort(function(a, b){
      return Date.parse(a.uploaded) < Date.parse(b.uploaded)
    })
    res.json(200, results);
  })
};

exports.save = function (req, res) {
  var filename = uuid.v1() + '.' + getExtension(req.files.uploaded_file.name),
    tempPath = req.files.uploaded_file.path,
    targetPath = path.resolve('./uploads/' + filename);

  fs.rename(tempPath, targetPath, function (err) {
    if (err) {
      throw err;
      res.json({error: err})
    }
    console.log("Upload completed!");
    res.json(202, {id: filename })
    readExif(filename)
  });
};

function readExif(file) {
  var info = {status: 'NotSend', uploaded: new Date() }
  /**
   * Read EXIF data
   */
  try {
    new ExifImage({ image: "./uploads/" + file }, function (error, exifData) {
      if (error){
        console.error('Error: ' + error.message);
        saveInfo(file, info)
      }else{
        info.exif = exifData;
        saveInfo(file, info)
      }
    });
  } catch (error) {
    console.error('Error: ' + error.message);
    saveInfo(file, info)
  }
}
function saveInfo(file, data) {
  fs.writeFile("./uploads/" + file + ".json", JSON.stringify(data), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
  if (data.status = 'NotSend') {
    sendToApi(file, data.exif)
  }
}

function writeStatus(file, status) {
  var info = require('./uploads/' + file + '.json');
  info.status = status;
  saveInfo(file, info)
}

function sendToApi(file, exif_data) {
  var url = 'https://x:y@192.168.0.233:3000/images/' + file
  console.log(url)
  /**
   * TODO: Send to api
   */
  if (typeof user_credentials != "undefined") {
    var post_data = {}._extend(imageTemplate)
    var options = {
      host: 'api.summerofcontext.com',
      port: 443,
      path: '/events/submission',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };
    // Set up the request
    var post_req = https.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {

      })
    })

    post_req.on('error', function (err) {
      //handle error here
      console.error(err);
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  }
}

function getExtension(filename) {
  return filename.split('.').pop();
}