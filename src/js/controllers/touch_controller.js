

app.controller("TouchController", function($scope, ProductService, CategoryService){


	angular.element(document).ready(function(){
		var scroller = new FTScroller(document.getElementById('scrollable'), {
			scrollingY: false,
			snapping: false,
			scrollbars: false
		});


	});

	var product = _initProduct($scope, ProductService);
	var request = _initCategory($scope, CategoryService, ProductService);

	request.success(function(data){
		_refreshCategoryInfo($scope);

		$scope.currentCategory = $scope.categoriesC[0];
	});

	product.success(function(data){
		$scope.currentProduct = $scope.products[0];
	});


	$scope.currentProduct = {};
	$scope.currentCategory = {};
	$scope.show = true;

	$scope.selectProduct = function(p){
		$scope.currentProduct = p;

		$scope.show = false;

		setTimeout(function(){
			$scope.show = true;
			$scope.$apply();
		}, 1);

	};

	$scope.selectCategory = function(c){
		$scope.currentCategory = c;
	};

	$scope.categoryFilter = function(cat){

		console.log(cat.$level);
		if(cat.$level === "C") {
			return true;
		}

		return false;
	};

	$scope.productFilter = function(p){

		console.log(p.categoryIds[0]);
		console.log($scope.currentCategory.identifier);

		console.log("===========");

		if(p.categoryIds[0]  == $scope.currentCategory.identifier) {
			return true;
		}

		return false;
	};

});