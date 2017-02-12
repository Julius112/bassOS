ons.bootstrap('bassOS', ['sse']);

angular.module('bassOS').controller("sseController", function($scope, $rootScope, $http){
	//TODO: as external JSON
	var events = {switch_event : {id : 1}, settings_event : {id : 2}, playlist_event : {id : 3}};
	
	// the last received msg
	$scope.msg = {};
	
	this.switch_event = function (event_data) {
		for (var i = 0; i < $rootScope.switch_array.length; i++) {
			if($rootScope.switch_array[i].id == event_data.id)
				$rootScope.switch_array[i] = event_data.state;
		}
	}
	
	this.playlist_event = function (event_data) {
	
	}
	
	this.settings_event = function (event_data) {
	
	}
	
	// handles the callback from the received event
	var handleCallback = function (msg) {
		var msg = JSON.parse(msg.data)
		console.log("SSE: "+mgs);
		switch(msg.event_id) {
			case events.switch_event.id:
				this.switch_event(msg.event_data);
				break;
			case events.settings_event.id:
				this.settings_event(msg.event_data);
				break;
			case events.playlist_event.id:
	                        this.playlist_event(msg.event_data);
	                        break;
		}
	}
	
	var source = new EventSource('/stats');
	source.addEventListener('message', handleCallback, false);
});
