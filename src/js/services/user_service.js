app.factory("UserService", function($location, $http, ConfigurationService){

	var endPoint = ConfigurationService.endPoint + "/user"

	var status = {
		isLogged : false,
		user : ""
	};

	return {

		status : status, 

		check : function($scope){
			if(!status.isLogged) {
				$location.path("/login");
			}
		},

		login : function(user, password){
			var request = $http({
				url :  endPoint + "/login",
				method : "POST",
				data : { user: user, password : password },
				headers : { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		logout : function(){
			status.isLogged = false;
			status.user = "";
			$location.path("/login");
		}
	};
});