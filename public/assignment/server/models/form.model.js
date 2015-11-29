'use strict';
var q = require("q");
module.exports = function (db, mongoose) {
	var FormSchema = require("./form.schema.js")(mongoose);
    var FormModel = mongoose.model("FormModel", FormSchema);
	// var FormModel = mongoose.model("FormModel");
	var api = {
		create: create,
		findFormsByUserId: findFormsByUserId,
		findById: findById,
		update: update,
		remove: remove,
		createField: createField,
		removeField: removeField
	};
	return api;


	function create(userId, form) {
		var deferred = q.defer();
		FormModel.create(form, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(findFormsByUserId(form.userId));
            }
		});
		return deferred.promise;
	}

	function findFormsByUserId(userId) {
		var deferred = q.defer();
		FormModel.find({ userId: userId }).lean().exec(function (err, forms) {
			if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(forms);
            }
		});
		return deferred.promise;
	}


	function findById(formId) {
		var deferred = q.defer();
		FormModel.findOne({ id: formId }).lean().exec(function (err, form) {
			if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form);
            }
		});
		return deferred.promise;
	}

	function update(formId, newForm) {
		var deferred = q.defer();
		var userId = newForm.userId;
		FormModel.update({ id: formId }, { $set: newForm }, function (err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(findFormsByUserId(userId));
            }
        });

		return deferred.promise;
	}

	function remove(id) {
		var deferred = q.defer();
		FormModel.findOne({ id: id }).lean().exec(function (err, form) {
			if (err) {
                deferred.reject(err);
            } else {
				var userId = form.userId;
                FormModel.remove({ id: id }, function (err, form) {
					if (err) {
						deferred.reject(err);
					} else {
						deferred.resolve(findFormsByUserId(userId));
					}
				});
            }
		});
		return deferred.promise;
	}

	function removeField(formId, fieldId) {
        var deferred = q.defer();
		FormModel.findOne({ id: formId }).exec(function (err, form) {
			var i = 0;
			while(i<form.fields.length && form.fields[i].id != fieldId)i++;
			form.fields.splice(i, 1);
            form.save(function (err, form) {
                FormModel.findOne({ id: formId }).lean().exec(function (err, form) {
					if (err) {
						deferred.reject(err);
					} else {
						deferred.resolve(form.fields);
					}
				});
            });
		});
        return deferred.promise;
    }

	function createField(formId, field) {
		var deferred = q.defer();
		FormModel.findOne({ id: formId }).exec(function (err, form) {
			if (err) {
                deferred.reject(err);
            } else {
                form.fields.push(field);
				form.save(function (err, form) {
					// deferred.resolve(findById(formId));
					FormModel.findOne({ id: formId }).lean().exec(function (err, form) {
						if (err) {
							deferred.reject(err);
						} else {
							deferred.resolve(form.fields);
						}
					});
				});
            }
		});

		return deferred.promise;
	}
}