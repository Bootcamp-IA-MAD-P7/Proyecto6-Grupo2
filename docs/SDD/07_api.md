# API Design

**Versión:** 1.0
**Estado:** Draft

---

# 1. Descripción

El backend expone una API REST desarrollada con FastAPI. Su única responsabilidad es recibir los datos del formulario, validarlos, invocar el modelo de ML y devolver la predicción con su explicación.

No contiene lógica de entrenamiento. Actúa como puente entre el frontend y el modelo entrenado.

---

# 2. Stack Tecnológico

| Tecnología | Decisión |
|---|---|
| Framework | FastAPI |
| Lenguaje | Python |
| Validación | Pydantic (schemas) |
| Servidor | Uvicorn |

---

# 3. Endpoints

## GET /health

Comprueba que el servicio está activo.

**Response:**
```json
{
  "status": "ok"
}
```

---

## POST /predict

Recibe el perfil profesional del empleado y devuelve la predicción del modelo.

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

**Response:**
```json
{
  "prediction": 1,
  "label": "Satisfecho",
  "probability": 0.82,
  "top_factors": [
    {"feature": "remote_work", "importance": 0.31},
    {"feature": "converted_comp_yearly", "importance": 0.27},
    {"feature": "years_code_pro", "importance": 0.19}
  ]
}
```

---

# 4. Validación de Datos

La validación de los campos de entrada se realiza mediante schemas Pydantic definidos en `backend/app/schemas.py`.

Si los datos de entrada son inválidos, la API devuelve un error `422 Unprocessable Entity` con el detalle del campo incorrecto. Esto cubre el UC4 y UC10 del SDD-00A.

---

# 5. Integración con el Modelo

El flujo interno de la API al recibir una petición es:

```
POST /predict
      │
      ▼
Validación Pydantic (schemas.py)
      │
      ▼
Carga del pipeline entrenado (inference.py → src/inference/load_pipeline.py)
      │
      ▼
Preprocesado + Predicción (src/inference/predict.py)
      │
      ▼
Respuesta JSON al frontend
```

El modelo se carga una sola vez al arrancar la aplicación para evitar latencia en cada petición.

---

# 6. Estructura de Ficheros

```
backend/
└── app/
    ├── main.py       — crea la app FastAPI
    ├── routes.py     — define los endpoints
    ├── schemas.py    — request/response con Pydantic
    └── inference.py  — puente hacia src/inference/
```

---

# 7. Decisiones Pendientes

- Campos definitivos del request: se confirmarán tras el EDA y la selección de variables del modelo.
- Formato exacto de `top_factors`: depende de la técnica de explicabilidad (XAI) seleccionada.
- CORS: configurar los orígenes permitidos según el entorno de despliegue.
