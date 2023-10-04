from fastapi import Header, Depends
from typing import Annotated
from pyrebase.pyrebase import initialize_app as firebase_initialize_app
from pyrebase.pyrebase import Auth
from app.config import firebase_config
from functools import lru_cache


async def email_password_param(email: str, password: str = Header()):
    """
    パスワードをヘッダーで受け取る
    """

    return {
        "email": email,
        "password": password
    }

@lru_cache()
def get_firebase_auth():
    fb_app = firebase_initialize_app(firebase_config)
    return fb_app.auth()


EmailPasswordDep = Annotated[dict, Depends(email_password_param)]
FirebaseAuthDep = Annotated[Auth, Depends(get_firebase_auth)]