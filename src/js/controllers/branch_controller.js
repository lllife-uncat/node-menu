app.controller("BranchController", function( $log, $scope, NavigateService, BranchService,
                                             DeviceService, Collections){

    // active nav bar
	$scope.category = true;
	NavigateService($scope);

    // Scope variable
    $scope.branchs = [];
    $scope.devices = [];
    $scope.provinces = Collections.provinces;

    $scope.currentBranch = new BranchService.BranchInfo();
    $scope.provincesReady = true;
    $scope.devicesReady = false;

    // Selected device
    $scope.selectedDevice = {};

    // Drop down item
    $scope.provinceDropdown = null;
    $scope.devinceDropdown = null;

    function createDeviceDropdown(){
        $scope.deviceDropdown = $('.device-dropdown').dropdown();
    }

    // Initialize
    angular.element(document).ready(function(){
        if(typeof(window.scrollReveal) === "function"){
            window.scrollReveal = new scrollReveal();
        }

        // Create drop down immediately
        $scope.provinceDropdown = $(".province-dropdown").dropdown();

        // Create drop down after devices is ok.
        var intervalId = setInterval(function(){
            if($scope.devicesReady){
                createDeviceDropdown();
                clearInterval(intervalId);
                $scope.$apply();
            }
        }, 1000);
    });

    // Load init data
    // * $scope.branchs
    // * $scope.devices
    BranchService.findAll(findAllCallback);
    DeviceService.findAll(findAllDeviceCallback);

    // Parameters
    // * DeviceInfo[]
    function findAllDeviceCallback(data){
        $scope.devices = data;
        $scope.devicesReady = true;

    }

    // BranchService.findAll() callback
    // Parameters
    // * BranchInfo[]
    function findAllCallback(data) {
        $scope.branchs = data;
        $log.info(data);
    }

    // Remove from list
    // Parameters
    // * Result
    // * Result.data = BranchInfo
    function removeCallback(result){
        var info = result.data;

        // Find item
        var filter = $scope.branchs.filter(function(el){ return el.identifier === info.identifier; });

        // Find item's index
        var index = $scope.branchs.indexOf(filter[0]);

        $log.info(index);

        // Remove from array
        $scope.branchs.splice(index,1);
    }

    // BranchService.add() callback
    // Parameters
    // * Result
    // * Result.data = BranchInfo
    function addCallback(result) {
        $log.info("<< success >>");
        $log.info(result);

        if(!$scope.currentBranch.identifier) {
            var branch = result.data;
            $scope.branchs.push(branch);
        }

        // Reset current data...
        $scope.currentBranch = new BranchService.BranchInfo();
    }

    // Add/Update branch
    // * Take BranchInfo as parameter
    $scope.add = function(info){
        var province = $scope.provinceDropdown.dropdown("get text");
        info.province = province;
        BranchService.add(info, addCallback)
    };

    // Remove branch from list
    $scope.remove = function(info){
        info.delete = true;
        BranchService.add(info, removeCallback);
    };

    // Fire edit mode
    $scope.edit = function(branch){
        $scope.currentBranch = branch;
        $scope.provinceDropdown.dropdown("set text", branch.province);
    };

    // Add new device to branch
    $scope.addDevice = function(){
        var identifier = $scope.deviceDropdown.dropdown("get value");
        $scope.currentBranch.deviceIds.push(identifier);

        createDeviceDropdown();
    };

    // Remove selected device
    $scope.removeDevice = function(){
        var index = $scope.currentBranch.deviceIds.indexOf($scope.selectedDevice.identifier);
        $scope.currentBranch.deviceIds.splice(index,1);
        $scope.selectedDevice = {};

        createDeviceDropdown();
    };

    // Select device to remove
    $scope.selectDevice = function(device){
        $scope.selectedDevice = device;
    };

    // Get full DeviceInfo by giving identifier
    $scope.getDeviceByIdentifier = function(identifier){
        var device = {};
        $scope.devices.forEach(function(d){
            if(d.identifier == identifier) {
                device = d;
            }
        });

        return device;
    };

    // Check is device should be include in list
    // Show only free device
    $scope.checkAvailableDevice = function(device){
        var ok = true;
        $scope.branchs.forEach(function(branch){
            branch.deviceIds.forEach(function(del){
                if(del === device.identifier) ok = false;
            });
        });

        $scope.currentBranch.deviceIds.forEach(function(el){
            if(el === device.identifier)  ok = false;
        });

        return ok;
    }

    $scope.isDeviceOk = function(){
            if($scope.devicesReady && $scope.deviceDropdown != null) {
            var device = $scope.deviceDropdown.dropdown("get text");
            if(typeof(device) === "string") return true; }
    }

}); // controller