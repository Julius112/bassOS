var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var port = '3000';
app.set('port', port);

app.use(bodyParser.json());

//app.use('/api/v1/', routes);
//app.use('/api/v1/users', users);

app.use(express.static(__dirname + '/bassOS'));

app.get('/test', function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.json({"switch": "LEDs", "status": true});
});

var server = http.createServer(app);
server.listen(port);
