import polars as pl
from sklearn.pipeline import Pipeline

from src.training.common import FEATURES

LABEL_MAP_BINARY = {0: "not_satisfied", 1: "satisfied"}
LABEL_MAP_MULTICLASS = {0: "low", 1: "medium", 2: "high"}


def predict_single(pipeline: Pipeline, input_data: dict, binary: bool = True) -> dict:
    missing = [f for f in FEATURES if f not in input_data]
    if missing:
        raise ValueError(f"Missing features: {missing}")

    X = pl.DataFrame({f: [input_data[f]] for f in FEATURES}).to_pandas()
    probabilities = pipeline.predict_proba(X)[0]
    prediction = int(probabilities.argmax())

    if binary:
        return {
            "prediction": prediction,
            "label": LABEL_MAP_BINARY[prediction],
            "probability_not_satisfied": round(float(probabilities[0]), 4),
            "probability_satisfied": round(float(probabilities[1]), 4),
        }
    else:
        return {
            "prediction": prediction,
            "label": LABEL_MAP_MULTICLASS[prediction],
            "probability_low": round(float(probabilities[0]), 4),
            "probability_medium": round(float(probabilities[1]), 4),
            "probability_high": round(float(probabilities[2]), 4),
        }
