'use strict';
(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);
        //RegisterController.$inject=['$scope','UserService'];
    function RegisterController($scope,UserService, $rootScope, $location) {
        $scope.register = function() {
            var user = {
                username: $scope.username,
                password1: $scope.password1,
                password2: $scope.password2,
                email: $scope.email,
            };
            
            var callback = function(user){
                $rootScope.user = user;
                $location.path('/profile');
            };
            
            UserService.createUser(user,callback);
            
  }
    }
})();
