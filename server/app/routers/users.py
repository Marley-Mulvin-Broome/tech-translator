"""
ユーザーに関するAPIを定義するモジュール
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from requests.exceptions import HTTPError
from app.dependencies import (
    EmailPasswordDep,
    FirebaseAuthDep,
    get_firestore,
    ValidateTokenDep,
    validate_token,
)
from app.models.users import UserSignupResponse, UserLoginResponse
from app.internal.cards_actions import card_collection_create
from app.internal.login import login_email_pass

from firebase_admin import auth as firebase_auth

user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.post("/signup")
def signup(
    email_pass: EmailPasswordDep,
    pyrebase_login_auth: FirebaseAuthDep,
    firestore=Depends(get_firestore),
) -> UserSignupResponse:
    """
    ユーザー登録API
    """
    try:
        email = email_pass["email"]
        password = email_pass["password"]

        user = firebase_auth.create_user(email=email, password=password)

        firestore.collection("users").document(user.uid).set(
            {
                "email": email,
            }
        )

        user_token, user_refresh_token = login_email_pass(
            pyrebase_login_auth, email, password
        )

        card_collection_create("単語帳", user.uid, False, firestore)
        card_collection_create("文章帳", user.uid, True, firestore)

        return UserSignupResponse(
            uid=user.uid,
            email=user.email,
            token=user_token,
            refresh_token=user_refresh_token,
        )

    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=409, detail="メールアドレスが既に登録されています")
    except ValueError:
        raise HTTPException(status_code=400, detail="メールアドレスまたはパスワードが不正です")


@user_router.post("/login")
def login(
    email_pass: EmailPasswordDep, pyrebase_login_auth: FirebaseAuthDep
) -> UserLoginResponse:
    """
    ログインAPI
    """
    try:
        token, refresh_token = login_email_pass(
            pyrebase_login_auth, email_pass["email"], email_pass["password"]
        )

        return UserLoginResponse(token=token, refresh_token=refresh_token)
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログインに失敗しました")


@user_router.post("/refresh")
def refresh(
    firebase_login_auth: FirebaseAuthDep, x_refresh_token: str = Header()
) -> UserLoginResponse:
    """
    ログインAPI
    """
    try:
        user = firebase_login_auth.refresh(x_refresh_token)

        return UserLoginResponse(
            token=user["idToken"], refresh_token=user["refreshToken"]
        )
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログインに失敗しました")


@user_router.post("/signout")
def signout(valid_token: ValidateTokenDep):
    """
    ログインAPI
    """
    try:
        uid = valid_token["user"]["uid"]

        firebase_auth.revoke_refresh_tokens(uid)

        return "OK"
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログアウトに失敗しました")


@user_router.delete("/delete")
def delete(valid_token: ValidateTokenDep):
    """
    ログインAPI
    """
    try:
        uid = valid_token["user"]["uid"]

        firebase_auth.delete_user(uid)

        return "OK"
    except HTTPError:
        raise HTTPException(status_code=400, detail="ユーザー削除に失敗しました")


@user_router.get("/ping", dependencies=[Depends(validate_token)])
def ping():
    return "OK"
