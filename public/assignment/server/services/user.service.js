'use strict';
module.exports = function (app, model) {
    app.post('/api/assignment/user', create);
    app.get('/api/assignment/user', findAll);
    app.get('/api/assignment/user/:id', findById);
    // app.get('/api/assignment/user?username=username', findByUsername);
    // app.get('/api/assignment/user?username=username&password=password', findUserByUsernameAndPassword);
    app.get('/api/assignment/user/:username', findByUsername);
    app.get('/api/assignment/user/:username/:password', findUserByUsernameAndPassword);
    app.put('/api/assignment/user/:id', update);
    app.delete('/api/assignment/user/:id', remove);

    function create(req, res) {
        var user = req.body;
        model
            .create(user)
            .then(function (user) {
                res.json(user);
            });

    }

    function findAll(req, res) {
        model
            .findAll()
            .then(function (users) {
                res.json(users);
            });
    }

    function findById(req, res) {
        var id = req.params.id;
        model
            .findById(id)
            .then(function (user) {
                res.json(user);
            });
    }

    function findByUsername(req, res) {
        var username = req.params.username;
        model
            .findByByUsername(username)
            .then(function (user) {
                res.json(user);
            });
    }

    function findUserByUsernameAndPassword(req, res) {
        model
            .findUserByCredentials(req.params.username, req.params.password)
            .then(function (user) {
                res.json(user);
            });
    }

    function update(req, res) {
        var id = req.params.id;
        var user = req.body;
        model
            .update(id, user)
            .then(function (user) {
                res.json(user);
            });
    }

    function remove(req, res) {
        var id = req.params.id;
        model
            .remove(id)
            .then(function (users) {
                res.json(users);
            });
    }
};

