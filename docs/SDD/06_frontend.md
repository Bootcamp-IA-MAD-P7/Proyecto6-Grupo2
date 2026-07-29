# Software Design Document (SDD)

# SDD-06 · Frontend Design

| Campo | Valor |
|---|---|
| Proyecto | TalentCare |
| Documento | Frontend Design |
| Código | SDD-06 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00; SDD-00A; SDD-01; SDD-02 |
| Documentos relacionados | SDD-07 · API |

---

## 1. Descripción

El frontend es una SPA (Single Page Application) construida con React + TypeScript + Vite. No tiene router — toda la interfaz vive en una única página con scroll vertical, sin autenticación ni perfil persistente, conforme al alcance del MVP definido en SDD-00.

La interfaz se organiza en dos vistas principales:

| Vista | Archivo | Propósito |
|---|---|---|
| Dashboard ejecutivo | `app.tsx` → `ExecutiveDashboard` | Análisis agregado del modelo sobre la población de desarrolladores, orientado a profesionales de RR. HH. y People Analytics |
| Predicción individual | `MainPage.tsx` | Formulario de análisis de un perfil profesional concreto, con resultado, explicación y recomendaciones |

---

## 2. Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3 | Framework UI |
| TypeScript | 5.7 | Tipado estático |
| Vite | 5.4 | Build tool y dev server |
| Tailwind CSS | 4.1 | Estilos utilitarios |
| lucide-react | 0.468 | Iconos |
| recharts | 3.0 | Gráficos (disponible, pendiente de uso) |
| clsx + tailwind-merge | — | Composición de clases CSS |

Comunicación con el backend: REST API mediante `fetch` nativo.

---

## 3. Estructura de ficheros

```
frontend/
└── src/
    ├── components/
    │   ├── dashboard/   — secciones del dashboard ejecutivo
    │   ├── layout/      — estructura de página (shell, sidebar, navegación)
    │   └── ui/          — componentes reutilizables genéricos
    ├── data/            — mock de datos para desarrollo
    ├── hooks/           — hooks de React personalizados
    ├── i18n/            — traducciones ES/EN (es.ts, en.ts, index.ts)
    ├── lib/             — utilidades (cn para clases CSS)
    ├── services/        — capa de comunicación con la API
    ├── types/           — tipos TypeScript compartidos
    ├── app.tsx          — componente raíz
    ├── main.tsx         — punto de entrada
    ├── MainPage.tsx     — formulario de predicción individual (MVP)
    └── index.css        — paleta de colores y animaciones globales
```

Alias de importación: `@/` apunta a `src/`. Ejemplo: `import { cn } from "@/lib/utils"`.

---

## 4. Flujo de datos

```
main.tsx
  └── App (app.tsx)
        └── ExecutiveDashboard (components/dashboard/executive-dashboard.tsx)
              ├── getDashboardOverview()  ← services/dashboard-service.ts
              │     └── [actualmente devuelve mock de data/dashboard.ts]
              │     └── [reemplazar por fetch a GET /api/dashboard/overview]
              └── Secciones del dashboard (reciben datos como props)
```

`ExecutiveDashboard` es el orquestador principal. Gestiona:
- Estado de carga (`loading` / `success` / `error` / `empty`)
- Idioma activo (persistido en `localStorage` con clave `talentcare-language`)
- Dimensión de segmento activa

---

## 5. Componentes del dashboard

### `ExecutiveDashboard`
**Archivo:** `components/dashboard/executive-dashboard.tsx`
**Rol:** Orquestador. Llama al servicio, gestiona estados y pasa datos a las secciones.
**Props:** ninguna — es el componente raíz de la vista.

### `HomeHero`
**Archivo:** `components/dashboard/home-hero.tsx`
**Rol:** Cabecera de bienvenida con saludo y contexto del análisis.
**Props:** `translations`
**Nota:** El saludo está hardcodeado en las traducciones. Cuando el backend tenga autenticación, el nombre debe venir del campo `profile.name` del `DashboardOverview`.

