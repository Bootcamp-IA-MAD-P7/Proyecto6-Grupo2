import numpy as np
import polars as pl
from pathlib import Path
from sklearn.model_selection import KFold
import lightgbm as lgb
import xgboost as xgb
from src.data.cat_lgbm_xgb.preprocessing import PIPELINE_DIR, load_pipeline

TRAINED_DIR = Path("models/trained")
N_SPLITS = 5
RANDOM_SEED = 42

LGBM_PARAMS = {
    "objective": "regression",
    "eval_metric": "rmse",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "n_estimators": 300,
    "random_state": RANDOM_SEED,
    "verbose": -1,
}

XGB_PARAMS = {
    "objective": "reg:squarederror",
    "eval_metric": "rmse",
    "learning_rate": 0.05,
    "max_depth": 6,
    "n_estimators": 300,
    "random_state": RANDOM_SEED,
    "verbosity": 0,
    "device": "cuda",
    "early_stopping_rounds": 30,
}

XGB_PARAMS_FINAL = {k: v for k, v in XGB_PARAMS.items() if k != "early_stopping_rounds"}


def train_lgbm_xgb_oof(
    X_train: pl.DataFrame,
    y_train: np.ndarray,
    X_test: pl.DataFrame,
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    trained_dir.mkdir(parents=True, exist_ok=True)

    kf = KFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_SEED)

    oof_lgbm = np.zeros(len(X_train))
    oof_xgb = np.zeros(len(X_train))
    test_preds_lgbm = np.zeros(len(X_test))
    test_preds_xgb = np.zeros(len(X_test))

    X_train_np = X_train.to_numpy()
    X_test_np = X_test.to_numpy()

    for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_np)):
        print(f"LGBM/XGB fold {fold + 1}/{N_SPLITS}...")

        X_tr, X_val = X_train_np[train_idx], X_train_np[val_idx]
        y_tr, y_val = y_train[train_idx], y_train[val_idx]

        # LightGBM
        lgbm_model = lgb.LGBMRegressor(**LGBM_PARAMS)
        lgbm_model.fit(
            X_tr,
            y_tr,
            eval_set=[(X_val, y_val)],
            callbacks=[lgb.early_stopping(30), lgb.log_evaluation(0)],
        )
        oof_lgbm[val_idx] = lgbm_model.predict(X_val)
        test_preds_lgbm += lgbm_model.predict(X_test_np) / N_SPLITS

        # XGBoost
        xgb_model = xgb.XGBRegressor(**XGB_PARAMS)
        xgb_model.fit(
            X_tr,
            y_tr,
            eval_set=[(X_val, y_val)],
            verbose=False,
        )
        oof_xgb[val_idx] = xgb_model.predict(X_val)
        test_preds_xgb += xgb_model.predict(X_test_np) / N_SPLITS

    print("Training final models on full train set...")

    final_lgbm = lgb.LGBMRegressor(**LGBM_PARAMS)
    final_lgbm.fit(X_train_np, y_train)
    lgbm_path = trained_dir / "lgbm.txt"
    final_lgbm.booster_.save_model(str(lgbm_path))
    print(f"LightGBM model saved to {lgbm_path}")

    final_xgb = xgb.XGBRegressor(**XGB_PARAMS_FINAL)
    final_xgb.fit(X_train_np, y_train)
    xgb_path = trained_dir / "xgb.ubj"
    final_xgb.save_model(str(xgb_path))
    print(f"XGBoost model saved to {xgb_path}")

    np.save(pipeline_dir / "oof_lgbm.npy", oof_lgbm)
    np.save(pipeline_dir / "oof_xgb.npy", oof_xgb)
    np.save(pipeline_dir / "test_preds_lgbm.npy", test_preds_lgbm)
    np.save(pipeline_dir / "test_preds_xgb.npy", test_preds_xgb)
    print(f"LGBM/XGB OOF predictions saved to {pipeline_dir}")

    return oof_lgbm, oof_xgb, test_preds_lgbm, test_preds_xgb


def run_lgbm_xgb(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    oof_lgbm, oof_xgb, test_preds_lgbm, test_preds_xgb = train_lgbm_xgb_oof(
        X_train=data["X_train_enc"],
        y_train=data["y_train"],
        X_test=data["X_test_enc"],
        pipeline_dir=pipeline_dir,
        trained_dir=trained_dir,
    )

    print(f"LGBM OOF shape: {oof_lgbm.shape}")
    print(f"XGB OOF shape: {oof_xgb.shape}")
    print(f"LGBM test preds shape: {test_preds_lgbm.shape}")
    print(f"XGB test preds shape: {test_preds_xgb.shape}")
    print("LGBM/XGB training complete.")
