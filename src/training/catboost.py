import numpy as np
import polars as pl
import optuna
from pathlib import Path
from catboost import CatBoostClassifier, Pool
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import classification_report, f1_score
from src.data.cat_lgbm_xgb.preprocessing import (
    CATEGORICAL_COLS,
    PIPELINE_DIR,
    load_pipeline,
)

TRAINED_DIR = Path("models/trained")
N_SPLITS = 5
RANDOM_SEED = 42

CLASS_WEIGHTS = [9.0, 3.0, 1.0]

BASE_PARAMS = {
    "random_seed": RANDOM_SEED,
    "verbose": 0,
    "task_type": "GPU",
    "devices": "0",
    "od_type": "Iter",
    "od_wait": 30,
    "loss_function": "MultiClass",
    "eval_metric": "TotalF1:average=Macro",
    "class_weights": CLASS_WEIGHTS,
}


def bin_target(y: np.ndarray) -> np.ndarray:
    result = np.zeros(len(y), dtype=np.int8)
    result[(y >= 4) & (y <= 6)] = 1
    result[y >= 7] = 2
    return result


def _get_cat_indices(df: "pd.DataFrame") -> list[int]:
    return [df.columns.get_loc(c) for c in CATEGORICAL_COLS]


def objective(
    trial: optuna.Trial,
    X: np.ndarray,
    y: np.ndarray,
    cat_indices: list[int],
) -> float:
    params = {
        **BASE_PARAMS,
        "bootstrap_type": "Bernoulli",
        "iterations": trial.suggest_int("iterations", 300, 1000),
        "learning_rate": trial.suggest_float("learning_rate", 0.005, 0.2, log=True),
        "depth": trial.suggest_int("depth", 4, 10),
        "l2_leaf_reg": trial.suggest_float("l2_leaf_reg", 1.0, 15.0),
        "min_data_in_leaf": trial.suggest_int("min_data_in_leaf", 1, 50),
        "subsample": trial.suggest_float("subsample", 0.5, 1.0),
    }

    kf = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_SEED)
    scores = []

    for train_idx, val_idx in kf.split(X, y):
        X_tr, X_val = X[train_idx], X[val_idx]
        y_tr, y_val = y[train_idx], y[val_idx]

        train_pool = Pool(X_tr, y_tr, cat_features=cat_indices)
        val_pool = Pool(X_val, y_val, cat_features=cat_indices)

        model = CatBoostClassifier(**params)
        model.fit(train_pool, eval_set=val_pool)

        preds = model.predict(X_val).flatten().astype(np.int8)
        scores.append(f1_score(y_val, preds, average="macro"))

    return float(np.mean(scores))


def tune_catboost(
    X: np.ndarray, y: np.ndarray, cat_indices: list[int], n_trials: int = 50
) -> dict:
    study = optuna.create_study(direction="maximize")
    study.optimize(lambda trial: objective(trial, X, y, cat_indices), n_trials=n_trials)
    print(f"Best macro F1: {study.best_value:.4f}")
    print(f"Best params: {study.best_params}")
    return study.best_params


def train_catboost_oof(
    X_train: pl.DataFrame,
    y_train: np.ndarray,
    X_test: pl.DataFrame,
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    trained_dir.mkdir(parents=True, exist_ok=True)

    X_train_pd = X_train.to_pandas()
    X_test_pd = X_test.to_pandas()
    cat_indices = _get_cat_indices(X_train_pd)

    print("Tuning CatBoost hyperparameters with Optuna...")
    best_params = tune_catboost(X_train_pd.to_numpy(), y_train, cat_indices)
    tuned_params = {**BASE_PARAMS, "bootstrap_type": "Bernoulli", **best_params}

    kf = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_SEED)
    n_classes = 3
    oof_preds = np.zeros(len(X_train), dtype=np.int8)
    oof_proba = np.zeros((len(X_train), n_classes))
    test_proba_accum = np.zeros((len(X_test), n_classes))

    for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_pd, y_train)):
        print(f"CatBoost fold {fold + 1}/{N_SPLITS}...")

        X_tr = X_train_pd.iloc[train_idx]
        X_val = X_train_pd.iloc[val_idx]
        y_tr = y_train[train_idx]
        y_val = y_train[val_idx]

        train_pool = Pool(X_tr, y_tr, cat_features=CATEGORICAL_COLS)
        val_pool = Pool(X_val, y_val, cat_features=CATEGORICAL_COLS)

        model = CatBoostClassifier(**tuned_params)
        model.fit(train_pool, eval_set=val_pool)

        oof_preds[val_idx] = model.predict(X_val).flatten().astype(np.int8)
        oof_proba[val_idx] = model.predict_proba(X_val)
        test_proba_accum += model.predict_proba(X_test_pd) / N_SPLITS

    test_proba = test_proba_accum
    test_preds = test_proba.argmax(axis=1).astype(np.int8)

    print("\nOOF Classification Report:")
    print(
        classification_report(
            y_train, oof_preds, target_names=["low", "medium", "high"]
        )
    )

    print("Training final CatBoost on full train set...")
    full_pool = Pool(X_train_pd, y_train, cat_features=CATEGORICAL_COLS)
    final_model = CatBoostClassifier(**tuned_params)
    final_model.fit(full_pool)

    model_path = trained_dir / "catboost.cbm"
    final_model.save_model(str(model_path))
    print(f"CatBoost model saved to {model_path}")

    np.save(pipeline_dir / "oof_catboost.npy", oof_preds)
    np.save(pipeline_dir / "oof_catboost_proba.npy", oof_proba)
    np.save(pipeline_dir / "test_preds_catboost.npy", test_preds)
    np.save(pipeline_dir / "test_preds_catboost_proba.npy", test_proba)
    print(f"CatBoost OOF predictions saved to {pipeline_dir}")

    return oof_preds, test_preds, oof_proba


def run_catboost(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    y_train = bin_target(data["y_train"].astype(np.int8))
    y_dev = bin_target(data["y_dev"].astype(np.int8))

    oof_preds, test_preds, oof_proba = train_catboost_oof(
        X_train=data["X_train"],
        y_train=y_train,
        X_test=data["X_test"],
        pipeline_dir=pipeline_dir,
        trained_dir=trained_dir,
    )

    print("\nDev Classification Report:")
    model = CatBoostClassifier()
    model.load_model(str(trained_dir / "catboost.cbm"))
    X_dev_pd = data["X_dev"].to_pandas()
    dev_pool = Pool(X_dev_pd, cat_features=CATEGORICAL_COLS)
    dev_preds = model.predict(dev_pool).flatten().astype(np.int8)
    print(
        classification_report(y_dev, dev_preds, target_names=["low", "medium", "high"])
    )

    print(f"OOF predictions shape: {oof_preds.shape}")
    print(f"OOF probabilities shape: {oof_proba.shape}")
    print(f"Test predictions shape: {test_preds.shape}")
    print("CatBoost training complete.")


if __name__ == "__main__":
    run_catboost(pipeline_dir=PIPELINE_DIR)
