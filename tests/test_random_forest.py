"""Unit tests for the Random Forest training pipeline."""

from pathlib import Path

import pandas as pd
import polars as pl
import pytest
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder

from scripts.train_random_forest import calculate_metrics, prepare_split
from src.training import common, random_forest

NUMERIC_FEATURES = ["YearsCodeNum", "ConvertedCompYearly"]
CATEGORICAL_FEATURES = [
    "MainBranch",
    "Employment",
    "EdLevel",
    "Age",
    "OrgSize",
    "Country",
]


@pytest.fixture(autouse=True)
def shared_features(monkeypatch: pytest.MonkeyPatch) -> None:
    """Provide the shared feature contract until the XGBoost PR is merged."""
    monkeypatch.setattr(common, "NUMERIC_FEATURES", NUMERIC_FEATURES, raising=False)
    monkeypatch.setattr(
        common,
        "CATEGORICAL_FEATURES",
        CATEGORICAL_FEATURES,
        raising=False,
    )


@pytest.fixture
def sample_data() -> tuple[pd.DataFrame, pd.Series]:
    """Return a small binary-classification dataset."""
    X = pd.DataFrame(
        {
            "YearsCodeNum": [1, 3, 5, 8, 13, 21, 2, 10],
            "ConvertedCompYearly": [
                30_000,
                38_000,
                45_000,
                60_000,
                78_000,
                95_000,
                34_000,
                70_000,
            ],
            "MainBranch": ["Developer"] * 8,
            "Employment": ["Full-time", "Part-time"] * 4,
            "EdLevel": ["Bachelor", "Master"] * 4,
            "Age": ["25-34", "35-44"] * 4,
            "OrgSize": ["20-99", "100-499"] * 4,
            "Country": ["Spain", "Portugal"] * 4,
        }
    )
    y = pd.Series([0, 0, 0, 1, 1, 1, 0, 1], name="JobSat")
    return X, y


def test_build_pipeline_uses_random_forest_and_does_not_mutate_defaults() -> None:
    defaults_before = random_forest.DEFAULT_PARAMS.copy()
    default_classifier = random_forest.build_pipeline().named_steps["classifier"]

    pipeline = random_forest.build_pipeline(
        {
            "n_estimators": 5,
            "n_jobs": 1,
            "class_weight": None,
            "random_state": 99,
        }
    )

    classifier = pipeline.named_steps["classifier"]
    assert isinstance(classifier, RandomForestClassifier)
    assert classifier.n_estimators == 5
    assert classifier.class_weight == "balanced"
    assert classifier.random_state == 42
    assert default_classifier.n_estimators == 300
    assert default_classifier.max_depth == 12
    assert default_classifier.min_samples_leaf == 5
    assert default_classifier.min_samples_split == 10
    assert default_classifier.max_features == "sqrt"
    assert default_classifier.bootstrap is True
    assert default_classifier.max_samples == 0.75
    assert default_classifier.ccp_alpha == 0.0
    assert default_classifier.class_weight == "balanced"
    assert default_classifier.random_state == 42
    assert default_classifier.n_jobs == -1
    assert random_forest.DEFAULT_PARAMS == defaults_before


def test_preprocessor_uses_one_hot_encoding() -> None:
    preprocessor = random_forest.build_preprocessor()
    numeric_pipeline = preprocessor.transformers[0][1]
    categorical_pipeline = preprocessor.transformers[1][1]
    numeric_imputer = numeric_pipeline.named_steps["imputer"]
    categorical_imputer = categorical_pipeline.named_steps["imputer"]
    encoder = categorical_pipeline.named_steps["encoder"]

    assert numeric_imputer.strategy == "median"
    assert categorical_imputer.strategy == "constant"
    assert categorical_imputer.fill_value == "missing"
    assert isinstance(encoder, OneHotEncoder)
    assert encoder.handle_unknown == "ignore"


def test_train_predict_and_save(
    sample_data: tuple[pd.DataFrame, pd.Series],
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    X, y = sample_data
    pipeline = random_forest.train(
        X,
        y,
        {"n_estimators": 10, "n_jobs": 1, "max_samples": None},
    )

    predictions = pipeline.predict(X)
    monkeypatch.setattr(random_forest, "PIPELINES_DIR", tmp_path)
    output_path = random_forest.save(pipeline)

    assert predictions.shape == (len(X),)
    assert set(predictions).issubset({0, 1})
    assert output_path == tmp_path / "random_forest_pipeline.joblib"
    assert output_path.exists()


def test_prepare_split_uses_project_target_threshold() -> None:
    frame = pl.DataFrame(
        {
            **{
                feature: [1.0, 2.0]
                for feature in NUMERIC_FEATURES
            },
            **{
                feature: ["category-a", "category-b"]
                for feature in CATEGORICAL_FEATURES
            },
            "JobSat": [6, 7],
        }
    )

    X, y = prepare_split(frame)

    assert list(X.columns) == NUMERIC_FEATURES + CATEGORICAL_FEATURES
    assert y.tolist() == [0, 1]


def test_calculate_metrics_returns_all_required_metrics(
    sample_data: tuple[pd.DataFrame, pd.Series],
) -> None:
    X, y = sample_data
    pipeline = random_forest.train(
        X,
        y,
        {"n_estimators": 10, "n_jobs": 1, "max_samples": None},
    )

    metrics, matrix = calculate_metrics(pipeline, X, y)

    assert set(metrics) == {
        "accuracy",
        "balanced_accuracy",
        "precision",
        "recall",
        "f1",
        "f1_macro",
        "roc_auc",
    }
    assert all(0.0 <= value <= 1.0 for value in metrics.values())
    assert matrix.shape == (2, 2)
    assert matrix.sum() == len(y)
