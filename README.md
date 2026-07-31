# TalentCare 

**Plataforma de Inteligencia Artificial Responsable para la retención del talento en el sector TECH**

---

## Descripción

TalentCare es una plataforma SaaS de inteligencia de talento que utiliza modelos de **Ensemble Machine Learning** para analizar y predecir patrones relacionados con la satisfacción laboral y el riesgo de rotación en el sector tecnológico. Mediante el análisis de miles de perfiles de desarrolladores de la **Stack Overflow Annual Developer Survey**, la plataforma identifica diferencias en representación, progresión de carrera y bienestar, proporcionando a las organizaciones información basada en datos para impulsar estrategias de retención e inclusión más efectivas.

TalentCare no automatiza decisiones laborales: es una **herramienta de apoyo a la decisión** diseñada bajo principios de **Inteligencia Artificial Responsable**, con explicabilidad, supervisión humana y prevención de usos discriminatorios.

---

## Contexto y problema

La permanencia y el desarrollo profesional de las mujeres en puestos STEM constituye un reto documentado. Según el estudio *"El mercado de trabajo en el sector STEM"* publicado por el **SEPE (Servicio Público de Empleo Estatal)**, persisten situaciones de infrarrepresentación y pérdida de talento femenino que limitan la diversidad de los equipos y la capacidad de las organizaciones para conservar conocimiento y experiencia.

Las organizaciones disponen de datos profesionales, laborales y de satisfacción, pero encuentran dificultades para transformar esa información en señales tempranas y útiles para apoyar estrategias de retención.

TalentCare aborda este desafío aplicando Machine Learning explicable sobre datos reales, permitiendo identificar patrones asociados a la satisfacción laboral y ofreciendo recomendaciones contextualizadas para la acción.

