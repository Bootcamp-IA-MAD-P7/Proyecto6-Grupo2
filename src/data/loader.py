import pandas as pd
import sys
from pathlib import Path
from src.data import clean_raw_data


def load_clean_data() -> pd.DataFrame:
    df = pd.read_parquet(CLEAN_PATH)
    print(f"Clean data loaded: {df.shape[0]} rows, {df.shape[1]} cols")
    return df

def load_and_clean_raw_data() -> pd.DataFrame:
    df = pd.read_excel(RAW_DATA)
    print(f"Raw data loaded: {df.shape[0]} rows, {df.shape[1]} cols")
    df = clean_raw_data(df)
    print(f"After cleaning: {df.shape[0]} rows, {df.shape[1]} cols")
    return df



def _find_root() -> Path:
    current = Path.cwd()
    for parent in [current] + list(current.parents):
        if (parent / "pyproject.toml").exists():
            return parent
    return current

ROOT = _find_root()
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# --- Paths ---
RAW_DATA = ROOT / "data/raw/data/raw/stackoverflow_survey_2025.csv"
PROCESSED_DIR = ROOT / "data/processed"
REPORTS_DIR = ROOT / "reports"
REPORT_PATH = REPORTS_DIR / "eda_report.html"
CLEAN_PATH = PROCESSED_DIR / "stackoverflow_survey_2025.parquet"


# --- Model constants ---
TARGET = "job_satisfaction"
RANDOM_STATE = 42
TEST_SIZE = 0.2
OPTUNA_TRIALS = 30