app.controller("BranchController", function($log, $scope, NavigateService, BranchService){
    // active nav bar
	$scope.category = true;
	NavigateService($scope);

    // Scope variable
    $scope.branchs = [];

    // BranchService.findAll() callback
    // * Enter function if success
    function findAllCallback(data) {
        $scope.branchs = data;
        $log.info(data);
    }

    // BranchService.add() callback
    // * Enter function if success
    function addCallback(result) {

    }

    BranchService.findAll(findAllCallback);

    $scope.add = function(info){
        BranchService.add(info, addCallback)
    }
});