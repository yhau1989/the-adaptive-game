import { pgTable, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
import { user } from "./user";

export const user_pws = pgTable("user-pws", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  user_id: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "no action" }),
  pwd: varchar("pwd").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
