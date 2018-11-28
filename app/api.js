let auth = require("./account-manager");

module.exports = function(app) {

    app.post("/api/login", (req, res)=>{
        let account = req.body.account;
        let password = req.body.password;

        auth.login(account, password).then((user)=>{

        }, (err)=>{

        })
    });

};