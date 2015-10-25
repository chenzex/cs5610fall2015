'use strict';
(function () {
    angular
        .module("FormBuilderApp")
        .factory("FormService", FormService);
    function FormService() {
        var currentForms = [];
        
		var createFormForUser = function(userId, form, callback){
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
            form.userid = userId;
            currentForms.push(form);
            callback(form);
		}
		
		var findAllFormsForUser = function(userId, callback){
			var forms = [];
            currentForms.forEach(function (element) {
                if (userId == element.userid) {
                    forms.push(element);
                }
            }, this);
            callback(forms);
		}
		
		var deleteFormById = function(formId, callback){
			for (var i = currentForms.length; i--;) {
                if (currentForms[i].id === formId) {
                    currentForms.splice(i, 1);
                    break;
                }
            }
            callback(currentForms);
		}
		
		var updateFormById = function(formId, newForm, callback){
			currentForms.forEach(function (element) {
                if (formId == element.id) {
                    element = newForm;
                    callback(element);
                    return;
                }
            }, this);
            callback(null);
		}
        
        return {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };
    }
})();

