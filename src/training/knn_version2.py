# %% Importaciones

import os
import sys
import io
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import matplotlib
matplotlib.use("Agg")

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt
import seaborn as sns
import polars as pl
import numpy as np

# %% Cargar el dataset
ROOT = "C:/devF5/projects/Proyecto6-Grupo2"
df = pl.read_parquet(f"{ROOT}/data/processed/merged_survey_2021_2025_clean.parquet")

print(f"Dataset: {df.shape[0]} filas, {df.shape[1]} columnas")
print(f"Columnas: {df.columns}")

# %% Definir targets y features comunes

TARGETS = {
    "SalaryRange": "Rangos salariales (Bajo/Medio/Alto/Muy alto)",
    "DevTypePrimary": "Tipo de desarrollador (rol principal)",
    "EmploymentClean": "Estado laboral",
}

FEATURE_COLS = [
    "Country", "EdLevel", "Age", "YearsCodeNum",
    "DevType", "OrgSize", "MainBranch",
    "LanguageHaveWorkedWith", "LanguageWantToWorkWith",
    "DatabaseHaveWorkedWith", "DatabaseWantToWorkWith",
    "PlatformHaveWorkedWith", "PlatformWantToWorkWith",
    "WebframeHaveWorkedWith", "WebframeWantToWorkWith",
    "LearnCode",
]

NUMERIC_DTYPES = {pl.Float32, pl.Float64, pl.Int8, pl.Int16, pl.Int32, pl.Int64, pl.UInt8, pl.UInt16, pl.UInt32, pl.UInt64}

# %% Función de entrenamiento y evaluación

def train_and_evaluate(df, target_name, target_description, feature_cols):
    print(f"\n{'='*60}")
    print(f"TARGET: {target_name} - {target_description}")
    print(f"{'='*60}")

    subset = df.select(feature_cols + [target_name]).drop_nulls(subset=[target_name])
    print(f"Dataset after dropping nulls in target: {subset.shape[0]} rows")

    if subset.shape[0] < 100:
        print("Skipping: too few samples")
        return None

    if subset.shape[0] > 50000:
        subset = subset.sample(n=50000, seed=42)
        print(f"Sampled to 50000 rows for performance")

    print(f"\nTarget distribution:")
    dist = subset[target_name].value_counts().sort("count", descending=True)
    print(dist)

    n_classes = subset[target_name].n_unique()
    print(f"\nNumber of classes: {n_classes}")

    X = subset.drop(target_name)
    y = subset[target_name].to_numpy()

    available_features = [c for c in feature_cols if c in X.columns]
    X = X.select(available_features)

    numeric_cols = [c for c in X.columns if X[c].dtype in NUMERIC_DTYPES]
    categorical_cols = [c for c in X.columns if c not in numeric_cols]

    print(f"\nNumeric features ({len(numeric_cols)}): {numeric_cols}")
    print(f"Categorical features ({len(categorical_cols)}): {categorical_cols}")

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), numeric_cols),
            ("cat", Pipeline([("imputer", SimpleImputer(strategy="constant", fill_value="")), ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False, max_categories=50))]), categorical_cols),
        ]
    )

    X_np = X.to_pandas()
    X_train, X_test, y_train, y_test = train_test_split(
        X_np, y, test_size=0.2, random_state=42, stratify=y if n_classes <= 20 else None
    )

    print(f"\nX_train: {X_train.shape}")
    print(f"X_test:  {X_test.shape}")

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", KNeighborsClassifier()),
    ])

    param_grid = {
        "classifier__n_neighbors": [3, 5, 7],
        "classifier__weights": ["uniform", "distance"],
        "classifier__p": [2],
    }

    grid_search = GridSearchCV(pipeline, param_grid, cv=3, n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)

    best_params = grid_search.best_params_
    best_model = grid_search.best_estimator_

    print(f"\nBest Hyperparameters: {best_params}")

    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {accuracy:.4f}")

    target_names = sorted(set(y_test))
    report = classification_report(y_test, y_pred, target_names=target_names, zero_division=0)
    print(f"\nClassification Report:\n{report}")

    report_dict = classification_report(y_test, y_pred, target_names=target_names, zero_division=0, output_dict=True)

    rows = []
    for k, v in report_dict.items():
        if isinstance(v, dict):
            rows.append({"class": k, **v})
        else:
            rows.append({"class": k, "precision": v, "recall": None, "f1-score": None, "support": None})
    report_pl = pl.DataFrame(rows)
    print(f"\nReport DataFrame:\n{report_pl}")

    plt.figure(figsize=(10, 6))
    metrics_cols = ["precision", "recall", "f1-score"]
    filtered = report_pl.filter(~pl.col("class").is_in(["accuracy"]))
    plot_data = filtered.select(metrics_cols).to_numpy().astype(float)
    class_names = filtered["class"].to_list()
    if plot_data.size > 0:
        sns.heatmap(plot_data, annot=True, cmap="Blues", fmt=".2f", xticklabels=metrics_cols, yticklabels=class_names)
        plt.title(f"Classification Report - {target_name}")
        plt.tight_layout()
        plt.savefig(f"{ROOT}/models/metrics/knn_v2_{target_name}.png", dpi=150)
        plt.close('all')

    macro_row = report_pl.filter(pl.col("class") == "macro avg").to_dicts()[0]

    return {
        "target": target_name,
        "accuracy": accuracy,
        "precision": macro_row["precision"],
        "recall": macro_row["recall"],
        "f1-score": macro_row["f1-score"],
        "best_params": str(best_params),
        "n_samples": subset.shape[0],
        "n_classes": n_classes,
    }


# %% Entrenar para cada target

results = []
for target_name, target_desc in TARGETS.items():
    result = train_and_evaluate(df, target_name, target_desc, FEATURE_COLS)
    if result:
        results.append(result)

# %% Resumen comparativo

if results:
    print(f"\n{'='*60}")
    print("RESUMEN COMPARATIVO")
    print(f"{'='*60}")
    summary = pl.DataFrame(results)
    print(summary)
    summary.write_parquet(f"{ROOT}/models/metrics/knn_v2_summary.parquet")

# %% [markdown]
# ## Resumen del script
#
# Este script implementa un modelo **KNN (K-Nearest Neighbors)** para predecir múltiples targets comunes
# a partir del dataset **Stack Overflow Developer Survey 2021-2025**.
#
# **Dataset:** `data/processed/merged_survey_2021_2025_clean.parquet`
#
# **Targets:**
# - `SalaryRange` — Rangos salariales (Bajo / Medio / Alto / Muy alto)
# - `DevTypePrimary` — Tipo de desarrollador (rol principal)
# - `EmploymentClean` — Estado laboral
#
# **Flujo:**
# 1. Carga de datos ampliada (2021-2025)
# 2. Definición de features comunes (país, educación, experiencia, tecnologías, etc.)
# 3. Función reutilizable `train_and_evaluate` para cada target:
#    - Imputación + escalado (numéricas) y OneHotEncoder (categóricas) via Pipeline
#    - Búsqueda de hiperparámetros con GridSearchCV (cv=3)
#    - Evaluación: accuracy, classification report y heatmap
# 4. Resumen comparativo de todos los targets en un único DataFrame exportado a Parquet
#
# **Mejoras respecto a v1 (`knn.py`):**
# - Múltiples targets en un solo ejecución
# - Dataset con mayor rango temporal (2021-2025)
# - Pipeline de preprocesamiento integrado (imputación + encoding)
# - Límite de 50k muestras para rendimiento
# - Resumen comparativo exportado a `models/metrics/knn_v2_summary.parquet`
