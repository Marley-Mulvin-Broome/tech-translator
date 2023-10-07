from os import environ

from firebase_admin import auth as firebase_auth


def login_email_pass(pyrebase_login_auth, email: str, password: str) -> [str, str]:
    """
    ログインAPI
    """
    if environ.get("OMNIA_ENV") == "emulator":
        # 本番環境ではない場合、Firebase Authのエミュレーターを使用するので、pyrebaseが使えない
        user = firebase_auth.get_user_by_email(email)

        return firebase_auth.create_custom_token(user.uid).decode("utf-8"), ""

    result = pyrebase_login_auth.sign_in_with_email_and_password(
        email=email, password=password
    )

    return result["idToken"], result["refreshToken"]
