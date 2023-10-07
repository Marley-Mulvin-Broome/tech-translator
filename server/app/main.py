from fastapi import FastAPI
from app.routers.users import user_router
from app.routers.cards import cards_router
from app.routers.jisho import jisho_router
from app.routers.speak import speak_router
from app.routers.rss import rss_router

from app.config import get_settings, firebase_config

from firebase_admin import initialize_app as firebase_initialize_app, credentials

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


# ルーターを登録する
app.include_router(user_router)
app.include_router(cards_router)
app.include_router(jisho_router)
app.include_router(speak_router)
app.include_router(rss_router)


# Firebaseの初期化
cred = credentials.Certificate(settings.service_account)
firebase_app = firebase_initialize_app(cred, options=firebase_config)
