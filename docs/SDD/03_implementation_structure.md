# Software Design Document (SDD)

# SDD-03 · Implementation Structure

| Campo | Valor |
|---|---|
| Proyecto | TalentCare *(nombre provisional)* |
| Documento | Estructura de implementación |
| Código | SDD-03 |
| Versión | 1.1 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00; SDD-00A; SDD-01; SDD-02 |
| Documentos relacionados | SDD-04 a SDD-09 |

---

## 1. Propósito

Define la organización física del repositorio, la responsabilidad de cada módulo y las dependencias permitidas.

No define comportamiento, arquitectura, contratos, diseño, modelado, pruebas ni despliegue. Esos detalles permanecen en sus SDD responsables.

La estructura documentada corresponde al repositorio en julio de 2026. Un archivo vacío es un placeholder, no una implementación.

---

## 2. Principios de organización

| Principio | Regla de implementación |
|---|---|
| Responsabilidad única | Cada módulo mantiene un propósito identificable. |
| Límites explícitos | Frontend, backend y código de datos/ML permanecen separados. |
| Dependencias descendentes | Una capa de nivel inferior no importa una capa de presentación. |
| Sin ciclos | Todo ciclo entre paquetes deberá eliminarse o justificarse mediante una decisión. |
| Reutilización controlada | La lógica compartida vive en `src/`, no en scripts o notebooks. |
| Configuración externa | Dependencias y valores de entorno se declaran fuera de la lógica. |
| Cambio incremental | Se amplían módulos existentes antes de crear una jerarquía no aprobada. |
| Fuente única | Un comportamiento no se duplica entre frontend, backend, scripts y notebooks. |

---

## 3. Estructura actual del repositorio

Se omiten `.git/`, `.venv/`, cachés y datos locales no versionados.

```text
Proyecto6-Grupo2/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── inference.py
│   │   ├── main.py
│   │   ├── routes.py
│   │   └── schemas.py
│   └── Dockerfile
├── data/
│   └── processed/
│       └── .gitkeep
├── docs/
│   └── SDD/
│       ├── 00_scope.md
│       ├── 00A_use_cases.md
│       ├── 01_requirements.md
│       ├── 02_architecture.md
│       ├── 03_implementation_structure.md
│       ├── 04_data_pipeline.md
│       ├── 05_modeling.md
│       ├── 06_frontend.md
│       ├── 07_api.md
│       ├── 08_testing.md
│       └── 09_deployment.md
├── frontend/
│   ├── src/
│   │   ├── app.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── models/
│   ├── metrics/
│   │   └── .gitkeep
│   ├── pipelines/
│   │   └── .gitkeep
│   └── trained/
│       └── .gitkeep
├── notebooks/
│   └── eda.py
├── scripts/
│   ├── evaluate.py
│   ├── predict.py
│   ├── preprocess.py
│   └── train.py
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── loader.py
│   │   ├── preprocessing.py
│   │   ├── split.py
│   │   └── validation.py
│   ├── evaluation/
│   │   ├── compare.py
│   │   ├── evaluate.py
│   │   ├── metrics.py
│   │   └── plots.py
│   ├── features/
│   │   ├── engineering.py
│   │   └── selection.py
│   ├── inference/
│   │   ├── load_pipeline.py
│   │   └── predict.py
│   └── training/
│       ├── baseline.py
│       ├── common.py
│       ├── ensemble.py
│       ├── random_forest.py
│       ├── train.py
│       ├── tuning.py
│       └── xgboost.py
├── tests/
│   ├── test_backend.py
│   ├── test_data.py
│   ├── test_evaluation.py
│   ├── test_inference.py
│   └── test_training.py
├── utils/
│   ├── __init__.py
│   └── load_raw_data.py
├── .github/
│   └── workflows/
├── .dockerignore
├── .env.example
├── .gitignore
├── .python-version
├── 1_propuesta.png
├── 2_propuesta_stack.png
├── ANEXOS.md
├── Makefile
├── README.md
├── __init__.py
├── docker-compose.yml
├── main.py
├── pyproject.toml
└── uv.lock
```

Los recursos gráficos `1_propuesta.png` y `2_propuesta_stack.png` permanecen en la raíz. Su ubicación definitiva está pendiente.

---

## 4. Organización de módulos

### 4.1 Backend

