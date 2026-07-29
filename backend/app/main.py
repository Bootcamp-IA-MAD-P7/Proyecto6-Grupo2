from fastapi import FastAPI

from backend.app.routes import router

app = FastAPI(title="Stack Overflow Job Satisfaction API")
app.include_router(router)
