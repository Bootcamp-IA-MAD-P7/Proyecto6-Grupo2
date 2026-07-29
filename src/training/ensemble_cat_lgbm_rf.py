"""Stack CatBoost, LightGBM and Random Forest probabilities."""

from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

from src.data.cat_lgbm_xgb.preprocessing import (
    PIPELINE_DIR,
    bin_target,
    load_pipeline,
)

TRAINED_DIR = Path("models/trained")
N_CLASSES = 3
MODEL_NAMES = ("catboost", "lgbm", "random_forest")
META_PARAMS = {
    "solver": "lbfgs",
    "max_iter": 1000,
    "class_weight": "balanced",
    "random_state": 42,
}


def stack_probabilities(*probabilities: np.ndarray) -> np.ndarray:
    """Validate and concatenate one probability matrix per base model."""
    if not probabilities:
        raise ValueError("At least one probability matrix is required.")

    row_count = len(probabilities[0])
    for values in probabilities:
        if values.ndim != 2 or values.shape != (row_count, N_CLASSES):
            raise ValueError(
                "Each probability matrix must have shape "
                f"({row_count}, {N_CLASSES}); received {values.shape}."
            )
    return np.column_stack(probabilities)


def load_oof_probabilities(pipeline_dir: Path) -> np.ndarray:
    return stack_probabilities(
        np.load(pipeline_dir / "oof_catboost_proba.npy"),
        np.load(pipeline_dir / "oof_lgbm_proba.npy"),
        np.load(pipeline_dir / "oof_random_forest_proba.npy"),
    )


def load_test_probabilities(pipeline_dir: Path) -> np.ndarray:
    return stack_probabilities(
        np.load(pipeline_dir / "test_preds_catboost_proba.npy"),
        np.load(pipeline_dir / "test_preds_lgbm_proba.npy"),
        np.load(pipeline_dir / "test_preds_random_forest_proba.npy"),
    )


def load_dev_probabilities(data: dict, trained_dir: Path) -> np.ndarray:
    from catboost import CatBoostClassifier, Pool
    import lightgbm as lgb

    from src.data.cat_lgbm_xgb.preprocessing import CATEGORICAL_COLS

    catboost_model = CatBoostClassifier()
    catboost_model.load_model(str(trained_dir / "catboost.cbm"))
    X_dev = data["X_dev"].to_pandas()
    catboost_proba = np.asarray(
        catboost_model.predict_proba(
            Pool(X_dev, cat_features=CATEGORICAL_COLS)
        )
    )

    X_dev_encoded = data["X_dev_enc"].to_numpy()
    lgbm_model = lgb.Booster(model_file=str(trained_dir / "lgbm.txt"))
    lgbm_proba = np.asarray(lgbm_model.predict(X_dev_encoded))

    random_forest_model = joblib.load(
        trained_dir / "random_forest_ensemble.joblib"
    )
    random_forest_proba = np.asarray(
        random_forest_model.predict_proba(X_dev_encoded)
    )

    return stack_probabilities(
        catboost_proba,
        lgbm_proba,
        random_forest_proba,
    )


def train_meta_model(
    oof_probabilities: np.ndarray,
    y_train: np.ndarray,
) -> LogisticRegression:
    model = LogisticRegression(**META_PARAMS)
    model.fit(oof_probabilities, y_train)
    return model


def run_ensemble(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    data = load_pipeline(pipeline_dir)
    y_train = bin_target(data["y_train"].astype(np.int8))

    oof_stack = load_oof_probabilities(pipeline_dir)
    print(
        f"OOF matrix: {oof_stack.shape} "
        f"({N_CLASSES} classes x {len(MODEL_NAMES)} models)"
    )
    meta_model = train_meta_model(oof_stack, y_train)
    trained_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(meta_model, trained_dir / "ensemble_cat_lgbm_rf.joblib")

    target_names = ["low", "medium", "high"]
    print("\nOOF ensemble report:")
    print(
        classification_report(
            y_train,
            meta_model.predict(oof_stack),
            target_names=target_names,
            zero_division=0,
        )
    )

    y_dev = bin_target(data["y_dev"].astype(np.int8))
    dev_stack = load_dev_probabilities(data, trained_dir)
    print("\nDev ensemble report:")
    print(
        classification_report(
            y_dev,
            meta_model.predict(dev_stack),
            target_names=target_names,
            zero_division=0,
        )
    )

    test_stack = load_test_probabilities(pipeline_dir)
    np.save(
        pipeline_dir / "test_preds_ensemble_cat_lgbm_rf.npy",
        meta_model.predict(test_stack),
    )


if __name__ == "__main__":
    run_ensemble()
