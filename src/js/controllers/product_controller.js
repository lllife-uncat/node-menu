


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

	// show archive or not;
	$scope.showArchive = false;


	///////////////////////////////////////////////
	// Init
	//////////////////////////////////////////////
	initCategory($scope, CategoryService);
	initProduct($scope, ProductService, ngTableParams);


	//////////////////////////////
	// FILTER
	/////////////////////////////////

	$scope.getActiveProducts = function(){
		var actives = [];
		$scope.products.forEach(function(p){
			if(!p.archive) {
				actives.push(p);
			}
		});
		return actives;
	};


	$scope.showArchiveChange = function() {
		$scope.showArchive = !$scope.showArchive;

		console.log("showArchive: " + $scope.showArchive);
	}

	function getNumberOfSelectedCategory(){
		var count = 0;
		$scope.categories.forEach(function(cat){
			if(cat.$selectedFilter){
				count++;
			}
		});
		return count;
	}

	$scope.productComplexFilter = function(p){

		if($scope.selectedTab != "allProducts") {
			return;
		}

		// match selected categoryies?

		var matchCategory = false;
		if(getNumberOfSelectedCategory() == 0){
			matchCategory = true;
		}else {
			$scope.categories.forEach(function(cat){
				if(cat.$selectedFilter){
					if(p.categoryIds.indexOf(cat.identifier) != -1){
						matchCategory = true;
						return;
					}
				}
			});
		}

		// match product name or description?
		var matchSearch = true;
		if($scope.productFilter){
			var filter = $scope.productFilter.toUpperCase();
			try { 
				var name = p.name.toUpperCase();
				var desc = p.description.toUpperCase();
				matchSearch = name.indexOf(filter) != -1 || desc.indexOf(filter) != -1;
			}catch (err){
				matchSearch = false;
			}
		}

		// match archive status or not?
		var matchArchive = p.archive && $scope.showArchive || !p.archive && !$scope.showArchive

		// console.log("matchCategory: " + matchCategory);
		// console.log("productFilter: " + productFilter);
		// console.log("matchArchive: " + matchArchive);
		// console.log("showArchive: " + $scope.showArchive);

		var match = matchCategory && matchSearch && matchArchive;
		console.log(">> match: " + match);

		return match;
	};


	////////////////////////////////////////////
	// CALCULATE CATEGORY INFO
	/////////////////////////////////////////////
	$scope.refreshCatetoryInfo = function(cat){
		cat.$products = [];

		$scope.products.forEach(function(p){
			
			if(p.categoryIds.indexOf(cat.identifier) != -1){
				cat.$products.push(p);
			}
			console.log("==category info==");
			console.log(p.categoryIds);
			console.log(p.identifier);
		});
	};

	$scope.refreshAllCategoryInfo = function(){
		console.log("==refresh category info==");
		$scope.categories.forEach(function(cat){
			$scope.refreshCatetoryInfo(cat);
		});
	};

	/////////////////////////////////////////////////////
	// UI
	/////////////////////////////////////////////////////
	$scope.showImageModal = function(){
		$('.ko-image').modal('show');
		// $('.ko-image').modal('hide');
	};

	$scope.hideImageModal = function(){
		// $('.ko-image').modal('hide all');

	};

	$scope.setInlineEditing = function(edit){
		$scope.inlineEditing = edit;
		console.log("==inline editing==");
		console.log("inline: " + $scope.inlineEditing);
	}


	$scope.saveImage = function(pic){
		var request = ProductService.addImage(pic);
		request.success(function(data){
			$scope.$emit("message", { error: false, message: "Update Success." });
			// $scope.currentPicture = {};
		});

		request.error(function(error){
			$scope.$emit("message", { error: true, message : error} );
		});
	};

	$scope.saveAllImage = function(){
		$scope.currentProduct.$images.forEach(function(img){
			$scope.saveImage(img);
		});
	}


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

		// console.log("validate: " + valid);
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

	$scope.appendProductDependency = function(product){
		product.imageIds = [];
		product.categoryIds = [];

		product.$images.forEach(function(pic){
			product.imageIds.push(pic.identifier);
		});

		$scope.getSelectedCategories().forEach(function(cat){
			product.categoryIds.push(cat.identifier);
		});		
	};

	////////////////////////////////////////////////////
	// UPDATE
	///////////////////////////////////////////////////
	$scope.save = function(product){
		console.log("save...");

		$scope.appendProductDependency(product);

		var request = ProductService.add(product);
		request.success(function(rs){
			// append url
			var p = rs.data;
			appendImageUrl(p, ProductService);

			$scope.products.push(p);
			$scope.currentProduct = {};
			$scope.currentProduct.$images = [];

			// reload table
			console.log("==reload table==");
			//reloadTable($scope, $scope.products, ngTableParams);

			$scope.tableParams.reload();

			$scope.$emit("message", { error : false, message : "Save complete"});
		});

		request.error(function(err){
			console.log(err);
		});
	}

	$scope.inlineUpdate = function(product){

		$scope.appendProductDependency(product);

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

		$scope.categories.forEach(function(cat){
			var match = product.categoryIds.indexOf(cat.identifier);
			if(match != -1){
				cat.$selected = true;
			}else {
				cat.$selected = false;
			}
		});

		var thumb = $('.ko-thumbnail');
		thumb.popup({
			on: 'hover'
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

		$scope.refreshAllCategoryInfo();
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
				$scope.$emit("message", { error: false, message: "Upload success: " + file.name });
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