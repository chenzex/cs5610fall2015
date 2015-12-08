'use strict';
var q = require("q");
module.exports = function (db, mongoose) {

	var UserSchema = require("./user.schema.js")(mongoose);
    var UserModel = mongoose.model("UserModel", UserSchema);

	var api = {
		login: login,
		register: register,
		findBy_Id: findBy_Id,
		create: create,
		findAll: findAll,
		findById: findById,
		findUserByUsername: findUserByUsername,
		findUserByCredentials: findUserByCredentials,
		update: update,
		remove: remove,
		createNewObject: createNewObject
	};
	return api;
	
	function login(user, callback){
		UserModel.findOne(user, callback);
	}
	
	function register(user, callback){
		UserModel.findOne(user, callback);
	}
	
	function findBy_Id(id, callback){
		UserModel.findById(id, callback);
	}
	
	function createNewObject(user){
		return new UserModel(user);
	}
	
	function create(user) {
		var deferred = q.defer();
		UserModel.create(user, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
		});
		return deferred.promise;
	}

	function findAll() {
		var deferred = q.defer();
		UserModel.find(function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });
		return deferred.promise;
	}

	function findById(id) {
		var deferred = q.defer();
		UserModel.findOne({ id: id }).lean().exec(function (err, user) {
			 if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
		});
		return deferred.promise;
	}

	function findUserByUsername(username) {
		var deferred = q.defer();
		UserModel.findOne({ username: username }).lean().exec(function (err, user) {
			 if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
		});
		return deferred.promise;
	}

	function findUserByCredentials(username, password) {
		var deferred = q.defer();
		UserModel.findOne({ username: username, password: password }).lean().exec(function (err, user) {
			if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
		});
		return deferred.promise;
	}

	function update(id, newUser) {
		var deferred = q.defer();
		UserModel.update({ id: id }, { $set: newUser }, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newUser);
            }
        });
		return deferred.promise;
	}

	function remove(id) {
		var deferred = q.defer();
		UserModel.remove({ id: id }, function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });
		return deferred.promise;
	}
}