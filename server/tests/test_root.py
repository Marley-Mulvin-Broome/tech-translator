from fastapi.testclient import TestClient
from app.main import app
from tests.utility import signup_request

import pytest


def test_read_main(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
