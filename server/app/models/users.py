from pydantic import BaseModel


class UserSignupResponse(BaseModel):
    email: str
    uid: str


class UserLoginResponse(BaseModel):
    token: str
