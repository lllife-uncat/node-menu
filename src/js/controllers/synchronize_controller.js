

app.controller("SynchronizeController", function($scope, ConfigurationService, $location, $rootScope){

	// active menu
	$scope.$emit("navigate", $location.path() );	

	// init variable
	var endPoint = ConfigurationService.endPoint + "/eventbus";
	var eb = new vertx.EventBus(endPoint);
	var startEvent = "synchronize.start";
	var statusEvent = "synchronize.status";
	var listEvent = "synchronize.list";
	var cleanEvent = "clean.start";

	// init variable
	$scope.categories = [];
	$scope.products = [];
	$scope.syncHistory = [];


	function startSync(all){

		$scope.syncHistory = [];

		var token = {};
		token.syncAll = all;

		console.log("== Start Sync ==");
		console.log(token);

		// clean unrefernce media
		// eb.send(cleanEvent, {}, function(reply){

		// });

		// start sync
		eb.send(startEvent, token , function(reply){

		});
	}

	function getInfos(){

		console.log("== Get Infos ==");
		$scope.syncHistory = [];

		eb.send(listEvent, 0 , function(reply){

			console.log("== Receive Reply ==");

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


			// $scope.$apply();
			// $scope.$digest();
			$scope.$apply(function(){
				$scope.categories = obj.categories;
				$scope.prodcuts = obj.products;
			});
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

			// eb.registerHandler(startEvent, function(message){
			// 	console.log("== Receive ==");
			// 	console.log(message);
			// });

			// eb.registerHandler(listEvent, function(message){ });

			eb.registerHandler(statusEvent, function(message){
				var obj = JSON.parse(message);

				var sync = {};
				var name = obj.title || obj.name;

				sync.title =  name;
				$scope.syncHistory.push(sync);

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

						var sync = {};
						sync.title = p.name;
						$scope.syncHistory.push(sync);

						return;
					}
				});

				$scope.$apply();
			});


			getInfos();

		};		
	}



	// register handler
	register();

	$scope.refresh = function() {
		getInfos();
	};

	$scope.start = function(){
		startSync(false);
	}

	$scope.republish = function(){
		startSync(true);
	}
});