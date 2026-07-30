from pathlib import Path

import joblib
from sklearn.pipeline import Pipeline


PIPELINES_DIR = Path(__file__).resolve().parents[2] / "models" / "pipelines"
BINARY_PATH = PIPELINES_DIR / "random_forest_binary_pipeline.joblib"
MULTICLASS_PATH = PIPELINES_DIR / "random_forest_pipeline.joblib"


def load_rf_pipeline(binary: bool = True) -> Pipeline:
    path = BINARY_PATH if binary else MULTICLASS_PATH

    if not path.exists():
        raise FileNotFoundError(
            f"Trained pipeline not found at {path}. "
            "Run scripts/train_random_forest.py first."
        )

    return joblib.load(path)
