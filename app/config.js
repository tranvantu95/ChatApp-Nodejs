let dbuser = "chatapp";
let dbpassword = "chatapp123";

module.exports = {
    debug: true,
    port: process.env.PORT || 8080,
    MongoDB_URI: "mongodb://" + dbuser + ":" + dbpassword + "@ds035816.mlab.com:35816/chat_app",
};