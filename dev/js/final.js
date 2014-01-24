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


function _emitMessage($scope, message, error){
	if(typeof(error) === 'undefined'){
		$scope.$emit("message", { error: false, message: message })
	}else {
		$scope.$emit("message", { error: error, message: message });
	}
}

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

	return request;
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



app.factory("CategoryService", function(ConfigurationService, $http){

	var baseUrl = ConfigurationService.endPoint + "/category";

	return {
		findAll : function() { 
			var request = $http.get(baseUrl);
			return request;
		},

		add : function(cat){
			var request = $http({
				url : baseUrl,
				method : "POST",
				data : JSON.stringify(cat),
				headers: { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		findByExample : function(cat){
			var request = $http({
				url : baseUrl + "/query",
				method : "POST",
				data : JSON.stringify(cat),
				headers: { "Content-Type" : "multipart/form-data" }
			});
		}
	}
});
app.factory("ConfigurationService", function(){
	return {
		endPoint : "http://10.0.0.67:8877"
	}
});

app.factory("NavigateService", function($location) {
	return function($xscope) {
		$xscope.$emit("navigate", $location.path() );
	};
});
app.factory("ProductService", function(ConfigurationService, $http){

	var baseUrl = ConfigurationService.endPoint + "/product";
	var uploadImageUrl = ConfigurationService.endPoint + "/image/upload";

	return {
		getBaseUrl : function() { return baseUrl; },
		getUploadImageUrl : function() { return uploadImageUrl; },
		getImageUrl : function(id) {
			return ConfigurationService.endPoint + "/image/url/" + id;
		},

		getThumbnailUrl : function(id) {
			return ConfigurationService.endPoint + "/image/thumbnail/" + id;
		},

		getImageInfo: function(id){
			var url = ConfigurationService.endPoint + "/image/" + id;
			var request = $http.get(url);
			return request;
		},

		addImage : function(image){
			var request = $http({
				url : ConfigurationService.endPoint + "/image",
				method : "POST",
				data : JSON.stringify(image),
				headers : { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		removeImage : function(image){
			// var request = $http({
			// 	url : ConfigurationService.endPoint + "/image/" + image.identifier,
			// 	data : {},
			// 	method : "DELETE", 
			// 	headers: { "Content-Type" : "multipart/form-data" }
			// });
	
			var url = ConfigurationService.endPoint + "/image/delete/"+ image.identifier;
			var request = $http.post(url);
			return request;
		},

		add : function(product){
			var request = $http({
				url : baseUrl,
				method : "POST",
				data : JSON.stringify(product),
				headers: { "Content-Type" : "multipart/form-data" }
			});
			return request;
		},

		findAll : function() {
			var request = $http({
				url: baseUrl,
				method: "GET",
				data: {}
			});

			return request;
		}
	}
});
app.controller("BranchController", function($scope, NavigateService){
	$scope.category = true;
	NavigateService($scope);
});
app.controller("CategoryController", function($scope, NavigateService, CategoryService, ProductService, $upload){

	////////////////////////////////////////////////
	// INITIALIZE VARIABLE
	////////////////////////////////////////////////
	NavigateService($scope);

	$scope.categories = [];
	$scope.categoriesA, $scope.categoriesB, $scope.categoriesC, $scope.categoriesD = [];
	$scope.selectedLevelA, $scope.selectedLevelB, $scope.selectedLevelC = [];
	$scope.selectedCategory = {};
	$scope.lastSelectedCategory = {};

	$scope.currentCategory = {
		parentId : null
	};

	$scope.select = function(cat){
		_selectComplexCategory($scope, cat);
		$scope.lastSelectedCategory = cat;
	}

	$scope.refreshCategoryInfo = function(){

		_refreshCategoryInfo($scope);

	};

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

	//////////////////////////////////////////////////
	// GET ALL CATEGORY VIA WEB SERVICE
	///////////////////////////////////////////////////
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
app.controller("HomeController", function($scope, NavigateService, CategoryService, ProductService){
	NavigateService($scope);

	_initCategory($scope, CategoryService, ProductService);
	_initProduct($scope, ProductService);

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
app.controller("ImageController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("NavigateController", function($scope){
	$scope.location = "/";

	$scope.$on("navigate", function(event, url){
		$scope.location = url;
		console.log("url:" + url);
	});

	$scope.$on("message", function(event, data){
		$scope.error = data.error;
		$scope.message = data.message;
		$scope.show = true;
		
		// $scope.showing = $scope.showing || true;


		// setTimeout(function(){
		// 	$scope.show = false;
		// 	$scope.$apply('show');
		// }, 5000);
	});

	$scope.hide = function(){
		$scope.show = false;
	}
});



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

	// selected category
	$scope.selectedCategoryA = {};
	$scope.selectedCategoryB = {};
	$scope.selectedCategoryC = {};

	$scope.selectedCategoryLevel = null;



	// first initialize category and product information
	// include image url and thumbnail
	var request = _initCategory($scope, CategoryService, ProductService);
	_initProduct($scope, ProductService, ngTableParams);

	// refresh category infos.
	request.success(function(cat){
		_refreshCategoryInfo($scope);
	});


	// select level 
	$scope.selectCategoryLevel = function(level){
		$scope.selectedCategoryLevel = level;
	}

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


	// show image manager popup.
	$scope.showImageModal = function(){
		$('.ko-image').modal('show');
		// $('.ko-image').modal('hide');
	};

	// hide popup.
	$scope.hideImageModal = function(){
		// $('.ko-image').modal('hide all');

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
		// var cats = $scope.getSelectedCategories();
		var cats = $scope.selectedCategoryC.identifier != null;
		var valid = r.name && r.description && r.productId && cats && p;

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
		product.categoryIds = [];

		product.$images.forEach(function(pic){
			product.imageIds.push(pic.identifier);
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

	// remove image.
	$scope.removeImage = function(image){
		var request = ProductService.removeImage(image);
		request.success(function(data){
			var index = $scope.currentProduct.$images.indexOf(image);
			if(index != -1){
				$scope.currentProduct.$images.splice(index, 1);
				$scope.currentPicture = {};
			}
		});

		request.error(function(error){
			$scope.$emit("message", { error: true, message : "Remove image failed: " + error});
		});
	}

	// start inline update.
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


	// select product.
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
});
app.controller("UserController", function($scope, NavigateService){
	NavigateService($scope);
});
app.controller("VideoController", function($scope, NavigateService){
	NavigateService($scope);
});
