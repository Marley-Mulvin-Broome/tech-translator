from pydantic import BaseModel


class CardBase(BaseModel):
    card_id: str
    english: str
    japanese: str
    url: str
    due_timestamp: int
    known: bool
    created_timestamp: int
    miss_count: int
    is_sentence: bool


class CardContainer(BaseModel):
    container_id: str
    owner_uid: str
    is_sentence: bool
    name: str


class CardContainerList(BaseModel):
    containers: list[CardContainer]


class CardContainerCreatedResponse(BaseModel):
    container_id: str
    owner_uid: str
    is_sentence: bool
