'use strict';
module.exports = function (app, model) {
    app.post('/api/project/user/:userId/form', create);
    // app.get('/api/project/user/:userId/form', findFormsByUserId);
    app.get('/api/project/form/:userId', findFormsByUserId);
    app.get('/api/project/form/:formId', findById);
    app.put('/api/project/form/:formId', update);
    app.delete('/api/project/form/:formId', remove);


    function create(req, res) {
        var userId = req.params.userId; 
        var form = req.body;
        model
            .create(userId ,form)
            .then(function (forms) {
                res.json(forms);
            });

    }

    function findFormsByUserId(req, res) {
		var userId = req.params.userId;
        model
            .findFormsByUserId(userId)
            .then(function (forms) {
                res.json(forms);
            });
    }

    function findById(req, res) {
        var formId = req.params.id;
        model
            .findById(formId)
            .then(function (form) {
                res.json(form);
            });
    }


    function update(req, res) {
        var formId = req.params.formId;
        var form = req.body;
        model
            .update(formId, form)
            .then(function (forms) {
                res.json(forms);
            });
    }

    function remove(req, res) {
        var formId = req.params.formId;
        model
            .remove(formId)
            .then(function (forms) {
                res.json(forms);
            });
    }
};



