# Software Design Document (SDD)

# SDD-08 · Testing

| Campo | Valor |
|---|---|
| Proyecto | TalentCare AI |
| Documento | Testing |
| Código | SDD-08 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-01, SDD-02, SDD-03 |
| Documentos relacionados | SDD-05, SDD-06, SDD-07 |

---

## 1. Framework y ejecución

| Herramienta | Decisión | Estado |
|---|---|---|
| Framework | pytest | Confirmado |
| Gestor de entorno | uv | Confirmado |
| CI | `.github/workflows/ci.yml` | Implementado |

```bash
uv run pytest tests/
```

Los tests se ejecutan automáticamente en cada push y PR a `main` y `dev`.

---

## 2. Niveles de prueba

```text
Unitarias
    │ — funciones y módulos aislados
    ▼
Integración
    │ — interacción entre componentes
    ▼
End-to-end
    │ — flujo completo formulario → resultado
```

---

## 3. Cobertura por módulo

| Archivo | Módulos cubiertos | Estado |
|---|---|---|
| `tests/test_data.py` | `src/data/`, `utils/load_raw_data.py` | Previsto |
| `tests/test_training.py` | `src/training/` | Previsto |
| `tests/test_evaluation.py` | `src/evaluation/` | Previsto |
| `tests/test_inference.py` | `src/inference/` | Previsto |
| `tests/test_backend.py` | `backend/app/` | Previsto |

> Todos los archivos de test existen en el repositorio. Contenido pendiente de implementación.

---

## 4. Tests de datos

**Archivo:** `tests/test_data.py`

| Test | Criterio |
|---|---|
| Carga de dataset | `RawData.download()` devuelve un DataFrame Polars sin errores |
| Carga de schema | `Schema.download()` devuelve un DataFrame Polars sin errores |
| Columnas esperadas | El schema de columnas coincide con el definido |
| Nulos en columnas críticas | Sin nulos tras preprocesado |
| Split 70/15/15 | Los tamaños de cada conjunto son correctos |
| Split estratificado | La proporción de clases se mantiene en cada conjunto |

---

## 5. Tests de entrenamiento

**Archivo:** `tests/test_training.py`

| Test | Criterio |
|---|---|
| Baseline | DummyClassifier se entrena sin errores |
| Random Forest | Produce predicciones con el formato correcto |
| XGBoost | Produce predicciones con el formato correcto |
| Serialización | El pipeline se guarda y se carga desde `models/pipelines/` |

---

## 6. Tests de evaluación

**Archivo:** `tests/test_evaluation.py`

| Test | Criterio |
|---|---|
| F1-score | Valor entre 0 y 1 |
| ROC-AUC | Valor entre 0 y 1 |
| Accuracy | Valor entre 0 y 1 |
| Supera baseline | El modelo candidato supera al DummyClassifier |
| Matriz de confusión | Formato correcto y dimensiones esperadas |

---

## 7. Tests de inferencia

**Archivo:** `tests/test_inference.py`

| Test | Criterio |
|---|---|
| Carga del pipeline | Se carga correctamente desde `models/pipelines/` |
| Clase de salida | Pertenece al conjunto de clases aprobado |
| Probabilidad | Valor entre 0 y 1 |
| Factores de explicabilidad | Formato correcto, nombres de features válidos |

---

## 8. Tests del backend

**Archivo:** `tests/test_backend.py`

| Test | Criterio |
|---|---|
| `GET /health` | Devuelve `{"status": "ok"}` con código 200 |
| `POST /predictions` válido | Devuelve predicción con schema correcto |
| `POST /predictions` inválido | Devuelve error 422 |
| Campos obligatorios | La ausencia de un campo obligatorio devuelve 422 |

---

## 9. Criterios de aceptación del MVP

El MVP se considerará aceptado para pruebas cuando:

1. Todos los tests de datos pasan.
2. El modelo supera el baseline en F1-score.
3. El pipeline de inferencia produce clases válidas.
4. `GET /health` responde correctamente.
5. `POST /predictions` con datos válidos devuelve el schema completo.
6. `POST /predictions` con datos inválidos devuelve 422.
7. El CI pasa en `main` y `dev`.

El umbral mínimo de F1-score queda pendiente de decisión del equipo (OD-013 en SDD-01).

---

## 10. Trazabilidad

| Documento | Relación |
|---|---|
| SDD-01 · Requirements | NFR-032 a NFR-035, criterios de aceptación del MVP |
| SDD-02 · Architecture | Sección 8 Flujo de errores |
| SDD-03 · Implementation Structure | Sección 8 Pruebas |
| SDD-05 · Modeling | Métricas y umbrales de evaluación |
| SDD-07 · API | Contratos de request y response |
