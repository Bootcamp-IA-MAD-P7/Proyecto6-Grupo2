# Machine Learning Modeling

**Versión:** 1.0
**Estado:** Draft

---

# 1. Definición del Problema

El objetivo del modelo es predecir el nivel de satisfacción laboral de un desarrollador a partir de su perfil profesional.

Se trata de un problema de **clasificación supervisada**. La estrategia de agrupación de clases se definirá durante el EDA, una vez analizada la distribución real de `job_satisfaction` en el dataset.

Propuesta inicial (sujeta a validación en EDA):

| Clase | Etiqueta | Descripción |
|---|---|---|
| 1 | Satisfecho | Agrupa "Slightly satisfied" y "Very satisfied" |
| 0 | No satisfecho | Agrupa "Very dissatisfied", "Slightly dissatisfied" y "Neither satisfied nor dissatisfied" |

> Si el EDA revela que la distribución justifica una estrategia multiclase, esta decisión se revisará antes del entrenamiento.

**Variable objetivo:** `job_satisfaction`
**Dataset:** Stack Overflow Developer Survey
**Fuente:** `https://huggingface.co/datasets/Anahia/stackoverflow_survey`
**Librería de datos:** Polars

> El pipeline soporta cualquier año disponible en el repositorio.

---

# 2. Modelo Baseline

Como punto de partida se entrenará un modelo de referencia simple (DummyClassifier) que predice siempre la clase mayoritaria.

- Propósito: establecer el rendimiento mínimo que cualquier modelo real debe superar.
- Implementación: `src/training/baseline.py`

---

# 3. Modelos Candidatos

## Random Forest

- Ensemble de árboles de decisión entrenados con bagging.
- Robusto frente a overfitting y valores atípicos.
- Proporciona importancia de variables de forma nativa.
- Implementación: `src/training/random_forest.py`

## XGBoost

- Gradient boosting optimizado.
- Alto rendimiento en datos tabulares.
- Permite regularización para controlar el overfitting.
- Implementación: `src/training/xgboost.py`

## Ensemble (modelo candidato)

- Combinación de los modelos anteriores mediante voting o stacking.
- Objetivo: superar el rendimiento de los modelos individuales.
- Implementación: `src/training/ensemble.py`

---

# 4. Estrategia de Entrenamiento

- División de datos: 70% entrenamiento, 15% validación, 15% test.
- Estrategia de split: estratificado por clase para mantener la proporción de clases.
- Búsqueda de hiperparámetros: `src/training/tuning.py`
- Validación cruzada: k-fold estratificado (k=5).

---

# 5. Métricas de Evaluación

Dado el posible desbalance de clases en la variable objetivo, las métricas principales son:

| Métrica | Justificación |
|---|---|
| F1-score | Equilibrio entre precisión y recall |
| ROC-AUC | Capacidad discriminativa del modelo |
| Accuracy | Referencia general |
| Matriz de confusión | Análisis detallado de errores |

Implementación: `src/evaluation/metrics.py`

---

# 6. Explicabilidad (XAI)

Para cumplir con los principios de IA Responsable, el modelo seleccionado incorporará:

- Importancia de variables (feature importance nativa de Random Forest y XGBoost).
- Análisis de los factores que más influyen en cada predicción individual.

---

# 7. Selección del Modelo Final

El modelo final se seleccionará comparando todos los candidatos sobre el conjunto de test.

Criterio principal: **F1-score**.

El modelo con mejor rendimiento se guardará como pipeline completo (preprocesado + modelo) en `models/pipelines/`. No se asume de antemano cuál será el modelo ganador — la selección depende de los resultados obtenidos.
