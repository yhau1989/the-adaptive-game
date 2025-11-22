import { pgTable, varchar, timestamp, bigint, text } from "drizzle-orm/pg-core";
import { row_status } from "./row-status";

export const product = pgTable("product", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 20 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 250 }).notNull(),
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
