FROM python:3.13-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

ENV UV_PYTHON_DOWNLOADS=never

COPY uv.lock .
COPY pyproject.toml .
RUN uv sync --frozen

COPY src ./src
COPY backend ./backend
COPY models/pipelines/ ./models/pipelines/
COPY data/processed/merged_survey_2024_2025_clean.parquet data/processed/merged_survey_2024_2025_clean.parquet

RUN useradd app
USER app

EXPOSE 8000

CMD .venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT