let config = require("./utils/config");
let define = require("./utils/define");
let am = require("./account-manager");
let passport = require('passport');
let FacebookTokenStrategy = require('passport-facebook-token');

module.exports = function(app) {

    app.post("/api/login", (req, res) => {
        let account = req.body.account;
        let password = req.body.password;
        if(config.debug) console.log("/api/login", account, password);

        am.login(account, password).then(user => {
            res.send(new Response(define.success, "", user.getLoginResponse()).toJson());
        }, err => {
            res.send(new Response(define.failed, err ? err.message : "").toJson());
        })
    });

    app.post("/api/register", (req, res) => {
        let display_name = req.body.display_name;
        let username = req.body.username;
        let email = req.body.email;
        let phone = req.body.phone;
        let password = req.body.password;
        if(config.debug) console.log("/api/register", display_name, username, email, phone, password);

        am.register(display_name, username, email, phone, password).then(user => {
            res.send(new Response(define.success, "", user.getLoginResponse()).toJson());
        }, err => {
            res.send(new Response(define.failed, err ? err.message : "").toJson());
        })
    });

    app.post('/api/login/facebook', (req, res) => {
        let access_token = req.body.access_token;
        if(config.debug) console.log("/api/login/facebook", access_token);

        passport.authenticate('facebook-token', (err, user) => {
            if(user) res.send(new Response(define.success, "", user.getLoginResponse()).toJson());
            else res.send(new Response(define.failed, err ? err.message : "").toJson());
        })(req, res);
    });

};

passport.use('facebook-token', new FacebookTokenStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
        am.loginWithFacebook(profile).then(user => {
            done(null, user);
        }, err => {
            done(err);
        })
    }
));

let Response = function (status, message, data) {
    this.status = status || 0;
    this.message = message || "";
    this.data = data;

    this.toJson = () => JSON.stringify(this);
};