# AGENTS.md

Este archivo define cómo cualquier agente de IA (Claude Code, Cursor, Copilot, etc.) debe trabajar en este repositorio. Es la fuente de verdad sobre arquitectura, convenciones y reglas no negociables. Léelo completo antes de tocar código. **Sustituye** al AGENTS.md por defecto que genera `create-turbo` y a cualquier versión anterior de este mismo archivo.

> Auditado en septiembre 2026 contra el estado real del repo `the-adaptive-game` (rama `main`). Antes de instalar nada, corre `pnpm outdated -r` y confirma que sigues en la última versión estable de cada paquete — las versiones de referencia de abajo son solo el punto de partida.

---

## 1. Qué es este proyecto

**The Adaptive Game** es una plataforma web para correr partidas del **Beer Distribution Game** (el juego de simulación de cadena de suministro del MIT) de forma digital y configurable. Un `owner` (facilitador/profesor) crea una `game`, la configura (costos, tiempos de entrega, stock inicial, restricciones de pedido, notificaciones, eventos) y los jugadores operan los nodos de la cadena (`node-type`: Retail, Mayorista, Distribuidor, Fabricante) ronda a ronda.

## 2. Diagnóstico del estado actual (por qué este documento existe)

El repo tiene ~1 año, y una auditoría de la estructura encontró desalineaciones concretas con el stack objetivo que este AGENTS.md fija. `MIGRATION.md` (raíz del repo) contiene el runbook paso a paso; esta sección resume **qué** está mal, no **cómo** arreglarlo:

| Área                                                    | Estado encontrado                                                                                                                                                      | Objetivo                                                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Gestor de paquetes                                      | `npm` (`package-lock.json` en raíz)                                                                                                                                    | `pnpm` único, workspaces                                                                                             |
| Ubicación del esquema                                   | `apps/database` (se trata como una "app")                                                                                                                              | `packages/db` (es una librería de diseño, no un servicio desplegable)                                                |
| Cliente de datos en runtime                             | `apps/database/src/db.ts` instancia `drizzle(postgres(...))` y `apps/site/lib/db.ts` lo importa y ejecuta queries de Drizzle directamente en Server Components/Actions | Todo pasa por `@supabase/supabase-js` vía `packages/supabase-client`; Drizzle solo en `packages/db` para migraciones |
| Librería de UI                                          | `apps/site/components/ui/*` = shadcn/ui sobre Radix (`components.json`, `@radix-ui/*`, `lucide-react`, `tailwind-merge`)                                               | Ant Design v6 + Tailwind v4 (ver mapeo de componentes abajo)                                                         |
| Autenticación                                           | Custom: `bcryptjs` + `jsonwebtoken` contra las tablas `user`, `user-pws`, `reset-password`, `rol`                                                                      | Ver §7 — decisión pendiente, dos rutas viables                                                                       |
| `@supabase/supabase-js`                                 | Ya está en `node_modules` pero no se usa como cliente principal de datos                                                                                               | Pasa a ser el único cliente de datos en runtime                                                                      |
| Versión de Node                                         | Sin `.nvmrc` ni `engines` fijado                                                                                                                                       | Node 26                                                                                                              |
| Paquete `packages/ui`                                   | Plantilla por defecto de `create-turbo` (button/card/code de ejemplo), no usada por `apps/site`                                                                        | Se convierte en el hogar real de los componentes compartidos (Ant Design + Tailwind)                                 |
| Componentes gigantes                                    | `apps/site/app/dashboard/games/new/game-create-form.tsx` ≈ 70K (un solo archivo)                                                                                       | Trocear en subcomponentes < ~200 líneas cada uno                                                                     |
| `packages/eslint-config` / `packages/typescript-config` | Separados, sin tocar                                                                                                                                                   | Se mantienen así — es un patrón válido, no hace falta fusionarlos en `packages/config`                               |

## 3. Stack objetivo

| Capa                        | Tecnología                                       | Versión de referencia (sep 2026)                        |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| Runtime                     | Node.js                                          | **26.x** (Active LTS desde 28-oct-2026)                 |
| Gestor de paquetes          | pnpm                                             | **10.x** — único gestor permitido                       |
| Monorepo                    | Turborepo                                        | **2.x**                                                 |
| Framework web               | Next.js (`apps/site`)                            | **16.x**, App Router                                    |
| UI runtime                  | React / React DOM                                | **19.2.x**                                              |
| Lenguaje                    | TypeScript                                       | **5.9.x**, `strict: true`                               |
| Estilos utilitarios         | Tailwind CSS                                     | **4.x** (CSS-first)                                     |
| Librería de componentes     | Ant Design (antd)                                | **6.x**                                                 |
| Base de datos               | Supabase (Postgres gestionado)                   | —                                                       |
| Cliente de datos en runtime | `@supabase/supabase-js`                          | **2.8x.x** — único medio de leer/escribir datos         |
| Helpers SSR de Supabase     | `@supabase/ssr`                                  | **0.12.x**                                              |
| Esquema y migraciones       | `drizzle-orm` + `drizzle-kit` (en `packages/db`) | ≥0.45.2 / 1.x — **nunca** como query builder en runtime |

