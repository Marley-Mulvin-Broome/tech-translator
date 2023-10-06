from pydantic import BaseModel


class TangoCardModel(BaseModel):
    uid: str
    target_word: str
    translation: str
    due_timestamp: int
    ease_factor: float


class TangoChouModel(BaseModel):
    uid: str
    name: str
    words: list[TangoCardModel]
