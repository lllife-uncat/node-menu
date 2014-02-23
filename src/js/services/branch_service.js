
app.factory("BranchService", function($log, $http, ConfigurationService){
    var endPoint = ConfigurationService.endPoint;

    function BranchInfo() {
        this.name = "";
        this.branchId = "";
        this.description = "";
        this.phone = "";
        this.province = "";
        this.district = "";
        this.deviceIds = [];

        Object.preventExtensions(this);
    }


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
            data : JSON.stringify(info),
            headers : { "Content-Type" : "multipart/form-data"}
        });
        request.success(callback);
        request.error(function(err){
            $log.error(err);
        });
    }

    return {
        BranchInfo : BranchInfo,
        findAll : function(callback) { findAll(callback); },
        add : function(info, callback) { add(info, callback); }
    }
});