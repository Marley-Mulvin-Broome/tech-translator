from pydantic import BaseModel
from app.models.cardbase import CardBase


class SentenceCardModel(CardBase):
    explanation: str


class CreateSentenceModel(BaseModel):
    english: str
    japanese: str
    explanation: str
    url: str
