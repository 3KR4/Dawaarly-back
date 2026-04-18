const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
  console.log("🔴 Redis error:", err.message);
});

module.exports = redis;