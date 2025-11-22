import {
  pgTable,
  varchar,
  timestamp,
  bigint,
  integer,
} from "drizzle-orm/pg-core";
import { game_configuration } from "./game-configuration";
import { row_status } from "./row-status";

export const order_restriction_config = pgTable("order-restriction-config", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  configuration_game_id: bigint("configuration_game_id", { mode: "number" })
    .notNull()
    .references(() => game_configuration.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  minimum: integer("minimum"),
  maximum: integer("maximum"),
  batch_size: integer("batch_size"),
  node_type: varchar("node_type", { length: 50 }),
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
