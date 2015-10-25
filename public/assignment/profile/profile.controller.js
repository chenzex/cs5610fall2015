'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);
    function ProfileController($scope, UserService, $rootScope, $location) {
        if ($rootScope.user != null) {
            $scope.username = $rootScope.user.username;
            $scope.password = $rootScope.user.password;
            $scope.firstName = $rootScope.user.firstName;
            $scope.lastName = $rootScope.user.lastName;
            $scope.email = $rootScope.user.email;
        }
        $scope.update = function () {
            var user = {
                username: $scope.username,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email
            }
            var callback = function (user) {
                if (user == null) {

                } else {
                    alert("Success!");
                }
            };
            UserService.updateUser($rootScope.user.id, user, callback);

        }
    }
})();
