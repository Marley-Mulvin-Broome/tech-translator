import pytest

from tests.utility import (
    signup_request,
    delete_user_request,
    create_card_collection_with_name_request,
    get_collection_with_id_request,
    get_all_card_collections_request,
    get_tango_card_request,
    get_sentence_card_request,
    add_sentence_card_to_collection_request,
    add_tango_card_to_collection_request,
    delete_card_collection_request,
    update_card_field_request,
    update_card_collection_field_request,
    delete_card_request,
    get_all_cards_in_collection_request,
)

from app.models.cardbase import (
    CardContainerList,
    CardContainer,
    CardContainerCreatedResponse,
)

from app.models.tango import TangoCardModel, CreateTangoModel
from app.models.sentence import SentenceCardModel, CreateSentenceModel

from time import time


@pytest.fixture(scope="function")
def tango_collection_id(test_client, user_uid):
    collection = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", False
    )

    assert collection.status_code == 200

    collection_response = collection.json()

    yield collection_response["container_id"]

    delete_card_collection_request(
        test_client, user_uid, collection_response["container_id"]
    )


@pytest.fixture(scope="function")
def sentence_collection_id(test_client, user_uid):
    collection = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", True
    )

    assert collection.status_code == 200

    collection_response = collection.json()

    yield collection_response["container_id"]

    delete_card_collection_request(
        test_client, user_uid, collection_response["container_id"]
    )


@pytest.fixture(scope="function")
def sentence_card_id(test_client, user_uid, sentence_collection_id):
    card = add_sentence_card_to_collection_request(
        test_client,
        user_uid,
        sentence_collection_id,
        CreateSentenceModel(
            english="english",
            japanese="japanese",
            explanation="explanation",
            url="url",
        ),
    )

    assert card.status_code == 200

    card_response = card.json()

    yield card_response["card_id"]

    delete_card_request(
        test_client, user_uid, sentence_collection_id, card_response["card_id"]
    )


@pytest.fixture(scope="function")
def tango_card_id(test_client, user_uid, tango_collection_id):
    card = add_tango_card_to_collection_request(
        test_client,
        user_uid,
        tango_collection_id,
        CreateTangoModel(
            english="english",
            japanese="japanese",
            pronunciation="pronunciation",
            example_sentence_english="example_sentence_english",
            example_sentence_japanese="example_sentence_japanese",
            url="url",
        ),
    )

    assert card.status_code == 200

    card_response = card.json()

    yield card_response["card_id"]

    delete_card_request(
        test_client, user_uid, tango_collection_id, card_response["card_id"]
    )


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


def test_get_collection_with_id_not_found(test_client, user_uid):
    collection_response = get_collection_with_id_request(
        test_client, user_uid, "not_found"
    )

    assert collection_response.status_code == 404


def test_get_tango_card_doesnt_exist(test_client, user_uid, tango_collection_id):
    card_response = get_tango_card_request(
        test_client, user_uid, tango_collection_id, "not_found"
    )

    assert card_response.status_code == 404


def test_get_sentence_card_doesnt_exist(test_client, user_uid, sentence_collection_id):
    card_response = get_sentence_card_request(
        test_client, user_uid, sentence_collection_id, "not_found"
    )

    assert card_response.status_code == 404


# def test_set_sentence_card_doesnt_exist(test_client, user_uid, collection_id):
#     pass
#
#
# def test_set_tango_card_doesnt_exist(test_client, user_uid):
#     pass


def test_update_card_doesnt_exist(test_client, user_uid, tango_collection_id):
    card_update_response = update_card_field_request(
        test_client,
        user_uid,
        tango_collection_id,
        "not_found",
        "english",
        "english",
    )

    assert card_update_response.status_code == 404


def test_update_card_collection_name(test_client, user_uid, tango_collection_id):
    card_update_response = update_card_collection_field_request(
        test_client,
        user_uid,
        tango_collection_id,
        "name",
        "new_name",
    )

    assert card_update_response.status_code == 200

    card_collection = get_collection_with_id_request(
        test_client, user_uid, tango_collection_id
    )

    assert card_collection.status_code == 200

    card_collection_response = CardContainer(**card_collection.json())

    assert card_collection_response.name == "new_name"


