import { DiscordUser } from "@/types/discord";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: DiscordUser | null;
    }
  }
}
