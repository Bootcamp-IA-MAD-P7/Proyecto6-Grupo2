from pathlib import Path

import polars as pl
from sklearn.base import BaseEstimator, TransformerMixin

SPLITS_DIR = Path("data/processed/splits")
TARGET = "JobSat"

NUMERIC_FEATURES = [
    "YearsCodeNum",
    "ConvertedCompYearly",
]

CATEGORICAL_FEATURES = [
    "MainBranch",
    "Employment",
    "EdLevel",
    "Age",
    "OrgSize",
    "Country",
]

FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


class PolarsToPandas(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if isinstance(X, pl.DataFrame):
            return X.to_pandas()
        return X


def bin_jobsat(frame: pl.DataFrame) -> pl.DataFrame:
    return frame.with_columns(
        pl.when(pl.col(TARGET) <= 3).then(0)
        .when(pl.col(TARGET) <= 6).then(1)
        .otherwise(2)
        .cast(pl.Int8)
        .alias(TARGET)
    )


def bin_jobsat_binary(frame: pl.DataFrame) -> pl.DataFrame:
    return frame.with_columns(
        (pl.col(TARGET) >= 7).cast(pl.Int8).alias(TARGET)
    )
