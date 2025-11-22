import { pgTable, varchar } from "drizzle-orm/pg-core";

export const row_status = pgTable("row-status", {
  status: varchar("status", { length: 10 }).primaryKey(),
});
