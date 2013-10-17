var path = require('path');
var fs = require('fs');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('images');
};

exports.save = function(req, res){
  var date = Date.now()
  var tempPath = req.files.uploaded_file.path,
    targetPath = path.resolve('./uploads/'+JSON.stringify(date)+'.png');
    fs.rename(tempPath, targetPath, function(err) {
      if (err){
        throw err;
        res.json({error: err})
      }
      console.log("Upload completed!");
      res.json(202, {url: targetPath })
    });
};