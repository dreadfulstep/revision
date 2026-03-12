import 'dotenv/config';

const env = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",

  discordRedirectUrl: process.env.DISCORD_REDRECT_URL!,
  discordClientId: process.env.DISCORD_CLIENT_ID!,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET!,

  localDiscordRedirectUrl: process.env.LOCAL_DISCORD_REDIRECT_URL!,
  localFrontendUrl: process.env.LOCAL_FRONTEND_URL!,

  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,

  encryptionSecret: process.env.ENCRYPTION_SECRET!,
  sessionSecret: process.env.SESSION_SECRET!,

  frontendUrl: process.env.FRONTEND_URL!
};

export default env;