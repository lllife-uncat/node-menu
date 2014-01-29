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
	$scope.lastSelectedCategory = {};

	$scope.currentCategory = {
		parentId : null
	};

	// Select specific category.
	$scope.select = function(cat){
		_selectComplexCategory($scope, cat);
		$scope.lastSelectedCategory = cat;
	}

	// Refresch category dependency.
	$scope.refreshCategoryInfo = function(){

		_refreshCategoryInfo($scope);

	};

	// Start edit
	$scope.edit = function(cat){
		$scope.currentCategory = cat;

		if(cat == $scope.selectedLevelA){
			$scope.selectedLevelA = {};
		}else if(cat == $scope.selectedLevelB){
			$scope.selectedLevelB = {};
		}else if(cat == $scope.selectedLevelC){
			$scope.selectedLevelC = {};
		}
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

		cat.parentId = $scope.selectedCategory.identifier;
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

	//////////////////////////////////////////////////////////
	// UPDATE UI
	///////////////////////////////////////////////////////////
	// $scope.setEditCategory = function(cat){
	// 	cat.$active = !cat.$active;
	// 	$scope.currentCategory = cat;
	// };

	// $scope.setParent = function(parent){
	// 	console.log("current: " + $scope.currentCategory.parentId);
	// 	console.log("click: " + parent.identifier);

	// 	if($scope.currentCategory.parentId == parent.identifier) {
	// 		$scope.currentCategory.parentId = null;
	// 	}else {
	// 		console.log("update...");
	// 		$scope.currentCategory.parentId = parent.identifier;
	// 	}
	// };

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