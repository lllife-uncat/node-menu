app.controller("LoginController", function($scope, UserService, $location){
	$scope.user = "";
	$scope.password = "";
	$scope.error = false;

	$scope.login = function(){

		var request = UserService.login($scope.user, $scope.password);
		request.success(function(rs){
			if(rs.success){

				UserService.status.isLogged = true;
				UserService.status.user = $scope.user;

				$location.path("/home")
			}else {
				$scope.error = true;
			}
		});
	}
});