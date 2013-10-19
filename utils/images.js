var fs = require('fs');

function getImages(callback){
  fs.readdir('./uploads/',function(err,files){
    if (err||!files) callback([])
    files = files.filter(function(file) { return file.substr(-4) != 'json' })
    return callback(files)
  })
}

function addInfoToImage(file){
  var info = {id: file}
  var data = require('../uploads/' + file + '.json');
  info.data = data
  return info
}

exports.getImages = getImages
exports.addInfoToImage = addInfoToImage