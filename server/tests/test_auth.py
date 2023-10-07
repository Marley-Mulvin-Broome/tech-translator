from tests.utility import signup_request, delete_user_request


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

    delete_user_request(test_client, response_json["uid"])
