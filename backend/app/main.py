from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes import router

app = FastAPI(title="Stack Overflow Job Satisfaction API")

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
