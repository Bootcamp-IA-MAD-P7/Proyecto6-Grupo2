FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Tell uv to use the system Python, not download its own
ENV UV_PYTHON_DOWNLOADS=never

# Copy lock file and install dependencies
COPY uv.lock .
COPY pyproject.toml .
RUN uv sync --frozen

# Copy source code
COPY src ./src
COPY backend ./backend

# Setup an app user so the container doesn't run as the root user
RUN useradd app
USER app

EXPOSE 8080

CMD [".venv/bin/uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
