from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from app.models.speak import Voice, SpeakRequest
from app.dependencies import TTSDep, validate_token
from os import remove as remove_file
from app.internal.util import generate_random_file_name

speak_router = APIRouter(
    prefix="/speak", tags=["speak"], dependencies=[Depends(validate_token)]
)

speaker_to_file_dict = {
    Voice.hiroyuki: "speakers/hiroyuki_en.wav",
    Voice.elon: "speakers/elon_en.wav",
}


@speak_router.post("/", response_class=FileResponse)
def speak_text(request: SpeakRequest, tts: TTSDep, background_tasks: BackgroundTasks):
    file_name = generate_random_file_name("wav")

    speaker_file = speaker_to_file_dict.get(request.voice, None)

    if not speaker_file:
        raise HTTPException(status_code=400, detail="指定された話者は存在しません")

    tts.tts_to_file(
        text=request.text, language="en", speaker_wav=speaker_file, file_path=file_name
    )
    background_tasks.add_task(remove_file, file_name)

    return file_name
