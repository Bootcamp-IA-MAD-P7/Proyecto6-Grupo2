from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

VALID_INPUT = {
    "YearsCodeNum": 5.0,
    "ConvertedCompYearly": 60000.0,
    "MainBranch": "I am a developer by profession",
    "Employment": "Employed, full-time",
    "EdLevel": "Bachelor\u2019s degree",
    "Age": "25-34 years old",
    "OrgSize": "100 to 499 employees",
    "Country": "Spain",
}

MOCK_RESULT = {
    "prediction": 1,
    "label": "satisfied",
    "probability_not_satisfied": 0.42,
    "probability_satisfied": 0.58,
}


@pytest.fixture
def client():
    with patch("backend.app.routes.get_pipeline"), \
         patch("backend.app.routes.predict_single", return_value=MOCK_RESULT), \
         patch("backend.app.auth.get_current_user", return_value={"sub": "test-user"}):
        yield TestClient(app)


def test_predict_valid_input(client):
    response = client.post("/api/v1/predict", json=VALID_INPUT)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in (0, 1)
    assert data["label"] in ("satisfied", "not_satisfied")
    assert 0.0 <= data["probability_satisfied"] <= 1.0
    assert 0.0 <= data["probability_not_satisfied"] <= 1.0


def test_predict_missing_field(client):
    incomplete = {k: v for k, v in VALID_INPUT.items() if k != "Country"}
    response = client.post("/api/v1/predict", json=incomplete)
    assert response.status_code == 422


def test_predict_wrong_type(client):
    bad_input = {**VALID_INPUT, "YearsCodeNum": "not_a_number"}
    response = client.post("/api/v1/predict", json=bad_input)
    assert response.status_code == 422
