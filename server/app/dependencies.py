from fastapi import Header, Depends, HTTPException
from typing import Annotated
from pyrebase.pyrebase import initialize_app as firebase_initialize_app
from pyrebase.pyrebase import Auth
from firebase_admin import auth as firebase, firestore
from firebase_admin._auth_client import Client
from app.config import firebase_config
from functools import lru_cache
from app.internal.dictionary_reader import read_dictionary

# from app.internal.speak_tts import init_tts
# from TTS.api import TTS


@lru_cache()
def get_dictionary():
    return read_dictionary("jisho.json")


# @lru_cache()
# def get_tts():
#     return init_tts()


@lru_cache()
def get_firebase_auth():
    fb_app = firebase_initialize_app(firebase_config)
    return fb_app.auth()


@lru_cache()
def get_firestore() -> Client:
    return firestore.client()


async def email_password_param(email: str, password: str = Header()):
    """
    パスワードをヘッダーで受け取る
    """

    return {"email": email, "password": password}


async def validate_token(x_token: str = Header()) -> dict:
    """
    トークンをヘッダーで受け取り、検証する
    """

    try:
        user = firebase.verify_id_token(x_token)

        return {"token": x_token, "user": user}
    except ValueError:
        raise HTTPException(status_code=401, detail="トークンが不正です")
    except firebase.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています")
    except firebase.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="トークンが不正です")
    except firebase.UserDisabledError:
        raise HTTPException(status_code=401, detail="無効なユーザーです")


DictionaryDep = Annotated[dict, Depends(get_dictionary)]
ValidateTokenDep = Annotated[dict, Depends(validate_token)]
EmailPasswordDep = Annotated[dict, Depends(email_password_param)]
FirebaseAuthDep = Annotated[Auth, Depends(get_firebase_auth)]
# TTSDep = Annotated[TTS, Depends(get_tts)]
