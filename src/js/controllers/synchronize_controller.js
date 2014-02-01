

app.controller("SynchronizeController", function($scope, ConfigurationService, $location){

	function startSync(){
		eb.send(startEvent, "Hello Main!", function(reply){

		});
	}

	function getInfos(){

		eb.send(listEvent, "Hello Man!", function(reply){

			var obj = JSON.parse(reply);

			$scope.products = [];
			$scope.products = obj.products;
			$scope.products.forEach(function(p){
				p.$status = "Unsynchronized";
			});

			$scope.categories = [];
			$scope.categories = obj.categories;
			$scope.categories.forEach(function(cat){
				cat.$status = "Unsynchronized"
			});


			$scope.$apply();
		});
	}

	function register(){

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

			eb.registerHandler(listEvent, function(message){

			});

			eb.registerHandler(statusEvent, function(message){
				var obj = JSON.parse(message);

				$scope.categories.forEach(function(cat){
					if(cat.identifier == obj.identifier){
						cat.$sync = true;
						cat.$status = "Synchronized";
						return;
					}
				});

				$scope.products.forEach(function(p){
					if(p.identifier == obj.identifier){
						p.$sync = true;
						p.$status = "Synchronized";
						return;
					}
				});

				$scope.$apply();
			});


			getInfos();

		};		
	}

	// active menu
	$scope.$emit("navigate", $location.path() );	

	// init variable
	var endPoint = ConfigurationService.endPoint + "/eventbus";
	var eb = new vertx.EventBus(endPoint);
	var startEvent = "synchronize.start";
	var statusEvent = "synchronize.status";
	var listEvent = "synchronize.list";

	// init variable
	$scope.categories = [];
	$scope.products = [];

	// register handler
	register();

	$scope.refresh = function() {
		getInfos();
	};

	$scope.start = function(){
		startSync();
	}
});