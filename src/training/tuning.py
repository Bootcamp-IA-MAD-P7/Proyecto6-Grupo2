import optuna
import pandas as pd
from sklearn.metrics import roc_auc_score

from src.training.common import binarize_target, load_splits, split_xy
from src.training.xgboost import build_pipeline, save

optuna.logging.set_verbosity(optuna.logging.WARNING)

N_TRIALS = 50


def _objective(trial: optuna.Trial, X_train, y_train, X_dev, y_dev) -> float:
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 100, 500),
        "max_depth": trial.suggest_int("max_depth", 3, 9),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "subsample": trial.suggest_float("subsample", 0.6, 1.0),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
        "scale_pos_weight": trial.suggest_float("scale_pos_weight", 0.3, 2.0),
    }
    pipeline = build_pipeline(params)
    pipeline.fit(X_train, y_train)
    y_prob = pipeline.predict_proba(X_dev)[:, 1]
    return roc_auc_score(y_dev, y_prob)


def tune(n_trials: int = N_TRIALS) -> dict:
    train_df, dev_df, _ = load_splits()
    train_df = binarize_target(train_df)
    dev_df = binarize_target(dev_df)

    X_train, y_train = split_xy(train_df)
    X_dev, y_dev = split_xy(dev_df)

    X_train = X_train.to_pandas()
    y_train = y_train.to_pandas()
    X_dev = X_dev.to_pandas()
    y_dev = y_dev.to_pandas()

    study = optuna.create_study(direction="maximize")
    study.optimize(
        lambda trial: _objective(trial, X_train, y_train, X_dev, y_dev),
        n_trials=n_trials,
        show_progress_bar=True,
    )

    print(f"Best ROC-AUC: {study.best_value:.4f}")
    print(f"Best params: {study.best_params}")
    return study.best_params


def tune_and_save(n_trials: int = N_TRIALS) -> None:
    best_params = tune(n_trials)

    train_df, dev_df, _ = load_splits()
    train_df = binarize_target(train_df)
    dev_df = binarize_target(dev_df)

    X_train, y_train = split_xy(train_df)
    X_dev, y_dev = split_xy(dev_df)

    # Retrain on train+dev combined with best params
    X_all = pd.concat([X_train.to_pandas(), X_dev.to_pandas()])
    y_all = pd.concat([y_train.to_pandas(), y_dev.to_pandas()])

    pipeline = build_pipeline(best_params)
    pipeline.fit(X_all, y_all)
    save(pipeline, name="xgboost_tuned")


if __name__ == "__main__":
    tune_and_save()
