# The Adaptive Game — Plan de ejecución (Beer Distribution Game digital)

> Documento vivo. Refleja el estado del repo (auditado septiembre 2026, rama `main`) y el diseño de negocio capturado en `Diseño_Nivel_0.xlsx`. Toda tarea debe respetar las **Reglas de arquitectura no negociables** de [`AGENTS.md`](./AGENTS.md) §6 y la decisión pendiente de §7 (auth A vs B — por defecto asumimos **A: Supabase Auth**).

---

## 0. Resumen ejecutivo

The Adaptive Game digitaliza el **Beer Distribution Game** del MIT. Hoy el repo:

- Tiene el esquema de Drizzle completo en `apps/database/src/schema/*` (mapea 1-a-1 el Excel).
- Tiene un form de **creación de juego** troceado y listo en UI, pero **no persiste** nada en BD (solo `console.debug`).
- Tiene login custom con `bcryptjs` + cookie `userId`; sin Supabase Auth.
- Tiene un dashboard con tabla de juegos de muestra.
- **No tiene**: motor de simulación por rondas, vista de jugador, panel de owner/facilitador, gráficos, KPIs, registro de usuarios, onboarding de jugadores, ni la lectura real desde Supabase.

El plan cubre **8 fases (F0–F7)** para llegar a una primera versión jugable end-to-end con un facilitador, 4 jugadores (uno por nodo) y simulación por rondas con persistencia.

---

## 1. Mapa global de pantallas (rutas)

Agrupadas por módulo. Cada ruta se asocia al rol que la usa (Facilitador `F`, Jugador `J`, Admin `A`, Público `P`). Las rutas usan **App Router** de Next.js (`apps/site/app/...`).

| Ruta                                  | Roles | Pantalla / Propósito                                                                   |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------- |
| `/`                                   | P     | Redirige a `/login` o `/dashboard`. _(ya existe, ajustar al nuevo auth)_               |
| `/login`                              | P     | Login con email + password. _(ya existe; migrar a Supabase Auth en F1)_                |
| `/signup`                             | P     | Alta de usuario jugador (auto-registro, opcional según rol).                           |
| `/forgot-password`                    | P     | Solicitar email de reset.                                                              |
| `/reset-password`                     | P     | Form para nueva contraseña vía token.                                                  |
| `/dashboard`                          | F,J   | Home post-login: lista de juegos del usuario, accesos rápidos.                         |
| `/dashboard/games/new`                | F     | Wizard de creación de juego. _(UI lista, falta persistir)_                             |
| `/dashboard/games`                    | F     | Tabla completa de juegos del facilitador (filtros, búsqueda, estados).                 |
| `/dashboard/games/[gameId]`           | F     | Detalle del juego: configuración, owners asignados, estado de la simulación.           |
| `/dashboard/games/[gameId]/edit`      | F     | Editar configuración (mismas secciones que `/new`, con prefill).                       |
| `/dashboard/games/[gameId]/owners`    | F     | Asignar jugadores (owners) a cada uno de los 4 nodos.                                  |
| `/dashboard/games/[gameId]/simulate`  | F     | Vista del facilitador: estado por nodo, ronda actual, botones de control (play/pause). |
| `/dashboard/games/[gameId]/rounds`    | F     | Histórico de rondas con detalle por nodo.                                              |
| `/dashboard/games/[gameId]/analytics` | F     | Gráficos + KPIs (ver §3.M6).                                                           |
| `/play`                               | J     | Bandeja de juegos donde el jugador está asignado y la ronda está abierta.              |
| `/play/[gameId]`                      | J     | Tablero del jugador (su nodo): inventario, backorder, demanda, form de pedido.         |
| `/play/[gameId]/history`              | J     | Histórico personal (sus pedidos, costos).                                              |
| `/admin`                              | A     | CRUD de catálogos globales: `node-type`, `product`, `rol`, `row-status`.               |
| `/admin/users`                        | A     | Gestión de usuarios y roles.                                                           |

> Total: **17 pantallas** + 1 layout compartido del sidebar.

---

## 2. Mapa de módulos

