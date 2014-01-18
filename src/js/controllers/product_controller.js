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