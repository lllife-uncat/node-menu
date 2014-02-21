
app.factory("BranchService", function($log, $http, ConfigurationService){
    var endPoint = ConfigurationService.endPoint;

    function findAll(callback) {
        var request = $http({
            url : endPoint + "/branch",
            method : "GET"
        });
        request.success(callback);
        request.error(function(err){
            $log.error(err);
        });
    }

    function add(info, callback){
        var request = $http({
            url : endPoint + "/branch",
            method : "POST",
            data : JSON.stringify(info)
        });
        request.success(callback);
        request.error(function(err){
            $log.error(err);
        });
    }

    return {
        findAll : function(callback) { findAll(callback); },
        add : function(info, callback) { add(info, callback); }
    }
});