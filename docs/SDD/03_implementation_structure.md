# Software Design Document (SDD)

# SDD-03 · Implementation Structure

| Campo | Valor |
|---|---|
| Proyecto | Nombre pendiente de definir |
| Documento | Estructura de implementación |
| Código | SDD-03 |
| Versión | 1.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-00A, SDD-01 y SDD-02 |
| Documentos relacionados | SDD-04 a SDD-09 |

## 1. Propósito

Este documento define cómo deberá organizarse el código fuente del proyecto.

Su objetivo es asegurar que:

- El repositorio mantenga una estructura coherente.
- Cada módulo tenga una responsabilidad clara.
- El frontend, backend y Machine Learning estén desacoplados.
- Cuatro desarrolladores puedan trabajar en paralelo.
- Los agentes de IA puedan modificar el código sin alterar la arquitectura.
- Las pruebas y la documentación evolucionen junto con la implementación.
- Las decisiones técnicas puedan rastrearse hasta los requisitos.

Este documento no define algoritmos concretos ni contratos definitivos de API.

## 2. Principios de implementación

La implementación deberá seguir los siguientes principios:

1. Una responsabilidad principal por módulo.
2. Separación entre interfaz, lógica de negocio e inferencia.
3. Ausencia de lógica de negocio en los endpoints.
4. Ausencia de lógica de Machine Learning en el frontend.
5. Uso de contratos tipados para entradas y salidas.
6. Dependencias explícitas.
7. Configuración externa al código.
8. Pruebas junto a cada funcionalidad relevante.
9. Documentación actualizada con cada decisión importante.
10. Cambios pequeños, trazables y revisables.

## 3. Estructura general del repositorio

```text
Proyecto6-Grupo2/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── Dockerfile
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── src/
│   ├── models/
│   ├── reports/
│   └── tests/
│
├── docs/
│   ├── SDD/
│   ├── ADR/
│   ├── dailies/
│   └── diagrams/
│
├── scripts/
│
├── tests/
│   └── integration/
│
├── .github/
│   └── workflows/
│
├── .dockerignore
├── .env.example
├── .gitignore
├── .python-version
├── docker-compose.yml
├── README.md
└── requirements-dev.txt
```

La estructura podrá evolucionar, pero cualquier cambio que afecte a los límites principales deberá actualizar este documento.

## 4. Backend

### 4.1 Estructura objetivo

```text
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py
│   │   │   └── predictions.py
│   │   └── dependencies.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── prediction.py
│   │   ├── explanation.py
│   │   ├── recommendation.py
│   │   └── error.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── prediction_service.py
│   │   ├── explanation_service.py
│   │   └── recommendation_service.py
│   │
│   ├── inference/
│   │   ├── __init__.py
│   │   ├── model_loader.py
│   │   ├── predictor.py
│   │   ├── preprocessing.py
│   │   └── metadata.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── exceptions.py
│   │
│   └── recommendations/
│       ├── __init__.py
│       ├── rules.py
│       └── catalog.py
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── conftest.py
│
├── requirements.txt
└── Dockerfile
```

### 4.2 Responsabilidades

#### `main.py`

Deberá limitarse a:

- Crear la aplicación.
- Registrar routers.
- Configurar middleware.
- Registrar manejadores de excepciones.
- Ejecutar tareas de inicio y cierre.

No deberá contener lógica de negocio ni inferencia.

#### `api/routes/`

Contendrá los endpoints HTTP.

Los endpoints deberán:

- Recibir la solicitud.
- Validar el esquema.
- Invocar un servicio.
- Devolver una respuesta tipada.

No deberán:

- Cargar modelos.
- Transformar variables.
- Calcular recomendaciones.
- Ejecutar lógica compleja.

#### `schemas/`

Contendrá los modelos de entrada y salida.

Ejemplos:

- `PredictionRequest`
- `PredictionResponse`
- `ExplanationResponse`
- `RecommendationResponse`
- `ErrorResponse`

Los esquemas serán la fuente principal del contrato del backend.

#### `services/`

Contendrá la lógica de aplicación y la orquestación.

Ejemplo:

```text
prediction_service.py

1. Recibe una solicitud validada.
2. Solicita la predicción.
3. Solicita la explicación.
4. Genera recomendaciones.
5. Construye la respuesta final.
```

