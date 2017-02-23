angular.module('bassOS').controller('switchCtl', function($scope, $rootScope, $http) {
	//TODO: load list as external JSON
	$rootScope.switch_array = [{"id":1, "name":"Unterboden", "state":false, "active":false, "icon_on":"ion-ios-lightbulb", "icon_off":"ion-ios-lightbulb-outline"},
				{"id":2, "name":"Hupe", "state":false, "active":false, "icon_on":"ion-speakerphone", "icon_off":"ion-speakerphone"}];

		console.log("get switch");
		$http({
			method : "GET",
			url : "/switch"
          	}).then(function mySucces(response) {
			for (var i = 0; i < response.data.length; i++)
				for (var j = 0; j < $rootScope.switch_array.length; j++)
					if (response.data[i].id == $rootScope.switch_array[j].id) {
						$rootScope.switch_array[j].active = true;
						$rootScope.switch_array[j].state = response.data[i].state;
					}
		}, function myError(response) {
			for (var i = 0; i < response.data.length; i++)
				for (var j = 0; j < $rootScope.switch_array.length; j++)
					if (response.data[i].id == $rootScope.switch_array[j].id)
						$rootScope.switch_array[j].active = false;
		});

	$scope.switch_change = function(switch_obj) {
		setTimeout(function() {
		$http({
			method : "PUT",
			data: {"switch_id" : switch_obj.id, "state" : switch_obj.state},
			url : "/switch"
		});
		}, 1);
	};

}).directive('myTouchend', function() {
	return function(scope, element, attr) {
		element.on('touchend', function(event) {
			scope.$apply(function() { 
				scope.$eval(attr.myTouchend); 
			});
		});
	};
});; 
