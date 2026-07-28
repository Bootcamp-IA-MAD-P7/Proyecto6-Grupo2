from pathlib import Path
from src.data.cat_lgbm_xgb.preprocessing import run_preprocessing

if __name__ == "__main__":
    run_preprocessing(Path("data/processed"))
