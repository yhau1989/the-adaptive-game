import {
  pgTable,
  varchar,
  timestamp,
  bigint,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { row_status } from "./row-status";

export const node_type = pgTable("node-type", {
  name: varchar("name", { length: 50 }).notNull().primaryKey(),
  description: varchar("description", { length: 250 }).notNull(),
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
