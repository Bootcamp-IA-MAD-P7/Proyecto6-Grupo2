from pydantic import BaseModel


class PredictionResponse(BaseModel):
    prediction: int
    label: str
    probability_low: float
    probability_medium: float
    probability_high: float
