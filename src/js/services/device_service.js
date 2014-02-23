/**
 * Created by recovery on 2/23/14.
 */

app.factory("DeviceService", function($http, $log, ConfigurationService){

    var endPoint = ConfigurationService.endPoint;

    var DeviceInfo = function() {
        this.deviceId = "";
        this.serialNumber = "";
    }

    function add(info, callback){
        var request = $http({
            url : endPoint + "/device",
            method : "POST",
            data : JSON.stringify(info),
            headers : { "Content-Type" : "multipart/form-data" }
        });

        request.success(function(result){
            callback(result);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    function findAll(callback){
        var request = $http({
            url : endPoint + "/device",
            method : "GET"
        });

        request.success(function(result){
            callback(result);
        });

        request.error(function(err){
            $log.error(err);
        });
    }

    return {
        findAll :function(callback) { findAll(callback); },
        add: function(info, callback) { add(info, callback); },
        DeviceInfo : DeviceInfo
    };
});