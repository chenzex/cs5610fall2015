'use strict';

(function () {
    angular
        .module("LiveTuition")
        .config(function ($routeProvider) {
            $routeProvider
                .when("/classroom", {
                    templateUrl: "views/classroom/classroom.view.html",
                    controller: "ClassroomController",
                    controllerAs: "model",
                    resolve: {loggedin: checkUser}
                })
                .when("/register", {
                    templateUrl: "views/register/register.view.html",
                    controller: "RegisterController",
                    controllerAs: "model"
                })
                .when("/login", {
                    templateUrl: "views/login/login.view.html",
                    controller: "LoginController",
                    controllerAs: "model"
                })
                .when("/profile", {
                    templateUrl: "views/profile/profile.view.html",
                    controller: "ProfileController",
                    controllerAs: "model",
                    resolve: {loggedin: checkLoggedin}
                })
                .when("/lobby", {
                    templateUrl: "views/lobby/lobby.view.html",
                    controller: "LobbyController",
                    controllerAs: "model",
                    resolve: {loggedin: checkLoggedin}
                })
                .otherwise({
                    templateUrl: "views/login/guest.view.html",
                    controller: "LoginController",
                    controllerAs: "model",
                    resolve: {loggedin: checkCurrentUser}
                });
        });

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http.get('/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0') {
                $rootScope.user = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else {
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/');
            }
        });

        return deferred.promise;
    };
    
    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();
    
        $http.get('/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.user = user;
                $location.url('/lobby');
            }
            deferred.resolve();
        });
        
        return deferred.promise;
    };
    
    var checkUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();
    
        if($rootScope.user==null){
            $location.url('/');
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    };
})();