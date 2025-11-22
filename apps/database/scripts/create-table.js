#!/usr/bin/env node

/**
 * Script para crear una nueva tabla con Drizzle
 * Uso: npm run create-table -- nombre-tabla
 */

const fs = require("fs");
const path = require("path");

const tableName = process.argv[2];

if (!tableName) {
  console.error("❌ Error: Debes especificar el nombre de la tabla");
  console.log("Uso: npm run create-table -- nombre-tabla");
  process.exit(1);
}

// Convertir nombre a diferentes formatos
const kebabCase = tableName.toLowerCase().replace(/[^a-z0-9]/g, "-");
const camelCase = kebabCase.replace(/-([a-z])/g, (_, letter) =>
  letter.toUpperCase()
);
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const pluralName = tableName.endsWith("s") ? tableName : tableName + "s";

// Template para nueva tabla
const tableTemplate = `import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const ${camelCase} = pgTable("${kebabCase}", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
`;

// Template para queries
const queriesTemplate = `import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "../db";
import { ${camelCase} } from "../schema";

type New${pascalCase} = InferInsertModel<typeof ${camelCase}>;
type Update${pascalCase} = Partial<Omit<New${pascalCase}, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Create a new ${tableName}
 */
export async function create${pascalCase}(data: New${pascalCase}) {
  const result = await db.insert(${camelCase}).values(data).returning();
  return result[0];
}

/**
 * Get ${tableName} by ID
 */
export async function get${pascalCase}ById(id: string) {
  const result = await db.select().from(${camelCase}).where(eq(${camelCase}.id, id));
  return result[0];
}

/**
 * Get all ${pluralName}
 */
export async function getAll${pascalCase}s() {
  return await db.select().from(${camelCase});
}

/**
 * Update ${tableName}
 */
export async function update${pascalCase}(id: string, updates: Update${pascalCase}) {
  const result = await db
    .update(${camelCase})
    .set(updates)
    .where(eq(${camelCase}.id, id))
    .returning();
  return result[0];
}

/**
 * Delete ${tableName}
 */
export async function delete${pascalCase}(id: string) {
  const result = await db.delete(${camelCase}).where(eq(${camelCase}.id, id)).returning();
  return result[0];
}
`;

// Crear archivos
const schemaDir = path.join(__dirname, "..", "src", "schema");
const queriesDir = path.join(__dirname, "..", "src", "queries");

// Crear archivo de tabla
const tablePath = path.join(schemaDir, `${kebabCase}.ts`);
fs.writeFileSync(tablePath, tableTemplate);

// Crear archivo de queries
const queriesPath = path.join(queriesDir, `${kebabCase}.ts`);
fs.writeFileSync(queriesPath, queriesTemplate);

console.log(`✅ Tabla '${tableName}' creada exitosamente!`);
console.log(`📁 Archivo de schema: src/schema/${kebabCase}.ts`);
console.log(`📁 Archivo de queries: src/queries/${kebabCase}.ts`);
console.log("");
console.log("🔄 Próximos pasos:");
console.log("1. Personaliza los campos de la tabla en el archivo de schema");
console.log("2. Agrega la exportación en src/schema/index.ts");
console.log("3. Agrega la exportación en src/queries/index.ts");
console.log("4. Ejecuta: npm run db:generate");
console.log("5. Ejecuta: npm run db:migrate");
