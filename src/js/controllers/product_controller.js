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

function initProduct($scope, ProductService, ngTableParams){

	var request = ProductService.findAll();

	request.success(function(data){
		$scope.products = data;
		// $scope.products.forEach(function(d){ d.$active = false; });
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

	// all pictures
	$scope.pictures = [];

	// all products
	$scope.products = [];

	// all categories;
	$scope.categories = [];

	// current selected picture
	$scope.currentPicture = {};

	// current selected product
	$scope.currentProduct = { primaryPrice: null, memberPrice: null };

	// $scope.someCategorySelected = false;


	///////////////////////////////////////////////
	// Init
	//////////////////////////////////////////////
	initCategory($scope, CategoryService);
	initProduct($scope, ProductService, ngTableParams);


	/////////////////////////////////////////////////////
	// UI
	/////////////////////////////////////////////////////
	$scope.openPicture = function(p){
		$scope.currentPicture = p;
	};

	$scope.loadInclude = function(){
		console.log("loading...");
	}

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

		if(cat.$selected) {
			console.log("selected: " + cat.$selected);
		}
	}


	////////////////////////////////////////////////////
	// UPDATE
	///////////////////////////////////////////////////
	$scope.save = function(product){
		console.log("save...");
		product.imageIds = [];
		product.categoryIds = [];

		$scope.pictures.forEach(function(pic){
			product.imageIds.push(pic.identifier);
		});

		$scope.getSelectedCategories().forEach(function(cat){
			product.categoryIds.push(cat.identifier);
		});

		var request = ProductService.add(product);
		request.success(function(rs){
			var p = rs.data;
			$scope.products.push(p);
			$scope.currentProduct = {};
			$scope.pictures = [];
		});

		request.error(function(err){
			console.log(err);
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

				$scope.pictures.push(pic);
				$scope.currentPicture = pic;
			});

			upload.error(function(err){
				console.log(err);
			});
		}
	};
});