Los servicios no deberán depender de componentes visuales ni de detalles HTTP.

#### `inference/`

Contendrá la lógica necesaria para utilizar el modelo desplegado.

Responsabilidades:

- Cargar el modelo.
- Cargar el pipeline.
- Validar compatibilidad.
- Preparar datos.
- Ejecutar la inferencia.
- Recuperar metadatos.
- Validar la clase resultante.

#### `recommendations/`

Contendrá las reglas y el catálogo de recomendaciones.

Las reglas deberán estar separadas del texto mostrado al usuario.

Ejemplo:

```text
rules.py
    Define las condiciones de selección.

catalog.py
    Contiene los textos y códigos de recomendación.
```

#### `core/`

Contendrá elementos transversales:

- Configuración.
- Logging.
- Excepciones.
- Constantes globales justificadas.

No deberá convertirse en un contenedor genérico de lógica sin clasificar.

### 4.3 Estructura inicial existente

La estructura actual contiene:

```text
backend/app/
├── __init__.py
├── inference.py
├── main.py
├── routes.py
└── schemas.py
```

Esta estructura es válida como punto de partida.

Deberá modularizarse cuando:

- Un archivo supere una responsabilidad.
- Aparezcan varios endpoints.
- La inferencia necesite carga, validación y preprocesamiento separados.
- Los esquemas de entrada y salida crezcan.
- Se incorporen explicación y recomendaciones.

No se deberá dividir prematuramente el código si los módulos todavía son pequeños.

## 5. Frontend

### 5.1 Estructura objetivo

```text
frontend/
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── ResultPage.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── form/
│   │   ├── prediction/
│   │   ├── explanation/
│   │   └── recommendations/
│   │
│   ├── services/
│   │   └── predictionApi.js
│   │
│   ├── hooks/
│   │   └── usePrediction.js
│   │
│   ├── types/
│   │   └── prediction.js
│   │
│   ├── validation/
│   │   └── predictionForm.js
│   │
│   ├── constants/
│   │   └── formOptions.js
│   │
│   ├── assets/
│   └── styles/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
└── Dockerfile
```

### 5.2 Responsabilidades

#### `pages/`

Representan vistas completas.

Las páginas deberán:

- Organizar componentes.
- Gestionar navegación.
- Consumir hooks o servicios.

No deberán contener lógica extensa de validación o comunicación.

#### `components/`

Contendrán componentes reutilizables.

Ejemplos:

```text
components/form/
├── AnalysisForm.jsx
├── FormField.jsx
└── ValidationMessage.jsx
```

```text
components/prediction/
├── PredictionCard.jsx
└── ConfidenceIndicator.jsx
```

`ConfidenceIndicator.jsx` solo deberá crearse si el equipo aprueba mostrar probabilidades.

#### `services/`

Contendrá la comunicación con el backend.

Ejemplo:

```javascript
export async function requestPrediction(payload) {
  // Realiza la solicitud HTTP y normaliza errores.
}
```

Ningún componente deberá incluir directamente URLs, cabeceras o lógica repetida de red.

#### `hooks/`

Contendrá lógica reutilizable de estado e interacción.

Ejemplo:

```text
usePrediction.js

- Estado de carga.
- Resultado.
- Error.
- Envío.
- Reinicio.
```

#### `validation/`

Contendrá las reglas de validación de interfaz.

Estas reglas mejoran la experiencia de usuario, pero no sustituyen la validación del backend.

#### `types/`

Contendrá tipos, interfaces o estructuras compartidas del frontend.

Si el proyecto utiliza TypeScript, deberá emplearse:

```text
prediction.ts
```

en lugar de:

```text
prediction.js
```

## 6. Machine Learning

### 6.1 Estructura objetivo

