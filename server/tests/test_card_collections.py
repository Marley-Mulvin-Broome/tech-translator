import pytest

from tests.utility import (
    signup_request,
    delete_user_request,
    create_card_collection_with_name_request,
    get_collection_with_id_request,
    get_all_card_collections_request,
)

from app.models.cardbase import (
    CardContainerList,
    CardContainer,
    CardContainerCreatedResponse,
)


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


def test_create_card_collection_tango(test_client, user_uid):
    collection = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", False
    )

    assert collection.status_code == 200

    collection_response = collection.json()

    assert "container_id" in collection_response
    assert collection_response["owner_uid"] == user_uid
    assert not bool(collection_response["is_sentence"])

    collection_fetch = get_collection_with_id_request(
        test_client, user_uid, collection_response["container_id"]
    )

    assert collection_fetch.status_code == 200

    collection_fetch_response = collection_fetch.json()

    assert (
        collection_fetch_response["container_id"] == collection_response["container_id"]
    )
    assert collection_fetch_response["owner_uid"] == user_uid
    assert (
        collection_fetch_response["is_sentence"] == collection_response["is_sentence"]
    )
    assert collection_fetch_response["name"] == "crazy_baby"


def test_create_card_collection_sentence(test_client, user_uid):
    collection = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", True
    )

    assert collection.status_code == 200

    collection_response = collection.json()

    assert "container_id" in collection_response
    assert collection_response["owner_uid"] == user_uid
    assert bool(collection_response["is_sentence"])

    collection_fetch = get_collection_with_id_request(
        test_client, user_uid, collection_response["container_id"]
    )

    assert collection_fetch.status_code == 200

    collection_fetch_response = collection_fetch.json()

    assert (
        collection_fetch_response["container_id"] == collection_response["container_id"]
    )
    assert collection_fetch_response["owner_uid"] == user_uid
    assert (
        collection_fetch_response["is_sentence"] == collection_response["is_sentence"]
    )
    assert collection_fetch_response["name"] == "crazy_baby"


def test_get_all_card_collections(test_client, user_uid):
    collections = get_all_card_collections_request(test_client, user_uid)

    assert collections.status_code == 200

    collections_response: CardContainerList = CardContainerList(**collections.json())

    # デフォルトで作成される単語帳があるので2つになる
    assert len(collections_response.containers) == 2


def test_get_all_card_collections_add_collection(test_client, user_uid):
    new_collection_response = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", True
    )

    assert new_collection_response.status_code == 200

    collections_response = get_all_card_collections_request(test_client, user_uid)

    assert collections_response.status_code == 200

    collections_list: CardContainerList = CardContainerList(
        **collections_response.json()
    )

    assert len(collections_list.containers) == 3


def test_get_collection_with_id(test_client, user_uid):
    new_collection_response = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", True
    )

    assert new_collection_response.status_code == 200

    new_collection_response_json = CardContainerCreatedResponse(
        **new_collection_response.json()
    )

    collection_response = get_collection_with_id_request(
        test_client, user_uid, new_collection_response_json.container_id
    )

    assert collection_response.status_code == 200

    container: CardContainer = CardContainer(**collection_response.json())

    assert container.container_id == new_collection_response_json.container_id
    assert container.owner_uid == user_uid
    assert container.is_sentence
    assert container.name == "crazy_baby"


