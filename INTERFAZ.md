# The Adaptive Game — Diseño de interfaz

> Cómo serán las pantallas del Beer Distribution Game digital, pieza por pieza. Encaja con [`PLAN_BDG.md`](./PLAN_BDG.md) y respeta:
>
> - `AGENTS.md` §8 → Ant Design v6 + Tailwind v4 sobre `@repo/ui` (paleta violet-600 `#7c3aed`, tipografía Geist, esquinas redondeadas ~10–14px).
> - `AGENTS.md` §6 → un componente por archivo, ~200 líneas como techo.
> - El form de creación de juego ya está en `apps/site/app/dashboard/games/new` (UI lista, falta persistir).

La estructura común a casi todas las pantallas es:

```
┌──────────────────────────────────────────────────────────────────┐
│  Sidebar (colapsable, 64/80px)   │  Header (título + user menu)  │
│                                   ├──────────────────────────────┤
│   • Juego                         │                              │
│     └ Dashboard                   │     <Main content>           │
│     └ Crear juego                 │                              │
│     └ Mis juegos                  │                              │
│   • Jugar                         │                              │
│     └ Bandeja                     │                              │
│   • Analítica (facilitador)       │                              │
│   • Admin (admin)                 │                              │
│                                   │                              │
│   [Avatar + rol]                  │                              │
└───────────────────────────────────┴──────────────────────────────┘
```

- **Sidebar**: la que ya existe en `apps/site/app/dashboard/sidebar.tsx` (Ant `Dropdown` para el menú de usuario, ítems con ícono + label + descripción). Solo cambia el set de ítems.
- **Header**: ya existe, solo se reusa. Variantes:
  - Facilitador: avatar + rol "Facilitador" + `Dropdown` con Cuenta / Notificaciones / Cerrar sesión.
  - Jugador: avatar + "Jugador — Ronda N — Nodo Retail".
- **Tokens**: `colorPrimary #7c3aed` (CTAs y foco), `colorSuccess #10b981` (indicadores OK), `colorError #ef4444` (backorder/negativo), `colorWarning #f59e0b` (alerta de stock). Tipografía Geist. Cards con `borderRadiusLG: 14`.

---

## Índice de wireframes

| #   | Pantalla                                                  | Ruta                                  |
| --- | --------------------------------------------------------- | ------------------------------------- |
| 1   | Login                                                     | `/login`                              |
| 2   | Signup                                                    | `/signup`                             |
| 3   | Forgot / Reset password                                   | `/forgot-password`, `/reset-password` |
| 4   | Dashboard (home post-login)                               | `/dashboard`                          |
| 5   | Crear juego — Paso 1 Información general                  | `/dashboard/games/new`                |
| 6   | Crear juego — Paso 2 Configuración                        | idem                                  |
| 7   | Crear juego — Paso 3 Demanda                              | idem                                  |
| 8   | Crear juego — Paso 4 Stock inicial / Seguridad / Tránsito | idem                                  |
| 9   | Crear juego — Paso 5 Variabilidad / Lead Time             | idem                                  |
| 10  | Crear juego — Paso 6 Costos                               | idem                                  |
| 11  | Crear juego — Paso 7 Eventos / Restricciones / Alertas    | idem                                  |
| 12  | Detalle de juego                                          | `/dashboard/games/[id]`               |
| 13  | Editar juego                                              | `/dashboard/games/[id]/edit`          |
| 14  | Asignar jugadores (owners)                                | `/dashboard/games/[id]/owners`        |
| 15  | Simulación (vista facilitador)                            | `/dashboard/games/[id]/simulate`      |
| 16  | Histórico de rondas                                       | `/dashboard/games/[id]/rounds`        |
| 17  | Analítica y KPIs                                          | `/dashboard/games/[id]/analytics`     |
| 18  | Bandeja del jugador                                       | `/play`                               |
| 19  | Tablero del jugador (su nodo)                             | `/play/[id]`                          |
| 20  | Histórico del jugador                                     | `/play/[id]/history`                  |
| 21  | Admin (catálogos)                                         | `/admin`                              |

> Los wireframes están en ASCII para ser legibles en el repo; los colores referenciados (CTAs, success, warning, danger) son los tokens de `@repo/ui/theme.ts`.

---

## 1 · Login — `/login` (existente, ajustar)

La pantalla ya está implementada con Ant `Input` y `Input.Password`. Cambios menores:

```
┌──────────────────────────────────────────────────────────────────┐
│ The Adaptive Game                                                │
│                                                                  │
│  Bienvenido de vuelta                                            │
│  a una experiencia adaptable.                                    │
│                                                                  │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐ │
│  │ ux lateral con copy     │   │  Inicia sesión               │ │
│  │ (sparkles, ayuda)       │   │  ┌──────────────────────────┐ │ │
│  │                         │   │  │ Correo electrónico       │ │ │
│  │                         │   │  └──────────────────────────┘ │ │
│  │                         │   │  ┌──────────────────────────┐ │ │
│  │                         │   │  │ Contraseña        👁     │ │ │
│  │                         │   │  └──────────────────────────┘ │ │
│  │                         │   │  [⚠ mensaje error]            │ │
│  │                         │   │  ┌──────────────────────────┐ │ │
│  │                         │   │  │  Iniciar sesión          │ │ │
│  │                         │   │  └──────────────────────────┘ │ │
│  │                         │   │  ¿Olvidaste tu contraseña?    │ │
│  │                         │   │  ¿No tienes cuenta? Regístrate│ │
│  └─────────────────────────┘    └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

- Botón primario full-width (CTA violeta).
- Link a `/signup` y `/forgot-password` debajo, en `colorPrimary`.
- Estado de error: `FieldError` rojo `colorError #ef4444`.

