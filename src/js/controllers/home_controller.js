app.controller("HomeController", function($scope, NavigateService, CategoryService, ProductService){
	NavigateService($scope);

	_initCategory($scope, CategoryService, ProductService);
	_initProduct($scope, ProductService);

	$scope.currentProduct = {};
	$scope.productFilter = "";
	$scope.currentImageIndex = 0;

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

		console.log("==select category==");
		console.log(cat.title);
		console.log(cat.$selected);
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

	$scope.init = function() {
		// var thumb = $('.ko-thumbnail');
		// thumb.popup({
		// 	on: 'hover'
		// });

$scope.refreshAllCategoryInfo();
}

$scope.selectProduct = function(p){
	console.log("hello shape...");

	$('.ui.cube.shape').shape();
	$scope.currentProduct = p;

	$scope.currentImageIndex = 0;
};
});