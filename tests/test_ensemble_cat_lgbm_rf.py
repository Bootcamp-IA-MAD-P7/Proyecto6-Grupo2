import numpy as np
import polars as pl
import pytest

from src.training.ensemble_cat_lgbm_rf import (
    N_CLASSES,
    stack_probabilities,
    train_meta_model,
)
from src.training import lgbm_random_forest
from src.training.lgbm_random_forest import _aligned_proba
from src.data.cat_lgbm_xgb.preprocessing import bin_target


def test_stack_probabilities_concatenates_three_models() -> None:
    catboost = np.full((4, N_CLASSES), 0.1)
    lightgbm = np.full((4, N_CLASSES), 0.2)
    random_forest = np.full((4, N_CLASSES), 0.3)

    result = stack_probabilities(catboost, lightgbm, random_forest)

    assert result.shape == (4, 9)
    np.testing.assert_array_equal(result[:, :3], catboost)
    np.testing.assert_array_equal(result[:, 3:6], lightgbm)
    np.testing.assert_array_equal(result[:, 6:], random_forest)


def test_stack_probabilities_rejects_incompatible_shape() -> None:
    with pytest.raises(ValueError, match="probability matrix"):
        stack_probabilities(
            np.ones((4, N_CLASSES)),
            np.ones((3, N_CLASSES)),
        )


def test_meta_model_can_fit_three_class_probabilities() -> None:
    y = np.tile(np.arange(N_CLASSES), 6)
    probabilities = np.full((len(y), N_CLASSES), 0.05)
    probabilities[np.arange(len(y)), y] = 0.9
    stacked = stack_probabilities(
        probabilities,
        probabilities,
        probabilities,
    )

    model = train_meta_model(stacked, y)

    np.testing.assert_array_equal(model.predict(stacked), y)


def test_random_forest_probability_alignment() -> None:
    class StubModel:
        classes_ = np.array([0, 2])

        def predict_proba(self, X: np.ndarray) -> np.ndarray:
            return np.tile([0.25, 0.75], (len(X), 1))

    result = _aligned_proba(StubModel(), np.zeros((2, 1)))

    np.testing.assert_allclose(
        result,
        [[0.25, 0.0, 0.75], [0.25, 0.0, 0.75]],
    )


def test_bin_target_supports_raw_and_prebinned_values() -> None:
    np.testing.assert_array_equal(
        bin_target(np.array([1, 4, 6, 7, 10])),
        [0, 1, 1, 2, 2],
    )
    np.testing.assert_array_equal(
        bin_target(np.array([0, 1, 2])),
        [0, 1, 2],
    )


def test_lgbm_random_forest_oof_smoke(
    tmp_path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    rng = np.random.default_rng(42)
    y_train = np.tile(np.arange(N_CLASSES), 12).astype(np.int8)
    X_train = pl.DataFrame(
        {
            "feature_a": rng.normal(size=len(y_train)),
            "feature_b": rng.normal(size=len(y_train)),
            "feature_c": y_train + rng.normal(scale=0.1, size=len(y_train)),
        }
    )
    X_test = X_train.head(6)
    monkeypatch.setitem(
        lgbm_random_forest.LGBM_DEFAULTS,
        "n_estimators",
        10,
    )
    monkeypatch.setitem(
        lgbm_random_forest.RF_PARAMS,
        "n_estimators",
        10,
    )

    outputs = lgbm_random_forest.train_lgbm_random_forest_oof(
        X_train,
        y_train,
        X_test,
        pipeline_dir=tmp_path / "pipelines",
        trained_dir=tmp_path / "trained",
        n_splits=3,
    )

    assert outputs["oof_lgbm_proba"].shape == (len(X_train), N_CLASSES)
    assert outputs["oof_random_forest_proba"].shape == (
        len(X_train),
        N_CLASSES,
    )
    assert outputs["test_preds_lgbm_proba"].shape == (len(X_test), N_CLASSES)
    assert outputs["test_preds_random_forest_proba"].shape == (
        len(X_test),
        N_CLASSES,
    )
    assert (tmp_path / "trained" / "lgbm.txt").exists()
    assert (
        tmp_path / "trained" / "random_forest_ensemble.joblib"
    ).exists()
