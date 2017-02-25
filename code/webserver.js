var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

/* Server Sent Events */
var openConnections = [];
var id = 1;

/* switch */
var switch_array = [{"id":1, "pin":17, "state":false},{"id":2, "pin":16, "state":false}];
var settings = {"bluetooth_service" : false, "bluetooth_pairable" : false, "airplay_service" : false}; 

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
	id++;
	/* TODO: handle integer overflow -> probably combination of date.getMilliseconds() and counter */
	openConnections.forEach(function(resp) {
		resp.write('id: ' + id + '\n');
		resp.write('data:' + JSON.stringify(data) +   '\n\n');
	});
}

app.put('/switch', function (req, res) {
	var switch_id = req.body.switch_id;
	var state = req.body.state;
	var switch_pin;
	
	// TODO: json with switch IDs
	for (var i = 0; i < switch_array.length; i++)
		if (switch_array[i].id == switch_id){
			switch_array[i].state = state;
			switch_pin = switch_array[i].pin;
		}

	//exec('/home/pi/bOS10/code/system_calls/switch_controll.sh -p '+switch_pin+' -s '+state);
	if (state)
		exec('echo "1" > sudo /sys/class/gpio/gpio'+switch_pin+'/value');
	else
		exec('echo "0" > sudo /sys/class/gpio/gpio'+switch_pin+'/value');

	res.setHeader('content-type', 'application/json');
	res.json(true);

	// SSE UPDATE
	var data = {"event_id" : 1, "event_data" : {"id" : switch_id, "state" : state}};
	sse_update(data);
});

app.put('/settings', function (req, res) {
	for ( key in req.body.settings_obj ) {
		if(key == "bluetooth_service")
			console.log("bluetooth_service");
		else if(key == "bluetooth_pairable")
			console.log("bluetooth_pairable");
		else if(key == "airplay_service")
			console.log("airplay");
	}
});

app.get('/settings', function (req, res) {
	//spawn('sh', ['system_calls/switch_controll.sh', switch_id, state]);

	res.setHeader('content-type', 'application/json');
	res.json(settings);
});
	
app.get('/switch', function (req, res) {
	//spawn('sh', ['system_calls/switch_controll.sh', switch_id, state]);

	res.setHeader('content-type', 'application/json');
	res.json(switch_array);
});
	
for (var i = 0; i < switch_array.length; i++)
	exec('echo "'+switch_array[i].pin+'" > /sys/class/gpio/export && echo "out" > sudo /sys/class/gpio/gpio'+switch_array[i].pin+'/direction && echo "0" > sudo /sys/class/gpio/gpio'+switch_array[i].pin+'/value');

var server = http.createServer(app);
server.listen(port);
