angular.module('bassOS').controller('settingsCtl', function($scope, $rootScope, $http) {
	//TODO: load list as external JSON
	$rootScope.settings = {"bluetooth": {"state":false, "active":false}, "bluetooth_pairable":{"state":false, "active":false}, "airplay":{"state":false, "active":false}, "auto_source":{"state":false, "active":false}};

	$http({
		method : "GET",
		url : "/settings"
        }).then(function mySucces(response) {
		for (var key in response.data)
			if (response.data.hasOwnProperty(key) && $rootScope.settings.hasOwnProperty(key)) {
				$rootScope.settings[key].state = response.data[key];
				$rootScope.settings[key].active = true;
			}
	}, function myError(response) {
		for (var key in response.data)
			if (response.data.hasOwnProperty(key) && $rootScope.settings[i].hasOwnProperty(key))
				$rootScope.settings[key].active = false;
	});

	$scope.settings_change = function(settings_obj) {
		setTimeout(function() {
			$http({
				method : "PUT",
				data: {settings_obj},
				url : "/settings"
			});
		}, 1);
	};

	$scope.halt = function() {
		$http({
			method : "PUT",
			data: {},
			url : "/halt"
		});
	};

	$scope.reboot = function() {
		$http({
			method : "PUT",
			data: {},
			url : "/reboot"
		});
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
