import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.evaluation.evaluate import evaluate
from src.evaluation.compare import compare


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pipeline", default="xgboost_pipeline", help="Pipeline name to evaluate")
    parser.add_argument("--compare", action="store_true", help="Compare baseline vs tuned")
    parser.add_argument("--baseline", default="xgboost_pipeline")
    parser.add_argument("--tuned", default="xgboost_tuned")
    args = parser.parse_args()

    if args.compare:
        compare(baseline=args.baseline, tuned=args.tuned)
    else:
        evaluate(args.pipeline)


if __name__ == "__main__":
    main()
