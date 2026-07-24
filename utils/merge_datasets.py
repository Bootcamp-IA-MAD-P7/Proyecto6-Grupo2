import polars as pl
from utils.load_raw_data import RawData

COMMON_COLUMNS = [
    "ResponseId",
    "MainBranch",
    "Employment",
    "Country",
    "EdLevel",
    "Age",
    "YearsCode",
    "DevType",
    "OrgSize",
    "Currency",
    "CompTotal",
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
    "ResponseId": pl.Int64,
    "YearsCode": pl.String,
    "CompTotal": pl.String,
    "ConvertedCompYearly": pl.String,
}


def load_and_select(year: int) -> pl.DataFrame:
    df = RawData(year=year).download()
    df = df.select(COMMON_COLUMNS)
    for col, dtype in TYPE_CASTS.items():
        df = df.with_columns(df[col].cast(dtype, strict=False))
    return df.with_columns(pl.lit(year).alias("Year").cast(pl.Int16))


def merge_datasets(years: list[int] | None = None) -> pl.DataFrame:
    if years is None:
        years = [2021, 2022, 2023, 2024, 2025]
    frames = [load_and_select(y) for y in years]
    return pl.concat(frames)
