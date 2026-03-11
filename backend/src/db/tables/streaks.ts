import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const streaks = pgTable("streaks", {
  userId: varchar("user_id", { length: 32 })
    .primaryKey()
    .references(() => users.id),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastActivityDate: varchar("last_activity_date", { length: 10 }), // "YYYY-MM-DD"
});