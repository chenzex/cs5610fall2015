'use strict';
(function(){
    angular
        .module("LiveTuition")
        .controller("HeaderController", HeaderController);
    function HeaderController($scope,UserService, $location, $rootScope) {
        var model = this;
        $scope.location = $location;
        model.logout = function()
        {
            UserService
                .logout()
                .then(function () {
                    $rootScope.user = null;
                    $location.path('/')
                });
        } 
    }
})();