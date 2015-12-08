module.exports = function(app, db, mongoose, passport, LocalStrategy) {
	var userModel2 = require("./models/user.model.js")(db, mongoose);
	
    require("./services/user.service.js")(app,userModel2,passport, LocalStrategy);
	
	
};