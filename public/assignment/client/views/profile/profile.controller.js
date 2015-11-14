'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);
    function ProfileController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.update = update;
        if ($rootScope.user != null) {
            $scope.username = $rootScope.user.username;
            $scope.password = $rootScope.user.password;
            $scope.firstName = $rootScope.user.firstName;
            $scope.lastName = $rootScope.user.lastName;
            $scope.email = $rootScope.user.email;
        }
        function update() {
            var id = $rootScope.user.id;
            var user = $rootScope.user;
            user.password = $scope.password;
            user.firstName = $scope.firstName;
            user.lastName = $scope.lastName;
            user.email = $scope.email;

            UserService
                .updateUser(id, user)
                .then(function (user) {
                    $rootScope.user = user;
                });
        }
    }
})();
