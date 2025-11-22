import {
  pgTable,
  varchar,
  timestamp,
  bigint,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { row_status } from "./row-status";
import { node_type } from "./node-type";
import { game } from "./game";

export const owner = pgTable("owner", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  game_id: bigint("game_id", { mode: "number" })
    .notNull()
    .references(() => game.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  name: varchar("name", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 100 }).notNull(),
  dni_number: varchar("dni_number", { length: 30 }).unique().notNull(),
  email: varchar("email", { length: 300 }).unique().notNull(),
  phone: varchar("phone", { length: 15 }),
  company_name: varchar("company_name", { length: 150 }),
  node_type: varchar("node_type", { length: 50 })
    .notNull()
    .references(() => node_type.name, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
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