| #   | Módulo                                       | Descripción                                                                                                                                                                                                                                                                                                                                                                   | Pantallas implicadas                                                         |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| M1  | **Autenticación y sesión**                   | Login, signup, reset, sesión, guard de rol.                                                                                                                                                                                                                                                                                                                                   | `/login`, `/signup`, `/forgot-password`, `/reset-password`                   |
| M2  | **Catálogos globales**                       | Tipos de nodo, productos, roles, estados de fila. Solo Admin.                                                                                                                                                                                                                                                                                                                 | `/admin`                                                                     |
| M3  | **Gestión de juego (CRUD)**                  | Crear, editar, listar, archivar juegos. Wizard y formulario persistentes.                                                                                                                                                                                                                                                                                                     | `/dashboard/games/new`, `/dashboard/games`, `/dashboard/games/[id]`, `/edit` |
| M4  | **Configuración del juego**                  | Las 12 secciones del Excel (demanda, BO, stock, seguridad, tránsito, variabilidad, lead time, lote, costos, eventos, alertas, restricciones).                                                                                                                                                                                                                                 | Internas a M3                                                                |
| M5  | **Asignación de jugadores**                  | Owners por nodo (4 por juego), invitaciones, asignación Persona/Computadora.                                                                                                                                                                                                                                                                                                  | `/dashboard/games/[id]/owners`                                               |
| M6  | **Motor de simulación**                      | Lógica por ronda: despacho, arribo, inventario, backorder, costos, demanda.                                                                                                                                                                                                                                                                                                   | `/play/[id]`, `/dashboard/games/[id]/simulate`                               |
| M7  | **Vista del jugador**                        | Tablero del nodo: stock, BO, demanda entrante, form para pedir, feedback de la ronda.                                                                                                                                                                                                                                                                                         | `/play`, `/play/[id]`, `/play/[id]/history`                                  |
| M8  | **Vista del facilitador**                    | Supervisión en vivo: estado por nodo, ronda, override, decisiones globales (pausar, avanzar).                                                                                                                                                                                                                                                                                 | `/dashboard/games/[id]/simulate`                                             |
| M9  | **Histórico y rondas**                       | Bitácora por ronda con detalle por nodo, exportable.                                                                                                                                                                                                                                                                                                                          | `/dashboard/games/[id]/rounds`                                               |
| M10 | **Analítica y KPIs**                         | Gráficos del Excel: evolución cadena, pedidos vs demanda, inventario total, costo/ingreso acumulado, KPI de servicio.                                                                                                                                                                                                                                                         | `/dashboard/games/[id]/analytics`                                            |
| M11 | **Notificaciones y eventos**                 | Mensajes por periodo (eventos del Excel), alertas de stock.                                                                                                                                                                                                                                                                                                                   | In-app en M7/M8; cron para emails (futuro).                                  |
| M12 | **Internacionalización**                     | Español primario (toda la UI actual lo es). Estructura `next-intl` lista para añadir en.                                                                                                                                                                                                                                                                                      | transversal                                                                  |
| M13 | **Vista pedagógica del jugador** (nuevo, F5) | Mapa isométrico/2D con los 4 nodos conectados, camiones en movimiento entre eslabones, tarjeta flotante del nodo actual con el form de pedido, modal pedagógico "¿Qué ocurre esta semana?" al cerrar la ronda, y sidebar izquierdo del jugador con acciones (Finalizar / Reiniciar / Animación / Estadísticas / Mensajes). Replica el enfoque educativo de Zensimu/CEEOLatam. | `/play/[id]` (mapa + tarjeta), `/play/[id]/round-close` (modal pedagógico)   |

---

## 3. Detalle por módulo (pantallas, contratos, validaciones)

### M1 · Autenticación y sesión

**Decisión por defecto:** Supabase Auth (AGENTS.md §7 opción A). El plan asume esto; si se elige B, ajustar §3.M1 y las policies RLS.

- **Pantallas**: `/login` (lista), `/signup` (nuevo), `/forgot-password` (nuevo), `/reset-password` (nuevo).
- **Server Actions**: `loginAction`, `signUpAction`, `requestPasswordResetAction`, `resetPasswordAction`, `logoutAction`.
- **Entidades**:
  - `auth.users` (Supabase) para credenciales.
  - Tabla `user` se transforma en `profiles` o se conserva con FK a `auth.users.id` (UUID).
  - `rol` queda como catálogo con valores `admin`, `facilitator`, `player`.
- **Validación**: zod sobre el payload antes de llamar a `supabase.auth.signInWithPassword` / `signUp`.
- **Sesión**: `@supabase/ssr` crea cookies httpOnly; middleware (`apps/site/proxy.ts`) refresca el token y redirige según rol.
- **Criterios de aceptación**: tras login OK → `/dashboard`. Tras login KO → mensaje genérico. Logout limpia cookie. Signup crea fila en `profiles` con `rol=player` por defecto; admin promotion solo desde `/admin/users`.

### M2 · Catálogos globales

- **Pantalla**: `/admin` con tabs (Node types, Products, Roles, Row statuses).
- **Acciones**: listar, crear, editar, desactivar (cambio de `status` en `row-status`).
- **Tablas implicadas**: `node-type`, `product`, `rol`, `row-status`.
- **Validación**: nombre único (20-50 chars según tabla), descripción no vacía. Icono de producto requerido (URL).
- **Criterios de aceptación**: el seed inicial carga los 4 nodos canónicos (Retail, Mayorista, Distribuidor, Fabricante) y al menos 1 producto de ejemplo. CRUD protegido por `rol=admin` (RLS + check en Server Action).

### M3 · Gestión de juego (CRUD)

- **Pantallas**: `/dashboard/games/new` (existente), `/dashboard/games`, `/dashboard/games/[id]`, `/edit`.
- **Server Action principal**: `createGameAction(formData)` que crea en transacción:
  1. `game` (name, description, start_date, end_date, status='active').
  2. `game-configuration` (business_name, periods, period_type, product, FK→game.id).
  3. Inserts en `costs-price-config`, `delivery-times-config`, `initial-claim-config`, `initial-stock-config`, `order-restriction-config`, `stock-notification-config`, `events-message-config`, todos con FK→game-configuration.id.
- **Validación zod**: esquema `_sections/types.ts` se convierte a un `gameFormSchema` con `zod`. Mensajes en español.
- **Persistencia**: `apps/site/app/dashboard/games/new/actions.ts` con `createServerClient` y patrón `revalidatePath('/dashboard/games')`.
- **Criterios de aceptación**: el botón "Guardar juego" persiste y redirige a `/dashboard/games/[id]`. Editar carga prefill y vuelve a guardar. La lista `/dashboard/games` muestra los juegos del facilitador actual (RLS filtra por `auth.uid() = owner_user_id`, ver M5).

