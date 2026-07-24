# Software Design Document (SDD)

# SDD-07 · API

| Campo | Valor |
|---|---|
| Proyecto | TalentCare AI |
| Documento | API |
| Código | SDD-07 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-01, SDD-02, SDD-03 |
| Documentos relacionados | SDD-05, SDD-06, SDD-08 |

---

## 1. Stack

| Tecnología | Decisión | Estado |
|---|---|---|
| Framework | FastAPI | Confirmado |
| Lenguaje | Python | Confirmado |
| Validación | Pydantic | Confirmado |
| Servidor | Uvicorn | Confirmado |

---

## 2. Estructura de archivos

```text
backend/app/
├── __init__.py
├── main.py       — crea la app, registra routers
├── routes.py     — endpoints
├── schemas.py    — PredictionRequest / PredictionResponse
└── inference.py  — puente hacia src/inference/
```

> Estado actual: archivos creados, contenido pendiente de implementación.

---

## 3. Endpoints

### GET /health

Comprueba que el servicio está activo.

| Campo | Valor |
|---|---|
| Autenticación | No requerida |
| Estado | Previsto |

**Response `200`:**
```json
{
  "status": "ok"
}
```

---

### POST /api/v1/predictions

Recibe el perfil profesional y devuelve la predicción con explicación y recomendaciones.

| Campo | Valor |
|---|---|
| Autenticación | No requerida |
| Estado | Previsto |

**Request:**
```json
{
  "years_code_pro": 5,
  "ed_level": "Bachelor's degree",
  "remote_work": "Hybrid",
  "language_have_worked_with": "Python",
  "converted_comp_yearly": 45000
}
```

> Los campos definitivos se confirmarán tras el EDA (OD-002 en SDD-01).

**Response `200`:**
```json
{
  "prediction": {
    "class": 1,
    "label": "Satisfecho"
  },
  "explanation": {
    "top_factors": [
      {"feature": "remote_work", "display_name": "Modalidad de trabajo", "importance": 0.31},
      {"feature": "converted_comp_yearly", "display_name": "Salario anual", "importance": 0.27},
      {"feature": "years_code_pro", "display_name": "Años de experiencia", "importance": 0.19}
    ]
  },
  "recommendations": [],
  "metadata": {
    "model_version": "pending"
  }
}
```

> `recommendations` y `probability` se incluirán cuando el equipo apruebe su implementación (OD-005, OD-006).

---

## 4. Códigos de respuesta

| Código | Situación |
|---|---|
| 200 | Predicción completada correctamente |
| 422 | Datos de entrada inválidos (Pydantic) |
| 503 | Modelo no disponible |
| 500 | Error interno no controlado |

---

## 5. Validación de entrada

La validación se realiza en dos niveles:

| Nivel | Responsable | Cobertura |
|---|---|---|
| Interfaz | Frontend | Campos vacíos, formatos básicos |
| Servidor | Pydantic (schemas.py) | Esquema completo, tipos, rangos, categorías |

La validación del servidor es autoritativa. Un error de validación devuelve `422` con el detalle del campo afectado.

---

## 6. Flujo interno

```text
POST /api/v1/predictions
        │
        ▼
Validación Pydantic (schemas.py)
        │
        ▼
Carga del pipeline (inference.py → src/inference/load_pipeline.py)
        │
        ▼
Preprocesado + predicción (src/inference/predict.py)
        │
        ▼
Explicabilidad
        │
        ▼
Recomendaciones
        │
        ▼
PredictionResponse → frontend
```

El modelo se carga una sola vez al arrancar la aplicación.

---

## 7. Decisiones pendientes

| ID | Decisión |
|---|---|
| OD-002 | Campos definitivos del request (tras EDA) |
| OD-003 | Clases finales de JobSat |
| OD-004 | Técnica de explicabilidad y formato de `top_factors` |
| OD-005 | Lógica de recomendaciones |
| OD-006 | Incluir `probability` en la respuesta |
| OD-007 | Umbral máximo de tiempo de respuesta |

---

## 8. Trazabilidad

| Documento | Relación |
|---|---|
| SDD-01 · Requirements | FR-007 a FR-014, FR-019, FR-023, NFR-016, NFR-017 |
| SDD-02 · Architecture | Sección 6.2 Backend y API, Sección 9 y 10 Contratos |
| SDD-03 · Implementation Structure | Sección 4 Backend |
| SDD-05 · Modeling | Clases de salida, formato de explicabilidad |
| SDD-06 · Frontend | Contrato de comunicación |
| SDD-08 · Testing | Tests del backend |
