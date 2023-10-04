from fastapi import FastAPI
from app.routers import user_router
from app.config import get_settings, firebase_config

from firebase_admin import initialize_app as firebase_initialize_app, credentials


app = FastAPI()

app.include_router(user_router)

settings = get_settings()

cred = credentials.Certificate(settings.service_account)
firebase_app = firebase_initialize_app(cred, options=firebase_config)





