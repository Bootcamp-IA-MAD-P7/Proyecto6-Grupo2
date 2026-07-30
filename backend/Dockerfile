FROM python:3.13-slim

WORKDIR /app

ENV UV_PYTHON_DOWNLOADS=never

COPY pyproject.toml uv.lock ./

RUN pip install uv --no-cache-dir && \
    uv sync --frozen --no-dev

COPY backend/ ./backend/
COPY src/ ./src/
COPY models/pipelines/random_forest_binary_pipeline.joblib models/pipelines/random_forest_binary_pipeline.joblib
COPY --chown=app:app data/processed/merged_survey_2024_2025_clean.parquet data/processed/merged_survey_2024_2025_clean.parquet

RUN useradd app
USER app

EXPOSE 8000

CMD ["uv", "run", "python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
