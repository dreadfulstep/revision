import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),

  userId: varchar("user_id", { length: 32 })
    .notNull()
    .references(() => users.id),

  accessToken: varchar("access_token", { length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});