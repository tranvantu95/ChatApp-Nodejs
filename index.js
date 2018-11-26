let express = require("express");
let app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// lấy thông tin từ form HTML
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

var session = require("express-session");
app.use(session({ secret: "cats" , resave: true, saveUninitialized: true}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

let server = require("http").Server(app);
server.listen(process.env.PORT || 8080);
require("./app/socket")(server);
require("./app/routes")(app);
require("./app/db")();