### M4 · Configuración del juego

12 secciones, agrupadas según el Excel:

| #   | Sección                             | Tabla(s)                                                             | Origen de UI                                      |
| --- | ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | **Demanda del cliente**             | `initial-claim-config` (1 fila por periodo, claim_value)             | `demand-section.tsx` (con gráfico Recharts)       |
| 2   | **Back Order inicial**              | `initial-claim-config` (period_number=0) o nuevo campo               | `node-distribution-section` (`initialBackorder`)  |
| 3   | **Stock inicial**                   | `initial-stock-config.stock`                                         | `node-distribution-section` (`initialStock`)      |
| 4   | **Stock de seguridad**              | (nueva lógica: `safety_stock_config` o ampl. `initial-stock-config`) | `node-distribution-section` (`safetyStock`)       |
| 5   | **Pedidos en tránsito (arribos)**   | `initial-stock-config.initial_order`                                 | `node-distribution-section` (`transitOrders`)     |
| 6   | **Variabilidad del suministro**     | `delivery-times-config.variability` (interpretación)                 | `node-distribution-section` (`supplyVariability`) |
| 7   | **Lead Time**                       | `delivery-times-config.time`                                         | `node-distribution-section` (`leadTime`)          |
| 8   | **Variabilidad del Lead Time**      | `delivery-times-config.variability` (campo separado)                 | `node-distribution-section` (`leadTimeVar`)       |
| 9   | **Lote mínimo / múltiplo / máximo** | `order-restriction-config`                                           | `restrictions-section.tsx`                        |
| 10  | **Costo de compra**                 | `costs-price-config.purchase_cost`                                   | `costs-section.tsx` → `node-distribution`         |
| 11  | **Costo Back Order**                | `costs-price-config.cost_pending_order`                              | `costs-section.tsx`                               |
| 12  | **Costo de inventario**             | `costs-price-config.stock_cost`                                      | `costs-section.tsx`                               |

> **Nota**: `stock_notification_config` y `events_message_config` ya existen en el esquema — moverlos a M11.

- **Criterios de aceptación**: el form completo mapea 1-a-1 a las 12 tablas anteriores (no a la tabla gigante que tiene hoy `_sections/types.ts`). El componente `node-distribution-section` ya resuelve la repetición "valor global + 4 nodos" — se reutiliza tal cual.

### M5 · Asignación de jugadores

- **Pantalla**: `/dashboard/games/[id]/owners`.
- **Acciones**:
  - `assignOwnerAction(gameId, nodeType, ownerData)` — crea fila en `owner`.
  - `changeOwnerTypeAction(ownerId, type: 'person' | 'computer')` — define si lo manejará un jugador humano o la IA.
  - `invitePlayerByEmailAction(gameId, nodeType, email)` — envía invitación (futuro, fuera del MVP).
- **Tabla**: `owner` (game_id, node_type, name, lastname, dni_number, email, phone, company_name, status).
- **Validación zod**: DNI único, email único, node_type ∈ `node-type.name`.
- **Criterios de aceptación**: cada juego tiene exactamente 1 owner por cada uno de los 4 nodos. Si un owner tiene tipo `computer`, el motor M6 genera pedidos automáticos.

### M6 · Motor de simulación

Núcleo del juego. Una **ronda** = (1) arribos → (2) despacho → (3) actualización inventario/BO → (4) registro de pedidos de los jugadores → (5) cierre de ronda.

- **Pantallas implicadas**: `/play/[id]` (input del jugador) + `/dashboard/games/[id]/simulate` (control).
- **Entidades a crear** (nuevas tablas, vía `packages/db` y migración Drizzle):

  | Tabla nueva           | Propósito                                                                                                          |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
  | `game-round`          | Una ronda por juego: `game_id`, `number`, `status` (`open`/`closed`), `closed_at`.                                 |
  | `node-round-state`    | Estado por nodo por ronda: `inventory`, `backorder`, `pending_orders`, `cost_total`, `revenue`, `margin`.          |
  | `node-order`          | Pedido colocado por un jugador (o por la IA) en una ronda: `game_id`, `round_id`, `node_type`, `qty`, `placed_at`. |
  | `node-shipment`       | Despacho generado en una ronda: `game_id`, `round_id`, `from_node`, `to_node`, `qty`, `arrives_in_round`.          |
  | `node-kpi` (opcional) | KPIs precomputados por ronda por nodo (nivel de servicio, ventas a tiempo).                                        |

- **Algoritmo por ronda (resumen)**:
  1. Cargar estado del periodo anterior de cada nodo.
  2. Calcular arribos: tomar `node-shipment` con `arrives_in_round = round.number`.
  3. Sumar arribos al inventario.
  4. Calcular demanda del nodo (del `owner` río arriba) y despachar (min(demanda + bo_anterior, inventario)).
  5. Cerrar round cuando los 4 nodos (o sus owners `computer`) han colocado pedido.
  6. Persistir `node-round-state` y abrir la siguiente ronda.
- **Server Actions**: `openNextRoundAction`, `placeOrderAction`, `submitComputerOrderAction` (IA), `closeRoundAction`.
- **Tiempo real**: para MVP, polling cada 5s a la vista del facilitador (sin Supabase Realtime). En F+1 se evalúa Realtime.
- **Criterios de aceptación**: dado un juego con 4 owners humanos, cada uno coloca pedido y al cerrar la ronda se actualizan inventarios y BO. La vista del facilitador ve el cambio.

