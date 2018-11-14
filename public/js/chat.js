
let local = true;

let socket = io(local ? "http://localhost:8080" : "https://nodejswebrtc.herokuapp.com");

socket.on("connect", () => {
    console.log("connect", socket.id);

    socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
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
