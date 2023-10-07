from app.models.tango import TangoCardModel, CreateTangoModel
from app.models.cardbase import CardContainer, CardBase
from app.models.sentence import CreateSentenceModel, SentenceCardModel
from uuid import uuid4
from app.internal.util import get_current_timestamp
from fastapi import HTTPException

COLLECTION_CONTAINER_NAME = "collection_containers"


def card_collection_create(
    collection_name: str, uid: str, is_sentence: bool, firestore
) -> str:
    """
    単語帳を作成する
    """
    collection_id = str(uuid4())

    tango_chou_model = CardContainer(
        container_id=collection_id,
        owner_uid=uid,
        is_sentence=is_sentence,
        name=collection_name,
    )

    collection_document = (
        firestore.collection("users")
        .document(uid)
        .collection(COLLECTION_CONTAINER_NAME)
        .document(collection_id)
    )

    collection_document.set(tango_chou_model.model_dump(mode="json"))

    return collection_id


def card_collections_fetch_all(uid: str, firestore) -> list[CardContainer]:
    """
    ユーザーの全ての単語帳を取得する
    """
    user_containers = (
        firestore.collection("users")
        .document(uid)
        .collection(COLLECTION_CONTAINER_NAME)
        .stream()
    )

    containers: list[CardContainer] = []

    for container in user_containers:
        as_dict = container.to_dict()

        containers.append(
            CardContainer(
                container_id=as_dict["container_id"],
                owner_uid=as_dict["owner_uid"],
                is_sentence=as_dict["is_sentence"],
                name=as_dict["name"],
            )
        )

    return containers


def card_collection_get_all_cards(
    collection_id: str, uid: str, firestore
) -> list[TangoCardModel | SentenceCardModel]:
    cards_stream = (
        firestore.collection("users")
        .document(uid)
        .collection(COLLECTION_CONTAINER_NAME)
        .document(collection_id)
        .collection("cards")
        .stream()
    )

    return [card.to_dict() for card in cards_stream]


def card_collection_set_cards(
    collection_id: str, new_cards: list[CardBase], uid: str, firestore
):
    """
    単語帳の単語を更新する
    """
    batch = firestore.batch()

    for new_card in new_cards:
        batch.set(
            firestore.collection("users")
            .document(uid)
            .collection(COLLECTION_CONTAINER_NAME)
            .document(collection_id)
            .collection("cards")
            .document(new_card.card_id),
            new_card.model_dump(mode="json"),
        )

    batch.commit()


def card_collection_set_field(
    collection_id: str, field: str, value, uid: str, firestore
):
    """
    単語帳のフィールドを更新する
    """
    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).update(
        {
            field: value,
        }
    )


def card_collection_delete(collection_id: str, uid: str, firestore):
    """
    単語帳を削除する
    """
    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).delete()


def card_collection_get(collection_id: str, uid: str, firestore) -> CardContainer:
    """
    単語帳を取得する
    """
    collection_document = (
        firestore.collection("users")
        .document(uid)
        .collection(COLLECTION_CONTAINER_NAME)
        .document(collection_id)
    )

    container_dict = collection_document.get().to_dict()

    if container_dict is None:
        raise HTTPException(
            status_code=404,
            detail="指定された単語帳は存在しません",
        )

    return CardContainer(
        container_id=container_dict["container_id"],
        owner_uid=container_dict["owner_uid"],
        is_sentence=container_dict["is_sentence"],
        name=container_dict["name"],
    )


def card_collection_add_card(collection_id: str, card: CardBase, uid: str, firestore):
    """
    単語帳に単語を追加する
    """

    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).collection("cards").document(card.card_id).set(
        card.model_dump(mode="json")
    )


def card_collection_delete_card(collection_id: str, card_id: str, uid: str, firestore):
    """
    単語帳から単語を削除する
    """
    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).collection("cards").document(card_id).delete()


def card_collection_set_card(collection_id: str, card: CardBase, uid: str, firestore):
    """
    単語帳の単語を更新する
    """
    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).collection("cards").document(card.card_id).set(
        card.model_dump(mode="json")
    )


