import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix

from src.training.common import load_splits, binarize_target, split_xy
from src.training.xgboost import train, save


def main() -> None:
    print("Loading splits...")
    train_df, dev_df, _ = load_splits()

    train_df = binarize_target(train_df)
    dev_df = binarize_target(dev_df)

    X_train, y_train = split_xy(train_df)
    X_dev, y_dev = split_xy(dev_df)

    X_train = X_train.to_pandas()
    X_dev = X_dev.to_pandas()
    y_train = y_train.to_pandas()
    y_dev = y_dev.to_pandas()

    print(f"Train: {X_train.shape} | Dev: {X_dev.shape}")
    print(f"Target distribution (train) — 0: {(y_train == 0).sum()} | 1: {(y_train == 1).sum()}")

    print("\nTraining XGBoost pipeline...")
    pipeline = train(X_train, y_train)
    print("Training complete.")

    print("\n--- Evaluation on dev set ---")
    y_pred = pipeline.predict(X_dev)
    y_proba = pipeline.predict_proba(X_dev)[:, 1]

    print(f"Accuracy : {accuracy_score(y_dev, y_pred):.4f}")
    print(f"F1       : {f1_score(y_dev, y_pred):.4f}")
    print(f"ROC-AUC  : {roc_auc_score(y_dev, y_proba):.4f}")
    print(f"Confusion matrix:\n{confusion_matrix(y_dev, y_pred)}")

    save(pipeline)


if __name__ == "__main__":
    main()
