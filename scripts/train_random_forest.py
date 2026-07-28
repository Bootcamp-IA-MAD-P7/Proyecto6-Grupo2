"""Train and evaluate the Random Forest pipeline on train and dev splits."""

import sys
from pathlib import Path
from typing import TypedDict

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import numpy as np
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

from src.training.common import FEATURES, SPLITS_DIR, TARGET, bin_jobsat
from src.training.random_forest import save, train


class Metrics(TypedDict):
    """Scalar multiclass classification metrics."""

    accuracy: float
    balanced_accuracy: float
    precision: float
    recall: float
    f1_macro: float
    roc_auc: float


def calculate_metrics(
    pipeline: Pipeline,
    X: pl.DataFrame,
    y: pl.Series,
) -> tuple[Metrics, np.ndarray]:
    """Calculate multiclass classification metrics."""
    predictions = pipeline.predict(X)
    probabilities = pipeline.predict_proba(X)
    metrics: Metrics = {
        "accuracy": accuracy_score(y, predictions),
        "balanced_accuracy": balanced_accuracy_score(y, predictions),
        "precision": precision_score(y, predictions, average="macro", zero_division=0),
        "recall": recall_score(y, predictions, average="macro", zero_division=0),
        "f1_macro": f1_score(y, predictions, average="macro", zero_division=0),
        "roc_auc": roc_auc_score(y, probabilities, multi_class="ovr", average="macro"),
    }
    return metrics, confusion_matrix(y, predictions, labels=[0, 1, 2])


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


def prepare_split(frame: pl.DataFrame) -> tuple[pl.DataFrame, pl.Series]:
    binned = bin_jobsat(frame)
    return binned.select(FEATURES), binned[TARGET]


def main() -> None:
    """Train on train, evaluate on train/dev, and save the fitted pipeline."""
    print("Loading train and dev splits...")
    train_df = pl.read_parquet(SPLITS_DIR / "train.parquet")
    dev_df = pl.read_parquet(SPLITS_DIR / "dev.parquet")
    X_train, y_train = prepare_split(train_df)
    X_dev, y_dev = prepare_split(dev_df)

    print(f"Train: {X_train.shape} | Dev: {X_dev.shape}")
    print(
        "Target distribution (train)"
        f" — 0: {(y_train == 0).sum()} | 1: {(y_train == 1).sum()}"
    )

    print("\nTraining Random Forest pipeline...")
    pipeline = train(X_train, y_train)
    print("Training complete.")

    train_metrics, train_matrix = calculate_metrics(
        pipeline,
        X_train,
        y_train,
    )
    dev_metrics, dev_matrix = calculate_metrics(
        pipeline,
        X_dev,
        y_dev,
    )

    print_comparison(train_metrics, dev_metrics)
    print(f"\nTrain confusion matrix:\n{train_matrix}")
    print(f"\nDev confusion matrix:\n{dev_matrix}")

    saved_path = save(pipeline)
    print(f"\nPipeline saved to {saved_path}")


if __name__ == "__main__":
    main()
