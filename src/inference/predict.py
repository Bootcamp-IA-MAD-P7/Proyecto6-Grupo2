import polars as pl
from sklearn.pipeline import Pipeline

from src.training.common import FEATURES

LABEL_MAP = {0: "low", 1: "medium", 2: "high"}


def predict_single(pipeline: Pipeline, input_data: dict) -> dict:
    missing = [f for f in FEATURES if f not in input_data]
    if missing:
        raise ValueError(f"Missing features: {missing}")

    X = pl.DataFrame({f: [input_data[f]] for f in FEATURES}).to_pandas()
    prediction = int(pipeline.predict(X)[0])
    probabilities = pipeline.predict_proba(X)[0]

    return {
        "prediction": prediction,
        "label": LABEL_MAP[prediction],
        "probability_low": round(float(probabilities[0]), 4),
        "probability_medium": round(float(probabilities[1]), 4),
        "probability_high": round(float(probabilities[2]), 4),
    }
