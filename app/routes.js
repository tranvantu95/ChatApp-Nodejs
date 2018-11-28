let Recaptcha = require('express-recaptcha').Recaptcha;
let recaptcha = new Recaptcha('6LdCNGkUAAAAAFSUV8w9_bldARR_nLBlw1yGtHIQ', '6LdCNGkUAAAAAFRHHN0V671w59Ibyob9bCylUWCo');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("./model/user");
let am = require("./account-manager");


module.exports = function(app) {

    app.get("/", function (req, res) {
        console.log("home", req.isAuthenticated(), req.user);
        res.render("home");
    });

    app.get("/login", function (req, res) {
        console.log("login", req.isAuthenticated(), req.user, req.flash('message'));
        res.render("login");
    });

    app.get("/logout", function (req, res) {
        console.log("logout", req.isAuthenticated(), req.user);
        req.logout();
        res.redirect("/");
    });

    app.get("/register", function (req, res) {
        console.log("register", req.isAuthenticated(), req.user, req.flash('message'));
        res.render("register");
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

        passport.authenticate('login', function(err, user) {
            if(err) {
                if(err.message) req.flash('message', err.message);
                return res.redirect('/login');
            }
            if(!user) return res.redirect('/login');

            if(user.twofactor && user.twofactor.enable){
                req.flash('twofactor', {'email': req.body.email, 'pass': req.body.password});
                return res.redirect('/login');
            }

            req.logIn(user, function(err){
                if(err) return res.redirect('/login');
                return res.redirect('/');
            });

        })(req, res);
    });

    app.post("/register", recaptcha.middleware.verify, function(req, res) {

        // if(req.recaptcha.error) {
        //     req.flash('loginMessage', {'type':'danger','mss':'Lỗi CAPTCHA!'});
        //     res.redirect('/login');
        //     return;
        // }

        passport.authenticate('register', function(err, user) {
            if(err) {
                if(err.message) req.flash('message', err.message);
                return res.redirect('/register');
            }
            if(!user) return res.redirect('/register');

            req.logIn(user, function(err){
                if(err) return res.redirect('/register');
                return res.redirect('/');
            });

        })(req, res);
    });

};

passport.use('login', new LocalStrategy(
    function(account, password, done) {
        console.log('authenticate login', account, password);

        am.login(account, password).then((user)=>{
            done(null, user);
        }, (err)=>{
            done(err);
        });
    }
));

passport.use('register', new LocalStrategy(
    function(account, password, done) {
        console.log('authenticate register', account, password);

        am.register(account, password).then((user)=>{
            done(null, user);
        }, (err)=>{
            done(err);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("serializeUser", user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializeUser", id);
    am.findById(id).then((user)=>{
        done(null, user);
    },(err)=>{
        done(err);
    });
});
