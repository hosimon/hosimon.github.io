angular.module('app').factory('postDataServices',['$http','$q',function($http,$q){
    var dal = {}
    //新增数据
    dal.addData = function(data){
        var deferred = $q.defer()
        $http({
            method:"post",
            url:"/card",
            data:data
        }).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { 
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })
        return deferred.promise
    }

    //修改数据
    dal.updateData = function (id,data) {
        var deferred = $q.defer()
        $http({
            method:"put",
            url:'/card/'+id,
            data:data
        }).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { 
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })

        
        return deferred.promise
    }

    //删除数据
    dal.deleteData = function(id){
        var deferred = $q.defer()
        $http.delete('/card/'+id).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { 
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })
        return deferred.promise
    }
    return dal
}])