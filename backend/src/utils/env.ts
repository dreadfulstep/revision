import 'dotenv/config';

const env = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",

  discordRedirectUrl: process.env.DISCORD_REDRECT_URL!,
  discordClientId: process.env.DISCORD_CLIENT_ID!,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET!,

  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,
};

export default env;