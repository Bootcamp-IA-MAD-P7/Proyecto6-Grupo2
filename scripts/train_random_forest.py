"""Train and evaluate the Random Forest pipeline on train and dev splits."""

import sys
from pathlib import Path
from typing import TypedDict

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import numpy as np
import pandas as pd
import polars as pl
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline

from src.training import common
from src.training.random_forest import (
    REFERENCE_CATEGORICAL_FEATURES,
    REFERENCE_NUMERIC_FEATURES,
    save,
    train,
)

SPLITS_DIR = Path(
    getattr(common, "SPLITS_DIR", Path("data/processed/splits"))
)
TARGET = getattr(common, "TARGET", "JobSat")
JOBSAT_THRESHOLD = getattr(common, "JOBSAT_THRESHOLD", 7)
FEATURES = list(
    getattr(
        common,
        "FEATURES",
        REFERENCE_NUMERIC_FEATURES + REFERENCE_CATEGORICAL_FEATURES,
    )
)


class Metrics(TypedDict):
    """Scalar binary-classification metrics."""

    accuracy: float
    balanced_accuracy: float
    precision: float
    recall: float
    f1: float
    f1_macro: float
    roc_auc: float


def calculate_metrics(
    pipeline: Pipeline,
    X: pd.DataFrame,
    y: pd.Series,
) -> tuple[Metrics, np.ndarray]:
    """Calculate classification metrics and the confusion matrix."""
    predictions = pipeline.predict(X)
    probabilities = pipeline.predict_proba(X)[:, 1]
    metrics: Metrics = {
        "accuracy": accuracy_score(y, predictions),
        "balanced_accuracy": balanced_accuracy_score(y, predictions),
        "precision": precision_score(y, predictions, zero_division=0),
        "recall": recall_score(y, predictions, zero_division=0),
        "f1": f1_score(y, predictions, zero_division=0),
        "f1_macro": f1_score(y, predictions, average="macro", zero_division=0),
        "roc_auc": roc_auc_score(y, probabilities),
    }
    return metrics, confusion_matrix(y, predictions, labels=[0, 1])


def print_comparison(train_metrics: Metrics, dev_metrics: Metrics) -> None:
    """Print train/dev metrics and their generalization gaps."""
    print("\nMetric                Train      Dev    Gap (pp)  Relative gap")
    print("-" * 66)
    for name, train_value in train_metrics.items():
        dev_value = dev_metrics[name]
        gap_points = (train_value - dev_value) * 100
        relative_gap = (
            ((train_value - dev_value) / train_value) * 100
            if train_value
            else 0.0
        )
        print(
            f"{name:<20} {train_value:>7.4f}  {dev_value:>7.4f}"
            f"  {gap_points:>8.2f}  {relative_gap:>11.2f}%"
        )


def prepare_split(
    frame: pl.DataFrame,
) -> tuple[pd.DataFrame, pd.Series]:
    """Binarize JobSat and return the shared feature matrix and target."""
    prepared = frame.with_columns(
        (pl.col(TARGET) >= JOBSAT_THRESHOLD).cast(pl.Int8).alias(TARGET)
    )
    return prepared.select(FEATURES).to_pandas(), prepared[TARGET].to_pandas()


def main() -> None:
    """Train on train, evaluate on train/dev, and save the fitted pipeline."""
    print("Loading train and dev splits...")
    train_df = pl.read_parquet(SPLITS_DIR / "train.parquet")
    dev_df = pl.read_parquet(SPLITS_DIR / "dev.parquet")
    X_train_pd, y_train_pd = prepare_split(train_df)
    X_dev_pd, y_dev_pd = prepare_split(dev_df)

    print(f"Train: {X_train_pd.shape} | Dev: {X_dev_pd.shape}")
    print(
        "Target distribution (train)"
        f" — 0: {(y_train_pd == 0).sum()} | 1: {(y_train_pd == 1).sum()}"
    )

    print("\nTraining Random Forest pipeline...")
    pipeline = train(X_train_pd, y_train_pd)
    print("Training complete.")

    train_metrics, train_matrix = calculate_metrics(
        pipeline,
        X_train_pd,
        y_train_pd,
    )
    dev_metrics, dev_matrix = calculate_metrics(
        pipeline,
        X_dev_pd,
        y_dev_pd,
    )

    print_comparison(train_metrics, dev_metrics)
    print(f"\nTrain confusion matrix:\n{train_matrix}")
    print(f"\nDev confusion matrix:\n{dev_matrix}")

    saved_path = save(pipeline)
    print(f"\nPipeline saved to {saved_path}")


if __name__ == "__main__":
    main()
