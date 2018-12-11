let dbuser = "chatapp";
let dbpassword = "chatapp123";

let port = process.env.PORT || 8080;

let useLocal = false;

module.exports = {
    debug: true,
    port: port,
    host: useLocal ? "http://localhost:" + port + "/" : "https://chat-app-ging-nodejs.herokuapp.com/",
    MongoDB_URI: "mongodb://" + dbuser + ":" + dbpassword + "@ds035816.mlab.com:35816/chat_app",
    FACEBOOK_APP_ID: "369568853791001",
    FACEBOOK_APP_SECRET: "22cbe1bbb23cc9a71de9742cb9dd778c"
};