### M7 · Vista del jugador (modo "consola del nodo")

> La pieza central del jugador. Sigue siendo el panel con métricas + form de pedido, pero **no es lo único** que ve: se complementa con M13 (mapa pedagógico + modal "¿Qué ocurre esta semana?"). El M7 es lo que ya estaba descrito y se mantiene.

- **Pantallas**: `/play`, `/play/[id]`, `/play/[id]/history`.
- **Datos visibles por ronda**:
  - Stock actual, Backorder, Pedidos en tránsito.
  - Demanda del cliente (Retail) o del nodo río arriba.
  - Gráfico mini con sus últimas 5 rondas.
  - Form: input numérico (cantidad a pedir), validado contra `order-restriction-config`.
- **Acciones**: `placeOrderAction(gameId, qty)`.
- **Criterios de aceptación**: solo puede ver el juego si figura como `owner.node_type` de ese juego. Una vez cerrada la ronda, el form se bloquea y se dispara el modal pedagógico de M13.

### M8 · Vista del facilitador

- **Pantalla**: `/dashboard/games/[id]/simulate`. El facilitador **también ve** el mapa pedagógico (M13) en su consola, con un toggle "Modo facilitador" que añade controles extra (cerrar ronda forzado, etc.).
- **Acciones**:
  - `pauseGameAction`, `resumeGameAction`, `forceCloseRoundAction`.
  - `restartGameAction` (reinicia rondas).
  - `triggerRoundCloseForAllAction` (dispara el modal pedagógico a los 4 jugadores en simultáneo).
- **Datos**: 4 tarjetas (una por nodo) con `inventory`, `backorder`, `pending`, último pedido, costo acumulado, además del mapa en vivo.
- **Criterios de aceptación**: solo el owner-facilitador del juego ve esta pantalla. Puede pausar y reanudar; la pausa bloquea `placeOrderAction`. Los controles de "Reiniciar" y "Forzar cierre" requieren `Modal.confirm`.

### M13 · Vista pedagógica del jugador (mapa + modal "¿Qué ocurre esta semana?")

> Pieza educativa. Replica el enfoque de Zensimu: el jugador **ve la cadena entera**, no solo su nodo, y entiende el efecto de su pedido viendo cómo se mueven los camiones y abriendo el modal pedagógico al cierre de cada ronda.

- **Pantallas**:
  - `/play/[id]` — reescrita: pasa a ser el **mapa de la cadena** (layout principal del jugador) con la tarjeta flotante del nodo anclada.
  - `/play/[id]/round-close` — modal pedagógico que se muestra al cerrar una ronda (también se puede reabrir manualmente desde la tarjeta).
- **Mapa de la cadena (`/play/[id]`)**:
  - **Lienzo isométrico** (SVG/CSS, sin libs 3D en MVP) con los 4 nodos posicionados en cruz:
    - Retail (1°) abajo-izquierda · Mayorista (2°) abajo-centro · Distribuidor (3°) arriba-centro · Fabricante (4°) arriba-derecha.
    - Líneas curvas entre Retail→Mayorista→Distribuidor→Fabricante (los pedidos viajan "río arriba" en el modelo; el despacho baja).
  - **Camiones animados**: un componente `<Truck>` por envío en tránsito. Se posiciona sobre la línea correspondiente según `node-shipment.arrives_in_round - round.number`. CSS animation (no Lottie en MVP).
  - **Tarjeta flotante del nodo actual** anclada sobre su edificio: muestra Stock, Costo, Recibo, Demanda, Envío y el input "Ordenar" (esto reemplaza al panel tradicional de M7; ver `INTERFAZ.md` §19).
  - **Sidebar izquierdo fijo** (solo del jugador) con acciones:
    - `Finalizar` → confirmar salida del juego (modal de confirmación).
    - `Reiniciar` → reabrir la ronda actual (solo si la ronda aún está `open` y el jugador no ha enviado pedido).
    - `Instrucciones` → drawer con el manual del juego.
    - `Animación` → toggle que muestra/oculta el movimiento de camiones.
    - `Estadísticas` → modal con KPIs personales (costo, inventario promedio, nivel de servicio, ventas a tiempo).
    - `Mensajes` → drawer con `events-message-config` activos.
- **Modal pedagógico "¿Qué ocurre esta semana N?"**:
  - Aparece automáticamente al cierre de la ronda (cuando `closeRoundAction` actualiza el estado del jugador).
  - Estructura (mapeada al Excel):
    - **Título**: "¿Qué ocurre semana N?" + botón cerrar.
    - **Diagrama del nodo central** (su edificio + cajas de stock) con 4 flechas:
      - **Demanda entrante** desde el cliente (Retail) o nodo río arriba.
      - **Recibo entrante** desde el nodo río arriba (camión que arriba esta semana).
      - **Envío saliante** hacia el cliente o nodo río abajo.
      - **Cálculo**: Stock inicial + Recibo − Envío = Stock final.
    - **Resumen numérico** con la "transparente de cálculo":
      - `▲ Stock: 12` (inicial)
      - `+10 -4 → Stock final: 18` (delta visual con colores success/error)
      - `💼 Coste inicial: €24` (o $)
      - `+€9 → Coste final: €33`
    - **Mensaje de feedback** dinámico según el resultado:
      - ✅ "Tiene suficiente Stock para cumplir con la demanda" (si cubrió BO + demanda).
      - ⚠️ "Backorder aumenta: ahora tiene N unidades pendientes" (si no alcanza).
      - 🚚 "El próximo recibo de N unidades llegará en K semanas".
    - **Acciones**: `Ver animación de nuevo` (reproduce la transición de camiones), `Siguiente paso: Ordenar` (cierra y vuelve al mapa con el input activo), checkbox "Mostrar cada semana" (lo abre automáticamente en cada ronda).
