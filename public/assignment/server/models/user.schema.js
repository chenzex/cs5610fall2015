module.exports = function(mongoose) {

    var UserSchema = mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,
        username: String,
        password: String,
        email: String
    },{collection: "users"});
    return UserSchema;
};