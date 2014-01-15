app.controller("NavigateController", function($scope){
	$scope.location = "/";

	$scope.$on("navigate", function(event, url){
		$scope.location = url;
		console.log("url:" + url);
	});

	$scope.$on("message", function(event, data){
		$scope.error = data.error;
		$scope.message = data.message;
		$scope.show = true;
	});

	$scope.hide = function(){
		$scope.show = false;
	}
});