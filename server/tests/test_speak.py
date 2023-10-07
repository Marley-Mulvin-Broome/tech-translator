from app.models.speak import SpeakRequest
from tests.utility import speak_text_request


def test_speak_tts(test_client, user_uid):
    speak_request = SpeakRequest(text="Hello, world!")

    response = speak_text_request(
        test_client,
        user_uid,
        speak_request,
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/x-wav"
