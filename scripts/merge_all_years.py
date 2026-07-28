import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import polars as pl
from utils.load_raw_data import RawData

YEARS = [2021, 2022, 2023, 2024, 2025]


def merge_all() -> pl.DataFrame:
    frames = []
    for year in YEARS:
        df = RawData(year=year).download()
        df = df.with_columns(pl.lit(year).alias("Year").cast(pl.Int16))
        frames.append(df)

    all_cols = set(frames[0].columns)
    for f in frames[1:]:
        all_cols &= set(f.columns)
    all_cols = sorted(all_cols)
    print(f"Common columns across {YEARS} ({len(all_cols)}): {all_cols}")

    for i, f in enumerate(frames):
        for c in all_cols:
            if c not in f.columns:
                frames[i] = frames[i].with_columns(pl.lit(None).alias(c))
        frames[i] = frames[i].select(all_cols)

    for i, f in enumerate(frames):
        frames[i] = f.select(all_cols).cast({c: pl.String for c in all_cols})

    return pl.concat(frames)


def clean(df: pl.DataFrame) -> pl.DataFrame:
    df = df.with_columns(
        pl.col("YearsCode")
        .cast(pl.String, strict=False)
    )

    df = df.with_columns(
        pl.when(pl.col("YearsCode") == "Less than 1 year")
        .then(pl.lit("0"))
        .when(pl.col("YearsCode") == "More than 50 years")
        .then(pl.lit("50"))
        .when(pl.col("YearsCode") == "None")
        .then(pl.lit(None))
        .otherwise(pl.col("YearsCode"))
        .cast(pl.Float64, strict=False)
        .alias("YearsCodeNum")
    )

    df = df.with_columns(
        pl.col("Age")
        .cast(pl.String, strict=False)
        .str.replace(" years old", "")
        .str.replace(" or older", "+")
        .alias("AgeClean")
    )

    df = df.with_columns(
        pl.col("ConvertedCompYearly")
        .cast(pl.Float64, strict=False)
    )

    df = df.with_columns(
        pl.col("CompTotal")
        .cast(pl.Float64, strict=False)
    )

    df = df.with_columns(
        pl.when(pl.col("ConvertedCompYearly").is_not_null())
        .then(pl.col("ConvertedCompYearly"))
        .otherwise(pl.col("CompTotal"))
        .alias("Compensation")
    )

    df = df.with_columns(
        pl.when(pl.col("Compensation") <= 30000)
        .then(pl.lit("Bajo"))
        .when(pl.col("Compensation") <= 75000)
        .then(pl.lit("Medio"))
        .when(pl.col("Compensation") <= 150000)
        .then(pl.lit("Alto"))
        .when(pl.col("Compensation").is_not_null())
        .then(pl.lit("Muy alto"))
        .otherwise(pl.lit(None))
        .alias("SalaryRange")
    )

    df = df.with_columns(
        pl.col("Employment")
        .cast(pl.String, strict=False)
    )

    df = df.with_columns(
        pl.when(pl.col("Employment").str.contains("Employed, full-time", literal=True))
        .then(pl.lit("Employed full-time"))
        .when(pl.col("Employment").str.contains("Employed, part-time", literal=True))
        .then(pl.lit("Employed part-time"))
        .when(pl.col("Employment").str.contains("Independent contractor|freelancer|self-employed", literal=False))
        .then(pl.lit("Freelancer/Self-employed"))
        .when(pl.col("Employment").str.contains("Not employed, but looking", literal=True))
        .then(pl.lit("Unemployed looking"))
        .when(pl.col("Employment").str.contains("Not employed, and not looking", literal=True))
        .then(pl.lit("Unemployed not looking"))
        .when(pl.col("Employment").str.contains("Student", literal=True))
        .then(pl.lit("Student"))
        .otherwise(pl.col("Employment"))
        .alias("EmploymentClean")
    )

    df = df.with_columns(
        pl.col("DevType")
        .cast(pl.String, strict=False)
        .str.split(";")
        .list.first()
        .str.strip_chars()
        .alias("DevTypePrimary")
    )

    df = df.with_columns(
        pl.col("MainBranch")
        .cast(pl.String, strict=False)
    )

    df = df.drop_nulls(subset=["YearsCode"])

    return df


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    output_dir = root / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)

    print("Merging all years...")
    df = merge_all()
    print(f"Merged: {df.shape}")
    df.write_parquet(str(output_dir / "merged_survey_2021_2025.parquet"))

    print("Cleaning...")
    clean_df = clean(df)
    print(f"Cleaned: {clean_df.shape}")

    clean_df.write_parquet(str(output_dir / "merged_survey_2021_2025_clean.parquet"))

    for col in ["SalaryRange", "EmploymentClean", "DevTypePrimary"]:
        dist = clean_df[col].value_counts().sort("count", descending=True).head(10)
        print(f"\n{col}:")
        for row in dist.iter_rows(named=True):
            print(f"  {row[col]}: {row['count']}")

    print("\nDone.")
