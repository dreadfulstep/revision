import { createClient } from "redis";
import env from "@/utils/env";

const redis = createClient({
  url: env.redisUrl,
});

redis.on("error", (err) => console.error("Redis error:", err));

async function connect() {
  if (!redis.isOpen) await redis.connect();
}

connect();

export default redis;