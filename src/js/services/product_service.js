app.factory("ProductService", function(ConfigurationService, $http, UserService){

	var baseUrl = ConfigurationService.endPoint + "/product";
	var uploadImageUrl = ConfigurationService.endPoint + "/image/upload";
	var uploadVideoUrl = ConfigurationService.endPoint + "/video/upload";

	return {

		getBaseUrl : function() { 
			return baseUrl; 
		},

		getUploadImageUrl : function() { 
			return uploadImageUrl; 
		},

		getUploadVideoUrl : function() {
			return uploadVideoUrl;
		},

		getVideoUrl : function(id) {
			return ConfigurationService.endPoint + "/video/url/" + id;
		},

		getImageUrl : function(id) {
			return ConfigurationService.endPoint + "/image/url/" + id;
		},

		getThumbnailUrl : function(id) {
			return ConfigurationService.endPoint + "/image/thumbnail/" + id;
		},

		getImageInfo: function(id){
			var url = ConfigurationService.endPoint + "/image/" + id;
			var request = $http.get(url);
			return request;
		},

		getVideoInfo : function(id) {
			var url = ConfigurationService.endPoint + "/video/" + id;
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

		removeImage : function(image){
			var url = ConfigurationService.endPoint + "/image/"+ image.identifier;
			console.log("delete image: " + url);

			var headers = {
				//"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36",
				//"Origin": "chrome-extension://hgmloofddffdnphfgcellkdfbfbjeloo",
				"Content-Type": "multipart/form-data" ,
				"Accept": "*/*",
				//"Accept-Encoding": "gzip,deflate,sdch",
				"Accept-Language": "en-US,en;q=0.8,th;q=0.6"
			};

			var request = $http({
				url : url, 
				data : {},
				method : "POST" ,
				headers: headers
			});

			// var request = $http.delete(url);
			// var request = $http.post(url);

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