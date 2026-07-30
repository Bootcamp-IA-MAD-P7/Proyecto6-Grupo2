import os
from functools import lru_cache
from pathlib import Path

import polars as pl

CLEAN_PARQUET = (
    Path(__file__).resolve().parents[2]
    / "data/processed/merged_survey_2024_2025_clean.parquet"
)

DATABASE_URL = os.getenv("DATABASE_URL", "")
TABLE_NAME = "survey_responses"


@lru_cache(maxsize=1)
def _load_data() -> pl.DataFrame:
    if DATABASE_URL:
        try:
            from sqlalchemy import create_engine

            engine = create_engine(DATABASE_URL)
            return pl.read_database(f"SELECT * FROM {TABLE_NAME}", engine)
        except Exception as e:
            print(f"[DB] Failed to read from database, falling back to parquet: {e}")

    if not CLEAN_PARQUET.exists():
        raise FileNotFoundError(f"Dataset not found at {CLEAN_PARQUET}.")
    return pl.read_parquet(CLEAN_PARQUET)


def _rate_by_group(frame: pl.DataFrame, group_col: str) -> list[dict]:
    return (
        frame.group_by(group_col)
        .agg(
            (pl.col("JobSat") < 7).mean().alias("rate"),
            pl.len().alias("count"),
        )
        .sort("rate", descending=True)
        .select(
            pl.col(group_col).alias("id"),
            (pl.col("rate") * 100).round(1).alias("rate"),
            "count",
        )
        .to_dicts()
    )


def _bin_experience(frame: pl.DataFrame) -> pl.DataFrame:
    return frame.with_columns(
        pl.when(pl.col("YearsCodeNum") <= 2).then(pl.lit("0-2"))
        .when(pl.col("YearsCodeNum") <= 5).then(pl.lit("3-5"))
        .when(pl.col("YearsCodeNum") <= 10).then(pl.lit("6-10"))
        .otherwise(pl.lit("11-plus"))
        .alias("exp_bin")
    )


def _bin_salary(frame: pl.DataFrame) -> pl.DataFrame:
    return frame.with_columns(
        pl.when(pl.col("ConvertedCompYearly") < 30_000).then(pl.lit("under-30"))
        .when(pl.col("ConvertedCompYearly") < 60_000).then(pl.lit("30-60"))
        .when(pl.col("ConvertedCompYearly") < 100_000).then(pl.lit("60-100"))
        .otherwise(pl.lit("over-100"))
        .alias("sal_bin")
    )


@lru_cache(maxsize=1)
def compute_segment_rates() -> dict[str, list[dict]]:
    df = _load_data()
    segments: dict[str, list[dict]] = {}

    direct_mappings = [
        ("age", "Age"),
        ("education", "EdLevel"),
        ("employment", "Employment"),
        ("companySize", "OrgSize"),
        ("country", "Country"),
        ("professionalRole", "MainBranch"),
    ]
    for key, col in direct_mappings:
        if col in df.columns:
            segments[key] = _rate_by_group(df, col)

    exp_df = _bin_experience(df)
    segments["experience"] = _rate_by_group(exp_df, "exp_bin")

    sal_df = _bin_salary(df)
    segments["salary"] = _rate_by_group(sal_df, "sal_bin")

    return segments


@lru_cache(maxsize=1)
def compute_overview_metrics() -> dict:
    df = _load_data()
    total = len(df)
    lower_sat = (df["JobSat"] < 7).sum()
    return {
        "total_profiles": total,
        "lower_satisfaction_profiles": int(lower_sat),
        "lower_satisfaction_rate": round(float(lower_sat / total * 100), 1),
        "median_salary_usd": round(float(df["ConvertedCompYearly"].median()), 0),
        "median_years_code": round(float(df["YearsCodeNum"].median()), 1),
    }
