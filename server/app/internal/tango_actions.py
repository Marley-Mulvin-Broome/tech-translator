from app.models.tango import TangoCardModel, TangoChouModel, TangoChouWithWordsModel
from uuid import uuid4

def create_tango_chou(tango_chou_name: str, uid: str, firestore) -> str:
    """
    単語帳を作成する
    """
    tango_chou_id = str(uuid4())

    firestore.collection("users").document(uid).collection("tango_chous").document(tango_chou_id).set(
        {
            "uid": tango_chou_id,
            "name": tango_chou_name,
        }
    )

    return tango_chou_id

def add_word_to_tango_chou(tango_chou_id: str, tango: TangoCardModel, uid: str, firestore) -> str:
    """
    単語帳に単語を追加する
    """
    tango_id = str(uuid4())

    firestore.collection("users").document(uid).collection("tango_chous").document(tango_chou_id).collection("words").add(
        {
            "uid": tango_id,
            "target_word": tango.target_word,
            "translation": tango.translation,
            "due_timestamp": tango.due_timestamp,
            "ease_factor": tango.ease_factor,
        }
    )

    return tango_id

def remove_word_from_tango_chou(tango_chou_id: str, tango_id: str, uid: str, firestore):
    """
    単語帳から単語を削除する
    """
    firestore.collection("users").document(uid).collection("tango_chous").document(tango_chou_id).collection("words").document(tango_id).delete()

def get_tango_chou(tango_chou_id: str, uid: str, firestore) -> TangoChouWithWordsModel:
    """
    単語帳を取得する
    """
    tango_chou_document = firestore.collection("users").document(uid).collection("tango_chous").document(tango_chou_id)

    tango_chou_dict = tango_chou_document.get().to_dict()

    tangou_chou = TangoChouWithWordsModel(
        uid=tango_chou_dict["uid"],
        name=tango_chou_dict["name"],
        words=[],
    )

    for tango in tango_chou_document.collection("words").stream():
        as_dict = tango.to_dict()

        tangou_chou.words.append(TangoCardModel(
            uid=as_dict["uid"],
            target_word=as_dict["target_word"],
            translation=as_dict["translation"],
            due_timestamp=as_dict["due_timestamp"],
            ease_factor=as_dict["ease_factor"],
        ))

    return tango_chou_document

def get_all_tango_chou(uid: str, firestore) -> list[TangoChouModel]:
    """
    全ての単語帳を取得する
    """
    user_tango_document = firestore.collection("users").document(uid).collection("tango_chous").stream()

    tango_chous: list[TangoChouModel] = []

    for tango_chou in user_tango_document:
        as_dict = tango_chou.to_dict()

        tango_chous.append(TangoChouModel(
            uid=as_dict["uid"],
            name=as_dict["name"],
        ))

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

