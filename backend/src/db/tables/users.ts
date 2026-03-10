import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 32 }).primaryKey(), // Discord ID
  username: varchar("username", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
