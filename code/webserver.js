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

function bluetooth_service_change(state) {
	settings.bluetooth_service = state;
	if( state == true)
		exec('pulseaudio -D');
	else
		exec('pulseaudio -k');
}

function bluetooth_pairable_change(state) {
	settings.bluetooth_pairable = state;
	if( state == true)
		exec('/home/pi/bOS10/code/system_calls/pair.py');
	else
		exec('/home/pi/bOS10/code/system_calls/pair-stop.sh');
}

function airplay_service_change(state) {
	settings.airplay_service = state;
	if( state == true)
		exec('sudo systemctl start shairport-sync >> /tmp/air.txt');
	else
		exec('sudo systemctl stop shairport-sync >> /tmp/air.txt');
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
	/* action for switch not implemented jet 
	if (state)
		exec('echo "1" > sudo /sys/class/gpio/gpio'+switch_pin+'/value');
	else
		exec('echo "0" > sudo /sys/class/gpio/gpio'+switch_pin+'/value');
	*/

	res.setHeader('content-type', 'application/json');
	res.json();

	// SSE UPDATE
	var data = {"event_id" : 1, "event_data" : {"id" : switch_id, "state" : state}};
	sse_update(data);
});

app.put('/reboot', function (req, res) {
	exec('sudo halt');
	res.setHeader('content-type', 'application/json');
	res.json();
});

app.put('/settings', function (req, res) {
	var data = {"event_id" : -1};
	for ( key in req.body.settings_obj ) {
		if(key == "bluetooth_service") {
			bluetooth_service_change(req.body.settings_obj.bluetooth_service.state);
			data = {"event_id" : 2, "event_data" : {"bluetooth_service" : {"state" : req.body.settings_obj.bluetooth_service.state}}};
		}
		else if(key == "bluetooth_pairable") {
			bluetooth_pairable_change(req.body.settings_obj.bluetooth_pairable.state);
			data = {"event_id" : 2, "event_data" : {"bluetooth_pairable" : {"state" : req.body.settings_obj.bluetooth_pairable.state}}};
		}
		else if(key == "airplay_service") {
			airplay_service_change(req.body.settings_obj.airplay_service.state);
			data = {"event_id" : 2, "event_data" : {"airplay_service" : {"state" : req.body.settings_obj.airplay_service.state}}};
		}
	}
	res.setHeader('content-type', 'application/json');
	res.json();

	sse_update(data);
});

app.get('/paired', function (req, res) {
	settings.bluetooth_pairable = state;
	exec('/home/pi/bOS10/code/system_calls/pair-stop.sh');

	res.setHeader('content-type', 'application/json');
	res.json();
	var data = {"event_id" : 2, "event_data" : {"bluetooth_pairable" : {"state" : false}}};
	sse_update(data);
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
	
/* switch control not implemented jet
for (var i = 0; i < switch_array.length; i++)
	exec('echo "'+switch_array[i].pin+'" > /sys/class/gpio/export && echo "out" > sudo /sys/class/gpio/gpio'+switch_array[i].pin+'/direction && echo "0" > sudo /sys/class/gpio/gpio'+switch_array[i].pin+'/value');
*/
var server = http.createServer(app);
server.listen(port);
