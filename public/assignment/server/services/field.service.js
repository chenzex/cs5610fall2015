'use strict';
module.exports = function (app, model) {
    app.post('/api/assignment/form/:formId/field', create);
    app.get('/api/assignment/form/:formId/field', findFieldsByFormId);
    app.get('/api/assignment/form/:formId/field/:fieldId', findFieldByFormIdFieldId);
    app.put(' /api/assignment/form/:formId/field/:fieldId', update);
    app.delete('/api/assignment/form/:formId/field/:fieldId', remove);


    function create(req, res) {
        var formId = req.params.formId; 
        var field = req.body;
        model
            .create(formId ,field)
            .then(function (fields) {
                res.json(fields);
            });

    }

    function findFieldsByFormId(req, res) {
		var formId = req.params.formId;
        model
            .findFieldsByFormId(formId)
            .then(function (fields) {
                res.json(fields);
            });
    }

    function findFieldByFormIdFieldId(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        model
            .findFieldByFormIdFieldId(formId, fieldId)
            .then(function (field) {
                res.json(field);
            });
    }


    function update(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var field = req.body;
        model
            .update(formId, fieldId, field)
            .then(function (fields) {
                res.json(fields);
            });
    }

    function remove(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        model
            .remove(formId, fieldId)
            .then(function (fields) {
                res.json(fields);
            });
    }
};