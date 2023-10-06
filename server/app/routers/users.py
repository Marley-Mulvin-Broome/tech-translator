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
)
from app.models.users import UserSignupResponse, UserLoginResponse
from app.internal.cards_actions import card_collection_create

from firebase_admin import auth as firebase_auth

user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.post("/signup")
def signup(
    email_pass: EmailPasswordDep,
    firebase_login_auth: FirebaseAuthDep,
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

        user_login = firebase_login_auth.sign_in_with_email_and_password(
            email=email, password=password
        )

        card_collection_create("単語帳", user.uid, False, firestore)
        card_collection_create("文章帳", user.uid, True, firestore)

        return UserSignupResponse(
            uid=user.uid,
            email=user.email,
            token=user_login["idToken"],
            refresh_token=user_login["refreshToken"],
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

        return UserLoginResponse(
            token=user["idToken"], refresh_token=user["refreshToken"]
        )
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログインに失敗しました")


@user_router.post("/refresh")
def refresh(
    firebase_login_auth: FirebaseAuthDep, refresh_token: str = Header()
) -> UserLoginResponse:
    """
    ログインAPI
    """
    try:
        user = firebase_login_auth.refresh(refresh_token)

        return UserLoginResponse(
            token=user["idToken"], refresh_token=user["refreshToken"]
        )
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログインに失敗しました")


@user_router.post("/signout")
def signout(validate_token: ValidateTokenDep):
    """
    ログインAPI
    """
    try:
        uid = validate_token["user"]["uid"]

        firebase_auth.revoke_refresh_tokens(uid)

        return "OK"
    except HTTPError:
        raise HTTPException(status_code=400, detail="ログアウトに失敗しました")


@user_router.delete("/delete")
def delete(token_validation: ValidateTokenDep):
    """
    ログインAPI
    """
    try:
        uid = token_validation["user"]["uid"]

        firebase_auth.delete_user(uid)

        return "OK"
    except HTTPError:
        raise HTTPException(status_code=400, detail="ユーザー削除に失敗しました")
