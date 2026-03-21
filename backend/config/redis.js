import redis from "redis";
import logger from "./logger.js";

const client = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});
client.on("error", err => {
    logger.error("Redis error:", err)
});

await client.connect();
logger.info("Redis connected successfully");

export default client;
