from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from app.models.speak import SpeakRequest
from app.internal.speak_tts import generate_tts_to_file
from app.dependencies import validate_token
from os import remove as remove_file
from app.internal.util import generate_random_file_name

speak_router = APIRouter(
    prefix="/speak", tags=["speak"], dependencies=[Depends(validate_token)]
)


@speak_router.post("/", response_class=FileResponse)
def speak_text(request: SpeakRequest, background_tasks: BackgroundTasks):
    file_name = generate_random_file_name("wav")

    generate_tts_to_file(request.text, file_name)

    background_tasks.add_task(remove_file, file_name)

    return file_name
