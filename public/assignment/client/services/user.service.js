'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .factory("UserService", UserService);
    function UserService($http, $q) {
        var findUserByUsernameAndPassword = function (username, password) {
            var deferred = $q.defer();
            $http.get('/api/assignment/user/' + username + '/' + password)
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        };

        var findAllUsers = function () {
            var deferred = $q.defer();
            $http.get('/api/assignment/user')
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
                url: '/api/assignment/user',
                data: user
            }).success(function (user) {
                deferred.resolve(user);
            });
            return deferred.promise;
        };

        var deleteUserById = function (id) {
            var deferred = $q.defer();
            $http.delete('/api/assignment/user/'+id)
                .success(function (users) {
                    deferred.resolve(users);
                });
            return deferred.promise;
        }
        var updateUser = function (id, user) {
            var deferred = $q.defer();
            $http.put('/api/assignment/user/' + id, user)
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        }

        return {
            createUser: createUser,
            findAllUsers: findAllUsers,
            findUserByUsernameAndPassword: findUserByUsernameAndPassword,
            deleteUserById: deleteUserById,
            updateUser: updateUser
        };
    }
})();