def test_update_card_collection_invalid_field(
    test_client, user_uid, tango_collection_id
):
    card_update_response = update_card_collection_field_request(
        test_client,
        user_uid,
        tango_collection_id,
        "invalid_field",
        "new_name",
    )

    assert card_update_response.status_code == 422


def test_update_card_field_invalid_field(
    test_client, user_uid, tango_collection_id, tango_card_id
):
    card_update_response = update_card_field_request(
        test_client,
        user_uid,
        tango_collection_id,
        tango_card_id,
        "invalid_field",
        "new_name",
    )

    assert card_update_response.status_code == 422


shared_update_fields = [
    ("english", "new_name"),
    ("japanese", "new_name"),
    ("url", "new_name"),
    ("known", True),
    ("due_timestamp", 1234567890),
    ("miss_count", 9409238),
]


@pytest.mark.parametrize(
    "field_name, field_value",
    [
        ("pronunciation", "new_name"),
        ("example_sentence_english", "new_name"),
        ("example_sentence_japanese", "new_name"),
    ]
    + shared_update_fields,
)
def test_update_tango_card_field(
    test_client, user_uid, tango_collection_id, tango_card_id, field_name, field_value
):
    card_update = update_card_field_request(
        test_client,
        user_uid,
        tango_collection_id,
        tango_card_id,
        field_name,
        field_value,
    )

    assert card_update.status_code == 200

    card = get_tango_card_request(
        test_client,
        user_uid,
        tango_collection_id,
        tango_card_id,
    )

    assert card.status_code == 200

    card_response = TangoCardModel(**card.json())

    assert card_response.model_dump()[field_name] == field_value


@pytest.mark.parametrize(
    "field_name, field_value",
    [
        ("explanation", "new_name"),
    ]
    + shared_update_fields,
)
def test_update_sentence_card_field(
    test_client,
    user_uid,
    sentence_collection_id,
    sentence_card_id,
    field_name,
    field_value,
):
    card_update = update_card_field_request(
        test_client,
        user_uid,
        sentence_collection_id,
        sentence_card_id,
        field_name,
        field_value,
    )

    assert card_update.status_code == 200

    card = get_tango_card_request(
        test_client,
        user_uid,
        sentence_collection_id,
        sentence_card_id,
    )

    assert card.status_code == 200

    card_response = SentenceCardModel(**card.json())

    assert card_response.model_dump()[field_name] == field_value


def test_add_tango_card(test_client, user_uid):
    collection_to_add_response = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", False
    )

    assert collection_to_add_response.status_code == 200

    collection_to_add_to = CardContainerCreatedResponse(
        **collection_to_add_response.json()
    )

    timestamp = int(time())

    card_to_add = add_tango_card_to_collection_request(
        test_client,
        user_uid,
        collection_to_add_to.container_id,
        CreateTangoModel(
            english="english",
            japanese="japanese",
            pronunciation="pronunciation",
            example_sentence_english="example_sentence_english",
            example_sentence_japanese="example_sentence_japanese",
            url="url",
        ),
    )

    assert card_to_add.status_code == 200

    card_to_add_created = TangoCardModel(**card_to_add.json())

    assert card_to_add_created.english == "english"
    assert card_to_add_created.japanese == "japanese"
    assert card_to_add_created.pronunciation == "pronunciation"
    assert card_to_add_created.example_sentence_english == "example_sentence_english"
    assert card_to_add_created.example_sentence_japanese == "example_sentence_japanese"
    assert card_to_add_created.url == "url"
    assert timestamp <= card_to_add_created.due_timestamp <= timestamp + 86400
    assert not card_to_add_created.known
    assert card_to_add_created.miss_count == 0


def test_add_tango_card_collection_doesnt_exist(test_client, user_uid):
    card_to_add = add_tango_card_to_collection_request(
        test_client,
        user_uid,
        "FUUUAAAACKK",
        CreateTangoModel(
            english="english",
            japanese="japanese",
            pronunciation="pronunciation",
            example_sentence_english="example_sentence_english",
            example_sentence_japanese="example_sentence_japanese",
            url="url",
        ),
    )

    assert card_to_add.status_code == 404


