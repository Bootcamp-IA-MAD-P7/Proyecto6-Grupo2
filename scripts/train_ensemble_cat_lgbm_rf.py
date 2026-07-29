"""Train CatBoost + LightGBM + Random Forest and its stacking model."""

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.training.catboost import run_catboost
from src.training.ensemble_cat_lgbm_rf import run_ensemble
from src.training.lgbm_random_forest import run_lgbm_random_forest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--skip-base-models",
        action="store_true",
        help="Reuse existing OOF probabilities and trained base models.",
    )
    parser.add_argument(
        "--catboost-trials",
        type=int,
        default=50,
        help="Number of Optuna trials used to tune CatBoost.",
    )
    parser.add_argument(
        "--tune-lgbm",
        action="store_true",
        help="Tune LightGBM with Optuna before OOF training.",
    )
    parser.add_argument(
        "--tuning-trials",
        type=int,
        default=30,
        help="Number of Optuna trials when --tune-lgbm is enabled.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.skip_base_models:
        run_catboost(tuning_trials=args.catboost_trials)
        run_lgbm_random_forest(
            tune_lgbm=args.tune_lgbm,
            tuning_trials=args.tuning_trials,
        )
    run_ensemble()


if __name__ == "__main__":
    main()
