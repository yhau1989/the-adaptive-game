# Guía de Migraciones - Drizzle + Supabase

## 🚀 Configuración Inicial

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Una vez creado, ve a **Settings > Database**
3. Copia el **Connection string** en el formato URI

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita `.env` y agrega tu URL de conexión:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Push Inicial del Schema

Para la primera vez, puedes hacer push directo del schema:

```bash
npm run db:push
```

> ⚠️ **Nota:** `db:push` es para desarrollo. Para producción siempre usa migraciones.

## 🔄 Flujo de Trabajo con Migraciones

### Desarrollo

1. **Modificar schema** en `src/schema/`
2. **Push cambios** para desarrollo rápido:
   ```bash
   npm run db:push
   ```

### Producción

1. **Modificar schema** en `src/schema/`
2. **Generar migración**:
   ```bash
   npm run db:generate
   ```
3. **Revisar migración** generada en `migrations/`
4. **Aplicar migración**:
   ```bash
   npm run db:migrate
   ```

## 📝 Crear Nueva Tabla

### Opción 1: Script Automático

```bash
npm run create-table -- productos
```

### Opción 2: Manual

1. **Crear archivo de schema** `src/schema/productos.ts`:

```typescript
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const productos = pgTable("productos", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

2. **Exportar en** `src/schema/index.ts`:

```typescript
export * from "./productos";
```

3. **Crear queries** `src/queries/productos.ts`:

```typescript
import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "../db";
import { productos } from "../schema";

type NewProducto = InferInsertModel<typeof productos>;

export async function createProducto(data: NewProducto) {
  const result = await db.insert(productos).values(data).returning();
  return result[0];
}
// ... más queries
```

4. **Exportar queries** en `src/queries/index.ts`

5. **Generar migración**:

```bash
npm run db:generate
```

6. **Aplicar migración**:

```bash
npm run db:migrate
```

## 🔍 Comandos Útiles

### Ver Base de Datos Visualmente

```bash
npm run db:studio
```

### Verificar Tipos TypeScript

```bash
npm run check-types
```

### Ejecutar Ejemplo

```bash
npm run dev
```

## 🛡️ Mejores Prácticas

### ✅ Hacer

- Usar migraciones en producción
- Hacer backup antes de migrar
- Revisar migraciones generadas
- Usar tipos TypeScript generados
- Nombrar tablas y columnas en inglés (opcional)

### ❌ No hacer

- Usar `db:push` en producción
- Editar migraciones ya aplicadas
- Borrar migraciones del historial
- Cambiar nombres de tabla sin migración

## 🚨 Solución de Problemas

### Error de conexión

- Verifica que `DATABASE_URL` esté correcta
- Asegúrate que Supabase esté activo
- Verifica que la contraseña no tenga caracteres especiales sin escapar

### Error de migración

- Revisa los logs en la consola
- Verifica que no haya conflictos de nombres
- Asegúrate de que la migración sea compatible

### Tipos TypeScript incorrectos

```bash
# Regenerar tipos
npm run build
```

# Scripts Disponibles

- **npm run db:generate** - Generar migraciones
- **npm run db:migrate** - Aplicar migraciones
- **npm run db:push** - Push directo (desarrollo)
- **npm run db:studio** - Interfaz visual de la BD
- **npm run create-table** -- nombre - Crear nueva tabla
- **npm run dev** - Ejecutar ejemplo
- **npm run build** - Compilar TypeScript

# Steps

1. rm -rf migrations
2. npm run db:generate
3. npm run db:migrate
4. npm run db:seed
