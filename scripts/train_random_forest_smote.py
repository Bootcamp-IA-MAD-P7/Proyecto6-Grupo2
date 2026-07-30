"""Train binary Random Forest with SMOTE and save to a dedicated path."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

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

from src.training.common import FEATURES, SPLITS_DIR, TARGET
from src.training.random_forest import PIPELINES_DIR, save, train


SMOTE_PATH = PIPELINES_DIR / "random_forest_binary_smote_pipeline.joblib"
METRICS_PATH = Path("models/metrics/rf_binary_smote_metrics.json")


def prepare_split_binary(frame: pl.DataFrame) -> tuple[pl.DataFrame, pl.Series]:
    return (
        frame.select(FEATURES),
        (frame[TARGET] >= 7).cast(pl.Int8).alias(TARGET),
    )


def calculate_metrics(pipeline, X, y):
    predictions = pipeline.predict(X)
    probabilities = pipeline.predict_proba(X)
    metrics = {
        "accuracy": accuracy_score(y, predictions),
        "balanced_accuracy": balanced_accuracy_score(y, predictions),
        "precision": precision_score(y, predictions, average="macro", zero_division=0),
        "recall": recall_score(y, predictions, average="macro", zero_division=0),
        "f1_macro": f1_score(y, predictions, average="macro", zero_division=0),
        "roc_auc": roc_auc_score(y, probabilities[:, 1]),
    }
    return metrics, confusion_matrix(y, predictions)


def main():
    print("Loading splits...")
    train_df = pl.read_parquet(SPLITS_DIR / "train.parquet")
    dev_df = pl.read_parquet(SPLITS_DIR / "dev.parquet")
    test_df = pl.read_parquet(SPLITS_DIR / "test.parquet")

    X_train, y_train = prepare_split_binary(train_df)
    X_dev, y_dev = prepare_split_binary(dev_df)
    X_test, y_test = prepare_split_binary(test_df)

    print("\n--- BINARY MODEL (SMOTE) ---")
    pipeline = train(X_train, y_train)

    for name, X, y in [("Train", X_train, y_train), ("Dev", X_dev, y_dev), ("Test", X_test, y_test)]:
        metrics, cm = calculate_metrics(pipeline, X, y)
        print(f"\n{name} — accuracy: {metrics['accuracy']:.4f}, roc_auc: {metrics['roc_auc']:.4f}")
        print(f"Confusion matrix:\n{cm}")

    save(pipeline, SMOTE_PATH)
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"\nPipeline saved to {SMOTE_PATH}")


if __name__ == "__main__":
    main()
