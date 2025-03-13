const { Queue } = require("bullmq");
const Redis = require("ioredis");
require("dotenv").config();
const redisConnection = new Redis({
    host: "127.0.0.1", // Ensure you are using the correct host
    port: 6379,
    maxRetriesPerRequest: null, // Disable retries to avoid connection errors
    enableReadyCheck: false, // Sometimes needed for Redis running in Docker
});

const notificationQueue = new Queue("notifications", { connection: redisConnection });

async function sendNotification() {
    const job = await notificationQueue.add("newEvent", {
        message: `Event from Service A at ${new Date().toISOString()}`
    });

    console.log(`Job added: ${job.id}`);
}

// Simulate event every 5 seconds
setInterval(sendNotification, 5000);
