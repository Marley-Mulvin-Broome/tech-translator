from fastapi import APIRouter, Depends, HTTPException
from app.models.cardbase import CardContainer, CardContainerCreatedResponse
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
) -> list[CardContainer]:
    uid = validated_token["user"].get("uid", None)

    return card_collections_fetch_all(uid, firestore)


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


# @tango_router.post("/create_tango")
# def create_tango(
#     tango_chou_id: str,
#     tango: TangoCardModel,
#     validate_token: ValidateTokenDep,
#     firestore=Depends(get_firestore),
# ) -> JSONResponse:
#     uid = validate_token["user"].get("uid", None)
#
#     try:
#         return JSONResponse(
#             content={
#                 "tango_id": add_word_to_tango_chou(
#                     tango_chou_id, tango, uid, firestore
#                 ),
#             }
#         )
#     except Exception as e:
#         return JSONResponse(
#             content={
#                 "error": str(e),
#             },
#             status_code=400,
#         )
#
#
# @tango_router.patch("/sync_tango_chous")
# def sync_all_tango_chous(
#     tango_chou_list: list[TangoChouModel],
#     validate_token: ValidateTokenDep,
#     firestore=Depends(get_firestore),
# ):
#     pass


# @tango_router.post("/")
# def sync_tango(tango_list: list[TangoCardModel], validate_token: ValidateTokenDep, firestore = Depends(get_firestore)) -> JSONResponse:
#     uid = validate_token["user"].get("uid", None)
#
#     if not uid:
#         raise HTTPException(status_code=400, detail="ユーザーIDが存在しません")
#
#     user_tango_document = firestore.collection("users").document(uid).collection("tango").get()
