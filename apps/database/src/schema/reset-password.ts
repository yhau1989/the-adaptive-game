import { pgTable, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
import { row_status } from "./row-status";

export const reset_password = pgTable("reset-password", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 300 }).notNull(),
  hash: varchar("hash").notNull(),
  status: varchar("status", { length: 10 })
    .notNull()
    .references(() => row_status.status, {
      onDelete: "no action",
      onUpdate: "no action",
    })
    .default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