| Ruta | Propósito | Dependencias permitidas | Dependencias prohibidas |
|---|---|---|---|
| `backend/app/main.py` | Composición e inicio del backend | `routes`; configuración aprobada | Lógica de negocio, entrenamiento o transformación |
| `backend/app/routes.py` | Frontera de transporte | `schemas`; adaptador de aplicación | Frontend, entrenamiento, acceso directo a artefactos |
| `backend/app/schemas.py` | Estructuras de entrada, salida y error | Tipos y validadores aprobados | Rutas, frontend o carga del modelo |
| `backend/app/inference.py` | Adaptar backend a inferencia | API pública de `src/inference` | Entrenamiento, notebooks o interfaz |
| `backend/app/__init__.py` | Declarar el paquete | Ninguna lógica funcional | Efectos secundarios de inicio |

Los archivos están vacíos. La separación interna de aplicación, explicabilidad, recomendaciones y persistencia no se implementará hasta resolver IS-003.

### 4.2 Frontend

| Ruta | Propósito | Dependencias permitidas | Dependencias prohibidas |
|---|---|---|---|
| `frontend/src/main.tsx` | Arranque y montaje | `app.tsx`; configuración de cliente | ML, contratos Python o lógica de dominio |
| `frontend/src/app.tsx` | Composición de interfaz | Componentes que se creen dentro de `frontend/src/` | `backend/`, `src/`, `models/` o datos locales |
| `frontend/package.json` | Dependencias y comandos frontend | Paquetes aprobados | Dependencias Python o secretos |
| `frontend/vite.config.ts` | Configuración de build | Variables públicas aprobadas | Secretos o lógica funcional |

Los archivos están vacíos. La estructura de componentes y el stack final permanecen pendientes.

### 4.3 Datos y features

| Ruta | Propósito | Dependencias permitidas | Dependencias prohibidas |
|---|---|---|---|
| `src/data/loader.py` | Carga para procesos de datos/ML | Fuente aprobada; tipos de datos | Backend, frontend o notebooks |
| `src/data/preprocessing.py` | Limpieza y transformaciones reutilizables | Librerías declaradas; contratos de datos | Presentación o transporte |
| `src/data/split.py` | Particionado reproducible | Datos procesados | Backend o inferencia online |
| `src/data/validation.py` | Validación de datasets y esquema | Contratos de datos | Interfaz o rutas |
| `src/features/engineering.py` | Construcción de features | Datos procesados | Backend o frontend |
| `src/features/selection.py` | Selección de features | Features y configuración de modelado | Interfaz o rutas |

`utils/load_raw_data.py` mantiene el cargador utilizado por la exploración. No deberá convertirse en dependencia de producción sin resolver IS-009.

### 4.4 Entrenamiento, evaluación e inferencia

| Ruta | Propósito | Dependencias permitidas | Dependencias prohibidas |
|---|---|---|---|
| `src/training/` | Baseline, candidatos, tuning, ensembles y orquestación de entrenamiento | `src/data`; `src/features`; métricas públicas | Backend, frontend o notebooks |
| `src/evaluation/` | Evaluación, comparación, métricas y gráficos | Artefactos y datos de evaluación | Backend, rutas o entrenamiento como ejecutable |
| `src/inference/load_pipeline.py` | Carga del paquete aprobado | `models/pipelines`; `models/trained` | Entrenamiento o frontend |
| `src/inference/predict.py` | Inferencia sobre entradas compatibles | Pipeline cargado; contrato aprobado | Backend HTTP, entrenamiento o notebooks |

`src/inference` no deberá importar `src/training`. La publicación de artefactos es la única conexión entre ambos flujos.

### 4.5 Entradas auxiliares

| Ruta | Propósito | Regla |
|---|---|---|
| `scripts/` | Entradas de línea de comandos | Delegan en funciones públicas de `src/`; no contienen lógica reutilizable |
| `notebooks/eda.py` | Evidencia exploratoria | No es dependencia de producción ni ubicación única de lógica |
| `tests/` | Verificación del repositorio | Puede importar interfaces públicas; la estrategia pertenece a SDD-08 |
| `models/` | Artefactos y resultados | No contiene código ejecutable |
| `data/processed/` | Reserva para datos procesados | El contenido y versionado dependen de SDD-04 |
| `docs/SDD/` | Especificaciones | No se importa desde el código |
| `main.py` | Placeholder generado en raíz | No será entrypoint de producción sin decisión explícita |

---

## 5. Dependencias entre módulos

### 5.1 Dirección permitida

```text
frontend
   │ contrato externo
   ▼
backend/app
   │ API pública
   ▼
src/inference ──────► models/pipelines + models/trained

scripts ────────────► src
notebooks ──────────► src / utils
tests ──────────────► interfaces públicas

src/training ───────► src/data + src/features + src/evaluation.metrics
src/evaluation ─────► datos y artefactos de evaluación
```

### 5.2 Dependencias prohibidas

