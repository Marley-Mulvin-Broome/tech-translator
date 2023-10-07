from fastapi import APIRouter, Depends
from app.models.cardbase import (
    CardContainer,
    CardContainerCreatedResponse,
    CardContainerList,
)
from app.models.tango import CreateTangoModel, TangoCardModel
from app.models.sentence import CreateSentenceModel, SentenceCardModel
from app.dependencies import ValidateTokenDep, get_firestore
from app.internal.cards_actions import (
    card_collections_fetch_all,
    card_collection_get,
    card_collection_create,
    card_collection_set_field,
    card_set_field,
    card_collection_delete,
    card_collection_delete_card,
    card_collection_add_card,
    card_collection_get_card,
    card_collection_set_card,
    construct_tango_card,
    construct_sentence_card,
)

from enum import Enum


class SettableCardContainerFields(str, Enum):
    name = "name"


class SettableCardFields(str, Enum):
    name = "name"
    is_sentence = "is_sentence"
    english = "english"
    japanese = "japanese"
    pronunciation = "pronunciation"
    example_sentence_english = "example_sentence_english"
    example_sentence_japanese = "example_sentence_japanese"
    explanation = "explanation"
    url = "url"
    known = "known"


class SettableCardMetaData(str, Enum):
    due_timestamp = "due_timestamp"
    ease_factor = "ease_factor"
    miss_count = "miss_count"
    url = "url"


cards_router = APIRouter(prefix="/cards", tags=["cards"])


@cards_router.get("/")
def get_all_card_collections(
    validated_token: ValidateTokenDep, firestore=Depends(get_firestore)
) -> CardContainerList:
    uid = validated_token["user"]["uid"]

    return CardContainerList(
        containers=card_collections_fetch_all(uid, firestore),
    )


@cards_router.get("/{card_collection_id}")
def get_collection_with_id(
    card_collection_id: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> CardContainer:
    uid = validate_token["user"].get("uid", None)

    return card_collection_get(card_collection_id, uid, firestore)


@cards_router.post("/create_card_collection")
def create_card_collection_with_name(
    collection_name: str,
    validate_token: ValidateTokenDep,
    is_sentence: bool = False,
    firestore=Depends(get_firestore),
) -> CardContainerCreatedResponse:
    uid = validate_token["user"]["uid"]

    card_collection_id = card_collection_create(
        collection_name, uid, is_sentence, firestore
    )

    return CardContainerCreatedResponse(
        container_id=card_collection_id,
        owner_uid=uid,
        is_sentence=is_sentence,
    )


@cards_router.get("/sentence_card_get/{card_collection_id}/{card_id}")
def get_sentence_card(
    card_collection_id: str,
    card_id: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> SentenceCardModel:
    uid = validate_token["user"]["uid"]

    return card_collection_get_card(card_collection_id, card_id, uid, firestore)


@cards_router.get("/tango_card_get/{card_collection_id}/{card_id}")
def get_tango_card(
    card_collection_id: str,
    card_id: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> TangoCardModel:
    uid = validate_token["user"]["uid"]

    return card_collection_get_card(card_collection_id, card_id, uid, firestore)


@cards_router.patch("/tango_card_set/{card_collection_id}")
def set_tango_card(
    card_collection_id: str,
    new_card: TangoCardModel,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> TangoCardModel:
    uid = validate_token["user"]["uid"]

    return card_collection_set_card(card_collection_id, new_card, uid, firestore)


@cards_router.patch("/sentence_card_set/{card_collection_id}")
def set_sentence_card(
    card_collection_id: str,
    new_card: SentenceCardModel,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> SentenceCardModel:
    uid = validate_token["user"]["uid"]

    return card_collection_set_card(card_collection_id, new_card, uid, firestore)


@cards_router.patch("/card_collection_update_field/{card_collection_id}")
def update_card_collection_field(
    card_collection_id: str,
    field_name: SettableCardContainerFields,
    field_value: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> str:
    uid = validate_token["user"]["uid"]

    card_collection_set_field(
        card_collection_id, field_name, field_value, uid, firestore
    )

    return "OK"


@cards_router.patch("/card_update_field/{card_collection_id}/{card_id}")
def update_card_field(
    card_collection_id: str,
    card_id: str,
    field_name: SettableCardFields,
    field_value: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> str:
    uid = validate_token["user"]["uid"]

    card_set_field(card_collection_id, card_id, field_name, field_value, uid, firestore)

    return "OK"


@cards_router.post("/add_tango_card_to_collection/{card_collection_id}")
def add_tango_card_to_collection(
    card_collection_id: str,
    card: CreateTangoModel,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> TangoCardModel:
    uid = validate_token["user"].get("uid", None)

    tango_card = construct_tango_card(card)
    card_collection_add_card(card_collection_id, tango_card, uid, firestore)

    return tango_card


@cards_router.post("/add_sentence_card_to_collection/{card_collection_id}")
def add_sentence_card_to_collection(
    card_collection_id: str,
    card: CreateSentenceModel,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> SentenceCardModel:
    uid = validate_token["user"].get("uid", None)

    sentence_card = construct_sentence_card(card)
    card_collection_add_card(card_collection_id, sentence_card, uid, firestore)

    return sentence_card


@cards_router.delete("/delete_card_collection/{card_collection_id}")
def delete_card_collection(
    card_collection_id: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> str:
    uid = validate_token["user"].get("uid", None)

    card_collection_delete(card_collection_id, uid, firestore)

    return "OK"


@cards_router.delete("/delete_card/{card_collection_id}/{card_id}")
def delete_card(
    card_collection_id: str,
    card_id: str,
    validate_token: ValidateTokenDep,
    firestore=Depends(get_firestore),
) -> str:
    uid = validate_token["user"].get("uid", None)

    card_collection_delete_card(card_collection_id, card_id, uid, firestore)

    return "OK"
