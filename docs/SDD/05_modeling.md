# Software Design Document (SDD)

# SDD-05 · Modeling

| Campo | Valor |
|---|---|
| Proyecto | TalentCare AI |
| Documento | Modeling |
| Código | SDD-05 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-01, SDD-02, SDD-04 |
| Documentos relacionados | SDD-07, SDD-08 |

---

## 1. Problema de clasificación

| Campo | Valor |
|---|---|
| Tipo | Clasificación supervisada multiclase |
| Variable objetivo | `JobSat` |
| Dataset | Stack Overflow Developer Survey |
| Fuente | `https://huggingface.co/datasets/Anahia/stackoverflow_survey` |
| Librería | Polars |

La estrategia de agrupación de clases se definirá tras el EDA del dataset seleccionado. La propuesta inicial es binaria:

| Clase | Etiqueta | Valores agrupados |
|---|---|---|
| 1 | Satisfecho | Very satisfied, Slightly satisfied |
| 0 | No satisfecho | Very dissatisfied, Slightly dissatisfied, Neither |

> Si el EDA justifica una estrategia multiclase, esta tabla se revisará antes del entrenamiento.

---

## 2. Arquitectura de entrenamiento

```text
Dataset (Hugging Face)
        │
        ▼
Carga — utils/load_raw_data.py
        │
        ▼
Preprocesado — src/data/
        │
        ▼
Feature engineering — src/features/
        │
        ▼
Split estratificado 70 / 15 / 15
        │
        ▼
Entrenamiento — src/training/
        │
        ▼
Evaluación — src/evaluation/
        │
        ▼
Selección del modelo final
        │
        ▼
Pipeline serializado — models/pipelines/
```

---

## 3. Modelos candidatos

| Modelo | Archivo | Estado |
|---|---|---|
| DummyClassifier (baseline) | `src/training/baseline.py` | Previsto |
| Random Forest | `src/training/random_forest.py` | Previsto |
| XGBoost | `src/training/xgboost.py` | Previsto |
| Ensemble (voting o stacking) | `src/training/ensemble.py` | Previsto |

El modelo ganador se determina por resultados, no por decisión previa.

---

## 4. Validación

| Parámetro | Valor |
|---|---|
| Split | 70% entrenamiento / 15% validación / 15% test |
| Estrategia | Estratificado por clase |
| Validación cruzada | k-fold estratificado, k=5 |
| Búsqueda de hiperparámetros | `src/training/tuning.py` |

---

## 5. Métricas

| Métrica | Rol | Justificación |
|---|---|---|
| F1-score (macro) | Principal | Equilibra precisión y recall ante posible desbalance |
| ROC-AUC | Secundaria | Capacidad discriminativa |
| Accuracy | Referencia | Comparación con baseline |
| Matriz de confusión | Diagnóstico | Análisis de errores por clase |

Implementación: `src/evaluation/metrics.py`

El umbral mínimo de aceptación del modelo queda pendiente de decisión del equipo (OD-013 en SDD-01).

---

## 6. Explicabilidad

El modelo seleccionado expondrá los factores más relevantes de cada predicción individual.

| Técnica | Estado |
|---|---|
| Feature importance nativa (RF / XGBoost) | Previsto |
| SHAP values | Pendiente de decisión |

La técnica definitiva se aprobará antes de la integración con la API (ver SDD-07).

Los factores se devolverán en el contrato de respuesta como `top_factors`.

---

## 7. Artefactos del modelo

Cada modelo aprobado generará:

```text
models/pipelines/   — pipeline serializado (preprocesado + modelo)
models/trained/     — modelo entrenado
models/metrics/     — métricas de evaluación
```

`metadata.json` mínimo requerido:

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

---

## 8. Trazabilidad

| Documento | Relación |
|---|---|
| SDD-01 · Requirements | NFR-024, NFR-025, NFR-035, OD-001, OD-002, OD-003, OD-004, OD-013 |
| SDD-02 · Architecture | Sección 6.4 Pipeline de inferencia, Sección 6.5 Modelo |
| SDD-07 · API | Contrato de `top_factors` y clases de salida |
| SDD-08 · Testing | Tests de entrenamiento, evaluación e inferencia |
