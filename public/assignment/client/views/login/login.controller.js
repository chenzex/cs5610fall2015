'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);
    function LoginController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.login = login;

        function login() {
            UserService
                .findUserByUsernameAndPassword($scope.username, $scope.password)
                .then(function (user) {
                    if (user == null) return;
                    $rootScope.user = user;
                    $location.path('/profile')
                });

        }
    }
})();
