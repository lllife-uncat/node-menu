app.controller("HomeController", function($scope, NavigateService, CategoryService, ProductService, UserService){

	// Active menu.
	NavigateService($scope);

	// Check login.
	UserService.check($scope);

	// Init all data.
	_initCategory($scope, CategoryService, ProductService);
	_initProduct($scope, ProductService);

	// catRequest.success(function(data){
	// 	$scope.refreshAllCategoryInfo();
	// });

	// Init variable.
	$scope.currentProduct = {};
	$scope.productFilter = "";
	$scope.currentImageIndex = 0;
	$scope.currentSelectedPage = 0;


	$scope.nextImage = function(){
		var total = $scope.currentProduct.$images.length;
		if($scope.currentImageIndex < total - 1){
			$scope.currentImageIndex ++;
		}else {
			$scope.currentImageIndex = 0;
		}

		$scope.$emit("message", { error:false, message: "View image " + $scope.currentProduct.$images[$scope.currentImageIndex].title });
	}

	$scope.matchPage = function(index){
		var start = $scope.currentSelectedPage;
		var end = start + 10;

		// console.log("start: " + start);
		// console.log("end: " + end);

		var ok = index >= start && index < end;

		return ok;
	};

	$scope.changePage = function(index){
		console.log("page: " + index);
		$scope.currentSelectedPage = index;

		$scope.$emit("message", { error: false, message: "Go to product " + (index + 1) })
	};

	$scope.changeImageIndex = function(index){
		console.log("index: " + index);

		$scope.currentImageIndex = index;
	}


	$scope.flip = function() {
		$('.ui.cube.shape') .eq(0) .shape('flip over') .end() .eq(1) .shape('flip back') ;
	};

	$scope.complexProductFilter = function(p){

		var selectedCategories = 0;
		$scope.categories.forEach(function(cat){
			if(cat.$selected){
				selectedCategories ++;
			}
		});

		var catFilter = false;
		if(selectedCategories == 0) {
			catFilter = true;
		} else {
			$scope.categories.forEach(function(cat){
				if(cat.$selected){
					if(p.categoryIds.indexOf(cat.identifier) != -1) {
						catFilter = true;
						return;
					}
				}
			});
		}

		var product = true;

		try {
			var filter = $scope.productFilter.toUpperCase();
			var name = p.name.toUpperCase();
			var desc = p.description.toUpperCase();
			product =  name.indexOf(filter) != -1 || desc.indexOf(filter) != -1;

		}catch(err){
			console.log(p.name);
			console.log(p.description);
			product = false;
		}

		return catFilter && product;
	};

	$scope.selectCategory = function(cat){
		if(typeof(cat.$selected) == 'undefined') {
			cat.$selected = true;
		}else {
			cat.$selected = !cat.$selected;
		}

		_emitMessage($scope, "Select category " + cat.title);
	}


	////////////////////////////////////////////
	// CALCULATE CATEGORY INFO
	/////////////////////////////////////////////
	$scope.refreshCatetoryInfo = function(cat){
		cat.$products = [];

		$scope.products.forEach(function(p){
			
			if(p.categoryIds.indexOf(cat.identifier) != -1){
				cat.$products.push(p);
			}
		});


		_refreshCategoryInfo($scope);
	};

	$scope.refreshAllCategoryInfo = function(){
		if(!$scope.categories) { return; }
		if(!$scope.products) { return;}

		console.log("==refresh category info==");
		$scope.categories.forEach(function(cat){
			$scope.refreshCatetoryInfo(cat);
		});
	};

	$scope.firstInitCurrentProduct = false;

	$scope.init = function() {
		
		$('.ui.accordion') .accordion() ;

		if($scope.products && $scope.products.length > 0 && !$scope.firstInitCurrentProduct) {
			$scope.currentProduct = $scope.products[0];
			$scope.firstInitCurrentProduct = true;
		}

		$scope.refreshAllCategoryInfo();
	}

	$scope.selectProduct = function(p){
		$scope.$emit("message", { error:false, message: "View " + p.name });
		$scope.currentProduct = p;
		$scope.currentImageIndex = 0;
	};
});