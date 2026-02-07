import redis from "redis";

const client = redis.createClient();
client.on("error", err => {
    console.error("Redis error:", err)
    process.exit(1);
});
await client.connect();
console.log("Redis connected successfully");

export default client;
