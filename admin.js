const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Admin connected");
});

socket.on("locationUpdate", (message) => {
    console.log(`📢 Admin received update: ${message}`);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