- **Server Actions nuevas**: `finalizeGameForPlayerAction`, `reopenRoundAction` (jugador), `toggleAnimationPreferenceAction` (player UI).
- **Persistencia**: nada nuevo en BD. La animación se deriva del estado en vivo (`node-round-state` + `node-shipment`).
- **Criterios de aceptación**:
  - El jugador ve los 4 nodos con sus nombres editables y camiones desplazándose en cada cierre de ronda.
  - Al cerrar una ronda, el modal pedagógico aparece sin recarga de página (polling o Realtime).
  - El modal es **didáctico**: muestra los 4 valores (demanda, recibo, envío, stock final) con animación de "transparente".
  - El sidebar izquierdo solo aparece para `rol=player` (no para facilitadores).
  - Las acciones "Finalizar" y "Reiniciar" piden confirmación con `Modal.confirm` de Ant.
- **Dependencias técnicas**:
  - Animación CSS: preferimos `@keyframes` + `transform` (performante). Lottie solo si se aprueba después.
  - Iconos de nodos: SVG propios en `packages/ui/src/assets/` (`/icons/retail.svg`, `/wholesaler.svg`, `/distributor.svg`, `/manufacturer.svg`, `/truck.svg`).
  - Render del modal: Ant `Modal` con `footer` custom.

### M9 · Histórico y rondas

- **Pantalla**: `/dashboard/games/[id]/rounds`.
- **Tabla**: `game-round` + `node-round-state` (vista join por ronda y por nodo).
- **Exportación**: CSV con todas las filas de `node-round-state` (futuro, fuera del MVP).
- **Criterios de aceptación**: la tabla muestra todas las rondas en orden descendente; cada fila se expande para mostrar los 4 nodos.

### M10 · Analítica y KPIs

- **Pantalla**: `/dashboard/games/[id]/analytics`.
- **Gráficos (mapeados al Excel)**:
  1. **Evolución de la cadena**: Pedidos totales, Backorder total, Inventario total, Ingreso total, Costo total acumulado (líneas por nodo).
  2. **Pedidos vs Demanda final**: barras agrupadas por periodo.
  3. **Inventario total**: área apilada por nodo.
  4. **Ingreso / Costo acumulado**: líneas duales.
- **KPIs** (de la sección "KPIs" del Excel): costos/ingresos/beneficios acumulados, ventas a tiempo, inventario promedio, demanda promedio, pedidos promedio, BO promedio, pedidos recibidos, **nivel de servicio** = 1 − (BO_promedio / Demanda_promedio).
- **Stack de gráficos**: Recharts (ya en uso en `demand-section.tsx`). Migrar a `@ant-design/plots` cuando se haga la migración Ant Design §8 de AGENTS.
- **Criterios de aceptación**: la página carga en < 2s para 30 rondas con 4 nodos.

### M11 · Notificaciones y eventos

- **Pantalla**: sección del form (ya existe: `events-message-section.tsx` y `notifications-section.tsx`).
- **Tablas**: `events-message-config`, `stock-notification-config`.
- **MVP**: solo mostrar mensajes in-app al alcanzar el periodo configurado. Sin email todavía.

### M12 · Internacionalización

- **Estado actual**: toda la UI ya está en español.
- **Pendiente**: extraer literales a `next-intl` para preparar multi-idioma. No es bloqueante para el MVP.

---

## 4. Entidades que faltan (decisión de modelo)

Las tablas del esquema actual cubren **configuración inicial** pero **no la ejecución**. Hay que añadir (todas con FK a `game.id` y, cuando aplique, a `game-round.number`):

1. `game-round` (id, game_id, number, status, closed_at).
2. `node-round-state` (id, game_id, round_id, node_type, inventory, backorder, pending_orders, cost_total, revenue, margin).
3. `node-order` (id, game_id, round_id, node_type, qty, placed_by_user_id, placed_at).
4. `node-shipment` (id, game_id, round_id, from_node, to_node, qty, arrives_in_round).

Estas tablas entran en **F4** del plan, con su propia migración Drizzle.

---

## 5. Tabla de tareas (ordenadas por fase)

> Convención: `[ ]` pendiente · `[x]` hecho. Estimado en puntos relativos (P). Dep = fases previas requeridas.

### F0 · Bootstrap y migraciones pendientes (1 sprint)

