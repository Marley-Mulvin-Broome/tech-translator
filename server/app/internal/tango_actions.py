from app.models.tango import TangoCardModel, TangoChouModel
from uuid import uuid4


def create_tango_chou(tango_chou_name: str, uid: str, firestore) -> str:
    """
    単語帳を作成する
    """
    tango_chou_id = str(uuid4())

    firestore.collection("users").document(uid).collection("tango_chous").document(
        tango_chou_id
    ).set(
        {
            "uid": uid,
            "id": tango_chou_id,
            "name": tango_chou_name,
            "words": [],
        }
    )

    return tango_chou_id


def tango_chou_words_set(
    tango_chou_id: str, tango_chou: TangoChouModel, uid: str, firestore
):
    """
    単語帳を更新する
    """
    firestore.collection("users").document(uid).collection("tango_chous").document(
        tango_chou_id
    ).set(
        {
            "words": tango_chou.words,
        }
    )


def add_word_to_tango_chou(
    tango_chou_id: str, tango: TangoCardModel, uid: str, firestore
) -> str:
    """
    単語帳に単語を追加する
    """
    tango_id = str(uuid4())

    tango_chou = get_tango_chou(tango_chou_id, uid, firestore)

    tango_chou.words.append(tango)

    tango_chou_words_set(tango_chou_id, tango_chou, uid, firestore)

    return tango_id


def remove_word_from_tango_chou(tango_chou_id: str, tango_id: str, uid: str, firestore):
    """
    単語帳から単語を削除する
    """
    tango_chou = get_tango_chou(tango_chou_id, uid, firestore)

    tango_chou.words = [tango for tango in tango_chou.words if tango.uid != tango_id]

    tango_chou_words_set(tango_chou_id, tango_chou, uid, firestore)


def get_tango_chou(tango_chou_id: str, uid: str, firestore) -> TangoChouModel:
    """
    単語帳を取得する
    """
    tango_chou_document = (
        firestore.collection("users")
        .document(uid)
        .collection("tango_chous")
        .document(tango_chou_id)
    )

    tango_chou_dict = tango_chou_document.get().to_dict()

    return TangoChouModel(
        uid=tango_chou_dict["uid"],
        name=tango_chou_dict["name"],
        words=tango_chou_dict["words"],
    )


def get_all_tango_chou(uid: str, firestore) -> list[TangoChouModel]:
    """
    全ての単語帳を取得する
    """
    user_tango_document = (
        firestore.collection("users").document(uid).collection("tango_chous").stream()
    )

    tango_chous: list[TangoChouModel] = []

    for tango_chou in user_tango_document:
        as_dict = tango_chou.to_dict()

        tango_chous.append(
            TangoChouModel(
                uid=as_dict["uid"],
                name=as_dict["name"],
                words=as_dict["words"],
            )
        )

    return tango_chous


def merge_tango(old_db: list[TangoCardModel], recent_db: list[TangoCardModel]):
    """
    旧DBと新DBをマージする
    """
    old_db_dict = {tango.target_word: tango for tango in old_db}

    for tango in recent_db:
        if tango.target_word in old_db_dict:
            # 旧DBに存在する単語は、旧DBのデータを優先する
            tango.due_timestamp = old_db_dict[tango.target_word].due_timestamp
            tango.ease_factor = old_db_dict[tango.target_word].ease_factor

    return recent_db
