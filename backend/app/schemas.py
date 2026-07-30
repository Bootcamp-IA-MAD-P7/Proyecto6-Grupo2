from pydantic import BaseModel


class PredictionResponseBinary(BaseModel):
    prediction: int
    label: str
    probability_not_satisfied: float
    probability_satisfied: float


class SegmentItem(BaseModel):
    id: str
    rate: float
    count: int


class OverviewMetrics(BaseModel):
    total_profiles: int
    lower_satisfaction_profiles: int
    lower_satisfaction_rate: float
    median_salary_usd: float
    median_years_code: float


class DashboardOverviewResponse(BaseModel):
    metrics: OverviewMetrics
    segments: dict[str, list[SegmentItem]]
