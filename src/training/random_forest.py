"""Random Forest training pipeline."""

from pathlib import Path
from typing import Any, Mapping

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from src.training import common

PIPELINES_DIR = Path("models/pipelines")

REFERENCE_NUMERIC_FEATURES = [
    "YearsCodeNum",
    "ConvertedCompYearly",
]
REFERENCE_CATEGORICAL_FEATURES = [
    "MainBranch",
    "Employment",
    "EdLevel",
    "Age",
    "OrgSize",
    "Country",
]

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


def _shared_features(name: str, fallback: list[str]) -> list[str]:
    """Use the shared contract when available, otherwise the XGBoost reference."""
    return list(getattr(common, name, fallback))


def build_preprocessor() -> ColumnTransformer:
    """Build the numeric and categorical preprocessing pipeline."""
    numeric_pipeline = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )
    categorical_pipeline = Pipeline(
        [
            (
                "imputer",
                SimpleImputer(strategy="constant", fill_value="missing"),
            ),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        [
            (
                "num",
                numeric_pipeline,
                _shared_features("NUMERIC_FEATURES", REFERENCE_NUMERIC_FEATURES),
            ),
            (
                "cat",
                categorical_pipeline,
                _shared_features(
                    "CATEGORICAL_FEATURES",
                    REFERENCE_CATEGORICAL_FEATURES,
                ),
            ),
        ]
    )


def build_pipeline(params: Mapping[str, Any] | None = None) -> Pipeline:
    """Build an unfitted preprocessing and Random Forest pipeline."""
    merged_params = {**DEFAULT_PARAMS, **(params or {})}
    merged_params["class_weight"] = "balanced"
    merged_params["random_state"] = 42
    return Pipeline(
        [
            ("preprocessor", build_preprocessor()),
            ("classifier", RandomForestClassifier(**merged_params)),
        ]
    )


def train(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    params: Mapping[str, Any] | None = None,
) -> Pipeline:
    """Fit and return a Random Forest pipeline on training data."""
    pipeline = build_pipeline(params)
    pipeline.fit(X_train, y_train)
    return pipeline


def save(pipeline: Pipeline, path: str | Path | None = None) -> Path:
    """Persist a fitted pipeline and return its output path."""
    output_path = (
        Path(path)
        if path is not None
        else PIPELINES_DIR / "random_forest_pipeline.joblib"
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output_path)
    return output_path
