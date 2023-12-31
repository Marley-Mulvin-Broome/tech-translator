import pytest

from fastapi import Header
from fastapi.testclient import TestClient
from app.main import app
from app.dependencies import validate_token
from firebase_admin import auth

from tests.utility import signup_request, delete_user_request

from os import environ


def override_validate_token(x_uid: str = Header()) -> dict:
    """
    トークンをヘッダーで受け取り、検証する
    """

    user = auth.get_user(x_uid)

    return {
        "token": "fake token",
        "user": {
            "uid": user.uid,
            "email": user.email,
        },
    }


@pytest.fixture(scope="session", autouse=True)
def test_client():
    # テスト前のセットアップ
    if "OMNIA_ENV" not in environ or environ["OMNIA_ENV"] != "emulator":
        assert False, "OMNIA_ENVが設定されていません、またはemulatorではありません"
    if "FIRESTORE_EMULATOR_HOST" not in environ:
        assert False, "FIRESTORE_EMULATOR_HOSTが設定されていません"
    if "FIREBASE_AUTH_EMULATOR_HOST" not in environ:
        assert False, "FIREBASE_AUTH_EMULATOR_HOSTが設定されていません"

    # Firebase Emulatorがデータを全部消してくれるので、テスト前に消さなくてもいい

    test_client = TestClient(app)

    app.dependency_overrides[validate_token] = override_validate_token

    yield test_client


@pytest.fixture(scope="function")
def user_uid(test_client):
    response = signup_request(
        test_client,
        "potato@potato.com",
        "password123",
    )

    assert response.status_code == 200

    yield response.json()["uid"]

    delete_user_request(test_client, response.json()["uid"])
