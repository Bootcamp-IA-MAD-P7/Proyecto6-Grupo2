# Frontend — Documentación de Componentes e Integración con Backend

**Versión:** 1.1  
**Estado:** Draft  
**Autora:** Anahí  
**Relacionado con:** SDD-00A · Use Cases, SDD-06 · Frontend Design, SDD-07 · API

---

## 1. Arquitectura general

El frontend es una SPA (Single Page Application) construida con React + TypeScript + Vite. No tiene router — toda la interfaz vive en una única página con scroll vertical.

```
frontend/
└── src/
    ├── components/
    │   ├── dashboard/   — secciones del dashboard ejecutivo
    │   ├── layout/      — estructura de página (shell, sidebar, navegación)
    │   └── ui/          — componentes reutilizables genéricos
    ├── data/            — mock de datos para desarrollo
    ├── hooks/           — hooks de React personalizados
    ├── i18n/            — traducciones ES/EN
    ├── lib/             — utilidades (cn para clases CSS)
    ├── services/        — capa de comunicación con la API
    ├── types/           — tipos TypeScript compartidos
    ├── app.tsx          — componente raíz
    ├── main.tsx         — punto de entrada
    ├── MainPage.tsx     — formulario de predicción individual (MVP)
    └── index.css        — paleta de colores y animaciones globales
```

**Alias de importación:** `@/` apunta a `src/`. Ejemplo: `import { cn } from "@/lib/utils"`.

---

## 2. Flujo de datos

```
main.tsx
  └── App (app.tsx)
        └── ExecutiveDashboard (components/dashboard/executive-dashboard.tsx)
              ├── getDashboardOverview()  ← services/dashboard-service.ts
              │     └── [actualmente devuelve mock de data/dashboard.ts]
              │     └── [reemplazar por fetch a GET /api/dashboard/overview]
              └── Secciones del dashboard (reciben datos como props)
```

El componente `ExecutiveDashboard` es el orquestador principal. Gestiona:
- Estado de carga (`loading` / `success` / `error` / `empty`)
- Idioma activo (persistido en `localStorage` con clave `talentcare-language`)
- Dimensión de segmento activa

---

## 3. Componentes del dashboard

### `ExecutiveDashboard`
**Archivo:** `components/dashboard/executive-dashboard.tsx`  
**Rol:** Orquestador. Llama al servicio, gestiona estados y pasa datos a las secciones.  
**Props:** ninguna — es el componente raíz de la vista.

### `HomeHero`
**Archivo:** `components/dashboard/home-hero.tsx`  
**Rol:** Cabecera de bienvenida con saludo y contexto del análisis.  
**Props:** `translations`  
**Nota:** El saludo (`"Buenos días, Julián"`) está hardcodeado en las traducciones. Cuando el backend tenga autenticación, el nombre debe venir del campo `profile.name` del `DashboardOverview`.

### `WorkforceOutlookSection`
**Archivo:** `components/dashboard/workforce-outlook-section.tsx`  
**Rol:** Muestra las 4 métricas principales (perfiles analizados, perfiles en revisión, % satisfacción baja, segmentos).  
**Props:** `metrics: WorkforceMetric[]`, `language`, `translations`  
**Datos esperados del backend:** array de `WorkforceMetric` — ver sección 6.

### `ExecutiveInsightSection`
**Archivo:** `components/dashboard/executive-insight-section.tsx`  
**Rol:** Insight principal del análisis con panel de evidencia visual.  
**Props:** `insight: ExecutiveInsight`, `language`, `translations`, `onExplore`  
**Datos esperados del backend:** objeto `ExecutiveInsight` con `evidence.segments[]` — ver sección 6.

### `SegmentExplorationSection`
**Archivo:** `components/dashboard/segment-exploration-section.tsx`  
**Rol:** Exploración interactiva por dimensión (experiencia, educación, empleo, tamaño empresa...).  
**Props:** `dimensions: SegmentData[]`, `language`, `activeDimension`, `onDimensionChange`, `translations`  
**Estado actual:** solo `experience` tiene datos reales. El resto tiene `status: "pending"` y muestra un mensaje de "próximamente".  
**Datos esperados del backend:** array de `SegmentData` — ver sección 6.

### `AssociatedFactorsSection`
**Archivo:** `components/dashboard/associated-factors-section.tsx`  
**Rol:** Importancia de variables del modelo (feature importance).  
**Props:** `factors: AssociatedFactor[]`, `translations`  
**Datos esperados del backend:** array `[{ id: string, value: number }]` donde `value` es el porcentaje de importancia (0–100).

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

## 4. Componentes de layout

### `AppShell`
**Archivo:** `components/layout/app-shell.tsx`  
**Rol:** Contenedor principal. Gestiona el sidebar y el botón de menú móvil.  
**Props:** `language`, `onLanguageChange`, `profile`, `translations`, `children`

