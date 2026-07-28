import json
from pathlib import Path

import joblib

from src.training.common import binarize_target, load_splits, split_xy
from src.evaluation.metrics import compute_metrics

PIPELINES_DIR = Path("models/pipelines")
METRICS_DIR = Path("models/metrics")


def evaluate(pipeline_name: str = "xgboost_pipeline") -> dict:
    _, _, test_df = load_splits()
    test_df = binarize_target(test_df)
    X_test, y_test = split_xy(test_df)

    X_test = X_test.to_pandas()
    y_test = y_test.to_pandas()

    pipeline = joblib.load(PIPELINES_DIR / f"{pipeline_name}.joblib")

    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    metrics = compute_metrics(y_test, y_pred, y_prob)

    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = METRICS_DIR / f"{pipeline_name}.json"
    out_path.write_text(json.dumps(metrics, indent=2))

    print(f"Pipeline : {pipeline_name}")
    print(f"Accuracy : {metrics['accuracy']}")
    print(f"F1       : {metrics['f1']}")
    print(f"ROC-AUC  : {metrics['roc_auc']}")
    print(f"Confusion matrix: {metrics['confusion_matrix']}")
    print(f"Saved to {out_path}")

    return metrics
