# %% Importaciones

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
df = pl.read_parquet(f"{ROOT}/data/processed/merged_survey_2024_2025_clean.parquet")

print(f"Dataset: {df.shape[0]} filas, {df.shape[1]} columnas")
print(f"Columnas: {df.columns}")

# %% Definir X (features) e y (target)
TARGET = "JobSat"

y = df[TARGET].to_numpy()
X = df.drop(TARGET)

print(f"\nX shape: {X.shape}")
print(f"y shape: {y.shape}")
print(f"Target (JobSat) distribución:\n{df[TARGET].value_counts().sort(TARGET)}")

# %% Identificar columnas numéricas y categóricas
NUMERIC_DTYPES = {pl.Float32, pl.Float64, pl.Int8, pl.Int16, pl.Int32, pl.Int64, pl.UInt8, pl.UInt16, pl.UInt32, pl.UInt64}

numeric_cols = [c for c in X.columns if X[c].dtype in NUMERIC_DTYPES]
categorical_cols = [c for c in X.columns if X[c].dtype not in NUMERIC_DTYPES]

print(f"\nNuméricas ({len(numeric_cols)}): {numeric_cols}")
print(f"Categóricas ({len(categorical_cols)}): {categorical_cols}")

# %% Entrenamiento
X_np = X.to_pandas()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), numeric_cols),
        ("cat", Pipeline([("imputer", SimpleImputer(strategy="constant", fill_value="")), ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False, max_categories=50))]), categorical_cols),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X_np, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nX_train: {X_train.shape}")
print(f"X_test:  {X_test.shape}")
print(f"y_train: {y_train.shape}")
print(f"y_test:  {y_test.shape}")
print(f"\ny_train distribution:\n{np.unique(y_train, return_counts=True)}")
print(f"\ny_test distribution:\n{np.unique(y_test, return_counts=True)}")


# %%  Define the hyperparameter grid
knn_classifier = KNeighborsClassifier()

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", knn_classifier),
])

param_grid = {
    'classifier__n_neighbors': [3, 5, 7, 9],
    'classifier__weights': ['uniform', 'distance'],
    'classifier__p': [1, 2]
}

grid_search = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, verbose=1)
grid_search.fit(X_train, y_train)

# %% Get the best hyperparameters and the best model
best_params = grid_search.best_params_
best_model = grid_search.best_estimator_

print("Best Hyperparameters:", best_params)
print("Best Model:", best_model)

# %% Make predictions on the test set using the best model
y_pred = best_model.predict(X_test)
print(y_pred)
print(y_test)

# %% Evaluate the accuracy of the best model
accuracy = accuracy_score(y_test, y_pred)
print(accuracy)

# %% Classification Report
target_names = [str(v) for v in sorted(df[TARGET].unique())]
report = classification_report(y_test, y_pred, target_names=target_names, zero_division=0)
print("Classification Report:")
print(report)
print(len(y_test))
print(y_pred)


# %%HEATMAP
report_dict = classification_report(y_test, y_pred, target_names=target_names, zero_division=0, output_dict=True)
print("Classification Report:")

rows = []
for k, v in report_dict.items():
    if isinstance(v, dict):
        rows.append({"class": k, **v})
    else:
        rows.append({"class": k, "precision": v, "recall": None, "f1-score": None, "support": None})
report_pl = pl.DataFrame(rows)
print(report_pl)

metrics_cols = ["precision", "recall", "f1-score"]
filtered = report_pl.filter(~pl.col("class").is_in(["accuracy"]))
plot_data = filtered.select(metrics_cols).to_numpy().astype(float)
class_names = filtered["class"].to_list()

plt.figure(figsize=(8, 6))
sns.heatmap(plot_data, annot=True, cmap="Blues", fmt=".2f", xticklabels=metrics_cols, yticklabels=class_names)
plt.xlabel('Metrics')
plt.ylabel('Classes')
plt.title('Classification Report - JobSat')
plt.tight_layout()
plt.savefig(f"{ROOT}/models/metrics/knn_jobSat.png", dpi=150)
plt.close('all')
print(f"Heatmap guardado en {ROOT}/models/metrics/knn_jobSat.png")

summary = report_pl.filter(pl.col("class").is_in(["accuracy", "macro avg", "weighted avg"]))
summary.write_parquet(f"{ROOT}/models/metrics/knn_summary.parquet")
print(f"Resumen guardado en {ROOT}/models/metrics/knn_summary.parquet")

# %% [markdown]
# ## Resumen del script
#
# Este script implementa un modelo **KNN (K-Nearest Neighbors)** para predecir la satisfacción laboral (**JobSat**)
# a partir del dataset **Stack Overflow Developer Survey 2024-2025**.
#
# **Dataset:** `data/processed/merged_survey_2024_2025_clean.parquet`
#
# **Target:** `JobSat` (satisfacción laboral)
#
# **Flujo:**
# 1. Carga de datos y definición de features/target
# 2. Identificación de columnas numéricas y categóricas
# 3. Split train/test (80/20)
# 4. Búsqueda de hiperparámetros con GridSearchCV (n_neighbors, weights, p)
# 5. Evaluación: accuracy, classification report y heatmap
#
# **Nota:** Este script es la versión original (v1) con un solo target y un solo dataset temporal.