```text
ml/
│
├── data/
│   ├── raw/
│   ├── interim/
│   └── processed/
│
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_eda.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_model_training.ipynb
│   └── 05_model_evaluation.ipynb
│
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── load_data.py
│   │   ├── clean_data.py
│   │   └── validate_data.py
│   │
│   ├── features/
│   │   ├── build_features.py
│   │   └── feature_schema.py
│   │
│   ├── models/
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   ├── compare.py
│   │   └── explain.py
│   │
│   └── utils/
│       └── reproducibility.py
│
├── models/
│   ├── model.joblib
│   ├── pipeline.joblib
│   ├── metadata.json
│   └── metrics.json
│
├── reports/
│   ├── figures/
│   └── model_report.md
│
└── tests/
    ├── test_data_validation.py
    ├── test_feature_pipeline.py
    └── test_model_output.py
```

### 6.2 Reglas para notebooks

Los notebooks se utilizarán para:

- Exploración.
- Análisis visual.
- Experimentación.
- Comparación de modelos.
- Interpretación.

No deberán ser la única ubicación del código crítico.

La lógica reutilizable deberá trasladarse a `ml/src/`.

Cada notebook deberá incluir:

- Objetivo.
- Datos utilizados.
- Decisiones tomadas.
- Resultados.
- Interpretación.
- Conclusiones.
- Próximos pasos.

### 6.3 Artefactos del modelo

Cada modelo aprobado deberá incluir:

```text
model.joblib
pipeline.joblib
metadata.json
metrics.json
```

`metadata.json` deberá contener, como mínimo:

```json
{
  "model_name": "pending",
  "model_version": "0.1.0",
  "target": "JobSat",
  "features": [],
  "classes": [],
  "training_date": "YYYY-MM-DD",
  "dataset_version": "pending"
}
```

`metrics.json` deberá incluir las métricas de evaluación aprobadas.

Los modelos binarios no deberán subirse al repositorio si su tamaño o licencia lo desaconsejan. En ese caso deberá documentarse el mecanismo de descarga o generación.

## 7. Configuración

### 7.1 Variables de entorno

La configuración sensible o dependiente del entorno deberá utilizar variables de entorno.

Ejemplo:

```text
APP_ENV
API_HOST
API_PORT
MODEL_PATH
MODEL_METADATA_PATH
LOG_LEVEL
CORS_ORIGINS
```

El archivo `.env` no deberá versionarse.

El repositorio deberá incluir `.env.example`:

```env
APP_ENV=development
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=ml/models/model.joblib
MODEL_METADATA_PATH=ml/models/metadata.json
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173
```

No deberán incluirse secretos reales.

### 7.2 Configuración centralizada

El backend deberá cargar su configuración desde:

```text
backend/app/core/config.py
```

No se deberán repetir llamadas directas a variables de entorno por todo el código.

## 8. Pruebas

### 8.1 Organización

Las pruebas deberán dividirse en:

```text
unit
integration
end-to-end
```

#### Pruebas unitarias

Validan funciones o componentes aislados.

Ejemplos:

- Validación de rangos.
- Mapeo de clases.
- Selección de recomendaciones.
- Preparación de variables.
- Formateo de respuestas.

#### Pruebas de integración

Validan la interacción entre componentes.

Ejemplos:

- API y servicio de predicción.
- Servicio y modelo.
- Predicción y explicación.
- Backend y frontend mediante contratos.

#### Pruebas end-to-end

Validan el flujo completo:

```text
Formulario
→ API
→ Modelo
→ Explicación
→ Recomendaciones
→ Resultado
```

### 8.2 Convenciones

Los archivos Python deberán seguir:

```text
test_<módulo>.py
```

Las pruebas deberán tener nombres descriptivos:

```python
def test_prediction_rejects_unknown_category():
    ...
```

No deberán utilizarse nombres genéricos como:

```python
def test_1():
    ...
```

### 8.3 Fixtures

Los datos reutilizables de prueba deberán almacenarse en:

```text
backend/tests/fixtures/
```

o declararse en:

```text
conftest.py
```

Las pruebas no deberán depender de datos reales sensibles.

## 9. Documentación

### 9.1 Estructura

```text
docs/
│
├── SDD/
│   ├── 00_scope.md
│   ├── 00A_use_cases.md
│   ├── 01_requirements.md
│   ├── 02_architecture.md
│   ├── 03_implementation_structure.md
│   ├── 04_data_pipeline.md
│   ├── 05_modeling.md
│   ├── 06_frontend.md
│   ├── 07_api.md
│   ├── 08_testing.md
│   └── 09_deployment.md
│
├── ADR/
│   ├── ADR-001-backend-framework.md
│   ├── ADR-002-frontend-framework.md
│   └── ADR-003-model-serving.md
│
├── dailies/
│   └── YYYY-MM-DD.md
│
└── diagrams/
```

