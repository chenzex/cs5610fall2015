'use strict';
(function(){
    angular
        .module("FormBuilderApp")
        .controller("FieldController", FieldController);
    function FieldController($scope, $routeParams, FieldService, $rootScope,$location) {
        var model = this;
        model.createFieldForForm = createFieldForForm;
        model.createNewField = createNewField;
        model.getFieldsForForm = getFieldsForForm;
        model.getFieldForForm = getFieldForForm;
        model.deleteFieldFromForm = deleteFieldFromForm;
        model.remove = remove;
        model.updateField = updateField;
        $scope.userId = $routeParams.userId;
        $scope.formId = $routeParams.formId;
        
        function createNewField(newField){
            var field;
            if(newField=="SINGLELINE"){
                field = {"id": null, "label": "New Text Field", "type": "TEXT", "placeholder": "New Field"};
            }else if(newField=="MULTILINE"){
                field = {"id": null, "label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field"};
            }else if(newField=="DATE"){
                field = {"id": null, "label": "New Date Field", "type": "DATE"};
            }else if(newField=="DROPDOWN"){
                field = {"id": null, "label": "New Dropdown", "type": "OPTIONS", "options": [
	{"label": "Option 1", "value": "OPTION_1"},
	{"label": "Option 2", "value": "OPTION_2"},
	{"label": "Option 3", "value": "OPTION_3"}
]};
            }else if(newField=="CHECKBOX"){
                field = {"id": null, "label": "New Checkboxes", "type": "CHECKBOXES", "options": [
	{"label": "Option A", "value": "OPTION_A"},
	{"label": "Option B", "value": "OPTION_B"},
	{"label": "Option C", "value": "OPTION_C"}
]};
            }else if(newField=="RADIO"){
                field = {"id": null, "label": "New Radio Buttons", "type": "RADIOS", "options": [
	{"label": "Option X", "value": "OPTION_X"},
	{"label": "Option Y", "value": "OPTION_Y"},
	{"label": "Option Z", "value": "OPTION_Z"}
]};
            }
            createFieldForForm($scope.formId, field);
        }

        function createFieldForForm(formId, field){
            FieldService
                .createFieldForForm(formId, field)
                .then(function (fields) {
                    $scope.fields = fields;
                });
        }
        
        function getFieldsForForm(formId){
            FieldService
                .getFieldsForForm(formId)
                .then(function (fields) {
                    $scope.fields = fields;
                });
        }
        
        function getFieldForForm(formId, fieldId){
            FieldService
                .getFieldForForm(formId, fieldId)
                .then(function (field) {
                });
        }
        
        function deleteFieldFromForm(formId, fieldId){
            FieldService
                .deleteFieldFromForm(formId, fieldId)
                .then(function (fields) {
                    $scope.fields = fields;
                });
        }
        
        function remove(field){
            deleteFieldFromForm($scope.formId, field.id);
        }
        
        function updateField(formId, fieldId, field){
            FieldService
                .updateField(formId, fieldId, field)
                .then(function (fields) {
                    $scope.fields = fields;
                });
        }
        
        getFieldsForForm($scope.formId);
    }
})();




