let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    display_name: String,
    username: String,
    phone: String,
    email: String,
    facebook_id: String,
    password: String,
});

userSchema.methods.validPassword = function(password) {
    return this.password === password;
};

userSchema.methods.getLoginResponse = function() {
    return {
        id: this.id,
        display_name: this.display_name
    };
};

module.exports = mongoose.model('User', userSchema);