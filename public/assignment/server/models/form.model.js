'use strict';
var q = require("q");
var forms = require('../models/form.mock.json');
module.exports = function (app) {
	var api = {
		create: create,
		findFormsByUserId: findFormsByUserId,
		findById: findById,
		update: update,
		remove: remove
	};
	return api;
	function create(userId, form) {
		var deferred = q.defer();
		forms.push(form);
		var res = [];
		for (var i = 0; i < forms.length; i++) {
			if (forms[i].userId == userId)
				res.push(forms[i]);
		}
		deferred.resolve(res);
		return deferred.promise;
	}

	function findFormsByUserId(userId) {
		var deferred = q.defer();
		var res = [];
		forms.forEach(function (form) {
			if (form.userId == userId) {
				res.push(form);
			}
		}, this);
		deferred.resolve(res);
		return deferred.promise;
	}

	function findById(formId) {
		var deferred = q.defer();
		forms.forEach(function (form) {
			if (formId == form.id) {
				deferred.resolve(form);
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

	function remove(id) {
		var deferred = q.defer();
		var userId;
		for (var i = forms.length; i--;) {
			if (forms[i].id === id) {
				userId = forms[i].userId;
				forms.splice(i, 1);
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
}