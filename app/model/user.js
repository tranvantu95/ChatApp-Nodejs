let mongoose = require('mongoose');

module.exports = mongoose.model('user', mongoose.Schema({
    id: String,
    user_name: String,
    password: String
}));