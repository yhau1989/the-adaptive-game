import {
  pgTable,
  varchar,
  timestamp,
  bigint,
  integer,
} from "drizzle-orm/pg-core";
import { game } from "./game";
import { row_status } from "./row-status";
import { product } from "./product";

export const game_configuration = pgTable("game-configuration", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  game_id: bigint("game_id", { mode: "number" })
    .notNull()
    .references(() => game.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  bussiness_name: varchar("bussiness_name", { length: 50 }),
  periods: integer("periods"),
  period_type: varchar("period_type", { length: 10 }),
  product: varchar("name", { length: 20 })
    .notNull()
    .references(() => product.name, {
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
