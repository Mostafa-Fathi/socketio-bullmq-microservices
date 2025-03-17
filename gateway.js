const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Queue, Worker } = require("bullmq");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Redis connection
const redisConnection = new Redis({
    host: "127.0.0.1", // Ensure you are using the correct host
    port: 6378,
    maxRetriesPerRequest: null, // Disable retries to avoid connection errors
    enableReadyCheck: false, // Sometimes needed for Redis running in Docker
});
// BullMQ queue
const locationQueue = new Queue("locationQueue", { connection: redisConnection });

// WebSocket connections
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Driver joins their personal room
    socket.on("joinRoom", (driverId) => {
        socket.join(`ride-${driverId}`);
        console.log(`Driver ${driverId} joined room ride-${driverId}`);
    });

    // Handle location updates from drivers
    socket.on("updateLocation", async (data) => {
        console.log(`Received location update from Driver ${data.driverId}`);
        await locationQueue.add("locationUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Workers to listen for processed location updates
const notificationWorker = new Worker(
    "notifications",
    async (job) => {
        const { driverId, message } = job.data;
        console.log(`Sending update to Driver ${driverId}: ${message}`);
        io.to(`ride-${driverId}`).emit("locationUpdate", message);
    },
    { connection: redisConnection }
);

server.listen(5000, () => console.log("API Gateway running on port 5000"));