### `WorkforceOutlookSection`
**Archivo:** `components/dashboard/workforce-outlook-section.tsx`
**Rol:** Muestra las 4 métricas principales (perfiles analizados, perfiles en revisión, % satisfacción baja, segmentos).
**Props:** `metrics: WorkforceMetric[]`, `language`, `translations`

### `ExecutiveInsightSection`
**Archivo:** `components/dashboard/executive-insight-section.tsx`
**Rol:** Insight principal del análisis con panel de evidencia visual.
**Props:** `insight: ExecutiveInsight`, `language`, `translations`, `onExplore`

### `SegmentExplorationSection`
**Archivo:** `components/dashboard/segment-exploration-section.tsx`
**Rol:** Exploración interactiva por dimensión (experiencia, educación, empleo, tamaño empresa...).
**Props:** `dimensions: SegmentData[]`, `language`, `activeDimension`, `onDimensionChange`, `translations`
**Estado actual:** solo `experience` tiene datos reales. El resto tiene `status: "pending"` y muestra un placeholder de "próximamente".

### `AssociatedFactorsSection`
**Archivo:** `components/dashboard/associated-factors-section.tsx`
**Rol:** Importancia de variables del modelo (feature importance).
**Props:** `factors: AssociatedFactor[]`, `translations`

### `RecommendedActionsSection`
**Archivo:** `components/dashboard/recommended-actions-section.tsx`
**Rol:** Acciones recomendadas para RR. HH. con prioridad.
**Props:** `actions: RecommendedAction[]`, `translations`, `onExplore`, `onReviewContext`
**Nota:** Las acciones están definidas por IDs fijos (`earlyCareer`, `internalContext`, `listening`). El texto viene de las traducciones, no del backend.

### `MethodologySection`
**Archivo:** `components/dashboard/methodology-section.tsx`
**Rol:** Explicación del modelo, fuente de datos y limitaciones.
**Props:** `items: MethodologyItem[]`, `translations`
**Nota:** Contenido estático — no requiere datos del backend.

### `DashboardStateView`
**Archivo:** `components/dashboard/dashboard-state-view.tsx`
**Rol:** Vista de estados alternativos: `loading`, `error`, `empty`.
**Props:** `state`, `translations`, `onRetry`

---

## 6. Componentes de layout

### `AppShell`
**Archivo:** `components/layout/app-shell.tsx`
**Rol:** Contenedor principal. Gestiona el sidebar y el botón de menú móvil.
**Props:** `language`, `onLanguageChange`, `profile`, `translations`, `children`

### `AppSidebar`
**Archivo:** `components/layout/app-sidebar.tsx`
**Rol:** Navegación lateral con scroll a secciones, selector de idioma y perfil de usuario.
**Navegación disponible:** Overview (activo), Metodología (scroll). People e Insights están deshabilitados (`available: false`), pendientes de implementación.

### `LanguageSelector`
**Archivo:** `components/layout/language-selector.tsx`
**Rol:** Selector ES/EN. Persiste la elección en `localStorage`.

### `UserProfileSummary`
**Archivo:** `components/layout/user-profile-summary.tsx`
**Rol:** Muestra nombre, rol e iniciales del usuario en el sidebar.
**Datos:** vienen de `profile: UserProfile` del `DashboardOverview`.

---

## 7. Componentes UI reutilizables

| Componente | Archivo | Descripción |
|---|---|---|
| `Button` | `ui/button.tsx` | Botón con variantes (`default`, `ghost`, `outline`) y tamaños |
| `Card` | `ui/card.tsx` | Contenedor con borde y fondo de tarjeta |
| `Badge` | `ui/badge.tsx` | Etiqueta de estado o categoría |
| `Reveal` | `ui/reveal.tsx` | Wrapper de animación de entrada con IntersectionObserver |
| `ContextualHelp` | `ui/contextual-help.tsx` | Tooltip/popover de ayuda contextual |
| `PrimaryCTA` / `SecondaryCTA` | `ui/cta.tsx` | Botones de llamada a la acción con estilos predefinidos |
| `Separator` | `ui/separator.tsx` | Línea divisoria horizontal |