### 9.2 Reglas de actualización

Deberá actualizarse la documentación cuando:

- Cambie un contrato.
- Se añada una dependencia estructural.
- Se modifique la arquitectura.
- Se cambie la variable objetivo.
- Se cambien las clases del modelo.
- Se introduzca persistencia.
- Se cambie el flujo principal.
- Se apruebe una decisión pendiente.

Los cambios de documentación deberán realizarse en la misma rama o historia que el cambio técnico correspondiente.

## 10. Convenciones de nombres

### 10.1 Python

Archivos y módulos:

```text
snake_case.py
```

Clases:

```text
PascalCase
```

Funciones y variables:

```text
snake_case
```

Constantes:

```text
UPPER_SNAKE_CASE
```

### 10.2 JavaScript o TypeScript

Componentes:

```text
PascalCase.jsx
PascalCase.tsx
```

Hooks:

```text
usePrediction.js
usePrediction.ts
```

Funciones y variables:

```text
camelCase
```

Constantes globales:

```text
UPPER_SNAKE_CASE
```

### 10.3 Rutas API

Las rutas deberán utilizar:

```text
kebab-case
```

Ejemplos:

```text
/api/v1/predictions
/api/v1/model-info
/api/v1/health
```

### 10.4 Ramas Git

Formato recomendado:

```text
feature/<ticket>-<descripcion>
fix/<ticket>-<descripcion>
docs/<ticket>-<descripcion>
test/<ticket>-<descripcion>
refactor/<ticket>-<descripcion>
chore/<ticket>-<descripcion>
```

Ejemplos:

```text
feature/ML-12-prediction-endpoint
docs/ML-07-implementation-structure
fix/ML-21-invalid-class-response
```

## 11. Convenciones de commits

Se utilizará Conventional Commits.

```text
feat:
fix:
docs:
test:
refactor:
chore:
ci:
build:
```

Ejemplos:

```text
feat(api): add prediction endpoint
fix(inference): reject unknown model classes
docs(sdd): add implementation structure
test(api): add invalid payload coverage
refactor(ml): extract preprocessing pipeline
```

Cada commit deberá:

- Representar un cambio coherente.
- Evitar mezclar funcionalidades no relacionadas.
- Mantener el repositorio ejecutable cuando sea posible.
- Referenciar el ticket de Jira en el cuerpo o PR.

## 12. Gestión de dependencias

### 12.1 Backend y Machine Learning

Las dependencias deberán declararse explícitamente.

Se podrá utilizar:

```text
requirements.txt
```

o una herramienta aprobada posteriormente.

No deberán instalarse librerías sin registrar:

- Motivo.
- Versión.
- Componente que la utiliza.
- Impacto en despliegue.

### 12.2 Frontend

Las dependencias deberán gestionarse mediante `package.json`.

No se deberá incorporar una librería para resolver una funcionalidad trivial que pueda implementarse de forma clara sin aumentar significativamente la complejidad.

### 12.3 Restricciones

No se deberán usar:

- Dependencias abandonadas.
- Paquetes sin licencia clara.
- Versiones flotantes en producción.
- Librerías duplicadas con la misma función sin justificación.

## 13. Reglas de modularidad

### 13.1 Una responsabilidad por archivo

Un archivo deberá dividirse cuando:

- Contenga varias responsabilidades.
- Sea difícil probarlo de forma aislada.
- Presente dependencias no relacionadas.
- Haya crecido hasta dificultar su comprensión.

El número de líneas no será el único criterio.

### 13.2 Evitar módulos genéricos

No deberán crearse archivos como:

```text
misc.py
common.py
helpers.py
utils.py
functions.py
```

salvo que su contenido sea pequeño y claramente delimitado.

Se preferirán nombres específicos:

```text
feature_mapper.py
prediction_formatter.py
class_validator.py
recommendation_selector.py
```

### 13.3 Evitar duplicación

Antes de añadir una función, deberá comprobarse si ya existe una implementación equivalente.