### `AppSidebar`
**Archivo:** `components/layout/app-sidebar.tsx`  
**Rol:** Navegación lateral con scroll a secciones, selector de idioma y perfil de usuario.  
**Navegación disponible:** Overview (activo), Metodología (scroll). People e Insights están deshabilitados (`available: false`).

### `LanguageSelector`
**Archivo:** `components/layout/language-selector.tsx`  
**Rol:** Selector ES/EN. Persiste la elección en `localStorage`.

### `UserProfileSummary`
**Archivo:** `components/layout/user-profile-summary.tsx`  
**Rol:** Muestra nombre, rol e iniciales del usuario en el sidebar.  
**Datos:** vienen de `profile: UserProfile` del `DashboardOverview`.

---

## 5. Componentes UI reutilizables

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

## 6. Contrato de datos — integración con backend

El servicio `getDashboardOverview()` en `services/dashboard-service.ts` debe reemplazarse por un `fetch` a `GET /api/dashboard/overview`.

**Tipo de respuesta esperada:** `DashboardOverview` (definido en `types/dashboard.ts`)

```typescript
interface DashboardOverview {
  isDemo: boolean                     // true en demo, false en producción
  profile: UserProfile                // datos del usuario autenticado
  metrics: WorkforceMetric[]          // 4 métricas del panel superior
  executiveInsight: ExecutiveInsight  // insight principal con evidencia
  segmentDimensions: SegmentData[]    // segmentación por dimensión
  factors: AssociatedFactor[]         // importancia de variables del modelo
  actions: RecommendedAction[]        // acciones recomendadas
  methodology: MethodologyItem[]      // items de metodología (estáticos)
}
```

**Detalle de los tipos clave:**

```typescript
// Métricas del panel superior
interface WorkforceMetric {
  id: "profiles" | "review" | "lowerSatisfaction" | "segments"
  value: number
  format: "integer" | "percentage"
  highlighted?: boolean
}

// Segmentación por dimensión
interface SegmentData {
  dimension: "experience" | "education" | "employment" | "companySize" | "country" | "professionalRole" | "age"
  status: "available" | "pending"   // pending = sin datos, muestra placeholder
  items: Array<{ id: string; value: number }>  // value = % de satisfacción baja
  highlightedSegmentId?: string     // id del segmento a destacar visualmente
}

// Factores del modelo (feature importance)
interface AssociatedFactor {
  id: string    // debe coincidir con una clave en translations.factors.labels
  value: number // porcentaje de importancia (0–100), suma total ~100
}
```

**Ejemplo de respuesta mínima válida del backend:**

```json
{
  "isDemo": false,
  "profile": { "id": "u1", "name": "Ana García", "role": "HR Director", "initials": "AG" },
  "metrics": [
    { "id": "profiles", "value": 1248, "format": "integer" },
    { "id": "review", "value": 130, "format": "integer" },
    { "id": "lowerSatisfaction", "value": 10.4, "format": "percentage", "highlighted": true },
    { "id": "segments", "value": 4, "format": "integer" }
  ],
  "executiveInsight": {
    "id": "early-career-concentration",
    "evidence": {
      "segments": [
        { "id": "0-2", "value": 18.4, "highlighted": true },
        { "id": "3-5", "value": 11.2, "highlighted": false },
        { "id": "6-10", "value": 8.7, "highlighted": false },
        { "id": "11-plus", "value": 6.1, "highlighted": false }
      ],
      "seniorRateMultiplier": 3,
      "nextCohortDifference": 7.2
    }
  },
  "segmentDimensions": [
    {
      "dimension": "experience",
      "status": "available",
      "highlightedSegmentId": "0-2",
      "items": [
        { "id": "0-2", "value": 18.4 },
        { "id": "3-5", "value": 11.2 },
        { "id": "6-10", "value": 8.7 },
        { "id": "11-plus", "value": 6.1 }
      ]
    },
    { "dimension": "education", "status": "pending", "items": [] }
  ],
  "factors": [
    { "id": "experience", "value": 28 },
    { "id": "salary", "value": 22 },
    { "id": "employment", "value": 16 },
    { "id": "education", "value": 13 },
    { "id": "role", "value": 10 },
    { "id": "companySize", "value": 6 },
    { "id": "country", "value": 3 },
    { "id": "age", "value": 2 }
  ],
  "actions": [
    { "id": "earlyCareer", "priority": "high" },
    { "id": "internalContext", "priority": "recommended" },
    { "id": "listening", "priority": "consider" }
  ],
  "methodology": [
    { "id": "prediction" }, { "id": "source" }, { "id": "target" },
    { "id": "limitations" }, { "id": "oversight" }, { "id": "privacy" }
  ]
}
```

---

## 7. Cómo conectar el backend (3 pasos)

Cuando el endpoint `GET /api/dashboard/overview` esté disponible, el cambio es mínimo:

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

Los estados `loading`, `error` y `empty` ya están implementados en `ExecutiveDashboard` — no requieren cambios.