---

## 8. Formulario de predicción individual (MainPage)

**Archivo:** `src/MainPage.tsx`
**Estado:** implementado con mock local (sin conexión al backend).
**Endpoint destino:** `POST /api/v1/predict`
**Casos de uso cubiertos:** UC-01 a UC-09

Implementa el flujo completo: formulario → validación → resultado → explicación de factores → recomendaciones → nuevo análisis.

### Campos del formulario

| Campo | Variable del modelo | Tipo |
|---|---|---|
| Años de experiencia programando | `YearsCodeNum` | float |
| Salario anual (USD) | `ConvertedCompYearly` | float |
| Rama principal | `MainBranch` | string (desplegable) |
| Situación laboral | `Employment` | string (desplegable) |
| Nivel educativo | `EdLevel` | string (desplegable) |
| Edad | `Age` | string (desplegable) |
| Tamaño de la organización | `OrgSize` | string (desplegable) |
| País | `Country` | string (desplegable) |

Todos los campos son obligatorios. La validación se realiza en el frontend (HTML5) y de forma autoritativa en el backend (Pydantic), conforme a FR-013.

### Errores HTTP que el frontend debe manejar

| Código | Causa | Comportamiento esperado en UI |
|---|---|---|
| `422` | Datos inválidos (Pydantic) | Mostrar error por campo |
| `500` | Fallo interno del backend | Mostrar estado de error genérico |
| `503` | Backend no disponible | Mostrar estado de indisponibilidad con opción de reintentar |

---

## 9. Contrato de datos — integración con backend

### Dashboard (`GET /api/dashboard/overview`)

El servicio `getDashboardOverview()` en `services/dashboard-service.ts` debe reemplazarse por un `fetch` a `GET /api/dashboard/overview` cuando el endpoint esté disponible.

**Tipo de respuesta esperada** (`types/dashboard.ts`):

```typescript
interface DashboardOverview {
  isDemo: boolean
  profile: UserProfile
  metrics: WorkforceMetric[]
  executiveInsight: ExecutiveInsight
  segmentDimensions: SegmentData[]
  factors: AssociatedFactor[]
  actions: RecommendedAction[]
  methodology: MethodologyItem[]
}

interface WorkforceMetric {
  id: "profiles" | "review" | "lowerSatisfaction" | "segments"
  value: number
  format: "integer" | "percentage"
  highlighted?: boolean
}

interface SegmentData {
  dimension: "experience" | "education" | "employment" | "companySize" | "country" | "professionalRole" | "age"
  status: "available" | "pending"
  items: Array<{ id: string; value: number }>
  highlightedSegmentId?: string
}

interface AssociatedFactor {
  id: string    // debe coincidir con una clave en translations.factors.labels
  value: number // porcentaje de importancia (0–100), suma total ~100
}
```

### Predicción individual (`POST /api/v1/predict`)

Contrato completo en SDD-07. El frontend envía los 8 campos del formulario y recibe:

```typescript
interface PredictionResponseBinary {
  prediction: number                   // 0 o 1
  label: "not_satisfied" | "satisfied"
  probability_not_satisfied: number    // 0.0 – 1.0
  probability_satisfied: number        // 0.0 – 1.0
}
```

---

## 10. Cómo conectar el backend

### Dashboard (3 pasos)

**Paso 1** — Añadir la URL base en `.env`:
```
VITE_API_URL=http://localhost:8000
```

**Paso 2** — Reemplazar `services/dashboard-service.ts`:
```typescript
import type { DashboardOverview } from "@/types/dashboard"

const API_URL = import.meta.env.VITE_API_URL ?? ""

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  const response = await fetch(`${API_URL}/api/dashboard/overview`)
  if (!response.ok) throw new Error("Dashboard overview unavailable")
  const data: unknown = await response.json()
  if (!data) return null
  return data as DashboardOverview
}
```

**Paso 3** — Eliminar `data/dashboard.ts` (ya no se necesita el mock).

