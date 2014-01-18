app.factory("ProductService", function(ConfigurationService, $http){

	var baseUrl = ConfigurationService.endPoint + "/product";
	var uploadImageUrl = ConfigurationService.endPoint + "/image/upload";

	return {
		getBaseUrl : function() { return baseUrl; },
		getUploadImageUrl : function() { return uploadImageUrl; },
		getImageUrl : function(id) {
			return ConfigurationService.endPoint + "/image/url/" + id;
		},

		getImageInfo: function(id){
			var url = ConfigurationService.endPoint + "/image/" + id;
			var request = $http.get(url);
			return request;
		},

		addImage : function(image){
			var request = $http({
				url : ConfigurationService.endPoint + "/image",
				method : "POST",
				data : JSON.stringify(image),
				headers : { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		add : function(product){
			var request = $http({
				url : baseUrl,
				method : "POST",
				data : JSON.stringify(product),
				headers: { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		findAll : function() {
			var request = $http({
				url: baseUrl,
				method: "GET",
				data: {}
			});

			return request;
		}
	}
});