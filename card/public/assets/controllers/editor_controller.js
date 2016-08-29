angular.module('app').controller('editorCtrl', ['$scope', '$routeParams', 'getDataServices', 'postDataServices','$location', function ($scope, $routeParams, getDataServices, postDataServices,$location) {
    $scope.data = {}
    if ($routeParams.id) {////修改
        getDataServices.getOneData($routeParams.id).then(function (res) {
            $scope.data.name = res.data.name
            $scope.data.title = res.data.title
            $scope.data.address = res.data.address
            $scope.data.phone = res.data.phone
            $scope.data.address = res.data.address
            $scope.data.description = res.data.description
            $scope.data.qq = res.data.qq
            $scope.data.email = res.data.email
        }).catch(function (err) {
            console.log(err)
        })

        $scope.doSave = function () {
            postDataServices.updateData($routeParams.id, $scope.data).then(function(res){
                if(res.status == 'y'){
                    $location.path('/')
                }else {
                    alert(res.msg)
                }
            })
        }
    }
    else {
        $scope.doSave = function () {
            postDataServices.addData($scope.data).then(function(res){
                if(res.status == 'y'){
                    $location.path('/')
                }else {
                    alert(res.msg)
                }
            })
        }
    }


}])