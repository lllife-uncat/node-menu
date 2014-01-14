app.controller("ProductController", function($scope, $location){


	$scope.$emit("navigate", $location.path() );
	//$scope.$broadcast("navigate", "");

});