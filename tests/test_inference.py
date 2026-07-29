from unittest.mock import MagicMock

import numpy as np
import pytest

from src.inference.predict import predict_single
from src.training.common import FEATURES


def make_mock_pipeline(prediction: int, probabilities: list[float]) -> MagicMock:
    pipeline = MagicMock()
    pipeline.predict.return_value = np.array([prediction])
    pipeline.predict_proba.return_value = np.array([probabilities])
    return pipeline


VALID_INPUT = {f: ("val" if i >= 2 else 1.0) for i, f in enumerate(FEATURES)}


def test_predict_single_binary_satisfied():
    pipeline = make_mock_pipeline(1, [0.3, 0.7])
    result = predict_single(pipeline, VALID_INPUT, binary=True)
    assert result["prediction"] == 1
    assert result["label"] == "satisfied"
    assert 0.0 <= result["probability_satisfied"] <= 1.0
    assert 0.0 <= result["probability_not_satisfied"] <= 1.0


def test_predict_single_binary_not_satisfied():
    pipeline = make_mock_pipeline(0, [0.8, 0.2])
    result = predict_single(pipeline, VALID_INPUT, binary=True)
    assert result["prediction"] == 0
    assert result["label"] == "not_satisfied"


def test_predict_single_multiclass():
    pipeline = make_mock_pipeline(2, [0.1, 0.3, 0.6])
    result = predict_single(pipeline, VALID_INPUT, binary=False)
    assert result["prediction"] == 2
    assert result["label"] == "high"
    assert "probability_low" in result
    assert "probability_medium" in result
    assert "probability_high" in result


def test_predict_single_missing_features():
    pipeline = make_mock_pipeline(1, [0.4, 0.6])
    incomplete = {k: v for k, v in VALID_INPUT.items() if k != "Country"}
    with pytest.raises(ValueError, match="Missing features"):
        predict_single(pipeline, incomplete, binary=True)