**Claves de Supabase:** las legacy `anon` / `service_role` se retiran a fines de 2026. Usar desde ya `sb_publishable_...` (cliente) y `sb_secret_...` (servidor).

## 4. Estructura de carpetas objetivo

```
.
├── AGENTS.md
├── MIGRATION.md                 # runbook de esta migración, se borra cuando termine
├── apps/
│   └── site/                    # Next.js (se mantiene el nombre y el diseño actuales)
│       ├── app/
│       │   ├── (auth)/login/
│       │   └── dashboard/
│       │       └── games/new/
│       ├── components/          # solo composición específica de apps/site; lo compartible vive en packages/ui
│       ├── lib/
│       │   └── supabase/        # createBrowserClient / createServerClient (wrappers finos sobre @repo/supabase-client)
│       └── ...
├── packages/
│   ├── db/                      # ex apps/database. Fuente de verdad del esquema (Drizzle) + migraciones SQL
│   │   ├── schema/*.ts          # game.ts, owner.ts, node-type.ts, product.ts, user.ts, rol.ts, row-status.ts,
│   │   │                        # costs-price-config.ts, delivery-times-config.ts, events-message-config.ts,
│   │   │                        # initial-claim-config.ts, initial-stock-config.ts, order-restriction-config.ts,
│   │   │                        # stock-notification-config.ts, reset-password.ts, user-pws.ts
│   │   ├── migrations/
│   │   └── drizzle.config.ts
│   ├── supabase-client/         # NUEVO. Fábricas tipadas de @supabase/supabase-js (browser + server + admin)
│   ├── types/                   # NUEVO. `supabase gen types typescript`
│   ├── ui/                      # Repurpose: componentes compartidos Ant Design + Tailwind (antes plantilla sin usar)
│   ├── eslint-config/           # se mantiene tal cual
│   └── typescript-config/       # se mantiene tal cual
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 5. El esquema actual (tablas reales en `packages/db/schema`)

Estas tablas ya existen y modelan el dominio del Beer Game — no se inventan tablas nuevas, se migran las que hay:

| Tabla                        | Rol en el dominio                                                          |
| ---------------------------- | -------------------------------------------------------------------------- |
| `game`                       | Una partida: quién la creó, estado, configuración activa.                  |
| `game-configuration`         | Parámetros generales de una partida (duración, número de rondas, etc.).    |
| `node-type`                  | Los 4 eslabones de la cadena: Retail, Mayorista, Distribuidor, Fabricante. |
| `owner`                      | El facilitador/profesor dueño de una o más partidas.                       |
| `product`                    | El producto simulado en la partida (unidad, nombre).                       |
| `costs-price-config`         | Costos unitarios de compra, backorder e inventario por partida/nodo.       |
| `delivery-times-config`      | Lead time y su variabilidad por partida/nodo.                              |
| `initial-stock-config`       | Inventario inicial por nodo al arrancar la partida.                        |
| `initial-claim-config`       | Backorder/pedidos pendientes iniciales por nodo.                           |
| `order-restriction-config`   | Lote mínimo/máximo, múltiplo de pedido.                                    |
| `stock-notification-config`  | Umbrales de alerta de stock.                                               |
| `events-message-config`      | Eventos/mensajes que se disparan durante la partida.                       |
| `user`, `rol`                | Usuarios de la plataforma y sus roles (facilitador/jugador/admin).         |
| `user-pws`, `reset-password` | Autenticación custom actual — ver §7.                                      |
| `row-status`                 | Soft-delete / estado genérico de fila, reutilizado por varias tablas.      |

Todas estas tablas deben terminar con **RLS habilitada** y al menos una policy explícita antes de que `apps/site` las consuma vía `supabase-js`. Ejemplo para `game` (el dueño ve y edita solo sus partidas):

```sql
alter table game enable row level security;