---

## 8. Formulario de predicción individual (MainPage)

**Archivo:** `src/MainPage.tsx`  
**Estado:** implementado con mock local (sin conexión al backend).  
**Endpoint destino:** `POST /predict`  
**Casos de uso cubiertos:** UC-01, UC-02, UC-03, UC-04, UC-05, UC-06, UC-07, UC-08, UC-09

Este componente implementa el flujo completo de predicción individual definido en SDD-06 y SDD-00A: formulario de entrada → validación → resultado → explicación de factores → recomendaciones → nuevo análisis.

**Cuerpo de la petición:**
```typescript
interface PredictRequest {
  years_code_pro: number
  ed_level: string
  remote_work: string
  language_have_worked_with: string
  converted_comp_yearly: number
}
```

**Respuesta esperada:**
```typescript
interface PredictResponse {
  prediction: number                  // 0 o 1
  label: "Satisfecho" | "En Riesgo de Salida"
  probability: number                 // 0.0 – 1.0
  top_factors: Array<{
    feature: string
    importance: number
  }>
}
```

**Pendiente de integración:** `MainPage.tsx` no está conectado a `app.tsx` actualmente — usa un mock local que simula la respuesta del backend con 1.5s de latencia artificial. Para activarlo en producción:
1. Reemplazar `handleSimulate` por un `fetch` real a `POST /predict`
2. Añadirlo como sección dentro del `AppShell` o como vista separada
3. Eliminar la lógica de simulación local

**Errores HTTP que el frontend debe manejar (según SDD-07):**

| Código | Causa | Comportamiento esperado en UI |
|---|---|---|
| `422` | Datos inválidos (Pydantic) | Mostrar error por campo |
| `500` | Fallo interno del backend | Mostrar estado de error genérico |
| `503` | Backend no disponible | Mostrar estado de indisponibilidad con opción de reintentar |

---

## 9. Trazabilidad con casos de uso

| Caso de uso | Componente / Archivo |
|---|---|
| UC-01 · Acceder y comprender la finalidad | `HomeHero`, `MethodologySection`, aviso de privacidad en `MainPage.tsx` |
| UC-02 · Introducir información profesional | Formulario en `MainPage.tsx` |
| UC-03 · Validar datos de entrada | Validación HTML5 en `MainPage.tsx` (validación autoritativa en backend) |
| UC-04 · Solicitar análisis | `handleSimulate()` en `MainPage.tsx` → `POST /predict` |
| UC-05 · Consultar resultado | Bloque de resultado en `MainPage.tsx` |
| UC-06 · Consultar explicación | Bloque de factores (`top_factors`) en `MainPage.tsx` |
| UC-07 · Consultar recomendaciones | Bloque de recomendaciones en `MainPage.tsx` y `RecommendedActionsSection` |
| UC-08 · Iniciar un nuevo análisis | `handleReset()` en `MainPage.tsx` |
| UC-09 · Gestionar errores e indisponibilidad | `DashboardStateView`, estado `isLoading` en `MainPage.tsx` |

---

## 10. Internacionalización (i18n)

- Idiomas soportados: `es` (español) y `en` (inglés)
- Archivos: `i18n/es.ts`, `i18n/en.ts`, `i18n/index.ts`
- El idioma se persiste en `localStorage` con la clave `talentcare-language`
- Todos los textos visibles de la UI vienen de las traducciones — no hay strings hardcodeados en los componentes (excepto el saludo en `HomeHero`, pendiente de conectar con el perfil real)

---

## 11. Paleta de colores y diseño

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

## 12. Dependencias principales

| Paquete | Versión | Uso |
|---|---|---|
| `react` | 18.3 | Framework UI |
| `typescript` | 5.7 | Tipado estático |
| `vite` | 5.4 | Build tool y dev server |
| `tailwindcss` | 4.1 | Estilos utilitarios |
| `lucide-react` | 0.468 | Iconos |
| `recharts` | 3.0 | Gráficos (disponible, pendiente de uso) |
| `clsx` + `tailwind-merge` | — | Composición de clases CSS |

---

## 13. Comandos de desarrollo

```bash
cd frontend
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción
npm run preview   # previsualizar el build
```

---

## 14. Decisiones pendientes

Estas decisiones están abiertas en el SDD-00A y afectan directamente al frontend:

| ID | Decisión | Impacto en frontend |
|---|---|---|
| OD-03 | Variables definitivas del formulario | Campos de `MainPage.tsx` pueden cambiar |
| OD-05 | Método de explicabilidad (XAI) | Formato de `top_factors` en la respuesta del backend |
| OD-07 | Presentación de probabilidades o confianza | El campo `probability` puede eliminarse o reformatearse |
| OD-09 | Idiomas disponibles | Actualmente ES/EN — puede ampliarse en `i18n/` |
| — | Conexión de `MainPage.tsx` al `AppShell` | Pendiente de decisión de navegación del equipo |
