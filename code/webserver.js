var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;

/* Server Sent Events */
var openConnections = [];
var id = 1;

/* Webserver Configuration */
var app = express();
var port = '3000';
app.set('port', port);
app.use(bodyParser.json());

/* Serve Frontend */
app.use(express.static(__dirname + '/www'));

/* SSE API Connect Call */
app.get('/stats', function(req, res) {
	
	// set timeout as high as possible
	req.socket.setTimeout(Infinity);
	
	// send headers for event-stream connection
	// see spec for more information
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');
	
	// push this res object to our global variable
	openConnections.push(res);
	
	// When the request is closed, e.g. the browser window
	// is closed. We search through the open connections
	// array and remove this connection.
	req.on("close", function() {
		var toRemove;
		for (var j =0 ; j < openConnections.length ; j++) {
			if (openConnections[j] == res) {
				toRemove =j;
				break;
			}
		}
		openConnections.splice(j,1);
	});
});

function sse_update(data) {
	console.log("SSE UPDATE: "+data.id);
	id++;
	/* TODO: handle integer overflow -> probably combination of date.getMilliseconds() and counter */
	openConnections.forEach(function(resp) {
		resp.write('id: ' + id + '\n');
		resp.write('data:' + JSON.stringify(data) +   '\n\n');
	});
}

app.post('/switch', function (req, res) {
	var switch_id = req.body.switch_id;
	var state = req.body.state;
	
	// TODO: json with switch IDs
	console.log("switch update: "+switch_id+"="+state);
	//spawn('sh', ['system_calls/switch_controll.sh', switch_id, state]);

	// TEST SSE UPDATE
	var data = {"event_id" : 1, "event_data" : {"id" : switch_id, "state" : state}};
	sse_update(data);
});

var server = http.createServer(app);
server.listen(port);
