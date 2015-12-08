'use strict';
module.exports = function (app, model, passport, LocalStrategy) {

    passport.use(new LocalStrategy(
        function (username, password, done) {
            model.login({ username: username, password: password }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            })
        }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        model.findBy_Id(user._id, function (err, user) {
            done(err, user);
        });
    });




    app.post('/api/project/user', create);
    app.get('/api/project/user', findAll);
    app.get('/api/project/user/:id', findById);
    app.get('/api/project/user/:username', findByUsername);
    app.post('/api/project/user/:username/:password', findUserByUsernameAndPassword);
    app.post('/api/project/updateUser', update);
    app.delete('/api/project/user/:id', remove);
    app.post("/api/project/login", passport.authenticate('local'), function (req, res) {
        var user = req.user;
        res.json(user);
    });
    app.get('/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/api/project/logout', function (req, res) {
        req.logOut();
        res.send(200);
    });

    app.post('/api/project/register', function (req, res) {
        var newUser = req.body;
        newUser.roles = ['student'];
        model.register({ username: newUser.username }, function (err, user) {
            if (err) { return next(err); }
            if (user) {
                res.json(null);
                return;
            }
            // var newUser = new model(req.body);
            var newUser = model.createNewObject(req.body);
            newUser.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        });
    });

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
        var user = req.body;
        model
            .update(user.id, user)
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

