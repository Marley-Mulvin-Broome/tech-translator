# def emulator_firestore(firestore, host="127.0.0.1", firestore_port=8080):
#     firestore.use_emulator(host, firestore_port)
#
#
# def emulator_auth(auth, host="127.0.0.1", auth_port=9099):
#     auth.use_emulator(host, auth_port)

from fastapi.testclient import TestClient


def signup_request(test_client: TestClient, email: str, password: str):
    return test_client.post(
        "/users/signup", headers={"Password": password}, params={"email": email}
    )
