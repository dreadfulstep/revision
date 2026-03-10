import { createClient } from "redis";
import env from "@/utils/env";

const client = createClient({
  url: env.redisUrl,
});

client.on("error", (err) => console.error("Redis error:", err));

async function connect() {
  if (!client.isOpen) await client.connect();
}

connect();

export default client;