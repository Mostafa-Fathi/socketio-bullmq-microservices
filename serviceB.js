const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");
require("dotenv").config();

const redisConnection = new Redis({
    host: "127.0.0.1", // Ensure you are using the correct host
    port: 6379,
    maxRetriesPerRequest: null, // Disable retries to avoid connection errors
    enableReadyCheck: false, // Sometimes needed for Redis running in Docker
});
const notificationQueue = new Queue("notifications", { connection: redisConnection });

new Worker("notifications", async (job) => {
    console.log(`Processing job: ${job.id} - ${job.data.message}`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send processed message back to Gateway via queue
    await notificationQueue.add("processedEvent", {
        message: `Processed: ${job.data.message}`
    });

}, { connection: redisConnection });
