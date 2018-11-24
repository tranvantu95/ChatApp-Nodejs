
let local = true;

let socket = io(local ? "http://localhost:8080" : "https://chat-app-ging-nodejs.herokuapp.com");

socket.on("connect", () => {
    console.log("connect", socket.id);

    socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
    });

    socket.emit("streamer-connect");

    socket.on("answer", (data) => {
        $("#answer").html(data);
    });

});

$(document).ready(() => {

    $("#btn_send_question").click(() => {
        if(socket.connected) {
            let data = $("#question").val();
            if(data.length > 0) {
                socket.emit("question", data, (message) => {
                    console.log("message", message);
                });
            }
        }
    });

});
