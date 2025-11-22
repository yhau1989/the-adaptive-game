import { pgTable, varchar } from "drizzle-orm/pg-core";

export const rol = pgTable("rol", {
  rol: varchar("rol", { length: 20 }).primaryKey(),
  description: varchar("description", { length: 100 }),
});
