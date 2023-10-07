# def emulator_firestore(firestore, host="127.0.0.1", firestore_port=8080):
#     firestore.use_emulator(host, firestore_port)
#
#
# def emulator_auth(auth, host="127.0.0.1", auth_port=9099):
#     auth.use_emulator(host, auth_port)

from fastapi.testclient import TestClient
from httpx import Response

from app.models.tango import TangoCardModel, CreateTangoModel
from app.models.sentence import CreateSentenceModel, SentenceCardModel
from app.models.speak import SpeakRequest


def make_authenticated_request(
    test_client: TestClient, route: str, uid: str, method: str = "get", **kwargs
) -> Response:
    if method == "get":
        return test_client.get(route, headers={"X-Uid": uid}, **kwargs)
    elif method == "post":
        return test_client.post(route, headers={"X-Uid": uid}, **kwargs)
    elif method == "put":
        return test_client.put(route, headers={"X-Uid": uid}, **kwargs)
    elif method == "delete":
        return test_client.delete(route, headers={"X-Uid": uid}, **kwargs)
    elif method == "patch":
        return test_client.patch(route, headers={"X-Uid": uid}, **kwargs)
    else:
        raise Exception("Invalid method")


def signup_request(test_client: TestClient, email: str, password: str) -> Response:
    return test_client.post(
        "/users/signup", headers={"Password": password}, params={"email": email}
    )


def login_request(test_client: TestClient, email: str, password: str) -> Response:
    return test_client.post(
        "/users/login", headers={"Password": password}, params={"email": email}
    )


def delete_user_request(test_client: TestClient, uid: str) -> Response:
    return make_authenticated_request(test_client, "/users/delete", uid, "delete")


def get_all_card_collections_request(test_client: TestClient, uid: str) -> Response:
    return make_authenticated_request(test_client, "/cards", uid, "get")


def get_collection_with_id_request(
    test_client: TestClient, uid: str, collection_id: str
) -> Response:
    return make_authenticated_request(
        test_client, f"/cards/{collection_id}", uid, "get"
    )


def create_card_collection_with_name_request(
    test_client: TestClient, uid: str, collection_name: str, is_sentence: bool
) -> Response:
    return make_authenticated_request(
        test_client,
        "/cards/create_card_collection",
        uid,
        "post",
        params={"collection_name": collection_name, "is_sentence": is_sentence},
    )


def get_sentence_card_request(
    test_client: TestClient, uid: str, collection_id: str, card_id: str
) -> Response:
    return make_authenticated_request(
        test_client, f"/cards/sentence_card_get/{collection_id}/{card_id}", uid, "get"
    )


def get_tango_card_request(
    test_client: TestClient, uid: str, collection_id: str, card_id: str
) -> Response:
    return make_authenticated_request(
        test_client, f"/cards/tango_card_get/{collection_id}/{card_id}", uid, "get"
    )


def set_tango_card_request(
    test_client: TestClient, uid: str, collection_id: str, card_model: TangoCardModel
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/tango_card_set/{collection_id}",
        uid,
        "patch",
        json=card_model.model_dump(mode="json"),
    )


def set_sentence_card_request(
    test_client: TestClient, uid: str, collection_id: str, card_model: SentenceCardModel
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/sentence_card_set/{collection_id}",
        uid,
        "patch",
        json=card_model.model_dump(mode="json"),
    )


def update_card_collection_field_request(
    test_client: TestClient,
    uid: str,
    collection_id: str,
    field_name: str,
    field_value: str,
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/card_collection_update_field/{collection_id}",
        uid,
        "patch",
        params={"field_name": field_name, "field_value": field_value},
    )


def update_card_field_request(
    test_client: TestClient,
    uid: str,
    collection_id: str,
    card_id: str,
    field_name: str,
    field_value: str,
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/card_update_field/{collection_id}/{card_id}",
        uid,
        "patch",
        params={"field_name": field_name, "field_value": field_value},
    )


def add_tango_card_to_collection_request(
    test_client: TestClient, uid: str, collection_id: str, card_model: CreateTangoModel
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/add_tango_card_to_collection/{collection_id}",
        uid,
        "post",
        json=card_model.model_dump(mode="json"),
    )


def add_sentence_card_to_collection_request(
    test_client: TestClient,
    uid: str,
    collection_id: str,
    card_model: CreateSentenceModel,
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/add_sentence_card_to_collection/{collection_id}",
        uid,
        "post",
        json=card_model.model_dump(mode="json"),
    )


def delete_card_collection_request(
    test_client: TestClient, uid: str, collection_id: str
) -> Response:
    return make_authenticated_request(
        test_client, f"/cards/delete_card_collection/{collection_id}", uid, "delete"
    )


def delete_card_request(
    test_client: TestClient, uid: str, collection_id: str, card_id: str
) -> Response:
    return make_authenticated_request(
        test_client,
        f"/cards/delete_card/{collection_id}/{card_id}",
        uid,
        "delete",
    )


def speak_text_request(
    test_client: TestClient, uid: str, speak_request: SpeakRequest
) -> Response:
    return make_authenticated_request(
        test_client,
        "/speak",
        uid,
        "post",
        json=speak_request.model_dump(mode="json"),
    )
