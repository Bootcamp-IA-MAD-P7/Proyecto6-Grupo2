from pydantic import BaseModel


class PredictionResponseBinary(BaseModel):
    prediction: int
    label: str
    probability_not_satisfied: float
    probability_satisfied: float


class PredictionResponseMulticlass(BaseModel):
    prediction: int
    label: str
    probability_low: float
    probability_medium: float
    probability_high: float
