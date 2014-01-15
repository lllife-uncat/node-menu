app.controller("BranchController", function($scope, NavigateService){
	$scope.category = true;
	NavigateService($scope);
});