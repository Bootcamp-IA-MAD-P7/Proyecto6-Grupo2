# Software Design Document (SDD)

# SDD-07 · API Design

| Campo | Valor |
|---|---|
| Proyecto | TalentCare |
| Documento | API Design |
| Código | SDD-07 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00; SDD-00A; SDD-01; SDD-02 |
| Documentos relacionados | SDD-06 · Frontend; SDD-05 · Modeling |

---

## 1. Descripción

El backend es una aplicación FastAPI que sirve el clasificador binario de Random Forest entrenado. Carga el modelo una vez al arrancar mediante `@lru_cache`, valida las peticiones entrantes con Pydantic, ejecuta la inferencia a través del pipeline completo (`PolarsToPandas → preprocessor → RF`) y devuelve una respuesta estructurada.

El frontend se comunica con él a través de `POST /api/v1/predict`. El endpoint `GET /api/dashboard/overview` está pendiente de implementación para conectar el dashboard ejecutivo.

---

## 2. Stack tecnológico

| Tecnología | Decisión |
|---|---|
| Framework | FastAPI |
| Lenguaje | Python |
| Validación | Pydantic v2 |
| Servidor | Uvicorn |
| Carga del modelo | `@lru_cache(maxsize=1)` — carga única al primer request |

---

## 3. Estructura de ficheros

```
backend/
├── Dockerfile
└── app/
    ├── __init__.py
    ├── main.py       — instancia FastAPI, CORS, registro del router
    ├── routes.py     — definición de endpoints
    ├── schemas.py    — modelos Pydantic de request y response
    └── inference.py  — puente hacia src/inference/
```

---

## 4. Endpoints

### POST /api/v1/predict

Recibe el perfil profesional y devuelve la predicción binaria del modelo.

**Request body** (`PredictionInput`):

| Campo | Tipo | Descripción |
|---|---|---|
| `YearsCodeNum` | float | Años de experiencia programando (0–60) |
| `ConvertedCompYearly` | float | Salario anual en USD |
| `MainBranch` | string | Si el encuestado es desarrollador profesional |
| `Employment` | string | Situación laboral |
| `EdLevel` | string | Nivel educativo más alto alcanzado |
| `Age` | string | Rango de edad |
| `OrgSize` | string | Tamaño de la organización |
| `Country` | string | País de residencia |

**Response body** (`PredictionResponseBinary`):

| Campo | Tipo | Descripción |
|---|---|---|
| `prediction` | int | 0 = not satisfied, 1 = satisfied |
| `label` | string | `"not_satisfied"` o `"satisfied"` |
| `probability_not_satisfied` | float | Confianza del modelo para clase 0 |
| `probability_satisfied` | float | Confianza del modelo para clase 1 |

**Ejemplo de respuesta:**

```json
{
  "prediction": 0,
  "label": "not_satisfied",
  "probability_not_satisfied": 0.5003,
  "probability_satisfied": 0.4997
}
```

---

## 5. Selección del modelo

La API sirve el **clasificador binario** (satisfecho vs. no satisfecho, umbral JobSat ≥ 7) en lugar de la variante de 3 clases por dos razones:

- **UX del frontend:** la interfaz presenta un resultado binario. Una salida de 3 clases requeriría que el frontend mapeara tres etiquetas a una decisión binaria, añadiendo complejidad innecesaria.
- **Fiabilidad:** el modelo binario alcanza una balanced accuracy de 0.55 frente a 0.38 del multiclase en test, con una brecha de overfitting de 1.9 pp frente a 3.2 pp. El sesgo sistemático del modelo multiclase hacia predecir "high" (causado por el pequeño tamaño real de la clase 0) se mitiga en la formulación binaria al disponer de mayor tamaño efectivo por clase.

El modelo multiclase permanece disponible como `random_forest_pipeline.joblib` y está documentado en SDD-05.

---

## 6. Pipeline de inferencia

Las peticiones atraviesan cuatro capas:

```
POST /api/v1/predict
      │
      ▼
Validación Pydantic (schemas.py)
      │
      ▼
routes.py — recibe el request validado, llama a predict_single()
      │
      ▼
inference.py — llama a predict_single() de src/inference/predict.py
      │
      ▼
src/inference/predict.py — construye un DataFrame de una fila,
lo pasa por el pipeline completo (PolarsToPandas → preprocessor → RF)
y devuelve probabilidades y etiqueta
```

SMOTENC solo se ejecuta durante `pipeline.fit()`, no durante `pipeline.predict()` — los pipelines de imblearn omiten correctamente los pasos de resampling en inferencia.

---

## 7. Carga del modelo

`inference.py` usa `@lru_cache(maxsize=1)` sobre `get_pipeline()` — el modelo se carga desde disco una vez en el primer request y se mantiene en memoria durante toda la vida del proceso. Para cargar un modelo nuevo es necesario reiniciar el servidor.

El pipeline binario se carga por defecto (`load_rf_pipeline(binary=True)`), que lee `models/pipelines/random_forest_binary_pipeline.joblib`.

---

## 8. Manejo de errores

| Escenario | HTTP | Detalle |
|---|---|---|
| Campo ausente o tipo incorrecto | 422 | Error de validación Pydantic por campo |
| Feature faltante en el dict de entrada | 400 | Lista de features ausentes |
| Archivo del modelo no encontrado en disco | 500 | Ruta e instrucciones para reentrenar |
| Error interno no controlado | 500 | Mensaje genérico sin trazas internas |

---

## 9. CORS

Configurado en `backend/app/main.py`. En desarrollo se permite cualquier origen:

```python
allow_origins=["*"]
```

Antes de desplegar a producción, restringir al origen del frontend:

```python
allow_origins=["http://localhost:5173"]  # Vite dev server
```

---

## 10. Ejecución local

```bash
uv run python -m uvicorn backend.app.main:app --reload
```

Documentación interactiva generada automáticamente por FastAPI:

http://localhost:8000/docs

---

## 11. Docker

El backend tiene su propio `Dockerfile` en `backend/`. Se orquesta junto al frontend mediante `docker-compose.yml` en la raíz del proyecto:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./models/pipelines:/app/models/pipelines
    environment:
      - PYTHONUNBUFFERED=1
```

Los artefactos del modelo se montan como volumen desde `models/pipelines/` para que el contenedor acceda al pipeline entrenado sin necesidad de reconstruir la imagen.

---

## 12. Decisiones pendientes

| Decisión | Impacto |
|---|---|
| Endpoint `GET /api/dashboard/overview` | Requerido por el dashboard ejecutivo del frontend — pendiente de implementación |
| CORS en producción | Restringir `allow_origins` al dominio del frontend desplegado |
| Endpoint `GET /health` | Documentado en SDD-08 como requisito de prueba — pendiente de implementar |

---

## 13. Trazabilidad

| Requisito | Mecanismo |
|---|---|
| FR-013 · Validación autoritativa | Pydantic valida todos los campos antes de llegar a inferencia |
| FR-015 · Adaptación al esquema | `predict_single()` construye el DataFrame con exactamente las features de `FEATURES` |
| FR-016 · Modelo aprobado | `lru_cache` garantiza que se usa una única versión cargada |
| SEC-001 · Validación de entrada | 422 automático ante campos ausentes o malformados |
| SEC-002 · Sin trazas internas | Los handlers de error devuelven `detail` sin stack traces |
| OBS-001 · Registro de errores | FastAPI registra errores HTTP; errores de inferencia capturados en try/except |
