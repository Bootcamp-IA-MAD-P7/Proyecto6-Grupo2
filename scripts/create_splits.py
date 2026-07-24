import polars as pl
from pathlib import Path

INPUT = "data/processed/merged_survey_2024_2025_clean.parquet"
OUTPUT_DIR = "data/processed/splits"
SEED = 42
SPLITS = {"train": 0.7, "dev": 0.15, "test": 0.15}


def main() -> None:
    df = pl.read_parquet(INPUT)
    df = df.sample(fraction=1.0, shuffle=True, seed=SEED)

    out = Path(OUTPUT_DIR)
    out.mkdir(parents=True, exist_ok=True)

    start = 0
    for name, frac in SPLITS.items():
        end = start + int(df.height * frac)
        split = df[start:end] if name != "test" else df[start:]
        split.write_parquet(str(out / f"{name}.parquet"))
        print(f"{name}: {split.height:>6d} rows")
        start = end


if __name__ == "__main__":
    main()
