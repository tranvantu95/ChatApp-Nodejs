let express = require("express");
let app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// lấy thông tin từ form HTML
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let session = require("express-session");
app.use(session({ secret: "cats" , resave: true, saveUninitialized: true}));

let passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

let flash = require('connect-flash');
app.use(flash());

let config = require("./app/utils/config");
let server = require("http").Server(app);
server.listen(config.port, ()=>{
    console.log('Server listening at port %d', config.port);
});
require("./app/socket")(server);
require("./app/routes")(app);
require("./app/api")(app);
require("./app/db")();