'use strict';
(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);
    function LoginController($scope, UserService, $rootScope,$location) {
        $scope.login = function() {
            var callback = function(user){
                if(user == null)return;
                $rootScope.user = user;
                $location.path('/profile')
            };
            UserService.findUserByUsernameAndPassword($scope.username, $scope.password, callback);
            
  }
    }
})();
