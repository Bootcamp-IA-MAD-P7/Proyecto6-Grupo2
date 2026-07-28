import numpy as np
import polars as pl
import optuna
from pathlib import Path
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import f1_score
import lightgbm as lgb
import xgboost as xgb
from src.data.cat_lgbm_xgb.preprocessing import PIPELINE_DIR, load_pipeline
from src.training.catboost import bin_target

TRAINED_DIR = Path("models/trained")
N_SPLITS = 5
RANDOM_SEED = 42
N_CLASSES = 3

LGBM_BASE = {
    "objective": "multiclass",
    "num_class": N_CLASSES,
    "eval_metric": "multi_logloss",
    "random_state": RANDOM_SEED,
    "verbose": -1,
}

XGB_BASE = {
    "objective": "multi:softprob",
    "num_class": N_CLASSES,
    "eval_metric": "mlogloss",
    "random_state": RANDOM_SEED,
    "verbosity": 0,
    "device": "cuda",
}


def _tune_lgbm(X: np.ndarray, y: np.ndarray, n_trials: int = 30) -> dict:
    def objective(trial: optuna.Trial) -> float:
        params = {
            **LGBM_BASE,
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
            "num_leaves": trial.suggest_int("num_leaves", 15, 127),
            "n_estimators": trial.suggest_int("n_estimators", 200, 800),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
            "min_child_samples": trial.suggest_int("min_child_samples", 5, 50),
            "reg_alpha": trial.suggest_float("reg_alpha", 0.0, 5.0),
            "reg_lambda": trial.suggest_float("reg_lambda", 0.0, 5.0),
        }
        kf = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_SEED)
        scores = []
        for train_idx, val_idx in kf.split(X, y):
            X_tr, X_val = X[train_idx], X[val_idx]
            y_tr, y_val = y[train_idx], y[val_idx]
            model = lgb.LGBMClassifier(**params)
            model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(15), lgb.log_evaluation(0)])
            preds = model.predict(X_val)
            scores.append(f1_score(y_val, preds, average="macro"))
        return float(np.mean(scores))

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=n_trials)
    print(f"Best LGBM macro F1: {study.best_value:.4f}")
    print(f"Best LGBM params: {study.best_params}")
    return study.best_params


def _tune_xgb(X: np.ndarray, y: np.ndarray, n_trials: int = 30) -> dict:
    def objective(trial: optuna.Trial) -> float:
        params = {
            **XGB_BASE,
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
            "max_depth": trial.suggest_int("max_depth", 3, 10),
            "n_estimators": trial.suggest_int("n_estimators", 200, 800),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
            "min_child_weight": trial.suggest_float("min_child_weight", 1, 10),
            "reg_alpha": trial.suggest_float("reg_alpha", 0.0, 5.0),
            "reg_lambda": trial.suggest_float("reg_lambda", 0.0, 5.0),
        }
        kf = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_SEED)
        scores = []
        for train_idx, val_idx in kf.split(X, y):
            X_tr, X_val = X[train_idx], X[val_idx]
            y_tr, y_val = y[train_idx], y[val_idx]
            model = xgb.XGBClassifier(**params)
            model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)
            preds = model.predict(X_val)
            scores.append(f1_score(y_val, preds, average="macro"))
        return float(np.mean(scores))

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=n_trials)
    print(f"Best XGB macro F1: {study.best_value:.4f}")
    print(f"Best XGB params: {study.best_params}")
    return study.best_params


