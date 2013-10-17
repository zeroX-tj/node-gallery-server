
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var image = require('./routes/image');
var https = require('https');
var fs = require('fs');
var path = require('path');

var options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/key.pem')
};

// Authentication module.
var auth = require('http-auth');
var basic = auth.basic({
  realm: "Jini Post Area."}
  , function (username, password, callback) { // Custom authentication method.
        callback(username === "x" && password === "y");
});

// Application setup.
var app = express();
app.use(auth.connect(basic));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/images', image.list);
app.post('/images', image.save);

https.createServer(options,app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
