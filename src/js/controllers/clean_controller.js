app.controller("CleanController", function($scope, ConfigurationService){
	// init variable
	var endPoint = ConfigurationService.endPoint + "/eventbus";
	var eb = new vertx.EventBus(endPoint);
	
	var statusEvent = "clean.status";
	var startEvent = "clean.start";
	var listEvent  = "clean.list";

	$scope.cleanHistory = [];
	$scope.medias = [];
	$scope.images = [];

	function list() {
		eb.send(listEvent, {}, function(reply){

			var obj = JSON.parse(reply);
			$scope.images = obj.images;
			$scope.medias = obj.medias;

		});
	}

	eb.onopen = function(){
		eb.registerHandler(statusEvent, function(message){

			var obj = JSON.parse(message);

			$scope.cleanHistory.push(obj);
			$scope.$apply();
		});

		list();

	};

	$scope.start = function(){
		$scope.cleanHistory = [];

		eb.send(startEvent, {}, function(reply){
			console.log(reply);
		});	
	};

	$scope.list = function(){
		list();
	};
});