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


//
// (123456789.12345).formatMoney(2, '.', ',');
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


// load all product's category
function _initCategory($scope, CategoryService, ProductService){
	var request = CategoryService.findAll();
	request.success(function(data){
		$scope.categories = data;
		$scope.categories.forEach(function(d){
			d.$active = false; 
			_appendImageUrl(d, ProductService);
		});
		var so = $scope.categories.sort(function(a,b) { return a.identifier - b.identifier } );

	});

	request.error(function(error){
		$scope.$emit("message", { error: true, message: error });
		console.log(error);
	});	

	return request;
}

// append image object into $images property.
function _appendImageUrl(product, ProductService){	
	product.$images = product.$images || [];
	product.imageIds.forEach(function(i){
		var url = ProductService.getImageUrl(i);
		var thumbnail = ProductService.getThumbnailUrl(i);
		var request = ProductService.getImageInfo(i);

		request.success(function(rs){
			var img = rs;
			img.$url = url;
			img.$thumbnail = thumbnail;
			product.$images.push(img);
		});

		request.error(function(err){
			$scope.$emit("message", { error: true, message: error });
			console.log("==init image failed==");
			console.log(err);
		});
		
	});
}

function _reloadTable($scope, data, ngTableParams){
	
	var config1 = { page: 1,  count: 50};
	var config2 = {
		total: data.length, 
		getData: function($defer, params) {
			$defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	};

	$scope.tableParams = new ngTableParams( config1 , config2);	
}

function _initProduct($scope, ProductService, ngTableParams){

	var request = ProductService.findAll();

	request.success(function(data){
		$scope.products = data;
		$scope.products.forEach(function(d){ 		
			_appendImageUrl(d, ProductService);
		});

		var so = $scope.products.sort(function(a,b) { return a.identifier - b.identifier } );

		// console.log("== all products ==");
		// console.log($scope.products);

		if(ngTableParams != null){
			console.log("==reload table==");
			_reloadTable($scope, data, ngTableParams);
		}
	});

	request.error(function(error){
		console.log(error);
	});	
}

function _refreshCategoryInfo($scope){
	$scope.categoriesA =[];
	$scope.categoriesB =[];
	$scope.categoriesC = [];

	$scope.categories.forEach(function(cat){
		if(!cat.parentId){
			cat.$level = "A";
			$scope.categoriesA.push(cat);
		}
	});

	$scope.categories.forEach(function(cat){
		$scope.categoriesA.forEach(function(catA){
			if(cat.parentId == catA.identifier){
				cat.$level = "B";
				$scope.categoriesB.push(cat);
			}
		});
	});

	$scope.categories.forEach(function(cat){
		$scope.categoriesB.forEach(function(catB){
			if(cat.parentId == catB.identifier){
				cat.$level = "C";
				$scope.categoriesC.push(cat);
			}
		});
	});

	$scope.categoriesA.forEach(function(a){
		a.$childs = [];

		$scope.categories.forEach(function(cat){
			if(cat.parentId == a.identifier){
				a.$childs.push(cat);
			}
		});
	});

	$scope.categoriesB.forEach(function(a){
		a.$childs = [];

		$scope.categories.forEach(function(cat){
			if(cat.parentId == a.identifier){
				a.$childs.push(cat);
			}
		});
	});
}

function _selectComplexCategory($scope, cat){
	cat.$selected = !(cat.$selected || false);

	if(cat.$selected){
		$scope.selectedCategory = cat;
	}

	if(cat.$level === "A") {
		$scope.selectedLevelA = cat;
		$scope.selectedLevelB = {};
		if(!cat.$selected) {
			$scope.selectedLevelA = {};
			$scope.selectedCategory = {};
		}
	}else if(cat.$level === "B"){
		$scope.selectedLevelB = cat;
		$scope.selectedLevelC = {};
	}else if(cat.$level === "C"){
		$scope.selectedLevelC = cat;
	}
}


