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

userSchema.methods.getLoginResponse = function() {
    return {
        id: this.id,
        username: this.username
    };
};

module.exports = mongoose.model('User', userSchema);