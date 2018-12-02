let validate = require("./validate");
let define = require("./define");
let strings = require("./strings");
let User = require("./model/user");

module.exports.login = (account, password) => {
    return new Promise((resolve, reject) => {
        let _user = getUser(account);
        User.findOne(_user, function (err, user) {
            if (err) return reject(err);
            if (!user) return reject({ message: strings.incorrect_login, type: define.incorrect_account });
            if (!user.validPassword(password)) return reject({ message: strings.incorrect_login, type: define.incorrect_password });
            return resolve(user);
        });
    })
};

module.exports.register = (account, password) => {
    return new Promise((resolve, reject) => {
        let _user = getUser(account);
        User.findOne(_user, function (err, user) {
            if (err) return reject(err);
            if (user) return reject({ message: strings.incorrect_register, type: define.account_already_exist });

            _user.password = password;

            user = new User(_user);
            user.save(function (err, user) {
                if (err) return reject(err);
                return resolve(user);
            });
        });
    })
};

module.exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function(err, user) {
            if(err) return reject(err);
            return resolve(user);
        });
    })
};

let getUser = (account) => {
    return validate.phone(account) ? {phone:account} : validate.email(account) ? {email:account} : {username:account};
};
