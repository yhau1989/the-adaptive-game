# @tyni/database

Un paquete de base de datos usando Drizzle ORM para conectar con Supabase y crear tablas mediante TypeScript.

## 🚀 Características

- ✅ **Drizzle ORM** - Type-safe SQL con TypeScript
- ✅ **Supabase** - Base de datos PostgreSQL en la nube
- ✅ **Migraciones** - Generación automática de migraciones
- ✅ **Type Safety** - Tipos TypeScript generados automáticamente
- ✅ **Relaciones** - Soporte completo para relaciones entre tablas
- ✅ **Queries Helper** - Funciones predefinidas para operaciones comunes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env
```

## ⚙️ Configuración

1. **Configurar Supabase:**
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Ve a Settings > Database
   - Copia tu Database URL

2. **Configurar variables de entorno:**
   Edita el archivo `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

## 🗄️ Esquema de Base de Datos

### Tablas incluidas:

#### Users

```typescript
- id: UUID (Primary Key)
- email: string (Unique)
- name: string
- avatar: string (Optional)
- createdAt: timestamp
- updatedAt: timestamp
```

#### Posts

```typescript
- id: UUID (Primary Key)
- title: string
- content: text (Optional)
- published: boolean
- authorId: UUID (Foreign Key → users.id)
- createdAt: timestamp
- updatedAt: timestamp
```

## 🛠️ Scripts Disponibles

```bash
# Generar migración basada en cambios de esquema
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:migrate

# Push esquema directamente (desarrollo)
npm run db:push

# Abrir Drizzle Studio (interfaz visual)
npm run db:studio

# Ejecutar ejemplo
npm run dev

# Compilar TypeScript
npm run build

# Verificar tipos
npm run check-types
```

## 📝 Uso Básico

### Importar y usar la base de datos:

```typescript
import {
  db,
  createUser,
  createPost,
  getUserByEmail,
  type NewUser,
  type NewPost,
} from "@tyni/database";

// Crear un usuario
const newUser: NewUser = {
  email: "usuario@ejemplo.com",
  name: "Usuario Ejemplo",
  avatar: "https://ejemplo.com/avatar.jpg",
};

const user = await createUser(newUser);

// Crear un post
const newPost: NewPost = {
  title: "Mi primer post",
  content: "Contenido del post...",
  published: true,
  authorId: user.id,
};

const post = await createPost(newPost);
```

### Queries directas con Drizzle:

```typescript
import { db, users, posts } from "@tyni/database";
import { eq } from "drizzle-orm";

// Query personalizada
const userPosts = await db
  .select()
  .from(posts)
  .where(eq(posts.authorId, userId));
```

## 🔄 Flujo de Trabajo con Migraciones

1. **Modificar esquema** en `src/schema/`:

   ```typescript
   // Agregar nueva columna
   export const users = pgTable("users", {
     // ... campos existentes
     bio: text("bio"), // nueva columna
   });
   ```

2. **Generar migración**:

   ```bash
   npm run db:generate
   ```

3. **Aplicar migración**:
   ```bash
   npm run db:migrate
   ```

## 📂 Estructura del Proyecto

```
apps/database/
├── src/
│   ├── schema/          # Definiciones de tablas
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts
│   ├── queries/         # Funciones helper
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts
│   ├── db.ts           # Configuración de conexión
│   └── index.ts        # Exports principales
├── examples/           # Ejemplos de uso
├── migrations/         # Archivos de migración (generados)
├── drizzle.config.ts   # Configuración de Drizzle
└── package.json
```

## 🎯 Funciones Helper Incluidas

### Usuarios:

- `createUser(user)` - Crear usuario
- `getUserById(id)` - Obtener por ID
- `getUserByEmail(email)` - Obtener por email
- `getAllUsers()` - Obtener todos
- `updateUser(id, updates)` - Actualizar
- `deleteUser(id)` - Eliminar

### Posts:

- `createPost(post)` - Crear post
- `getPostById(id)` - Obtener por ID
- `getPostsByAuthor(authorId)` - Posts por autor
- `getAllPostsWithAuthor()` - Posts con info de autor
- `getPublishedPosts()` - Solo posts publicados
- `updatePost(id, updates)` - Actualizar
- `deletePost(id)` - Eliminar
- `togglePostPublished(id, published)` - Cambiar estado

## 🔍 Drizzle Studio

Para explorar tu base de datos visualmente:

```bash
npm run db:studio
```

Esto abrirá una interfaz web en `https://local.drizzle.studio`

## 📋 Ejemplos

Ver el directorio `examples/` para casos de uso completos.

```bash
# Ejecutar ejemplo básico
npm run dev
```

## 🚨 Notas Importantes

- **Desarrollo**: Usa `npm run db:push` para cambios rápidos
- **Producción**: Siempre usa migraciones (`npm run db:generate` + `npm run db:migrate`)
- **Backup**: Asegúrate de hacer backup antes de aplicar migraciones en producción
- **Tipos**: Los tipos TypeScript se generan automáticamente al compilar

## 🤝 Contribución

1. Crear nueva tabla en `src/schema/`
2. Agregar queries helper en `src/queries/`
3. Exportar en archivos `index.ts`
4. Generar migración
5. Actualizar documentación
