"""OOF training for the LightGBM and Random Forest ensemble members."""

from pathlib import Path
from typing import Any

import joblib
import numpy as np
import polars as pl
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score
from sklearn.model_selection import StratifiedKFold

from src.data.cat_lgbm_xgb.preprocessing import (
    PIPELINE_DIR,
    bin_target,
    load_pipeline,
)

TRAINED_DIR = Path("models/trained")
N_SPLITS = 5
N_CLASSES = 3
RANDOM_SEED = 42

LGBM_BASE: dict[str, Any] = {
    "objective": "multiclass",
    "num_class": N_CLASSES,
    "random_state": RANDOM_SEED,
    "verbose": -1,
}

LGBM_DEFAULTS: dict[str, Any] = {
    "learning_rate": 0.05,
    "num_leaves": 31,
    "n_estimators": 300,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "min_child_samples": 20,
    "reg_alpha": 0.0,
    "reg_lambda": 0.0,
}

RF_PARAMS: dict[str, Any] = {
    "n_estimators": 400,
    "max_depth": 16,
    "min_samples_split": 10,
    "min_samples_leaf": 4,
    "max_features": "sqrt",
    "class_weight": "balanced_subsample",
    "random_state": RANDOM_SEED,
    "n_jobs": -1,
}


def _aligned_proba(
    model: RandomForestClassifier,
    X: np.ndarray,
) -> np.ndarray:
    """Return probabilities with stable columns for classes 0, 1 and 2."""
    raw = model.predict_proba(X)
    aligned = np.zeros((len(X), N_CLASSES), dtype=float)
    for source_index, class_label in enumerate(model.classes_):
        aligned[:, int(class_label)] = raw[:, source_index]
    return aligned


def _tune_lgbm(
    X: np.ndarray,
    y: np.ndarray,
    n_trials: int = 30,
) -> dict[str, Any]:
    import lightgbm as lgb
    import optuna

    def objective(trial: optuna.Trial) -> float:
        params = {
            **LGBM_BASE,
            "learning_rate": trial.suggest_float(
                "learning_rate", 0.01, 0.2, log=True
            ),
            "num_leaves": trial.suggest_int("num_leaves", 15, 127),
            "n_estimators": trial.suggest_int("n_estimators", 200, 800),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float(
                "colsample_bytree", 0.6, 1.0
            ),
            "min_child_samples": trial.suggest_int("min_child_samples", 5, 50),
            "reg_alpha": trial.suggest_float("reg_alpha", 0.0, 5.0),
            "reg_lambda": trial.suggest_float("reg_lambda", 0.0, 5.0),
        }
        folds = StratifiedKFold(
            n_splits=3,
            shuffle=True,
            random_state=RANDOM_SEED,
        )
        scores: list[float] = []
        for train_index, validation_index in folds.split(X, y):
            model = lgb.LGBMClassifier(**params)
            model.fit(
                X[train_index],
                y[train_index],
                eval_X=X[validation_index],
                eval_y=y[validation_index],
                callbacks=[lgb.early_stopping(15), lgb.log_evaluation(0)],
            )
            predictions = model.predict(X[validation_index])
            scores.append(
                f1_score(
                    y[validation_index],
                    predictions,
                    average="macro",
                )
            )
        return float(np.mean(scores))

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=n_trials)
    print(f"Best LightGBM macro F1: {study.best_value:.4f}")
    print(f"Best LightGBM params: {study.best_params}")
    return dict(study.best_params)


