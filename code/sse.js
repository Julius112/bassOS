/* Server Sent Events */
var openConnections = [];
var id = 1;

/* API called by every client */
function init(app) {
	app.get('/stats', function(req, res) {
		
		// set timeout as high as possible
		//req.socket.setTimeout(Infinity);
		
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
}

function send(data) {
	openConnections.forEach(function(resp) {
		id++;
		resp.write('id: ' + id + '\n');
		resp.write('data:' + data +   '\n\n');
	});
}

module.exports.init = init;
module.exports.send = send;
