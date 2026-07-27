import numpy as np
from pathlib import Path
from sklearn.linear_model import Ridge
from sklearn.metrics import root_mean_squared_error
from safetensors.numpy import save_file, load_file
from src.data.cat_lgbm_xgb.preprocessing import PIPELINE_DIR, load_pipeline

TRAINED_DIR = Path("models/trained")
RANDOM_SEED = 42
RIDGE_PARAMS = {
    "alpha": 1.0,
    "fit_intercept": True,
}


def load_oof_predictions(
    pipeline_dir: Path,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    oof_catboost: np.ndarray = np.load(pipeline_dir / "oof_catboost.npy")
    oof_lgbm: np.ndarray = np.load(pipeline_dir / "oof_lgbm.npy")
    oof_xgb: np.ndarray = np.load(pipeline_dir / "oof_xgb.npy")
    oof_stack: np.ndarray = np.column_stack([oof_catboost, oof_lgbm, oof_xgb])
    return oof_stack, oof_catboost, oof_lgbm, oof_xgb


def load_test_predictions(pipeline_dir: Path) -> np.ndarray:
    test_catboost: np.ndarray = np.load(pipeline_dir / "test_preds_catboost.npy")
    test_lgbm: np.ndarray = np.load(pipeline_dir / "test_preds_lgbm.npy")
    test_xgb: np.ndarray = np.load(pipeline_dir / "test_preds_xgb.npy")
    return np.column_stack([test_catboost, test_lgbm, test_xgb])


def load_dev_predictions(data: dict, trained_dir: Path) -> np.ndarray:
    from catboost import CatBoostRegressor, Pool
    import lightgbm as lgb
    import xgboost as xgb
    from src.data.cat_lgbm_xgb.preprocessing import CATEGORICAL_COLS

    catboost_model = CatBoostRegressor()
    catboost_model.load_model(str(trained_dir / "catboost.cbm"))
    X_dev_pd = data["X_dev"].to_pandas()
    dev_pool = Pool(X_dev_pd, cat_features=CATEGORICAL_COLS)
    dev_catboost: np.ndarray = catboost_model.predict(dev_pool)

    lgbm_model = lgb.Booster(model_file=str(trained_dir / "lgbm.txt"))
    X_dev_enc_np = data["X_dev_enc"].to_numpy()
    dev_catboost: np.ndarray = np.asarray(catboost_model.predict(dev_pool))

    lgbm_model = lgb.Booster(model_file=str(trained_dir / "lgbm.txt"))
    X_dev_enc_np = data["X_dev_enc"].to_numpy()
    dev_lgbm: np.ndarray = np.asarray(lgbm_model.predict(X_dev_enc_np))

    xgb_model = xgb.XGBRegressor()
    xgb_model.load_model(str(trained_dir / "xgb.ubj"))
    dev_xgb: np.ndarray = np.asarray(xgb_model.predict(X_dev_enc_np))

    return np.column_stack([dev_catboost, dev_lgbm, dev_xgb])


def save_ridge(model: Ridge, trained_dir: Path) -> None:
    trained_dir.mkdir(parents=True, exist_ok=True)
    tensors = {
        "coef": model.coef_.astype(np.float32),
        "intercept": np.array([model.intercept_], dtype=np.float32),
    }
    save_file(tensors, str(trained_dir / "ridge_meta.safetensors"))
    print(f"Ridge meta-model saved to {trained_dir / 'ridge_meta.safetensors'}")


def load_ridge(trained_dir: Path) -> Ridge:
    tensors = load_file(str(trained_dir / "ridge_meta.safetensors"))
    model = Ridge()
    model.coef_ = tensors["coef"].astype(np.float64)
    model.intercept_ = tensors["intercept"][0].astype(np.float64)
    return model


def run_ensemble(
    pipeline_dir: Path = PIPELINE_DIR,
    trained_dir: Path = TRAINED_DIR,
) -> None:
    print("Loading pipeline...")
    data = load_pipeline(pipeline_dir)

    print("Loading OOF predictions...")
    oof_stack, oof_catboost, oof_lgbm, oof_xgb = load_oof_predictions(pipeline_dir)
    y_train = data["y_train"]

    print("Individual OOF RMSEs:")
    print(f"  CatBoost : {root_mean_squared_error(y_train, oof_catboost):.4f}")
    print(f"  LGBM     : {root_mean_squared_error(y_train, oof_lgbm):.4f}")
    print(f"  XGBoost  : {root_mean_squared_error(y_train, oof_xgb):.4f}")

    print("Training Ridge meta-model on OOF stack...")
    ridge = Ridge(**RIDGE_PARAMS)
    ridge.fit(oof_stack, y_train)
    print(f"Ridge coefficients: {ridge.coef_}")
    print(f"Ridge intercept: {ridge.intercept_:.4f}")

    print("Saving Ridge meta-model...")
    save_ridge(ridge, trained_dir)

    print("Evaluating on dev set...")
    dev_stack = load_dev_predictions(data, trained_dir)
    y_dev = data["y_dev"]

    dev_preds = ridge.predict(dev_stack)
    dev_rmse = root_mean_squared_error(y_dev, dev_preds)
    print(f"Dev RMSE (ensemble): {dev_rmse:.4f}")

    print("Generating test predictions...")
    test_stack = load_test_predictions(pipeline_dir)
    test_preds = ridge.predict(test_stack)
    np.save(pipeline_dir / "test_preds_ensemble.npy", test_preds)
    print(
        f"Ensemble test predictions saved to {pipeline_dir / 'test_preds_ensemble.npy'}"
    )

    print("Ensemble complete.")
