from pydantic import BaseModel


class PredictionInput(BaseModel):
    YearsCodeNum: float
    ConvertedCompYearly: float
    MainBranch: str
    Employment: str
    EdLevel: str
    Age: str
    OrgSize: str
    Country: str


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
