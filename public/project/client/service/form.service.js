'use strict';
(function () {
    angular
        .module("LiveTuition")
        .factory("FormService", FormService);
    function FormService($http, $q) {
		var createFormForUser = function(userId, form){
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
            form.id = guid();
            
            $http({
                method: 'POST',
                url: '/api/assignment/user/'+userId+'/form',
                data: form
            }).success(function (forms) {
                deferred.resolve(forms);
            });
            return deferred.promise;
		}
		
		var findAllFormsForUser = function(userId){ 
            var deferred = $q.defer();
            $http.get('/api/assignment/form/'+userId)
                .success(function (forms) {
                    deferred.resolve(forms);
                });
            return deferred.promise;
		}
		
		var deleteFormById = function(formId){
			var deferred = $q.defer();
            $http.delete('/api/assignment/form/'+formId)
                .success(function (forms) {
                    deferred.resolve(forms);
                });
            return deferred.promise;
		}
		
		var updateFormById = function(formId, newForm){
            var deferred = $q.defer();
            $http.put('/api/assignment/form/'+formId, newForm)
                .success(function (forms) {
                    deferred.resolve(forms);
                });
            return deferred.promise;
		}
        
        return {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };
    }
})();

