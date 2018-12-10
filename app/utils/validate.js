
module.exports.displayName = (displayName) => {
    return typeof displayName === "string"
        && displayName.length >= 1;
};

module.exports.username = (username) => {
    let regex = /^[0-9A-Za-z\-]+$/;
    let regex2 = /^[A-Za-z\-]+$/;
    return typeof username === "string"
        && username.length >= 4 && username.length <= 16
        && regex2.test(username.substring(0,1))
        && regex.test(username);
};

module.exports.password = (password) => {
    return typeof password === "string"
        && password.length >= 4 && password.length <= 32;
};

module.exports.phone = (phone) => {
    let regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return regex.test(phone);
};

module.exports.email = (email) => {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
};