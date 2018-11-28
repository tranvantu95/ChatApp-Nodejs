module.exports = function () {

    let config = require("./config");
    // console.log("MongoDB_URI", config.MongoDB_URI);

    let mongoose = require('mongoose');
    mongoose.connection.on('error', function (err) {
        console.log("MongoDB error", err);

    });
    mongoose.connection.once('open', function() {
        console.log("MongoDB connected");
    });
    mongoose.connect(config.MongoDB_URI, {useNewUrlParser:true});

};