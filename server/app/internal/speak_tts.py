from gtts import gTTS
from app.internal.util import generate_random_file_name


def generate_tts_to_file(text: str, file_name: str) -> str:
    tts = gTTS(text=text, lang="en")
    tts.save(file_name)

    return file_name
