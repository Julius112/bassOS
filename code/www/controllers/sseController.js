//ons.bootstrap('bassOS', ['sse', 'ng-touch']);
ons.bootstrap('bassOS', ['sse']);
angular.module('bassOS', ['onsen']);


angular.module('bassOS').controller("sseCtl", function($scope, $rootScope, $http){
	//TODO: as external JSON
	var events = {"switch_event" : {"id" : 1}, "settings_event" : {"id" : 2}, "playlist_event" : {"id" : 3}};
	
	// the last received msg
	$scope.msg = {};
	
	var switch_event = function (event_data) {
		console.log("SSE: "+event_data.id+" state: "+event_data.state);
		for (var i = 0; i < $rootScope.switch_array.length; i++) {
			if($rootScope.switch_array[i].id == event_data.id)
            			$rootScope.$apply(function () {
					$rootScope.switch_array[i].state = event_data.state;
				});
		}
	}
	
	this.playlist_event = function (event_data) {
	
	}
	
	this.settings_event = function (event_data) {
	
	}
	
	// handles the callback from the received event
	var handleCallback = function (event_msg) {
		var msg = JSON.parse(event_msg.data);
		switch(msg.event_id) {
			case events.switch_event.id:
				switch_event(msg.event_data);
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
