
app.factory("NavigateService", function($location) {
	return function($scope) {
		$scope.$emit("navigate", $location.path() );
	};
});