
app.controller("DeviceController", function($scope, NavigateService, DeviceService){
	NavigateService($scope);

    $scope.currentDevice = new DeviceService.DeviceInfo();
    $scope.devices = [];

    function findAllCallback(rs){
        rs.forEach(function(info){
            $scope.devices.push(info);
        });
    }

    function addCallback(rs){
        var info = rs.data;
        if(!$scope.currentDevice.identifier){
            $scope.devices.push(info);
        }
        $scope.currentDevice = new DeviceService.DeviceInfo();
    }

    function removeCallback(rs){
        var info = rs.data;
        var filter = $scope.devices.filter( function(el) { return el.identifier === info.identifier; });
        var index = $scope.devices.indexOf(filter[0]);
        $scope.devices.splice(index,1);
    }

    // Init
    DeviceService.findAll(findAllCallback)

    $scope.add = function(info){
        DeviceService.add(info, addCallback);
    };

    $scope.remove = function(info){
        info.delete = true;
        DeviceService.add(info, removeCallback)
    }

    $scope.edit = function(info){
        $scope.currentDevice = info;
    };
});