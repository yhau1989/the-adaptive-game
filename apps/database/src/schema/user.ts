import { pgTable, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
import { rol } from "./rol";
import { row_status } from "./row-status";

export const user = pgTable("user", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  lastname: varchar("lastname", { length: 200 }).notNull(),
  email: varchar("email", { length: 300 }).notNull().unique(),
  dni_number: varchar("dni_number", { length: 30 }).unique(),
  rol: varchar("rol", { length: 20 })
    .notNull()
    .references(() => rol.rol, { onDelete: "no action", onUpdate: "cascade" }),
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
