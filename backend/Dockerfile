FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install uv --no-cache-dir && \
    uv sync --frozen --no-dev

COPY backend/ ./backend/
COPY src/ ./src/

EXPOSE 8000

CMD ["uv", "run", "python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
