app.controller("CategoryController", function($scope, NavigateService, CategoryService, ProductService, $upload, UserService){

	// Active ui
	NavigateService($scope);

	// Check login
	UserService.check($scope);

	// Init controller variable
	$scope.categories = [];
	$scope.categoriesA, $scope.categoriesB, $scope.categoriesC, $scope.categoriesD = [];
	$scope.selectedLevelA, $scope.selectedLevelB, $scope.selectedLevelC = [];
	$scope.selectedCategory = {};
	// $scope.lastSelectedCategory = {};

	// current selected picture
	$scope.currentPicture = {};

	$scope.currentCategory = {
		parentId : null
	};

	$scope.getParentA = function(cat){
		var catA = null;

		$scope.categories.forEach(function(c){
			if(c.identifier == cat.parentId){
				var parentB = c;
				$scope.categories.forEach(function(c){
					if(c.identifier == parentB.parentId) {
						catA = c;
						return;
					}
				});
			}
		});

		return catA;
	};

	$scope.removeCategory = function(category){

		$scope.currentRemove = category.title;

		var confirm = $('.confirm-remove.ui.modal');
		confirm.modal("setting", {
			closable: false,
			onApprove : function(){
				console.log("approve...");
				category.delete = true;
				//$scope.save(category);

				var request = CategoryService.add(category);
				request.success(function(data){
					var index = $scope.categories.indexOf(category);
					if(index != -1){
						$scope.categories.splice(index,1);
					}
				 });

			}
		});

		confirm.modal('show');
	};

	// show image in big view area.
	$scope.openPicture = function(p){
		$scope.currentPicture = p;
	};
	
	// remove image.
	$scope.removeImage = function(image){

		var index = $scope.currentCategory.$images.indexOf(image);
		if(index != -1){
			$scope.currentCategory.$images.splice(index, 1);
			$scope.currentPicture = {};
			console.log("remove image: " + image.identifier);
		}

		console.log("[product]");
		console.log($scope.currentCategory);

		var idIndex = $scope.currentCategory.imageIds.indexOf(image.identifier);

		if(index != -1){
			$scope.currentCategory.imageIds.splice(idIndex, 1);
			console.log("remove image id: " + image.identifier);
		}
	}

	$scope.getParentB = function(cat){
		var catB = null;

		$scope.categories.forEach(function(c){
			if(c.identifier == cat.parentId){
				catB = c;
				return;
			}
		});

		return catB;
	}


		// move to top
		$scope.moveToTop = function(){
			$("html, body").animate({ scrollTop: 0 }, "slow");
		};


	// Select specific category.
	$scope.select = function(cat){
		_selectComplexCategory($scope, cat);
		// $scope.lastSelectedCategory = cat;
	}

	// Refresch category dependency.
	$scope.refreshCategoryInfo = function(){

		_refreshCategoryInfo($scope);

	};


	// Start edit
	$scope.edit = function(cat){

		if(cat.$level == "A"){
			$scope.selectedLevelA = {};
		}else if(cat.$level == "B"){
			$scope.selectedLevelB = {};
		}else if(cat.$level == "C"){
			$scope.selectedLevelC = {};
		}

		$scope.currentCategory = cat;


		cat.$images.forEach(function(img){
			$scope.currentPicture = img;
		});

		// if(cat == $scope.selectedLevelA){
		// 	$scope.selectedLevelA = {};
		// }else if(cat == $scope.selectedLevelB){
		// 	$scope.selectedLevelB = {};
		// }else if(cat == $scope.selectedLevelC){
		// 	$scope.selectedLevelC = {};
		// }
	}

	var request = CategoryService.findAll();

	request.success(function(data){
		$scope.categories = data;
		$scope.categories.forEach(function(d){ 
			d.$active = false;
			_appendImageUrl(d, ProductService);
		});

		var so = $scope.categories.sort(function(a,b) { return a.identifier - b.identifier } );

		$scope.refreshCategoryInfo();
	});

	request.error(function(error){
		console.log(error);
	});

	////////////////////////////////////////////////////////
	// UPDATE DATA
	////////////////////////////////////////////////////////
	$scope.save = function(cat){

		if(cat != $scope.selectedCategory) {
			cat.parentId = $scope.selectedCategory.identifier;			
		}

		cat.imageIds = [];
		cat.$images.forEach(function(img){
			cat.imageIds.push(img.identifier);
		});

		var request = CategoryService.add(cat);
		request.success(function(data){

			var newCat = data.data;

			var message = {
				message : "Update success: " + newCat.title,
				error : false
			}
			if(typeof($scope.currentCategory.identifier) === 'undefined') {

				console.log("== New Category ==");

				newCat.$images = [];
				newCat.imageIds.forEach(function(id){
					pic = {};
					pic.identifier = id;
					pic.$url = ProductService.getImageUrl(pic.identifier);
					pic.$thumbnail = ProductService.getThumbnailUrl(pic.identifier);

					console.log(pic);

					newCat.$images.push(pic);
				});

				$scope.categories.push(newCat);				
			}

			$scope.$emit("message", message);
			$scope.currentCategory = { parentId : null };

			$scope.refreshCategoryInfo();
		});

		request.error(function(err){
			var msg = {
				message :  err,
				error : true
			}
			$scope.$emit("message", msg);
		});

	}


	$scope.cancel = function(){
		$scope.currentCategory = { parentId: null };
	}

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
				pic.$thumbnail = ProductService.getThumbnailUrl(pic.identifier);

				$scope.currentCategory.$images = $scope.currentCategory.$images || [];
				$scope.currentCategory.$images.push(pic);
				$scope.currentPicture = pic;
			});

			upload.error(function(err){
				console.log(err);
			});
		}
	};

});