> **Referencia:** [El mercado de trabajo en el sector STEM — SEPE](https://www.sepe.es/HomeSepe/es/que-es-el-sepe/comunicacion-institucional/publicaciones/publicaciones-oficiales/listado-pub-mercado-trabajo/El-mercado-de-trabajo-en-el-sector-stem.html)

---

## Destinatarios

La plataforma está orientada a:

- **Departamentos de Recursos Humanos** — para identificar señales tempranas de riesgo de rotación y diseñar estrategias de retención personalizadas.
- **Equipos de People Analytics** — como herramienta de análisis basada en datos para la toma de decisiones informada.
- **Dirección y Engineering Managers** — para comprender los factores que afectan a la satisfacción de sus equipos técnicos.
- **Responsables de Diversidad, Equidad e Inclusión** — para impulsar políticas basadas en evidencia que mejoren la retención del talento femenino.
- **Entidades sociales e instituciones públicas** — como apoyo a programas de orientación sociolaboral, acompañamiento y sensibilización en el ámbito STEM.
- **Consultoras especializadas en talento** — como servicio de valor añadido para sus clientes.

---

## Datos: evolución y tratamiento

Los datos provienen de la **Stack Overflow Annual Developer Survey**, una de las encuestas más completas sobre el ecosistema de desarrollo global.

### Cobertura temporal

Se analizaron las ediciones **2021, 2022, 2023, 2024 y 2025**, realizando un Análisis Exploratorio de Datos (EDA) completo para cada año. Este análisis cubrió calidad de datos, valores nulos, perfil de población, compensación, tecnologías, variables sensibles y viabilidad para Machine Learning.

### Selección del dataset de entrenamiento

- **Random Forest (modelo principal):** entrenado con los datos **2024–2025**. La edición 2021 no contiene la variable `JobSat` (satisfacción laboral), y las ediciones 2022 y 2023 presentan cambios de esquema que dificultan la integración consistente. Se eligieron las dos ediciones más recientes por disponer de `JobSat` con definiciones compatibles y mejor calidad de datos.
- **KNN (modelo auxiliar):** entrenado con el **merge completo de todas las ediciones (2021–2025)**. Esta decisión responde al interés de explorar targets comunes más allá de `JobSat`, aprovechando el volumen de datos histórico para valorar otros objetivos y patrones transversales.

Este enfoque refleja las diferentes evoluciones y opciones de modelado contempladas durante el análisis de datos, documentadas en los EDA y en las decisiones de diseño recogidas en el SDD.

### Flujo de datos

```
Raw (Parquet) → Limpieza y merge → Splits (train/dev/test) → Preprocesamiento → Entrenamiento → Pipeline (joblib)
```

Los datos procesados están disponibles en formato Parquet en `data/processed/`.

---

## Tecnologías utilizadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Python + FastAPI | 3.13 / FastAPI |
| **Frontend** | React + TypeScript + Vite | 18 / 5.x |
| **UI** | Tailwind CSS v4 + Recharts + Lucide | 4.x |
| **Autenticación** | Clerk | — |
| **ML** | scikit-learn, imbalanced-learn, joblib | — |
| **Datos** | Polars, Pandas, PyArrow | — |
| **Base de datos** | PostgreSQL 17 | — |
| **Infraestructura** | Docker, Railway, Render | — |
| **Proxy** | Nginx | — |
| **Testing** | pytest | — |
| **Gestión de dependencias** | uv (Python), npm (Node) | — |

### Automatización con Makefile

El proyecto incluye un `Makefile` que orquesta las tareas principales del ciclo de desarrollo:

| Target | Comando | Descripción |
|--------|---------|-------------|
| `notebook` | `jupytext --to ipynb` | Convierte los scripts EDA (`.py` → `.ipynb`) para su visualización en Jupyter |
| `test` | `pytest -q tests/` | Ejecuta la suite de tests del proyecto |
| `train` | `uv run python scripts/train_random_forest.py` | Entrena el modelo Random Forest con los datos procesados |
| `train-smote` | `uv run python scripts/train_random_forest_smote.py` | Entrena el modelo aplicando SMOTE para balanceo de clases |
| `docker-build` | `docker compose build` | Construye las imágenes Docker para frontend y backend |
| `shap` | *pendiente de definir* | Ejecuta análisis de interpretabilidad SHAP sobre el modelo |
| `smote` | `uv run python scripts/train_random_forest_smote.py` | Ejecuta el pipeline de entrenamiento con SMOTE |

---

## Estructura del proyecto

```
.
├── backend/
│   └── app/
│       ├── main.py          # Punto de entrada de la API
│       ├── routes.py        # Endpoints REST
│       ├── schemas.py       # Modelos Pydantic
│       ├── inference.py     # Inferencia del modelo
│       ├── auth.py          # Autenticación JWT / Clerk
│       └── analysis.py      # Lógica de análisis y métricas
├── data/
│   ├── raw/                 # Datos fuente en Parquet
│   └── processed/           # Datos limpios y splits
├── docs/
│   ├── SDD/                 # Documentación técnica SDD
│   └── experiments/         # Experimentos de modelado
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React (dashboard, UI, layout, predicción)
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Clientes API
│   │   ├── i18n/            # Internacionalización ES/EN
│   │   ├── types/           # Tipos TypeScript
│   │   └── data/            # Datos de referencia y dashboard
│   ├── nginx.conf           # Configuración de Nginx para producción
│   └── Dockerfile
├── models/
│   ├── pipelines/           # Pipelines entrenados (.joblib)
│   ├── metrics/             # Métricas de evaluación
│   └── trained/             # Modelos serializados
├── notebooks/               # EDA en formato .py (convertibles a .ipynb)
├── scripts/                 # Scripts de entrenamiento, limpieza y migración
├── src/
│   ├── data/                # Carga, preprocesamiento y splitting
│   ├── features/            # Ingeniería y selección de características
│   ├── training/            # Modelos (RF, KNN, XGBoost, CatBoost, ensemble)
│   └── inference/           # Carga de pipeline y predicción
├── tests/                   # Tests unitarios y de integración
├── utils/                   # Utilidades de carga de datos
├── postgres-project/
│   └── init-db/
│       └── init.sql         # Inicialización de la base de datos
├── main.py                  # Entry point del backend
├── Dockerfile               # Dockerfile del backend
├── docker-compose.yml       # Orquestación de servicios
├── Makefile                 # Automatización de tareas
└── pyproject.toml           # Dependencias y configuración de Python
```

---

## Arquitectura

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Frontend    │◄─────►│  Backend     │◄─────►│  PostgreSQL  │
│  React/Vite  │  API  │  FastAPI     │       │  (Railway)   │
│  Clerk Auth  │       │  RandomForest│       │              │
│  Nginx       │       │  Polars      │       │              │
└──────────────┘       └──────────────┘       └──────────────┘
```

- **Frontend:** SPA con autenticación Clerk, dashboard ejecutivo con KPIs, gráficos de segmentos, factores asociados y recomendaciones. Panel de predicción con formulario validado.
- **Backend:** API REST con endpoints de predicción, dashboard (métricas globales y segmentadas), health check y autenticación JWT.
- **Base de datos:** PostgreSQL (con fallback a Parquet local) para almacenar respuestas de encuesta procesadas.
- **Despliegue:** Railway con dos servicios independientes y base de datos gestionada.

---

## Funcionalidades del MVP

### Dashboard Ejecutivo
- Métricas globales: total de perfiles, tasa de insatisfacción, salario mediano, años de experiencia.
- Segmentación por edad, experiencia, salario, educación, empleo, tamaño de empresa, país y rol profesional.
- Factores asociados con contribuciones positivas/negativas.
- Recomendaciones preventivas priorizadas.
- Internacionalización (ES/EN).

### Predicción
- Formulario guiado con validación en frontend y backend.
- Predicción binaria con probabilidades.
- Factores relevantes por predicción.
- Historial de la sesión.

### Autenticación
- Login mediante Clerk (email, Google, etc.).
- Protección de rutas del backend vía JWT.

---

## Versiones de despliegue

El proyecto cuenta con dos versiones de despliegue que reflejan su evolución:

### v1.0.0 — MVP inicial en Render

Primera versión del producto mínimo viable, desarrollada por el equipo con una estructura funcional completa pero **sin base de datos conectada**. Desplegada en Render.

- **Frontend:** [https://talentcare-front.onrender.com](https://talentcare-front.onrender.com)
- **Backend:** [https://talentcare-back.onrender.com](https://talentcare-back.onrender.com)
- **Release:** [v1.0.0](https://github.com/Bootcamp-IA-MAD-P7/Proyecto6-Grupo2/releases/tag/v1.0.0)

### v2.0 — Versión actual con base de datos

Evolución del MVP que incorpora la **base de datos PostgreSQL conectada**, migrando la infraestructura a Railway para una gestión integrada de servicios y base de datos.

---

## Despliegue actual en Railway

El proyecto está desplegado en Railway con dos servicios independientes:

| Servicio | Root Directory | Puerto |
|----------|---------------|--------|
| Backend  | *(raíz)*      | 8000   |
| Frontend | `frontend/`   | 80     |

### Variables de entorno

**Backend:**
- `DATABASE_URL` — conexión a PostgreSQL gestionada de Railway
- `CLERK_SECRET_KEY` — clave secreta de Clerk
- `CLERK_JWKS_URL` — URL de JWKS de Clerk
- `PORT` — puerto dinámico de Railway

**Frontend:**
- `VITE_CLERK_PUBLISHABLE_KEY` — clave publicable de Clerk
- `VITE_API_URL` — URL del backend

### URLs de producción
- **Frontend:** [https://frontend-production.up.railway.app](https://frontend-production.up.railway.app)
- **Backend:** pendiente de dominio permanente

---

## Equipo AGILE SCRUM

| Rol | Miembro |
|-----|---------|
| Product Owner & Developer | Anahí |
| Scrum Master & Developer | Veru |
| Developer | Karina |
| Developer | Gabriela |

Todo el trabajo centralizado en GitHub Projects con roadmap calendarizado, sprints y daily reflejados en la Wiki del repositorio.

---

## Documentación técnica

El proyecto sigue una metodología **Specification-Driven Development (SDD)**. Toda la documentación técnica se encuentra en `docs/SDD/`:

| Documento | Descripción |
|-----------|-------------|
| SDD-00 · Scope | Alcance del proyecto, objetivos y restricciones |
| SDD-00A · Use Cases | Casos de uso detallados |
| SDD-01 · Requirements | Requisitos funcionales y no funcionales |
| SDD-02 · Architecture | Arquitectura del sistema |
| SDD-03 · Implementation Structure | Estructura del proyecto |
| SDD-04 · Data Pipeline | Pipeline de datos |
| SDD-05 · Modeling | Modelos y métricas |
| SDD-06 · Frontend | Especificación de interfaz |
| SDD-07 · API | Definición de API |
| SDD-08 · Testing | Estrategia de pruebas |
| SDD-09 · Deployment | Despliegue y operación |
| SDD-10 · Release Plan | Plan de evolución |

---

## Roadmap y visión futura

### MVP actual
- Aplicación web funcional con dashboard ejecutivo y predicción de satisfacción laboral.
- Modelo Random Forest explicable con factores asociados.
- Arquitectura modular preparada para evolucionar.

### Evolución prevista
- Incorporación de datasets corporativos laborales autorizados.
- Integración con sistemas de Recursos Humanos.
- Entrenamiento continuo y monitorización de sesgos.
- Gestión de múltiples modelos predictivos simultáneos.
- Automatización progresiva del ciclo MLOps.
- Nuevos casos de uso laborales relacionados con retención y People Analytics.
- Desarrollo de una aplicación orientada a la **persona usuaria final** que, basándose en la sensibilización, explique datos y métricas para fomentar la equidad de género en el ámbito STEM.

El proyecto sienta las bases para una **plataforma escalable de IA aplicada a People Analytics**, con supervisión humana y compromiso con el uso responsable de la tecnología.

---

## Licencia

Proyecto de código abierto que apoya la filosofía del software libre, con el ánimo de que sea reutilizable por cualquier organización o persona interesada en la retención del talento femenino en el sector STEM.

Desarrollado como proyecto académico en el contexto del bootcamp de Inteligencia Artificial y Machine Learning.
