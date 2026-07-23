# Testing Strategy

**Versión:** 1.0
**Estado:** Draft

---

# 1. Enfoque General

La estrategia de testing cubre tres niveles: datos, modelo y API. El objetivo es garantizar que cada componente funciona correctamente de forma aislada y que el sistema integrado responde según lo esperado.

El framework de testing utilizado es **pytest**, ejecutado automáticamente en cada push y Pull Request mediante el CI definido en `.github/workflows/ci.yml`.

---

# 2. Tests de Datos

**Fichero:** `tests/test_data.py`
**Módulos cubiertos:** `src/data/`, `utils/load_raw_data.py`

Verifican que el pipeline de datos funciona correctamente:

- `RawData` carga el dataset desde Hugging Face sin errores y devuelve un DataFrame de Polars.
- `Schema` carga el schema del survey sin errores.
- El schema de columnas es el esperado.
- No hay valores nulos en columnas críticas tras el preprocesado.
- El split produce los tamaños correctos (70/15/15).
- El split estratificado mantiene la proporción de clases en cada conjunto.

---

# 3. Tests de Entrenamiento

**Fichero:** `tests/test_training.py`
**Módulos cubiertos:** `src/training/`

Verifican que los modelos se entrenan y generan artefactos válidos:

- El modelo baseline se entrena sin errores.
- Random Forest y XGBoost producen predicciones con el formato correcto.
- El pipeline entrenado se guarda y se puede cargar desde `models/pipelines/`.

---

# 4. Tests de Evaluación

**Fichero:** `tests/test_evaluation.py`
**Módulos cubiertos:** `src/evaluation/`

Verifican que las métricas se calculan correctamente:

- F1-score, accuracy y ROC-AUC devuelven valores entre 0 y 1.
- El modelo supera el rendimiento del baseline.
- La matriz de confusión tiene el formato esperado.

---

# 5. Tests de Inferencia

**Fichero:** `tests/test_inference.py`
**Módulos cubiertos:** `src/inference/`

Verifican que el pipeline de inferencia funciona sobre datos nuevos:

- El pipeline se carga correctamente desde `models/pipelines/`.
- La predicción devuelve la clase esperada (0 o 1).
- La probabilidad devuelta está entre 0 y 1.
- Los factores de explicabilidad tienen el formato correcto.

---

# 6. Tests del Backend

**Fichero:** `tests/test_backend.py`
**Módulos cubiertos:** `backend/app/`

Verifican que la API responde correctamente:

- `GET /health` devuelve `{"status": "ok"}`.
- `POST /predict` con datos válidos devuelve una predicción con el schema correcto.
- `POST /predict` con datos inválidos devuelve error `422`.
- Los campos obligatorios del request están validados.

---

# 7. Ejecución

```bash
uv run pytest tests/
```

Los tests se ejecutan automáticamente en el CI en cada push o PR a `main` o `dev`.
