let express = require("express");
let app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
server.listen(process.env.PORT || 8080);
require("./app/socket")(server);
require("./app/routes")(app);

let config = require("./app/config/config");
console.log("MongoDB_URI", config.MongoDB_URI);

let mongoose = require('mongoose');
mongoose.connect(config.MongoDB_URI, {useNewUrlParser:true});

let user = require("./app/model/user");
console.log("End");
