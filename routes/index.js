var fs = require('fs');
var https = require("https")
var querystring = require('querystring');
var images = require('../utils/images')
/*
 * GET home page.
 */

exports.index = function (req, response) {
  var allowed = false;
  if (req.query.code) {
    console.log(req.query.code)

    var post_data = querystring.stringify({grant_type: "authorization_code",
      client_id: "52602d09dba96ccc0b000007",
      client_secret: "7dhtswFptRBpcLcFpsOo7Zag3mzRSmkASGRJPWtH86wNyMLh",
      code: req.query.code,
      state: req.query.state
    })

    var options = {
      host: 'api.summerofcontext.com',
      port: 443,
      path: '/oauth2/token',
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
        console.log('Response: ' + chunk);
        var user_credentials = JSON.parse(chunk)
        var get_options = {
          host: 'api.summerofcontext.com',
          port: 443,
          path: '/auth/verify_credentials',
          headers: {
            'Authorization': 'Bearer ' + user_credentials.access_token
          }
        }
        var get_req = https.request(get_options, function (res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            var regex = /^Moved Temporarily. Redirecting to \/users\/(.*)/
            var result = chunk.match(regex);
            user_credentials.user_id = result[1]
            fs.writeFile("./keys/api", JSON.stringify(user_credentials), function (err) {
              if (err) {
                console.log(err);
                returnAllowed(response)
              } else {
                console.log("The file was saved!");
                returnAllowed(response)
              }
            });
          })
        })
        get_req.on('error', function (err) {
          //handle error here
          console.error(err);
          returnAllowed(response)
        });
        get_req.end()
      });
    });
    post_req.on('error', function (err) {
      //handle error here
      console.error(err);
      returnAllowed(response)
    });

    // post the data
    post_req.write(post_data);
    post_req.end();


  } else {
    returnAllowed(response)
  }
};

function returnAllowed(response) {
  var allowed=false;
  if (fs.existsSync("./keys/api")) {
    allowed = true;
  }
  images.getImages(function(images){
    console.log(images)
    response.render('index', { title: 'node-gallery', isAllowed: allowed, images: images });
  })
}