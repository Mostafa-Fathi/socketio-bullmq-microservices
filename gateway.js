const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Update Redis connection with required BullMQ options
const redisConnection = new Redis({
    host: "127.0.0.1", // Ensure you are using the correct host
    port: 6379,
    maxRetriesPerRequest: null, // Disable retries to avoid connection errors
    enableReadyCheck: false, // Sometimes needed for Redis running in Docker
});

const notificationQueue = new Queue("notifications", { connection: redisConnection });

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Worker to listen for completed jobs from Service B
new Worker("notifications", async (job) => {
    console.log(`Sending update to clients: ${job.data.message}`);
    io.emit("update", job.data); // Broadcast data to all connected clients
}, { connection: redisConnection });

server.listen(5000, () => console.log("API Gateway running on port 5000"));