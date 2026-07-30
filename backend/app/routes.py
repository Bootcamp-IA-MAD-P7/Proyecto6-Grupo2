from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.app.analysis import compute_overview_metrics, compute_segment_rates
from backend.app.auth import get_current_user
from backend.app.inference import get_pipeline
from backend.app.schemas import (
    DashboardOverviewResponse,
    OverviewMetrics,
    PredictionResponseBinary,
    SegmentItem,
)
from src.inference.predict import predict_single

router = APIRouter(prefix="/api/v1")


class PredictionInput(BaseModel):
    YearsCodeNum: float
    ConvertedCompYearly: float
    MainBranch: str
    Employment: str
    EdLevel: str
    Age: str
    OrgSize: str
    Country: str


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/auth/me")
def auth_me(user: dict = Depends(get_current_user)):
    return {"user_id": user.get("sub"), "email": user.get("email")}


@router.get("/auth/logout")
def auth_logout():
    return {"message": "Logout by clearing the token on the client side"}


@router.get("/dashboard/overview", response_model=DashboardOverviewResponse)
def dashboard_overview(user: dict = Depends(get_current_user)) -> DashboardOverviewResponse:
    return DashboardOverviewResponse(
        metrics=OverviewMetrics(**compute_overview_metrics()),
        segments={
            key: [SegmentItem(**item) for item in items]
            for key, items in compute_segment_rates().items()
        },
    )


@router.post("/predict", response_model=PredictionResponseBinary)
def predict(
    input_data: PredictionInput,
    user: dict = Depends(get_current_user),
) -> PredictionResponseBinary:
    try:
        pipeline = get_pipeline()
        result = predict_single(pipeline, input_data.model_dump(), binary=True)
        return PredictionResponseBinary(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
