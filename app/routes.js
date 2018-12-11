let Recaptcha = require('express-recaptcha').Recaptcha;
let recaptcha = new Recaptcha('6LdCNGkUAAAAAFSUV8w9_bldARR_nLBlw1yGtHIQ', '6LdCNGkUAAAAAFRHHN0V671w59Ibyob9bCylUWCo');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let am = require("./account-manager");
let config = require("./utils/config");

module.exports = function(app) {

    app.get("/", function (req, res) {
        if(config.debug) console.log("home", req.isAuthenticated(), req.user);
        res.render("home", {user: req.user});
    });

    app.get("/login", function (req, res) {
        if(config.debug) console.log("login", req.isAuthenticated(), req.user);
        res.render("login", {error: req.flash('error')});
    });

    app.get("/register", function (req, res) {
        if(config.debug) console.log("register", req.isAuthenticated(), req.user);
        res.render("register", {error: req.flash('error')});
    });

    app.get("/logout", function (req, res) {
        if(config.debug) console.log("logout", req.isAuthenticated(), req.user);
        req.logout();
        res.redirect("/");
    });

    app.get("/chat", function (req, res) {
        if(config.debug) console.log("chat", req.isAuthenticated(), req.user);
        if(req.isAuthenticated()) res.render("chat", {user: req.user});
        else res.redirect("/login");
    });

    // app.post('/login', passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }));

    app.post('/login', recaptcha.middleware.verify, function(req, res) {

        // if(req.recaptcha.error) {
        //     req.flash('loginMessage', {'type':'danger','mss':'Lỗi CAPTCHA!'});
        //     res.redirect('/login');
        //     return;
        // }

        let account = req.body.account;
        let password = req.body.password;

        am.login(account, password).then(user => {
            req.logIn(user, function(err){
                if(err) return res.redirect('/login');
                return res.redirect('/');
            });
        }, err => {
            if(err.message) req.flash('error', err.message);
            return res.redirect('/login');
        });

        // passport.authenticate('login', function(err, user) {
        //     if(err) {
        //         console.log(err);
        //         if(err.message) req.flash('error', err.message);
        //         return res.redirect('/login');
        //     }
        //
        //     if(!user) return res.redirect('/login');
        //
        //     // if(user.twofactor && user.twofactor.enable){
        //     //     req.flash('twofactor', {'email': req.body.email, 'pass': req.body.password});
        //     //     return res.redirect('/login');
        //     // }
        //
        //     req.logIn(user, function(err){
        //         if(err) return res.redirect('/login');
        //         return res.redirect('/');
        //     });
        //
        // })(req, res);
    });

    app.post("/register", recaptcha.middleware.verify, function(req, res) {

        // if(req.recaptcha.error) {
        //     req.flash('loginMessage', {'type':'danger','mss':'Lỗi CAPTCHA!'});
        //     res.redirect('/login');
        //     return;
        // }

        let display_name = req.body.display_name;
        let username = req.body.username;
        let email = req.body.email;
        let phone = req.body.phone;
        let password = req.body.password;

        am.register(display_name, username, email, phone, password).then(user => {
            req.logIn(user, function(err){
                if(err) return res.redirect('/register');
                return res.redirect('/');
            });
        }, err => {
            if(err.message) req.flash('error', err.message);
            return res.redirect('/register');
        });

        // passport.authenticate('register', function(err, user) {
        //     if(err) {
        //         if(err.message) req.flash('error', err);
        //         return res.redirect('/register');
        //     }
        //
        //     if(!user) return res.redirect('/register');
        //
        //     req.logIn(user, function(err){
        //         if(err) return res.redirect('/register');
        //         return res.redirect('/');
        //     });
        //
        // })(req, res);
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

};

// passport.use('login', new LocalStrategy(
//     function(account, password, done) {
//         am.login(account, password).then((user)=>{
//             done(null, user);
//         }, (err)=>{
//             done(err);
//         });
//     }
// ));

passport.use('facebook', new FacebookStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL: config.host + "auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        if(config.debug) console.log(accessToken);
        am.loginWithFacebook(profile).then(user => {
            done(null, user);
        }, err => {
            done(err);
        })
    }
));

passport.serializeUser(function(user, done) { // run when req.login(user)
    if(config.debug) console.log("serializeUser", user);
    done(null, user.id); // save id to cookie
});

passport.deserializeUser(function(id, done) { // run when have a request from client, get id from cookie
    if(config.debug) console.log("deserializeUser", id);
    am.findById(id).then(user => {
        done(null, user); // save user to request
    }, err => {
        done(null, null);
    });
});