create policy "owners manage their own games"
on game
for all
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));
```

(Si se conserva la autenticación custom — opción B de §7 — `auth.uid()` no existe y la policy debe leer un claim propio inyectado vía `set_config`/JWT firmado por Supabase con un secreto compartido; hay que decidir §7 antes de escribir estas policies.)

## 6. Reglas de arquitectura no negociables

1. **Drizzle solo define y migra el esquema**, desde `packages/db`. Prohibido importar el query builder de `drizzle-orm` fuera de `packages/db`. El `db.ts` que hoy vive en `apps/database/src` y el que se importa desde `apps/site/lib/db.ts` **se eliminan** — ver `MIGRATION.md` fase 4 y 7.
2. **`@supabase/supabase-js` es el único cliente de datos en runtime**, a través de `packages/supabase-client` (`createBrowserClient`, `createServerClient`, `createAdminClient`). RLS activa en todas las tablas de §5.
3. **Los tipos de la base de datos son generados**, no escritos a mano: `pnpm db:types` → `packages/types`.
4. **Validación con `zod` antes de tocar la base** en cualquier Server Action / Route Handler.
5. **Un componente, un archivo**, ~200 líneas como techo — aplica de inmediato a `game-create-form.tsx`.

## 7. Decisión pendiente: autenticación

El repo actual **no usa Supabase Auth** — tiene un sistema propio (`bcryptjs` + `jsonwebtoken` + tablas `user`/`user-pws`/`reset-password`/`rol`). Hay que elegir una ruta antes de tocar login/RLS:

- **Opción A — Migrar a Supabase Auth (recomendada).** `auth.users` maneja el login/sesión; se crea una tabla `profiles` (o se adapta `user`) con `id` = `auth.users.id` y ahí quedan `rol`, datos de perfil, etc. `user-pws` y `reset-password` desaparecen (Supabase Auth ya maneja hash de contraseña y reset por email). Las policies RLS usan `auth.uid()` directamente, como en el ejemplo de §5. Menos código propio que mantener, encaja con `@supabase/ssr` tal como está pensado el resto del stack.
- **Opción B — Conservar el login custom.** Se sigue usando `bcryptjs`/`jsonwebtoken` contra las tablas actuales, pero **todas las lecturas/escrituras** (incluidas las de auth) pasan igual por `supabase-js` en vez del query builder de Drizzle. Las policies RLS no pueden usar `auth.uid()` — hay que propagar la identidad del usuario a Postgres por otra vía (p. ej. un rol de servicio + verificación manual en cada Server Action, o firmar un JWT propio compatible con el `custom_access_token_hook` de Supabase). Es más trabajo y más superficie de error.

Mientras no se confirme, `MIGRATION.md` avanza asumiendo **Opción A** y deja marcado dónde se bifurca si se elige B.

## 8. Integración Tailwind + Ant Design (reemplaza a shadcn/Radix)

`apps/site/components/ui` hoy es shadcn/ui (Radix + `class-variance-authority` + `tailwind-merge` + `lucide-react`). Mapeo para migrar a Ant Design conservando el diseño visual actual (paleta y tipografía se preservan vía `ConfigProvider`, no se rediseña nada):

| Componente shadcn actual             | Reemplazo Ant Design                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `accordion.tsx`                      | `Collapse`                                                                                          |
| `button.tsx`                         | `Button`                                                                                            |
| `card.tsx`                           | `Card`                                                                                              |
| `dropdown-menu.tsx`                  | `Dropdown`                                                                                          |
| `field.tsx` + `label.tsx`            | `Form.Item`                                                                                         |
| `input.tsx`                          | `Input`                                                                                             |
| `textarea.tsx`                       | `Input.TextArea`                                                                                    |
| `select.tsx`                         | `Select`                                                                                            |
| `separator.tsx`                      | `Divider`                                                                                           |
| `chart.tsx` (envoltorio de Recharts) | se conserva — Recharts no entra en conflicto con Ant Design, solo se destila el wrapper si conviene |

`clsx` y `tailwind-merge` se conservan (el helper `cn()` sigue siendo útil para clases de layout); lo que se retira es la capa de primitivos Radix + `components.json` de shadcn.

En `packages/ui`, igual que en el AGENTS.md genérico: capas explícitas de Tailwind sin `preflight.css` para no pisar los estilos base de antd, y `ConfigProvider` con los tokens de color/tipografía actuales de `apps/site/app/globals.css` para no perder el look actual.

## 9. Variables de entorno

Hoy hay `.env` y `.env copy.example` sueltos dentro de `apps/database`. Se consolidan en la raíz:

```
# Cliente
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=      # sb_publishable_...

# Servidor
SUPABASE_SECRET_KEY=                       # sb_secret_...
DATABASE_URL=                              # solo la usa drizzle-kit en packages/db

# Solo si se conserva la Opción B de auth (§7)
JWT_SECRET=
```

Si el `.env` actual de `apps/database` todavía tiene una `anon`/`service_role` key vieja de Supabase, se reemplaza por las nuevas `sb_publishable_`/`sb_secret_` al mismo tiempo que se hace el resto de la migración.

## 10. Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# packages/db (antes apps/database)
pnpm db:generate
pnpm db:migrate
pnpm db:push        # solo local
pnpm db:studio
pnpm db:types        # regenera packages/types desde Supabase
```

## 11. Checklist antes de abrir un PR

- [ ] `pnpm lint && pnpm typecheck && pnpm test` pasan.
- [ ] Ninguna importación del query builder de Drizzle fuera de `packages/db`.
- [ ] Toda tabla de §5 con RLS habilitada y policy explícita.
- [ ] Ninguna clave `sb_secret_...` referenciada en código de cliente.
- [ ] Si cambió el esquema: migración generada + `pnpm db:types` corrido.
- [ ] Componentes nuevos en Ant Design, no en Radix/shadcn.
- [ ] Ningún archivo de componente nuevo por encima de ~200 líneas.
