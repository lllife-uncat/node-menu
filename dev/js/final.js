var app = angular.module("MenuApp", ["ngRoute", "angularFileUpload", "ngTable"]);

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

		setTimeout(function(){
			$scope.show = false;
			$scope.$apply('show');
			console.log("==hide message==");
		}, 5000);
	});

	$scope.hide = function(){
		$scope.show = false;
	}
});
function initCategory($scope, CategoryService){
	var request = CategoryService.findAll();
	request.success(function(data){
		$scope.categories = data;
		$scope.categories.forEach(function(d){ d.$active = false; });
		var so = $scope.categories.sort(function(a,b) { return a.identifier - b.identifier } );
	});

	request.error(function(error){
		console.log(error);
	});	
}

// append image object into $images property.
function appendImageUrl(product, ProductService){	
	product.$images = product.$images || [];
	product.imageIds.forEach(function(i){
		var url = ProductService.getImageUrl(i);
		var request = ProductService.getImageInfo(i);

		request.success(function(rs){
			var img = rs;
			img.$url = url;

			console.log("==init image==");
			console.log(img);

			product.$images.push(img);
		});

		request.error(function(err){
			console.log("==init image failed==");
			console.log(err);
		});
		
	});
}

function initProduct($scope, ProductService, ngTableParams){

	var request = ProductService.findAll();

	request.success(function(data){
		$scope.products = data;
		$scope.products.forEach(function(d){ 		
			appendImageUrl(d, ProductService);
		});

		var so = $scope.products.sort(function(a,b) { return a.identifier - b.identifier } );

		console.log("== all products ==");
		console.log($scope.products);

		var config1 = { page: 1,  count: 10};
		var config2 = {
			total: data.length, 
			getData: function($defer, params) {
				$defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		};

		$scope.tableParams = new ngTableParams( config1 , config2);
	});

	request.error(function(error){
		console.log(error);
	});	
}



app.controller("ProductController", function($scope, $location, CategoryService, ProductService, $upload, ngTableParams){

	// active menu
	$scope.$emit("navigate", $location.path() );	

	// current selected tab	
	$scope.selectedTab = "product";

	// // all pictures
	// $scope.pictures = [];

	// all products
	$scope.products = [];

	// all categories;
	$scope.categories = [];

	// current selected picture
	$scope.currentPicture = {};

	// current selected product
	$scope.currentProduct = { primaryPrice: null, memberPrice: null, $images :[], $imageIds :[] };

	// inline editing
	$scope.inlineEditing = false;


	///////////////////////////////////////////////
	// Init
	//////////////////////////////////////////////
	initCategory($scope, CategoryService);
	initProduct($scope, ProductService, ngTableParams);


	/////////////////////////////////////////////////////
	// UI
	/////////////////////////////////////////////////////

	$scope.setInlineEditing = function(edit){
		$scope.inlineEditing = edit;
		console.log("==inline editing==");
		console.log("inline: " + $scope.inlineEditing);
	}


	$scope.saveImage = function(pic){
		var request = ProductService.addImage(pic);
		request.success(function(data){
			$scope.$emit("message", { error: false, message: "Update Success." });
			$scope.currentPicture = {};
		});

		request.error(function(error){
			$scope.$emit("message", { error: true, message : error} );
		});
	};


	$scope.openPicture = function(p){
		$scope.currentPicture = p;
	};

	$scope.loadInclude = function(){
		console.log("loading...");
	};

	$scope.getSelectedCategories = function(){
		var cats = []
		$scope.categories.forEach(function(cat){
			if(cat.$selected) {
				cats.push(cat);
			}
		});

		return cats;
	};

	$scope.valid = function(){
		var r = $scope.currentProduct;
		var p = r.primaryPrice && r.promotionPrice && r.memberPrice;
		var cats = $scope.getSelectedCategories();
		var valid = r.name && r.description && r.productId && cats.length != 0 && p;

		console.log("valid: " + valid);
		return valid;
	};

	/////////////////////////////////////////////////////
	// CATEGORY
	/////////////////////////////////////////////////////
	$scope.selectCategory = function(cat){

		if(typeof(cat.$selected) == 'undefined') {
			cat.$selected = true;
		}else {
			cat.$selected = !cat.$selected;
		}
	}

	$scope.selectProductCategory = function(cat){
		if(typeof(cat.$selectedFilter) == 'undefined'){
			cat.$selectedFilter = true;
		}else {
			cat.$selectedFilter = !cat.$selectedFilter;
		}
	}

	////////////////////////////////////////////////////
	// UPDATE
	///////////////////////////////////////////////////
	$scope.save = function(product){
		console.log("save...");
		product.imageIds = [];
		product.categoryIds = [];

		product.$images.forEach(function(pic){
			product.imageIds.push(pic.identifier);
		});

		$scope.getSelectedCategories().forEach(function(cat){
			product.categoryIds.push(cat.identifier);
		});

		var request = ProductService.add(product);
		request.success(function(rs){
			// append url
			var p = rs.data;
			appendImageUrl(p, ProductService);

			$scope.products.push(p);
			$scope.currentProduct = {};
			$scope.currentProduct.$images = [];

			$scope.$emit("message", { error : false, message : "Save complete"});
		});

		request.error(function(err){
			console.log(err);
		});
	}

	$scope.inlineUpdate = function(product){
		var request = ProductService.add(product);
		request.success(function(rs){
			var p = rs.data;
			$scope.$emit("message", { error : false, message : "Save complete"});

			$scope.setInlineEditing(false);
		});

		request.error(function(err){
			console.log(err);
		});
	};


	$scope.selectProduct = function(product){
		console.log("==select product==");
		console.log(product);

		var ubutton = $("#uploadFileButton");
		console.log(ubutton.click());

		$scope.currentProduct = product;
		$scope.currentProduct.$images.forEach(function(x){
			$scope.currentPicture = x;
		});
	}

	/////////////////////////////////////////////////
	// TEST
	/////////////////////////////////////////////////
	$scope.setActiveTab = function(tab){
		$scope.selectedTab = tab;
		console.log("selectedTab:" + $scope.selectedTab);

		if(!$scope.$$phases) {
			// $scope.$digest("selectedTab");
		}
	};

	///////////////////////////////////////////////
	// UPLOAD
	///////////////////////////////////////////////
	$scope.onFileSelect = function($files){
		for(var i = 0; i< $files.length; i++){
			var file = $files[i]

			console.log("Upload: " + ProductService.getUploadImageUrl());
			console.log("File:");
			console.log(file);

			var upload = $upload.upload({
				url: ProductService.getUploadImageUrl(),
				method: "POST",
				data : { data : {}}, 
				headers : { "Content-Type" : "multipart/form-data" },
				file: file
			});

			upload.progress(function(evt){
				console.log("percent: " + parseInt(100.0 * evt.loaded / evt.total));
			});

			upload.success(function(rs, status, headers, config){
				console.log(rs);

				var pic = rs.data;
				pic.$url = ProductService.getImageUrl(pic.identifier);

				$scope.currentProduct.$images = $scope.currentProduct.$images || [];
				$scope.currentProduct.$images.push(pic);
				$scope.currentPicture = pic;
			});

			upload.error(function(err){
				console.log(err);
			});
		}
	};
});
app.controller("UserController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("VideoController", function($scope, NavigateService){
	NavigateService($scope);
});
