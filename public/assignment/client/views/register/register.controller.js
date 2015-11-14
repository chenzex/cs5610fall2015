'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);
    function RegisterController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.register = register;
        function register() {
            var user = {
                username: $scope.username,
                password: $scope.password1,
                password2: $scope.password2,
                email: $scope.email,
            };

            UserService
                .createUser(user)
                .then(function (user) {
                    $rootScope.user = user;
                    $location.path('/profile')
                });
        }
    }
})();
