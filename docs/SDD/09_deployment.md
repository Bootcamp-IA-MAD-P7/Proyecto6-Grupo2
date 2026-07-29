# Deployment

**Version:** 1.0
**Status:** Live

---

## 1. Live Instance

The backend API is deployed and publicly accessible:

| Service | URL |
|---|---|
| API | `https://talentcare-back.onrender.com` |
| Predict endpoint | `https://talentcare-back.onrender.com/api/v1/predict` |
| Interactive docs | `https://talentcare-back.onrender.com/docs` |

No authentication is required. CORS is restricted to:

- `http://localhost:5173` (Vite dev server)
- `https://talentcare-front.onrender.com` (production frontend)

Only `POST` is allowed, with `Content-Type` and `Accept` headers.

## 2. Architecture

The application is deployed as a single-service system on Render:

```
User
  |
  HTTPS POST /api/v1/predict
  |
  v
Backend Container (Render)
  |
  ML Inference (scikit-learn Pipeline)
  |
  v
Model Artifact (random_forest_binary_pipeline.joblib)
```

The frontend is not yet deployed — the API is fully functional and can be tested via the `/docs` Swagger UI or any HTTP client.

## 3. Backend Service

| Aspect | Detail |
|---|---|
| Platform | Render (Web Service) |
| Runtime | Python 3.13 (slim) |
| Framework | FastAPI + Uvicorn |
| Model | Random Forest binary classifier |
| Model file | `models/pipelines/random_forest_binary_pipeline.joblib` |
| Start command | `uv run python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` |

### Dockerfile

```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv --no-cache-dir && uv sync --frozen --no-dev
COPY backend/ ./backend/
COPY src/ ./src/
COPY models/pipelines/random_forest_binary_pipeline.joblib models/pipelines/random_forest_binary_pipeline.joblib
EXPOSE 8000
CMD ["uv", "run", "python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

The Dockerfile copies only the binary model (not the 3-class model or metrics) to keep the image small.

## 4. Render Deployment

The service was deployed via Render's GitHub integration:

1. **Connect repo** — Render linked to the GitHub repository.
2. **Select branch** — `main` (production).
3. **Service type** — Web Service.
4. **Build** — Render builds the Docker image from `backend/Dockerfile`.
5. **Start command** — Render overrides the Dockerfile CMD with its own `$PORT` environment variable. The actual start command in the Render dashboard is:

```
uv run python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

6. **Health check** — Render monitors the service; FastAPI returns 200 on `/docs`.

Render automatically:
- Assigns a public URL (`talentcare-back.onrender.com`).
- Handles HTTPS termination.
- Restarts the service on failure.
- Scales the container vertically (plan-dependent).

## 5. API Endpoint

**`POST /api/v1/predict`**

Request body:

```json
{
  "YearsCodeNum": 5,
  "ConvertedCompYearly": 65000,
  "MainBranch": "I am a developer by profession",
  "Employment": "Employed, full-time",
  "EdLevel": "Bachelor's degree",
  "Age": "25-34 years old",
  "OrgSize": "100 to 499 employees",
  "Country": "Spain"
}
```

Response:

```json
{
  "prediction": 0,
  "label": "not_satisfied",
  "probability_not_satisfied": 0.5003,
  "probability_satisfied": 0.4997
}
```

All 8 features are required. See the interactive docs at `/docs` for full schema details.

## 6. Local Development

```bash
# Train models
uv run python scripts/train_random_forest.py

# Start API
uv run python -m uvicorn backend.app.main:app --reload

# Test
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"YearsCodeNum":5,"ConvertedCompYearly":65000,"MainBranch":"I am a developer by profession","Employment":"Employed, full-time","EdLevel":"Bachelor'\''s degree","Age":"25-34 years old","OrgSize":"100 to 499 employees","Country":"Spain"}'
```

## 7. Docker

```bash
# Build and run
docker compose up

# Build manually
docker build -f backend/Dockerfile -t talentcare-back .
docker run -p 8000:8000 talentcare-back
```

## 8. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | 8000 | Server port (Render sets this automatically) |
| `PYTHONUNBUFFERED` | 1 | Disable Python stdout buffering |

## 9. Future Improvements

- Deploy frontend (Vite app) as a static site on Render or Vercel.
- Add CI/CD pipeline with automated testing before deployment.
- Restrict CORS to the frontend domain.
- Add monitoring and logging aggregation.
- Implement model versioning and rollback strategy.
