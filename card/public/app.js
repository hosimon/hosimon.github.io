angular.module('app',['ngRoute','ngAnimate'])

angular.module('app').config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'./assets/tpl/index.html',
            controller:'indexCtrl'
        })
        .when('/show/:id',{
            templateUrl:'./assets/tpl/show.html',
            controller:'showCtrl'
        })
        .when('/add',{
            templateUrl:'./assets/tpl/editor.html',
            controller:'editorCtrl'
        })
        .when('/editor/:id',{
            templateUrl:'./assets/tpl/editor.html',
            controller:'editorCtrl'
        })
}])
