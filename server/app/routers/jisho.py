from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, FileResponse

from app.dependencies import DictionaryDep, validate_token

jisho_router = APIRouter(
    prefix="/jisho", tags=["jisho"], dependencies=[Depends(validate_token)]
)


@jisho_router.get("/")
def get_dictionary() -> FileResponse:
    return FileResponse("jisho.json")


@jisho_router.get("/{word}")
def get_word(word: str, dictionary: DictionaryDep) -> JSONResponse:
    word = {"translations": dictionary.get(word, [])}
    return JSONResponse(word)
