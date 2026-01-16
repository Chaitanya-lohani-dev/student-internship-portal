import redis from "redis";

const client = redis.createClient({url: "redis://127.0.0.1:32769"});
client.on("error", err => {
    console.error("Redis error:", err)
    process.exit(1);
});
await client.connect();

export default client;