| #    | Tarea                                                                                                       | Dep  | P   | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------- | ---- | --- | ------ |
| F0.1 | Decidir bifurcación auth (A: Supabase Auth) y dejarlo escrito en `AGENTS.md` §7.                            | —    | 1   | [ ]    |
| F0.2 | Migrar `apps/database` → `packages/db` (mover carpeta, actualizar `pnpm-workspace.yaml`, `tsconfig` paths). | —    | 3   | [ ]    |
| F0.3 | Crear `packages/supabase-client` con `createBrowserClient`, `createServerClient`, `createAdminClient`.      | F0.1 | 3   | [ ]    |
| F0.4 | Crear `packages/types` con `supabase gen types typescript` (vacío hasta conectar proyecto).                 | F0.3 | 1   | [ ]    |
| F0.5 | Habilitar RLS en las 17 tablas existentes + policies base (ejemplo `game` en AGENTS.md §5).                 | F0.1 | 3   | [ ]    |
| F0.6 | Crear seeds: 4 `node-type`, 3 roles, 1 producto de ejemplo, 1 juego demo con 4 owners.                      | F0.5 | 2   | [ ]    |
| F0.7 | `apps/site` consume `packages/supabase-client`; eliminar `lib/db.ts` con `pg` y `MOCK_AUTH`.                | F0.3 | 2   | [ ]    |
| F0.8 | Migrar componentes UI de shadcn/Radix a Ant Design v6 según mapeo AGENTS.md §8.                             | —    | 5   | [ ]    |

### F1 · Autenticación (1 sprint)

| #    | Tarea                                                                                 | Dep        | P   | Estado |
| ---- | ------------------------------------------------------------------------------------- | ---------- | --- | ------ |
| F1.1 | Reescribir `loginAction` con `supabase.auth.signInWithPassword` (zod + errores i18n). | F0.3       | 2   | [ ]    |
| F1.2 | Pantalla `/signup` (form + `signUpAction`).                                           | F1.1       | 2   | [ ]    |
| F1.3 | Pantallas `/forgot-password` y `/reset-password`.                                     | F1.1       | 2   | [ ]    |
| F1.4 | `logoutAction` con `supabase.auth.signOut`.                                           | F1.1       | 1   | [ ]    |
| F1.5 | `apps/site/proxy.ts` (middleware) refresca sesión y redirige por rol.                 | F1.1       | 2   | [ ]    |
| F1.6 | Adaptar tabla `user` → `profiles` con FK a `auth.users.id` (UUID).                    | F0.5, F1.1 | 2   | [ ]    |

### F2 · Catálogos y admin (0.5 sprint)

| #    | Tarea                                                                             | Dep  | P   | Estado |
| ---- | --------------------------------------------------------------------------------- | ---- | --- | ------ |
| F2.1 | Pantalla `/admin` con tabs y CRUD de `node-type`, `product`, `rol`, `row-status`. | F1.1 | 5   | [ ]    |
| F2.2 | Guard `rol=admin` en middleware + RLS.                                            | F2.1 | 2   | [ ]    |

### F3 · Gestión de juego y persistencia del form (1.5 sprints)

| #    | Tarea                                                                                             | Dep  | P   | Estado |
| ---- | ------------------------------------------------------------------------------------------------- | ---- | --- | ------ |
| F3.1 | `gameFormSchema` con zod que cubre las 12 secciones del Excel.                                    | F0.5 | 3   | [ ]    |
| F3.2 | `createGameAction` transaccional que crea `game` + `game-configuration` + 8 sub-tablas de config. | F3.1 | 5   | [ ]    |
| F3.3 | Wirear `game-create-form.tsx.onSubmit` → action; redirigir a `/dashboard/games/[id]`.             | F3.2 | 2   | [ ]    |
| F3.4 | Pantalla `/dashboard/games` (tabla con filtros por estado y rango de fechas).                     | F3.3 | 3   | [ ]    |
| F3.5 | Pantalla `/dashboard/games/[id]` (resumen + accesos a owners/simulate/analytics).                 | F3.3 | 3   | [ ]    |
| F3.6 | Pantalla `/dashboard/games/[id]/edit` (prefill + re-uso del form).                                | F3.3 | 3   | [ ]    |
| F3.7 | `archiveGameAction`, `restoreGameAction` (cambia `status`).                                       | F3.3 | 1   | [ ]    |

### F4 · Modelo de ejecución (motor de simulación) (2 sprints)

| #     | Tarea                                                                                          | Dep        | P   | Estado |
| ----- | ---------------------------------------------------------------------------------------------- | ---------- | --- | ------ |
| F4.1  | Diseñar migración Drizzle con `game-round`, `node-round-state`, `node-order`, `node-shipment`. | F0.5       | 3   | [ ]    |
| F4.2  | Generar migración + `pnpm db:migrate`.                                                         | F4.1       | 1   | [ ]    |
| F4.3  | Regenerar `packages/types` con `pnpm db:types`.                                                | F4.2       | 1   | [ ]    |
| F4.4  | `lib/simulation/advanceRound.ts` puro (sin BD): recibe estado anterior y devuelve nuevo.       | F4.1       | 5   | [ ]    |
| F4.5  | Tests unitarios del motor (con Vitest): caso trivial, caso con BO, caso con inventario 0.      | F4.4       | 5   | [ ]    |
| F4.6  | `openNextRoundAction` que crea `game-round` con `status=open`.                                 | F4.4       | 2   | [ ]    |
| F4.7  | `placeOrderAction` (jugador humano) → inserta `node-order`.                                    | F4.6       | 3   | [ ]    |
| F4.8  | `submitComputerOrderAction` (IA): heurística simple (reabastecer a nivel objetivo).            | F4.6       | 3   | [ ]    |
| F4.9  | `closeRoundAction` orquesta el motor, persiste `node-round-state` y `node-shipment`.           | F4.4, F4.6 | 5   | [ ]    |
| F4.10 | Job determinístico: si todos los nodos del round ya tienen pedido, cerrar auto.                | F4.9       | 2   | [ ]    |

