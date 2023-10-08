from pydantic import BaseModel
from app.models.cardbase import CardBase


class TangoCardModel(CardBase):
    pronunciation: str
    example_sentence_english: str
    example_sentence_japanese: str


class CreateTangoModel(BaseModel):
    english: str
    japanese: str
    pronunciation: str
    example_sentence_english: str
    example_sentence_japanese: str
    url: str
