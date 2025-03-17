const io = require("socket.io-client");

const driverId = "123"; // Unique ID for the driver
const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Driver connected");
    socket.emit("joinRoom", driverId);

    setInterval(() => {
        const latitude = Math.random().toFixed(6).toString();
        const longitude = Math.random().toFixed(6).toString();

        console.log(`Sending location: Lat ${latitude}, Long ${longitude}`);
        socket.emit("updateLocation", { driverId, latitude, longitude });
    }, 5000);
});

socket.on("locationUpdate", (message) => {
    console.log(`🚀 Update from server: ${message}`);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
