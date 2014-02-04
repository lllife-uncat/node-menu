


app.controller("ProductController", function($scope, $location, CategoryService, ProductService, $upload, ngTableParams, UserService, $sce){

	// active menu
	$scope.$emit("navigate", $location.path() );	

	// check login
	UserService.check($scope);

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

	// current selected video
	$scope.currentVideo = {};

	// current selected product
	$scope.currentProduct = { primaryPrice: null, memberPrice: null, $images :[], imageIds :[], mediaIds: [] };

	// inline editing
	$scope.inlineEditing = false;

	// show archive or not;
	$scope.showArchive = false;

	// selected category
	$scope.selectedCategoryA = {};
	$scope.selectedCategoryB = {};
	$scope.selectedCategoryC = {};

	$scope.selectedCategoryLevel = null;

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}


	// first initialize category and product information
	// include image url and thumbnail
	var request = _initCategory($scope, CategoryService, ProductService);
	_initProduct($scope, ProductService, ngTableParams);

	// refresh category infos.
	request.success(function(cat){
		_refreshCategoryInfo($scope);
	});

	$scope.removeProduct = function(product){

		$scope.currentRemove = product.name;

		var confirm = $('.confirm-remove.ui.modal');
		confirm.modal("setting", {
			closable: false,
			onApprove : function(){
				console.log("approve...");
				product.delete = true;
				$scope.save(product);
			}
		});

		confirm.modal('show');
	};

	// move to top
	$scope.moveToTop = function(){
		$("html, body").animate({ scrollTop: 0 }, "slow");
	};

	// select level 
	$scope.selectCategoryLevel = function(level){
		$scope.selectedCategoryLevel = level;
	};

	// select category a;
	$scope.selectCategoryA = function(cat){
		$scope.selectedCategoryA = cat;
		$scope.selectedCategoryLevel = "B";
	};

	// select category b;
	$scope.selectCategoryB = function(cat){
		$scope.selectedCategoryB = cat;
		$scope.selectedCategoryLevel = "C";
	};	

	// select category b;
	$scope.selectCategoryC = function(cat){
		$scope.selectedCategoryC = cat;
	};	

	// show modal a;
	$scope.showCategoryModalA = function(){
		// _refreshCategoryInfo($scope);
		$(".ko-category-a").modal("show");
	};

	// show modal b;
	$scope.showCategoryModalB = function(){
		// _refreshCategoryInfo($scope);
		$(".ko-category-b").modal("show");
	};

	// get all un archive products
	$scope.getActiveProducts = function(){
		var actives = [];
		$scope.products.forEach(function(p){
			if(!p.archive) {
				actives.push(p);
			}
		});
		return actives;
	};

	// show archive change [view trick]
	$scope.showArchiveChange = function() {
		$scope.showArchive = !$scope.showArchive;

		console.log("showArchive: " + $scope.showArchive);
	}

	// get all selected category count
	function getNumberOfSelectedCategory(){
		var count = 0;
		$scope.categories.forEach(function(cat){
			if(cat.$selectedFilter){
				count++;
			}
		});
		return count;
	}

	// filter product with conditions.
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



	// calulate cateogry infos.
	$scope.refreshCatetoryInfo = function(cat){
		cat.$products = [];

		$scope.products.forEach(function(p){
			
			if(p.categoryIds.indexOf(cat.identifier) != -1){
				cat.$products.push(p);
			}
		});
	};

	// refresch category infos.
	$scope.refreshAllCategoryInfo = function(){
		console.log("==refresh category info==");
		$scope.categories.forEach(function(cat){
			$scope.refreshCatetoryInfo(cat);
		});
	};


	$scope.showVideoModal = function(){
		console.log($scope.currentVideo);

		var dlg = $(".ui.video-player");
		dlg.modal("show");
	};

	// show image manager popup.
	$scope.showImageModal = function(){

		var dlg = $(".ui.modal");
		
		dlg.modal("setting", {
			// useCSS : false
			closabel :false
		});

		dlg.modal('show');

		$scope.imageDialog = dlg;

		// $('.ko-image').modal('hide');
	};

	// hide popup.
	$scope.hideImageModal = function(){
		// $('.ko-image').modal('hide all');
		$scope.imageDialog.modal("hide");

	};

	// start inline edit.
	$scope.setInlineEditing = function(edit){
		$scope.inlineEditing = edit;
	}


	// save specific image.
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

	// save all images.
	$scope.saveAllImage = function(){
		$scope.currentProduct.$images.forEach(function(img){
			$scope.saveImage(img);
		});
	}


	// show image in big view area.
	$scope.openPicture = function(p){
		$scope.currentPicture = p;
	};

	// hightlight image
	$scope.openVideo = function(v){
		$scope.currentVideo = v;
	}

	// loading...
	$scope.loadInclude = function(){
		console.log("loading...");
	};

	// get all selected category
	$scope.getSelectedCategories = function(){
		var cats = []
		$scope.categories.forEach(function(cat){
			if(cat.$selected) {
				cats.push(cat);
			}
		});

		return cats;
	};

	// validate new product.
	$scope.valid = function(){
		var r = $scope.currentProduct;
		var p = r.primaryPrice && r.promotionPrice && r.memberPrice;
		var img = r.$images.length > 0;

		// var cats = $scope.getSelectedCategories();
		var cats = $scope.selectedCategoryC.identifier != null;
		var valid = r.name && r.description && r.productId && cats && p && img;

		// console.log("validate: " + valid);
		return valid;
	};


	// select cateogry
	$scope.selectCategory = function(c){

		// if(typeof(cat.$selected) == 'undefined') {
		// 	cat.$selected = true;
		// }else {
		// 	cat.$selected = !cat.$selected;
		// }

		$scope.selectedCategoryC = c;
		if(c.parentId != null){
			$scope.categories.forEach(function(a){
				if(a.identifier == c.parentId){
					$scope.selectedCategoryB = a;
					return;
				}
			});
			$scope.categories.forEach(function(a){
				if(a.identifier == $scope.selectedCategoryB.identifier){
					$scope.selectedCategoryA = a;
					return;
				}
			});
		}
	}

	// select product category [all product]
	$scope.selectProductCategory = function(cat){
		if(typeof(cat.$selectedFilter) == 'undefined'){
			cat.$selectedFilter = true;
		}else {
			cat.$selectedFilter = !cat.$selectedFilter;
		}
	}

	// append product dependencies
	$scope.appendProductDependency = function(product){
		product.imageIds = [];
		product.mediaIds = [];

		product.categoryIds = [];

		product.$images.forEach(function(pic){
			product.imageIds.push(pic.identifier);
		});

		product.$videos.forEach(function(vid){
			product.mediaIds.push(vid.identifier);
		});

		// $scope.getSelectedCategories().forEach(function(cat){
		// 	product.categoryIds.push(cat.identifier);
		// });		

product.categoryIds.push($scope.selectedCategoryC.identifier);
};

	// update current product
	$scope.save = function(product){
		console.log("save...");

		$scope.appendProductDependency(product);

		var request = ProductService.add(product);
		request.success(function(rs){
			// append url
			var p = rs.data;
			_appendImageUrl(p, ProductService);

			// append only new insert not update.
			if($scope.currentProduct.identifier != p.identifier){
				$scope.products.push(p);				
			}

			// clear reset current product.
			$scope.currentProduct = {};
			$scope.currentVideo = {};

			$scope.currentProduct.$videos = [];
			$scope.currentProduct.$images = [];

			// reload table
			console.log("==reload table==");
			//reloadTable($scope, $scope.products, ngTableParams);

			$scope.tableParams.reload();

			// $scope.$emit("message", { error : false, message : "Save complete"});
			_emitMessage($scope, "Save complete");
		});

		request.error(function(err){
			console.log(err);
		});
	}

	$scope.removeVideo = function(video){
		var index = $scope.currentProduct.$videos.indexOf(video);
		if(index != -1){
			$scope.currentProduct.$videos.splice(index, 1);
			$scope.currentVideo = {}
		}

		var idIndex = $scope.currentProduct.mediaIds.indexOf(video.identifier);
		if(index != -1){
			$scope.currentProduct.mediaIds.splice(idIndex, 1);
		}
	};

	// remove image.
	$scope.removeImage = function(image){

		var index = $scope.currentProduct.$images.indexOf(image);
		if(index != -1){
			$scope.currentProduct.$images.splice(index, 1);
			$scope.currentPicture = {};
			console.log("remove image: " + image.identifier);
		}

		console.log("[product]");
		console.log($scope.currentProduct);

		var idIndex = $scope.currentProduct.imageIds.indexOf(image.identifier);

		if(index != -1){
			$scope.currentProduct.imageIds.splice(idIndex, 1);
			console.log("remove image id: " + image.identifier);
		}

		// var request = ProductService.removeImage(image);

		// request.success(function(data){
		// 	var index = $scope.currentProduct.$images.indexOf(image);
		// 	if(index != -1){
		// 		$scope.currentProduct.$images.splice(index, 1);
		// 		$scope.currentPicture = {};
		// 	}

		// 	var idIndex = $scope.currentProduct.imageIds.indexOf(image.identifier);
		// 	if(index != -1){
		// 		$scope.currentProduct.imageIds.splice(idIndex, 1);
		// 	}
		// });

		// request.error(function(error){
		// 	$scope.$emit("message", { error: true, message : "Remove image failed: " + error});
		// });
}

	// start inline update.
	$scope.inlineUpdate = function(product){

		$scope.appendProductDependency(product);

		var request = ProductService.add(product);
		request.success(function(rs){
			var p = rs.data;
			// $scope.$emit("message", { error : false, message : "Save complete"});
			_emitMessage($scope, "Save complete");

			$scope.setInlineEditing(false);
		});

		request.error(function(err){
			console.log(err);
		});
	};

	$scope.selectCategoryHierarchy = function(catcId){
		$scope.categories.forEach(function(cat){
			if(catcId == cat.identifier) {
				$scope.selectedCategoryC = cat;
				return;
			}
		});

		$scope.categories.forEach(function(cat){
			if($scope.selectedCategoryC.parentId == cat.identifier) {
				$scope.selectedCategoryB = cat;
				return;
			}
		});

		$scope.categories.forEach(function(cat){
			if($scope.selectedCategoryB.parentId == cat.identifier){
				$scope.selectedCategoryA = cat;
				return;
			}
		});
	}

	// select product.
	$scope.selectProduct = function(product){

		if(product.categoryIds[0]){
			$scope.selectCategoryHierarchy(product.categoryIds[0]);
		}

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


	// change tab.
	$scope.setActiveTab = function(tab){
		$scope.selectedTab = tab;
		console.log("selectedTab:" + $scope.selectedTab);
		$scope.refreshAllCategoryInfo();


		_refreshCategoryInfo($scope);
	};


	// upload selected images.
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
				pic.$thumbnail = ProductService.getThumbnailUrl(pic.identifier);

				$scope.currentProduct.$images = $scope.currentProduct.$images || [];
				$scope.currentProduct.$images.push(pic);
				$scope.currentPicture = pic;
			});

			upload.error(function(err){
				console.log(err);
			});
		}
	};

	// upload selected images.
	$scope.onVideoSelect = function($files){
		for(var i = 0; i< $files.length; i++){
			var file = $files[i]

			console.log("Upload: " + ProductService.getUploadVideoUrl());
			console.log("File:");
			console.log(file);

			var name = file.name;
			var type = file.type;

			var data = {
				title : name,
				type : type
			};

			var upload = $upload.upload({
				url: ProductService.getUploadVideoUrl(),
				method: "POST",
				data : { data : data } , 
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
				pic.$url = ProductService.getVideoUrl(pic.identifier);
				// pic.$thumbnail = ProductService.getThumbnailUrl(pic.identifier);

				$scope.currentProduct.$videos = $scope.currentProduct.$videos || [];
				$scope.currentProduct.$videos.push(pic);
				$scope.currentPicture = pic;
			});

			upload.error(function(err){
				console.log(err);
			});
		}
	};

});