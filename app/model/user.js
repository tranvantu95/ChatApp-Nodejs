let mongoose = require('mongoose');

module.exports = mongoose.model('User', mongoose.Schema({
    id: String,
    username: String,
    password: String
}));