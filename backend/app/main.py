from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.analysis import compute_overview_metrics, compute_segment_rates
from backend.app.inference import get_pipeline
from backend.app.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
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
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
