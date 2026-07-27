import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import polars as pl
from utils.load_raw_data import RawData

COMMON_COLUMNS = [
    "MainBranch",
    "Employment",
    "Country",
    "EdLevel",
    "Age",
    "YearsCode",
    "DevType",
    "OrgSize",
    "Currency",
    "ConvertedCompYearly",
    "LanguageHaveWorkedWith",
    "LanguageWantToWorkWith",
    "DatabaseHaveWorkedWith",
    "DatabaseWantToWorkWith",
    "PlatformHaveWorkedWith",
    "PlatformWantToWorkWith",
    "WebframeHaveWorkedWith",
    "WebframeWantToWorkWith",
    "SOAccount",
    "SOVisitFreq",
    "SOComm",
    "SOPartFreq",
    "LearnCode",
]

TYPE_CASTS = {
    "YearsCode": pl.String,
    "ConvertedCompYearly": pl.String,
}

def load_and_select(year: int) -> pl.DataFrame:
    df = RawData(year=year).download()
    df = df.select(COMMON_COLUMNS)
    for col, dtype in TYPE_CASTS.items():
        df = df.with_columns(df[col].cast(dtype, strict=False))
    return df.with_columns(pl.lit(year).alias("Year").cast(pl.Int16))


def merge(years: list[int] | None = None) -> pl.DataFrame:
    if years is None:
        years = [2021, 2022, 2023, 2024, 2025]
    return pl.concat([load_and_select(y) for y in years])


def clean(df: pl.DataFrame) -> pl.DataFrame:
    df = df.with_columns(
        pl.col("Employment")
        .str.replace_all("Employed, full-time", "Employed full-time")
        .str.replace_all("Employed, part-time", "Employed part-time")
        .str.replace_all("Not employed, and not looking for work", "Not employed and not looking for work")
        .str.replace_all("Not employed, but looking for work", "Not employed but looking for work")
        .str.replace_all("Independent contractor, freelancer, or self-employed", "Freelancer or self-employed")
    )

    df = df.with_columns(
        pl.when(pl.col("EdLevel") == "Other (please specify):")
        .then(pl.lit("Other"))
        .when(pl.col("EdLevel") == "Something else")
        .then(pl.lit("Other"))
        .when(pl.col("EdLevel") == "Professional degree (JD, MD, Ph.D, Ed.D, etc.)")
        .then(pl.lit("Professional degree (JD, MD, etc.)"))
        .otherwise(pl.col("EdLevel"))
        .alias("EdLevel")
    )

    df = df.with_columns(
        pl.col("MainBranch")
        .str.replace_all('"', "")
        .str.replace("^, ", "")
        .str.replace(" but I write code sometimes as part of my work/studies$", "")
        .str.replace(" but I write code sometimes as part of my work$", "")
        .alias("MainBranch")
    )

    df = df.with_columns(
        pl.col("MainBranch")
        .str.replace("^ +$", None)
        .str.replace("^$", None)
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
        .str.replace(" years old", "")
        .str.replace(" or older", "+")
        .alias("AgeClean")
    )

    df = df.drop_nulls(subset=["YearsCode"])

    df = df.with_columns(
        df["ConvertedCompYearly"].cast(pl.Float64, strict=False).alias("comp_val")
    )
    medians = df.group_by("Year", "Country").agg(pl.median("comp_val").alias("median_comp"))
    year_medians = df.group_by("Year").agg(pl.median("comp_val").alias("year_median"))
    df = df.join(medians, on=["Year", "Country"], how="left")
    df = df.join(year_medians, on="Year", how="left")
    df = df.with_columns(
        pl.col("comp_val")
        .fill_null(pl.col("median_comp"))
        .fill_null(pl.col("year_median"))
        .alias("ConvertedCompYearly")
    ).drop(["comp_val", "median_comp", "year_median"])

    return df


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    output_dir = root / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)

    print("Merging datasets...")
    df = merge()
    print(f"Merged: {df.shape}")
    df.write_parquet(str(output_dir / "merged_survey_2021_2025.parquet"))

    print("Cleaning...")
    clean_df = clean(df)
    print(f"Cleaned: {clean_df.shape}")
    clean_df.write_parquet(str(output_dir / "merged_survey_2021_2025_clean.parquet"))

    print("Done.")