| Origen | No deberá depender de | Motivo |
|---|---|---|
| `frontend/` | `backend/`, `src/`, `models/`, `data/` | El contrato externo es su único límite |
| `backend/app/routes.py` | `src/training`, `src/data`, artefactos directos | La ruta delega, no procesa |
| `src/` | `backend/` o `frontend/` | El núcleo no depende de adaptadores |
| `src/inference/` | `src/training/` | Entrenamiento e inferencia están separados |
| `src/data/` y `src/features/` | Capas de aplicación o presentación | Son módulos reutilizables |
| `scripts/` y `notebooks/` | Importación desde producción | Son consumidores, no librerías |
| Cualquier módulo | Un módulo que ya dependa de él | Evita ciclos |

La comunicación entre capas usará interfaces públicas. No se importarán detalles privados de otro módulo.

---

## 6. Convenciones de implementación

### 6.1 Ubicación de cambios

| Cambio | Ubicación actual |
|---|---|
| Carga, limpieza, validación o partición de datos | `src/data/` |
| Creación o selección de features | `src/features/` |
| Entrenamiento y tuning | `src/training/` |
| Métricas, comparación o gráficos de evaluación | `src/evaluation/` |
| Carga de pipeline o predicción | `src/inference/` |
| Adaptación de inferencia al backend | `backend/app/inference.py` |
| Transporte o esquemas backend | `backend/app/routes.py`; `backend/app/schemas.py` |
| Bootstrap o composición frontend | `frontend/src/main.tsx`; `frontend/src/app.tsx` |
| Comando ejecutable | `scripts/`, delegando en `src/` |
| Exploración | `notebooks/` |
| Artefacto, pipeline o métrica serializada | Subdirectorio correspondiente de `models/` |
| Especificación | `docs/SDD/` |

Una funcionalidad sin ubicación aprobada no deberá insertarse en el módulo más cercano por conveniencia. Se resolverá mediante una decisión de estructura.

### 6.2 Creación y división de módulos

- Ampliar un archivo solo si conserva su responsabilidad.
- Dividir cuando existan responsabilidades o dependencias independientes.
- No crear `misc.py`, `helpers.py`, `functions.py` o equivalentes sin un dominio concreto.
- No duplicar transformaciones entre `src/data`, `src/features` e inferencia.
- Exponer una interfaz pública mínima; mantener privados los detalles.
- Actualizar este documento cuando cambie un límite o una ruta principal.

### 6.3 Nomenclatura

