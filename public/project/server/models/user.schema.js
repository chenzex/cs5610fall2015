module.exports = function(mongoose) {

    var UserSchema2 = mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,
        username: String,
        password: String,
        email: String,
        phone: String,
        school: String,
        major: String,
        grade: String
    },{collection: "users2"});
    return UserSchema2;
};