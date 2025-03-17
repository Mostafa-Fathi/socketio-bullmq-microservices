const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");

const redisConnection = new Redis({
    host: "127.0.0.1", // Ensure you are using the correct host
    port: 6378,
    maxRetriesPerRequest: null, // Disable retries to avoid connection errors
    enableReadyCheck: false, // Sometimes needed for Redis running in Docker
});
const locationQueue = new Queue("notifications", { connection: redisConnection });

new Worker(
    "locationQueue",
    async (job) => {
        const { driverId, latitude } = job.data;

        if (latitude.startsWith("3")) {
            console.log(`Service A processing update for Driver ${driverId}`);

            await locationQueue.add("notification", {
                driverId,
                message: `Service A processed your location update! Lat: ${latitude}`
            });
        }
    },
    { connection: redisConnection }
);

console.log("Service A running...");
