'use strict';
var q = require("q");
module.exports = function (db, mongoose, formModel) {
	var FieldSchema = require("./field.schema.js")(mongoose);
    var FieldModel = mongoose.model("FieldModel", FieldSchema);
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
		field.formId = formId;
		FieldModel.create(field, function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
               deferred.resolve(formModel.createField(formId, field));
            }
		});
		return deferred.promise;
	}

	function findFieldsByFormId(formId) {
		var deferred = q.defer();
		FieldModel.find({ formId: formId }).lean().exec(function (err, fields) {
			if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(fields);
            }
		});

		return deferred.promise;
	}

	function findFieldByFormIdFieldId(formId, fieldId) {
		var deferred = q.defer();
		FieldModel.find({ formId: formId, id:fieldId}).lean().exec(function (err, fields) {
			if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(fields);
            }
		});
		return deferred.promise;
	}

	function update(formId, fieldId, newField) {
		var deferred = q.defer();
		FieldModel.update({ formId: formId, id: fieldId }, { $set: newField }, function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });
		return deferred.promise;
	}

	function remove(formId, fieldId) {
		var deferred = q.defer();
        FieldModel.remove({ formId: formId, id: fieldId }, function (err, res) {
					if (err) {
						deferred.reject(err);
					} else {
						deferred.resolve(formModel.removeField(formId, fieldId));
					}
				});
		return deferred.promise;
	}
}