---

## 2 · Signup — `/signup` (nuevo)

```
┌──────────────────────────────────────┐
│ Crea tu cuenta                       │
│                                      │
│ Nombre        [_________________]    │
│ Apellido      [_________________]    │
│ DNI           [_________________]    │
│ Email         [_________________]    │
│ Contraseña    [_________________] 👁  │
│ Confirmar     [_________________] 👁  │
│                                      │
│ [ Crear cuenta ]                     │
│ ¿Ya tienes cuenta? Inicia sesión    │
└──────────────────────────────────────┘
```

- Validación inline (zod). Indicador de fuerza de contraseña debajo del input.
- Tras signup → auto-login → `/play` (los facilitadores los crea un admin).

---

## 3 · Forgot / Reset password — `/forgot-password`, `/reset-password`

**Forgot**:

```
¿Olvidaste tu contraseña?
[ tu@correo.com ]
[ Enviar enlace de recuperación ]
```

**Reset** (llega con `?token=...`):

```
Nueva contraseña
[ _________________ ] 👁
Repetir contraseña
[ _________________ ] 👁
[ Guardar contraseña ]
```

---

## 4 · Dashboard — `/dashboard` (existente, ampliar)

Hoy es una home con tarjetas de muestra y una tabla de juegos. Evolución propuesta:

```
┌────────────────────────────────────────────────────────────────────┐
│ Sesión iniciada como        Samuel Pérez   [⚙] [🔔]  Cerrar sesión │
├────────────────────────────────────────────────────────────────────┤
│ Hola, Samuel 👋                                                    │
│ Resumen rápido                                                     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│ │ Juegos       │ │ Jugando      │ │ Pendientes   │ │ Próximo     │ │
│ │ activos: 3   │ │ ahora: 1     │ │ por decidir: │ │ hito        │ │
│ │              │ │              │ │ 2            │ │ Cierre F1   │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
│                                                                    │
│ Mis juegos                              [+ Crear juego]            │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Nombre           Inicio       Fin         Estado    Ronda      │ │
│ │ BDG Cohorte 5    12 oct 2026  30 nov 2026 ● Activo    3/30    ⋯ │ │
│ │ Demo Express     02 oct 2026  02 oct 2026 ⏸ Pausado  1/30    ⋯ │ │
│ │ Demo Iván        25 sep 2026  25 sep 2026 ● Activo    5/30    ⋯ │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ Próximas acciones                                                  │
│ • Asignar jugadores a "Demo Iván"                                  │
│ • Cerrar ronda 4 de "BDG Cohorte 5"                                │
└────────────────────────────────────────────────────────────────────┘
```

- 4 `Card` con números grandes (métrica) + etiqueta.
- Tabla con badges de estado (verde activo, ámbar pausado, slate archivado).
- Menú `⋯` por fila → Editar / Owners / Simular / Analítica / Archivar.

---

## 5–11 · Crear juego — `/dashboard/games/new`

