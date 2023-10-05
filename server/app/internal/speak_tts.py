TTS_MODEL_NAME = "tts_models/multilingual/multi-dataset/your_tts"


def init_tts():
    from torch.cuda import is_available
    from TTS.api import TTS

    device = "cuda" if is_available() else "cpu"

    tts = TTS(model_name=TTS_MODEL_NAME, progress_bar=False).to(device)

    return tts
