from pydantic import BaseModel


class UserSignupResponse(BaseModel):
    email: str
    uid: str
    token: str
    refresh_token: str


class UserLoginResponse(BaseModel):
    token: str
    refresh_token: str
