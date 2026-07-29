"""Random Forest training pipeline."""

from pathlib import Path
from typing import Any, Mapping

import joblib
import polars as pl
from imblearn.over_sampling import SMOTENC
from imblearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

from src.training.common import (
    CATEGORICAL_FEATURES,
    FEATURES,
    NUMERIC_FEATURES,
    PolarsToPandas,
)

PIPELINES_DIR = Path("models/pipelines")
RF_BINARY_PATH = PIPELINES_DIR / "random_forest_binary_pipeline.joblib"
RF_MULTICLASS_PATH = PIPELINES_DIR / "random_forest_pipeline.joblib"

REFERENCE_NUMERIC_FEATURES = list(NUMERIC_FEATURES)
REFERENCE_CATEGORICAL_FEATURES = list(CATEGORICAL_FEATURES)

DEFAULT_PARAMS: dict[str, Any] = {
    "n_estimators": 300,
    "max_depth": 12,
    "min_samples_split": 10,
    "min_samples_leaf": 5,
    "max_features": "sqrt",
    "bootstrap": True,
    "max_samples": 0.75,
    "ccp_alpha": 0.0,
    "class_weight": "balanced",
    "random_state": 42,
    "n_jobs": -1,
}


def build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        [("imputer", SimpleImputer(strategy="median"))]
    )
    categorical_pipeline = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        [
            ("num", numeric_pipeline, NUMERIC_FEATURES),
            ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )


def build_pipeline(params: Mapping[str, Any] | None = None) -> Pipeline:
    """Build an unfitted SMOTENC, preprocessing, and Random Forest pipeline."""
    merged_params = {**DEFAULT_PARAMS, **(params or {})}
    merged_params["class_weight"] = "balanced"
    merged_params["random_state"] = 42

    categorical_indices = [FEATURES.index(col) for col in CATEGORICAL_FEATURES]

    return Pipeline([
        ("to_pandas", PolarsToPandas()),
        ("smote", SMOTENC(
            categorical_features=categorical_indices,
            random_state=42,
            k_neighbors=5,
        )),
        ("preprocessor", build_preprocessor()),
        ("classifier", RandomForestClassifier(**merged_params)),
    ])


def train(
    X_train: pl.DataFrame,
    y_train: pl.Series,
    params: Mapping[str, Any] | None = None,
) -> Pipeline:
    pipeline = build_pipeline(params)
    pipeline.fit(X_train, y_train.to_numpy())
    return pipeline


def build_binary_pipeline(params: Mapping[str, Any] | None = None) -> Pipeline:
    merged_params = {**DEFAULT_PARAMS, **(params or {})}
    merged_params["class_weight"] = "balanced"
    merged_params["random_state"] = 42
    return Pipeline([
        ("to_pandas", PolarsToPandas()),
        ("preprocessor", build_preprocessor()),
        ("classifier", RandomForestClassifier(**merged_params)),
    ])


def train_binary(
    X_train: pl.DataFrame,
    y_train: pl.Series,
    params: Mapping[str, Any] | None = None,
) -> Pipeline:
    pipeline = build_binary_pipeline(params)
    pipeline.fit(X_train, y_train.to_numpy())
    return pipeline


def load_rf_pipeline(binary: bool = True) -> Pipeline:
    path = RF_BINARY_PATH if binary else RF_MULTICLASS_PATH
    if not path.exists():
        raise FileNotFoundError(
            f"Trained pipeline not found at {path}. "
            "Run scripts/train_random_forest.py first."
        )
    return joblib.load(path)


def save(pipeline: Pipeline, path: str | Path | None = None) -> Path:
    output_path = (
        Path(path)
        if path is not None
        else PIPELINES_DIR / "random_forest_pipeline.joblib"
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output_path)
    return output_path
