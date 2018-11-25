var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("./model/user");

module.exports = function(app) {

    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get("/register", function (req, res) {
        res.render("register");
    });

    //
    app.post('/login', function (req, res) {
        User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        });
        res.render("login");
    });

    app.post("/register", function (req, res) {
        console.log(req.body);
        let user = new User({
            id: "xxx",
            username: req.body.username,
            password: req.body.password
        });
        user.save(function (err, user) {
            if (err) return console.error(err);
        });
        res.render("register");
    });

};