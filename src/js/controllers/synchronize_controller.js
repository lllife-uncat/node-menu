app.controller("SynchronizeController", function($scope, ConfigurationService){

	var endPoint = ConfigurationService.endPoint + "/eventbus";
	var eb = new vertx.EventBus(endPoint);
	var startEvent = "synchronize.start";
	var statusEvent = "synchronize.status";

	eb.onmessage = function(e) {
		console.log('message', e.data);
	};
	eb.onclose = function() {
		console.log('close');
	};

	eb.onopen = function(){

		eb.registerHandler(startEvent, function(message){
			console.log("== Receive ==");
			console.log(message);
		});

		eb.registerHandler(statusEvent, function(message){
			console.log(message);
		});

	};

	$scope.start = function() {
		eb.send(startEvent, "*****");
	};

});