La lógica compartida deberá extraerse únicamente cuando exista una necesidad real de reutilización.

### 13.4 Dependencias entre capas

Flujo permitido:

```text
API
↓
Services
↓
Inference / Recommendations
↓
Model artifacts
```

Flujos no permitidos:

```text
Inference → API
Model → Frontend
Schemas → Routes
Core → Services específicos
```

Los módulos de nivel inferior no deberán depender de capas superiores.

## 14. Gestión de errores

Las excepciones técnicas deberán transformarse en errores de aplicación controlados.

Ejemplo:

```text
ModelLoadError
PredictionError
InvalidModelOutputError
ExplanationError
RecommendationError
```

Los endpoints no deberán devolver trazas internas.

Las respuestas de error deberán seguir un contrato común:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "La información introducida no es válida.",
    "details": []
  }
}
```

Los códigos internos deberán ser estables y verificables mediante pruebas.

## 15. Logging

Los logs deberán registrar:

- Inicio de la aplicación.
- Carga del modelo.
- Versión del modelo.
- Solicitudes procesadas.
- Duración de inferencia.
- Errores técnicos.
- Componente de origen del error.

No deberán registrar:

- Nombres.
- Correos electrónicos.
- Identificadores personales.
- Contenido completo del formulario.
- Secretos.
- Tokens.
- Variables de entorno sensibles.

Se utilizarán niveles coherentes:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

## 16. Flujo de trabajo Git

### 16.1 Ramas principales

```text
main
dev
```

`main` deberá contener versiones estables o entregables.

`dev` será la rama de integración del sprint.

### 16.2 Flujo por funcionalidad

```text
1. Actualizar dev.
2. Crear una rama desde dev.
3. Implementar únicamente el alcance del ticket.
4. Añadir o actualizar pruebas.
5. Actualizar documentación cuando proceda.
6. Realizar commits pequeños.
7. Subir la rama.
8. Crear Pull Request hacia dev.
9. Ejecutar revisión.
10. Resolver observaciones.
11. Fusionar tras aprobación.
```

### 16.3 Antes de desarrollar

```bash
git checkout dev
git pull origin dev
git checkout -b feature/<ticket>-<descripcion>
```

### 16.4 Antes de cerrar una historia

Comprobar:

- Código ejecutable.
- Pruebas superadas.
- Documentación actualizada.
- Sin archivos temporales.
- Sin secretos.
- Sin cambios fuera del alcance.
- Jira actualizado.
- PR revisada.

## 17. Reglas para agentes de IA

Los agentes de IA deberán tratar este documento como una restricción de implementación.

### 17.1 Acciones permitidas

Un agente podrá:

- Modificar archivos dentro del alcance solicitado.
- Crear módulos dentro de la estructura definida.
- Añadir pruebas.
- Proponer refactorizaciones localizadas.
- Documentar decisiones.
- Señalar inconsistencias.
- Proponer una ADR.

### 17.2 Acciones no permitidas sin aprobación

Un agente no deberá:

- Cambiar la arquitectura.
- Mover carpetas principales.
- Crear un nuevo servicio.
- Introducir una base de datos.
- Cambiar contratos públicos.
- Añadir autenticación.
- Cambiar la variable objetivo.
- Cambiar clases del modelo.
- Sustituir el stack.
- Añadir dependencias estructurales.
- Eliminar pruebas.
- Modificar varias historias simultáneamente.
- Implementar funcionalidades fuera del Scope.

### 17.3 Comportamiento esperado

Antes de modificar código, el agente deberá:

1. Leer el ticket.
2. Identificar los archivos afectados.
3. Revisar la estructura existente.
4. Confirmar dependencias.
5. Limitar el cambio al alcance.
6. Identificar pruebas necesarias.
7. Informar de decisiones no cubiertas.

Después del cambio deberá:

1. Resumir los archivos modificados.
2. Explicar el comportamiento implementado.
3. Indicar las pruebas realizadas.
4. Identificar riesgos.
5. Señalar documentación pendiente.
6. Proponer el mensaje de commit.

### 17.4 Prompt operativo recomendado

```text
Trabaja únicamente sobre el alcance de esta historia.

Antes de modificar código:
- revisa la estructura existente;
- identifica los requisitos relacionados;
- enumera los archivos que deben cambiar;
- señala cualquier decisión no documentada.

