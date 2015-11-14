'use strict';
var q = require("q");
var users = require('../models/user.mock.json');
module.exports = function (app) {
	var api = {
		create: create,
		findAll: findAll,
		findById: findById,
		findUserByUsername: findUserByUsername,
		findUserByCredentials: findUserByCredentials,
		update: update,
		remove: remove
	};
	return api;
	function create(user) {
		var deferred = q.defer();
		users.push(user);
		deferred.resolve(user);
		return deferred.promise;
	}

	function findAll() {
		var deferred = q.defer();
		deferred.resolve(users);
		return deferred.promise;
	}

	function findById(id) {
		var deferred = q.defer();
		users.forEach(function (user) {
			if (id == user.id) {
				deferred.resolve(user);
			}
		}, this);
		return deferred.promise;
	}

	function findUserByUsername(username) {
		var deferred = q.defer();
		users.forEach(function (user) {
			if (username == user.username) {
				deferred.resolve(user);
			}
		}, this);
		return deferred.promise;
	}

	function findUserByCredentials(username, password) {
		var deferred = q.defer();
		users.forEach(function (user) {
			if (username == user.username && password == user.password) {
				deferred.resolve(user);
			}
		}, this);
		return deferred.promise;
	}

	function update(id, newUser) {
		var deferred = q.defer();
		for(var i=0; i<users.length; i++){
			if(users[i].id==id){
				users[i] = newUser;
				deferred.resolve(users[i]);
				break;
			}
		}
		return deferred.promise;
	}

	function remove(id) {
		var deferred = q.defer();
		for (var i = users.length; i--;) {
			if (users[i].id === id) {
				users.splice(i, 1);
				break;
			}
		}
		deferred.resolve(users);
		return deferred.promise;
	}
}