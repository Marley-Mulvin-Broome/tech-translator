from fastapi.testclient import TestClient
from app.main import app
from tests.utility import signup_request

import pytest


def test_read_main(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_signup(test_client):
    response = signup_request(
        test_client,
        "cat@gmail.com",
        "password123",
    )
    assert response.status_code == 200

    response_json = response.json()

    response = test_client.get("/users/ping", headers={"X-Uid": response_json["uid"]})

    assert response.status_code == 200
