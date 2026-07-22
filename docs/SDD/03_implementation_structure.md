# Implementation Structure

## The core idea

The project is organized by **responsibility**, not file type. Each top-level folder answers: *what role does this play in the pipeline?* The overall flow is:

**raw data → preprocessing → training → evaluation → saved model → API → frontend**

---

## Root files

- `pyproject.toml`, `uv.lock`, `.python-version` — dependency and environment setup, managed by `uv`.
- `.env` / `.env.example` — secrets vs. a template of which secrets exist (secrets never get committed).
- `docker-compose.yml` — starts backend + frontend together.
- `main.py` — top-level entry point for the project.

## `src/` — the library

The core, reusable code. Nothing here runs on its own; it's imported by scripts or the API.

- `data/` — load, clean, split, validate data.
- `features/` — turn clean data into model-ready features.
- `training/` — one file per algorithm (`random_forest.py`, `xgboost.py`), plus `baseline.py` (a simple model to compare against), `ensemble.py`, and `tuning.py` for hyperparameter search.
- `evaluation/` — compute metrics, plots, and compare models.
- `inference/` — load a trained model and run predictions on new data.

## `scripts/` — runnable commands

Thin entry points that call `src/` to actually do something: `preprocess.py`, `train.py`, `evaluate.py`, `predict.py`. These should stay short — real logic lives in `src/`.

## `notebooks/`

Exploration only (EDA, first-look visualizations). Anything useful gets moved into `src/` afterward.

## `data/`

- `raw/` — original, untouched data.
- `processed/` — output of the preprocessing step. Can always be regenerated from `raw/`.

## `models/`

Generated files, not code — populated by running `train.py`.

- `trained/` — the raw trained model files.
- `pipelines/` — full preprocessing + model bundles, so predictions always apply the same transformations used in training.
- `metrics/` — saved evaluation results.

## `backend/` — the API (FastAPI)

Takes a request, validates it, calls the model, returns a response. No training logic here.

- `main.py` — creates the FastAPI app.
- `routes.py` — defines endpoints (e.g. `POST /predict`).
- `schemas.py` — request/response formats.
- `inference.py` — bridges to `src/inference/`.
- `Dockerfile` — packages the backend on its own.

## `frontend/` — the UI (React)

- `components/` — small reusable UI pieces.
- `pages/` — full views built from components.
- `services/` — API calls to the backend.
- `assets/` — images/icons.
- Its own `Dockerfile` and `package.json`, deployed independently from the backend.

## `tests/`

One test file per major module: `test_data.py`, `test_training.py`, `test_evaluation.py`, `test_inference.py`, `test_backend.py`.

## `docs/SDD/`

The Software Design Document, split into numbered sections: scope, requirements, architecture, implementation, data pipeline, modeling, frontend, API, testing, deployment — one topic per file.