def card_collection_get_card(collection_id: str, card_id: str, uid: str, firestore):
    """
    単語帳から単語を取得する
    """
    card_document = (
        firestore.collection("users")
        .document(uid)
        .collection(COLLECTION_CONTAINER_NAME)
        .document(collection_id)
        .collection("cards")
        .document(card_id)
    )

    card_dict = card_document.get().to_dict()

    if card_dict["is_sentence"]:
        return SentenceCardModel(
            card_id=card_dict["card_id"],
            english=card_dict["english"],
            japanese=card_dict["japanese"],
            explanation=card_dict["explanation"],
            url=card_dict["url"],
            due_timestamp=card_dict["due_timestamp"],
            known=card_dict["known"],
            created_timestamp=card_dict["created_timestamp"],
            miss_count=card_dict["miss_count"],
        )
    else:
        return TangoCardModel(
            card_id=card_dict["card_id"],
            english=card_dict["english"],
            japanese=card_dict["japanese"],
            pronunciation=card_dict["pronunciation"],
            example_sentence=card_dict["example_sentence"],
            url=card_dict["url"],
            due_timestamp=card_dict["due_timestamp"],
            known=card_dict["known"],
            created_timestamp=card_dict["created_timestamp"],
            miss_count=card_dict["miss_count"],
        )


def card_set_field(
    collection_id: str, card_id, field_name: str, field_value: str, uid: str, firestore
):
    """
    単語帳のフィールドを更新する
    """
    firestore.collection("users").document(uid).collection(
        COLLECTION_CONTAINER_NAME
    ).document(collection_id).collection("cards").document(card_id).update(
        {
            field_name: field_value,
        }
    )


def construct_tango_card(tango_card_create_model: CreateTangoModel) -> TangoCardModel:
    """
    CreateTangoModelからTangoCardModelを構築する
    """
    return TangoCardModel(
        card_id=str(uuid4()),
        english=tango_card_create_model.english,
        japanese=tango_card_create_model.japanese,
        pronunciation=tango_card_create_model.pronunciation,
        example_sentence_english=tango_card_create_model.example_sentence_english,
        example_sentence_japanese=tango_card_create_model.example_sentence_japanese,
        url=tango_card_create_model.url,
        due_timestamp=get_current_timestamp(),
        known=False,
        created_timestamp=get_current_timestamp(),
        miss_count=0,
    )


def construct_sentence_card(
    sentence_card_create_model: CreateSentenceModel,
) -> SentenceCardModel:
    """
    CreateSentenceModelからSentenceCardModelを構築する
    """
    return SentenceCardModel(
        card_id=str(uuid4()),
        english=sentence_card_create_model.english,
        japanese=sentence_card_create_model.japanese,
        explanation=sentence_card_create_model.explanation,
        url=sentence_card_create_model.url,
        due_timestamp=get_current_timestamp(),
        known=False,
        created_timestamp=get_current_timestamp(),
        miss_count=0,
    )


# def remove_word_from_tango_chou(tango_chou_id: str, tango_id: str, uid: str, firestore):
#     """
#     単語帳から単語を削除する
#     """
#     tango_chou = get_tango_chou(tango_chou_id, uid, firestore)
#
#     tango_chou.words = [tango for tango in tango_chou.words if tango.uid != tango_id]
#
#     tango_chou_words_set(tango_chou_id, tango_chou, uid, firestore)
#
#
# def merge_tango(old_db: list[TangoCardModel], recent_db: list[TangoCardModel]):
#     """
#     旧DBと新DBをマージする
#     """
#     old_db_dict = {tango.target_word: tango for tango in old_db}
#
#     for tango in recent_db:
#         if tango.target_word in old_db_dict:
#             # 旧DBに存在する単語は、旧DBのデータを優先する
#             tango.due_timestamp = old_db_dict[tango.target_word].due_timestamp
#             tango.ease_factor = old_db_dict[tango.target_word].ease_factor
#
#     return recent_db