Durante la implementación:
- respeta SDD-03;
- no cambies contratos ni arquitectura;
- no añadas dependencias sin justificarlo;
- evita duplicación;
- añade pruebas.

Al finalizar:
- resume los cambios;
- indica las pruebas ejecutadas;
- identifica riesgos o decisiones pendientes;
- propone un mensaje de commit Conventional Commits.
```

## 18. Integración continua

La integración continua deberá ejecutar progresivamente:

```text
1. Instalación de dependencias.
2. Validación de formato.
3. Linting.
4. Pruebas unitarias.
5. Pruebas de integración.
6. Validación de construcción.
7. Comprobaciones de seguridad básicas.
```

Las herramientas concretas se definirán en los documentos de Testing y Deployment.

Ninguna Pull Request deberá fusionarse si falla una comprobación obligatoria.

## 19. Definition of Done técnica

Una tarea se considerará técnicamente terminada cuando:

- Cumpla los criterios de aceptación.
- Respete la arquitectura.
- Respete la estructura del repositorio.
- Incluya pruebas adecuadas.
- Las pruebas existentes sigan funcionando.
- No introduzca errores de linting.
- No contenga secretos.
- No incluya código muerto.
- Actualice la documentación afectada.
- Tenga una Pull Request revisable.
- Jira refleje el estado real.
- El cambio pueda explicarse y demostrarse.

## 20. Matriz de ubicación

| Tipo de implementación | Ubicación |
|---|---|
| Endpoint HTTP | `backend/app/api/routes/` |
| Esquema de entrada o salida | `backend/app/schemas/` |
| Orquestación | `backend/app/services/` |
| Carga del modelo | `backend/app/inference/model_loader.py` |
| Predicción | `backend/app/inference/predictor.py` |
| Preprocesamiento de inferencia | `backend/app/inference/preprocessing.py` |
| Reglas de recomendación | `backend/app/recommendations/rules.py` |
| Configuración | `backend/app/core/config.py` |
| Excepciones | `backend/app/core/exceptions.py` |
| Página frontend | `frontend/src/pages/` |
| Componente frontend | `frontend/src/components/` |
| Comunicación API frontend | `frontend/src/services/` |
| Entrenamiento | `ml/src/models/train.py` |
| Evaluación | `ml/src/models/evaluate.py` |
| Explicabilidad ML | `ml/src/models/explain.py` |
| Artefactos del modelo | `ml/models/` |
| Pruebas backend | `backend/tests/` |
| Pruebas frontend | `frontend/tests/` |
| Pruebas end-to-end | `tests/integration/` |
| SDD | `docs/SDD/` |
| ADR | `docs/ADR/` |
| Daily | `docs/dailies/` |

## 21. Decisiones pendientes

| ID | Decisión |
|---|---|
| ID-001 | Confirmar React con JavaScript o TypeScript |
| ID-002 | Confirmar si inferencia permanecerá integrada en FastAPI |
| ID-003 | Definir herramienta de gestión de dependencias Python |
| ID-004 | Definir herramientas de linting y formateo |
| ID-005 | Definir framework de pruebas frontend |
| ID-006 | Definir estrategia de almacenamiento de artefactos ML |
| ID-007 | Definir estructura definitiva de CI/CD |
| ID-008 | Definir si se utilizará un monorepo durante todo el proyecto |
| ID-009 | Definir reglas de versionado de releases |
| ID-010 | Definir cobertura mínima de pruebas |

Estas decisiones deberán resolverse mediante el documento correspondiente o una ADR.

## 22. Criterios de aprobación

Este documento podrá aprobarse cuando el equipo confirme:

- Que la estructura refleja la arquitectura acordada.
- Que cada módulo tiene una responsabilidad clara.
- Que frontend, backend y Machine Learning están separados.
- Que la estructura permite trabajo paralelo.
- Que existen reglas claras para pruebas y documentación.
- Que el flujo Git está definido.
- Que los agentes de IA tienen límites operativos claros.
- Que la estructura puede evolucionar sin generar duplicación.
- Que las decisiones pendientes están identificadas.
- Que la implementación actual puede migrar progresivamente a esta estructura.