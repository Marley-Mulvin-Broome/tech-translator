from fastapi import APIRouter, HTTPException, Depends
from app.models.tango import TangoChouModel, TangoCardModel, TangoChouWithWordsModel
from app.dependencies import ValidateTokenDep, get_firestore
from app.internal.tango_actions import get_all_tango_chou, get_tango_chou, add_word_to_tango_chou

tango_router = APIRouter(prefix="/tango", tags=["tango"])


@tango_router.get("/")
def all_tango_chou(validate_token: ValidateTokenDep, firestore=Depends(get_firestore)) -> list[TangoChouModel]:
    uid = validate_token["user"].get("uid", None)

    return get_all_tango_chou(uid, firestore)

@tango_router.get("/{tango_chou_id}")
def get_tango_chou_id(tango_chou_id: str, validate_token: ValidateTokenDep, firestore=Depends(get_firestore)) -> TangoChouWithWordsModel:
    uid = validate_token["user"].get("uid", None)

    return get_tango_chou(tango_chou_id, uid, firestore)

@tango_router.post("/create_tango_chou")
def create_tango_chou(tango_chou_name: str, validate_token: ValidateTokenDep, firestore=Depends(get_firestore)) -> str:
    uid = validate_token["user"].get("uid", None)

    return create_tango_chou(tango_chou_name, uid, firestore)

@tango_router.post("/create_tango")
def create_tango(tango_chou_id: str, tango: TangoCardModel, validate_token: ValidateTokenDep, firestore=Depends(get_firestore)) -> str:
    uid = validate_token["user"].get("uid", None)

    return add_word_to_tango_chou(tango_chou_id, tango, uid, firestore)

@tango_router.patch("/sync_tango_chous")
def sync_all_tango_chous(tango_chou_list: list[TangoChouWithWordsModel], validate_token: ValidateTokenDep, firestore=Depends(get_firestore)):
    pass


# @tango_router.post("/")
# def sync_tango(tango_list: list[TangoCardModel], validate_token: ValidateTokenDep, firestore = Depends(get_firestore)) -> JSONResponse:
#     uid = validate_token["user"].get("uid", None)
#
#     if not uid:
#         raise HTTPException(status_code=400, detail="ユーザーIDが存在しません")
#
#     user_tango_document = firestore.collection("users").document(uid).collection("tango").get()

