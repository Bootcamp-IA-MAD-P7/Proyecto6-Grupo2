import os
import sys
from pathlib import Path

import polars as pl

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

PARQUET_PATH = Path("data/processed/merged_survey_2024_2025_clean.parquet")
TABLE_NAME = "survey_responses"


def get_connection_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise ValueError(
            "DATABASE_URL not set. "
            "Usage: DATABASE_URL=postgresql://user:pass@host:5432/db uv run python scripts/migrate_parquet_to_postgres.py"
        )
    return url


def main() -> None:
    url = get_connection_url()

    if not PARQUET_PATH.exists():
        print(f"Parquet not found at {PARQUET_PATH}")
        sys.exit(1)

    print(f"Reading {PARQUET_PATH}...")
    df = pl.read_parquet(PARQUET_PATH)
    print(f"Loaded {len(df):,} rows x {len(df.columns)} columns")

    print(f"Connecting to PostgreSQL...")
    from sqlalchemy import create_engine

    engine = create_engine(url)

    print(f"Writing to table `{TABLE_NAME}`...")
    df.write_database(TABLE_NAME, connection=engine, if_table_exists="replace")
    print("Done!")

    with engine.connect() as conn:
        count = conn.execute(
            __import__("sqlalchemy").text(f"SELECT COUNT(*) FROM {TABLE_NAME}")
        ).scalar()
        print(f"Verified: {count:,} rows in `{TABLE_NAME}`")


if __name__ == "__main__":
    main()
