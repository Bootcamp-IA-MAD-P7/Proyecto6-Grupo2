
import sys
from pathlib import Path
from datasets import load_dataset
from datasets import load_dataset
from utils import RawData, Schema, load

def _find_root() -> Path:
    current = Path.cwd()
    for parent in [current] + list(current.parents):
        if (parent / "pyproject.toml").exists():
            return parent
    return current

# --- Model constants ---
TARGET = "JobSat"
RANDOM_STATE = 42
TEST_SIZE = 0.2
OPTUNA_TRIALS = 30