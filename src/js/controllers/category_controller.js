app.controller("CategoryController", function($scope, NavigateService, CategoryService){

	////////////////////////////////////////////////
	// INITIALIZE VARIABLE
	////////////////////////////////////////////////
	NavigateService($scope);

	$scope.categories = [];
	$scope.currentCategory = {
		parentId : null
	};

	//////////////////////////////////////////////////
	// GET ALL CATEGORY VIA WEB SERVICE
	///////////////////////////////////////////////////
	var request = CategoryService.findAll();

	request.success(function(data){
		$scope.categories = data;
		$scope.categories.forEach(function(d){ d.$active = false; });
		var so = $scope.categories.sort(function(a,b) { return a.identifier - b.identifier } );
		console.log(so);

		console.log(data);
	});

	request.error(function(error){
		console.log(error);
	});

	////////////////////////////////////////////////////////
	// UPDATE DATA
	////////////////////////////////////////////////////////
	$scope.save = function(cat){
		var request = CategoryService.add(cat);
		request.success(function(data){
			var message = {
				message : new Date() + " -- Update success: " + data.data.title,
				error : false
			}
			if(typeof($scope.currentCategory.identifier) === 'undefined') {
				console.log(data.data);
				$scope.categories.push(data.data);				
			}

			$scope.$emit("message", message);
			$scope.currentCategory = { parentId : null };
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
	$scope.setEditCategory = function(cat){
		cat.$active = !cat.$active;
		$scope.currentCategory = cat;
	};

	$scope.setParent = function(parent){
		console.log("current: " + $scope.currentCategory.parentId);
		console.log("click: " + parent.identifier);

		if($scope.currentCategory.parentId == parent.identifier) {
			$scope.currentCategory.parentId = null;
		}else {
			console.log("update...");
			$scope.currentCategory.parentId = parent.identifier;
		}
	};

	$scope.cancel = function(){
		$scope.currentCategory = { parentId: null };
	}
});