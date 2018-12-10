let validate = require("./utils/validate");
let define = require("./utils/define");
let strings = require("./utils/strings");
let User = require("./model/user");

module.exports.login = (account, password) => {
    return new Promise((resolve, reject) => {
        if(!account) return reject(new Error("Account is empty!"));
        if(!password) return reject(new Error("Password is empty!"));

        findUser(account, account, account).then(user => {
            if (!user) return reject(new Error("Incorrect account!"));
            if (!user.validPassword(password)) return reject(new Error("Incorrect password!"));
            return resolve(user);
        }, err => {
            return reject(err);
        })

        // let _user = getUser(account);
        // User.findOne(_user, function (err, user) {
        //     if (err) return reject(err);
        //     if (!user) return reject({ message: strings.incorrect_login, type: define.incorrect_account });
        //     if (!user.validPassword(password)) return reject({ message: strings.incorrect_login, type: define.incorrect_password });
        //     return resolve(user);
        // });
    })
};

module.exports.register = (display_name, username, email, phone, password) => {
    return new Promise((resolve, reject) => {

        if(!display_name) return reject(new Error("DisplayName is empty!"));

        if(!username && !email && !phone) reject(new Error("Account is empty!"));

        if(!password) return reject(new Error("Password is empty!"));

        findUser(username, email, phone).then(user => {
            if(user) {
                if(username && username === user.username) return reject(new Error("Username already exist!"));
                if(email && email === user.email) return reject(new Error("Email already exist!"));
                if(phone && phone === user.phone) return reject(new Error("Phone already exist!"));
                return reject(new Error("Account already exist!"));
            }

            if(!validate.displayName(display_name)) return reject(new Error("Invalidate DisplayName!"));
            if(username && !validate.username(username)) return reject(new Error("Invalidate Username!"));
            if(email && !validate.email(email)) return reject(new Error("Invalidate Email!"));
            if(phone && !validate.phone(phone)) return reject(new Error("Invalidate Phone!"));
            if(!validate.password(password)) return reject(new Error("Invalidate Password!"));

            let _user = {
                display_name:display_name,
                username:username,
                email:email,
                phone:phone,
                password:password
            };

            user = new User(_user);
            user.save(function (err, user) {
                if (err) return reject(err);
                return resolve(user);
            });

        }, err => {
            return reject(err);
        });

        // let _user = getUser(account);
        // User.findOne(_user, function (err, user) {
        //     if (err) return reject(err);
        //     if (user) return reject({ message: strings.incorrect_register, type: define.account_already_exist });
        //
        //     _user.password = password;
        //
        //     user = new User(_user);
        //     user.save(function (err, user) {
        //         if (err) return reject(err);
        //         return resolve(user);
        //     });
        // });
    })
};

module.exports.fast_register = (account, password) => {
    return new Promise((resolve, reject) => {

        if(!account) reject(new Error("Account is empty!"));

        if(!password) return reject(new Error("Password is empty!"));

        let _user = getUser(account);
        if(!_user) return reject(new Error("Invalidate Account!"));

        User.findOne(_user, function (err, user) {
            if (err) return reject(err);

            if (user) {
                if(_user.username) return reject(new Error("Username already exist!"));
                if(_user.email) return reject(new Error("Email already exist!"));
                if(_user.phone) return reject(new Error("Phone already exist!"));
                return reject(new Error("Account already exist!"));
            }

            _user.display_name = account;
            _user.password = password;

            user = new User(_user);
            user.save(function (err, user) {
                if (err) return reject(err);
                return resolve(user);
            });
        });
    })
};

module.exports.loginWithFacebook = (profile) => {
    return new Promise((resolve, reject) => {
        if(!profile) reject(new Error("Profile is null!"));
        if(!profile.id) reject(new Error("Profile.id is null!"));
        if(!profile.displayName) reject(new Error("Profile.displayName is null!"));

        User.findOne({facebook_id:profile.id}, function (err, user) {
            if (err) return reject(err);
            if (user) return resolve(user);

            let _user = {
                display_name: profile.displayName,
                facebook_id: profile.id
            };

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

let findByUsername = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({username:username}, function(err, user) {
            if(err) return reject(err);
            return resolve(user);
        });
    })
};

let findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({email:email}, function(err, user) {
            if(err) return reject(err);
            return resolve(user);
        });
    })
};

let findByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        User.findOne({phone:phone}, function(err, user) {
            if(err) return reject(err);
            return resolve(user);
        });
    })
};

let findUser = async function(username, email, phone) {
    try {
        let user = null;

        if (username) {
            user = await findByUsername(username);
            if(user) return Promise.resolve(user);
        }

        if (email) {
            user = await findByEmail(email);
            if(user) return Promise.resolve(user);
        }

        if (phone) {
            user = await findByPhone(phone);
            if(user) return Promise.resolve(user);
        }

        return Promise.resolve(user);
    }
    catch (e) {
        return Promise.reject(e);
    }
};

let getUser = (account) => {
    return validate.phone(account) ? {phone:account}
            : validate.email(account) ? {email:account}
            : validate.username(account) ? {username:account}
            : null;
};
