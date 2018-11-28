let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
});

userSchema.methods.validPassword = function(password) {
    return this.password === password;
};

module.exports = mongoose.model('User', userSchema);