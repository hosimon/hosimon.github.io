angular.module('app').factory('getDataServices',['$http','$q',function($http,$q){
    var dal = {}

    /*
    获取所有数据
     */
    dal.getData = function(){
        var url = '/card'
        var deferred = $q.defer()
        $http({
            method:'get',
            url:url
           
        }).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { 
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })
        return deferred.promise
    }

    //获取单条记录
    dal.getOneData = function(id){
        var url = '/card/'+id
        var deferred = $q.defer()
        $http({
            method:'get',
            url:url
            // data:data
        }).success(function(res){
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