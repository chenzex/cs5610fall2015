'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .factory("FieldService", FieldService);
    function FieldService($http, $q) {
        


        var createFieldForForm = function (formId, field) {
            var deferred = $q.defer();
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
            field.id = guid();
            $http.post('/api/assignment/form/'+formId+'/field', field)
                .success(function (fields) {
                    deferred.resolve(fields);
                });
            return deferred.promise;
            // post /api/assignment/form/:formId/field
        }

        var getFieldsForForm = function (formId) {
            var deferred = $q.defer();
            $http.get('/api/assignment/form/' + formId + '/field')
                .success(function (fields) {
                    deferred.resolve(fields);
                });
            return deferred.promise;
            //get /api/assignment/form/:formId/field
        }

        var getFieldForForm = function (formId, fieldId) {
            var deferred = $q.defer();
            $http.get('/api/assignment/form/' + formId + '/field/'+fieldId)
                .success(function (fields) {
                    deferred.resolve(fields);
                });
            return deferred.promise;
            //get  /api/assignment/form/:formId/field/:fieldId
        }

        var deleteFieldFromForm = function (formId, fieldId) {
            var deferred = $q.defer();
            $http.delete('/api/assignment/form/' + formId + '/field/' + fieldId)
                .success(function (fields) {
                    deferred.resolve(fields);
                });
            return deferred.promise;
            //delete /api/assignment/form/:formId/field/:fieldId
        }

        function updateField(formId, fieldId, field) {
            var deferred = $q.defer();
            $http.put('/api/assignment/form/' + formId + '/field/' + fieldId, field)
                .success(function (fields) {
                    deferred.resolve(fields);
                });
            return deferred.promise;
            //put  /api/assignment/form/:formId/field/:fieldId
        }


        return {
            createFieldForForm: createFieldForForm,
            getFieldsForForm: getFieldsForForm,
            getFieldForForm: getFieldForForm,
            deleteFieldFromForm: deleteFieldFromForm,
            updateField: updateField
        };
    }
})();