def train_lgbm_xgb_oof(
    X_train: pl.DataFrame,
    y_train: np.ndarray,
    X_test: pl.DataFrame,
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
    tune: bool = True,
) -> dict:
    trained_dir.mkdir(parents=True, exist_ok=True)

    X_train_np = X_train.to_numpy()
    X_test_np = X_test.to_numpy()

    lgbm_params = {**LGBM_BASE, **(_tune_lgbm(X_train_np, y_train) if tune else {"learning_rate": 0.05, "num_leaves": 31, "n_estimators": 300, "subsample": 0.8, "colsample_bytree": 0.8, "min_child_samples": 20, "reg_alpha": 0.0, "reg_lambda": 0.0})}
    xgb_params = {**XGB_BASE, **(_tune_xgb(X_train_np, y_train) if tune else {"learning_rate": 0.05, "max_depth": 6, "n_estimators": 300, "subsample": 0.8, "colsample_bytree": 0.8, "min_child_weight": 1, "reg_alpha": 0.0, "reg_lambda": 0.0})}

    kf = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=RANDOM_SEED)

    oof_lgbm_proba = np.zeros((len(X_train), N_CLASSES))
    oof_xgb_proba = np.zeros((len(X_train), N_CLASSES))
    test_lgbm_proba = np.zeros((len(X_test), N_CLASSES))
    test_xgb_proba = np.zeros((len(X_test), N_CLASSES))

    for fold, (train_idx, val_idx) in enumerate(kf.split(X_train_np, y_train)):
        print(f"LGBM/XGB fold {fold + 1}/{N_SPLITS}...")

        X_tr, X_val = X_train_np[train_idx], X_train_np[val_idx]
        y_tr, y_val = y_train[train_idx], y_train[val_idx]

        lgbm = lgb.LGBMClassifier(**lgbm_params)
        lgbm.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(15), lgb.log_evaluation(0)])
        oof_lgbm_proba[val_idx] = lgbm.predict_proba(X_val)
        test_lgbm_proba += lgbm.predict_proba(X_test_np) / N_SPLITS

        xgb_model = xgb.XGBClassifier(**xgb_params)
        xgb_model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)
        oof_xgb_proba[val_idx] = xgb_model.predict_proba(X_val)
        test_xgb_proba += xgb_model.predict_proba(X_test_np) / N_SPLITS

    oof_lgbm_hard = oof_lgbm_proba.argmax(axis=1).astype(np.int8)
    oof_xgb_hard = oof_xgb_proba.argmax(axis=1).astype(np.int8)
    test_lgbm_hard = test_lgbm_proba.argmax(axis=1).astype(np.int8)
    test_xgb_hard = test_xgb_proba.argmax(axis=1).astype(np.int8)

    print("\nLGBM OOF macro F1:", f1_score(y_train, oof_lgbm_hard, average="macro"))
    print("XGB OOF macro F1:", f1_score(y_train, oof_xgb_hard, average="macro"))

    print("Training final models on full train set...")

    final_lgbm = lgb.LGBMClassifier(**lgbm_params)
    final_lgbm.fit(X_train_np, y_train)
    lgbm_path = trained_dir / "lgbm.txt"
    final_lgbm.booster_.save_model(str(lgbm_path))
    print(f"LightGBM model saved to {lgbm_path}")

    final_xgb = xgb.XGBClassifier(**xgb_params)
    final_xgb.fit(X_train_np, y_train)
    xgb_path = trained_dir / "xgb.ubj"
    final_xgb.save_model(str(xgb_path))
    print(f"XGBoost model saved to {xgb_path}")

    np.save(pipeline_dir / "oof_lgbm.npy", oof_lgbm_hard)
    np.save(pipeline_dir / "oof_lgbm_proba.npy", oof_lgbm_proba)
    np.save(pipeline_dir / "oof_xgb.npy", oof_xgb_hard)
    np.save(pipeline_dir / "oof_xgb_proba.npy", oof_xgb_proba)
    np.save(pipeline_dir / "test_preds_lgbm.npy", test_lgbm_hard)
    np.save(pipeline_dir / "test_preds_lgbm_proba.npy", test_lgbm_proba)
    np.save(pipeline_dir / "test_preds_xgb.npy", test_xgb_hard)
    np.save(pipeline_dir / "test_preds_xgb_proba.npy", test_xgb_proba)
    print(f"LGBM/XGB predictions saved to {pipeline_dir}")

    return {
        "oof_lgbm_proba": oof_lgbm_proba,
        "oof_xgb_proba": oof_xgb_proba,
        "test_lgbm_proba": test_lgbm_proba,
        "test_xgb_proba": test_xgb_proba,
    }


def run_lgbm_xgb(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
    tune: bool = True,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    y_train_binned = bin_target(data["y_train"].astype(np.int8))

    result = train_lgbm_xgb_oof(
        X_train=data["X_train_enc"],
        y_train=y_train_binned,
        X_test=data["X_test_enc"],
        pipeline_dir=pipeline_dir,
        trained_dir=trained_dir,
        tune=tune,
    )

    print(f"LGBM OOF proba shape: {result['oof_lgbm_proba'].shape}")
    print(f"XGB OOF proba shape: {result['oof_xgb_proba'].shape}")
    print("LGBM/XGB training complete.")
