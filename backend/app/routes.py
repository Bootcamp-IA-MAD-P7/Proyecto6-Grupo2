from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.app.inference import get_pipeline
from backend.app.schemas import PredictionResponseBinary
from src.inference.predict import predict_single

router = APIRouter()


class PredictionInput(BaseModel):
    YearsCodeNum: float
    ConvertedCompYearly: float
    MainBranch: str
    Employment: str
    EdLevel: str
    Age: str
    OrgSize: str
    Country: str


@router.post("/predict", response_model=PredictionResponseBinary)
def predict(input_data: PredictionInput) -> PredictionResponseBinary:
    try:
        pipeline = get_pipeline()
        result = predict_single(pipeline, input_data.model_dump(), binary=True)
        return PredictionResponseBinary(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
