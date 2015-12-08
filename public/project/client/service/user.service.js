'use strict';
(function () {
    angular
        .module("LiveTuition")
        .factory("UserService", UserService);
    function UserService($http, $q) {
        
        var login = function (username, password) {
            var deferred = $q.defer();
            var user={username:username, password: password};
            $http({
                method: 'POST',
                url: '/api/project/login',
                data: user
            }).success(function (user) {
                deferred.resolve(user);
            }).error(function (msg){
                deferred.resolve('error');
            });
            return deferred.promise;
        };
        
        var logout = function () {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/project/logout',
                data:''
            }).success(function () {
                deferred.resolve();
            });
            return deferred.promise;
        };
        
        var findUserByUsernameAndPassword = function (username, password) {
            var deferred = $q.defer();
            $http.post('/api/project/user/' + username + '/' + password)
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        };

        var findAllUsers = function () {
            var deferred = $q.defer();
            $http.get('/api/project/user')
                .success(function (users) {
                    deferred.resolve(users);
                });
            return deferred.promise;
        };

        var createUser = function (user) {
            var deferred = $q.defer();
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
            user.id = guid();
            $http({
                method: 'POST',
                url: '/api/project/user',
                data: user
            }).success(function (user) {
                deferred.resolve(user);
            });
            return deferred.promise;
        };
        
        var register = function (user) {
            var deferred = $q.defer();
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
            user.id = guid();
            $http({
                method: 'POST',
                url: '/api/project/register',
                data: user
            }).success(function (user) {
                deferred.resolve(user);
            });
            return deferred.promise;
        };

        var deleteUserById = function (id) {
            var deferred = $q.defer();
            $http.delete('/api/project/user/'+id)
                .success(function (users) {
                    deferred.resolve(users);
                });
            return deferred.promise;
        }
        var updateUser = function (id, user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/project/updateUser',
                data: user
            }).success(function (user) {
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        return {
            createUser: createUser,
            findAllUsers: findAllUsers,
            findUserByUsernameAndPassword: findUserByUsernameAndPassword,
            deleteUserById: deleteUserById,
            updateUser: updateUser,
            login: login,
            logout: logout,
            register: register
        };
    }
})();

