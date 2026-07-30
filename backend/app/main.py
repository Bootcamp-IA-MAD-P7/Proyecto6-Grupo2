import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.analysis import compute_overview_metrics, compute_segment_rates
from backend.app.inference import get_pipeline
from backend.app.routes import router

DATABASE_URL = os.getenv("DATABASE_URL", "")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if DATABASE_URL:
        try:
            from backend.app.analysis import _load_data
            _load_data()
            print(f"[DB] Connected to database")
        except Exception as e:
            print(f"[DB] Warning: could not connect to database: {e}")
    get_pipeline()
    compute_overview_metrics()
    compute_segment_rates()
    yield


app = FastAPI(
    title="Stack Overflow Job Satisfaction API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://talentcare-front.onrender.com",
        "https://talentcare.vercel.app",
        "https://frontend-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
