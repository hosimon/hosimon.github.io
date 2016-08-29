angular.module('app').factory('postDataServices',['$http','$q',function($http,$q){
    var dal = {}
    ////新增数据
    dal.addData = function(data){
        var deferred = $q.defer()
        $http({
            method:"post",
            url:"/card",
            data:data
        }).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { /////报错时的输出信息参数一 错误提示,参数二错误代码
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })
        return deferred.promise
    }

    ///修改数据
    dal.updateData = function (id,data) {
        var deferred = $q.defer()

        /////方法一
        $http({
            method:"put",
            url:'/card/'+id,
            data:data
        }).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { /////报错时的输出信息参数一 错误提示,参数二错误代码
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })

        ////方法二
        // $http.put('/card/'+id,data).success(function(res){
        //     deferred.resolve(res)
        // }).error(function (err) {
        //     console.log(err)
        //     deferred.reject(res)
        // })
        return deferred.promise
    }

    ////删除数据
    dal.deleteData = function(id){
        var deferred = $q.defer()
        $http.delete('/card/'+id).success(function(res){
            deferred.resolve(res)
        }).error(function (res,statusCode) { /////报错时的输出信息参数一 错误提示,参数二错误代码
            console.log(res)
            console.log(statusCode)
            deferred.reject(res)
        })
        return deferred.promise
    }
    return dal
}])