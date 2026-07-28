import numpy as np
import joblib
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from src.data.cat_lgbm_xgb.preprocessing import PIPELINE_DIR, load_pipeline
from src.training.catboost import bin_target

TRAINED_DIR = Path("models/trained")
RANDOM_SEED = 42
LR_PARAMS = {
    "solver": "lbfgs",
    "max_iter": 1000,
    "random_state": RANDOM_SEED,
    "class_weight": {0: 9.0, 1: 3.0, 2: 1.0},
}
N_CLASSES = 3


def _stack_proba(*arrays: np.ndarray) -> np.ndarray:
    return np.column_stack(arrays)


def load_oof_probas(pipeline_dir: Path) -> np.ndarray:
    cb: np.ndarray = np.load(pipeline_dir / "oof_catboost_proba.npy")
    lgb: np.ndarray = np.load(pipeline_dir / "oof_lgbm_proba.npy")
    xgb: np.ndarray = np.load(pipeline_dir / "oof_xgb_proba.npy")
    return _stack_proba(cb, lgb, xgb)


def load_test_probas(pipeline_dir: Path) -> np.ndarray:
    cb: np.ndarray = np.load(pipeline_dir / "test_preds_catboost_proba.npy")
    lgb: np.ndarray = np.load(pipeline_dir / "test_preds_lgbm_proba.npy")
    xgb: np.ndarray = np.load(pipeline_dir / "test_preds_xgb_proba.npy")
    return _stack_proba(cb, lgb, xgb)


def load_dev_probas(data: dict, trained_dir: Path) -> np.ndarray:
    from catboost import CatBoostClassifier, Pool
    import lightgbm as lgb
    import xgboost as xgb
    from src.data.cat_lgbm_xgb.preprocessing import CATEGORICAL_COLS

    cb_model = CatBoostClassifier()
    cb_model.load_model(str(trained_dir / "catboost.cbm"))
    X_dev_pd = data["X_dev"].to_pandas()
    dev_pool = Pool(X_dev_pd, cat_features=CATEGORICAL_COLS)
    dev_cb: np.ndarray = np.asarray(cb_model.predict_proba(dev_pool))

    lgb_model = lgb.Booster(model_file=str(trained_dir / "lgbm.txt"))
    X_dev_enc_np = data["X_dev_enc"].to_numpy()
    dev_lgb: np.ndarray = np.asarray(lgb_model.predict(X_dev_enc_np))

    xgb_model = xgb.XGBClassifier()
    xgb_model.load_model(str(trained_dir / "xgb.ubj"))
    dev_xgb: np.ndarray = np.asarray(xgb_model.predict_proba(X_dev_enc_np))

    return _stack_proba(dev_cb, dev_lgb, dev_xgb)


def save_meta_model(model: LogisticRegression, trained_dir: Path) -> None:
    trained_dir.mkdir(parents=True, exist_ok=True)
    path = trained_dir / "ensemble_meta.joblib"
    joblib.dump(model, path)
    print(f"Meta-model saved to {path}")


def load_meta_model(trained_dir: Path) -> LogisticRegression:
    return joblib.load(trained_dir / "ensemble_meta.joblib")


def run_ensemble(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    print("Loading OOF probabilities...")
    oof_stack = load_oof_probas(pipeline_dir)
    y_train = bin_target(data["y_train"].astype(np.int8))

    target_names = ["low", "medium", "high"]

    print(
        f"OOF feature matrix shape: {oof_stack.shape} ({N_CLASSES} classes × 3 models)"
    )

    print("Training LogisticRegression meta-model on OOF probabilities...")
    meta = LogisticRegression(**LR_PARAMS)
    meta.fit(oof_stack, y_train)

    oof_preds = meta.predict(oof_stack)
    print("\nOOF Ensemble classification report:")
    print(
        classification_report(
            y_train, oof_preds, target_names=target_names, zero_division=0
        )
    )

    print("Saving meta-model...")
    save_meta_model(meta, trained_dir)

    print("Evaluating on dev set...")
    dev_stack = load_dev_probas(data, trained_dir)
    y_dev = bin_target(data["y_dev"].astype(np.int8))
    dev_preds = meta.predict(dev_stack)
    print("\nEnsemble Dev classification report:")
    print(
        classification_report(
            y_dev, dev_preds, target_names=target_names, zero_division=0
        )
    )

    print("Generating test predictions...")
    test_stack = load_test_probas(pipeline_dir)
    test_preds = meta.predict(test_stack)
    np.save(pipeline_dir / "test_preds_ensemble.npy", test_preds)
    print(
        f"Ensemble test predictions saved to {pipeline_dir / 'test_preds_ensemble.npy'}"
    )

    print("Ensemble complete.")
