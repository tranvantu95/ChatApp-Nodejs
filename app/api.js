let config = require("./utils/config");
let define = require("./utils/define");
let am = require("./account-manager");

module.exports = function(app) {

    app.post("/api/login", (req, res)=>{
        let account = req.body.username;
        let password = req.body.password;
        if(config.debug) console.log("/api/login", account, password);

        am.login(account, password).then((user) => {
            res.send(new Response(define.success, "", user).toJson());
        }, (err) => {
            res.send(new Response(define.failed, err.message).toJson());
        })
    });

    app.post("/api/register", (req, res)=>{
        let account = req.body.username;
        let password = req.body.password;
        if(config.debug) console.log("/api/register", account, password);

        am.register(account, password).then((user) => {
            res.send(new Response(define.success, "", user).toJson());
        }, (err) => {
            res.send(new Response(define.failed, err.message).toJson());
        })
    });

};

let Response = function (status, message, data) {
    this.status = status || 0;
    this.message = message || "";
    this.data = data;

    this.toJson = () => JSON.stringify(this);
};