El form ya existe (`apps/site/app/dashboard/games/new/game-create-form.tsx`) troceado en `_sections/*`. Se conserva la base visual y se le añade un **Stepper** arriba para dividir las 12 secciones del Excel en **7 pasos**. Esto baja la carga cognitiva y permite guardado en borrador por paso.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Crear juego                                                          │
│ ●━━━━━●━━━━━●━━━━━○━━━━━○━━━━━○━━━━━○                                │
│ 1 Gen. 2 Conf 3 Dem 4 Stock 5 Lead 6 Costos 7 Eventos                │
├──────────────────────────────────────────────────────────────────────┤
│ Paso 1 · Información general                                         │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Nombre*         [_______________________________]                 │ │
│ │ Descripción     [________________________________________]        │ │
│ │                 [________________________________________]        │ │
│ │ Fecha inicio*   [📅 ___/___/____]   Fecha cierre* [📅 ___/___/____]│ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                                              [Atrás]  [Siguiente →]  │
└──────────────────────────────────────────────────────────────────────┘
```

- Stepper arriba (Ant `Steps` o un nav custom con 7 bolitas). Click en una bolita completada salta a ese paso.
- "Atrás" deshabilitado en paso 1; "Siguiente" valida con zod antes de avanzar; "Guardar borrador" siempre visible en el header.
- Cada paso es una `FieldSet` con `FieldLegend`, tal como ya están en `_sections/*`.

### 5 · Paso 1 Información general (existente `general-info-section.tsx`)

- 4 inputs: Nombre, Descripción (TextArea), Fecha inicio (DatePicker), Fecha cierre (DatePicker).

### 6 · Paso 2 Configuración (`game-config-section.tsx`)

```
Empresa                       [_____________________________]
Número total de periodos      [ 30 ▼ ]  (1–50)
Tipo de periodo               ( ) Semanas  (•) Días  ( ) Horas
Producto                      [_____________________________]
```

- `Select` (1–50), `Radio.Group` para unidad, `Input` para producto (con autocomplete a `product` catálogo).

### 7 · Paso 3 Demanda (`demand-section.tsx`)

```
Demanda
Define la demanda para cada periodo del juego.

Periodo 1   [ 4 ]   Periodo 2   [ 4 ]   Periodo 3   [ 4 ]   ...
Periodo 9   [ 4 ]   Periodo 10  [ 12]   Periodo 11  [ 12]   ...

┌─ Gráfico de demanda ──────────────────────────────────────────┐
│   20│                                          ╱╲             │
│   10│                              ╱╲         ╱  ╲            │
│    0│────────────────────────────╱───╲───────╱────╲───────────│
│       P1   P3   P5   P7   P9   P11   P13   P15   P17          │
└──────────────────────────────────────────────────────────────┘
Variabilidad   [ 0 ]
```

- Rejilla de inputs numéricos (1 por periodo, layout `grid-cols-8`).
- Gráfico Recharts de línea única (ya implementado) que se actualiza al editar.
- "Variabilidad" abajo (interpretada como variabilidad de la demanda — ver §Riesgos en `PLAN_BDG.md`).

### 8 · Paso 4 Stock inicial / Seguridad / Tránsito

Cada sub-bloque es un `Accordion` colapsable reutilizable (`node-distribution-section.tsx` ya factorizado):

```
▼ Stock inicial (Inventario)
  Valor global (aplica a todos los nodos)  [ 4 ]
  Si defines un valor global se aplicará a cada nodo…
  Fabricante  [ 4 ]   Distribuidor [ 4 ]   Mayorista [ 4 ]   Retail [ 4 ]

▼ Stock de seguridad
  Valor global  [ 0 ]
  Fabricante  [ 0 ]   Distribuidor [ 0 ]   Mayorista [ 0 ]   Retail [ 0 ]

▼ Pedidos en tránsito inicial (Arribos)
  Valor global  [ 4 ]
  …
```

- Al cambiar el "Valor global" se propagan los 4 nodos; cada input por nodo puede sobreescribirse individualmente.

### 9 · Paso 5 Variabilidad / Lead Time

Misma estructura que el paso 4, con dos `Accordion`:

- **Variabilidad del Suministro** (%).
- **Lead Time** (semanas/días).
- **Variabilidad del Lead Time** (%).

```
▼ Lead Time
  Valor global  [ 1 ]
  Variabilidad global  [ 0 ]
  Fabricante  [ 1 ]   Distribuidor [ 1 ]   Mayorista [ 1 ]   Retail [ 1 ]
```

### 10 · Paso 6 Costos (`costs-section.tsx`)

```
Costos y precios
Costo de inventario                [ 0.50 ]
Costo pedido pendiente (Back Order) [ 1.00 ]

▼ Costo de compra (por nodo)
  Valor global  [ 5.00 ]
  Fabricante  [ 3.00 ]   Distribuidor [ 4.00 ]   Mayorista [ 5.00 ]   Retail [ 6.00 ]

▼ Precio de venta (por nodo)
  Valor global  [ 8.00 ]
  …
```

### 11 · Paso 7 Eventos / Restricciones / Alertas

```
Mensajes por evento
Tipo de nodo   [Retail ▼]    Periodo   [ 5 ]
Mensaje        [ Se aproxima un pico de demanda…              ]

Restricciones de pedidos
Mínimo [ 0 ]    Máximo [ 9999 ]    Múltiplo (factor de lote) [ 1 ]
Tipo de nodo   [Todos ▼]

Alertas de inventario
Tipo de nodo   [Retail ▼]
Mensaje        [ Stock bajo — reabastecer urgente              ]
```

Botón final: **Guardar juego** (persiste vía `createGameAction`).

---

## 12 · Detalle de juego — `/dashboard/games/[id]`

```
┌──────────────────────────────────────────────────────────────────────┐
│ BDG Cohorte 5            ● Activo  · Ronda 3/30  · Inicio 12 oct     │
│                                              [▶ Simular] [✎ Editar] │
├──────────────────────────────────────────────────────────────────────┤
│ ┌── Resumen ────────────────────────────────────────────────────────┐ │
│ │ Empresa: Cerveza XYZ  ·  Producto: Cerveza 355ml  · 30 periodos  │ │
│ │ Jugadores: 4/4 asignados   ·   Última ronda: hace 2 h           │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Pestañas:  Resumen · Configuración · Owners · Simular · Analytics    │
│                                                                      │
│ ┌── Tarjeta de ronda actual ───────────────────────────────────────┐ │
│ │ Ronda 3 abierta · Cierre en 02:14                                │ │
│ │ Pedidos recibidos: 2/4     [Forzar cierre]                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── Nodos (resumen) ───────────────────────────────────────────────┐ │
│ │  ◉ Fabricante  ● Retail  ● Mayorista  ● Distribuidor              │ │
│ │  (4 columnas con: estado, último pedido, BO, inv, costo)          │ │
│ └───────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- Tabs Ant Design.
- 4 columnas con `Card` por nodo (ícono + estado + métricas clave).

---

## 13 · Editar juego — `/dashboard/games/[id]/edit`

Mismo Stepper de 7 pasos que `/new`, pero con datos prefill y banner superior:

```
⚠ Estás editando un juego ya creado. Los cambios no afectan rondas ya cerradas.
```

Botón final: **Guardar cambios** (action `updateGameAction`).

---

## 14 · Asignar jugadores — `/dashboard/games/[id]/owners`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Asignar jugadores                                                    │
│ Cada juego debe tener 1 owner por nodo.                              │
├──────────────────────────────────────────────────────────────────────┤
│ Jerarquía        Jugador          Tipo          DNI  Email   Estado  │
│ ──────────────────────────────────────────────────────────────────── │
│ 1° Retail        Samuel Pérez     ● Persona    ...  sam@…    ● OK   │
│                  [✎ Editar] [🤖 Pasar a IA]                           │
│ 2° Mayorista     Lucía Gómez      ● Persona    ...  luc@…    ● OK   │
│ 3° Distribuidor  IA Demo          🤖 Computadora  —    —      ● OK   │
│ 4° Fabricante    Iván Ruiz        ● Persona    ...  iva@…    ⏳ Inv │
│                                                                      │
│ [+ Asignar nuevo jugador]                                            │
└──────────────────────────────────────────────────────────────────────┘
```

- `Table` Ant con tags de color por tipo (verde persona, violeta computadora).
- Si no hay email en `user`, mostrar "⏳ Invitar" → `invitePlayerByEmailAction`.
- Botón "Iniciar simulación" deshabilitado hasta tener 4 owners.

---

## 15 · Simulación (vista facilitador) — `/dashboard/games/[id]/simulate`

La pieza central del facilitador. Vista tipo **"consola"** con las 4 tarjetas de nodo + línea de tiempo + controles.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Simulación · Ronda 3 de 30                          ⏱ 02:14 restantes │
│ Estado: ● En curso     [⏸ Pausar] [⏭ Cerrar ronda] [↻ Reiniciar]    │
├──────────────────────────────────────────────────────────────────────┤
│ Línea de tiempo:                                                     │
│  R1 ✓  R2 ✓  R3 ●  R4 ○  R5 ○  R6 ○  R7 ○  R8 ○  R9 ○  R10 ○ …   │
│              ▲ aquí                                                  │
├──────────────────────────────────────────────────────────────────────┤
│ ┌── Retail ──────┐ ┌── Mayorista ──┐ ┌── Distribuidor ┐ ┌── Fab. ┐ │
│ │ 📦 Inv  12     │ │ 📦 Inv  18     │ │ 📦 Inv  20     │ │ 📦 24 │ │
│ │ ⏳ BO   0      │ │ ⏳ BO   2      │ │ ⏳ BO   0      │ │ ⏳ 0  │ │
│ │ 🚚 Tránsito 4  │ │ 🚚 Tránsito 3  │ │ 🚚 Tránsito 4  │ │ 🚚 4 │ │
│ │ Última pedido: │ │ Última pedido: │ │ Última pedido: │ │ …     │ │
│ │    4 (Samuel)  │ │    6 (Lucía)   │ │    5 (IA)      │ │  …    │ │
│ │ Costo acum:    │ │ Costo acum:    │ │ Costo acum:    │ │ …     │ │
│ │    $ 120.50    │ │    $  98.30    │ │    $ 110.00    │ │ …     │ │
│ │ Estado: ✅ Listo│ │ Estado: ⏳ Pend │ │ Estado: ✅ Listo│ │ ⏳    │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────┘ │
│                                                                      │
│ Mensaje del periodo 3:  "Pico de demanda entrante en R5"            │
└──────────────────────────────────────────────────────────────────────┘
```

- 4 `Card` en grid de 4 columnas (responsive → 2 / 1).
- Cada card con semántica de color:
  - Verde (`colorSuccess`) si el nodo ya envió pedido.
  - Ámbar (`colorWarning`) si falta.
  - Rojo (`colorError`) si hay backorder > 0.
- Línea de tiempo scrollable horizontal (chips redondos).
- Acciones masivas arriba a la derecha (`Dropdown` con Reiniciar / Exportar / Cerrar juego).

---

## 16 · Histórico de rondas — `/dashboard/games/[id]/rounds`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Histórico de rondas                       [⬇ Exportar CSV]           │
├──────────────────────────────────────────────────────────────────────┤
│  R30 ✓  hace 5 días                                                ▾ │
│   ┌─Retail───┐  ┌─Mayorista──┐  ┌─Distribuidor┐  ┌─Fabricante─┐    │
│   │Inv 8  BO0│  │Inv 10 BO0 │  │Inv 12 BO0   │  │Inv 14 BO0  │    │
│   │Ped  4    │  │Ped  4     │  │Ped  4       │  │Ped  4      │    │
│   │Costo $40 │  │Costo $40  │  │Costo $40    │  │Costo $40   │    │
│   └──────────┘  └────────────┘  └─────────────┘  └────────────┘    │
│  R29 ✓  hace 5 días                                                ▾ │
│  R28 ✓  hace 5 días                                                ▾ │
│  …                                                                  │
└──────────────────────────────────────────────────────────────────────┘
```

- `Collapse` (Ant) por ronda; click expande los 4 nodos con métricas en `Table`.

---

## 17 · Analítica y KPIs — `/dashboard/games/[id]/analytics`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Analítica · BDG Cohorte 5                                           │
├──────────────────────────────────────────────────────────────────────┤
│ ┌─ KPIs ───────────────────────────────────────────────────────────┐ │
│ │ Costo acum.   Ingreso acum.   Beneficio    Servicio   V. a tiempo│ │
│ │ $ 4 210      $ 7 200         $ 2 990       92 %       88 %     │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Pestañas:  Evolución cadena  |  Pedidos vs Demanda  |  Inventario    │
│           Costo vs Ingreso                                       │
│                                                                      │
│ ┌─ Gráfico activo: Evolución de la cadena ─────────────────────────┐ │
│ │   Pedidos totales        ┌─────────────────────────────────┐     │ │
│ │   Backorder total        │     ╱╲                          │     │ │
│ │   Inventario total       │   ╱   ╲___                      │     │ │
│ │   Ingreso total          │ ╱        ╲___                   │     │ │
│ │   Costo total acumulado  │╱             ╲_______           │     │ │
│ │                          └─────────────────────────────────┘     │ │
│ │                          R1  R5  R10  R15  R20  R25  R30        │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─ Tabla resumen por nodo ─────────────────────────────────────────┐ │
│ │ Nodo       │ Ped prom │ BO prom │ Inv prom │ Costo │ Ingreso │ …│ │
│ │ Retail     │  4.2     │ 0.3      │  7.1     │ $ 980 │ $1600   │  │ │
│ │ Mayorista  │  4.6     │ 0.5      │  9.8     │ $1100 │ $1500   │  │ │
│ │ Distribuid.│  4.4     │ 0.4      │  8.5     │ $1050 │ $1500   │  │ │
│ │ Fabricante │  4.3     │ 0.1      │  6.2     │ $1080 │ $1500   │  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- Tabs Ant con 4 vistas de gráficos (mapeadas 1-a-1 a las 4 secciones de gráficos del Excel).
- Gráficos con Recharts hoy (igual que en `demand-section.tsx`); migración futura a `@ant-design/plots` (no bloqueante).
- Tabla resumen con `colorSuccess` para servicio ≥ 95%, `colorWarning` 80–94%, `colorError` < 80%.

---

## 18 · Bandeja del jugador — `/play`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Hola Samuel · Estás jugando como: Retail                             │
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ BDG Cohorte 5                                  ● Ronda 3 abierta │ │
│ │ Empresa XYZ · Producto Cerveza 355ml                             │ │
│ │ [📥 Ingresar al tablero]                                         │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Demo Iván                                    ● Ronda 5 abierta    │ │
│ │ [📥 Ingresar al tablero]                                         │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ Historial reciente:                                                 │
│ • R2 — pediste 4  · costo $ 8,00                                     │
│ • R1 — pediste 4  · costo $ 8,00                                     │
└──────────────────────────────────────────────────────────────────────┘
```

- `Card` clicable por juego asignado; los `owner` con `status != active` aparecen atenuados.

---

## 19 · Tablero del jugador (mapa pedagógico) — `/play/[id]` (reescrito)

La pieza que más va a usar el jugador. Cambio fuerte frente a la versión anterior: **deja de ser un panel de métricas y pasa a ser un mapa isométrico/2D con la cadena entera** + tarjeta flotante del nodo anclada sobre su edificio + sidebar izquierdo con acciones de juego. Inspirado en Zensimu (referencia del producto).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Semana 5 · transacciones     ● Ronda 5 abierta · ⏱ 02:14   [❓ ayuda] [⎋ salir] │
├──┬──────────────────────────────────────────────────────────────────────────┤
│📋│                                                                          │
│In│        🏪  Distribuidor           🏭  Fabricante                         │
│st│        "Distribuidor" ✏         "Fabricante" ✏                           │
│ru│              ⬆️                       ⬇️                                  │
│c.│                                                                          │
│  │   🚚                          🚚 🚚                                      │
│🟥│     \____                      /  \____                                   │
│Fi│          \____                /        \____                            │
│na│  🏪 Retail ⬇️⬆️  🏬 Mayorista                                             │
│l.│     /\                  /\                                               │
│🔁│    /  \____            /  \____                                          │
│Re│   /        \________  /        \________                                  │
│in│  🚚                                                          🚚           │
│ic│   \____                                                   /____           │
│ar│        \____                                          /____              │
│  │             \________                              /____                  │
│🎬│ 🏬 Distribuidor (abajo-izq.)  ← nodo del jugador si es Distribuidor     │
│An│                                                                          │
│i.│ ┌──── Tarjeta flotante anclada al nodo del jugador ─────────────────┐    │
│📊│ │  Minorista  Alex✏ 👤                          (Semana 5)          │    │
│Est│ │  Stock: 19     Costo: €43                                       │    │
│📩│ │  Recibo: 9     Demanda: 8    Envío: 8                            │    │
│Me│ │  ┌──────┐                                                        │    │
│ns│ │  │  10  │  → ⬇️  [Ordenar]   (botón primario violeta)              │    │
│  │ │  └──────┘                                                        │    │
│aj│ └──────────────────────────────────────────────────────────────────┘    │
│  │                                                                          │
├──┴──────────────────────────────────────────────────────────────────────────┤
│ 🟩 Esperando tu pedido · Ronda 5 cierra en 02:14                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout** (flexbox horizontal):

- **Columna izquierda fija** (220 px) — el sidebar del jugador (ver §23). Solo aparece cuando `rol=player`.
- **Lienzo central** (resto del ancho) — SVG con el mapa. Los 4 nodos se posicionan en cruz:
  - `Retail` abajo-izquierda (≈ x: 15%, y: 75%) — ícono `ShopOutlined` o casa-tienda.
  - `Mayorista` abajo-centro (≈ x: 38%, y: 80%) — ícono `GoldOutlined` o almacén.
  - `Distribuidor` arriba-centro (≈ x: 62%, y: 25%) — ícono `TruckOutlined` o depósito.
  - `Fabricante` arriba-derecha (≈ x: 85%, y: 30%) — ícono `BuildOutlined` o fábrica.
  - Caminos curvos SVG (`<path d="M ... C ... C ...">`) conectándolos con flechas en ambos extremos (los pedidos suben, los despachos bajan).
- **Camiones animados** (`<Truck />` en SVG) sobre cada línea con `node-shipment` en tránsito. Posición interpolada según `(currentRound − shipment.round) / lead_time`. Animación con `@keyframes` (`transform: translate(...)`) — sin libs externas.
- **Tarjeta flotante** anclada al nodo del jugador. Posición absoluta sobre el edificio del nodo. Contiene:
  - Header: nombre del nodo + nombre del jugador + ícono Persona/Computadora + icono ✏ (renombrar) + 👤 (cambiar tipo).
  - Métricas (3 columnas × 2 filas): Stock, Costo, Recibo, Demanda, Envío + valor semanal actual.
  - Input numérico + botón "Ordenar" (CTA violeta `colorPrimary`).
- **Footer** (40 px): badge con el estado de la ronda + cuenta regresiva (Ant `Statistic.Countdown`).

**Estados visuales clave**:

- Cuando el jugador aún no envió pedido: la tarjeta tiene borde ámbar `colorWarning` y el footer dice "🟡 Esperando tu pedido".
- Cuando envió: borde verde `colorSuccess` y footer "🟢 Pedido enviado · Recibirás N en K semanas".
- Cuando la ronda se cierra y la animación corre: borde azul `colorInfo` y los camiones se desplazan visiblemente.
- Si hay backorder > 0 en el nodo: ícono BO rojo parpadeante junto al Stock.

**Componentes nuevos** (encajan en `packages/ui/src/`):

| Componente            | Archivo                                   | Tamaño                                                                                                  |
| --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `<ChainMap>`          | `packages/ui/src/chain-map.tsx`           | SVG con 4 nodos, paths, camiones, props: `nodes`, `shipments`, `currentRound`                           |
| `<Truck>`             | `packages/ui/src/truck.tsx`               | SVG inline animado; props: `from`, `to`, `progress`                                                     |
| `<NodeCard>`          | `packages/ui/src/node-card.tsx`           | Tarjeta flotante; props: `nodeType`, `owner`, `stockState`, `onSubmitOrder`                             |
| `<PlayerSidebar>`     | `packages/ui/src/player-sidebar.tsx`      | Columna izquierda con acciones (Finalizar, Reiniciar, Instrucciones, Animación, Estadísticas, Mensajes) |
| `<RoundSummaryModal>` | `packages/ui/src/round-summary-modal.tsx` | Modal pedagógico (ver §22)                                                                              |

> Cada uno mide < 200 líneas (cumple AGENTS.md §6).

---

## 20 · Histórico del jugador — `/play/[id]/history`

Se mantiene la tabla que ya estaba pensada:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Mi historial · BDG Cohorte 5                                         │
├──────────────────────────────────────────────────────────────────────┤
│ Ronda │ Pedido │ Inv final │ BO │ Costo inv │ Costo BO │ Costo total │
│ R3    │   4    │    12     │ 0  │   $6.00   │   $0.00  │    $6.00    │
│ R2    │   4    │    10     │ 0  │   $5.00   │   $0.00  │    $5.00    │
│ R1    │   4    │     8     │ 2  │   $4.00   │   $2.00  │    $6.00    │
│ …                                                                  │
│                                                                  │
│ Total acumulado: $ 120.50  ·  Servicio: 92 %                      │
└──────────────────────────────────────────────────────────────────────┘
```

- `Table` Ant con totales al pie (verde si van bien, rojo si BO acumulado > 0).
- Acceso desde el sidebar del jugador (§23) → "Estadísticas" → tab "Histórico".

---

## 22 · Modal pedagógico "¿Qué ocurre esta semana N?" — disparado al cierre de ronda

Overlay full-screen que se abre automáticamente cuando el motor cierra una ronda (cambio en `node-round-state`). Es la pieza didáctica más importante del juego: muestra el **transparente de cálculo** paso a paso.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                  [✕]         │
│                          ¿Qué ocurre semana 4?                              │
│                                                                              │
│   ✉ Demanda: 4                                                                  │
│   Desde Consumidor final                                                         │
│   ◀──────────────────────────┐                                                   │
│                                                                              │
│                            ┌──────────────────┐                              │
│                            │   🏬 Minorista   │                              │
│                            │   (edificio +    │                              │
│                            │    cajas)        │                              │
│                            └──────────────────┘                              │
│                                                                              │
│   ┌─────────────────────┐                       ┌─────────────────┐           │
│   │ 🚚 Recibo: 10  ❓   │                       │ 🚚 Envío: 4     │           │
│   │ Desde Mayorista     │                       │ Para Cons. final│           │
│   └─────────────────────┘                       └─────────────────┘           │
│                                                                              │
│   ┌─── Línea de tiempo ───────────────────────────────────────────────────┐  │
│   │ ▲ Stock: 12                                                             │  │
│   │ +10 −4  → Stock final: 18   (delta visual: verde el +, rojo el −)     │  │
│   │                                                                          │  │
│   │ 💼 Coste inicial: €24                                                    │  │
│   │ +€9  ❓ → Coste final: €33                                               │  │
│   │                                                                          │  │
│   │ ✓ Tiene suficiente Stock para cumplir con la demanda   (verde / éxito) │  │
│   └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   [ 🔁 Ver animación de nuevo ]    [ Siguiente paso: Ordenar ]   [✓] Mostrar │
│                                                                          cada │
└──────────────────────────────────────────────────────────────────────┘
```

**Estructura interna** (mapeada a las columnas del Excel "Cálculos"):

1. **Título** + botón cerrar (✕) arriba a la derecha.
2. **Diagrama del nodo** centrado:
   - Edificio del nodo (ícono SVG según `node-type`).
   - 4 flechas: `Demanda entrante` (desde cliente o nodo río arriba), `Recibo entrante` (desde río arriba, con icono 🚚), `Envío saliente` (hacia río abajo, icono 🚚). El ícono `❓` al lado del Recibo abre un tooltip explicando el cálculo del lead time.
3. **Línea de tiempo** (sección inferior):
   - `Stock` (▲): inicial → delta con signo → final. Los deltas se pintan verde (éxito) o rojo (problema).
   - `Coste` (💼): inicial → delta → final.
   - Mensaje de feedback según heurística:
     - ✅ "Tiene suficiente Stock para cumplir con la demanda" (cubre BO + demanda).
     - ⚠️ "Backorder aumenta: ahora tiene N unidades pendientes" (no alcanza).
     - 🚚 "El próximo recibo de N unidades llegará en K semanas" (lead time del próximo envío en tránsito).
4. **Footer** (botones):
   - `Ver animación de nuevo` → reproduce la transición de los camiones en el mapa de fondo (overlay con `motion`, fade in/out).
   - `Siguiente paso: Ordenar` → cierra el modal y devuelve el foco al input de la tarjeta flotante.
   - Checkbox `Mostrar cada semana` → persiste en `localStorage` (`playerPrefs.showRoundSummary`) para abrirlo automáticamente cada ronda.

**Server Actions**: ninguna nueva — los datos se derivan del `node-round-state` que ya existe. La animación se renderiza client-side con CSS.

**Criterios de aceptación**:

- Se abre sin recarga de página cuando cambia `node-round-state.lastClosedRoundId` (polling cada 5s o Supabase Realtime).
- Los 4 valores numéricos son **idénticos** a los que calcula `lib/simulation/advanceRound` (cubierto por test de regresión F5.12 en `PLAN_BDG.md`).
- El modal es responsive: en móvil ocupa toda la pantalla con scroll vertical.

---

## 23 · Sidebar izquierdo del jugador — dentro de `/play/[id]`

Columna fija de **220 px** a la izquierda del mapa, **solo visible para `rol=player`**. Reemplaza al sidebar global del dashboard para esta pantalla.

```
┌──────────────────┐
│  Jugando como    │
│  Minorista ✏    │  ← nombre del nodo + editar
├──────────────────┤
│ ▶ Finalizar      │  ← rojo, pide Modal.confirm
│ ⟳ Reiniciar      │  ← ámbar, pide Modal.confirm
├──────────────────┤
│ 📖 Instrucciones │  ← abre Drawer con el manual
│ 🎬 Animación     │  ← toggle on/off
│ 📊 Estadísticas  │  ← abre Modal con KPIs personales
│ ✉ Mensajes       │  ← abre Drawer con events-message-config
└──────────────────┘
```

**Detalle por acción**:

| Acción          | Comportamiento                                                                                                                      | Server Action                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `Finalizar`     | Modal Ant de confirmación → marca al jugador como "finalizó" en `owner` (status=`finalized`). El facilitador puede re-asignar.      | `finalizeGameForPlayerAction`     |
| `Reiniciar`     | Modal Ant de confirmación → solo se habilita si la ronda está `open` y el jugador no envió pedido.                                  | `reopenRoundAction`               |
| `Instrucciones` | `Drawer` Ant desde la derecha con el manual del juego (markdown).                                                                   | — (contenido estático)            |
| `Animación`     | `Switch` Ant: on/off del movimiento de camiones. Persiste en `localStorage` (`playerPrefs.animationsEnabled`).                      | `toggleAnimationPreferenceAction` |
| `Estadísticas`  | Modal con KPIs personales: costo total, inventario promedio, BO promedio, ventas a tiempo, nivel de servicio. Recharts mini al pie. | — (lee `node-round-state`)        |
| `Mensajes`      | Drawer con la lista de `events-message-config` activos en el periodo actual.                                                        | — (lee `events-message-config`)   |

**Estados**:

- `Finalizar` siempre habilitado.
- `Reiniciar` deshabilitado (gris) si la ronda está cerrada o ya envió pedido.
- `Animación` muestra el estado actual con un punto verde (on) o gris (off).
- `Mensajes` muestra un badge rojo con el número de mensajes no leídos si hay alguno con `period = currentRound`.

**Estilos**:

- Fondo `colorBgContainer` blanco, borde derecho `colorBorderSecondary`.
- Botones con `variant="text"` y ancho completo.
- Iconos `lucide-react`: `LogOut` (Finalizar), `RotateCcw` (Reiniciar), `BookOpen` (Instrucciones), `Film` (Animación), `BarChart3` (Estadísticas), `Inbox` (Mensajes).

---

## 21 · Admin — `/admin`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Administración                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ Pestañas:  Tipos de nodo  |  Productos  |  Roles  |  Estados       │
│                                                                  │
│ Tipos de nodo                                                    │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Nombre      │ Descripción              │ Estado  │ Acciones  │ │
│ │ Retail      │ Venta al consumidor      │ ● Activo│ ✎ 🗑      │ │
│ │ Mayorista   │ Eslabón intermedio       │ ● Activo│ ✎ 🗑      │ │
│ │ Distribuidor│ Transporte regional      │ ● Activo│ ✎ 🗑      │ │
│ │ Fabricante  │ Producción               │ ● Activo│ ✎ 🗑      │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ [+ Nuevo tipo de nodo]                                            │
└──────────────────────────────────────────────────────────────────────┘
```

- Tabs Ant; cada tab es un CRUD estándar con `Table` + `Modal` para alta/edición.
- Soft-delete (cambia `status` a `inactive` desde `row-status`).

---

## Componentes compartidos clave (`@repo/ui`)

Los siguientes wrappers viven en `packages/ui/src` y se usan transversalmente. AGENTS.md §6 obliga a que cada archivo de componente mida < 200 líneas.

| Componente                                                     | Uso principal                          | Pantallas                 |
| -------------------------------------------------------------- | -------------------------------------- | ------------------------- |
| `Card`, `CardHeader`, `CardTitle`, `CardContent`               | bloques de contenido con borde suave   | 4, 12, 15, 17, 18, 19     |
| `Button` (variants `default`, `outline`, `ghost`, `danger`)    | CTAs primarios/secundarios             | todas                     |
| `Input`, `Input.Password`, `TextArea`                          | campos de texto                        | 1, 2, 5–11                |
| `InputNumber` (de antd crudo)                                  | pedido del jugador, numéricos con step | 7, 19                     |
| `Select`                                                       | dropdowns (periodo tipo, nodo)         | 6, 11, 14                 |
| `DatePicker` (antd crudo)                                      | fechas                                 | 5, 14                     |
| `Dropdown`                                                     | menú de usuario en sidebar             | todas                     |
| `Collapse` / `Accordion`                                       | secciones colapsables                  | 8, 9, 10, 16, 17          |
| `Steps` (antd crudo)                                           | stepper de creación                    | 5–11                      |
| `Tabs` (antd crudo)                                            | pestañas                               | 12, 17, 21                |
| `Table` (antd crudo)                                           | listados                               | 4, 12, 14, 16, 17, 20, 21 |
| `Modal` (antd crudo)                                           | confirmaciones y alta/edición          | 14, 21                    |
| `Alert` (antd crudo)                                           | mensajes contextuales                  | 11, 19                    |
| `Tag` / `Badge`                                                | estado visual                          | 4, 12, 14, 15             |
| `Progress` (antd crudo)                                        | cuenta regresiva de ronda              | 15, 19                    |
| `Field`, `FieldLabel`, `FieldError`, `FieldSet`, `FieldLegend` | estructura de formularios              | 1, 2, 3, 5–11             |

---

## Estados visuales y semántica de color

| Estado      | Color                    | Uso                                              |
| ----------- | ------------------------ | ------------------------------------------------ |
| OK / Activo | `colorSuccess #10b981`   | inventario > 0, BO = 0, ronda enviada            |
| Atención    | `colorWarning #f59e0b`   | stock de seguridad cruzado, ronda por cerrar     |
| Peligro     | `colorError #ef4444`     | backorder > 0, ronda cerrada, validación fallida |
| Neutro      | `slate-500` / `zinc-200` | archivado, inactivo, deshabilitado               |
| Primario    | `colorPrimary #7c3aed`   | CTAs, foco, identidad de marca                   |

---

## Responsive

- **Breakpoints**: usar `sm` (≥640), `md` (≥768), `lg` (≥1024), `xl` (≥1280) — utilidades Tailwind v4.
- **Sidebar**: pasa a `Drawer` Ant en < `md`.
- **Tablero del jugador (19)**: 1 columna en móvil, 2 en tablet, layout completo en desktop.
- **Tablas**: scroll horizontal en < `md` con `Table.scroll={{ x: true }}`.
- **Gráficos**: `ResponsiveContainer` de Recharts con `height` fijo (~250–320) para que no se aplasten.

---

## Próximos pasos para aterrizar la UI

1. Confirmar y bloquear los **wireframes** (este documento). Cualquier cambio posterior se versiona acá.
2. Reutilizar `node-distribution-section` y `Card` de `@repo/ui` para no romper el techo de 200 líneas (AGENTS.md §6).
3. Cuando arranque F3 (`PLAN_BDG.md`), envolver las secciones existentes en `Steps` sin tocar su contenido.
4. Cuando arranque F5/F6, priorizar el **tablero del jugador (19)** y la **simulación del facilitador (15)** porque son las pantallas más usadas.
5. Diseño de los íconos por nodo (`Retail`, `Mayorista`, `Distribuidor`, `Fabricante`) — usar `lucide-react` que ya está en el repo (`ShoppingCart`, `Truck`, `Factory`, `Package` como punto de partida) o Ant Icons (`ShopOutlined`, `TruckOutlined`, `GoldOutlined`, `BuildOutlined`).
