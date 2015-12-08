'use strict';
(function () {
    angular
        .module("LiveTuition")
        .controller("RegisterController", RegisterController);
    function RegisterController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.register = register;
        function register() {
            var user = {
                username: model.username,
                password: model.password1,
                password2: model.password2,
                email: model.email,
            };

            UserService
                .register(user)
                .then(function (user) {
                    $rootScope.user = user;
                    $location.path('/profile')
                });
        }
    }
})();
