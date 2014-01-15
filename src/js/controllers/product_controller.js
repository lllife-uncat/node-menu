app.controller("ProductController", function($scope, $location){



	$scope.$emit("navigate", $location.path() );

	$scope.search = false;
	$scope.list = false;

	$scope.openSearch = function(){
		$scope.search = !$scope.search;
		console.log("search:" + $scope.search);
	};

	$scope.openList = function() {
		$scope.list = !$scope.list;
		console.log("list:" + $scope.list);
	};

	$scope.$on("$routeChangeSuccess", function (scope, next, current) {
		$scope.transitionState = "active"
	});
	
});