def test_add_sentence_card(test_client, user_uid, sentence_collection_id):
    add_card_response = add_sentence_card_to_collection_request(
        test_client,
        user_uid,
        sentence_collection_id,
        CreateSentenceModel(
            english="english",
            japanese="japanese",
            explanation="explanation",
            url="url",
        ),
    )

    assert add_card_response.status_code == 200

    card_response = SentenceCardModel(**add_card_response.json())

    assert card_response.english == "english"
    assert card_response.japanese == "japanese"
    assert card_response.explanation == "explanation"
    assert card_response.url == "url"


def test_add_sentence_card_collection_doesnt_exist(test_client, user_uid):
    add_card_response = add_sentence_card_to_collection_request(
        test_client,
        user_uid,
        "FUUUAAAACKK",
        CreateSentenceModel(
            english="english",
            japanese="japanese",
            explanation="explanation",
            url="url",
        ),
    )

    assert add_card_response.status_code == 404


def test_delete_card_collection(test_client, user_uid):
    card_collection = create_card_collection_with_name_request(
        test_client, user_uid, "crazy_baby", False
    )

    assert card_collection.status_code == 200

    card_collection_response = CardContainerCreatedResponse(**card_collection.json())

    delete_card_collection_response = delete_card_collection_request(
        test_client, user_uid, card_collection_response.container_id
    )

    assert delete_card_collection_response.status_code == 200


def test_delete_card_collection_collection_doesnt_exist(test_client, user_uid):
    delete_card_collection_response = delete_card_collection_request(
        test_client, user_uid, "FUUUAAAACKK"
    )

    # 存在していなくても、200を返す
    assert delete_card_collection_response.status_code == 200


def test_delete_card(test_client, user_uid, tango_collection_id):
    card = add_tango_card_to_collection_request(
        test_client,
        user_uid,
        tango_collection_id,
        CreateTangoModel(
            english="english",
            japanese="japanese",
            pronunciation="pronunciation",
            example_sentence_english="example_sentence_english",
            example_sentence_japanese="example_sentence_japanese",
            url="url",
        ),
    )

    assert card.status_code == 200

    card_response = TangoCardModel(**card.json())

    delete_card_response = delete_card_request(
        test_client, user_uid, tango_collection_id, card_response.card_id
    )

    assert delete_card_response.status_code == 200


def test_get_all_cards_in_tango_collection(test_client, user_uid, tango_collection_id):
    # empty
    all_cards_response = get_all_cards_in_collection_request(
        test_client, user_uid, tango_collection_id
    )

    assert all_cards_response.status_code == 200

    all_cards_response_json = all_cards_response.json()

    assert len(all_cards_response_json) == 0

    # add card
    card_response = add_tango_card_to_collection_request(
        test_client,
        user_uid,
        tango_collection_id,
        CreateTangoModel(
            english="english",
            japanese="japanese",
            pronunciation="pronunciation",
            example_sentence_english="example_sentence_english",
            example_sentence_japanese="example_sentence_japanese",
            url="url",
        ),
    )

    assert card_response.status_code == 200

    all_cards_response = get_all_cards_in_collection_request(
        test_client, user_uid, tango_collection_id
    )

    assert all_cards_response.status_code == 200

    all_cards = []

    for card_json in all_cards_response.json():
        all_cards.append(TangoCardModel(**card_json))

    assert len(all_cards) == 1


def test_get_all_cards_in_sentence_collection(
    test_client, user_uid, sentence_collection_id
):
    # empty
    all_cards_response = get_all_cards_in_collection_request(
        test_client, user_uid, sentence_collection_id
    )

    assert all_cards_response.status_code == 200

    all_cards_response_json = all_cards_response.json()

    assert len(all_cards_response_json) == 0

    # add card
    card_response = add_sentence_card_to_collection_request(
        test_client,
        user_uid,
        sentence_collection_id,
        CreateSentenceModel(
            english="english",
            japanese="japanese",
            explanation="explanation",
            url="url",
        ),
    )

    assert card_response.status_code == 200

    all_cards_response = get_all_cards_in_collection_request(
        test_client, user_uid, sentence_collection_id
    )

    assert all_cards_response.status_code == 200

    all_cards = []

    for card_json in all_cards_response.json():
        all_cards.append(SentenceCardModel(**card_json))

    assert len(all_cards) == 1
