const Redis = require("ioredis");

const redis = new Redis({
    host: "34.134.51.131", // Use localhost for Docker
    port: 32768
});

redis.ping()
    .then((res) => console.log("Redis Connected:", res)) // Should print "PONG"
    .catch((err) => console.error("Redis Error:", err));


// check redis version
redis.info("server")
    .then((res) => {
        const version = res.split("\n").find((line) => line.startsWith("redis_version:"));
        console.log("Redis Version:", version);
    })