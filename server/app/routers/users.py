"""
ユーザーに関するAPIを定義するモジュール
"""

from fastapi import APIRouter, HTTPException, Header
from requests.exceptions import HTTPError
from app.dependencies import EmailPasswordDep, FirebaseAuthDep
from app.models import UserSignupResponse, UserLoginResponse


from firebase_admin import auth as firebase_auth

user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.post("/signup")
def signup(email_pass: EmailPasswordDep) -> UserSignupResponse:
    """
    ユーザー登録API
    """
    try:
        user = firebase_auth.create_user(
            email=email_pass["email"], password=email_pass["password"]
        )

        return UserSignupResponse(
            uid=user.uid,
            email=user.email,
        )

    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=409, detail="メールアドレスが既に登録されています")
    except ValueError:
        raise HTTPException(status_code=400, detail="メールアドレスまたはパスワードが不正です")
    except Exception as e:
        raise HTTPException(status_code=400, detail="ユーザー登録に失敗しました\n" + str(e))


@user_router.post("/login")
def login(
    email_pass: EmailPasswordDep, firebase_login_auth: FirebaseAuthDep
) -> UserLoginResponse:
    """
    ログインAPI
    """
    try:
        user = firebase_login_auth.sign_in_with_email_and_password(
            email=email_pass["email"], password=email_pass["password"]
        )
        return UserLoginResponse(token=user["idToken"])
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログインに失敗しました")


@user_router.post("/ping")
def ping(id_token: str = Header()):
    """
    ログインAPI
    """
    user = firebase_auth.verify_id_token(id_token)

    return user.get("uid")
