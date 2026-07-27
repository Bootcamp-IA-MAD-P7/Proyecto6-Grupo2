import numpy as np
import polars as pl
from pathlib import Path
from catboost import CatBoostRegressor, Pool
from sklearn.model_selection import KFold
from src.data.cat_lgbm_xgb.preprocessing import (
    CATEGORICAL_COLS,
    PIPELINE_DIR,
    load_pipeline,
)


TRAINED_DIR = Path("models/trained")
N_SPLITS = 5
RANDOM_SEED = 42

CATBOOST_PARAMS = {
    "iterations": 300,
    "learning_rate": 0.1,
    "depth": 6,
    "random_seed": RANDOM_SEED,
    "verbose": 0,
    "task_type": "GPU",
    "devices": "0",
    "od_type": "Iter",
    "od_wait": 30,
}


def train_catboost_oof(
    X_train: pl.DataFrame,
    y_train: np.ndarray,
    X_test: pl.DataFrame,
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> tuple[np.ndarray, np.ndarray]:
    trained_dir.mkdir(parents=True, exist_ok=True)

    kf = KFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_SEED)
    oof_preds = np.zeros(len(X_train))
    test_preds = np.zeros(len(X_test))

    X_train_pd = X_train.to_pandas()
    X_test_pd = X_test.to_pandas()

    for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_pd)):
        print(f"CatBoost fold {fold + 1}/{N_SPLITS}...")

        X_tr = X_train_pd.iloc[train_idx]
        X_val = X_train_pd.iloc[val_idx]
        y_tr = y_train[train_idx]
        y_val = y_train[val_idx]

        train_pool = Pool(X_tr, y_tr, cat_features=CATEGORICAL_COLS)
        val_pool = Pool(X_val, y_val, cat_features=CATEGORICAL_COLS)

        model = CatBoostRegressor(**CATBOOST_PARAMS)
        model.fit(train_pool, eval_set=val_pool)

        oof_preds[val_idx] = model.predict(X_val)
        test_preds += model.predict(X_test_pd) / N_SPLITS

    print("Training final CatBoost model on full train set...")
    full_pool = Pool(X_train_pd, y_train, cat_features=CATEGORICAL_COLS)
    final_model = CatBoostRegressor(**CATBOOST_PARAMS)
    final_model.fit(full_pool)

    model_path = trained_dir / "catboost.cbm"
    final_model.save_model(str(model_path))
    print(f"CatBoost model saved to {model_path}")

    np.save(pipeline_dir / "oof_catboost.npy", oof_preds)
    np.save(pipeline_dir / "test_preds_catboost.npy", test_preds)
    print(f"CatBoost OOF predictions saved to {pipeline_dir}")

    return oof_preds, test_preds


def run_catboost(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    oof_preds, test_preds = train_catboost_oof(
        X_train=data["X_train"],
        y_train=data["y_train"],
        X_test=data["X_test"],
        pipeline_dir=pipeline_dir,
        trained_dir=trained_dir,
    )

    print(f"OOF predictions shape: {oof_preds.shape}")
    print(f"Test predictions shape: {test_preds.shape}")
    print("CatBoost training complete.")


if __name__ == "__main__":
    run_catboost(pipeline_dir=PIPELINE_DIR)
