from pathlib import Path
import polars as pl

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


def bin_jobsat(frame: pl.DataFrame) -> pl.DataFrame:
    return frame.with_columns(
        pl.when(pl.col(TARGET) <= 3).then(0)
        .when(pl.col(TARGET) <= 6).then(1)
        .otherwise(2)
        .cast(pl.Int8)
        .alias(TARGET)
    )
