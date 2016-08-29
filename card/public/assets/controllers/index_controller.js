angular.module('app').controller('indexCtrl', ['$scope', 'getDataServices', 'postDataServices', '$location', function ($scope, getDataServices, postDataServices, $location) {
    // console.log(getDataServices)
    // console.log(postDataServices)
    getDataServices.getData()
        .then(function (res) {
            $scope.data = res.data
        })
        .catch(function (err) {
            console.log(err)
        })

    $scope.doDelete = function (id) {
        if (confirm("确认删除?")) {
            postDataServices.deleteData(id)
                .then(function (res) {
                    if (res.status == 'y') {
                        window.location.href = '/'
                    }
                    else {
                        alert(res.msg)
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    }
}])