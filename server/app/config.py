from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Tech Translator"
    api_key: str = ""
    auth_domain: str = ""
    project_id: str = ""
    messaging_sender_id: str = ""
    app_id: str = ""
    measurement_id: str = ""
    database_url: str = ""
    storage_bucket: str = ""
    service_account: str = "service_account.json"

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()

firebase_config = {
    "apiKey": settings.api_key,
    "authDomain": settings.auth_domain,
    "projectId": settings.project_id,
    "messagingSenderId": settings.messaging_sender_id,
    "appId": settings.app_id,
    "databaseURL": settings.database_url,
    "storageBucket": settings.storage_bucket,
    "measurementId": settings.measurement_id,
}