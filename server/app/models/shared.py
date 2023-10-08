from pydantic import BaseModel


class OkResponse(BaseModel):
    message: str = "OK"
