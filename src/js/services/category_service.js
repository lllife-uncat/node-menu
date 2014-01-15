app.factory("CategoryService", function(ConfigurationService, $http){

	var baseUrl = ConfigurationService.endPoint + "/category";

	return {
		findAll : function() { 
			var request = $http.get(baseUrl);
			return request;
		},

		add : function(cat){
			var request = $http({
				url : baseUrl,
				method : "POST",
				data : JSON.stringify(cat),
				headers: { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		findByExample : function(cat){
			var request = $http({
				url : baseUrl + "/query",
				method : "POST",
				data : JSON.stringify(cat),
				headers: { "Content-Type" : "multipart/form-data" }
			});
		}
	}
});