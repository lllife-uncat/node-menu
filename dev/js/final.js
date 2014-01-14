var app = angular.module("MenuApp", ["ngRoute"]);

app.config(function($routeProvider){

	$routeProvider.when("/", {
		templateUrl: "views/home.html",
		controller: "HomeController"
	});

	$routeProvider.when("/product", {
		templateUrl: "views/product.html",
		controller: "ProductController"
	});

	$routeProvider.when("/category", {
		templateUrl: "views/category.html",
		controller: "CategoryController"
	});

	$routeProvider.when("/image", {
		templateUrl : "views/image.html",
		controller: "ImageController"
	});

	$routeProvider.when("/video", {
		templateUrl : "views/video.html",
		controller: "VideoController"
	});

	$routeProvider.when("/user", {
		templateUrl : "views/user.html",
		controller: "UserController"
	});

	$routeProvider.otherwise({
		redirectTo: "/"
	});
});





app.factory("NavigateService", function($location) {
	return function($scope) {
		$scope.$emit("navigate", $location.path() );
	};
});
app.controller("CategoryController", function($scope, NavigateService){
	$scope.category = true;
	NavigateService($scope);
});
app.controller("HomeController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("ImageController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("NavigateController", function($scope){
	$scope.location = "/";

	$scope.$on("navigate", function(event, url){
		$scope.location = url;
		console.log("url:" + url);
	});
});
app.controller("ProductController", function($scope, $location){


	$scope.$emit("navigate", $location.path() );
	//$scope.$broadcast("navigate", "");

});
app.controller("UserController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("VideoController", function($scope, NavigateService){
	NavigateService($scope);
});
