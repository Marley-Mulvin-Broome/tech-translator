from pydantic import BaseModel

# from enum import Enum
#
#
# class Voice(str, Enum):
#     hiroyuki = "hiroyuki"
#     elon = "elon"
#
#
# class SpeakRequest(BaseModel):
#     text: str
#     voice: Voice


class SpeakRequest(BaseModel):
    text: str
