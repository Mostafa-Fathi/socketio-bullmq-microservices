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
        const { driverId, longitude } = job.data;

        if (longitude.endsWith("5")) {
            console.log(`Service B processing update for Driver ${driverId}`);

            await locationQueue.add("notification", {
                driverId,
                message: `Service B processed your location update! Long: ${longitude}`
            });
        }
    },
    { connection: redisConnection }
);

console.log("Service B running...");
