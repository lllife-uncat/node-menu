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

	$routeProvider.when("/branch", {
		templateUrl : "views/branch.html",
		controller: "BranchController"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});




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
app.factory("ConfigurationService", function(){
	return {
		endPoint : "http://10.0.0.67:8877"
	}
});

app.factory("NavigateService", function($location) {
	return function($xscope) {
		$xscope.$emit("navigate", $location.path() );
	};
});
app.controller("BranchController", function($scope, NavigateService){
	$scope.category = true;
	NavigateService($scope);
});
app.controller("CategoryController", function($scope, NavigateService, CategoryService){

	////////////////////////////////////////////////
	// INITIALIZE VARIABLE
	////////////////////////////////////////////////
	NavigateService($scope);

	$scope.categories = [];
	$scope.currentCategory = {
		parentId : null
	};

	//////////////////////////////////////////////////
	// GET ALL CATEGORY VIA WEB SERVICE
	///////////////////////////////////////////////////

	var request = CategoryService.findAll();

	request.success(function(data){
		$scope.categories = data;
		$scope.categories.forEach(function(d){ d.$active = false; });
		var so = $scope.categories.sort(function(a,b) { return a.identifier - b.identifier } );
		console.log(so);

		console.log(data);
	});

	request.error(function(error){
		console.log(error);
	});

	////////////////////////////////////////////////////////
	// UPDATE DATA
	////////////////////////////////////////////////////////
	$scope.save = function(cat){
		var request = CategoryService.add(cat);
		request.success(function(data){
			var message = {
				message : new Date() + " -- Update success: " + data.data.title,
				error : false
			}
			if(typeof($scope.currentCategory.identifier) === 'undefined') {
				console.log(data.data);
				$scope.categories.push(data.data);				
			}

			$scope.$emit("message", message);
			$scope.currentCategory = { parentId : null };
		});

		request.error(function(err){
			var msg = {
				message :  err,
				error : true
			}
			$scope.$emit("message", msg);
		});
	}


	//////////////////////////////////////////////////////////
	// UPDATE UI
	///////////////////////////////////////////////////////////
	$scope.setEditCategory = function(cat){
		cat.$active = !cat.$active;
		$scope.currentCategory = cat;
	};

	$scope.setParent = function(parent){
		console.log("current: " + $scope.currentCategory.parentId);
		console.log("click: " + parent.identifier);

		if($scope.currentCategory.parentId == parent.identifier) {
			$scope.currentCategory.parentId = null;
		}else {
			console.log("update...");
			$scope.currentCategory.parentId = parent.identifier;
		}
	};

	$scope.cancel = function(){
		$scope.currentCategory = { parentId: null };
	}
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

	$scope.$on("message", function(event, data){
		$scope.error = data.error;
		$scope.message = data.message;
		$scope.show = true;
	});

	$scope.hide = function(){
		$scope.show = false;
	}
});
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
app.controller("UserController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("VideoController", function($scope, NavigateService){
	NavigateService($scope);
});
