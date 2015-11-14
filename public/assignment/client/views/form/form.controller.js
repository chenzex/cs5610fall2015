'use strict';
(function(){
    angular
        .module("FormBuilderApp")
        .controller("FormController", FormController);
    function FormController($scope, FormService, $rootScope,$location) {
        var model = this;
        model.createFormForUser = createFormForUser;
        model.updateFormById = updateFormById;
        model.getFields = getFields;
        model.deleteFormById = deleteFormById;
        model.findAllFormsForUser = findAllFormsForUser;
        model.selectForm = selectForm;
        function createFormForUser(){
            var form = {
                title : $scope.title,
                userId : $rootScope.user.id,
                fields : []
            };

            var userId = $rootScope.user.id 
            
            FormService
                .createFormForUser(userId, form)
                .then(function (forms) {
                    $scope.forms = forms;
                });
        };
        
        function updateFormById(){
            var formId = $scope.selectedForm.id;
            var form = $scope.selectedForm;
            form.title = $scope.title;
            FormService
                .updateFormById(formId, form)
                .then(function (forms) {
                    $scope.forms = forms;
                });
        };
        
        function deleteFormById(index){
            var formId = $scope.forms[index].id;
            FormService
                .deleteFormById(formId)
                .then(function (forms) {
                    $scope.forms = forms;
                });
        };
        
        function findAllFormsForUser(userId){
            FormService
                .findAllFormsForUser(userId)
                .then(function (forms) {
                    $scope.forms = forms;
                });
        };
        
        function selectForm(index){
            var form = $scope.forms[index];
            $scope.selectedForm = form;
            $scope.title = form.title;
            //document.getElementById("formTable").rows[index+2].style.backgroundColor = '#ffff99';
        };
        
        function getFields(index){
            var formId = $scope.forms[index].id;
            $location.path('/user/'+$rootScope.user.id+'/form/'+formId);
        }
        
        findAllFormsForUser($rootScope.user.id);
    }
})();




