app.controller("CategoryController", function($scope, NavigateService){
	$scope.category = true;
	NavigateService($scope);
});