### F5 · Vista del jugador + módulo pedagógico M13 (1.5 sprints)

| #     | Tarea                                                                                                                                                  | Dep        | P   | Estado |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --- | ------ |
| F5.1  | Pantalla `/play` (bandeja con juegos asignados al jugador).                                                                                            | F4.6       | 3   | [ ]    |
| F5.2  | Componente `ChainMap` (`packages/ui/src/chain-map.tsx`): SVG isométrico con los 4 nodos, paths curvos, posición de camiones. Reutilizable por M7 y M8. | F4.9       | 5   | [ ]    |
| F5.3  | Componente `Truck` con animación CSS basada en `node-shipment.arrives_in_round`. Hook `useTruckPosition(shipment, currentRound)`.                      | F5.2       | 3   | [ ]    |
| F5.4  | Reescribir `/play/[id]` para que sea **el mapa + tarjeta flotante** del nodo (sustituye a la pantalla 19 anterior).                                    | F5.2, F5.3 | 5   | [ ]    |
| F5.5  | Modal pedagógico `RoundSummaryModal`: "¿Qué ocurre semana N?" con demanda, recibo, envío, stock inicial/final, costo inicial/final y feedback.         | F5.4, F4.9 | 5   | [ ]    |
| F5.6  | Sidebar izquierdo del jugador (`PlayerSidebar`) con Finalizar, Reiniciar, Instrucciones, Animación, Estadísticas, Mensajes.                            | F5.4       | 3   | [ ]    |
| F5.7  | Acciones: `finalizeGameForPlayerAction`, `reopenRoundAction` (jugador), `toggleAnimationPreferenceAction`.                                             | F5.6       | 2   | [ ]    |
| F5.8  | Disparar `RoundSummaryModal` automáticamente al cerrar la ronda (polling → cuando cambia `node-round-state`).                                          | F5.5, F4.9 | 2   | [ ]    |
| F5.9  | Gráfico mini de últimas 5 rondas del jugador (Recharts) dentro de la tarjeta flotante.                                                                 | F5.4       | 2   | [ ]    |
| F5.10 | Pantalla `/play/[id]/history` (sin cambios sobre lo previsto).                                                                                         | F5.4       | 3   | [ ]    |
| F5.11 | Guard: jugador solo ve si figura en `owner` con `user_id = auth.uid()`.                                                                                | F5.4       | 1   | [ ]    |
| F5.12 | Tests del modal pedagógico: el cálculo del "transparente" coincide con `lib/simulation/advanceRound` (regression crítico).                             | F5.5, F4.5 | 2   | [ ]    |

### F6 · Vista del facilitador y control (1 sprint)

| #    | Tarea                                                                                | Dep  | P   | Estado |
| ---- | ------------------------------------------------------------------------------------ | ---- | --- | ------ |
| F6.1 | Pantalla `/dashboard/games/[id]/simulate` (4 tarjetas por nodo + botones).           | F4.9 | 5   | [ ]    |
| F6.2 | `pauseGameAction`, `resumeGameAction`, `forceCloseRoundAction`, `restartGameAction`. | F6.1 | 3   | [ ]    |
| F6.3 | Polling cada 5s para estado en vivo (placeholder de Realtime).                       | F6.1 | 2   | [ ]    |
| F6.4 | Pantalla `/dashboard/games/[id]/owners` con CRUD y toggle Persona/Computadora.       | F4.1 | 5   | [ ]    |
| F6.5 | Pantalla `/dashboard/games/[id]/rounds` (histórico expandible).                      | F4.9 | 3   | [ ]    |

### F7 · Analítica, KPIs y pulido (1 sprint)

| #    | Tarea                                                                                        | Dep  | P   | Estado |
| ---- | -------------------------------------------------------------------------------------------- | ---- | --- | ------ |
| F7.1 | Pantalla `/dashboard/games/[id]/analytics` con los 4 gráficos del Excel.                     | F4.9 | 5   | [ ]    |
| F7.2 | Cálculo de KPIs (nivel de servicio, ventas a tiempo, promedios).                             | F7.1 | 3   | [ ]    |
| F7.3 | Eventos de mensaje (M11): render in-app en `node-round-state` según `events-message-config`. | F4.9 | 2   | [ ]    |
| F7.4 | Alertas de stock (M11): banner cuando se cruza el umbral.                                    | F4.9 | 2   | [ ]    |
| F7.5 | Auditoría final AGENTS.md §11 (`pnpm lint && pnpm typecheck && pnpm test`).                  | todo | 1   | [ ]    |

**Total estimado**: ~125 puntos (~6.5 sprints ≈ 13 semanas a 1 dev full-time, o 6.5 semanas con 2 devs en paralelo). El incremento (~10P) viene de F5.2–F5.8 (mapa pedagógico + modal).

---

## 6. Plan de ejecución por sprint (orden recomendado)

