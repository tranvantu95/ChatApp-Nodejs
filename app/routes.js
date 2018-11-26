var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("./model/user");

module.exports = function(app) {

    app.get("/", function (req, res) {
        console.log("home", req.isAuthenticated(), req.user);
        res.render("home");
    });

    app.get("/login", function (req, res) {
        console.log("login", req.isAuthenticated(), req.user);
        res.render("login");
    });

    app.get("/logout", function (req, res) {
        console.log("logout", req.isAuthenticated(), req.user);
        req.logout();
        res.redirect("/");
    });

    app.get("/register", function (req, res) {
        console.log(req.isAuthenticated(), req.user);
        res.render("register");
    });

    //
    // app.post('/login', function (req, res) {
    //     User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
    //         if (err) return console.error(err);
    //         console.log(user);
    //     });
    //     res.render("login");
    // });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

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

    passport.use('local', new LocalStrategy(
        function(username, password, done) {
            console.log('authenticate local', username, password);
            // User.findOne({ username: username }, function (err, user) {
            //     if (err) { return done(err); }
            //     if (!user) {
            //         return done(null, false, { message: 'Incorrect username.' });
            //     }
            //     if (!user.validPassword(password)) {
            //         return done(null, false, { message: 'Incorrect password.' });
            //     }
            //     return done(null, user);
            // });

            return done(null, {username:username});
        }
    ));

    passport.serializeUser(function(user, done) { // save cookie
        console.log("serializeUser", user);
        done(null, user.username);
    });

    passport.deserializeUser(function(name, done) { // get cookie
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });

        console.log("deserializeUser", name);
        done(null, name);
    });

};