def train_lgbm_random_forest_oof(
    X_train: pl.DataFrame,
    y_train: np.ndarray,
    X_test: pl.DataFrame,
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
    *,
    tune_lgbm: bool = False,
    tuning_trials: int = 30,
    n_splits: int = N_SPLITS,
) -> dict[str, np.ndarray]:
    """Train diverse ensemble members and persist OOF/test probabilities."""
    import lightgbm as lgb

    trained_dir.mkdir(parents=True, exist_ok=True)
    pipeline_dir.mkdir(parents=True, exist_ok=True)

    X_train_array = X_train.to_numpy()
    X_test_array = X_test.to_numpy()
    y_train = np.asarray(y_train, dtype=np.int8)

    lgbm_params = {
        **LGBM_BASE,
        **(
            _tune_lgbm(X_train_array, y_train, tuning_trials)
            if tune_lgbm
            else LGBM_DEFAULTS
        ),
    }

    folds = StratifiedKFold(
        n_splits=n_splits,
        shuffle=True,
        random_state=RANDOM_SEED,
    )
    oof_lgbm = np.zeros((len(X_train_array), N_CLASSES), dtype=float)
    oof_rf = np.zeros((len(X_train_array), N_CLASSES), dtype=float)
    test_lgbm = np.zeros((len(X_test_array), N_CLASSES), dtype=float)
    test_rf = np.zeros((len(X_test_array), N_CLASSES), dtype=float)

    for fold, (train_index, validation_index) in enumerate(
        folds.split(X_train_array, y_train),
        start=1,
    ):
        print(f"LightGBM/Random Forest fold {fold}/{n_splits}...")
        X_fold_train = X_train_array[train_index]
        X_fold_validation = X_train_array[validation_index]
        y_fold_train = y_train[train_index]
        y_fold_validation = y_train[validation_index]

        lgbm_model = lgb.LGBMClassifier(**lgbm_params)
        lgbm_model.fit(
            X_fold_train,
            y_fold_train,
            eval_X=X_fold_validation,
            eval_y=y_fold_validation,
            callbacks=[lgb.early_stopping(15), lgb.log_evaluation(0)],
        )
        oof_lgbm[validation_index] = lgbm_model.predict_proba(
            X_fold_validation
        )
        test_lgbm += lgbm_model.predict_proba(X_test_array) / n_splits

        rf_model = RandomForestClassifier(**RF_PARAMS)
        rf_model.fit(X_fold_train, y_fold_train)
        oof_rf[validation_index] = _aligned_proba(
            rf_model,
            X_fold_validation,
        )
        test_rf += _aligned_proba(rf_model, X_test_array) / n_splits

    print(
        "LightGBM OOF macro F1:",
        f1_score(y_train, oof_lgbm.argmax(axis=1), average="macro"),
    )
    print(
        "Random Forest OOF macro F1:",
        f1_score(y_train, oof_rf.argmax(axis=1), average="macro"),
    )

    final_lgbm = lgb.LGBMClassifier(**lgbm_params)
    final_lgbm.fit(X_train_array, y_train)
    final_lgbm.booster_.save_model(str(trained_dir / "lgbm.txt"))

    final_rf = RandomForestClassifier(**RF_PARAMS)
    final_rf.fit(X_train_array, y_train)
    joblib.dump(final_rf, trained_dir / "random_forest_ensemble.joblib")

    outputs = {
        "oof_lgbm_proba": oof_lgbm,
        "oof_random_forest_proba": oof_rf,
        "test_preds_lgbm_proba": test_lgbm,
        "test_preds_random_forest_proba": test_rf,
    }
    for name, values in outputs.items():
        np.save(pipeline_dir / f"{name}.npy", values)

    return outputs


def run_lgbm_random_forest(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
    *,
    tune_lgbm: bool = False,
    tuning_trials: int = 30,
) -> None:
    data = load_pipeline(pipeline_dir)
    y_train = bin_target(data["y_train"].astype(np.int8))
    train_lgbm_random_forest_oof(
        X_train=data["X_train_enc"],
        y_train=y_train,
        X_test=data["X_test_enc"],
        pipeline_dir=pipeline_dir,
        trained_dir=trained_dir,
        tune_lgbm=tune_lgbm,
        tuning_trials=tuning_trials,
    )


if __name__ == "__main__":
    run_lgbm_random_forest()
