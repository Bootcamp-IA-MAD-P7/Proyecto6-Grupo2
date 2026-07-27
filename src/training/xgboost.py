from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder
from xgboost import XGBClassifier

from src.training.common import CATEGORICAL_FEATURES, NUMERIC_FEATURES

PIPELINES_DIR = Path("models/pipelines")

DEFAULT_PARAMS = {
    "n_estimators": 300,
    "max_depth": 6,
    "learning_rate": 0.05,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "eval_metric": "logloss",
    "random_state": 42,
    "n_jobs": -1,
}


def build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
    ])
    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
        ("encoder", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)),
    ])
    return ColumnTransformer([
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ])


def build_pipeline(params: dict | None = None) -> Pipeline:
    merged_params = {**DEFAULT_PARAMS, **(params or {})}
    return Pipeline([
        ("preprocessor", build_preprocessor()),
        ("classifier", XGBClassifier(**merged_params)),
    ])


def train(X_train: pd.DataFrame, y_train: pd.Series, params: dict | None = None) -> Pipeline:
    pipeline = build_pipeline(params)
    pipeline.fit(X_train, y_train)
    return pipeline


def save(pipeline: Pipeline, name: str = "xgboost_pipeline") -> Path:
    PIPELINES_DIR.mkdir(parents=True, exist_ok=True)
    path = PIPELINES_DIR / f"{name}.joblib"
    joblib.dump(pipeline, path)
    print(f"Pipeline saved to {path}")
    return path