| Elemento | Convención |
|---|---|
| Módulos, archivos, funciones y variables Python | `snake_case` |
| Clases Python | `PascalCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Componentes React | `PascalCase` |
| Variables y funciones TypeScript | `camelCase` |
| Pruebas Python | `test_<responsabilidad>.py` |

Convenciones de rutas API, pruebas y ramas se definen en SDD-07, SDD-08 y el flujo de trabajo del repositorio.

---

## 7. Configuración y dependencias

| Archivo | Responsabilidad actual | Regla |
|---|---|---|
| `pyproject.toml` | Metadatos y dependencias Python | Fuente normativa de dependencias Python |
| `uv.lock` | Resolución reproducible | Se actualiza junto a `pyproject.toml` |
| `.python-version` | Versión local de Python | Debe ser compatible con `pyproject.toml` |
| `frontend/package.json` | Dependencias y scripts frontend | Está vacío; no prueba un stack instalado |
| `.env.example` | Contrato de configuración de entorno | Está vacío; solo incluirá nombres y valores no sensibles |
| `Makefile` | Automatización actual de notebooks | No se convierte en contenedor de lógica |
| Dockerfiles y `docker-compose.yml` | Placeholders de empaquetado | Su contenido pertenece a SDD-09 |
| `.github/workflows/` | Reserva para automatización | La CI permanece pendiente |

Reglas:

- Toda importación de terceros usada por código ejecutable deberá declararse.
- No se mantendrán listas Python paralelas a `pyproject.toml`.
- Los secretos no se versionarán ni se incluirán en configuración frontend.
- La lectura de entorno se centralizará cuando se apruebe su ubicación.
- Una nueva dependencia deberá indicar módulo consumidor y motivo.

---

## 8. Modelos, datos y recursos

### 8.1 Directorios reservados

| Ruta | Contenido admitido | Estado actual |
|---|---|---|
| `models/trained/` | Modelos aprobados o referencias de obtención | Vacío |
| `models/pipelines/` | Pipelines compatibles con inferencia | Vacío |
| `models/metrics/` | Resultados versionados de evaluación | Vacío |
| `data/processed/` | Datos procesados según SDD-04 | Vacío |

El esquema de nombres, formato, versionado y almacenamiento externo de artefactos permanece pendiente. Ningún artefacto se considerará aprobado solo por estar en estas rutas.

### 8.2 Recursos

| Recurso | Regla |
|---|---|
| `notebooks/eda.py` | Conserva análisis exploratorio; no alimenta producción por importación |
| `utils/load_raw_data.py` | Soporta la carga exploratoria vigente; su posible consolidación está pendiente |
| Imágenes en raíz | Son anexos existentes; ubicación y vigencia pendientes |
| `ANEXOS.md` | Índice o referencia auxiliar; no define decisiones SDD |

---

## 9. Riesgos y decisiones pendientes

### 9.1 Riesgos estructurales

| ID | Riesgo | Acción requerida |
|---|---|---|
| IR-001 | La mayoría de módulos son placeholders | No declarar funcionalidad implementada sin código y validación |
| IR-002 | `src.data` se importa sin una interfaz pública visible en el árbol | Definir exportaciones o usar imports de módulos concretos |
| IR-003 | Existen cargadores en `src/data` y `utils/` | Asignar un propietario y evitar evolución duplicada |
| IR-004 | El código importa dependencias ausentes de `pyproject.toml` | Alinear código y dependencias antes de ejecutar el flujo |
| IR-005 | Frontend, contenedores, entorno y CI están vacíos | Resolver el stack antes de tratarlos como operativos |
| IR-006 | No existe ubicación implementada para aplicación, XAI, recomendaciones, persistencia u observabilidad | Resolver IS-003 antes de añadirlos |
| IR-007 | `main.py` y recursos gráficos de raíz no tienen responsabilidad definitiva | Confirmar su permanencia o reubicación |

### 9.2 Decisiones pendientes

| ID | Decisión | Documento responsable | Estado |
|---|---|---|---|
| IS-001 | Stack y organización interna definitiva del frontend | SDD-03 / SDD-06 | Pendiente |
| IS-002 | Framework y composición definitiva del backend | SDD-03 / SDD-07 | Pendiente |
| IS-003 | Ubicación de aplicación, XAI, recomendaciones, persistencia y observabilidad | SDD-02 / SDD-03 | Pendiente |
| IS-004 | Inferencia integrada en backend o servicio independiente | SDD-02 / SDD-09 | Pendiente |
| IS-005 | Tecnología, migraciones y ubicación de persistencia | SDD-02 / SDD-09 | Pendiente |
| IS-006 | Formato, nomenclatura y almacenamiento de artefactos | SDD-04 / SDD-05 / SDD-09 | Pendiente |
| IS-007 | Ubicación de configuración y carga de entorno | SDD-03 / SDD-09 | Pendiente |
| IS-008 | Integración de monitorización | SDD-02 / SDD-09 | Pendiente |
| IS-009 | Consolidación o separación de `utils/load_raw_data.py` y `src/data/loader.py` | SDD-03 / SDD-04 | Pendiente |
| IS-010 | Ubicación definitiva de recursos gráficos y entrypoint raíz | SDD-03 | Pendiente |

---

## 10. Trazabilidad con SDD-02

| Decisión de SDD-02 | Estructura de implementación | Estado |
|---|---|---|
| AD-001 · Arquitectura modular | `frontend/`, `backend/`, `src/`, `models/` | Definida; implementación parcial |
| AD-002 · API como frontera | `backend/app/routes.py`, `schemas.py`, `inference.py` | Placeholder |
| AD-003 · Entrenamiento separado | `src/training/` y `src/inference/` | Límites creados |
| AD-004 · Pipeline versionado | `src/data/`, `src/features/`, `models/pipelines/` | Parcial |
| AD-005 · Modelo intercambiable | `models/trained/`, `src/inference/load_pipeline.py` | Placeholder |
| AD-006 · Explicabilidad independiente | Sin ubicación aprobada | IS-003 |
| AD-007 · Human-in-the-loop | Backend y frontend sin automatización laboral | Implementación pendiente |
| AD-008 · Persistencia desacoplada | Sin módulo de persistencia | IS-003; IS-005 |
| AD-009 · Topología de inferencia | `backend/app/inference.py` y `src/inference/` | IS-004 |
| AD-010 · Base de datos | Sin implementación | IS-005 |
| AD-011 · Autenticación | Sin implementación | Fuera del MVP actual |
| AD-012 · Stack definitivo | Configuración frontend/backend incompleta | IS-001; IS-002 |
| AD-013 · Resultados parciales | Sin ubicación específica | SDD-07 / SDD-08 |
| AD-014 · Observabilidad avanzada | Sin módulo implementado | IS-008 |

El documento estará listo para aprobación cuando el árbol, las dependencias y las decisiones pendientes coincidan con el repositorio y con SDD-02.
