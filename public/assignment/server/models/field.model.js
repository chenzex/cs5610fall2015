'use strict';
var q = require("q");
var forms = require('../models/form.mock.json');
module.exports = function (app) {
	var api = {
		create: create,
		findFieldsByFormId: findFieldsByFormId,
		findFieldByFormIdFieldId: findFieldByFormIdFieldId,
		update: update,
		remove: remove
	};
	return api;
	function create(formId, field) {
		var deferred = q.defer();
		for (var i = 0; i < forms.length; i++) {
			if (forms[i].id == formId) {
				forms[i].fields.push(field);
				deferred.resolve(forms[i].fields);
				return deferred.promise;
			}
		}
		return deferred.promise;
	}

	function findFieldsByFormId(formId) {
		var deferred = q.defer();
		forms.forEach(function (form) {
			if (form.id == formId) {
				deferred.resolve(form.fields);
				return deferred.promise;
			}
		}, this);

		return deferred.promise;
	}

	function findFieldByFormIdFieldId(formId, fieldId) {
		var deferred = q.defer();
		forms.forEach(function (form) {
			if (formId == form.id) {
				for(var i = 0; i<form.fields.length; i++){
					if(form.fields[i]==fieldId){
						deferred.resolve(form.fields[i]);
						return deferred.promise;
					}
				}
			}
		}, this);
		return deferred.promise;
	}

	function update(formId, newForm) {
		var deferred = q.defer();
		var userId;
		for (var i = 0; i < forms.length; i++) {
			if (forms[i].id === formId) {
				userId = forms[i].userId;
				forms[i] = newForm;
				break;
			}
		}
		var res = [];
		for (var i = 0; i < forms.length; i++) {
			if (forms[i].userId == userId)
				res.push(forms[i]);
		}
		deferred.resolve(res);
		return deferred.promise;
	}

	function remove(formId, fieldId) {
		var deferred = q.defer();
		for (var i = forms.length; i--;) {
			if (forms[i].id === formId) {
				for (var j = forms[i].fields.length; j--;) {
					if (forms[i].fields[j].id === fieldId) {
						forms[i].fields.splice(j, 1);
						deferred.resolve(forms[i].fields);
						return deferred.promise;
					}
				}
			}
		}
		return deferred.promise;
	}
}