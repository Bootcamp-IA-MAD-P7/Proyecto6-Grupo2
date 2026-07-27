from pathlib import Path

import polars as pl

SPLITS_DIR = Path("data/processed/splits")

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
TARGET = "JobSat"
JOBSAT_THRESHOLD = 7


def load_splits() -> tuple[pl.DataFrame, pl.DataFrame, pl.DataFrame]:
    train = pl.read_parquet(SPLITS_DIR / "train.parquet")
    dev = pl.read_parquet(SPLITS_DIR / "dev.parquet")
    test = pl.read_parquet(SPLITS_DIR / "test.parquet")
    return train, dev, test


def binarize_target(df: pl.DataFrame) -> pl.DataFrame:
    return df.with_columns(
        (pl.col(TARGET) >= JOBSAT_THRESHOLD).cast(pl.Int8).alias(TARGET)
    )


def split_xy(df: pl.DataFrame) -> tuple[pl.DataFrame, pl.Series]:
    X = df.select(FEATURES)
    y = df[TARGET]
    return X, y
