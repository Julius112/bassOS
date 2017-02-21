angular.module('bassOS').controller('switchCtl', function($scope, $rootScope, $http) {
	//TODO: load list as external JSON
	$rootScope.switch_array = [{id:1, name:"Unterboden", state:false, icon_on:"ion-ios-lightbulb", icon_off:"ion-ios-lightbulb-outline"},
				{id:2, name:"Hupe", state:false, icon_on:"ion-speakerphone", icon_off:"ion-speakerphone"}];

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