### Predicción individual (MainPage)

1. Reemplazar `handleSimulate` por un `fetch` real a `POST /api/v1/predict`
2. Añadirlo como sección dentro del `AppShell` o como vista separada
3. Eliminar la lógica de simulación local

Los estados `loading`, `error` y `empty` ya están implementados — no requieren cambios.

---

## 11. Internacionalización

- Idiomas soportados: `es` (español) y `en` (inglés)
- Archivos: `i18n/es.ts`, `i18n/en.ts`, `i18n/index.ts`
- Persistencia: `localStorage` con clave `talentcare-language`
- Todos los textos visibles vienen de las traducciones — no hay strings hardcodeados en los componentes

---

## 12. Paleta de colores

Definida en `index.css` con variables CSS. Paleta en tonos tierra/terracota:

| Variable | Uso |
|---|---|
| `--background` | Fondo general (`#fafaf8` — blanco cálido) |
| `--primary` | Color de acción principal (`#b56a4a` — terracota) |
| `--sidebar` | Fondo del sidebar (`#242321` — casi negro cálido) |
| `--risk-low` | Verde para satisfacción alta |
| `--risk-medium` | Amarillo/ocre para riesgo medio |
| `--risk-high` | Rojo terracota para riesgo alto |

---

## 13. Validación pre-integración

**Fecha:** Julio 2026 — **Resultado:** ✅ Aprobado

### Responsive

| Resolución | Resultado |
|---|---|
| 375px (iPhone SE) | ✅ Correcto |
| 768px (iPad) | ✅ Correcto |
| 1280px (Desktop) | ✅ Correcto |

### Accesibilidad (Lighthouse)

- Puntuación: **100/100**
- Issue corregido: contraste insuficiente en `HomeHero` — `text-primary` → `text-muted-foreground` (`#b56a4a` tenía ratio ~3.2:1, por debajo del mínimo WCAG AA de 4.5:1)

### Rendimiento (Lighthouse — modo dev)

| Navegador | Rendimiento | CLS |
|---|---|---|
| Chrome (incógnito) | 64/100 | 0 ✅ |
| Edge | 66/100 | 0 ✅ |

En build de producción se espera 85–95. CLS 0 confirma estabilidad de layout.

### Cross-browser

Chrome y Edge: layout y comportamiento consistentes ✅

---

## 14. Comandos de desarrollo

```bash
cd frontend
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción
npm run preview   # previsualizar el build
```

---

## 15. Decisiones pendientes

| ID | Decisión | Impacto |
|---|---|---|
| OD-03 | Variables definitivas del formulario | Campos de `MainPage.tsx` pueden cambiar |
| OD-05 | Método de explicabilidad (XAI) | Formato de `top_factors` en la respuesta del backend |
| OD-07 | Presentación de probabilidades o confianza | El campo `probability` puede eliminarse o reformatearse |
| — | Conexión de `MainPage.tsx` al `AppShell` | Pendiente de decisión de navegación del equipo |
| — | Endpoint `GET /api/dashboard/overview` | Requiere implementación en backend para reemplazar el mock |

---

## 16. Trazabilidad

| Caso de uso | Componente / Archivo |
|---|---|
| UC-01 | `HomeHero`, `MethodologySection`, aviso de privacidad en `MainPage.tsx` |
| UC-02 | Formulario en `MainPage.tsx` |
| UC-03 | Validación HTML5 en `MainPage.tsx` (autoritativa en backend) |
| UC-04 | `handleSimulate()` en `MainPage.tsx` → `POST /api/v1/predict` |
| UC-05 | Bloque de resultado en `MainPage.tsx`, `WorkforceOutlookSection` |
| UC-06 | Bloque de factores en `MainPage.tsx`, `AssociatedFactorsSection` |
| UC-07 | `RecommendedActionsSection`, bloque de recomendaciones en `MainPage.tsx` |
| UC-08 | `handleReset()` en `MainPage.tsx` |
| UC-09 | `DashboardStateView`, estado `isLoading` en `MainPage.tsx` |
