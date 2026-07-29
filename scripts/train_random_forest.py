"""Train and evaluate the Random Forest pipeline on train and dev splits."""

import json
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
from src.training.random_forest import PIPELINES_DIR, save, train


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
    binary: bool = False,
) -> tuple[Metrics, np.ndarray]:
    """Calculate classification metrics."""
    predictions = pipeline.predict(X)
    probabilities = pipeline.predict_proba(X)
    unique_classes = sorted(y.unique().to_list())
    metrics: Metrics = {
        "accuracy": accuracy_score(y, predictions),
        "balanced_accuracy": balanced_accuracy_score(y, predictions),
        "precision": precision_score(y, predictions, average="macro", zero_division=0),
        "recall": recall_score(y, predictions, average="macro", zero_division=0),
        "f1_macro": f1_score(y, predictions, average="macro", zero_division=0),
        "roc_auc": roc_auc_score(y, probabilities[:, 1]) if binary else roc_auc_score(y, probabilities, multi_class="ovr", average="macro"),
    }
    return metrics, confusion_matrix(y, predictions, labels=unique_classes)


def print_comparison(train_metrics: Metrics, dev_metrics: Metrics, test_metrics: Metrics) -> None:
    """Print train/dev/test metrics."""
    print("\nMetric                Train      Dev      Test")
    print("-" * 50)
    for name in train_metrics:
        print(
            f"{name:<20} {train_metrics[name]:>7.4f}  {dev_metrics[name]:>7.4f}  {test_metrics[name]:>7.4f}"
        )


def prepare_split(frame: pl.DataFrame) -> tuple[pl.DataFrame, pl.Series]:
    binned = bin_jobsat(frame)
    return binned.select(FEATURES), binned[TARGET]


def prepare_split_binary(frame: pl.DataFrame) -> tuple[pl.DataFrame, pl.Series]:
    return (
        frame.select(FEATURES),
        (frame[TARGET] >= 7).cast(pl.Int8).alias(TARGET),
    )


def save_metrics(metrics: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(metrics, f, indent=2)


def main() -> None:
    print("Loading splits...")
    train_df = pl.read_parquet(SPLITS_DIR / "train.parquet")
    dev_df = pl.read_parquet(SPLITS_DIR / "dev.parquet")
    test_df = pl.read_parquet(SPLITS_DIR / "test.parquet")

    print("\n--- 3-CLASS MODEL ---")
    X_train, y_train = prepare_split(train_df)
    X_dev, y_dev = prepare_split(dev_df)
    X_test, y_test = prepare_split(test_df)

    pipeline_3class = train(X_train, y_train)
    train_m, train_cm = calculate_metrics(pipeline_3class, X_train, y_train)
    dev_m, dev_cm = calculate_metrics(pipeline_3class, X_dev, y_dev)
    test_m, test_cm = calculate_metrics(pipeline_3class, X_test, y_test)
    print_comparison(train_m, dev_m, test_m)
    print(f"\nTest confusion matrix:\n{test_cm}")
    save(pipeline_3class, PIPELINES_DIR / "random_forest_pipeline.joblib")
    save_metrics(
        {"train": train_m, "dev": dev_m, "test": test_m},
        Path("models/metrics/rf_multiclass_metrics.json"),
    )

    print("\n--- BINARY MODEL ---")
    X_train_b, y_train_b = prepare_split_binary(train_df)
    X_dev_b, y_dev_b = prepare_split_binary(dev_df)
    X_test_b, y_test_b = prepare_split_binary(test_df)

    pipeline_binary = train(X_train_b, y_train_b)
    train_mb, train_cmb = calculate_metrics(pipeline_binary, X_train_b, y_train_b, binary=True)
    dev_mb, dev_cmb = calculate_metrics(pipeline_binary, X_dev_b, y_dev_b, binary=True)
    test_mb, test_cmb = calculate_metrics(pipeline_binary, X_test_b, y_test_b, binary=True)
    print_comparison(train_mb, dev_mb, test_mb)
    print(f"\nTest confusion matrix:\n{test_cmb}")
    save(pipeline_binary, PIPELINES_DIR / "random_forest_binary_pipeline.joblib")
    save_metrics(
        {"train": train_mb, "dev": dev_mb, "test": test_mb},
        Path("models/metrics/rf_binary_metrics.json"),
    )


if __name__ == "__main__":
    main()
