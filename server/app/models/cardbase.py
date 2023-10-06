from pydantic import BaseModel
from app.internal.util import get_current_timestamp


class CardMetaData(BaseModel):
    due_timestamp: int
    known: bool
    created_timestamp: int
    miss_count: int


class CardBase(BaseModel):
    card_id: str
    english: str
    japanese: str
    url: str
    meta_data: CardMetaData

    @staticmethod
    def construct_meta_data() -> CardMetaData:
        return CardMetaData(
            due_timestamp=get_current_timestamp(),
            known=False,
            created_timestamp=get_current_timestamp(),
            miss_count=0,
        )


class CardContainer(BaseModel):
    container_id: str
    owner_uid: str
    is_sentence: bool
    name: str


class CardContainerCreatedResponse(BaseModel):
    container_id: str
    owner_uid: str
    is_sentence: bool
