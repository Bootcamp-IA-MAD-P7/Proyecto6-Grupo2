from functools import lru_cache

from sklearn.pipeline import Pipeline

from src.inference.load_pipeline import load_rf_pipeline


@lru_cache(maxsize=1)
def get_pipeline() -> Pipeline:
    return load_rf_pipeline(binary=True)