| Sprint | Fases  | Foco                                                                                                                         | Entregable visible                                                            |
| ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **S1** | F0     | Bootstrap de monorepo, RLS, supabase-client, seeds. Decisión auth.                                                           | `pnpm dev` arranca contra Supabase real. Login custom **sigue funcionando**.  |
| **S2** | F1, F2 | Login con Supabase Auth, signup, reset, middleware de rol, admin con catálogos.                                              | Un admin puede loguearse, crear productos/nodos. Login custom eliminado.      |
| **S3** | F3     | Wizard de creación de juego persistiendo. Tabla de juegos + detalle + edición.                                               | Un facilitador crea un juego completo desde el form y lo ve listado.          |
| **S4** | F4     | Modelo de ejecución + motor + tests unitarios.                                                                               | `closeRoundAction` funciona end-to-end con DB real; tests del motor en verde. |
| **S5** | F5, F6 | Vistas de jugador (mapa pedagógico + modal "¿Qué ocurre esta semana?") y facilitador; CRUD de owners; control de simulación. | 4 jugadores pueden jugar una partida completa con feedback pedagógico.        |
| **S6** | F7     | Analítica, KPIs, eventos, alertas, pulido + checklist AGENTS.md.                                                             | Demo jugable end-to-end con gráficos y KPIs.                                  |

> Los S4–S6 admiten **paralelización**: mientras un dev mete M6, otro puede arrancar M5.

---

## 7. Riesgos y decisiones abiertas

| #   | Riesgo / decisión                                                                                                                            | Impacto                        | Mitigación                                                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Auth: A vs B** (Supabase Auth vs custom) sigue sin resolverse (AGENTS.md §7).                                                              | Bloquea F1 y las policies RLS. | Por defecto A. Si se confirma B, multiplicar trabajo de F1 por ~2× y rehacer policies.                                                 |
| R2  | El Excel dice "Stock de seguridad" pero **no existe tabla** en el esquema Drizzle.                                                           | Afecta F3.                     | Decisión propuesta: añadir columna `safety_stock` a `initial-stock-config` (mínimo cambio).                                            |
| R3  | `initial-claim-config` representa la **demanda por periodo**, no backorder (a pesar del nombre).                                             | Confusión.                     | Renombrar a `demand-config` en F3; añadir nueva tabla `initial-backorder-config` o usar `node-round-state.backorder` en ronda 1.       |
| R4  | El form actual tiene 1 input "Variabilidad" suelto, pero el Excel distingue **variabilidad de suministro** vs **variabilidad de lead time**. | Afecta M4.                     | Ya están separados en `_sections/types.ts` (`supplyVariability`, `leadTimeVar`). Solo confirmar persistencia.                          |
| R5  | "Tipo" del nodo en el Excel (Persona/Computadora) no tiene columna en `owner`.                                                               | Afecta M5, M6, M7.             | Añadir `owner.type` (`person` \| `computer`) en F4.1.                                                                                  |
| R6  | El componente `game-create-form.tsx` actual mezcla campos con la cardinalidad incorrecta (muchos `*NodeType` repetidos por sección).         | F3.                            | Mantener el form con el layout actual pero **persistir** solo las 8 filas por sección (1 por nodo), no `node_type` por input.          |
| R7  | Sin cron ni Realtime para cierre automático de rondas.                                                                                       | UX.                            | Polling en F6 + job determinístico por demanda (F4.10). Realtime en F+1.                                                               |
| R8  | Migración Ant Design (AGENTS.md §8) es grande; hacerlo en medio de F0-F3 añade riesgo.                                                       | Estética + productividad.      | Hacer F0.8 como sub-sprint paralelo al final de S1, sin bloquear F1-F3 (siguen con shadcn hasta que esté listo).                       |
| R9  | Migración de `apps/database` → `packages/db` puede romper imports de `lib/db.ts`.                                                            | F0.                            | Hacer F0.2 + F0.7 en el mismo PR atómico.                                                                                              |
| R10 | **Animación de camiones**: el mapa pedagógico (M13) puede derivar en requisitos pesados (Lottie, WebGL, sprites).                            | F5.                            | MVP = SVG con `@keyframes` CSS y `transform: translate`. Lottie solo si se valida después. Performance budget: 60 fps en laptop medio. |
| R11 | El modal pedagógico debe **mostrar el cálculo real** del motor. Si cambia la fórmula en `lib/simulation`, hay que actualizar también M13.    | F5/F4.                         | Test de regresión F5.12 que verifica la paridad entre `advanceRound` y el resumen del modal.                                           |

---

## 8. Cómo verificar progreso

- Cada PR cierra con `pnpm lint && pnpm typecheck && pnpm test` (AGENTS.md §11).
- Cada hito de sprint tiene un demo manual (login, crear juego, jugar 1 ronda, ver KPIs).
- Cobertura mínima exigida: tests del motor de simulación (F4.5) > 80 % en `lib/simulation/`.
- Antes de cerrar cada fase, regenerar tipos (`pnpm db:types`) y validar que no quedan `select * from` ni imports de `drizzle-orm` fuera de `packages/db`.

---

## 9. Próximos pasos inmediatos

1. Confirmar bifurcación §7 (auth A vs B) y dejar nota en `AGENTS.md`.
2. Crear rama `feat/monorepo-bootstrap` y arrancar **F0.2 + F0.3 + F0.7** en un PR atómico.
3. Habilitar Supabase en local (`supabase start`) y crear el primer proyecto cloud.
4. Aplicar migración inicial + seeds (F0.6).
5. Iniciar S1 ejecutando F0.8 en paralelo como spike (no bloqueante).
