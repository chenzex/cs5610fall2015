'use strict';
(function(){
    angular
        .module("LiveTuition")
        .controller("MainController", MainController);
    function MainController($scope, $location) {
        $scope.$location=$location;
    }
})();