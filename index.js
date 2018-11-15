var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
server.listen(process.env.PORT || 8080);

app.get("/", function (req, res) {
    res.render("chat");
});

// var fs = require('fs');

// var ss = require('socket.io-stream');
// ss.forceBase64 = true;

var io = require("socket.io")(server);

// var nsp = io.of('/my-namespace');
//
// nsp.on('connection', function(socket){
//     console.log("namespace connection " + socket.id);
// });

var users = [];

var streamer = {};

io.on("connection", function (socket) {
    console.log("connection", socket.id);

    // {//Room
    //     console.log(socket.adapter.rooms); // get all rooms
    //     console.log(io.sockets.adapter.rooms); // get all rooms
    //
    //     var rooms = [];
    //     for(var roomName in io.sockets.adapter.rooms) rooms.push(roomName);
    //     console.log("all rooms: ", roomName);
    //
    //     socket.join("room_name"); // create or join to room
    //     socket.leave("room_name"); // leave or delete room
    // }


    socket.on("disconnect", function () {
        console.log("disconnect", socket.id);
    });

    socket.on("client-send-data", function (data) {
        console.log(data);

        // socket.emit("server-send-data", data); // send to this socket
        // socket.broadcast.emit("server-send-data", data); // send to other sockets
        // io.sockets.emit("server-send-data", data); // send to all sockets
        // io.sockets.in("room_name").emit("server-send-data", data); // send to room
        // io.to("socket_id").emit("server-send-data", data); // send to socket_id
    });

    socket.on("streamer-connect", function () {
        console.log("streamer-connect", socket.id);
        streamer.socket = socket;
    });

    socket.on("question", function (data, func) {
        console.log("question", data);
        func("ok!");

        socket.broadcast.emit("question", data);
    });

    socket.on("answer", function (data) {
        console.log("answer", data);

        if(streamer.socket) streamer.socket.emit("answer", data);
    })

    // socket.on("client-send-username", function (username) {
    //     console.log(username);
    //
    //     if(users.indexOf(username) >= 0) {
    //         socket.emit("server-send-register-failed");
    //     }
    //     else {
    //         users.push(username);
    //         socket.username = username;
    //         socket.emit("server-send-register-success", username);
    //
    //         io.sockets.emit("server-send-users-list", users);
    //
    //     }
    // });
    //
    // socket.on("client-send-logout", function () {
    //     users.splice(users.indexOf(socket.username), 1);
    //     socket.username = undefined;
    //     socket.emit("server-send-logout-success");
    //
    //     socket.broadcast.emit("server-send-users-list", users);
    // });
    //
    // socket.on("client-send-message", function (message) {
    //     io.sockets.emit("server-send-message", {username:socket.username, message:message});
    //     // io.sockets.in("room_name").emit("server-send-message", {username:socket.username, message:message});
    // });

});
