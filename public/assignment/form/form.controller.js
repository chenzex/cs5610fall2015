'use strict';
(function(){
    angular
        .module("FormBuilderApp")
        .controller("FormController", FormController);
    function FormController($scope, FormService, $rootScope,$location) {
        $scope.forms = [];
        $scope.addForm = function(){
            var form = {
                name : $scope.name    
            };
            
            var callback = function(form){
                $scope.forms.push(form);
            }
            
            FormService.createFormForUser($rootScope.user.id, form, callback);
        };
        
        $scope.updateForm = function(index){
            var form = $scope.forms[index];
            var callback = function(x){
                form = x;
            };
            FormService.updateFormById(form.id, $scope.selectedForm, callback);
        };
        
        $scope.deleteForm = function(index){
            var form = $scope.forms[index];
            var callback = function(index){
                $scope.forms.splice(index,1);
            };
            FormService.deleteFormById(form.id, callback);
        };
        
        $scope.selectForm = function(index){
            var form = $scope.forms[index];
            $scope.selectedForm = form;
            document.getElementById("formTable").rows[index+2].style.backgroundColor = '#ffff99';
        };
    }
})();